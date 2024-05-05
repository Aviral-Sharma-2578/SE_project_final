import Person from "@/app/models/person";
import Issue from "@/app/models/issue";
import Inventory from "@/app/models/inventory";
import { NextResponse } from "next/server";

export async function PUT(req, res) {
  try {
    console.log("okkkkkkkkkkk");
    const { userId, issueId } = await req.json();
    // console.log(issueId);
    const person = await Person.findById(userId);
    const issue = await Issue.findById(issueId);
    //  console.log(issue);
    const inventory_id = issue.inventory_id;
    //  console.log(inventory_id)
    const inventory = await Inventory.findById(inventory_id);
    // console.log(inventory);

    if (!person) {
      return NextResponse.json(
        { message: "person not found" },
        { status: 500 }
      );
    }
    console.log(person.current);
    if (issue.is_returnable) {
      inventory.available_quantity = inventory.available_quantity + 1;
    }
    inventory.save();
    const currentIssueIndex = person.current.findIndex(
      (item) => item.issue_id.toString() === issueId.toString()
    );
    console.log(currentIssueIndex);
    if (currentIssueIndex === -1) {
      return NextResponse.json({ message: "issue not found" }, { status: 500 });
    }
    // const currentIssueIndex=0;
    const movedIssue = person.current.splice(currentIssueIndex, 1)[0];
    person.completed.push(movedIssue);
    console.log(person.completed);

    await person.save();

    return NextResponse.json(
      { message: "Issue moved to completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
