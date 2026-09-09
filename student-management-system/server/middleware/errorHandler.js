export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error("[error]", err.message);

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(" ") });
  }

  // Duplicate key (unique index) errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ message: `That ${field} is already in use.` });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Something went wrong on the server.",
  });
}
