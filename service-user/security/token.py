
import os 
import jwt
from dotenv import load_dotenv 
load_dotenv()

def generate_token (data:str) -> str :
    """
    generate token for user 
    """
    secret_key = os.getenv("SECRET_KEY")
    payload = {
        'user':data ,
    }

    token = jwt.encode(payload,secret_key,algorithm='HS256')

    return token

def verify_token(token:str) -> str :
    """
    verify token for user 
    """
    secret_key = os.getenv("SECRET_KEY")
    try :
        payload = jwt.decode(token,secret_key,algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError :
        return "Signature expired. Please log in again."
    except jwt.InvalidTokenError :
        return "Invalid token. Please log in again."
    except Exception as e :
        return str(e)