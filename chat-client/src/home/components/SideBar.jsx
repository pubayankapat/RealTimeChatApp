import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { BiLogOut } from "react-icons/bi";
import userConversation from '../../zustans/useConversation';


const SideBar = () => {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth()
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { messages, selectedConversation, setSelectedConversation } = userConversation();

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

        chatUserHandler();
    }, []);


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
                setSearchUser(data)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }


    const handelUserClick = (user) => {
        setSelectedConversation(user);
        setSelectedUserId(user._id)

    }

    const handSearchback = () => {
        setSearchUser([]);
        setSearchInput('')
    }

    const handelLogOut = async () => {
        const confirmLogOut = window.prompt("type 'Username' to logout");
        if (confirmLogOut === authUser.username) {
            setLoading(true);
            try {
                const logout = await axios.post('/api/auth/logout')
                const data = logout.data;
                if (data.success === false) {
                    setLoading(false);
                    toast.error(data.message);
                }
                toast.info(data.message);
                localStorage.removeItem('chatrix')
                setAuthUser(null);
                navigate('/login');
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        } else {
            toast.error("Logout Cancelled");
        }

    }

    return (
        <div className='h-full w-auto px-1'>
            <div className='flex justify-between gap-2'>
                <form onSubmit={handelSearchSubmit} className='w-auto flex items-center justify-between bg-white rounded-full text-gray-900'>
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        className='px-4 w-auto bg-transparent outline-none rounded-full'
                        placeholder='Search User'
                        id='search'
                    />
                    <button type="submit" className='btn btn-circle bg-sky-700 hover:bg-gray-950 text-white hover:scale-110'>
                        <FaMagnifyingGlass size={20} />
                    </button>
                </form>
                <img onClick={() => navigate(`/profile/${authUser._id}`)}
                    src={authUser?.profilepic}
                    className='self-center h-10 w-10 hover:scale-120 cursor-pointers contain-size rounded-full' />
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
                                        <div className="avatar">
                                            <div className="w-10 h-10 rounded-full">
                                                <img src={user.profilepic} alt="user.img" />
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
                        <button onClick={handSearchback} className='bg-white rounded-full px-2 py-1 self-center hover:scale-110'>
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
                                                className={`flex gap-3 items=centre rounded p-2 py-1 cursor-pointer' ${selectedUserId === user?._id ? 'bg-sky-500' : ''}`}>
                                                <div className="avatar">
                                                    <div className="w-10 h-10 rounded-full">
                                                        <img src={user.profilepic} alt="user.img" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className='font-bold text-gray-300 p-2'>{user.username}</p>
                                                </div>
                                            </div>
                                            <div className='divider px-3'></div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handelLogOut} className='hover:bg-blue-500 w-8 cursor-pointer rounded-lg hover:scale-110'>
                            <BiLogOut size={25} />
                        </button>
                        <p className='p-1.5'>Logout</p>
                    </div>
                </>
            )}
        </div>
    )
}
export default SideBar
