import { useEffect, useState } from "react";
import api from "../services/api";
import OrderForm from "../components/OrderForm";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [
        ordersResponse,
        customersResponse,
        productsResponse,
      ] = await Promise.all([
        api.get("/orders/"),
        api.get("/customers/"),
        api.get("/products/"),
      ]);

      setOrders(ordersResponse.data);
      setCustomers(customersResponse.data);
      setProducts(productsResponse.data);
    } catch (err) {
      console.error(
        "Error loading orders:",
        err.response?.data
      );

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail
            .map((item) => item.msg)
            .join(", ")
        );
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Unable to load orders.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrder(orderData) {
    try {
      setError("");

      await api.post("/orders/", orderData);

      setShowForm(false);

      await fetchData();
    } catch (err) {
      console.error(
        "Order creation error:",
        err.response?.data
      );

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail
            .map((item) => item.msg)
            .join(", ")
        );
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Unable to create order.");
      }
    }
  }

  async function handleDelete(orderId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/orders/${orderId}`);

      await fetchData();
    } catch (err) {
      console.error(
        "Order deletion error:",
        err.response?.data
      );

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail
            .map((item) => item.msg)
            .join(", ")
        );
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Unable to delete order.");
      }
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }

  if (loading) {
    return (
      <div className="page">
        <h1>Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>
            Manage customer orders and inventory.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setError("");
            setShowForm(true);
          }}
        >
          + Create Order
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <OrderForm
          customers={customers}
          products={products}
          onSubmit={handleCreateOrder}
          onCancel={() => setShowForm(false)}
        />
      )}

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>
            Create your first order using the
            button above.
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div
              className="order-card"
              key={order.id}
            >
              <div className="order-header">
                <div>
                  <h2>
                    Order #{order.id}
                  </h2>

                  <p>
                    Customer:{" "}
                    <strong>
                      {order.customer.full_name}
                    </strong>
                  </p>

                  <p>
                    {formatDate(
                      order.created_at
                    )}
                  </p>
                </div>

                <button
                  className="btn btn-danger"
                  onClick={() =>
                    handleDelete(order.id)
                  }
                >
                  Delete Order
                </button>
              </div>

              <div className="order-items">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.order_items.map(
                      (item, index) => {
                        const subtotal =
                          Number(item.unit_price) *
                          item.quantity;

                        return (
                          <tr
                            key={`${order.id}-${index}`}
                          >
                            <td>
                              {item.product.name}
                            </td>

                            <td>
                              {item.quantity}
                            </td>

                            <td>
                              ₹
                              {Number(
                                item.unit_price
                              ).toFixed(2)}
                            </td>

                            <td>
                              ₹
                              {subtotal.toFixed(2)}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              <div className="order-total">
                Total: ₹
                {Number(
                  order.total_amount
                ).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;