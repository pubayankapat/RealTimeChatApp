import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import dp from '../../assets/dp.jpg'
import { toast } from 'sonner';
import { BiLogOut } from "react-icons/bi";


function Profile() {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/auth/profile/${authUser?._id}`);
        const data = res.data
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser?._id]);

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

  const handelback = () => {
    navigate('/');
  }

  if (loading) return <p className="text-gray-500 text-center">Loading profile...</p>;
  if (!profile) return <p className="text-red-500 text-center">Profile not found.</p>;

  return (
    <div className="p-6 border rounded-2xl shadow-md w-80 mx-auto mt-6 backdrop-filter backdrop-blur-lg bg-opacity-0">
      <div className="flex flex-col items-center">
        <img
          src={profile?.profilepic || dp}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h2 className="text-xl font-semibold">{profile.fullname}</h2>
        <p className="text-blue-500">{profile.username}</p>
        <p className="text-green-600 mt-2">{profile.email}</p>
      </div>
      <div className='mt-auto px-1 py-1 flex justify-between'>
        <div className="flex">
          <button onClick={handelback} className='hover:bg-green-500 rounded-full px-2 py-1 self-center hover:scale-110 bg-blue-500'>
            <ArrowLeftIcon className="w-5 h-6 text-white-700" />
          </button>
          <p className="p-1.5">Back</p>
        </div>
        <div className="flex">
          <button onClick={handelLogOut} className='hover:bg-red-700 w-7 cursor-pointer rounded-lg hover:scale-110  bg-blue-500'>
            <BiLogOut size={25} />
          </button>
          <p className="p-1.5">Logout</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
