import { NextResponse } from "next/server"

export const response=(success,statusCode,message,data={})=>{
    return NextResponse.json( {
      success,
      message,
      data,
    },
    {
      status: statusCode,
    })
}
export const CatchError=(error,CustomMessage)=>{
   if (error.code===11000) {
        const keys=Object.keys(error.keyPattern).join(',')
        error.message=`Duplicate fields ${keys}. These fields value must be unique`
   }

   let errorObj={}

   if (process.env.NODE_ENV==="development") {
        errorObj={
            message:error.message,
            error
        }
   } else {
      errorObj={
            message:CustomMessage || "Internal server Error",
        }
   }


   return NextResponse.json({success:false,statusCode:error.code,...errorObj})
}

export const GernateOTP=()=>{
  const otp=Math.floor(100000 + Math.random() * 900000).toString()
  return otp
}