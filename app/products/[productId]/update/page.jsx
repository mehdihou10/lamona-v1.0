"use client";

import {useState,useEffect} from 'react'
import {ProductForm, PageLoading} from '@/components';
import { useRouter } from 'next/navigation';

const UpdateProduct = ({params}) => {

    const {productId} = params;

    const router = useRouter();

    const [productData,setProductData] = useState({});

    useEffect(()=>{

        (
            async function(){

                try{

                    const res = await fetch(`/api/products/${productId}`);

                    if(res.ok){

                        const data = await res.json();

                        setProductData(data.product)

                    } else{

                        router.push('/admin/products');
                    }
        
                } catch(err){
                    console.log(err);
                }
            }
        )()

    },[])


  return (
    <>

    {
        Object.keys(productData).length === 0 ?

        <PageLoading />

        : 

        <ProductForm
        action="Update"
        api={productId}
        method="PUT"
        data={productData}
        />
    }
      
    </>
  )
}

export default UpdateProduct
