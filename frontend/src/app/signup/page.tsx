"use client";
import axios from 'axios';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { appName, serverURL } from '@/utils/utils';
import { ToastContainer, toast } from 'react-toastify';

export default function Home() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem("token")) {
                window.location.href = "/home";
            }
        }
    }, []);

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [verificationCodeSent, setVerificationCodeSent] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);

    const sendVerificationCode = async () => {
        setLoading(true);
        if (email == "" || name == "" || password == "") {
            setLoading(false);
            toast.error("Please fill out all fields!");
            return;
        }

        const config = {
            method: "POST",
            url: `${serverURL}/users/send-verification-code`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "email": email
            }
        };

        axios(config)
            .then((response) => {
                toast.success("Verification Code Sent!");
                setVerificationCodeSent(true);
                setLoading(false);
            })
            .catch((error) => {
                toast.error("Something went wrong! Please try again later.");
                setLoading(false);
            });
    }

    const verifyEmail = async () => {
        if (email == "" || name == "" || password == "") {
            toast.error("Please fill out all fields!");
            return;
        }

        if (verificationCode == "") {
            toast.error("Please enter the verification code!");
            return;
        }

        const config = {
            method: "POST",
            url: `${serverURL}/users/verify-email`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "email": email,
                "code": verificationCode,
            }
        };

        axios(config)
            .then((response) => {
                toast.success("Email verified!");
                signup();
            })
            .catch((error) => {
                toast.error("Something went wrong! Please try again later.");
            });
    }

    const signup = async () => {
        if (email == "" || name == "" || password == "") {
            toast.error("Please fill out all fields!");
            return;
        }

        const config = {
            method: "POST",
            url: `${serverURL}/users/signup`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "name": name,
                "email": email,
                "password": password,
            }
        };

        axios(config)
            .then((response) => {
                toast.success("Account created!");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1000);
            })
            .catch((error) => {
                toast.error("Something went wrong!");
            });
    }

    return (
        <main className="w-screen h-screen bg-black flex p-2 overflow-hidden">
            <div className='flex flex-col text-white p-10 max-w-[30vw] bg-black h-full rounded-md'>
                <Link href={"/"}><p className="mb-10">{appName} </p></Link>
                 
             </div>
            <div className="animate-fade-in-bottom flex flex-col w-full h-full ml-2 rounded-md p-10">
                <p className="font-bold text-white text-xl mb-3">Sign Up</p>
                <p className="text-sm mb-1">Full Name</p>
                <input className="input input-bordered mb-5 max-w-xs" placeholder="Full Name" type="text" onChange={(x) => setName(x.target.value)} value={name} />
                <p className="text-sm mb-1">Email</p>
                <input className="input input-bordered mb-5 max-w-xs" placeholder="Email" type="text" onChange={(x) => setEmail(x.target.value)} value={email} />
                <p className="text-sm mb-1">Password</p>
                <input className="input input-bordered mb-5 max-w-xs" placeholder="Password" type="password" onChange={(x) => setPassword(x.target.value)} value={password} />
                {verificationCodeSent && <div className="flex flex-col">
                    <p className="text-sm mb-1">Verification Code</p>
                    <input className="input input-bordered mb-5 max-w-xs" placeholder="Verification Code" type="text" onChange={(x) => setVerificationCode(x.target.value)} value={verificationCode} />
                </div>}
                <button className="btn btn-primary glass max-w-xs" onClick={() => {
                    if (loading) return;
                    if (!verificationCodeSent) {
                        sendVerificationCode();
                    }
                    else {
                        verifyEmail();
                    }
                }}>{loading ? <span className="loading loading-spinner"></span> : verificationCodeSent ? "Create Account" : "Send Verification Code"}</button>
                
                <br/>
                <p className="mb-5">Already have an account? <Link href={'/login'}><label htmlFor="createchatbot_modal" className="btn glass text-white btn-sm">Login</label></Link></p>

            </div>
            <ToastContainer />
        </main>
    )
}