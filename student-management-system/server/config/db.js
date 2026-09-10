import mongoose from "mongoose";

/**
 * Connects to MongoDB using MONGO_URI from the environment.
 * Designed to work with a Joytree-hosted MongoDB cluster/instance,
 * but works with any valid Mongo connection string (Atlas, self-hosted, etc.)
 */
export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(
      "[db] MONGO_URI is not set. Add it to server/.env (see .env.example)."
    );
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  // Helpful connection lifecycle logs
  mongoose.connection.on("connected", () => {
    console.log(`[db] Mongoose connected -> ${mongoose.connection.host}/${mongoose.connection.name}`);
  });

  mongoose.connection.on("error", (err) => {
    console.error("[db] Mongoose connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] Mongoose disconnected.");
  });

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("[db] MongoDB handshake successful.");
  } catch (err) {
    console.error("[db] Initial MongoDB connection failed:", err.message);
    console.error(
      "[db] Double-check your Joytree MONGO_URI, network/IP allowlist, and credentials."
    );
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
