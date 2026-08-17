from decimal import Decimal

from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate
from app.utils.exceptions import (
    CustomerNotFoundException,
    InsufficientStockException,
    OrderNotFoundException,
    ProductNotFoundException,
)


class OrderService:

    @staticmethod
    def _get_customer(
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
    def _get_product(
        db: Session,
        product_id: int,
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
    def _validate_stock(
        product: Product,
        requested_quantity: int,
    ) -> None:

        if product.quantity < requested_quantity:
            raise InsufficientStockException(
                product.name
            )

    @staticmethod
    def _build_product_quantities(
        order_data: OrderCreate,
    ) -> dict[int, int]:

        product_quantities: dict[int, int] = {}

        for item in order_data.items:

            product_quantities[item.product_id] = (
                product_quantities.get(item.product_id, 0)
                + item.quantity
            )

        return product_quantities

    @staticmethod
    def _validate_products_and_stock(
        db: Session,
        product_quantities: dict[int, int],
    ) -> dict[int, Product]:

        products: dict[int, Product] = {}

        for product_id, requested_quantity in product_quantities.items():

            product = OrderService._get_product(
                db,
                product_id,
            )

            OrderService._validate_stock(
                product,
                requested_quantity,
            )

            products[product_id] = product

        return products

    @staticmethod
    def _calculate_total(
        product_quantities: dict[int, int],
        products: dict[int, Product],
    ) -> Decimal:

        total = Decimal("0.00")

        for product_id, quantity in product_quantities.items():

            product = products[product_id]

            total += product.price * quantity

        return total

    @staticmethod
    def create_order(
        db: Session,
        order_data: OrderCreate,
    ) -> Order:

        customer = OrderService._get_customer(
            db,
            order_data.customer_id,
        )

        product_quantities = (
            OrderService._build_product_quantities(
                order_data
            )
        )

        products = (
            OrderService._validate_products_and_stock(
                db,
                product_quantities,
            )
        )

        total_amount = OrderService._calculate_total(
            product_quantities,
            products,
        )

        order = Order(
            customer_id=customer.id,
            total_amount=total_amount,
        )

        db.add(order)

        for product_id, requested_quantity in product_quantities.items():

            product = products[product_id]

            order_item = OrderItem(
                order=order,
                product=product,
                quantity=requested_quantity,
                unit_price=product.price,
            )

            db.add(order_item)

            product.quantity -= requested_quantity

        try:

            db.commit()

        except Exception:

            db.rollback()

            raise

        db.refresh(order)

        return order

    @staticmethod
    def get_orders(
        db: Session,
    ) -> list[Order]:

        return (
            db.query(Order)
            .options(
                joinedload(Order.customer),
                selectinload(Order.order_items)
                .joinedload(OrderItem.product),
            )
            .all()
        )

    @staticmethod
    def get_order_by_id(
        db: Session,
        order_id: int,
    ) -> Order:

        order = (
            db.query(Order)
            .options(
                joinedload(Order.customer),
                selectinload(Order.order_items)
                .joinedload(OrderItem.product),
            )
            .filter(Order.id == order_id)
            .first()
        )

        if not order:
            raise OrderNotFoundException()

        return order

    @staticmethod
    def delete_order(
        db: Session,
        order_id: int,
    ) -> None:

        order = OrderService.get_order_by_id(
            db,
            order_id,
        )

        for item in order.order_items:

            product = item.product

            product.quantity += item.quantity

        db.delete(order)

        try:

            db.commit()

        except Exception:

            db.rollback()

            raise