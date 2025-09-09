import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TiMessages } from "react-icons/ti";
import userConversation from '../../zustans/useConversation';
import { IoArrowBackSharp, IoSend } from 'react-icons/io5';
import axios from 'axios';


const MessageContainer = () => {

  const { messages, selectedConversation, setMessage, setSelectedConversation } = userConversation();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMessage = async () => {
      setLoading(true);
      try {
        const get = await axios.get(`/api/message/${selectedConversation._id}`);
        const data = get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setMessage(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }


    if (selectedConversation?._id) getMessage()
  }, [selectedConversation?._id, setMessage])
  console.log(messages);

  const onBackUser = () => {

  }
  return (
    <div className='md:min-w-[500px] h-[99%] flex flex-col py-2'>
      {selectedConversation === null ? (
        <>
          <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center text-2xl text-gray-300 font-semibold 
            flex flex-col items-center gap-2'>
              <p className='text-2xl'>Welcome!!👋{authUser.username}😉</p>
              <p className="text-lg">Select a chat to start messaging</p>
              <TiMessages className='text-6xl text-center' />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12'>
            <div className='flex gap-2 md:justify-between items-center w-full'>
              <div className='md:hidden ml-1 self-center'>
                <button onClick={() => onBackUser(true)} className='bg-black rounded-full px-2 py-1
                  self-center'>
                  <IoArrowBackSharp size={25} />
                </button>
              </div>
              <div className='flex justify-between mr-2 gap-2'>
                <div className='self-center'>
                  <img className='rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer' src={selectedConversation?.profilepic} />
                </div>
                <span className='text-gray-950 self-center text-sm md:text-xl font-bold'>
                  {selectedConversation?.username}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center 
                gap-4 bg-transparent">
                <div className="loading loading-spinner"></div>
              </div>
            )}
            {!loading && messages?.length === 0 && (
              <p className='text-center text-white items-center'>Send a message to start Conversation</p>
            )}
            {!loading && messages?.length > 0 && messages?.map((message) =>(
              
              <div className={`chat ${message.senderId === authUser._id ? 'chat-end':'chat-start'}`}>
                <div className = 'chat-image avatar'></div>
                <div className={`chat-bubble ${message.senderId === authUser._id ? 'bg-sky-600':''}`}>
                  {message?.message}
                </div>
                <div className='chat-footer text-[10px] opacity-80 text-white'>
                  {new Date(message?.createdAt).toLocaleDateString('en-In')}
                  {new Date(message?.createdAt).toLocaleDateString('en-In',{hour:'numeric',minute:'numeric'})}

                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
export default MessageContainer
