import os
from fastapi import FastAPI
from dotenv import load_dotenv
from app.api.routers import api_router
from starlette.middleware.cors import CORSMiddleware

load_dotenv()

ENV_TYPE = os.getenv("ENV_TYPE")
ALLOWED_CORS_ORIGIN: list[str] = os.getenv('ALLOWED_CORS_ORIGIN', '')

if ENV_TYPE == "DEV":

    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allows all origins (for development - be more specific in production)
        allow_credentials=False,
        allow_methods=["GET", "OPTIONS", "POST"],
        allow_headers=["*"]
    )

    app.include_router(api_router)

else :

    app = FastAPI(redoc_url=None, docs_url=None)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=\
            ALLOWED_CORS_ORIGIN.split(',') if ALLOWED_CORS_ORIGIN else [],
        allow_credentials=False,
        allow_methods=["GET", "OPTIONS", "POST"],
        allow_headers=["*"]
    )

    app.include_router(api_router)