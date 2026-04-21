const generateOTP = require("../utils/generateOTP");

const OTP_STORE = {}; // in-memory

function createOTP(identifier) {
  const otp = generateOTP();

  OTP_STORE[identifier] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000, // 5 min
    attempts: 0
  };

  return otp;
}

function verifyOTP(identifier, enteredOtp) {
  const record = OTP_STORE[identifier];

  if (!record) return { ok: false, msg: "No OTP found" };

  if (record.expires < Date.now()) {
    delete OTP_STORE[identifier];
    return { ok: false, msg: "OTP expired" };
  }

  record.attempts++;
  if (record.attempts > 5) {
    delete OTP_STORE[identifier];
    return { ok: false, msg: "Too many attempts" };
  }

  if (record.otp != enteredOtp) {
    return { ok: false, msg: "Invalid OTP" };
  }

  delete OTP_STORE[identifier];
  return { ok: true };
}

module.exports = { createOTP, verifyOTP };