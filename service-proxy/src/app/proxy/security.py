# security.py
import jwt
from jwt import PyJWTError as JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# Must match your user service configuration
SECRET_KEY='4b4017b60ba6766fa68ac34cda732625aceb1248483b363507c62a76aeb0fb3d5df4fbec77ebb94c409294ff1597ac093cee490e1e842674ab3c989a2162b1104214f0c802fe1d3ca8cbc823b162fc6fd986c53147a0a5b23467238feb9ff9c0f92135dbee5710550466a1013b20abd96496f61c1b44d74e9b3438c8fefa89cd'
ALGORITHM = "HS256"
TOKEN_EXPIRE_DAYS = 15  # Matching your 15-day expiration

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

async def verify_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(payload)
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
        
        # Return the complete user data from token
        return {
            "id": user_id,
            "email": payload.get("email"),
            "role": payload.get("role")
        }
    except JWTError as e:
        raise credentials_exception