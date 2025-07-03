from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse, Response  # Add this line
import aiohttp
from py_eureka_client import eureka_client
from config.settings import Settings
import logging
import random
import time
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from collections import defaultdict
import json
from urllib.parse import urlparse,  parse_qs, urlencode
from proxy.security import (

    verify_token,
)
# Set up logging
logger = logging.getLogger(__name__)
router = APIRouter()
settings = Settings()

# Configuration
REQUEST_TIMEOUT = 120  # seconds
PROXY_RESERVED_PARAMS = {'lb_strategy'}  # Parameters the proxy uses internally

# Public endpoints that don't require authentication
PUBLIC_ENDPOINTS = {
    ("USER-SERVICE", "api/auth/login"),
    ("USER-SERVICE", "api/auth/register"),
    ("USER-SERVICE", "api/auth/users/send-reset-code"),
    ("USER-SERVICE", "api/auth/users/verify-code"),
    ("USER-SERVICE", "api/auth/users/reset-password")
}


@dataclass
class ServiceInstance:
    hostName: str
    port: dict
    last_used: float = 0
    request_count: int = 0
    error_count: int = 0

class LoadBalancer:
    def __init__(self):
        self.instance_stats = defaultdict(dict)
        self._round_robin_index = defaultdict(int)
    
    def get_instance(self, instances: List[ServiceInstance], strategy: str = "round_robin") -> Optional[ServiceInstance]:
        """Select an instance based on the specified strategy"""
        if not instances:
            return None
            
        if strategy == "random":
            return random.choice(instances)
            
        elif strategy == "round_robin":
            idx = self._round_robin_index[str(id(instances))] % len(instances)
            self._round_robin_index[str(id(instances))] += 1
            return instances[idx]
            
        elif strategy == "least_connections":
            return min(instances, key=lambda x: x.request_count)
            
        return instances[0]  # Default to first instance

load_balancer = LoadBalancer()


def is_public_endpoint(service_name: str, path: str) -> bool:
    """Check if endpoint is in public list"""
    return any(
        service_name == service and path.startswith(endpoint)
        for service, endpoint in PUBLIC_ENDPOINTS
    )

    

async def format_response(response: aiohttp.ClientResponse) -> Dict[str, Any]:
    """Format the response from the target service into a consistent JSON structure"""
    try:
        content_type = response.headers.get('Content-Type', '').lower()
        
        if 'application/json' in content_type:
            return await response.json()
        else:
            text = await response.text()
            try:
                # Try to parse as JSON if not explicitly JSON content-type
                return json.loads(text)
            except json.JSONDecodeError:
                # Format non-JSON responses as JSON
                return {
                    "content": text,
                    "content_type": content_type,
                    "original_status": response.status
                }
    except Exception as e:
        logger.error(f"Error formatting response: {str(e)}")
        return {"error": "response_format_error", "details": str(e)}

def prepare_target_url(path: str, query_params: Dict[str, List[str]]) -> str:
    """Prepare the target URL by filtering out proxy-specific parameters"""
    filtered_params = {
        k: v for k, v in query_params.items() 
        if k not in PROXY_RESERVED_PARAMS
    }
    query_string = urlencode(filtered_params, doseq=True)
    return f"{path}?{query_string}" if query_string else path


async def auth_dependency(request: Request):
    """Dynamic dependency that checks the request path"""
    service_name = request.path_params.get("service_name")
    path = request.path_params.get("path", "")
    
    if is_public_endpoint(service_name, path):
        return None
    
    token = request.cookies.get("token") or \
           (request.headers.get("Authorization") or "").replace("Bearer ", "")
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token"
        )
    
    return await verify_token(token)


@router.post("/api/login")
async def login_proxy(request: Request):
    """
    Enhanced login proxy that properly handles token storage
    """
    try:
        # Forward to user service
        login_data = await request.json()
        response = await forward_to_service(
            "USER-SERVICE",  # Make sure this matches your Eureka service name
            "api/auth/login", 
            "POST",
            login_data
        )

        # Create response object
        response_obj = Response(
            content=json.dumps(response["data"]),
            status_code=response["status"],
            media_type="application/json"
        )

        # If login successful (status code 200)
        if response["status"] == 200:
            token_data = response["data"].get("token")
            
            if token_data:
                # Set HTTP-only cookie (secure in production)
                response_obj.set_cookie(
                    key="token",
                    value=token_data,
                    httponly=True,
                    max_age=15*24*3600,  # 15 days to match your Node service
                    secure=True,  # Enable in production
                    samesite='strict',
                    path='/'
                )
                
                # Also include token in response body for non-browser clients
                response_data = response["data"]
                response_data["token"] = token_data  # Ensure token is in response
                response_obj.body = json.dumps(response_data).encode()

        return response_obj

    except Exception as e:
        logger.error(f"Login proxy error: {str(e)}")
        return JSONResponse(
            status_code=502,
            content={"error": "Login service unavailable"}
        )


