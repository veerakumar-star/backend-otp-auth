const router = require("express").Router();
const { sendOtp, verifyOtp, protected } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/protected", authMiddleware, protected);

module.exports = router;