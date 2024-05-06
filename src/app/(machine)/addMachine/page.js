"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UpdateMachine from "../updateMachine/[id]/page";
import mongoose from "mongoose";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequireAuth from "@/app/(components)/RequireAuth";

const MachineForm = () => {
  const defaultFormData = {
    machine_name: "",
    description: "",
    available_quantity: "",
    total_quantity: "",
    category: "",
  };
  const router = useRouter();
  const [formData, setFormData] = useState(defaultFormData);
  const [hasParent, setHasParent] = useState(false);
  const [machines, setMachines] = useState([]);
  const [parentMachine, setParentMachine] = useState(null);
  const [selectedMachineId, setSelectedMachineId] = useState(null);

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
    const getMachine = async () => {
      const response = await fetch("/api/machine", {
        method: "GET",
      });

      const data = await response.json();
      const names = data.map((item) => ({
        name: item.machine_name,
        id: item._id,
      }));
      setMachines(names);
    };
    getMachine();
  }, []);

  useEffect(() => {
    console.log("affected");
    if (parentMachine) {
      updateMachine();
    }
  }, [parentMachine]);

  const handleMachineChange = async (e) => {
    const id = e.target.value;
    setSelectedMachineId(id);
    console.log(selectedMachineId);
  };

  const updateMachine = async () => {
    console.log(parentMachine);
    console.log(parentMachine._id);
    const res = await fetch(`/api/machine/${parentMachine._id}`, {
      method: "PUT",
      body: JSON.stringify({ formData: parentMachine }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    if (!res.ok) {
      throw new Error("Failed to update machine.");
    }
    router.refresh();
    router.push("/showMachine");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    formData.available_quantity = formData.total_quantity;
    const res = await fetch("/api/machine", {
      method: "POST",
      body: JSON.stringify({ formData }),
      "Content-Type": "application/json",
    });
    if (res.ok) {
      console.log("machine created");
      const created_machine = await res.json();
      if (selectedMachineId) {
        console.log(selectedMachineId);
        const response = await fetch(`api/machine/${selectedMachineId}`);
        let result = await response.json();
        console.log(result);
        result = result.foundMachine;
        result.subparts.push({
          machine_id: new mongoose.Types.ObjectId(created_machine.id),
        });
        console.log(result);
        setParentMachine(result);
        toast.success("Machine Added Successfully");
      }
    } else {
      toast.error("Something went wrong! Try again");
      throw new Error("Failed to create machine");
    }
    router.refresh();
    router.push("/showMachine");
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <ToastContainer />
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-2xl sm:p-20">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-bold text-3xl text-gray-900">
                  Enter Machine Details
                </h2>
              </div>
              <form
                onSubmit={handleSubmit}
                className="form space-y-4 text-gray-700 sm:text-lg sm:leading-7"
              >
                <div className="form-group">
                  <label
                    htmlFor="machine_name"
                    className="text-s font-semibold px-1"
                  >
                    Machine Name:
                  </label>
                  <input
                    type="text"
                    name="machine_name"
                    value={formData.machine_name}
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
                <div className="flex mb-3">
                  <div className="mb-4">
                    <label
                      className="block text-s font-semibold"
                      htmlFor="inventory_id"
                    >
                      Category:
                    </label>
                    <select
                      className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      id="inventory_id"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select Category</option>
                      <option value="electronicStudio">
                        Electronic Studio Design
                      </option>
                      <option value="mechanicalStudio">
                        Mechanical Studio
                      </option>
                      <option value="fabricationStudio">
                        Precision Fabrication
                      </option>
                      <option value="manufacturingStudio">
                        Advanced Manufacturing Studio
                      </option>
                      <option value="robotics&Drone">
                        Robotics and Drone Studio
                      </option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="text-s font-semibold px-1">
                    <input
                      type="checkbox"
                      name="hasSubparts"
                      checked={hasParent}
                      onChange={handleChange}
                      className="w-4 h-4 mr-2"
                    />
                    <span>Has Parent?</span>
                  </label>
                  {hasParent && (
                    <div className="mt-2">
                      <label className="text-s font-semibold px-1">
                        Select Parent
                      </label>
                      <select
                        className="w-full ml-0 pl-1 pr-3 py-1 rounded-lg border-2 border-gray-300 outline-none focus:border-indigo-500"
                        value={selectedMachineId || ""}
                        onChange={handleMachineChange}
                      >
                        <option value="">Select Machine</option>
                        {machines.map((machine) => (
                          <option key={machine.id} value={machine.id}>
                            {machine.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
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
    </RequireAuth>
  );
};

export default MachineForm;
