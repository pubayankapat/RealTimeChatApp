import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FiMoreVertical } from "react-icons/fi";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import userConversation from '../../zustans/useConversation';
import { useSocketContext } from '../../context/SocketContext';
import dp from '../../assets/dp.jpg'

const SideBar = ({ onSelectUser }) => {
    const navigate = useNavigate();
    const { authUser } = useAuth()
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [ newMessageUsers, setNewMessageUsers ] = useState('');
    const { messages, setSelectedConversation } = userConversation();
    const { onlineUser, socket } = useSocketContext();

     useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/user/currentchatters`);
                const data = response.data;

                if (data.success === false) {
                    console.log(data.message);
                } else {
                    setChatUser(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        chatUserHandler()

    }, []);

    //chat function 
    const nowChatOnline = chatUser.map((user) => (user._id));
    const isChatOnline = nowChatOnline.map((userId) => onlineUser.includes(userId));
    
    // Search function
    const nowSearchOnline = searchUser.map((user) => (user._id))
    const isSearchOnline = nowSearchOnline.map((userId) => onlineUser.includes(userId))

    useEffect(()=>{
        socket?.on("newMessage",(newMessage)=>{
          setNewMessageUsers(newMessage)          
        })
        return ()=> socket?.off("newMessage");
      },[socket, messages])
    
  


    const handelSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`)
            const data = search.data;
            if (data.success === false) {
                setLoading(false)
                console.log(data.message);
            }
            setLoading(false)
            if (data.length === 0) {
                toast.info("User Not Found")
            }
            else {
                setSearchUser(data);
                setSearchInput('');
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }


    const handelUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSelectedUserId(user._id);
        setNewMessageUsers('');
    }

    const handelSearchback = () => {
        setSearchUser([]);
        setSearchInput('');
    }


    return (
        <div className='h-full w-auto px-1'>
            <div className='flex justify-between gap-2'>
                <button className='hover:scale-120 hover:cursor-pointer'>
                    <FiMoreVertical size={25}/>
                </button>
                <form onSubmit={handelSearchSubmit} className='w-auto flex items-center justify-between bg-white rounded-full text-gray-900'>
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        className='px-4 w-auto bg-none outline-none rounded-full'
                        placeholder='Search User'
                        id='search'
                    />
                    <button type="submit" className='btn btn-circle bg-sky-700 hover:bg-gray-900 text-white hover:scale-110'>
                        <FaMagnifyingGlass size={20} />
                    </button>
                </form>
                <img onClick={() => navigate('/profile')}
                    src={authUser.profilepic || dp}
                    className='self-center h-10 w-10 object-cover contain-size rounded-full hover:scale-120 hover:cursor-pointer' />
            </div>
            <div className='divider px-3'></div>
            {searchUser?.length > 0 ? (
                <>
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
                        <div className='w-auto'>
                            {searchUser.map((user, index) => (
                                <div key={user._id}>
                                    <div
                                        onClick={() => handelUserClick(user)}
                                        className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user?._id ? 'bg-sky-500' : ''} `}>
                                        {/* Socket is online */}
                                        <div className= {`avatar ${isSearchOnline[index] ? 'avatar-online' : ''}`}>
                                            <div className="w-10 rounded-full">
                                                <img src={user.profilepic || dp} alt="user.img" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col flex-1'>
                                            <p className='font-bold text-gray-950'>{user.username}</p>
                                        </div>
                                    </div>
                                    <div className='divider divide-solid px-3 h-[1px]'></div>
                                </div>
                            )
                            )}
                        </div>
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handelSearchback} className='bg-white rounded-full px-2 py-1 self-center hover:scale-110'>
                            <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                        </button>

                    </div>
                </>
            ) : (
                <>
                    <div className='min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar'>
                        <div className='w-auto'>
                            {chatUser.length === 0 ? (
                                <>
                                    <div className='font-bold text-xl items-centre flex flex-col text-green-400'>
                                        <h1>Search username</h1>
                                        <h1>!!Start chat with someone</h1>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {chatUser.map((user, index) => (
                                        <div key={(user._id)}>
                                            <div
                                                onClick={() => handelUserClick(user)}
                                                className={`flex gap-3 items-centre rounded p-2 py-1 cursor-pointer ${selectedUserId === user?._id ? 'bg-sky-500' : ''}`}>
                                                <div className = {`avatar ${isChatOnline[index] ? 'avatar-online' : ''}`}>
                                                    <div className="w-10 rounded-full">
                                                        <img src={user.profilepic || dp} alt="user.img" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className='font-bold text-gray-300 p-2'>{user.username}</p>
                                                </div>
                                                <div>
                                                    { newMessageUsers.recieverId === authUser._id && newMessageUsers.senderId === user._id ?
                                                    <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">+1</div>:<></>
                                                        }
                                                </div>
                                            </div>
                                            <div className='divider px-3'></div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                    
                </>
            )}
        </div>
    )
}
export default SideBar
