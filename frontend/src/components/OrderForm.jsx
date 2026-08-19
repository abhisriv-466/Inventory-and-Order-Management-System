import { useState } from "react";

function OrderForm({
  customers,
  products,
  onSubmit,
  onCancel,
}) {
  const [customerId, setCustomerId] = useState("");

  const [items, setItems] = useState([
    {
      product_id: "",
      quantity: 1,
    },
  ]);

  function handleCustomerChange(event) {
    setCustomerId(event.target.value);
  }

  function handleItemChange(index, field, value) {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((currentItems) => [
      ...currentItems,
      {
        product_id: "",
        quantity: 1,
      },
    ]);
  }

  function removeItem(index) {
    if (items.length === 1) {
      return;
    }

    setItems((currentItems) =>
      currentItems.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    const orderData = {
      customer_id: Number(customerId),

      items: items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      })),
    };

    onSubmit(orderData);
  }

  return (
    <form
      className="form-card"
      onSubmit={handleSubmit}
    >
      <h2>Create Order</h2>

      <div className="form-group">
        <label htmlFor="customer">
          Customer
        </label>

        <select
          id="customer"
          value={customerId}
          onChange={handleCustomerChange}
          required
        >
          <option value="">
            Select a customer
          </option>

          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.full_name}
            </option>
          ))}
        </select>
      </div>

      <h3>Order Items</h3>

      {items.map((item, index) => (
        <div
          className="order-item-form"
          key={index}
        >
          <div className="form-group">
            <label>
              Product
            </label>

            <select
              value={item.product_id}
              onChange={(event) =>
                handleItemChange(
                  index,
                  "product_id",
                  event.target.value
                )
              }
              required
            >
              <option value="">
                Select a product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                  disabled={product.quantity <= 0}
                >
                  {product.name} — ₹
                  {Number(product.price).toFixed(2)}
                  {" "}
                  ({product.quantity} in stock)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(event) =>
                handleItemChange(
                  index,
                  "quantity",
                  event.target.value
                )
              }
              required
            />
          </div>

          {items.length > 1 && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeItem(index)}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className="btn btn-secondary"
        onClick={addItem}
      >
        + Add Another Product
      </button>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
        >
          Create Order
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default OrderForm;