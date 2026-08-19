from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order


class DashboardService:

    @staticmethod
    def get_summary(db: Session) -> dict:

        total_products = (
            db.query(Product)
            .count()
        )

        total_customers = (
            db.query(Customer)
            .count()
        )

        total_orders = (
            db.query(Order)
            .count()
        )

        low_stock_products = (
            db.query(Product)
            .filter(Product.quantity <= 5)
            .order_by(Product.quantity.asc())
            .all()
        )

        return {
            "total_products": total_products,
            "total_customers": total_customers,
            "total_orders": total_orders,
            "low_stock_products": low_stock_products,
        }