"use client";

import { useState,useEffect } from 'react'
import { IoMdEye,IoMdEyeOff  } from "react-icons/io";
import {Loader, PageLoading, PasswordRules} from '@/components';
import { toast,ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { httpStatus } from '@/utils/https.status';
import Link from 'next/link';



const ResetPassword = ({params}) => {

    const token = params.token;

    const [password,setPassword] = useState("");

    const [showPassword,setShowPassword] = useState(false);

    const [loader,setLoader] = useState(false);

    const [pageLoader,setPageLoader] = useState(false);

    const [showPage,setShowPage] = useState(null);

    const [showSuccessPage,setShowSuccessPage] = useState(false);

    useEffect(()=>{

        (
            async function(){

                try{

                    const res = await fetch("/api/auth/password/token",{
                        method: "POST",
                        body: JSON.stringify({token})
                    });

                    if(res.ok){

                    setShowPage(true);

                    } else{
                        setShowPage(false);
                    }


                } catch(err){

                    console.log(err.message)

                    setShowPage(false);
                }
            }
        )()

    },[])


    async function savePassword(e){

        e.preventDefault();

        setLoader(true);

        try{

            const res = await fetch("/api/auth/password/reset",{
                method: "POST",
                body: JSON.stringify({password,token})
            });

            const data = await res.json();

            setLoader(false)

            if(data.status === httpStatus.SUCCESS){

                setShowSuccessPage(true);

            } else{
                
                toast.error(data.message);
            }

        } catch(err){

            setLoader(false);

            toast.error(httpStatus.SERVER_ERROR_MESSAGE);
        }
    }



  return (

    <>

    <ToastContainer theme='colored' position='top-left' />
    
    { showPage === null ? <PageLoading />

     : 
       <div className='bg-white w-[500px] max-w-[90%] mx-auto mt-[50px] px-[20px] py-[25px]'>

        { showSuccessPage ?

        <div className='text-center font-semibold text-[18px]'>
            <p>Your Password Has Changed!</p>
            <p className='mt-[15px]'>Close This Tab Or Go To <Link className='underline text-main' href="/auth/login">Login</Link></p>
        </div>
        : 
        
        ( showPage ?
        <>
        <h3 className='font-semibold text-[20px]'>Reset Password:</h3>

        <form onSubmit={savePassword}>

            <div className='relative my-[20px]'>

            <input
             onChange={(e)=>setPassword(e.target.value)}
             type={showPassword ? "text" : "password"}
             placeholder='New Password'
             className='w-full outline-none border-b border-[#ccc] px-[15px] py-[7px]'
              />

              <div className="cursor-pointer text-[20px] absolute top-1/2 -translate-y-1/2 right-[20px]">
                {
                    showPassword ? 

                    <IoMdEyeOff onClick={()=>setShowPassword(false)} />

                    : <IoMdEye onClick={()=>setShowPassword(true)} />
                }
              </div>

            </div>

            <PasswordRules />

            <button
             type="submit"
             className={`${loader ? 'pointer-events-none' : ''} grid place-items-center bg-main text-white w-full h-[40px] text-[18px] mt-[20px]`}
             >

                {
                    loader ?
                    <Loader />
                    : "Save"
                }

            </button>
        </form>
        </>

        : <div className='text-center font-semibold text-[18px]'>this Link Has Expired</div>
        )

        }

    </div>

    
    }

    </>
  )
}

export default ResetPassword
