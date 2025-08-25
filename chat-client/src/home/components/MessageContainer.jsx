import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { TiMessages } from "react-icons/ti";
import userConversation from '../../zustans/useConversation';
import { IoArrowBackSharp, IoSend } from 'react-icons/io5';


const MessageContainer = () => {

  const { messages, selectedConversation, setSelectedConversation } = userConversation();
  const { authUser } = useAuth();
  const onBackUser = () =>{

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
        </>
      )}
    </div>
  )
}
export default MessageContainer
