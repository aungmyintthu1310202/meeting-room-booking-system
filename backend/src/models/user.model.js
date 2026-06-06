import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "owner", "user"], default: "user" },
});

const User = mongoose.model("User", userSchema);

export default User;