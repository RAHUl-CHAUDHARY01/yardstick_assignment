import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Invalid/Missing env variable: MONGODB_URI");
}

const uri = process.env.MONGODB_URI;

let isConnected = false;

const client = {
  connect: async () => {
    if (isConnected) return;

    try {
      await mongoose.connect(uri!, {
        dbName: "yardstick", // optional, use if your DB name is fixed
      });
      isConnected = true;
      console.log("✅ Mongoose connected");
    } catch (err) {
      console.error("❌ Mongoose connection failed:", err);
      throw err;
    }
  },
};

export default client;
