from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from decimal import Decimal
from app.schemas.product import ProductResponse
from app.schemas.customer import CustomerResponse


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate] = Field(..., min_length=1)


class OrderItemResponse(BaseModel):
    quantity: int
    unit_price: Decimal
    product: ProductResponse

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: int
    customer: CustomerResponse
    total_amount: Decimal
    created_at: datetime
    order_items: list[OrderItemResponse]

    model_config = ConfigDict(from_attributes=True)