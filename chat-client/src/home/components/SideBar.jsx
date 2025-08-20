import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
    const navigate = useNavigate();
    const { authUser } = useAuth()
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [Loading, setLoading] = useState(false);

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
    console.log(searchUser);
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
                    <button type="submit" className='btn btn-circle bg-sky-700 hover:bg-gray-950 text-white'>
                        <FaMagnifyingGlass size={20} />
                    </button>
                </form>
                <img onClick={() => navigate(`/profile/${authUser._id}`)}
                    src={authUser?.profilepic}
                    className='self-center h-11 w-10 hover:scale-110 cursor-pointers contain-size' />
            </div>
            <div className='divider px-3'></div>
            {searchUser?.length > 0 ? (
                <>
                </>
            ) : (
                <>
                    <div className='min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar'>
                        <div className='w-auto'>
                            {chatUser}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
export default SideBar
