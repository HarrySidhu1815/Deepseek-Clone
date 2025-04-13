import Chat from "@/models/Chat";
import connectDb from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        const { userId } = getAuth(req)

        if(!userId){
            return NextResponse.json({sucess: false, message: "User not Authorized"})
        }

        // Connect to the database and fetch all chats for the user

        await connectDb()
        const data = await Chat.find({userId})

        return NextResponse.json({success: true, data})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}