@router.post("/api/signup")
async def signup_proxy(request: Request):
    """
    Proxy to your Node.js signup endpoint
    """
    signup_data = await request.json()
    response = await forward_to_service(
        "USER-SERVICE",
        "api/auth/register", 
        "POST",
        signup_data
    )
    return Response(
        content=json.dumps(response["data"]),
        status_code=response["status"],
        media_type="application/json"
    )



@router.post("/api/send-reset-code")
async def reset_code_proxy(request: Request):
    """
    Proxy to Node.js send reset code endpoint
    """

    reset_code_data = await request.json()
    response = await forward_to_service(
        "USER-SERVICE",
        "api/auth/send-reset-code",
        "POST",
        reset_code_data
    )

    return Response(
        content=json.dumps(response["data"]),
        status_code=response["status"],
        media_type="application/json"
    )


@router.post("/api/verify-code")
async def verify_code_proxy(request: Request):
    """
    Proxy to Node.js send reset code endpoint
    """

    verify_code_data = await request.json()
    response = await forward_to_service(
        "USER-SERVICE",
        "api/auth/verify-code",
        "POST",
        verify_code_data
    )

    return Response(
        content=json.dumps(response["data"]),
        status_code=response["status"],
        media_type="application/json"
    )


@router.post("/api/reset-password")
async def reset_password_proxy(request: Request):
    """
    Proxy to Node.js send reset code endpoint
    """

    reset_code_data = await request.json()
    response = await forward_to_service(
        "USER-SERVICE",
        "api/auth/reset-password",
        "POST",
        reset_code_data
    )

    return Response(
        content=json.dumps(response["data"]),
        status_code=response["status"],
        media_type="application/json"
    )


@router.post("/api/update-profile")
async def update_profile_proxy(request: Request):
    """
    Proxy to Node.js send update profile endpoint
    """

    update_profile_data = await request.json()
    response = await forward_to_service(
        "USER-SERVICE",
        "api/users/current/update-profile",
        "PATCH",
        update_profile_data
    )

    return Response(
        content=json.dumps(response["data"]),
        status_code=response["status"],
        media_type="application/json"
    )


@router.post("/api/delete-profile")
async def delete_profile_proxy(request: Request):
    """
    Proxy to Node.js send update profile endpoint
    """

    delete_profile_data = await request.json()
    response = await forward_to_service(
        "USER-SERVICE",
        "api/users/current/delete-profile",
        "DELETE",
        delete_profile_data
    )

    return Response(
        content=json.dumps(response["data"]),
        status_code=response["status"],
        media_type="application/json"
    )


@router.post("/api/change-password")
async def change_password_proxy(request: Request):
    """
    Proxy to Node.js send update profile endpoint
    """

    change_password_data = await request.json()
    response = await forward_to_service(
        "USER-SERVICE",
        "api/users/current/change-password",
        "PATCH",
        change_password_data
    )

    return Response(
        content=json.dumps(response["data"]),
        status_code=response["status"],
        media_type="application/json"
    )




