import client from "@/lib/db";
import { Transaction } from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest,
   { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  try {
    await client.connect();
    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}
