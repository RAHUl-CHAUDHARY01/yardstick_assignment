"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
};

const categoryColors: Record<string, string> = {
  food: "bg-emerald-100 text-emerald-800",
  shop: "bg-indigo-100 text-indigo-800",
  rent: "bg-rose-100 text-rose-800",
  other: "bg-yellow-100 text-yellow-800",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  const fetchTransactions = async () => {
    const res = await axios.get("/api/transactions");
    setTransactions(res.data.transactions);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      toast("Transaction deleted");
      fetchTransactions();
    } catch (err) {
        console.log(err);
      toast("Could not delete transaction");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">All Transactions</h1>
          <p className="text-muted-foreground text-sm">
            Review and manage all your personal transactions here.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          ← Back to Dashboard
        </Button>
      </div>

      {/* Transactions */}
      {transactions.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          No transactions yet. Add some from the dashboard.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions
            .slice()
            .reverse()
            .map((txn) => (
              <Card
                key={txn._id}
                className="transition hover:shadow-md hover:-translate-y-[1px]"
              >
                <CardHeader className="flex flex-row justify-between items-start gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      ₹{txn.amount.toFixed(2)}
                      <Badge
                        className={`capitalize text-xs px-2 py-1 rounded ${categoryColors[txn.category] || "bg-gray-100 text-gray-800"}`}
                      >
                        {txn.category}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(txn.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(txn._id)}
                  >
                    Delete
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {txn.description || <i>No description</i>}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
