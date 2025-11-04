import React, { useRef, useEffect, useState } from "react";
import axios from 'axios'
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import dp from '../../assets/dp.jpg'
import { toast } from 'sonner';
import { BiLogOut } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const [upload, setUpload] = useState(false);

  const fileInputRef = useRef(null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/auth/profile`);
        const data = res.data
        setProfile(data);
        setImage(data?.profilepic)
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);



  // Trigger file picker
  const handleEditClick = () => {
    fileInputRef.current.click();
  }

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log(imageUrl);

      setImage(imageUrl);
      console.log("Selected file:", file);
      setUpload(true);
      setFile(file);
    }
  }

  const handleS3Upload = async () => {
    try {
      // Get presigned URL
      const res = await axios.get("/api/s3Url/presign");
      const uploadURL = res.data.url;
      const key = res.data.fileName;


      // Upload file to S3
      const upload = await axios.put(uploadURL, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      if (upload.status === 200) { // ✅ Correct check
        console.log("✅ File uploaded successfully!");
      } else {
        console.error("❌ Upload failed:", upload.statusText);
      }

      // Optionally update your DB
      const response = await axios.post("/api/auth/updateImage", { key });
      const data = response.data;

      if (data.success === false) {
        toast.error(data.message);
      } else {
        const user = JSON.parse(localStorage.getItem("chatrix"));  // 1️⃣ get
        user.profilepic = response.data.profilepic;                            // 2️⃣ update field
        localStorage.setItem("chatrix", JSON.stringify(user));
        toast.success(data.message);
      }

    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };


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
    navigate('/', { state: { refresh: true } });
  }

  if (loading) return <p className="text-gray-500 text-center">Loading profile...</p>;
  if (!profile) return <p className="text-red-500 text-center">Profile not found.</p>;

  return (
    <div className="p-6 border rounded-2xl shadow-md w-80 mx-auto mt-6 backdrop-filter backdrop-blur-lg bg-opacity-0">
      {/* <button className="btn btn-primary">
        Edit profile
      </button> */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <img
            src={image || dp}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-2 border-gray-300 shadow-sm"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {upload === true ?
            <button onClick={handleS3Upload} className="absolute bottom-0 right-0 btn btn-xs bg-blue-500 text-white shadow-md hover:scale-125 hover:bg-blue-300">
              Upload
            </button>
            :
            <button onClick={handleEditClick} className="absolute bottom-2 right-2 btn btn-circle btn-xs bg-blue-500 text-white shadow-md hover:scale-125 hover:bg-blue-300">
              <FaEdit size={14} />
            </button>
          }

        </div>
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
