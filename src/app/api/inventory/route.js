import Inventory from "@/app/models/inventory";
import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const inventory = await Inventory.find();
    // console.log(inventory);
    return Response.json(inventory);
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    console.log("lol");
    const body = await req.json();
    console.log("problem");
    const inventoryData = body.formData;

    const result = await Inventory.create(inventoryData);

    return NextResponse.json(
      { message: "inventory Created", id: result._id },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
