export const maxDuration = 60
import connectDb from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
});

export async function POST(req){
    try {
        const { userId } = getAuth(req)
    
        // Fetch the chatID and prompt from the request
        const {chatId, prompt} = await req.json()
    
        if(!userId){
            return NextResponse.json({success: false, message: "User not authorized"})
        }
    
        // Connect to the database and fetch the chat document based on userId and ChatId
        await connectDb()
        const data = await Chat.findOne({_id: chatId, userId})
    
        // Create the user message object
        const userPrompt = {
            role: 'user',
            content: prompt,
            timestamp: Date.now()
        }
    
        data.messages.push(userPrompt)
    
        // Call the Deepseek API to get chat response
    
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "deepseek-chat",
            store: true
          });
        
        const message = completion.choices[0].message
        message.timestamp = Date.now()
        data.messages.push(message)
        data.save()
    
        return NextResponse.json({success: true, data: message})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }

}