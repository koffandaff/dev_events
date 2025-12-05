import mongoose from 'mongoose'
import { cache } from 'react';
import { buffer } from 'stream/consumers';

// Cache type
type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Extend gloval object to include our mongoose cache
declare global{
    var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

// Validate if it exits
if(!MONGODB_URI){
    throw new Error(
        'Please define the monogdb uriin env.local'
    )
}

// initialize ehe cache on global objext 
let cached: MongooseCache = global.mongoose || {conn: null, promise: null}

if(!global.mongoose){
    global.mongoose= cached
}

async function connectDB(): Promise<typeof mongoose> {
    if(cached.conn){
        return cached.conn
    }
    if(!cached.promise){
        const options={
            bufferCommands: false, // disable mongo bufffering
        }

        // new connection
        cached.promise = mongoose.connect(MONGODB_URI!,options).then((mongoose) => {
            return mongoose
        })
    }

    try{
        //wait
        cached.conn = await cached.promise;
    } catch (error){
        cached.promise = null;
        throw error
    }
    console.log("connection created at: ", cached.conn)
    return cached.conn;

}

export default connectDB;