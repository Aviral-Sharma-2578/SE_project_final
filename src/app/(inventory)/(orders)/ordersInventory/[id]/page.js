"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const getInventoryById = async (id) => {
  try {
    console.log("going in");
    const res = await fetch(`/api/inventory/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch inventory");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const page = async ({ params }) => {
  let inventoryData = await getInventoryById(params.id);
  inventoryData = inventoryData.foundInventory;
  let orders = inventoryData.orders;
  if (!orders) {
    return <p>No orders.</p>;
  }
  console.log(inventoryData);
  return (
    <>
      {/* purchase_date: "",
    model: "",
    make: "",
    build_number: 0,
    quantity: 0,
    vendor: "", */}

      <div>
        <Link className="m-5" href={`/createOrderInventory/${params.id}`}>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <svg
              class="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M432 256c0 13.3-10.7 24-24 24h-136v136c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H24c-13.3 0-24-10.7-24-24s10.7-24 24-24h200V96c0-13.3 10.7-24 24-24s24 10.7 24 24v136h136c13.3 0 24 10.7 24 24z" />
            </svg>
            <span>CREATE ORDER</span>
          </button>
        </Link>
        <div className="overflow-hidden h-screen rounded-lg border border-gray-200 shadow-md m-5">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Purchase Date
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Model
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Make
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Build Number
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Vendor
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-medium text-gray-900"
                ></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {orders?.map((order, orderIndex) => (
                <tr className="hover:bg-gray-50">
                  <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                    <div class="text-sm">
                      <div className="font-medium text-gray-700">
                        {order.purchase_date}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{order.model}</td>
                  <td className="px-6 py-4">{order.make}</td>
                  <td className="px-6 py-4">{order.build_number}</td>
                  <td className="px-6 py-4">{order.quantity}</td>
                  <td className="px-6 py-4">{order.vendor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default page;
