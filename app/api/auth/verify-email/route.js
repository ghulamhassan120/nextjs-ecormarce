import { jwtVerify } from "jose";
import ConnectDb from "../../../../lib/db";
import { CatchError, Response } from "../../../../lib/helperFunction";
import UserModel from "../../../../models/User.model";

export async function POST(request) {
  try {
    await ConnectDb();
    const { token } = await request.json();

    if (!token) {
      return Response(false, 400, "Missing token");
    }
    // Verify Token 
    const secret = new TextEncoder().encode(process.env.SECRET);
    const decoded = await jwtVerify(token, secret);
    console.log(decoded);
    
    const userId=decoded.payload.userId

    const user =await UserModel.findById(userId)
    if (!user) {
        return Response(false,404,"User Not Found")
    }

    user.isEmailVerified=true
    await user.save()


    return Response(true,200,'Email verifiation success')
  } catch (error) {
    return CatchError(error)
  }
}
