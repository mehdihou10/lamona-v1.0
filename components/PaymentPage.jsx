"use client";

import convertToSubcurrency from '@/utils/convertToSubcurrency';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "@/components/CheckoutPage";
import { MdKeyboardBackspace } from "react-icons/md";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const PaymentPage = ({total,cart,userData,handleChange}) => {

  return (
    <>

    <div onClick={()=>handleChange(false)} className="cursor-pointer m-[20px] grid place-items-center w-[40px] h-[40px] rounded-[4px] border border-black text-[20px]">
      <MdKeyboardBackspace className='pointer-events-none' />
    </div>

        <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr bg-main">
        <div className="mb-10">
          <h2 className="text-2xl">
            You are requested to Pay:
            <span className="font-bold"> ${total}</span>
          </h2>
        </div>
  
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(total),
            currency: "usd",
          }}
        >
          <CheckoutPage amount={total} cart={cart} userData={userData}/>
        </Elements>
      </main>
    


    </>
  )
}

export default PaymentPage
