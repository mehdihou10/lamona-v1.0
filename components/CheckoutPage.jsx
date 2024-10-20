"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/utils/convertToSubcurrency";
import { httpStatus } from "@/utils/https.status";
import Swal from "sweetalert2";


const CheckoutPage = ({html,amount,cart,userData}) => {

    
    const router = useRouter();

  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/create-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.clientSecret));
      }, [amount]);


      async function handleSubmit(e){

        e.preventDefault();
    
        setLoading(true);
    
        if (!stripe || !elements) {
          return;
        }
    
        const { error: submitError } = await elements.submit();
    
        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
          }
      
          const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
    
                return_url: `http://www.localhost:3000/payment-success?amount=${amount}`
              
            },
            redirect: "if_required"
          });
      
          if (error) {
            // This point is only reached if there's an immediate error when
            // confirming the payment. Show the error to your customer (for example, payment details incomplete)
            setErrorMessage(error.message);
          } else {
            
            (
                async function(){
    
                    try{
    
                        const res = await fetch(`/api/checkout/order`,{
                            method: "POST",
                            body: JSON.stringify({cart,userData,total: amount,paid: true})
                        });

                        const data = await res.json();

                        if(data.status === httpStatus.SUCCESS){

                          (
                            async function(){

                              try{

                                const res = await fetch("/api/email",{
                                  method: "POST",
                                  body: JSON.stringify({email: userData.email, subject: "Order Invoice", html})
                                })

                              } catch(err){
                                console.log(err);
                              }
                            }
                          )()

                            router.push("/success-page");

                        } else{

                            Swal.fire({
                                icon: "error",
                                title: httpStatus.SERVER_ERROR_MESSAGE
                            })
                        }
    
    
                    } catch(err){

                        Swal.fire({
                            icon: "error",
                            title: err.message
                        })

                        setLoading(false)
                    }
    
                    
    
                
                }
            )()
          }
      
          
      } 


      if (!clientSecret || !stripe || !elements) {
        return (
          <div className="flex items-center justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        );
      }
    
      return (
    
        <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
    
    {clientSecret && <PaymentElement />}
    
    {errorMessage && <div>{errorMessage}</div>}
    
    <button
            disabled={!stripe || loading}
            className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
          >
            {!loading ? `Pay $${amount}` : "Processing..."}
          </button>
        </form>
      )
}

export default CheckoutPage
