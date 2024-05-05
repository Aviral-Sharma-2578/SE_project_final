"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = ({ params }) => {
  const router = useRouter();
  // Assuming 'params.id' is the dynamic part of the route

  const defaultOrder = {
    purchase_date: new Date().toISOString().split("T")[0],
    model: "",
    make: "",
    build_number: 0,
    quantity: 0,
    vendor: "",
  };

  let [orderFormData, setOrderFormData] = useState(defaultOrder);
  let [formData, setFormData] = useState(null);

  useEffect(() => {
    const getInventoryById = async () => {
      console.log(params.id);
      if (params.id) {
        // Make sure the params.id is not undefined
        try {
          const res = await fetch(`/api/inventory/${params.id}`, {
            cache: "no-store",
          });

          if (!res.ok) {
            throw new Error("Failed to fetch inventory");
          }

          const data = await res.json();
          setFormData(data.foundInventory);
          console.log(formData);
        } catch (error) {
          console.error(error);
        }
      }
    };

    getInventoryById();
  }, []); // This effect runs when 'params.id' changes

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "purchase_date") {
      const dateObject = new Date(value);
      const dateString = dateObject.toISOString().split("T")[0];
      console.log(dateString);
      setOrderFormData((prevData) => ({
        ...prevData,
        [name]: dateString,
      }));
    } else {
      setOrderFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    formData.orders.push(orderFormData);
    formData.total_quantity += orderFormData.quantity;
    formData.available_quantity += orderFormData.quantity;
    console.log(orderFormData);

    fetch(`/api/inventory/${params.id}`, {
      // Make sure to use 'params.id' from 'router.query'
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formData }),
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Something went wrong! Try again");
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Order added successfully");
        console.log("updated inventory order", data);
        router.refresh(); // 'router.refresh()' is not a function in Next.js, use 'router.reload()' instead
        router.push(`/ordersInventory/${params.id}`);
      })
      .catch((error) => {
        toast.error("Something went wrong! Try again");
        console.error("Error:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <ToastContainer />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-bold text-3xl text-gray-900">
                Enter Order Details
              </h2>
            </div>
            <form
              className="form space-y-4 text-gray-700 sm:text-lg sm:leading-7"
              method="post"
              onSubmit={handleSubmit}
            >
              {/* purchase_date: "23/23/23",
    model: "Hey",
    make: "Here",
    build_number: 38940,
    quantity: 34,
    vendor: "Nfie", */}
              <div className="mb-4">
                <label
                  className="block text-s font-semibold"
                  htmlFor="due_date"
                >
                  Purchase Date
                </label>
                <input
                  className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  type="date"
                  id="due_date"
                  name="purchase_date"
                  value={orderFormData.purchase_date}
                  onChange={handleChange}
                />
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-3">
                  <label className="text-s font-semibold px-1" htmlFor="model">
                    Model
                  </label>
                  <input
                    className="w-full ml-0 pl-1 pr-3 py-2 rounded-lg border-2 border-gray-300 outline-none focus:border-indigo-500"
                    id="model"
                    name="model"
                    type="text"
                    value={orderFormData.model}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-3">
                  <label className="text-s font-semibold px-1" htmlFor="make">
                    Make
                  </label>
                  <input
                    className="w-full ml-0 pl-1 pr-3 py-2 rounded-lg border-2 border-gray-300 outline-none focus:border-indigo-500"
                    id="make"
                    name="make"
                    type="text"
                    value={orderFormData.make}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-3">
                  <label
                    className="text-s font-semibold px-1"
                    htmlFor="build_number"
                  >
                    Build Number
                  </label>
                  <input
                    className="w-full ml-0 pl-1 pr-3 py-2 rounded-lg border-2 border-gray-300 outline-none focus:border-indigo-500"
                    id="build_number"
                    name="build_number"
                    type="number"
                    min={0}
                    value={orderFormData.build_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-3">
                  <label
                    className="text-s font-semibold px-1"
                    htmlFor="quantity"
                  >
                    Quantity
                  </label>
                  <input
                    className="w-full ml-0 pl-1 pr-3 py-2 rounded-lg border-2 border-gray-300 outline-none focus:border-indigo-500"
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={0}
                    value={orderFormData.quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-3">
                  <label className="text-s font-semibold px-1" htmlFor="vendor">
                    Vendor
                  </label>
                  <input
                    className="w-full ml-0 pl-1 pr-3 py-2 rounded-lg border-2 border-gray-300 outline-none focus:border-indigo-500"
                    id="vendor"
                    name="vendor"
                    type="text"
                    value={orderFormData.vendor}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mt-5">
                  <button
                    className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                    type="submit"
                  >
                    Add Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
