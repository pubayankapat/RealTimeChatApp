/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocketContext=()=>{
    return useContext(SocketContext);
}

export const SocketContextProvider=({children})=>{
    const [socket , setSocket]= useState(null);
    const [onlineUser, setOnlineUser]=useState([]);
    const {authUser} = useAuth();
    
    useEffect(()=>{
        if(authUser){
            // In dev, connect directly to backend on localhost:3000
            // In production, connect to the same origin (proxied by Nginx)
            const SOCKET_URL = import.meta.env.DEV ? "http://localhost:3000" : undefined;

            const newSocket = io(SOCKET_URL,{
                path: "/socket.io",
                query:{
                    userId: authUser?._id,
                },
                transports: ["websocket", "polling"],

            })
            newSocket.on("getOnlineUsers",(users)=>{
                setOnlineUser(users)
            });
            setSocket(newSocket);
            return()=>newSocket.close();
        }else{
            // close any existing socket when authUser becomes null/undefined
            setSocket(prev => {
                if(prev){
                    prev.close();
                }
                return null;
            });
        }
    },[authUser]);
    return(
    <SocketContext.Provider value={{socket , onlineUser}}>
        {children}
    </SocketContext.Provider>
    )
}