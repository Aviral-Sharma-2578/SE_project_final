import Inventory from "@/app/models/inventory";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  const foundInventory = await Inventory.findOne({ _id: id });
  return NextResponse.json({ foundInventory }, { status: 200 });
}

export async function PUT(req, { params }) {
  try {
    console.log("update dfjksdfa");
    const { id } = params;
    const body = await req.json();
    console.log(body);
    const updatedInventoryData = await Inventory.findByIdAndUpdate(id, {
      ...body.formData,
    });
    return NextResponse.json({ success: true, data: updatedInventoryData });
  } catch (err) {
    // Handle errors
    console.error(err);
    return NextResponse.json({ success: false, error: "Server Error" });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await Inventory.findByIdAndDelete(id);
    return NextResponse.json({ message: "Inventory Deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
