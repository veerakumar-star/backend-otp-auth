const transporter = require("../config/mailer");
const { createOTP, verifyOTP } = require("../services/otpService");
const jwt = require("jsonwebtoken");

exports.sendOtp = async (req, res) => {
  try {
    console.log("➡️ Incoming request:", req.body);

    const { email } = req.body;

    if (!email) {
      console.log("❌ Email missing");
      return res.status(400).json({ error: "Email required" });
    }

    const otp = createOTP(email);
    console.log("🔢 Generated OTP:", otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`
    });

    console.log("✅ Email sent successfully");

    res.json({ message: "OTP sent" });

  } catch (err) {
    console.error("🔥 ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const result = verifyOTP(email, otp);

  if (!result.ok) {
    return res.status(400).json({ error: result.msg });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  res.json({ token });
};

exports.protected = (req, res) => {
  res.json({ message: "Protected data access granted ✅", user: req.user });
};