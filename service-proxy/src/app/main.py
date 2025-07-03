from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from eureka import register_with_eureka, shutdown_eureka
from proxy.routes import router as proxy_router
from proxy.security import SECRET_KEY, ALGORITHM
from config.settings import Settings
import jwt
from jwt import PyJWTError as JWTError

settings = Settings()

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    # Get token from cookie/header
    token = request.cookies.get("token") or \
           request.headers.get("authorization", "").replace("Bearer ", "")
    
    if token:
        try:
            # Decode token and store user data
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            request.state.user = {
                "id": payload.get("id"),
                "email": payload.get("email"),
                "role": payload.get("role")
            }
        except JWTError:
            pass
    
    return await call_next(request)


# Include routers
app.include_router(proxy_router)

# Eureka lifecycle events
@app.on_event("startup")
async def startup_event():
    await register_with_eureka(app)

@app.on_event("shutdown")
async def shutdown_event():
    await shutdown_eureka()

# Health endpoints
@app.get("/health")
def health_check():
    return {"status": "UP"}

@app.get("/info")
def info():
    return {
        "app": settings.app_name,
        "version": app.version
    }