import { useEffect, useState } from "react";

function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name ?? "",
        sku: product.sku ?? "",
        price: product.price ?? "",
        quantity: product.quantity ?? "",
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        price: "",
        quantity: "",
      });
    }
  }, [product]);

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
      name: formData.name,
      sku: formData.sku,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    });
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>{product ? "Edit Product" : "Add Product"}</h2>

      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="sku">SKU</label>
        <input
          id="sku"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {product ? "Update Product" : "Add Product"}
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

export default ProductForm;