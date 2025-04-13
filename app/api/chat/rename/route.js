import Chat from "@/models/Chat";
import connectDb from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const { userId } = getAuth(req)

        if(!userId){
            return NextResponse.json({sucess: false, message: "User not Authorized"})
        }

        const {chatId, name} = await req.json()

        // Connect to the database and update the chat name
        await connectDb()
        await Chat.findOneAndUpdate({_id: chatId, userId},{name})

        return NextResponse.json({sucess: true, message: "Chat Renamed"})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}