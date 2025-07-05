import { NextRequest, NextResponse } from "next/server";
import { Budget } from "@/models/Budget";
import client from "@/lib/db";

export async function GET() {
  await client.connect();
  const budgets = await Budget.find();
  return NextResponse.json({ budgets });
}

export async function POST(req: NextRequest) {
  try {
    await client.connect();
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
