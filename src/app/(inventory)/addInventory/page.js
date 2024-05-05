"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UpdateInventory from "../../(components)/UpdateForm";
import mongoose from "mongoose";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryForm = () => {
  const defaultFormData = {
    inventory_name: "",
    description: "",
    available_quantity: "",
    total_quantity: "",
    category: "",
  };
  const router = useRouter();
  const [formData, setFormData] = useState(defaultFormData);
  const [hasParent, setHasParent] = useState(false);
  const [inventorys, setInventorys] = useState([]);
  const [parentInventory, setParentInventory] = useState(null);
  const [selectedInventoryId, setSelectedInventoryId] = useState(null);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const type = e.target.type;
    if (type === "checkbox") {
      setHasParent(e.target.checked);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const getInventory = async () => {
      const response = await fetch("/api/inventory", {
        method: "GET",
      });

      const data = await response.json();
      const names = data.map((item) => ({
        name: item.inventory_name,
        id: item._id,
      }));
      setInventorys(names);
    };
    getInventory();
  }, []);

  useEffect(() => {
    console.log("affected");
    if (parentInventory) {
      updateInventory();
    }
  }, [parentInventory]);

  const handleInventoryChange = async (e) => {
    const id = e.target.value;
    setSelectedInventoryId(id);
    console.log(selectedInventoryId);
  };

  const updateInventory = async () => {
    console.log(parentInventory);
    console.log(parentInventory._id);
    const res = await fetch(
      `http://https://vercel-se.vercel.app/api/inventory/${parentInventory._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ formData: parentInventory }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
    if (!res.ok) {
      throw new Error("Failed to update inventory.");
    }
    router.refresh();
    router.push("/showInventory");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    formData.available_quantity = formData.total_quantity;
    const res = await fetch("/api/inventory", {
      method: "POST",
      body: JSON.stringify({ formData }),
      "Content-Type": "application/json",
    });
    if (res.ok) {
      console.log("inventory created");
      const created_inventory = await res.json();
      if (selectedInventoryId) {
        console.log(formData);
        console.log(selectedInventoryId);
        const response = await fetch(`api/inventory/${selectedInventoryId}`);
        let result = await response.json();
        console.log(result);
        result = result.foundInventory;
        result.subparts.push({
          inventory_id: new mongoose.Types.ObjectId(created_inventory.id),
        });
        console.log(result);
        setParentInventory(result);
      }
    } else {
      throw new Error("Failed to create inventory");
    }
    router.refresh();
    router.push("/showInventory");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <ToastContainer />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-2xl sm:p-20">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-bold text-3xl text-gray-900">
                Enter Inventory Details
              </h2>
            </div>
            <form
              onSubmit={handleSubmit}
              className="form space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            >
              <div className="form-group">
                <label
                  htmlFor="inventory_name"
                  className="text-s font-semibold px-1"
                >
                  Component Name:
                </label>
                <input
                  type="text"
                  name="inventory_name"
                  value={formData.inventory_name}
                  onChange={handleChange}
                  required
                  className="w-full ml-0 pl-1 pr-3 py-1 rounded-lg border-2 border-gray-300 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="description"
                  className="text-s font-semibold px-1"
                >
                  Description:
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full ml-0 pl-1 pr-3 py-1 rounded-lg border-2 border-gray-300 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex -mx-3 mb-3">
                <div className="w-1/2 px-3 mb-5">
                  <label
                    htmlFor="total_quantity"
                    className="text-s font-semibold px-1"
                  >
                    Total Quantity:
                  </label>
                  <input
                    type="number"
                    name="total_quantity"
                    value={formData.total_quantity}
                    onChange={handleChange}
                    min={0}
                    required
                    className="w-full ml-0 pl-1 pr-3 py-1 rounded-lg border-2 border-gray-300 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-s font-semibold"
                  htmlFor="inventory_id"
                >
                  Category
                </label>
                <select
                  className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  id="inventory_id"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="consumable">consumable</option>
                  <option value="non-consumable">Non-consumable</option>
                </select>
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-2 font-semibold"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryForm;
