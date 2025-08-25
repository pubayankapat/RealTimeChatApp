import React from 'react';
import { useState } from 'react';
import SideBar from './components/SideBar';
import MessageContainer from './components/MessageContainer';

export const Home = () => {

    const [selectedUser, setSelectedUser] = useState(null);
    const [isSidebarVisible, setIsSidebarVisible] = useState(null);

    const handelUserSelect = (user) => {
        setSelectedUser(user);
        setIsSidebarVisible(false);
    }

    const handelShowSidebar = () => {
        setIsSidebarVisible(true);
        setSelectedUser(null);
    }

    return (
        <>
            <div className='flex justify-between min-w-full
            md:min-w-[800px] md:max-w-[85%]
            px-2 h-[95%] md:h-full  
            rounded-xl 
            shadow-lg
            bg-gray-320 
            bg-clip-padding
            backdrop-filter 
            backdrop-blur-lg 
            bg-opacity-0'>
                <div className={`w-full py-2 md:flex ${isSidebarVisible ? '' : 'hidden'}`}>
                    <SideBar onSelectUser={handelUserSelect} />
                </div>
                <div className={`divider divider-horizontal px-3 md:flex ${isSidebarVisible ? '' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}></div>
                <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} bg-gray-200}`}>
                    <MessageContainer onBackUser={handelShowSidebar} />
                </div>
            </div>
        </>
    );
};