import { useEffect, useState } from "react";
import "./index.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    qnt: "",
  });

  const [editMode, setEditMode] = useState(false);

  // =========================
  // GET ALL PRODUCTS
  // =========================

  const getProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Load products when page opens
  useEffect(() => {
    getProducts();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // =========================
  // ADD PRODUCT
  // =========================

  const addProduct = async (event) => {
    event.preventDefault();

    const product = {
      id: Number(formData.id),
      name: formData.name,
      price: Number(formData.price),
      qnt: Number(formData.qnt),
    };

    try {
      const response = await fetch(`${API_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        alert("Product added successfully");

        clearForm();

        getProducts();
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // =========================
  // EDIT BUTTON
  // =========================

  const editProduct = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      qnt: product.qnt,
    });

    setEditMode(true);
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const updateProduct = async (event) => {
    event.preventDefault();

    const product = {
      id: Number(formData.id),
      name: formData.name,
      price: Number(formData.price),
      qnt: Number(formData.qnt),
    };

    try {
      const response = await fetch(
        `${API_URL}/product/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      if (response.ok) {
        alert("Product updated successfully");

        clearForm();

        getProducts();
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/product/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Product deleted successfully");

        getProducts();
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // =========================
  // CLEAR FORM
  // =========================

  const clearForm = () => {
    setFormData({
      id: "",
      name: "",
      price: "",
      qnt: "",
    });

    setEditMode(false);
  };

  return (
    <div className="container">

      <h1>Product Management</h1>

      {/* ================= FORM ================= */}

      <div className="form-container">

        <h2>
          {editMode ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={editMode ? updateProduct : addProduct}>

          <input
            type="number"
            name="id"
            placeholder="Product ID"
            value={formData.id}
            onChange={handleChange}
            disabled={editMode}
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="qnt"
            placeholder="Quantity"
            value={formData.qnt}
            onChange={handleChange}
            required
          />

          <div className="form-buttons">

            <button type="submit" className="add-button">
              {editMode ? "Update Product" : "Add Product"}
            </button>

            {editMode && (
              <button
                type="button"
                className="cancel-button"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* ================= PRODUCTS ================= */}

      <div className="products-container">

        <h2>Products</h2>

        {products.length === 0 ? (

          <p>No products found.</p>

        ) : (

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {products.map((product) => (

                <tr key={product.id}>

                  <td>{product.id}</td>

                  <td>{product.name}</td>

                  <td>₹{product.price}</td>

                  <td>{product.qnt}</td>

                  <td>

                    <button
                      className="edit-button"
                      onClick={() => editProduct(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default App;