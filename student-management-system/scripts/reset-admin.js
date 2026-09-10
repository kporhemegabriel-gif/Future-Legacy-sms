/**
 * One-off admin recovery script.
 *
 * Usage (run from your own computer, with Node.js installed):
 *
 *   1. cd into the `server` folder (it needs the `mongoose` package that's
 *      already in server/node_modules, or run `npm install` first).
 *   2. Set your MONGO_URI as an environment variable, or just paste it
 *      directly into the MONGO_URI constant below.
 *   3. Run one of:
 *        node ../scripts/reset-admin.js list
 *        node ../scripts/reset-admin.js delete admin@example.com
 *        node ../scripts/reset-admin.js delete-all
 *
 * "list"        -> prints every admin's email/name/role (no passwords shown)
 * "delete"      -> deletes ONE admin by email, so you can sign up fresh
 * "delete-all"  -> deletes every admin account, so the app shows
 *                  "Create Admin Account" again on next load
 */

import mongoose from "mongoose";

// Paste your Joytree MongoDB connection string here if you don't want to
// set it as an environment variable.
const MONGO_URI = process.env.MONGO_URI || "PASTE_YOUR_MONGO_URI_HERE";

const adminSchema = new mongoose.Schema({}, { strict: false });
const Admin = mongoose.model("Admin", adminSchema, "admins");

async function main() {
  const [, , command, arg] = process.argv;

  if (!MONGO_URI || MONGO_URI === "PASTE_YOUR_MONGO_URI_HERE") {
    console.error("Set MONGO_URI (env var or edit this file) before running.");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB.");

  if (command === "list") {
    const admins = await Admin.find({}, "fullName email role").lean();
    if (!admins.length) {
      console.log("No admin accounts exist.");
    } else {
      console.log("Existing admins:");
      admins.forEach((a) => console.log(`  - ${a.email}  (${a.fullName}, ${a.role})`));
    }
  } else if (command === "delete") {
    if (!arg) {
      console.error("Usage: node reset-admin.js delete <email>");
    } else {
      const result = await Admin.deleteOne({ email: arg.toLowerCase().trim() });
      console.log(
        result.deletedCount
          ? `Deleted admin with email ${arg}.`
          : `No admin found with email ${arg}.`
      );
    }
  } else if (command === "delete-all") {
    const result = await Admin.deleteMany({});
    console.log(`Deleted ${result.deletedCount} admin account(s). The app will show "Create Admin Account" again.`);
  } else {
    console.log("Usage:");
    console.log("  node reset-admin.js list");
    console.log("  node reset-admin.js delete <email>");
    console.log("  node reset-admin.js delete-all");
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
