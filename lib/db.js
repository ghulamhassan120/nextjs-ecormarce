import mongoose from 'mongoose'
import dns from 'node:dns'

dns.setServers(['8.8.8.8','1.1.1.1'])
const MONGO_URI=process.env.MONGODB_URI

let cached=global.mongoose

if (!cached) {
    cached=global.mongoose={
        conn:null,
        promise:null
    }
}

 const ConnectDb=async()=>{
    try {
        if (cached.conn) {
            return cached.conn
        }
    
        if (!cached.promise) {
            cached.promise=mongoose.connect(MONGO_URI,{
                dbName:"nextjs-ecommarce",
                bufferCommands:false
            })
        }
    
        cached.conn=await cached.promise
        return cached.conn
        
    } catch (error) {
        console.log(error.message);
        
    }
}

export default ConnectDb