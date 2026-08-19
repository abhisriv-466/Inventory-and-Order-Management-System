from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.customer import (
    CustomerCreate,
    CustomerResponse,
    CustomerUpdate,
)
from app.services.customer_service import CustomerService


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.post(
    "/",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db),
):
    return CustomerService.create_customer(
        db,
        customer_data,
    )


@router.get(
    "/",
    response_model=list[CustomerResponse],
)
def get_customers(
    db: Session = Depends(get_db),
):
    return CustomerService.get_customers(db)


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    return CustomerService.get_customer_by_id(
        db,
        customer_id,
    )

@router.put(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db),
):
    return CustomerService.update_customer(
        db,
        customer_id,
        customer_data,
    )

@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    CustomerService.delete_customer(
        db,
        customer_id,
    )