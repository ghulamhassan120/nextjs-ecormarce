import mongoose from "mongoose";

const OtpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type:String,
        required:true,
        default:()=>new Date(Data.now() + 10 * 60 * 1000)
    },
},{timestamps:true})

OtpSchema.index({expiresAt:1},{expireAfterSeconds:0})
const OTPModel=mongoose.models.OTP || mongoose.model("OTP",OtpSchema,"otps")
export default OTPModel