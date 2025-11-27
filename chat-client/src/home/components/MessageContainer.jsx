import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TiMessages } from "react-icons/ti";
import userConversation from '../../zustans/useConversation';
import { IoArrowBackSharp, IoSend } from 'react-icons/io5';
import { HiOutlineEmojiHappy } from "react-icons/hi";
import EmojiPicker from "emoji-picker-react";
import axios from 'axios';
import { useSocketContext } from '../../context/SocketContext';
import notify from '../../assets/notification.mp3';
import dp from '../../assets/dp.jpg'

const MessageContainer = ({ onBackUser }) => {

  const { messages, selectedConversation, setMessage } = userConversation();
  const [showEmoji, setShowEmoji] = useState(false);
  const { socket } = useSocketContext();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState('');
  const lastMessageRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessage([...messages, newMessage])
    })
    return () => socket?.off("newMessage");
  }, [socket, setMessage, messages])

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behaviour: "smooth" })
    }, 100)
  }, [messages])

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
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    if (showEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmoji]);

  const handleEmojiClick = (emojiData) => {
    setSendData((prev) => prev + emojiData.emoji);
  };

  const handelMessage = (e) => {
    setSendData(e.target.value);
  }

  // Enter -> send, Shift+Enter -> newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handelSubmit(e);
    }
  }

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) return; // don't send empty messages

    setSending(true);
    try {
      const res = await axios.post(`/api/message/send/${selectedConversation?._id}`, { message: sendData });
      const data = await res.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      } else {
        setSending(false);
        setMessage([...messages, data]);
        setSendData('');
      }
    } catch (error) {
      setSending(false);
      console.log(error);
    }
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
                  <img className='rounded-full object-cover w-6 h-6 md:w-10 md:h-10 cursor-pointer' src={selectedConversation?.profilepic || dp} />
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
            {!loading && messages?.length > 0 && messages?.map((message) => (
              <div className='text-white' key={message?._id} ref={lastMessageRef}>
                <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
                  <div className='chat-image avatar'></div>
                  <div className={`chat-bubble ${message.senderId === authUser._id ? 'bg-sky-600' : ''}`}>
                    {message?.message}
                  </div>
                  <div className='chat-footer text-[10px] opacity-80 text-white'>
                    {new Date(message?.createdAt).toLocaleDateString('en-In', { hour: 'numeric', minute: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='rounded-full text-black'>
            <div className='w-full rounded-full flex item-centre bg-white'>
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className="text-2xl p-1 hover:text-blue-500 hover:scale-110">
                <HiOutlineEmojiHappy size={25}/>
              </button>
              {showEmoji && (
                <div ref={pickerRef} className="absolute bottom-14 left-2 z-50">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <textarea
                value={sendData}
                onChange={handelMessage}
                onKeyDown={handleKeyDown}
                required
                id='message'
                rows={1}
                className='w-full bg-transparent outline-none px-4 rounded-full resize-none'
              />
              <button type='submit' onClick={handelSubmit}>
                {sending ? <div className='loading loading-spinner'></div> : <IoSend size={25} className='text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1 hover:scale-110' />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
export default MessageContainer
