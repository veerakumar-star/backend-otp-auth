const express = require("express");
const cors = require("cors");
require("dotenv").config();

const rateLimit = require("express-rate-limit");

const app = express();

app.use(express.json());
app.use(cors());

// rate limit (avoid OTP spam)
app.use("/api/auth/send-otp", rateLimit({
  windowMs: 60 * 1000,
  max: 3
}));

app.use("/api/auth", require("./routes/authRoutes"));

module.exports = app;