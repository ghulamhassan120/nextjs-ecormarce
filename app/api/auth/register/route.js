import { SignJWT } from "jose";
import  ConnectDb  from "../../../../lib/db.js";
import { response } from "../../../../lib/helperFunction.js";
import { zSchema } from "../../../../lib/zodSchema.js";
import UserModel from "../../../../models/User.model.js";
import { sendMail } from "../../../../lib/sendmail.js";
import { emailVerificationLink } from "../../../../email/emailVerificationLink.js";
export async function POST(request) {
  try {
    await ConnectDb();
    // validationSchema zod
    const validationSchema = zSchema.pick({
      name: true,
      password: true,
      email: true,
    });
    // /payload
    const payload = await request.json();
    const validationData = validationSchema.safeParse(payload);
    // checked Data
    if (!validationData.success) {
      return response(
        false,
        401,
        "Invalid missing or input Field",
        validationData.error,
      );
    }
    // user add
    const { name, email, password } = validationData.data;
    // check User
    const checkUser = await UserModel.exists({ email });
    if (checkUser) {
      return response(true, 409, "User Already Exists");
    }
    // new user add db
    const newUser = new UserModel({
      name,
      email,
      password,
    });

    await newUser.save();

    // Token Create
    const secret = new TextEncoder().encode(process.env.SECRET);
    const token = await new SignJWT({ userId: newUser._id.toString() })
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

    return response(true,201,'Registration Success , Please verify your Email')
  } catch (error) {
     console.error("REGISTER ERROR:", error);

    return response(
      false,
      500,
      error.message || "Internal Server Error"
    );
  }
}

