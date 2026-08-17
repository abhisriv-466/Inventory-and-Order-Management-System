from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from app.utils.exceptions import (
    DuplicateSKUException,
    ProductNotFoundException,
)

class ProductService:
    @staticmethod
    def create_product(
        db: Session,
        product_data: ProductCreate,
    ) -> Product:

        existing_product = (
            db.query(Product)
            .filter(Product.sku == product_data.sku)
            .first()
        )

        if existing_product:
            raise DuplicateSKUException()

        product = Product(
            **product_data.model_dump()
        )

        db.add(product)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        db.refresh(product)

        return product
    

    @staticmethod
    def get_products(
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> list[Product]:
        
        products = (
            db.query(Product)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
        return products


    @staticmethod
    def get_product_by_id(
        db: Session,
        product_id: int
    ) -> Product:

        product = (
            db.query(Product)
            .filter(Product.id == product_id)
            .first()
        )

        if not product:
            raise ProductNotFoundException()

        return product
    
    @staticmethod
    def update_product(
        db: Session,
        product_id: int,
        product_data: ProductUpdate,
    ) -> Product:

        product = ProductService.get_product_by_id(
            db,
            product_id,
        )

        update_data = product_data.model_dump(
            exclude_unset=True
        )

        if "sku" in update_data:

            existing = (
                db.query(Product)
                .filter(Product.sku == update_data["sku"])
                .filter(Product.id != product_id)
                .first()
            )

            if existing:
                raise DuplicateSKUException()

        for key, value in update_data.items():
            setattr(product, key, value)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        db.refresh(product)

        return product
    
    @staticmethod
    def delete_product(
        db: Session,
        product_id: int,
    ) -> None:

        product = ProductService.get_product_by_id(
            db,
            product_id,
        )

        db.delete(product)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise