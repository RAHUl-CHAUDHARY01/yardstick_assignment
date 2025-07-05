"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
};

type Budget = {
  _id: string;
  category: string;
  amount: number;
};

type BudgetVsActual = {
  category: string;
  budget: number;
  actual: number;
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

export default function DashboardPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category: "",
  });

  const [budgetInputs, setBudgetInputs] = useState<{ [key: string]: string }>({
    food: "",
    shop: "",
    rent: "",
    other: "",
  });

  const [categoryData, setCategoryData] = useState<
    { category: string; amount: number }[]
  >([]);
  const [budgetData, setBudgetData] = useState<BudgetVsActual[]>([]);
  const [recent, setRecent] = useState<Transaction | null>(null);

  const fetchData = async () => {
    const txnRes = await axios.get("/api/transactions");
    const budgetRes = await axios.get("/api/budgets");

    const txns: Transaction[] = txnRes.data.transactions;
    const budgets: Budget[] = budgetRes.data.budgets;

    setTransactions(txns);
    setBudgets(budgets);
    setRecent(txns[txns.length - 1]);

    const catMap: Record<string, number> = {};
    txns.forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

    setCategoryData(
      Object.entries(catMap).map(([category, amount]) => ({
        category,
        amount,
      }))
    );

    setBudgetData(
      budgets.map((b) => ({
        category: b.category,
        budget: b.amount,
        actual: catMap[b.category] || 0,
      }))
    );

    const inputs: { [key: string]: string } = {};
    budgets.forEach((b) => {
      inputs[b.category] = b.amount.toString();
    });
    setBudgetInputs((prev) => ({ ...prev, ...inputs }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = async () => {
    if (!form.amount || !form.date || !form.category) {
      toast("All fields are required.");
      return;
    }
    try {
      await axios.post("/api/transactions", {
        ...form,
        amount: parseFloat(form.amount),
      });
      toast("Transaction added!");
      setForm({ amount: "", description: "", date: "", category: "" });
      fetchData();
    } catch {
      toast("Failed to add transaction");
    }
  };

  return (
   <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
  {/* Header Controls */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <h1 className="text-2xl sm:text-3xl font-bold text-primary">Finance Dashboard</h1>
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Button variant="outline" onClick={() => router.push("/transactions")}>
        View All Transactions
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button>+ Add Transaction</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Amount"
              value={form.amount}
              type="number"
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <Select onValueChange={(val) => setForm({ ...form, category: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Category" />
              </SelectTrigger>
              <SelectContent>
                {["food", "shop", "rent", "other"].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="w-full" onClick={handleAddTransaction}>
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>

  {/* Total Expense */}
  <Card>
    <CardHeader>
      <CardTitle>Total Expenses</CardTitle>
    </CardHeader>
    <CardContent className="text-2xl font-bold text-primary">
      ₹{transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
    </CardContent>
  </Card>

  {/* Category Breakdown + Most Recent */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {categoryData.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Most Recent Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        {recent ? (
          <div className="space-y-2 text-sm sm:text-base">
            <p><strong>Amount:</strong> ₹{recent.amount}</p>
            <p><strong>Category:</strong> {recent.category}</p>
            <p><strong>Date:</strong> {recent.date.slice(0, 10)}</p>
            <p><strong>Description:</strong> {recent.description || "N/A"}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">No transactions yet.</p>
        )}
      </CardContent>
    </Card>
  </div>

  {/* Budget vs Actual */}
  <Card>
    <CardHeader>
      <CardTitle>Budget vs Actual</CardTitle>
    </CardHeader>
    <CardContent className="overflow-x-auto">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={budgetData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="budget" fill="#8884d8" />
          <Bar dataKey="actual" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>

  {/* Budget Form */}
  <Card>
    <CardHeader>
      <CardTitle>Set / Edit Budgets</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {["food", "shop", "rent", "other"].map((category) => {
          const current = budgets.find((b) => b.category === category);

          const handleSave = async () => {
            const amountStr = budgetInputs[category];
            if (!amountStr) {
              toast("Please enter amount");
              return;
            }

            const payload = {
              category,
              amount: parseFloat(amountStr),
            };

            try {
              if (current) {
                await axios.put(`/api/budgets/${current._id}`, payload);
              } else {
                await axios.post("/api/budgets", payload);
              }
              toast(`Budget saved for ${category}`);
              fetchData();
            } catch {
              toast("Failed to save budget");
            }
          };

          return (
            <Card key={category} className="p-4 space-y-2 shadow-sm border">
              <h3 className="font-semibold capitalize">{category}</h3>
              <Input
                type="number"
                placeholder="Enter amount"
                value={budgetInputs[category] || ""}
                onChange={(e) =>
                  setBudgetInputs((prev) => ({
                    ...prev,
                    [category]: e.target.value,
                  }))
                }
              />
              <Button onClick={handleSave} className="w-full">
                Save Budget
              </Button>
            </Card>
          );
        })}
      </div>
    </CardContent>
  </Card>
</div>

  );
}
