"use client";

import { Header, PageLoading, Loader } from '@/components';
import {useEffect,useState} from 'react'
import { useRouter } from 'next/navigation';
import { httpStatus } from '@/utils/https.status';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { MdOutlineZoomOutMap,MdOutlineShoppingCart,MdClose  } from "react-icons/md";
import {useCookies} from 'react-cookie';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux';
import { increaseCart } from '@/store/slices/cart';



const ProductDetails = ({params}) => {

    const {productId} = params;

    
    const dispatch = useDispatch();

    const router = useRouter();
    
    const [cookie,setCookie] = useCookies(['lamona-user']);

    const [product,setProduct] = useState({});

    const [quantity,setQuantity] = useState(1);

    const [image,setImage] = useState(null);

    const [loader,setLoader] = useState(false);


    useEffect(()=>{

        const fetchProduct = async()=>{

            try{

                const res = await fetch(`/api/products/${productId}`);

                const data = await res.json();

                if(data.status === httpStatus.SUCCESS){

                    setProduct(data.product);

                } else{

                    router.push("/");

                }

            } catch(err){

                router.push("/");
            }
        }

        fetchProduct();

    },[])


    function decreaseQte(){

        if(quantity !== 1){

            setQuantity((prev)=>--prev)
        }
    }


    function increaseQte(){

        if(quantity === product.stock){
                
            Swal.fire({
                icon: "warning",
                title: `Max Quantity is ${product.stock}`
            })

        } else{

            return setQuantity((prev)=>++prev);
        }
    }

    async function addToCart(){

        if(cookie['lamona-user']){

            if(product.stock === 0){

                Swal.fire({
                    icon: "warning",
                    title: "Product Out of Stock"
                })

                return;
            }

            setLoader(true);

            try{

                const res = await fetch('/api/cart/add',{
                    method: "POST",
                    headers: {
                        "ath": `Bearer ${cookie['lamona-user']}`
                    },
                    body: JSON.stringify({productId: product.id,qte: quantity})
                });

                const data = await res.json();

                setLoader(false);

                if(data.status === httpStatus.SUCCESS){

                    dispatch(increaseCart())

                    Swal.fire({
                        icon: "success",
                        title: "Product Added To Cart!"
                    })

                } else{

                    Swal.fire({
                        icon: "error",
                        title: data.message
                    })
                }

            } catch(err){

                setLoader(false);
                toast.error(httpStatus.SERVER_ERROR_MESSAGE);
            }

        }
    }

  return (
    <>

    <ToastContainer theme='colored' position='tom-left' />

    {
        image &&

        <div className='fixed top-0 left-0 w-full h-full bg-[#000000bd] grid place-items-center z-[10]'>

            <MdClose
            onClick={()=>setImage(null)}
            className='absolute text-[50px] top-[20px] right-[20px] cursor-pointer text-white z-[11]'
            />

            <img
            src={image}
            className='w-[500px] object-cover max-w-[90%] h-[400px] sm:h-[500px]'
            alt="product"
            />

        </div>
    }

    { Object.keys(product).length === 0 ?

    <PageLoading />
        
    : <div>

        <Header />

        <p className='text-[14px] font-semibold px-[20px] mt-[20px] mb-[40px]'><Link href="/" className='text-main underline'>Home</Link> {">"} {product.name}</p>

        <div className='flex items-center xl:items-start flex-col xl:flex-row gap-[30px] px-[30px] pb-[40px]'>

        <div className="image py-[20px] bg-white relative rounded-[6px] overflow-hidden xl:basis-1/3">

            <img
             src={product.image}
              alt="Product"
              className='w-full max-h-[400px] object-contain'
            />

                <MdOutlineZoomOutMap 
                onClick={()=>setImage(product.image)}
                className='absolute top-[10px] right-[10px] cursor-pointer text-[25px]'
                 />

        </div>

        <div className="text flex-1 bg-white p-[20px] rounded-[6px]">

            <h1 className='text-[20px] font-semibold my-[20px]'>{product.name}</h1>

            <h3 className='text-gray-500 text-[18px]'>Stock: <span className='text-black font-bold text-[20px]'>{product.stock}</span></h3>

            <h1 className='text-main text-[30px] font-bold my-[20px]'>${product.price}</h1>

            <h3 className='mb-[15px] font-semibold text-[18px]'>Description:</h3>

            <p className='text-gray-700 leading-[1.8]'>{product.description}</p>

            <div className="flex gap-[10px] items-center justify-center mt-[20px]">

                <button onClick={decreaseQte} className='grid place-items-center bg-[#eee] w-[40px] h-[40px] cursor-pointer border border-[#ccc]'>-</button>

                <span className='block w-[150px] max-w-full text-center border border-[#ccc] bg-[#eee] outline-none py-[5px]' >
                    {quantity}
                 </span>   

                <button onClick={increaseQte} className='grid place-items-center bg-[#eee] w-[40px] h-[40px] cursor-pointer border border-[#ccc]'>+</button>

            </div>

            <button
            onClick={addToCart}
            className={`${!cookie['lamona-user'] ? 'opacity-50 cursor-not-allowed' : ''} 
             ${loader ? 'pointer-events-none' : ''}
                flex justify-center items-center gap-[5px] 
            mt-[20px] w-[250px] max-w-full mx-auto h-[40px]
             bg-main text-white text-[18px]`}
            >

                { loader ? <Loader />

                  : <>
                <MdOutlineShoppingCart />
                Add To Cart
                </>
                }
            </button>

        </div>


    </div>

    </div>
    
    }

    </>
  )
}

export default ProductDetails
