'use client'

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext()

export const useAppContext = () => { return useContext(AppContext)}

export const AppContextProvider = ({children}) => {
    const {user} = useUser()
    const {getToken} = useAuth()

    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)

    const createNewChat = async () => {
        try {
            if(!user) return null

            const token = await getToken()

            await axios.post('/api/chat/create', {} , {headers: {
                Authorization: `Bearer ${token}`
            }})

            fetchUsersChat()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUsersChat = async () => {
        try {
            const token = await getToken()
            const {data} = await axios.get('/api/chat/get', {headers: {
                Authorization: `Bearer ${token}`
            }})
            if(data.success){
                console.log(data.data)
                setChats(data.data)

                // If the user has zero chats, create one
                if(data.data.length === 0){
                    await createNewChat()
                    return fetchUsersChat()
                } else {
                    // sort the chats by the updated date
                    data.data.sort((a,b) => new Date (b.updatedAt) - new Date (a.updatedAt))

                    // set recently updated chat as selectedChat
                    setSelectedChat(data.data[0])
                    console.log(data.data[0])
                }

            } else {
                toast.error(data.message)
                console.log(data)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if(user){
            fetchUsersChat()
            
        }
    }, [user])

    const value = {
        user,
        setChats,
        chats,
        selectedChat,
        setSelectedChat,
        createNewChat,
        fetchUsersChat
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}