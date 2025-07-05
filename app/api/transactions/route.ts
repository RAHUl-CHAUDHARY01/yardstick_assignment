import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Transaction } from "@/models/Transaction";

export async function GET() {
  await dbConnect();
  const transactions = await Transaction.find().sort({ date: 1 });
  return NextResponse.json({ transactions });
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { amount, date, category, description } = body;

    if (!amount || !date || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transaction = await Transaction.create({
      amount,
      date,
      category,
      description,
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
