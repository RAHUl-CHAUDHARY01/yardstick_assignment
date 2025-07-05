import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ITransaction extends Document {
  amount: number;
  description?: string;
  date: string;
  category: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export const Transaction =
  models.Transaction || model<ITransaction>("Transaction", TransactionSchema);
