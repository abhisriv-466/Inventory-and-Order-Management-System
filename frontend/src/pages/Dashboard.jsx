import { useEffect, useState } from "react";
import axios from "axios";


function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchDashboard();
  }, []);


  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:8000/dashboard/summary"
      );

      setSummary(response.data);

    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <p>Loading dashboard...</p>;
  }


  if (error) {
    return <p>{error}</p>;
  }


  return (
    <div>
      <h1>Dashboard</h1>

      {summary && (
        <>
          <div>
            <div>
              <h2>Total Products</h2>
              <p>{summary.total_products}</p>
            </div>

            <div>
              <h2>Total Customers</h2>
              <p>{summary.total_customers}</p>
            </div>

            <div>
              <h2>Total Orders</h2>
              <p>{summary.total_orders}</p>
            </div>
          </div>


          <div>
            <h2>Low Stock Products</h2>

            {summary.low_stock_products.length === 0 ? (
              <p>No low-stock products.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {summary.low_stock_products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}


export default Dashboard;