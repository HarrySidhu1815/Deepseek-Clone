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

        // Prepare the chat data to be saved in the database

        const chatData = {
            name: "New Chat",
            messages: [],
            userId
        }

        // Connect to the database and create a new chat

        await connectDb()
        await Chat.create(chatData)

        return NextResponse.json({sucess: true, message: "Chat Created"})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}