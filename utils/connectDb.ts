import mongoose from "mongoose";

export default async function connectDb() {
  await mongoose.connect(process.env.DB_URL!);
  return true;
}
