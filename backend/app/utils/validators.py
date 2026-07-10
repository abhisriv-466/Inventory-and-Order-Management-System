from decimal import Decimal


def validate_price(price: Decimal):
    if price <= 0:
        raise ValueError("Price must be greater than zero.")


def validate_quantity(quantity: int):
    if quantity < 0:
        raise ValueError("Quantity cannot be negative.")