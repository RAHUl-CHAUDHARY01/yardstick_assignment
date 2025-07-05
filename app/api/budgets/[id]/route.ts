import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Budget } from "@/models/Budget";

// 👇 Instead of manually typing `context`, import RouteHandlerContext type
import type { NextApiRequest } from "next";
import type { NextRequestWithParams } from "@/types/next";

// You can safely use this signature:
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    await dbConnect();
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
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    await dbConnect();
    await Budget.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error deleting budget" }, { status: 500 });
  }
}
