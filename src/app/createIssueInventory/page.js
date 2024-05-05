"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  const router = useRouter();

  const defaultFormData = {
    issue_id: "0",
    inventory_id: "0",
    person_id: "0",
    is_returnable: true,
    due_date: new Date().toISOString().split("T")[0],
    order_is_completed: false,
    description: "",
  };

  let [formData, setFormData] = useState(defaultFormData);
  let [selectedPerson, setSelectedPerson] = useState(null);
  let [selectedInventory, setSelectedInventory] = useState(null);
  let [selectedInventory1, setSelectedInventory1] = useState(null);
  let [inventorys, setInventorys] = useState([]);
  let [inventorysNew, setInventorysNew] = useState([]);
  let [issue_id, set_issue_id] = useState(null);
  let [persons, setPersons] = useState([]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      const dateObject = new Date(value);
      const dateString = dateObject.toISOString().split("T")[0];
      console.log(dateString);
      setFormData((prevData) => ({
        ...prevData,
        [name]: dateString,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const updatePerson = async (person) => {
    const res = await fetch(`/api/Persons/${person._id}`, {
      method: "PUT",
      body: JSON.stringify({ formData: person }),
      //@ts-ignore
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(formData.due_date);
    console.log(res);
    if (!res.ok) {
      throw new Error("Failed to update person.");
    }
  };
  const updateInventory = async (inventory) => {
    const res = await fetch(`/api/inventory/${inventory._id}`, {
      method: "PUT",
      body: JSON.stringify({ formData: inventory }),
      //@ts-ignore
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(formData.due_date);
    console.log(res);
    if (!res.ok) {
      throw new Error("Failed to update person.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/Issues", {
      method: "POST",
      body: JSON.stringify({ formData }),

      "Content-Type": "application/json",
    });

    if (res.ok) {
      const issue = await res.json();
      console.log(issue);
      setSelectedPerson((prevPerson) => {
        const updatedPerson = {
          ...prevPerson,
          current: [...prevPerson.current, { issue_id: issue.id }],
        };
        updatePerson(updatedPerson); // This will now be called after state is updated

        return updatedPerson;
      });
      setSelectedInventory1((prevInventory) => {
        const updatedInventory = {
          ...prevInventory,
          available_quantity: prevInventory.available_quantity - 1,
        };
        updateInventory(updatedInventory); // This will now be called after state is updated
        // toast.success("Issue Created Successfully")
        return updatedInventory;
        toast.success("Issue Created Successfully");
      });
    } else {
      toast.error("Something went wrong! Try again");
      throw new Error("Failed to create ticket");
    }

    router.refresh();
    router.push("/showPerson");
  };

  useEffect(() => {
    const names = [];
    const getInventory = async () => {
      const response = await fetch("/api/inventory", {
        method: "GET",
      });

      const data = await response.json();
      setInventorysNew(data);
      for (let i = 0; i < data.length; i++) {
        names.push({ name: data[i].inventory_name, id: data[i]._id });
      }
      inventorys = names;
      setInventorys(inventorys);
    };

    const getPersons = async () => {
      const response = await fetch("/api/Persons", {
        method: "GET",
      });

      const data = await response.json();
      persons = data;
      setPersons(persons);
    };
   

    getInventory();
    getPersons();
  }, []);

  const handleInventoryChange = (event) => {
    const selectedInventoryId = event.target.value;
    const selectedInventoryObject = inventorys.find(
      (inventory) => inventory.id === selectedInventoryId
    );
    const selectedInventoryObject1 = inventorysNew.find(
      (inventory) => inventory._id === selectedInventoryId
    );
    console.log(selectedInventoryId);
    setFormData({ ...formData, inventory_id: selectedInventoryId });
    console.log("++_+", formData);
    selectedInventory = selectedInventoryObject;
    setSelectedInventory1(selectedInventoryObject1);
    setSelectedInventory(selectedInventory);
  };

  const handlePersonChange = (event) => {
    const selectedPersonId = event.target.value;
    console.log("++_+", formData);
    const selectedPersonObject = persons.find(
      (person) => person._id === selectedPersonId
    );
    selectedPerson = selectedPersonObject;
    setFormData({ ...formData, person_id: selectedPersonObject._id });
    setSelectedPerson(selectedPerson);
    console.log("++", formData);
  };
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <ToastContainer />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-2xl sm:p-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl text-gray-900 text-center mb-8 font-bold">
              Enter Issue Details
            </h2>
          </div>
          <form
            className="space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            method="post"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-s font-semibold"
                htmlFor="inventory_id"
              >
                Inventory 
              </label>
              <select
                className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                id="inventory_id"
                value={selectedInventory?.id || ""}
                onChange={handleInventoryChange}
              >
                <option value="">Select Item</option>
                {inventorys.map((inventory) => (
                  <option key={inventory.id} value={inventory.id}>
                    {inventory.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-s font-semibold" htmlFor="person_id">
                Person ID
              </label>
              <select
                className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                id="person_id"
                value={selectedPerson?._id || ""}
                onChange={handlePersonChange}
              >
                <option value="">Select Person</option>
                {persons.map((person) => (
                  <option key={person._id} value={person._id}>
                    {person.email_id}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-s font-semibold"
                htmlFor="is_returnable"
              >
                Is Returnable
              </label>
              <select
                className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                id="is_returnable"
                name="is_returnable"
                value={formData.is_returnable}
                onChange={handleChange}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                className="block text-s font-semibold"
                htmlFor="description"
              >
                Description
              </label>
              <input
                className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-s font-semibold" htmlFor="due_date">
                Due Date
              </label>
              <input
                className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div> */}
            <div className="text-center">
              <button
                className="w-full py-3 px-6 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                type="submit"
              >
                Create Issue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
