"use client";

import Link from 'next/link';
import {useState,useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import {Header,PageLoading} from '@/components';
import { httpStatus } from '@/utils/https.status';
import { Table } from "flowbite-react";
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { decreaseCart } from '@/store/slices/cart';


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

        try{

            const res = await fetch("/api/cart",{
                headers: {
                    "ath": `Bearer ${cookie['lamona-user']}`
                }
            });

            const data = await res.json();

            if(data.status === httpStatus.SUCCESS){

                setCart(data.cart);

            } else{

                router.push("/");
            }
            
        } catch(err){

            router.push('/');
            
        }
    }

     function deleteItem(id){

        Swal.fire({
            icon: "warning",
            title: "Are You Sure?!",
            showCancelButton: true
        }).then(async(res)=>{

            if(res.isConfirmed){

                setPageLoader(true);

                
                try{  

                const res = await fetch(`/api/cart/${id}`,{
                    method: "DELETE",
                    headers: {
                        "ath": `Bearer ${cookie['lamona-user']}`
                    }
                });

                const data = await res.json();

                if(data.status === httpStatus.SUCCESS){

                    dispatch(decreaseCart());
                    
                    fetchCart();
                    setPageLoader(false);

                } else{

                    setPageLoader(false);

                    Swal.fire({
                        icon: "error",
                        title: data.message
                    })
                }

            } catch(err){

                setPageLoader(false);

                console.log(err.message);
            }
            }
        }) 

        

    }


  return (
    
    <>

    {
        !cart ? <PageLoading />

        : <div>

            {pageLoader && <PageLoading />}
            <Header />

            <p className='text-[14px] font-semibold px-[20px] mt-[20px] mb-[40px]'><Link href="/" className='text-main underline'>Home</Link> {">"} Cart</p>


            { cart.length === 0 ? 

            <p className='text-center text-[18px] italic text-gray-500'>Empty Cart</p>

                : <div className="px-[15px]">

                 <div className="overflow-x-auto">
      <Table>
        <Table.Head>
          <Table.HeadCell>Image</Table.HeadCell>
          <Table.HeadCell>Product name</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Quantity</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
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
            <Table.Cell>{item.qte}</Table.Cell>
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

                <Link 
                href="/checkout"
                className='grid place-items-center w-[200px] max-w-full h-[40px] bg-main text-white text-center mx-auto mt-[40px]'
                >
                    Order Now!
                </Link>

                </div>
            }
        </div>
    }

    </>
  )
}

export default Cart
