#!/usr/bin/env python3
import uuid
from typing import List, Optional
import os
import shutil
import datetime
from fastapi import APIRouter, Depends, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from models.user_models import UserEntity,UserLogin

from dotenv import load_dotenv
# Importer les dépendances depuis le fichier dependencies.py
from utils.dependencies import StandardResponse
from utils.database import get_db
import os
import requests
from security.password import verify_password, get_password_hash
from security.token import generate_token, verify_token
import datetime
import logging

router = APIRouter(
    prefix="/api/service-users",
    tags=["User"],
    responses={404: {"description": "Not found"}},
)

# Charger les variables d'environnement avant d'importer les autres modules
load_dotenv()

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())


@router.get("/get-all-users", response_model=StandardResponse)
def get_users(nom: Optional[str] = None, db: Session = Depends(get_db)):
    try:
        query = db.query(UserEntity)
        if nom:
            query = query.filter(UserEntity.nom.like(f'%{nom}%'))
        users = query.all()
        users_list = [user.to_dict() for user in users]

        if nom:
            message = f"Users found for name: {nom}"
        else:
            message = "List of all users"
        
        return StandardResponse(
            statusCode=200,
            message=message,
            data={"users": users_list}
        )
    except Exception as e:
        return StandardResponse(
            statusCode=500,
            message=str(e),
            data={}
        )

