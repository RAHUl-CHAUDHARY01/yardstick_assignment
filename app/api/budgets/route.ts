import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Budget } from "@/models/Budget";

export async function GET() {
  await dbConnect();
  const budgets = await Budget.find();
  return NextResponse.json({ budgets });
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { category, amount } = body;

    if (!category || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const budget = await Budget.create({ category, amount });

    return NextResponse.json({ budget }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
