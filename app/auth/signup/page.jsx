"use client";

import { Logo,Loader } from "@/components";
import { httpStatus } from "@/utils/https.status";
import Link from "next/link";
import { useState,useMemo } from "react";
import { IoMdEye,IoMdEyeOff  } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import { useDispatch } from "react-redux";
import { verifyAuth } from "@/store/slices/auth";
import {useCookies} from 'react-cookie';
import {useRouter} from 'next/navigation';
import { expirationDate } from "@/utils/cookie.expiration";



const Signup = () => {

    const dispatch = useDispatch();

    const [cookie,setCookie] = useCookies(['lamona-user']);

    const router = useRouter();

    const code = useMemo(()=>Date.now(),[]);

    const [showPassword,setShowPassword] = useState(false);

    const [showConfirmationPage,setShowConfirmationPage] = useState(false);

    const [loader,setLoader] = useState(false);

    const [userCode,setUserCode] = useState("");

    const [userData,setUserData] = useState({
      username: "",
      email: "",
      password: "",
      phoneNumber: ""
    })

    async function verifyEmail(e){

      e.preventDefault();

      setLoader(true);

      try{

        const res = await fetch("/api/auth/verify",{
          method: "POST",
          body: JSON.stringify({...userData,code})
        })

        const data = await res.json();

        setLoader(false);


        if(data.status === httpStatus.SUCCESS){

          setShowConfirmationPage(true);

        } else{

          const errors = data.message;

          if(Array.isArray(errors)){

            for(const error of errors){
              toast.error(error);
            }

          } else{

            toast.error(errors);
          }
        }

      } catch(err){

        setLoader(false);
        toast.error(httpStatus.SERVER_ERROR_MESSAGE);
      }
    }

    async function signNewUser(e){

      e.preventDefault();

      setLoader(true);

      try{

        const res = await fetch("/api/auth/signup",{
          method: "POST",
          body: JSON.stringify({...userData,code,userCode})
        });

        const data = await res.json();

        setLoader(false);

        if(data.status === httpStatus.SUCCESS){

          setCookie("lamona-user",data.data,{path: "/",expires: expirationDate});
          dispatch(verifyAuth());

          router.push("/");

        } else{

          const errors = data.message;

          if(Array.isArray(errors)){

            for(const error of errors){

              toast.error(error);
            }

          } else{

            toast.error(errors);
          }
        }

      } catch(err){

        setLoader(false);
        toast.error(httpStatus.SERVER_ERROR_MESSAGE);
      }
    }


  return (
  <>

  <ToastContainer theme="colored" position="top-left" />
    
    { showConfirmationPage ?

    <div className="flex flex-col justify-center items-center h-[100vh] px-[20px]">

      <Image
      src="/images/email.png"
      width={150}
      height={150}
      alt="email"
      />

      <p className="font-semibold text-[18px] text-center mt-[20px]">Check Your Email Box to Get The Verification Code</p>

      <form onSubmit={signNewUser}>
        <input
         onChange={(e)=>setUserCode(e.target.value)}
         className="block my-[20px] w-[300px] max-w-full px-[15px] py-[7px] duration-300 outline-none border border-[#ccc] focus:border-main rounded-[4px]"
         type="text"
         placeholder="Paste Your Code Here..." 
         />

        <button 
        type="submit"
        className={`${loader ? 'pointer-events-none' : ''} grid place-items-center bg-main text-white w-[300px] max-w-full h-[40px] rounded-[4px] text-[18px]`}
        >
          {
            loader ? <Loader />

            : "Check"
          }
        </button>
      </form>

    </div>

    : <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">

        <Logo logoStyle="text-[40px] justify-center" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={verifyEmail} className="space-y-6">

        <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                onChange={(e)=>setUserData({...userData,username: e.target.value})}
                id="username"
                type="text"
                required
                className="block w-full rounded-md px-[15px] outline-none border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
        </div>


          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                onChange={(e)=>setUserData({...userData,email: e.target.value})}
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md px-[15px] outline-none border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>

            </div>
            <div className="mt-2 relative">
              <input
                onChange={(e)=>setUserData({...userData,password: e.target.value})}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="block w-full rounded-md px-[15px] outline-none border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />

              <div className="cursor-pointer text-[20px] absolute top-1/2 -translate-y-1/2 right-[10px]">
                {
                    showPassword ? <IoMdEyeOff onClick={()=>setShowPassword(false)} />
                    : <IoMdEye onClick={()=>setShowPassword(true)} />
                }
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium leading-6 text-gray-900">
              Phone Number
            </label>
            <div className="mt-2">
              <input
                onChange={(e)=>setUserData({...userData,phoneNumber: e.target.value})}
                id="phone_number"
                type="tel"
                required
                className="block w-full rounded-md px-[15px] outline-none border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`${loader ? 'pointer-events-none' : ''} flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              { loader ?
                <Loader />
              : "Sign up"
              }
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already Have an account?{' '}
          <Link href="/auth/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </div>
    }
  </>
  )
}

export default Signup
