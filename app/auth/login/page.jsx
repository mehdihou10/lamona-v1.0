"use client";

import { Loader, Logo, PageLoading } from "@/components";
import { httpStatus } from "@/utils/https.status";
import Link from "next/link";
import { useState } from "react";
import { IoMdEye,IoMdEyeOff  } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { verifyAuth } from "@/store/slices/auth";
import {useCookies} from 'react-cookie';
import { useRouter } from "next/navigation";
import { expirationDate } from "@/utils/cookie.expiration";
import Swal from "sweetalert2";
import { userTypes } from "@/utils/user.types";



const Login = () => {

   const dispatch = useDispatch();

   const router = useRouter();

   const [cookie,setCookie] = useCookies(['lamona-user']);

    const [showPassword,setShowPassword] = useState(false);

    const [loader,setLoader] = useState(false);

    const [pageLoader,setPageLoader] = useState(false);

    const [userData,setUserData] = useState({
      email: "",
      password: ""
    });


    async function loginUser(e){

      e.preventDefault();

      setLoader(true);

      try{

        const res = await fetch("/api/auth/login",{
          method: "POST",
          body: JSON.stringify(userData)
        });

        const data = await res.json();

        setLoader(false);

        if(data.status === httpStatus.SUCCESS){

          setCookie("lamona-user",data.data,{path: "/",expires: expirationDate});
          dispatch(verifyAuth());

          if(data.type === userTypes.USER){

            router.push('/');

          } else if(data.type === userTypes.ADMIN){

            router.push("/admin");
          }

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
        toast.error(httpStatus.SERVER_ERROR_MESSAGE)
      }

    }

    async function sendResetEmail(){

      setPageLoader(true);

      try{

        const res = await fetch("/api/auth/password/send",{
          method: "POST",
          body: JSON.stringify({email: userData.email, url: window.location.origin})
        });

        const data = await res.json();


        if(data.status === httpStatus.SUCCESS){

          (
            async function(){
              
              try{

                const res = await fetch("/api/email",{
                  method: "POST",
                  body: JSON.stringify({email: userData.email, subject: "Reset Password", html: data.html})
                })

               setPageLoader(false);


                if(res.ok){

                  Swal.fire({
                    icon: "success",
                    title: "We've sent you a reset link to your Email"
                  });

                }

              } catch(err){

                setPageLoader(false);

                console.log(err)
              }
            }
          )()



        } else{

          setPageLoader(false);

          toast.error(data.message);
        }

      } catch(err){

        setPageLoader(false);
        toast.error(httpStatus.SERVER_ERROR_MESSAGE)
      }
    }

  return (
    <>

    <ToastContainer theme="colored" position="top-left" />

    {pageLoader && <PageLoading />}
    
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">

        <Logo logoStyle="text-[40px] justify-center" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={loginUser} className="space-y-6">
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
              <div className="text-sm">
                <span onClick={sendResetEmail} className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  Forgot password?
                </span>
              </div>
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
            <button
              type="submit"
              className={`${loader ? 'pointer-events-none' : ''} flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              {
                loader ? <Loader />
                : "Sign in"
              }
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don't Have an account?{' '}
          <Link href="/auth/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Signup
          </Link>
        </p>
      </div>
    </div>
  </>
  )
}

export default Login
