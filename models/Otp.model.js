import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },

  otp: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: String,
    required: true,
    default: function () {
      return new Date(Date.now() + 10 * 60 * 1000);
    },
  },
});

OtpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);
const OTPModel =
  mongoose.models.OTP ||
  mongoose.model("OTP", OtpSchema, "otps");

export default OTPModel;