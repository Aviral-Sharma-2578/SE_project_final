"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function UpdateInventory({ params }) {
  const router = useRouter();
  const { id } = params;
  const [inventory, setInventory] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    async function fetchInventory() {
      const response = await fetch(`/api/inventory/${id}`);
      const data = await response.json();
      console.log(data.foundInventory);
      setInventory(data.foundInventory);
      setFormData(data.foundInventory);
    }
    fetchInventory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });
      console.log("updated inventory");
      router.refresh();
      router.push("/showInventory");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(" inventory deleted");
      router.refresh();
      router.push("/showInventory");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!inventory) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-orange-50 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Update Inventory</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="inventory_name"
              className="block text-gray-700 font-semibold mb-1"
            >
              Item Name:
            </label>
            <input
              type="text"
              id="inventory_name"
              name="inventory_name"
              value={formData.inventory_name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-80 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold mb-1"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-80 focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="total_quantity"
              className="block text-gray-700 font-semibold mb-1"
            >
              Total Quantity:
            </label>
            <input
              type="number"
              id="total_quantity"
              name="total_quantity"
              value={formData.total_quantity}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-80 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="available_quantity"
              className="block text-gray-700 font-semibold mb-1"
            >
              Balance Quantity:
            </label>
            <input
              type="number"
              id="available_quantity"
              name="available_quantity"
              value={formData.available_quantity}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-80 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Inventory
          </button>
          <button
            onClick={handleDelete}
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
          >
            <button>Delete Item</button>
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateInventory;
