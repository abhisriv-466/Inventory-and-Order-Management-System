import { useEffect, useState } from "react";

import api from "../services/api";
import CustomerForm from "../components/CustomerForm";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchCustomers() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/customers/");

      setCustomers(response.data);
    } catch (err) {
      console.error("Customer loading error:", err.response?.data);

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.map((item) => item.msg).join(", "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Unable to load customers.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function handleSubmit(customerData) {
    try {
      setError("");

      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, customerData);
      } else {
        await api.post("/customers/", customerData);
      }

      setShowForm(false);
      setEditingCustomer(null);

      await fetchCustomers();
    } catch (err) {
      console.error("Customer save error:", err.response?.data);

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.map((item) => item.msg).join(", "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Unable to save customer.");
      }
    }
  }

  async function handleDelete(customerId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/customers/${customerId}`);

      await fetchCustomers();
    } catch (err) {
      console.error("Customer delete error:", err.response?.data);

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.map((item) => item.msg).join(", "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Unable to delete customer.");
      }
    }
  }

  function handleAddCustomer() {
    setEditingCustomer(null);
    setShowForm(true);
  }

  function handleEditCustomer(customer) {
    setEditingCustomer(customer);
    setShowForm(true);
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingCustomer(null);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Customers</h1>

          <p className="page-subtitle">Manage your customers.</p>
        </div>

        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddCustomer}>
            + Add Customer
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {!showForm && (
        <div className="table-card">
          {loading ? (
            <p className="loading">Loading customers...</p>
          ) : customers.length === 0 ? (
            <p className="empty-state">No customers found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>

                    <td>
                      <strong>{customer.full_name}</strong>
                    </td>

                    <td>{customer.email}</td>

                    <td>{customer.phone}</td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-small btn-secondary"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => handleDelete(customer.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Customers;
