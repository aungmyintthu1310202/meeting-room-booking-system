import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "owner", "user"], default: "user" },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;