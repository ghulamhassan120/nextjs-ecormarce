import { User2Icon } from "lucide-react";
import ConnectDb from "../../../../lib/db";
import { CatchError, GernateOTP, response } from "../../../../lib/helperFunction";
import { zSchema } from "../../../../lib/zodSchema";
import UserModel from "../../../../models/User.model";
import OTPModel from "../../../../models/Otp.model";
import { sendMail } from "../../../../lib/sendmail";
import { otpEmail } from "../../../../email/otpEmail";

export async function POST(request) {
  try {
    await ConnectDb();

    const payload = await request.json();
    const validationSchema = zSchema.pick({ email: true });
    const validationData = validationSchema.safeParse(payload);

    if (!validationData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field",
        validationData.error,
      );
    }
    const {email}= validationData.data
    const getUser = await UserModel.findOne({ email });
    if (!getUser) {
      return response(false, 404, "User Not Found");
    }

    // remove otp old
    await OTPModel.deleteMany({email})

    const otp=GernateOTP()
    const newOtpData=new OTPModel({
        email,otp
    })

    await newOtpData.save()

    const otpSendStatus=await sendMail('your login verification code ',email,otpEmail(otp))
     if (!otpSendStatus.success) {
      return response(false, 400, "Faild to resend Otp");
    }

      return response(true, 200, "OTP Send Successfully");
  } catch (error) {
    return CatchError(error);
  }
}
