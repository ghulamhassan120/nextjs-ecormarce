import { SignJWT } from "jose";
import ConnectDb from "../../../../lib/db";
import { CatchError, GernateOTP } from "../../../../lib/helperFunction";
import { zSchema } from "../../../../lib/zodSchema";
import UserModel from "../../../../models/User.model";
import { sendMail } from "../../../../lib/sendmail";
import { emailVerificationLink } from "../../../../email/emailVerificationLink.js";
import OTPModel from "../../../../models/Otp.model.js";
import { otpEmail } from "../../../../email/otpEmail.js";

export async function POST(request) {
  try {
    await ConnectDb();
    const payload = await request.json();
    const validationSchema = zSchema
      .pick({
        email: true,
      })
      .extend({
        password: z.string(),
      });

    const validationData = validationSchema.safeParse(payload);
    // checked Data
    if (!validationData.success) {
      return Response(
        false,
        401,
        "Invalid missing or input Field",
        validationData.error,
      );
    }

    const { email, password } = validationData.data;
    // GET USER DATA
    const getUser = await UserModel.findOne({ email });
    if (!getUser) {
      return Response(false, 401, "Invalid Login Credentials");
    }

    if (!getUser.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET);
      const token = await new SignJWT({ userId: getUser._id.toString() })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      // EMAIL SEND VERIFIED
      await sendMail(
        "Email Verification request from Ghulam Hassan",
        email,
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URI}/auth/verify-email/${token}`,
        ),
      );

      return Response(
        false,
        401,
        "Your email is not verified .We have sent a verification link to your registered email address",
      );
    }

    // check Password 
    const isPasswordVerified = await getUser.comparePassword(password);
    if (!isPasswordVerified) {
      return Response(false, 401, "Invalid Login Credentials");
    }

    // otp check 
    await OTPModel.deleteMany({email})

    const otp = GernateOTP()
    const newOtpData=new OTPModel({
        email,
        otp
    })

    await newOtpData.save()

    const otpEmailStatus=await sendMail('Your Login verification Code',email,otpEmail(otp))
     if (!otpEmailStatus) {
      return Response(false, 401, "Failed to send OTP");
    }
      return Response(false, 200, "Please verify your device ");

  } catch (error) {
    return CatchError(error);
  }
}
