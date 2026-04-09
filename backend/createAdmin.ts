import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { connectDB } from "./config/db";
import { UserModel } from "./models/User";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mangbalitrip.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@2025!";
const ADMIN_NAME = "Super Admin";

async function createAdmin() {
  await connectDB();

  const existing = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role === "admin") {
      console.log(`✅ Admin already exists: ${ADMIN_EMAIL}`);
    } else {
      existing.role = "admin";
      await existing.save();
      console.log(`✅ Upgraded ${ADMIN_EMAIL} to admin role`);
    }
    process.exit(0);
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await UserModel.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashed,
    role: "admin",
  });

  console.log(`✅ Admin account created`);
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`\n⚠️  Change the password after first login!`);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
