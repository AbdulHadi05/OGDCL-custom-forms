import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import formsRouter from "./routes/forms.js";
import submissionsRouter from "./routes/submissions.js";
import approvalsRouter from "./routes/approvals.js";
import usersRouter from "./routes/users.js";
import testRouter from "./routes/test.js";
import { testConnection } from "./config/database.js";
import { validateAzureToken, optionalAuth } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Public routes (no authentication required)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Form Builder API is running",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Frontend-Backend communication is working!",
    timestamp: new Date().toISOString(),
    headers: req.headers["user-agent"] ? "Headers received" : "No headers",
  });
});

// Protected routes (authentication required)
app.use("/api/forms", validateAzureToken, formsRouter);
app.use("/api/submissions", validateAzureToken, submissionsRouter);
app.use("/api/approvals", validateAzureToken, approvalsRouter);
app.use("/api/users", validateAzureToken, usersRouter);
app.use("/api/test", testRouter);

// User profile endpoint
app.get("/api/user/profile", validateAzureToken, (req, res) => {
  res.json({
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Azure authentication enabled`);
  console.log(`Azure AD App Client ID: ${process.env.AZURE_CLIENT_ID}`);
  console.log(`Azure AD App Tenant ID: ${process.env.AZURE_TENANT_ID}`);

  // Test database connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log("⚠️  Server started but database connection failed.");
    console.log("Please check your Supabase configuration in .env file.");
  }
});
