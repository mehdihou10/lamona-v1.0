"use client";

import {useEffect,useState} from 'react'
import { Logo,Loader, ProfileImage } from '@/components';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { httpStatus } from '@/utils/https.status';
import {useCookies} from 'react-cookie';
import { FaChevronDown,FaChevronUp,FaBorderAll,FaRegHeart  } from "react-icons/fa";
import { HiBars3 } from "react-icons/hi2";
import Swal from 'sweetalert2';
import { useDispatch,useSelector } from 'react-redux';
import { verifyAuth } from '@/store/slices/auth';
import { changeCart } from '@/store/slices/cart';
import { changeWishlist } from '@/store/slices/wishlist';
import { useRouter } from 'next/navigation';
import { LuLogOut } from "react-icons/lu";
import { MdClose, MdOutlineShoppingCart  } from "react-icons/md";



const Profile = ()=>{

  const [userData,setUserData] = useState({});

  const [cookie,setCookie,removeCookie] = useCookies(['lamona-user']);

  const dispatch = useDispatch();

  const router = useRouter();

  const [show,setShow] = useState(false);


  useEffect(()=>{

    (
      async function(){

        try{

          const res = await fetch("/api/decrypt",{

            headers: {
              "ath": `Bearer ${cookie['lamona-user']}`
            }
          });

          const data = await res.json();

          setUserData(data.user)

        } catch(err){
          toast.error(httpStatus.SERVER_ERROR_MESSAGE);
        }
      }
    )()

  },[])


  if(typeof document !== "undefined"){

    document.addEventListener("click",(e)=>{

      if(!e.target.dataset.profile){
        setShow(false);
      }
    })
  }


  function logout(){

    Swal.fire({
      icon: "warning",
      title: "Are You Sure ?",
      showCancelButton: true
    }).then((res)=>{

      if(res.isConfirmed){

        removeCookie("lamona-user",{path: "/"});
        dispatch(verifyAuth());
        router.push('/');

      }
    })

  }

    return(

      <>
        {
          Object.keys(userData).length === 0 ?

          <Loader />

          : 
          <div className='flex items-center gap-[15px]'>

          <div className='relative z-[5] flex items-center gap-[5px]'>

            <ProfileImage name={userData.username} />

            <div onClick={()=>setShow((prev)=>!prev)} className="cursor-pointer text-[14px]">
              {
                show ?

                <FaChevronUp data-profile={true} />

                : <FaChevronDown data-profile={true} />
              }
            </div>

            { show && <div className="absolute shadow-lg bg-[#eee] top-[120%] -left-[150px]">
              <Link 
                href="/orders"
                className='flex justify-center items-center gap-[5px] w-[200px] text-center px-[15px] py-[10px] border-b border-[#ccc]'
                 >

                  <FaBorderAll />
                  Orders
                 </Link>

              <button 
              onClick={logout} 
              className='w-[200px] cursor-pointer flex justify-center items-center gap-[5px] px-[15px] py-[10px]'
              >
                
                <LuLogOut />
                Logout
              </button>
            </div>}
          </div>

          </div>
        }
      </>
    )
}


const AuthButtons = ()=>{

  const [toggle,setToggle] = useState(false);
  
  return(

  <div>
  
    <div className="hidden md:flex gap-[10px]">

        <Link className='btn px-[10px] sm:px-0 w-fit sm:w-[120px]' href="/auth/login">Login</Link>
        <Link className='btn bg-main text-white px-[10px] sm:px-0 w-fit sm:w-[120px]' href="/auth/signup">Signup</Link>

    </div>

    <div className="block md:hidden relative z-[5]">
      {
        toggle ? <MdClose onClick={()=>setToggle(false)} className='text-[30px] cursor-pointer' />

        : <HiBars3 onClick={()=>setToggle(true)} className='text-[30px] cursor-pointer' />
      }

      { toggle &&

        <ul className='absolute shadow-lg bg-[#eee] top-[120%] -left-[180px]'>

        <li>
          <Link href="/auth/signup" className='flex justify-center items-center gap-[5px] w-[200px] text-center px-[15px] py-[10px] border-b border-[#ccc]'>Signup</Link>
        </li>

        <li>
          <Link href="/auth/login" className='flex justify-center items-center gap-[5px] w-[200px] text-center px-[15px] py-[10px]'>Login</Link>
        </li>

      </ul>
      }

    </div>

    </div>

)
}


const SavedData = ()=>{

  const dispatch = useDispatch();

  const cart = useSelector(state=>state.cart);
  const wishlist = useSelector(state=>state.wishlist);


  useEffect(()=>{
    
    const cartLocalStorage = window.localStorage.getItem("lamona-cart");
    const wishlistLocalStorage = window.localStorage.getItem("lamona-wishlist");

    if(cartLocalStorage) dispatch(changeCart(JSON.parse(cartLocalStorage).length));

    if(wishlistLocalStorage) dispatch(changeWishlist(JSON.parse(wishlistLocalStorage).length));


  },[])


  return(
    
    <div className="flex items-center gap-[10px]">

<Link href="/cart" className="relative">
      <MdOutlineShoppingCart className='text-[25px]' />

      <span className='absolute -top-[18px] -right-[3px] grid place-items-center
       w-[20px] h-[20px] rounded-full bg-red-500 text-white text-[12px]'>
        {cart}
        </span>
    </Link>

    <Link href="/wishlist" className="relative">
      <FaRegHeart className='text-[25px]' />

      <span className='absolute -top-[18px] -right-[3px] grid place-items-center
       w-[20px] h-[20px] rounded-full bg-red-500 text-white text-[12px]'>
        {wishlist}
        </span>
    </Link>
    </div>
  )
}


const Header = () => {

    const isSigned = useSelector(state=>state.isSigned);

  return (
    <div className='bg-white h-[90px] border-b flex justify-between items-center px-[20px]'>
      <Logo logoStyle="text-[25px] sm:text-[50px]" />

      <SavedData />


      { isSigned === null ? <Loader />

        : ( isSigned ?

        <Profile />

        : <AuthButtons />
       )

      }
    </div>
  )
}

export default Header
