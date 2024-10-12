"use client";

import {useState,useEffect} from 'react';
import {useCookies} from 'react-cookie';
import { useRouter } from 'next/navigation';
import {PageLoading,Header} from '@/components';
import moment from 'moment';
import Link from 'next/link';
import { httpStatus } from '@/utils/https.status';
import { Table } from "flowbite-react";


const Orders = () => {

    const router = useRouter();

    const [cookie,setCookie] = useCookies(['lamona-user']);

    const [orders,setOrders] = useState(null);

    useEffect(()=>{

        (
            async function(){

                try{

                    const res = await fetch("/api/orders",{
                        headers: {
                            "ath": `Bearer ${cookie['lamona-user']}`
                        }
                    });

                    const data = await res.json();

                    if(data.status === httpStatus.SUCCESS){

                        setOrders(data.orders);

                    } else{
                        router.push("/");
                    }
        
                } catch(err){
        
                    router.push('/');
                }
            }
        )()

    },[])

    
  return (
    <>

    {orders === null ? <PageLoading />

    : <div>

        <Header />

        <p className='text-[14px] font-semibold px-[20px] mt-[20px] mb-[40px]'><Link href="/" className='text-main underline'>Home</Link> {">"} Orders</p>

        <>
        {
            orders.length === 0 ?

            <p className='text-center text-[18px] italic text-gray-500'>You Don't Have Orders Yet</p>

            : <div className='px-[15px]'>

<div className="overflow-x-auto">
      <Table>
        <Table.Head>
          <Table.HeadCell>#</Table.HeadCell>
          <Table.HeadCell>Products</Table.HeadCell>
          <Table.HeadCell>Since</Table.HeadCell>
          <Table.HeadCell>Total</Table.HeadCell>
          <Table.HeadCell>Payment</Table.HeadCell>

        </Table.Head>
        <Table.Body className="divide-y">

            {
                orders.map((item,index)=>(

        <Table.Row key={item.id} className="bg-white">

            <Table.Cell>
                {index + 1}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
              {
                item.data.map((product,ind)=>(
                    <p className={`${ind !== item.data.length - 1 ? 'pb-[15px]' : ''} text-gray-700`}>
                        <span className='text-black text-[20px] font-bold'>{product.slice(0,1)}</span> {product.slice(1)}
                    </p>
                ))
              }
            </Table.Cell>
            <Table.Cell>
                <p className='whitespace-nowrap'>{moment(item.date).fromNow()}</p>
            </Table.Cell>
            <Table.Cell>${item.total}</Table.Cell>
            <Table.Cell>
              {
                item.paid ?
                <span>Online</span>

                : <span className='whitespace-nowrap'>Hand By Hand</span>
              }
            </Table.Cell>
          </Table.Row>

                ))
            }
          

        </Table.Body>
      </Table>
                </div>

            </div>
        }
        </>
    </div>

    }
      
    </>
  )
}

export default Orders
