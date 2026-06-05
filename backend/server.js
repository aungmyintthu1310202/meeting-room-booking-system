import dotenv from "dotenv";
import bcrypt from "bcrypt";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import User from "./src/models/user.model.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const createDefaultAdmin = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({ name: "Admin", password: hashed, role: "admin" });
    console.log("Default admin created: admin/admin123");
  }
};

connectDB().then(async () => {
  await createDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
