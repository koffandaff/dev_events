import connectDB from "@/lib/mongodb";
import {v2 as cloudianry} from 'cloudinary'
import { NextRequest, NextResponse } from "next/server";
import Event from '@/database/event.model'
import { error } from "console";

export async function POST(req: NextRequest){
    try{
        await connectDB();

        const formdata = await req.formData();

        let event

        try{
            event =Object.fromEntries(formdata.entries())
        }catch(e){
            return NextResponse.json({message: 'Invalid JSON data Format'}, {status: 400})
        }
        const file = formdata.get('image') as File;
        if(!file){
            return NextResponse.json({message: 'Image File is required'}, {status: 400})
        }
        console.log("file",file)
        const arrayBuffer  = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer)

        const uploadResult = await new Promise((resolve,reject) => {
            cloudianry.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent'},(error,results)=>{
                if(error) return reject(error);

                resolve(results)
            }).end(buffer);
        })

        event.image = (uploadResult as {secure_url: string }).secure_url;
        const createdEvent = await Event.create(event);

        return NextResponse.json({message: 'Event Created successfully', event: createdEvent}, {status: 201})
    }catch(e){
        console.error(e);
        return NextResponse.json({message: "event Creatoon Failed", error: e  instanceof Error? e.message: 'unknown'}, {status: 400})
    }
}

export async function GET() {
    try{
        await connectDB();
        const events = await Event.find().sort({createdAt: -1})

        return NextResponse.json({message: 'Event Listed Successfully', events: events}, {status: 200})
    }catch (e){
        return NextResponse.json({message: 'Event Fetching Failed', error: e}, {status: 500})
    }
}