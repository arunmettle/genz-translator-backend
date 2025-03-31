import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import translateRouter from "./routes/translate";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from your frontend origin
const allowedOrigins = ['http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
  credentials: true,
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Register all routes
app.use("/translate", translateRouter);

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Custom-Header');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
