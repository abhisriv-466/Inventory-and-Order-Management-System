import { useEffect, useState } from "react";

import api from "../services/api";
import ProductForm from "../components/ProductForm";

function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products/");
      setProducts(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleSubmit(productData) {
    try {
      setError("");

      if (editingProduct) {
        await api.put(
          `/products/${editingProduct.id}`,
          productData
        );
      } else {
        await api.post("/products/", productData);
      }

      setShowForm(false);
      setEditingProduct(null);

      await fetchProducts();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to save product."
      );
    }
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/products/${productId}`);

      await fetchProducts();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to delete product."
      );
    }
  }

  function handleAddProduct() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function handleEditProduct(product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingProduct(null);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="page-subtitle">
            Manage products and inventory.
          </p>
        </div>

        {!showForm && (
          <button
            className="btn btn-primary"
            onClick={handleAddProduct}
          >
            + Add Product
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {!showForm && (
        <div className="table-card">
          {loading ? (
            <p className="loading">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="empty-state">
              No products found.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>

                    <td>
                      <strong>{product.name}</strong>
                    </td>

                    <td>{product.sku}</td>

                    <td>
                      ₹{Number(product.price).toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={
                          product.quantity <= 5
                            ? "stock-low"
                            : "stock-normal"
                        }
                      >
                        {product.quantity}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-small btn-secondary"
                          onClick={() =>
                            handleEditProduct(product)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-small btn-danger"
                          onClick={() =>
                            handleDelete(product.id)
                          }
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

export default Products;