"use client";

import {useEffect,useState} from 'react'
import { Header,PageLoading, Product } from '@/components'
import Link from 'next/link'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { httpStatus } from '@/utils/https.status';



const Head = ()=>(
  
  <>

    <Header />

    <p className='text-[14px] font-semibold px-[20px] mt-[20px] mb-[40px]'>
    <Link href="/" className='text-main underline'>Home</Link>
     {" > "}
      Wishlist
    </p>

  </>
)

const Wishlist = () => {

  const [products,setProducts] = useState(null);
  const [pageLoader,setPageLoader] = useState(false);


  useEffect(()=>{

    fetchProducts();

  },[]);

  async function fetchProducts(){

    const wishlistLocalStorage = window.localStorage.getItem('lamona-wishlist');

    if(!wishlistLocalStorage){

      setProducts([]);
      return;
      
    }

      const wishlist = JSON.parse(wishlistLocalStorage);

      if(wishlist.length === 0){

        setProducts([]);
        return;
      }

      setPageLoader(true);

      try{

        const res = await fetch("/api/wishlist",{
          method: "POST",
          body: JSON.stringify({wishlist})
        });

        const data = await res.json();

        setPageLoader(false);

        if(res.ok){

          setProducts(data.validProducts);
          deleteIds(data.invalidProducts);

        } else{
          toast.error(httpStatus.SERVER_ERROR_MESSAGE);
        }

      } catch(err){

        setPageLoader(false);
        alert(err.message);
      }


     
  }

  function deleteIds(ids){

    if(ids.length === 0){
      
      return;
    }

    const wishlist = JSON.parse(window.localStorage.getItem('lamona-wishlist'));

    let wishlistCopy = wishlist;

    for(const id of ids){

      wishlistCopy = wishlistCopy.filter(item=>+item !== +id);
    }

    window.localStorage.setItem('lamona-wishlist',JSON.stringify(wishlistCopy));
  }


  return (

    <>

    <ToastContainer theme='colored' position='top-left' />

    {products === null ? <PageLoading />

    : 
    
    
    ( products.length === 0 ?

    <div className="">

      <Head />
      
      <p className='text-gray-500 text-center italic'>Nothing To Show</p> 

    </div>


    : <div className='pb-[50px]'>

      {pageLoader && <PageLoading />}
      
      <Head />
      
      <div className="px-[30px] grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
        {
          products.map(product=><Product key={product.id} product={product} />)
        }
      </div>
    </div>
    )
    }

    </>
  )
}

export default Wishlist
