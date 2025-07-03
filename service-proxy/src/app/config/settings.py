from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "fastapi-proxy"
    app_host: str = "0.0.0.0"
    app_port: int = 8079
    eureka_url: str = "http://localhost:8761/eureka"
    #eureka_url: str = "http://service-registry:8761/eureka"
    
    class Config:
        env_file = ".env"

settings = Settings()