@router.api_route("/{service_name}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_request(
    service_name: str,
    request: Request,
    lb_strategy: Optional[str] = "round_robin",
    current_user: dict = Depends(auth_dependency)
) -> Response:
    """
    Secure proxy that handles authentication before forwarding requests
    """
    
    try:
        # Parse and prepare the request (your existing code)
        parsed_url = urlparse(str(request.url))
        query_params = parse_qs(parsed_url.query)
        modified_path = parsed_url.path.replace(f"/{service_name}", "", 1)
        
        # Get service instances from Eureka (your existing code)
        client = eureka_client.get_client()
        app = client.applications.get_application(service_name.upper())
        raw_instances = app.up_instances
        
        if not raw_instances:
            logger.error(f"No instances available for service: {service_name}")
            raise HTTPException(
                status_code=404,
                detail={"error": "service_unavailable", "service": service_name }
            )
        
        # Prepare instances for load balancing (your existing code)
        instances = [
            ServiceInstance(
                hostName=instance.hostName,
                port=instance.port,
                last_used=load_balancer.instance_stats[instance.hostName].get('last_used', 0),
                request_count=load_balancer.instance_stats[instance.hostName].get('request_count', 0)
            )
            for instance in raw_instances
        ]
        
        # Select instance (your existing code)
        instance = load_balancer.get_instance(instances, lb_strategy)
        if not instance:
            raise HTTPException(
                status_code=503,
                detail={"error": "no_available_instances", "service": service_name, "instances": instances}
            )
        
        # Update stats (your existing code)
        instance.request_count += 1
        instance.last_used = time.time()
        load_balancer.instance_stats[instance.hostName] = {
            'last_used': instance.last_used,
            'request_count': instance.request_count
        }
        
        logger.info(f"Routing to {instance.hostName} using {lb_strategy}")
        
        # Build target URL (modified to handle auth)
        target_url = f"http://{instance.hostName}:{instance.port.port}{prepare_target_url(modified_path, query_params)}"
        # target_url = f"http://host.docker.internal:{instance.port.port}{prepare_target_url(modified_path, query_params)}"
        
        # Forward headers (modified to include user context)
        headers = {
            k: v for k, v in request.headers.items()
            if k.lower() not in ['host', 'content-length']
        }
        headers.update({
            "X-Forwarded-For": request.client.host,
            "X-Proxy-LB-Strategy": lb_strategy,
            "X-Proxy-Target-Instance": instance.hostName,
            "X-Current-User": json.dumps(current_user) if current_user else "anonymous"
        })


    
        if hasattr(request.state, "token"):
            headers["Authorization"] = f"Bearer {request.state.token}"
    
        # Convert user object to string if present
        if hasattr(request.state, "user"):
            user_data = request.state.user
            # print("user_data", user_data)
            headers["X-User-Id"] = str(user_data.get("user_id", ""))
            headers["X-User-Email"] = user_data.get("email", "")
            headers["X-User-Role"] = user_data.get("role", "")

        # Handle request body for non-GET methods
        body = None
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                body = await request.json()
            except:
                body = await request.body()
        
        # Make the proxied request (updated to handle all methods)
        async with aiohttp.ClientSession() as session:
            try:
                async with session.request(
                    request.method,
                    target_url,
                    headers=headers,
                    json=body if isinstance(body, dict) else None,
                    data=body if not isinstance(body, dict) else None,
                    timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)
                ) as response:
                    
                    # Format response (your existing code)
                    response_data = await format_response(response)
                    
                    # Prepare response (your existing code)
                    complete_response = {
                        "data": response_data,
                        "metadata": {
                            "service": service_name,
                            "instance": instance.hostName,
                            "strategy": lb_strategy,
                            "status": response.status,
                            "proxy_timestamp": time.time(),
                            "forwarded_query_params": prepare_target_url("", query_params)[1:]
                        }
                    }
                    
                    return Response(
                        content=json.dumps(complete_response, ensure_ascii=False),
                        media_type="application/json",
                        status_code=response.status
                    )
                    
            except aiohttp.ClientError as e:
                instance.error_count += 1
                logger.error(f"Request to {instance.hostName} failed: {str(e)}")
                error_response = {
                    "error": "bad_gateway",
                    "service": service_name,
                    "instance": instance.hostName,
                    "details": str(e)
                }
                return Response(
                    content=json.dumps(error_response, ensure_ascii=False),
                    media_type="application/json",
                    status_code=502
                )
                
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.exception(f"Unexpected proxy error: {str(e)}")
        error_response = {
            "error": "internal_server_error",
            "details": str(e)
        }
        return Response(
            content=json.dumps(error_response, ensure_ascii=False),
            media_type="application/json",
            status_code=500
        )




async def forward_to_service(service_name: str, path: str, method: str, data: dict):
    """
    Enhanced forwarding function that handles your user service responses
    """
    # Get service instance (from your existing load balancer)

    # Get service instances from Eureka (your existing code)
    client = eureka_client.get_client()
    app = client.applications.get_application(service_name.upper())
    raw_instances = app.up_instances
    
    if not raw_instances:
        logger.error(f"No instances available for service: {service_name}")
        raise HTTPException(
            status_code=404,
            detail={"error": "service_unavailable", "service": service_name, "UP INSTANCES": app.up_instances}
        )
    
    # Prepare instances for load balancing (your existing code)
    instances = [
        ServiceInstance(
            hostName=instance.hostName,
            port=instance.port,
            last_used=load_balancer.instance_stats[instance.hostName].get('last_used', 0),
            request_count=load_balancer.instance_stats[instance.hostName].get('request_count', 0)
        )
        for instance in raw_instances
    ]
    
    # Select instance (your existing code)
    instance = load_balancer.get_instance(instances)
    if not instance:
        raise HTTPException(
            status_code=503,
            detail={"error": "no_available_instances", "service": service_name}
        )
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.request(
                method,
                f"http://{instance.hostName}:{instance.port.port}/{path}",
                json=data,
                timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)
            ) as response:
                
                response_data = await response.json()
                
                return {
                    "data": response_data,
                    "status": response.status
                }
                
        except aiohttp.ClientError as e:
            logger.error(f"Request to {service_name} failed: {str(e)}")
            return {
                "data": {"error": str(e)},
                "status": 502
            }
        
