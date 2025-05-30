import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import addressRoutes from "./routes/address";
import leadRoutes from "./routes/leads";


const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:5173"];
const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

app.use("/api/address", addressRoutes);

app.use("/api/leads", leadRoutes);

app.get("/", (_, res) => {
  res.send("Engrity server is running");
});

// Optional: catch-all and error handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log("Environment:", process.env.NODE_ENV || "development");
});
