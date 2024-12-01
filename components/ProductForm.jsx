"use client";

import {useState,useEffect} from 'react'
import { MdOutlineCloudUpload,MdClose } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { toast,ToastContainer } from 'react-toastify';
import { handleFileChange } from '@/functions/image.upload';
import Link from 'next/link';
import {Loader} from '@/components';


const ProductForm = ({action, api, method, data}) => {

    const [cookies,setCookie] = useCookies(['lamona-user']);

    const router = useRouter();

    const [loader,setLoader] = useState(false);

    const [productData,setProductData] = useState({
        name: "",
        price: "",
        stock: "",
        image: "",
        description: ""
    })

    useEffect(()=>{

        if(!cookies['lamona-user']){

            router.push("/");

        } else{

            (
                async function(){

                    try{

                    
                    const res = await fetch('/api/decrypt',{
                        headers: {
                            "ath": `Bearer ${cookies['lamona-user']}`
                        }
                    });

                    if(res.ok){

                        const data = await res.json();

                        if(data.user.type !== "admin"){

                            router.push('/')
                        }

                    } else{

                        window.location.reload();
                    }

                } catch(err){

                    console.log(err)
                }
                }
            )()

        }


    },[])

    useEffect(()=>{

      if(data){

        setProductData({
          name: data.name,
          price: data.price,
          stock: data.stock,
          image: data.image,
          description: data.description
        })
      }

    },[])

    async function handleSubmit(e){

      e.preventDefault(),

      setLoader(true)
  
      try{
  
        const res = await fetch(`/api/admin/products/${api}`,{
          method,
          body: JSON.stringify(productData)
        });
  
        const data = await res.json();
  
        setLoader(false);
  
        if(res.ok){

          router.push('/admin/products')

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
  
        setLoader(false)
        console.log(err);
      }
    }



  return (
    <>

    <ToastContainer theme='colored' position='top-left' />

    
    
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">

      <Link 
    href="/admin/products"
    className='w-[40px] h-[40px] grid place-items-center cursor-pointer border rounded-[4px] mx-auto'
    >

    <IoMdArrowBack className='pointer-events-none' />

    </Link>
    
        <h2 className="mt-10 text-center text-[30px] font-bold tracking-tight text-gray-900">
          {action} Product
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} 
        className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
              Product Name
            </label>
            <div className="mt-2">
              <input
                onChange={(e)=>setProductData({...productData, name: e.target.value})}
                value={productData.name}
                id="name"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">
              Price
            </label>
            <div className="mt-2">
              <input
                onChange={(e)=>setProductData({...productData, price: e.target.value})}
                value={productData.price}
                id="price"
                type="number"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm/6 font-medium text-gray-900">
              Stock
            </label>
            <div className="mt-2">
              <input
                onChange={(e)=>setProductData({...productData, stock: e.target.value})}
                value={productData.stock}
                id="stock"
                type="number"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div className="h-[300px] w-full rounded-[6px] overflow-hidden">

            { productData.image === "" ?
                <>
                <input 
                onChange={(e)=>handleFileChange(e,setProductData,productData)}
                type="file"
                id="upload-image"
                className='hidden'
                 />

                <label htmlFor='upload-image' className="block cursor-pointer w-full h-full border-[3px] border-dashed border-[#ccc] relative">

                <div className="absolute flex flex-col justify-center items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">

                <MdOutlineCloudUpload className='text-[30px]' />
                <h3 className='text-gray-600 text-[13px] text-center'>Click Here To Upload Image</h3>
                </div>
            </label>

               </>

               : <div className="image relative">

                <img 
                className='w-full h-full object-cover'
                src={productData.image} 
                alt='product' 
                />

                <MdClose onClick={()=>setProductData({...productData, image: ""})} className='cursor-pointer absolute right-[20px] top-[20px] text-[35px] z-[2]' />

               </div>
            }

          </div>

          <div>
            <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
              Description
            </label>
            <div className="mt-2">
              <textarea
                onChange={(e)=>setProductData({...productData, description: e.target.value})}
                value={productData.description}
                id="description"
                type="text"
                required
                className="block w-full h-[200px] resize-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-indigo-600 ${loader ? 'pointer-events-none' : ''}`}
            >
              {
                loader ? <Loader /> : `${action} Product`
              }
            </button>
          </div>
        </form>

        
      </div>
    </div>
  </>
  )
}

export default ProductForm
