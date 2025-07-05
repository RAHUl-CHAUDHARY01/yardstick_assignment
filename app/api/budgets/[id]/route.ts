import client from "@/lib/db";
import { Budget } from "@/models/Budget";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

  const id = (await params).id;

  try {
    await client.connect();
    const body = await req.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }

    const updated = await Budget.findByIdAndUpdate(id, { amount }, { new: true });

    return NextResponse.json({ updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{id:string}> }
) {
  const {id} = await params;

  try {
    await client.connect();
    await Budget.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error deleting budget" }, { status: 500 });
  }
}