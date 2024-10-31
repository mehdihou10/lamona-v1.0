"use client";

import { Header, PageLoading, Loader, PaymentPage } from '@/components';
import {useState,useEffect} from 'react';
import Link from 'next/link';
import { MdPayment,MdBorderColor  } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { httpStatus } from '@/utils/https.status';
import Swal from 'sweetalert2';
import { ToastContainer,toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux';
import { changeCart } from '@/store/slices/cart';



const Item = ({item})=>(

    <div className="item border-b py-[15px] flex items-center gap-[10px] text-gray-500">
                    <span className='text-black text-[22px] font-bold'>{item.quantity}</span>
                     <span className='text-[20px]'>x</span>
                    <span className='text-[20px]'>{item.name}</span>
    </div>

)

const Checkout = () => {

    const dispatch = useDispatch();

    const router = useRouter();

    const [cookie,setCookie] = useCookies(['lamona-user']);

    const [loader1,setLoader1] = useState(false);
    const [loader2,setLoader2] = useState(false);

    const [showPaymentPage,setShowPayment] = useState(false);

    const [cartData,setCartData] = useState(null);
    const [userData,setUserData] = useState({
        id: "",
        username: "",
        address: "",
        email: "",
        phoneNumber: ""
    });

    useEffect(()=>{

        if(!cookie['lamona-user']){

            return router.push("/");
        }

        const cartLocalStorage = window.localStorage.getItem('lamona-cart');

        if(!cartLocalStorage){

            return router.push("/");
        }

        const cartItems = JSON.parse(cartLocalStorage);

        if(cartItems.length === 0){

            router.push("/");
        }

        (
            async function(){
                
                try{

                    const res = await fetch("/api/cart",{
                        method: "POST",
                        body: JSON.stringify({cart: cartItems})
                    });

                    const data = await res.json();

                    if(data.status === httpStatus.SUCCESS){

                        const validProducts = data.validProducts;

                        if(validProducts.length > 0){

                            setCartData(validProducts);

                        } else{

                            router.push("/");
                        }


                    } else{

                        router.push('/');
                    }

                } catch(err){

                    console.log(err);
                    router.push('/');
                }
            }
        )()
    },[])

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


                    if(data.status === httpStatus.SUCCESS){

                        setUserData({...userData, 
                            id: data.user.id,
                            username: data.user.username,
                            email: data.user.email, 
                            phoneNumber: data.user.phoneNumber});
                        
                    } else{

                        router.push('/');
                    }

                } catch(err){

                    router.push('/');
                }
            }
        )()

    },[])

    let total = 0;

    if(cartData){

        total = cartData.reduce((acc,item)=> (item.price * item.quantity) + acc, 10);
    }

    let html = ""

    if(cartData && userData && total !== 0){


     html = `
                   <html>
                     <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
                       <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                         <h2 style="color: #4CAF50; text-align: center;">Thank You for Your Order!</h2>
                         <p style="font-size: 16px;">Hello <strong>${userData.username}</strong>,</p>
                         <p style="font-size: 16px;">We are pleased to confirm your order. Below are the details of your purchase:</p>
                         
                         <h3 style="color: #4CAF50;">Order Details:</h3>
                         <table style="width: 100%; border-collapse: collapse;">
                           <thead>
                             <tr>
                               <th style="border-bottom: 1px solid #dddddd; padding: 10px;">Item</th>
                               <th style="border-bottom: 1px solid #dddddd; padding: 10px;">Quantity</th>
                               <th style="border-bottom: 1px solid #dddddd; padding: 10px;">Price</th>
                             </tr>
                           </thead>
                           <tbody>
                             ${cartData.map(item => `
                               <tr>
                                 <td style="border-bottom: 1px solid #dddddd; padding: 10px;">${item.name}</td>
                                 <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: center;">${item.quantity}</td>
                                 <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: right;">$${item.price}</td>
                               </tr>
                             `).join('')}
                             <tr>
                                 <td style="border-bottom: 1px solid #dddddd; padding: 10px;">Delivery</td>
                                 <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: center;">/</td>
                                 <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: right;">$10</td>
                               </tr>
                           </tbody>
                         </table>
                         
                         <h3 style="color: #4CAF50; text-align: right;">Total Amount: $${total}</h3>
                         
                         <h3 style="color: #4CAF50;">Customer Information:</h3>
                         <p>Email: <a href="mailto:${userData.email}">${userData.email}</a></p>
                         <p>Phone: <a href="tel:${userData.phoneNumber}">${userData.phoneNumber}</a></p>
                 
                         <p style="font-size: 16px;">If you have any questions about your order, feel free to reach out to us.</p>
                         <p style="font-size: 16px;">Thank you for shopping with us!</p>
                         
                         
                         <p style="text-align: center; font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Lamona. All rights reserved.</p>
                       </div>
                     </body>
                   </html>
                 `;

    }


    //orders functions
    async function placeNoPaidOrder(){

        setLoader1(true);

        try{

            const res = await fetch("/api/checkout/order",{
                method: "POST",
                body: JSON.stringify({cart: cartData, userData,total,paid: false})
            });

            const data = await res.json();


            if(data.status === httpStatus.SUCCESS){
                
                (
                    async function(){

                        try{

                            const res = await fetch("/api/email",{
                                method: "POST",
                                body: JSON.stringify({email: userData.email, subject: "Order Invoice",html})
                            })

                            setLoader1(false);

                            if(res.ok){

                                window.localStorage.removeItem('lamona-cart');
                                dispatch(changeCart(0));
                                router.push("/success-page");
                            }

                        } catch(err){

                            setLoader1(false);
                            console.log(err)
                        }
                    }
                )()

            } else{

                setLoader1(false);

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

            setLoader1(false);
            
            Swal.fire({
                icon: "error",
                title: err.message
            })
        }
    }

    async function changeToPaymentPage(){

        setLoader2(true);

        try{

            const res = await fetch("/api/checkout/verify",{
                method: "POST",
                body: JSON.stringify(userData)
            });

            const data = await res.json();

            setLoader2(false);

            if(data.status === httpStatus.SUCCESS){

                setShowPayment(true);

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

            setLoader2(false);
            console.log(err);
        }
    }


  return (
    <>

    <ToastContainer theme='colored' position='top-left' />

      {( cartData === null || userData.email === "") ? <PageLoading />

      :
       ( showPaymentPage ? <PaymentPage html={html} total={total} cart={cartData} userData={userData} handleChange={setShowPayment} />

        : <div>
        <Header />

        <p className='text-[14px] font-semibold px-[20px] mt-[20px] mb-[40px]'>
           <Link href="/" className='text-main underline'>Home</Link> {" "}
            {">"} 
            {" "} <Link href="/cart" className='text-main underline'>Cart</Link> {" "}
            {">"} 
            Checkout
         </p>


         <div className="px-[30px] flex flex-col xl:flex-row gap-[20px] xl:items-start">

            <div className="billing bg-white rounded-[6px] p-[30px] flex-1">

                <h1 className='text-[25px] font-semibold'>Billing Details</h1>

                <form>
                    
                    <div className="my-[30px]">
                        <label className='checkout-label' htmlFor="full-address">Full Address</label>
                       <input onChange={(e)=>setUserData({...userData, address: e.target.value})} className='checkout-input' id="full-address" type="text" placeholder='Full Address' />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-[15px]">

                    <div className="flex-1">
                        <label className='checkout-label' htmlFor="email">Email</label>
                       <input className='checkout-input pointer-events-none bg-[#eee]' id="email" type="email" value={userData.email} placeholder='Your Email' />
                    </div>

                    <div className="flex-1">
                        <label className='checkout-label' htmlFor="mobile">Phone Number</label>
                       <input className='checkout-input pointer-events-none bg-[#eee]' id="mobile" type="tel" value={userData.phoneNumber} placeholder='Your Phone Number' />
                    </div>


                    </div>

                </form>
            </div>

            <div className="cart-details bg-white rounded-[6px] p-[30px] flex-1">

            <h1 className='text-[25px] font-semibold'>Cart Details</h1>

            <div className="mt-[30px]">

                {
                    cartData.map(item=><Item key={item.id} item={item} />)
                }

                <p className='text-gray-500 text-[20px] flex items-center gap-[10px] mt-[20px]'>

                    Delivery: 
                    <span className='text-black text-[22px] font-semibold'>$10</span>

                </p>

                <div className="mt-[20px] text-center">
                    <h1 className='font-semibold text-[30px] mb-[10px]'>Total:</h1>
                    <h1 className='text-main font-bold text-[35px]'>${total}</h1>
                </div>

                <div className="buttons flex flex-col sm:flex-row items-center gap-[15px] text-center mt-[30px]">

                    <button
                     onClick={placeNoPaidOrder}
                     className={`${loader1 ? "pointer-events-none" : ""} flex justify-center items-center gap-[5px] h-[40px] text-[18px] rounded-[5px] w-full bg-main text-white mx-auto`}
                     >
                        {
                            loader1 ? <Loader />

                            : <>

                            <MdBorderColor />
                             Place Order
                            </>
                        }
                    </button> 

                    <span className='font-bold'>OR</span> 

                    <button 
                    onClick={changeToPaymentPage}
                    className={`${loader2 ? 'pointer-events-none' : ''} flex justify-center items-center gap-[5px] h-[40px] text-[18px] rounded-[5px] w-full bg-red-500 text-white mx-auto`}
                    >
                        {
                            loader2 ? <Loader />

                            : <>

                            <MdPayment />
                             Pay Now
                            </>
                        }
                    </button>

                </div>

            </div>

            </div>

         </div>

       </div>
       )

      }
    </>
  )
}

export default Checkout
