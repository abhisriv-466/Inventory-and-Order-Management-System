from fastapi import FastAPI

from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)


@app.get("/")
def home():
    return {
        "message": "Inventory Management System Backend is Running!"
    }