from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate,
)
from app.utils.exceptions import (
    CustomerNotFoundException,
    DuplicateEmailException,
)

class CustomerService:

    @staticmethod
    def create_customer(
        db: Session,
        customer_data: CustomerCreate,
    ) -> Customer:

        existing_customer = (
            db.query(Customer)
            .filter(Customer.email == customer_data.email)
            .first()
        )

        if existing_customer:
            raise DuplicateEmailException()

        customer = Customer(
            **customer_data.model_dump()
        )

        db.add(customer)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        db.refresh(customer)

        return customer
    
    @staticmethod
    def get_customers(
        db: Session,
    ) -> list[Customer]:

        return db.query(Customer).all()
    
    @staticmethod
    def get_customer_by_id(
        db: Session,
        customer_id: int,
    ) -> Customer:

        customer = (
            db.query(Customer)
            .filter(Customer.id == customer_id)
            .first()
        )

        if not customer:
            raise CustomerNotFoundException()

        return customer

    @staticmethod
    def update_customer(
        db: Session,
        customer_id: int,
        customer_data: CustomerUpdate,
    ) -> Customer:

        customer = CustomerService.get_customer_by_id(
            db,
            customer_id,
        )

        update_data = customer_data.model_dump(
            exclude_unset=True
        )

        if "email" in update_data:
            existing_customer = (
                db.query(Customer)
                .filter(
                    Customer.email == update_data["email"],
                    Customer.id != customer_id,
                )
                .first()
            )

            if existing_customer:
                raise DuplicateEmailException()

        for field, value in update_data.items():
            setattr(customer, field, value)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        db.refresh(customer)

        return customer
    
    @staticmethod
    def delete_customer(
        db: Session,
        customer_id: int,
    ) -> None:

        customer = CustomerService.get_customer_by_id(
            db,
            customer_id,
        )

        db.delete(customer)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise