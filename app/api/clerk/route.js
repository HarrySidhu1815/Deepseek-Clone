import { Webhook } from "svix";
import connectDb from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req){
    const wh = new Webhook(process.env.SIGNING_SECRET)
    const headerPayload = await headers()
    const svixHeaders = {
        "svix-id" : headerPayload.get("svix-id"),
        "svix-timestamp" : headerPayload.get('svix-timestamp'),
        "svix-signature" : headerPayload.get('svix-signature')
    }

    // Get the Payload and verify it
    const payload = await req.json()
    const body = JSON.stringify(payload)
    const {data, type} = wh.verify(body, svixHeaders)

    //Prepare the user data to be saved in database

    const userData = {
        _id : data.id,
        name: `${data.first_name} ${data.last_name}`,
        email_address: data.email_addresses[0].email_address,
        image_url: data.image_url
    }

    await connectDb()

    switch (type) {
        case 'user.created':
            await User.create(userData)
            break;

        case 'user.updated':
            await User.findByIdAndUpdate(data.id, userData)
            break;

        case 'user.deleted':
            await User.findByIdAndDelete(data.id)
            break;
    
        default:
            break;
    }

    return NextResponse.json({message: "Event Received"})
}