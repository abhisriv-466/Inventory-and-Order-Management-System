import { useEffect, useState } from "react";

function CustomerForm({ customer, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        full_name: customer.full_name ?? "",
        email: customer.email ?? "",
        phone: customer.phone ?? "",
      });
    } else {
      setFormData({
        full_name: "",
        email: "",
        phone: "",
      });
    }
  }, [customer]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
    });
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>
        {customer ? "Edit Customer" : "Add Customer"}
      </h2>

      <div className="form-group">
        <label htmlFor="full_name">
          Full Name
        </label>

        <input
          id="full_name"
          name="full_name"
          type="text"
          value={formData.full_name}
          onChange={handleChange}
          required
          minLength={1}
          maxLength={255}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">
          Phone
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          minLength={7}
          maxLength={20}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
        >
          {customer
            ? "Update Customer"
            : "Add Customer"}
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

export default CustomerForm;