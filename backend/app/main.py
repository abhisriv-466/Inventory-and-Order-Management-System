from fastapi import FastAPI

from app.core.config import settings
from app.database.database import Base, engine

# Import all models so SQLAlchemy registers them
from app.models import Customer, Order, OrderItem, Product

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)


@app.get("/")
def home():
    return {
        "message": "Inventory Management System Backend is Running!"
    }