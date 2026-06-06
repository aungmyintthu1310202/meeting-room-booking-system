import dotenv from "dotenv";
import bcrypt from "bcrypt";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import User from "./src/models/user.model.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create a default admin user if no users exist
const createDefaultAdmin = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create({ name: "Aung Myint Thu", role: "admin" });
    console.log("Default admin created: Aung Myint Thu/admin");
  }
};

connectDB().then(async () => {
  await createDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
