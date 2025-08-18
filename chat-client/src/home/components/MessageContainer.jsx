import React from 'react'
import { useAuth } from '../../context/AuthContext'
const MessageContainer = () => {
  const {authUser} = useAuth();
  return (
    <div>MessageContainer-{authUser.email}</div>
  )
}
export default MessageContainer
