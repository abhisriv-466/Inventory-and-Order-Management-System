from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.database import Base, engine

from app.routers import (
    products,
    customers,
    orders,
)

# Import all models so SQLAlchemy registers them
from app.models import Customer, Order, OrderItem, Product

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Inventory Management System Backend is Running!"
    }

app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)