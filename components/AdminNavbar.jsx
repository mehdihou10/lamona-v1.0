"use client";

import {useState,useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { httpStatus } from '@/utils/https.status';
import {Logo, PageLoading, ProfileImage} from '@/components';
import { IoChevronDownSharp,IoChevronUpSharp } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { verifyAuth } from '@/store/slices/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const Item = ({text,to,active})=>(

    <Link 
    href={`/admin${to}`}
    className={`grid place-items-center min-w-[100px] sm:min-w-[150px] font-semibold
    px-[15px] py-[10px] rounded-full border-[3px] ${active ? 'bg-light border-main': 'bg-[#eee] border-[#ccc]'}`}
    >
        {text}
    </Link>
)

const AdminNavbar = () => {

    const dispatch = useDispatch();

    const router = useRouter();

    const [cookies,setCookie,removeCookie] = useCookies(['lamona-user']);

    const [userData,setUserData] = useState({});
    const [toggle,setToggle] = useState(false);
    const [items,setItems] = useState({
        active1: true,
        active2: false,
    })

    useEffect(()=>{

        if(typeof window !== "undefined"){

        const pathname = window.location.pathname

        const currentPathname = pathname.slice(pathname.lastIndexOf("/") + 1);

        if(currentPathname === "admin" || currentPathname === ""){

            changeActive(1);

        } else if(currentPathname === "products"){

            changeActive(2);

        }

    }

    },[])

    useEffect(()=>{

    getUser();
        
    },[])

    const getUser = async()=>{

        try{

            const res = await fetch('/api/decrypt',{
                method: "GET",
                headers: {
                    'ath': `Bearer ${cookies['lamona-user']}`
                }
            })

            const data = await res.json();

            if(res.ok){

                setUserData(data.user);
                
            } else{

                alert(httpStatus.SERVER_ERROR_MESSAGE)
            }

        } catch(err){

            console.log(err)
        }
    }


    function logout(){

        Swal.fire({
            icon: "warning",
            title: "Are You Sure?!",
            showCancelButton: true

        }).then((res)=>{

            if(res.isConfirmed){

                removeCookie("lamona-user",{path: "/"});
                dispatch(verifyAuth());
                router.push('/');
            }
        })
    }

    function changeActive(id){

        
        switch(id){

            case 1:

               setItems({active1: true, active2: false, active3: false});
               break;

            case 2:

               setItems({active1: false, active2: true, active3: false});
               break;


        }

        
    }

    if(typeof document !== "undefined"){

        document.addEventListener("click",(e)=>{

            if(!e.target.dataset.profile) setToggle(false);
        })
    }

  return (
    <>
    {
    Object.keys(userData).length === 0 ?

    <PageLoading />

    : 
    <div>
        
        <div className="nav bg-white px-[20px] sm:px-[50px] py-[15px] flex items-center justify-between">

        <Logo logoStyle="text-[40px] pointer-events-none" />

        <div className="relative flex items-center gap-[10px]">

          {
            toggle ? <IoChevronUpSharp data-profile={true} onClick={()=>setToggle(false)} className='text-[20px] cursor-pointer' />

            : <IoChevronDownSharp data-profile={true} onClick={()=>setToggle(true)} className='text-[20px] cursor-pointer' />
          }

           <ProfileImage name={userData.username} />

          

          {toggle && <div className="absolute w-[200px] top-[calc(100%+20px)] -left-[150px] z-[3]">
            <button onClick={logout} className='flex items-center gap-[5px] text-left px-[15px] w-full h-[40px] bg-[#e7e4e4]'>
               <IoIosLogOut /> Logout
            </button>
          </div>
          }

        </div>

        </div>

        <div className="items px-[20px] flex justify-center items-center gap-[15px] flex-wrap my-[30px]">

            <div onClick={()=>changeActive(1)}><Item text="Stats" to="" active={items.active1} /></div>
            <div onClick={()=>changeActive(2)}><Item text="Products" to="/products" active={items.active2} /></div>

        </div>
    </div>
    }
    </>
  )
}

export default AdminNavbar
