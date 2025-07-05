import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IBudget extends Document {
  category: string;
  amount: number;
}

const BudgetSchema = new Schema<IBudget>(
  {
    category: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Budget =
  models.Budget || model<IBudget>("Budget", BudgetSchema);
