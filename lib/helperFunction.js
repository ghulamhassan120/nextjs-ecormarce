import { NextResponse } from "next/server"

export const Response=(success,statusCode,message,data={})=>{
    return NextResponse.json(
        success,statusCode,message,data
    )
}
export const CatchError=(error,CustomError)=>{
    return NextResponse.json(
        
    )
}