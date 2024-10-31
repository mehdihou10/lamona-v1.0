"use client";

import Link from 'next/link';
import {useState,useEffect} from 'react';
import { useRouter } from 'next/navigation';
import {Header,PageLoading} from '@/components';
import { Table } from "flowbite-react";
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { decreaseCart } from '@/store/slices/cart';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { httpStatus } from '@/utils/https.status';
import { useCookies } from 'react-cookie';



const Cart = () => {

    const router = useRouter();

    const dispatch = useDispatch();

    const [cart,setCart] = useState(null);

    const [pageLoader,setPageLoader] = useState(false);

    const [cookie,setCookie] = useCookies(['lamona-user']);
    

    useEffect(()=>{

        fetchCart();

    },[]);

    const fetchCart = async()=>{

        const cartLocalStorage = window.localStorage.getItem('lamona-cart');

        if(!cartLocalStorage){

            setCart([]);

        } else{

            const cart = JSON.parse(cartLocalStorage);

            if(cart.length === 0){

                setCart([]);
                return;
            }

            setPageLoader(true);

            try{

                const res = await fetch("/api/cart",{
                    method: "POST",
                    body: JSON.stringify({cart})
                });

                const data = await res.json();

                setPageLoader(false);

                if(res.ok){

                    setCart(data.validProducts)

                    deleteInvalidProducts(data.invalidProducts)

                } else{
                    toast.error(httpStatus.SERVER_ERROR_MESSAGE)
                }

            } catch(err){

                setPageLoader(false);
                console.log(err.message);
            }
        }

     
    }


     function deleteItem(id){

        Swal.fire({
            icon: "warning",
            title: "Are You Sure?!",
            showCancelButton: true
        }).then((res)=>{

            if(res.isConfirmed){

                const cartItems = JSON.parse(window.localStorage.getItem('lamona-cart'));

                let cartCopy = cartItems;

                cartCopy = cartCopy.filter(item=>+item.id !== +id);

                window.localStorage.setItem('lamona-cart',JSON.stringify(cartCopy));

                fetchCart();

                dispatch(decreaseCart());
            }
        }) 

        

    }

    function deleteInvalidProducts(ids){

        if(ids.length === 0){

            return;
        }

        const cartItems = JSON.parse(window.localStorage.getItem('lamona-cart'));

        let cartCopy = cartItems;

        for(const id of ids){

            cartCopy = cartCopy.filter(item=>+item.id !== +id);
        }

        window.localStorage.setItem('lamona-cart',JSON.stringify(cartCopy));
    }

    function goToCheckout(){

        if(cookie['lamona-user']){

            router.push("/checkout");

        } else{

            Swal.fire({
                icon: "warning",
                title: "You Have To Authenticate First",
                showCancelButton: true,
                confirmButtonText: "Login",
            }).then((res)=>{

                if(res.isConfirmed){

                    router.push('/auth/login')
                }
            })
        }
    }


  return (
    
    <>

    <ToastContainer theme='colored' position='top-left' />

    {
        !cart ? <PageLoading />

        : <div>

            <Header />

            <p className='text-[14px] font-semibold px-[20px] mt-[20px] mb-[40px]'><Link href="/" className='text-main underline'>Home</Link> {">"} Cart</p>


            { cart.length === 0 ? 

            <p className='text-center text-[18px] italic text-gray-500'>Empty Cart</p>

                : <>

                {pageLoader && <PageLoading />}
                
                <div className="px-[15px]">

                 <div className="overflow-x-auto">
      <Table>
        <Table.Head>
          <Table.HeadCell>Image</Table.HeadCell>
          <Table.HeadCell>Product name</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Quantity</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Delete</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">

            {
                cart.map(item=>(

        <Table.Row key={item.id} className="bg-white">

            <Table.Cell>
                <img className='w-[60px] h-[60px] object-contain' src={item.image} alt="product" />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
              {item.name}
            </Table.Cell>
            <Table.Cell>${item.price}</Table.Cell>
            <Table.Cell>{item.quantity}</Table.Cell>
            <Table.Cell>
              <button onClick={()=>deleteItem(item.id)} className="text-red-500 font-medium hover:underline text-[18px]">
                Delete
              </button>
            </Table.Cell>
          </Table.Row>

                ))
            }
          

        </Table.Body>
      </Table>
                </div>

                <button
                onClick={goToCheckout}
                className='grid place-items-center w-[200px] max-w-full h-[40px] bg-main text-white text-center mx-auto mt-[40px]'
                >
                    Order Now!
                </button>

                </div>

                </>
            }
        </div>
    }

    </>
  )
}

export default Cart
