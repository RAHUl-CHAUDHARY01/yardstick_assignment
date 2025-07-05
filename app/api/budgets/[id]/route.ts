import dbConnect from "@/lib/db";
import { Budget } from "@/models/Budget";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }

    const updated = await Budget.findByIdAndUpdate(
      params.id,
      { amount },
      { new: true }
    );

    return NextResponse.json({ updated });
  } catch (err) {
    console.log(err);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await Budget.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Error deleting budget" }, { status: 500 });
  }
}
