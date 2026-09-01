import { jwtVerify, SignJWT } from "jose";
import ConnectDb from "../../../../lib/db";
import { CatchError, response } from "../../../../lib/helperFunction";
import UserModel from "../../../../models/User.model";
import { zSchema } from "../../../../lib/zodSchema";
import OTPModel from "../../../../models/Otp.model";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await ConnectDb();
    const payload =await request.json()
    const validationSchema=zSchema.pick({
        otp:true,
        email:true
    })

    const validationData=validationSchema.safeParse(payload)
    if (!validationData.success) {
        return response(false,401,'Invalid or missing input field',validationData.error)
    }

    const {email,otp}=validationData.data

    const getOtpData=await OTPModel.findOne({email,otp})
      if (!getOtpData) {
        return response(false,404,'Invalid or expire otp')
    }

    const getUser=await UserModel.findOne({deleteAt:null,email})
      if (!getUser) {
        return response(false,404,'user not Found')
    }

    const loggedInUserData={
        _id:getUser._id,
        role:getUser.role,
        name:getUser.name,
        avatar:getUser.avatar,

    }

    const secret=new TextEncoder().encode(process.env.SECRET)
    const token=new SignJWT(loggedInUserData)
    .setIssuedAt()
    .setExpirationTime('24h')
    .setProtectedHeader({alg:'HS256'})
    .sign(secret)

    const cookieStore=await cookies()
    cookieStore.set({
        name:"access-token",
        value:token,
        httpOnly:process.env.NODE_ENV==='production',
        path:'/',
        secure:process.env.NODE_ENV==='production',
        sameSite:'lax'
    })

    await getOtpData.deleteOne()
            return response(true,200,'Login Successfully',loggedInUserData)

  } catch (error) {
    return CatchError(error)
  }
}
