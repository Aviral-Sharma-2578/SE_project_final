"use client";
import { React, useState, useEffect } from "react";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import HistoryIcon from "@mui/icons-material/History";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useRouter } from "next/navigation";
import RequireAuth from "@/app/(components)/RequireAuth";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  CloseIcon,
  Divider,
} from "@mui/material";

const page = () => {
  let [persons, setPersons] = useState(null);
  let [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  let [machineDetailsArray, setMachineDetailsArray] = useState([]);
  let [completedMachineDetailsArray, setcompletedMachineDetailsArray] =
    useState([]);
  let [personData, setPersonData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const router = useRouter();

  useEffect(() => {
    const getPersons = async () => {
      const response = await fetch("/api/Persons", {
        method: "GET",
      });

      const data = await response.json();
      setPersons(data);
      setPersonData(data);
    };
    getPersons();
    console.log(personData);
    console.log(persons);
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const filterData = (searchText, category) => {
    let newData = personData;
    if (searchText) {
      const lowercaseSearchText = searchText.toLowerCase();
      newData = newData.filter(
        (item) =>
          item.email_id.toLowerCase().includes(lowercaseSearchText) ||
          item.person_name.toLowerCase().includes(lowercaseSearchText) ||
          item.mobile_number.toLowerCase().includes(lowercaseSearchText)
      );
    }
    if (category) {
      newData = newData.filter((item) => item.category === category);
    }
    console.log(newData);
    return newData;
  };

  useEffect(() => {
    const results = filterData(searchText, selectedCategory);
    setSearchResults(results);
  }, [searchText, selectedCategory, personData]);

  const handleSelect = (selectedItem) => {
    setSearchText(selectedItem.email_id);
  };

  useEffect(() => {
    const fetchMachineDetails = async (items, setter) => {
      const details = await Promise.all(
        items.map(async (item) => {
          try {
            const machineDetails = await handleGetIssueDetails(item.issue_id);
            return {
              itemId: item.issue_id,
              machineDetails: machineDetails,
            };
          } catch (error) {
            console.error(
              "Error fetching machine details for item:",
              item,
              error
            );
            return null; // or handle error differently
          }
        })
      );
      setter(details.filter(Boolean)); // This will exclude any null values
    };

    if (selectedPerson) {
      fetchMachineDetails(selectedPerson.current, setMachineDetailsArray).catch(
        console.error
      );

      fetchMachineDetails(
        selectedPerson.completed,
        setcompletedMachineDetailsArray
      ).catch(console.error);
    }
  }, [selectedPerson]);

  useEffect(() => {
    console.log(machineDetailsArray);
  }, [machineDetailsArray]);
  useEffect(() => {
    console.log(machineDetailsArray);
  }, [completedMachineDetailsArray]);

  const handlePopupOpen = (person) => {
    setSelectedPerson(person);
    setSelectedPersonId(person._id);
    console.log(person);
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    setSelectedPerson(null);
    setSelectedPersonId(null);
    setOpenPopup(false);
  };

  const handleEmailSend = async (userId, issueId) => {
    console.log(userId);
    const formData = { userId: userId, issueId: issueId };
    const res = await fetch(`/api/mail`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (res.ok) {
    }
    router.refresh();
  };
  const handleCurrentIssue = async (userId, issueId) => {
    console.log(userId);
    console.log(issueId);
    const formData = { userId: userId, issueId: issueId };
    const res = await fetch(`/api/updateIssue`, {
      method: "PUT",
      body: JSON.stringify(formData),
    });
    router.refresh();
    router.push("/dashboard");
  };

  async function handleGetIssueDetails(issueId) {
    // PART-1: Fetch issue details
    const res = await fetch(`/api/Issues/${issueId}`, {
      method: "GET",
    });
    const data = await res.json();

    // Check if the response contains the necessary data
    if (!data || !data.foundIssue || !data.foundIssue.machine_id) {
      throw new Error(
        "The response from /api/Issues does not contain the expected data."
      );
    }

    // PART-2: Fetch machine details using the machine_id from PART-1
    const machine_id = data.foundIssue.machine_id;
    const machineResponse = await fetch(`/api/machine/${machine_id}`, {
      method: "GET",
    });
    const machineData = await machineResponse.json();

    // Return the combined data
    return {
      machineName: machineData.foundMachine.machine_name,
      is_returnable: data.foundIssue.is_returnable,
      due_date: data.foundIssue.due_date,
    };
  }

  return (
    <>
      <RequireAuth>
        <div className="mb-2 mt-4">
          <input
            type="text"
            placeholder="Search By Name ,Email.. "
            value={searchText}
            onChange={handleSearchChange}
            className="w-80 px-4 py-2 ml-5  border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="ml-4 px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Category</option>
            <option value="ug">Undergraduate</option>
            <option value="pg">Postgraduate</option>
            <option value="phd">PHD</option>
            <option value="prof">Professor</option>
            <option value="other">Others</option>
          </select>
        </div>

        <div className="overflow-hidden h-screen rounded-lg border border-gray-200 shadow-md m-5 mt-2">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Current_Status
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Mobile No
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {searchResults.length > 0 ? (
                searchResults.map((person, personIndex) => (
                  <tr className="hover:bg-gray-50" key={person._id}>
                    <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                      <div class="text-sm">
                        <div className="font-medium text-gray-700">
                          {person.person_name}
                        </div>
                        <div className="text-gray-400">{person.email_id}</div>
                      </div>
                    </th>
                    <td className="px-6 py-4">
                      {person.current.length > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                          Cleared
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{person.mobile_number}</td>
                    <td className="px-3 py-4 ">
                      <div className="flex justify-start gap-4">
                        <Link href={`/deletePerson/${person._id}`}>
                          <DeleteIcon></DeleteIcon>
                        </Link>
                        <Link
                          x-data="{ tooltip: 'Edite' }"
                          href={`/updatePerson/${person._id}`}
                        >
                          <EditIcon></EditIcon>
                        </Link>
                        <button onClick={() => handlePopupOpen(person)}>
                          <HistoryIcon> </HistoryIcon>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4">
                    <div className="flex justify-center items-center h-full mt-8 text-lg">
                      No Result Found
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Dialog
            open={openPopup}
            onClose={handlePopupOpen}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {selectedPerson && selectedPerson.person_name}'s Details
              <IconButton
                onClick={handlePopupClose}
                aria-label="close"
              ></IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2">Current Issued Machines:</Typography>
              <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Machine Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {machineDetailsArray &&
                    machineDetailsArray.map((item, index) => (
                      <tr className="hover:bg-gray-50">
                        <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                          <div class="text-sm">
                            <div className="font-medium text-gray-700">
                              {item.machineDetails.machineName}
                            </div>
                          </div>
                        </th>
                        <td className="px-6 py-4">
                          {item.machineDetails.is_returnable
                            ? "Non-Consumable"
                            : "Consumable"}
                        </td>
                        <td className="py-4 ">
                          <div className="flex justify-start">
                            {item.machineDetails.is_returnable ? (
                              <Button
                                onClick={() => {
                                  handlePopupClose();
                                  handleEmailSend(
                                    selectedPersonId,
                                    item.itemId
                                  );
                                }}
                              >
                                <EmailIcon />
                              </Button>
                            ) : (
                              <span></span>
                            )}
                            <Button
                              onClick={() => {
                                handlePopupClose();
                                handleCurrentIssue(
                                  selectedPersonId,
                                  item.itemId
                                );
                              }}
                            >
                              <DeleteIcon />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <br />
              <Divider />
              <br />
              <Typography variant="body2">Completed Items:</Typography>
              <ul>
                {completedMachineDetailsArray &&
                  completedMachineDetailsArray.map((item, index) => (
                    <li key={index}>
                      <span className="mr-4">
                        Machine Name: {item.machineDetails.machineName}
                      </span>
                    </li>
                  ))}
              </ul>
            </DialogContent>
            <DialogActions>
              <Button onClick={handlePopupClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </RequireAuth>
    </>
  );
};

export default page;
