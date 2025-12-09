import axios from "axios";
import React, { useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import verifiedIcon from "../assets/verified.png";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({});
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [verified, setVerified] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [openOTPVerify, setOpenOTPVerify] = useState(false);
    const [otp, setOtp] = useState("");

    useEffect(() => {
        if (resendTimer === 0) return; // stop when it reaches 0

        const timer = setInterval(() => {
            setResendTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer); // cleanup on unmount
    }, [resendTimer]);

    const handleInput = (e) => {
        setInputData({
            ...inputData, [e.target.id]: e.target.value
        })

        if (e.target.id === "password") {
            setPassword(e.target.value);
            console.log(password);

        }
        if (e.target.id === "confpassword") {
            setConfPassword(e.target.value);
            console.log(confPassword);

        }

    }

    const selectGender = (selectGender) => {
        setInputData((prev) => ({
            ...prev, gender: selectGender === inputData.gender ? '' : selectGender
        }))
    }

    const verifyOTP = async () => {
        setLoading(true);
        try {
            // Correct endpoint: /api/otp/sendOtp
            const { data } = await axios.post('/api/otp/sendOtp', { email: inputData.email });

            if (data?.success) {
                toast.success(data.message);
                setOpenOTPVerify(true);
                setResendTimer(60);
                setOtp("");
                setLoading(false);
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            setLoading(false);
            console.log(error.message);
            toast.error(error?.response?.data?.message || 'Failed to send OTP');
        }
    }
    const matchOtp = async () => {
        try {
            // Correct endpoint: /api/otp/verifyOtp
            const { data } = await axios.post('/api/otp/verifyOtp', { email: inputData.email, otp });

            if (data?.success) {
                setVerified(true);
                setOpenOTPVerify(false);
                toast.success(data.message);
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            setLoading(false);
            console.log(error.message);
            toast.error(error?.response?.data?.message || 'Failed to verify OTP');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (inputData.password.toLowerCase() !== inputData.confpassword.toLowerCase()) {
            setLoading(false)
            return toast.error("Password doesn't matched")
        }
        try {
            const register = await axios.post('/api/auth/register', inputData);
            const data = register.data;
            if (data === false) {
                setLoading(false);
                toast.error("Invalid login credentials");
                return;
            }

            toast.success(data.message);
            setLoading(false)
            navigate('/login');

        } catch (error) {
            setLoading(false)
            console.log(error.message);
            toast.error(error?.response?.data?.message)
        }
    }
    return (
        <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
            <div className="w-full p-6 rounded-lg shadow-lg bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                <h1 className="text-blue-300 text-center font-bold text-3xl">Register <span className="text-green-600">Chatrix</span></h1>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex mt-2 gap-4">
                        <input onChange={handleInput} type="text" id="fullname" placeholder="Enter your fullname" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                    </div>
                    <div className="flex mt-2 gap-4">
                        <input onChange={handleInput} type="text" id="username" placeholder="Enter your Username" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                    </div>
                    <div id="gender" className="flex mt-2 gap-4">
                        <label className="cursor-pointer label flex">
                            <span className="label-text font-semibold text-shadow-white">Male</span>
                            <input onChange={() => selectGender('male')}
                                checked={inputData.gender === 'male'} type="checkbox" className="checkbox checkbox-info" />
                            <span className="label-text font-semibold text-shadow-white">Female</span>
                            <input onChange={() => selectGender('female')}
                                checked={inputData.gender === 'female'} type="checkbox" className="checkbox checkbox-info" />
                            <span className="label-text font-semibold text-shadow-white">Others</span>
                            <input onChange={() => selectGender('others')}
                                checked={inputData.gender === 'others'} type="checkbox" className="checkbox checkbox-info" />
                        </label>
                    </div>
                    <div className="flex mt-2 gap-4">
                        <input onChange={handleInput} type="email" id="email" placeholder="Enter your email" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                    </div>

                    {verified ? (
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-end">
                                <img src={verifiedIcon} alt="Verified" className="h-6 w-6" />
                                <p>Verified</p>
                            </div>
                            <div className="flex mt-2 gap-4">
                                <input onChange={handleInput} type="password" id="password" placeholder="Enter password" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                            </div>
                            <div className="flex mt-2 gap-4">
                                <input onChange={handleInput} type="password" id="confpassword" placeholder="Confirm Password" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                            </div>
                            <div>
                                {password && confPassword && (
                                    <p className={`text-sm mt-1 ${(password === confPassword) ? "text-green-500" : "text-red-500"}`}>
                                        {(password === confPassword) ? "Ok good to go" : "Wrong please confirm password"}
                                    </p>
                                )}
                            </div>


                            <button
                                type="submit"
                                className='mt-4 self-center 
                            w-auto px-2 py-1 font-bold bg-blue-400 
                            text-lg hover:bg-blue-300 
                            text-white rounded-lg scale-105'
                                disabled={loading}
                            >
                                {loading ? "Signing up..." : "Sign Up"}
                            </button>
                        </div>
                    ) :
                        (
                            <button
                                type="button"
                                className='mt-4 self-center 
                                w-auto px-2 py-1 font-bold bg-blue-400 
                                text-lg hover:bg-blue-300 
                                text-white rounded-lg scale-105'
                                disabled={loading}
                                onClick={verifyOTP}
                            >
                                {loading ? "Sending Otp..." : "Verify Email"}
                            </button>
                        )}

                </form>
                {/* open otp verify pop up */}
                {openOTPVerify && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="w-full max-w-sm rounded-xl bg-gray-900 p-6 shadow-2xl border border-gray-700">
                            <div className="mb-4 text-center">
                                <h2 className="text-2xl font-bold text-blue-300">Verify your email</h2>
                                <p className="mt-1 text-sm text-gray-300">
                                    We have sent a 6-digit code to
                                    {" "}
                                    <span className="font-semibold text-blue-200">{inputData.email || "your email"}</span>
                                </p>
                            </div>

                            <div className="mb-3">
                                <label className="mb-1 block text-sm font-semibold text-blue-400">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                    placeholder="_ _ _ _ _ _"
                                    className="w-full h-11 rounded-lg bg-gray-800 text-center tracking-[0.4em] text-lg text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {otp.length > 0 && otp.length < 6 && (
                                    <p className="mt-1 text-xs text-red-400 text-center">
                                        Please enter all 6 digits
                                    </p>
                                )}
                            </div>

                            <div className="mb-4 flex items-center justify-between text-xs text-gray-300">
                                <span>
                                    {resendTimer > 0
                                        ? `Resend available in ${resendTimer}s`
                                        : "You can resend the OTP now."}
                                </span>
                                <button
                                    type="button"
                                    disabled={resendTimer > 0}
                                    onClick={() => setResendTimer(60)}
                                    className={`underline ${resendTimer > 0
                                        ? "cursor-not-allowed text-gray-500"
                                        : "text-blue-400 hover:text-blue-300"
                                        }`}
                                >
                                    Resend OTP
                                </button>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setOpenOTPVerify(false)}
                                    className="rounded-lg bg-gray-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={matchOtp}
                                    className="rounded-lg bg-green-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-400 disabled:opacity-60"
                                    disabled={otp.length !== 6}
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className='pt-2'>
                    <p className='text-sm font-semibold
                         text-blue-300'>
                        Have an Acount ? <Link to={'/login'}>
                            <span
                                className='text-gray-700 
                            font-bold underline cursor-pointer
                             hover:text-green-700'>
                                Login Now!!
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Register