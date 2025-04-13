import Chat from "@/models/Chat";
import connectDb from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const { userId } = getAuth(req)
        const { chatId } = await req.json()

        if(!userId){
            return NextResponse.json({sucess: false, message: "User not Authorized"})
        }

        // Connect to the database and delete the chat

        await connectDb()
        await Chat.deleteOne({_id: chatId, userId})

        return NextResponse.json({sucess: true, message: "Chat Deleted"})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}