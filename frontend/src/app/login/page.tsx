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

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const login = async () => {
        const config = {
            method: "POST",
            url: `${serverURL}/users/login`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "email": email,
                "password": password,
            }
        };

        axios(config)
            .then((response) => {
                toast.success("Logged In!");
                localStorage.setItem("token", response.data.token);
                window.location.href = response.data.user.type === 0 ? "/admin" : "/home";
            })
            .catch((error) => {
                toast.error("Something went wrong!");
            });
    }

    return (
        <main className="w-screen h-screen bg-black flex p-2 overflow-hidden">
            <div className='flex flex-col text-white p-10 max-w-[30vw] bg-black h-full rounded-md'>
                <Link href={"/"}><p className="mb-10"> {appName} </p></Link>
                 
             </div>
            <div className="animate-fade-in-bottom flex flex-col w-full h-full ml-2 rounded-md p-10">
                <p className="font-bold text-white text-xl mb-3">Login</p>
                
                <p className="text-sm mb-1">Email</p>
                <input className="input input-bordered mb-5 max-w-xs" placeholder="Email" type="text" onChange={(x) => setEmail(x.target.value)} value={email} />
                <p className="text-sm mb-1">Password</p>
                <input className="input input-bordered mb-5 max-w-xs" placeholder="Password" type="password" onChange={(x) => setPassword(x.target.value)} value={password} />
                <button className="btn btn-primary glass max-w-xs" onClick={() => login()}>Login</button>
                <br/>
                <p className="mb-5">Don&apos;t have an account? <Link href={'/signup'}><label htmlFor="createchatbot_modal" className="btn glass text-white btn-sm">Sign up</label></Link></p>
            </div>
            <ToastContainer />
        </main>
    )
}