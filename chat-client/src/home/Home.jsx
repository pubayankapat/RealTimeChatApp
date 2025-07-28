import React from 'react'
import { useAuth } from '../context/AuthContext'
export const Home = () => {
    const { authUser } = useAuth();
    return (
        <div className='text-3xl'>Hii ..... {authUser.username}</div>
    )
}