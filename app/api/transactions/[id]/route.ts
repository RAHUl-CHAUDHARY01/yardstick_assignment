import dbConnect from "@/lib/db";
import { Transaction } from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await Transaction.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}