@router.get("/get-user/{user_id}", response_model=StandardResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.query(UserEntity).filter(UserEntity.id == user_id).first()
        if user:
            return StandardResponse(
                statusCode=200,
                message="user found",
                data={"user": user.to_dict()}
            )
        else:
            return StandardResponse(
                statusCode=404,
                message="user not found",
                data={}
            )
    except Exception as e:
        return StandardResponse(
            statusCode=500,
            message=str(e),
            data={}
        )

async def save_upload_file(upload_file: UploadFile, destination: str) -> str:
    try:
        # Créer un nom de fichier unique
        file_extension = os.path.splitext(upload_file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join("static/profile_images", unique_filename)
        
        # Créer le dossier s'il n'existe pas
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Sauvegarder le fichier
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
            
        return unique_filename
    except Exception as e:
        raise e
    finally:
        await upload_file.close()

@router.post("/create-user", response_model=StandardResponse)
async def create_user(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    phone_number: str = Form(None),
    type: str = Form("0"),
    status: str = Form("active"),
    color: str = Form(None),
    profile_image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        # Vérifier si l'utilisateur existe déjà
        existing_user = db.query(UserEntity).filter(UserEntity.email == email).first()
        if existing_user:
            return JSONResponse(
                status_code=400,
                content={
                    "statusCode": 400,
                    "message": "Email already exists",
                    "data": {}
                }
            )
            
        # Vérifier si le numéro de téléphone existe déjà
        if phone_number:
            existing_phone = db.query(UserEntity).filter(UserEntity.phone_number == phone_number).first()
            if existing_phone:
                return JSONResponse(
                    status_code=400,
                    content={
                        "statusCode": 400,
                        "message": "Phone number already exists",
                        "data": {}
                    }
                )
        
        # Gérer l'upload de l'image de profil si fournie
        profile_image_path = None
        if profile_image and profile_image.filename:
            try:
                profile_image_path = await save_upload_file(profile_image, "static/profile_images")
            except Exception as e:
                return JSONResponse(
                    status_code=500,
                    content={
                        "statusCode": 500,
                        "message": f"Error saving profile image: {str(e)}",
                        "data": {}
                    }
                )
        
        # Créer l'utilisateur
        hashed_password = get_password_hash(password)
        user_data = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "phone_number": phone_number,
            "type": type,
            "status": status,
            "color": color,
            "profile_image": profile_image_path
        }
        
        user = UserEntity(**user_data)
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return StandardResponse(
            statusCode=201,
            message="User created successfully",
            data={"user": user.to_dict()}
        )
        
    except Exception as e:
        db.rollback()
        return StandardResponse(
            statusCode=500,
            message=str(e),
            data={
                "statusCode": 500,
                "message": f"An error occurred: {str(e)}",
                "data": {}
            }
        )

#update user
@router.put("/update-user/{user_id}", response_model=StandardResponse)
async def update_user(
    user_id: int,
    name: str = Form(None),
    email: str = Form(None),
    password: str = Form(None),
    phone_number: str = Form(None),
    type: str = Form("0"),
    status: str = Form("active"),
    color: str = Form(None),
    profile_image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        # Récupérer l'utilisateur existant
        user = db.query(UserEntity).filter(UserEntity.id == user_id).first()
        if not user:
            return StandardResponse(
                statusCode=404,
                message="User not found",
                data={}
            )
            
        # Vérifier si l'email est déjà utilisé par un autre utilisateur
        if email and email != user.email:
            existing_user = db.query(UserEntity).filter(
                UserEntity.email == email,
                UserEntity.id != user_id
            ).first()
            if existing_user:
                return StandardResponse(
                    statusCode=400,
                    message="Email already in use by another user",
                    data={}
                )
        
        # Vérifier si le numéro de téléphone est déjà utilisé par un autre utilisateur
        if phone_number and phone_number != user.phone_number:
            existing_phone = db.query(UserEntity).filter(
                UserEntity.phone_number == phone_number,
                UserEntity.id != user_id
            ).first()
            if existing_phone:
                return StandardResponse(
                    statusCode=400,
                    message="Phone number already in use by another user",
                    data={}
                )
        
        # Mettre à jour les champs fournis
        if name is not None:
            user.name = name
        if email is not None:
            user.email = email
        if password is not None:
            user.password = get_password_hash(password)
        if phone_number is not None:
            user.phone_number = phone_number
        if type is not None:
            user.type = type
        if status is not None:
            user.status = status
        if color is not None:
            user.color = color
            
        # Gérer l'upload de la nouvelle image de profil si fournie
        if profile_image and profile_image.filename:
            try:
                # Supprimer l'ancienne image si elle existe
                if user.profile_image:
                    old_image_path = os.path.join("static/profile_images", user.profile_image)
                    if os.path.exists(old_image_path):
                        os.remove(old_image_path)
                
                # Sauvegarder la nouvelle image
                profile_image_path = await save_upload_file(profile_image, "static/profile_images")
                user.profile_image = profile_image_path
            except Exception as e:
                return StandardResponse(
                    statusCode=500,
                    message=f"Error updating profile image: {str(e)}",
                    data={}
                )
        
        user.updated_at = datetime.datetime.now()
        db.commit()
        db.refresh(user)
        
        return StandardResponse(
            statusCode=200,
            message="User updated successfully",
            data={"user": user.to_dict()}
        )
        
    except Exception as e:
        db.rollback()
        return StandardResponse(
            statusCode=500,
            message=str(e),
            data={}
        )

#delete user
@router.delete("/delete-user/{user_id}", response_model=StandardResponse)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.query(UserEntity).filter(UserEntity.id == user_id).first()
        if user:
            db.delete(user)
            db.commit()
            return StandardResponse(
                statusCode=200,
                message="user deleted",
                data={}
            )
        else:
            return StandardResponse(
                statusCode=404,
                message="user not found",
                data={}
            )
    except Exception as e:
        return StandardResponse(
            statusCode=500,
            message=str(e),
            data={}
        )

#login user
@router.post("/login-user", response_model=StandardResponse)
def login(send_user: UserLogin, db: Session = Depends(get_db)):
    try:
        user = db.query(UserEntity).filter(UserEntity.email == send_user.email).first()
        if not user:
            return StandardResponse(
                statusCode=404,
                message="user not found",
                data={}
            )
        if not verify_password(send_user.password, user.password):
            return StandardResponse(
                statusCode=401,
                message="wrong password",
                data={}
            )

        if user:

            exp = datetime.datetime.now() + datetime.timedelta(days=1)
            # Convertir les dates en chaînes ISO format
            created_at_iso = user.created_at.isoformat() if user.created_at else None
            updated_at_iso = user.updated_at.isoformat() if user.updated_at else None
            exp_iso = exp.isoformat()
            
            user_token = {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "type": user.type,
                "status": user.status,
                "phone_number": user.phone_number,
                "profile_image": user.profile_image,
                "color": user.color,
                "created_at": created_at_iso,
                "updated_at": updated_at_iso,
                "exp": exp_iso
            }
            return StandardResponse(
                statusCode=200,
                message="user logged in",
                data={"token": generate_token(user_token), "exp": exp}
            )
        else:
            return StandardResponse(
                statusCode=404,
                message="user not found after login",
                data={}
            )
    except Exception as e:
        return StandardResponse(
            statusCode=500,
            message=str(e),
            data={}
        )


#Authorization
@router.post("/authorization")
async def auth(token: str = Form(...)):
    try:
        # Vérifier et décoder le token
        token_data = verify_token(token)
        if not token_data or not isinstance(token_data, dict) or 'user' not in token_data:
            return JSONResponse(
                status_code=401,
                content={
                    "statusCode": 401,
                    "message": "Invalid or malformed token. Please log in again.",
                    "data": {}
                }
            )
        
        # Récupérer les données utilisateur
        user_data = token_data.get('user', {})
        logger.info(f"Token data: {token_data}")
        
        # Vérifier les champs requis dans user
        required_fields = ["id", "email", "exp"]
        if not all(field in user_data for field in required_fields):
            return JSONResponse(
                status_code=401,
                content={
                    "statusCode": 401,
                    "message": "Invalid token format. Missing required fields.",
                    "data": {}
                }
            )
        
        # Vérifier l'expiration du token
        from datetime import datetime
        try:
            exp_time = datetime.fromisoformat(user_data["exp"]) if isinstance(user_data["exp"], str) else user_data["exp"]
            if exp_time < datetime.utcnow():
                return JSONResponse(
                    status_code=401,
                    content={
                        "statusCode": 401,
                        "message": "Token has expired. Please log in again.",
                        "data": {}
                    }
                )
        except (ValueError, TypeError) as e:
            logger.error(f"Error parsing token expiration: {e}")
            return JSONResponse(
                status_code=401,
                content={
                    "statusCode": 401,
                    "message": "Invalid token expiration format.",
                    "data": {}
                }
            )
        
        # Retourner une réponse de succès avec les données utilisateur
        return JSONResponse(
            status_code=200,
            content={
                "statusCode": 200,
                "message": "User authorized successfully",
                "data": user_data
            }
        )
        
    except ValueError as ve:
        return JSONResponse(
            status_code=400,
            content={
                "statusCode": 400,
                "message": f"Invalid token format: {str(ve)}",
                "data": {}
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "statusCode": 500,
                "message": f"An error occurred during authorization: {str(e)}",
                "data": {}
            }
        )
        