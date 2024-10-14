"use client";

import {useEffect,useState} from 'react'
import { ThreeDots } from 'react-loader-spinner';
import { Product } from '@/components';


const Products = () => {

  const [products,setProducts] = useState([]);

  useEffect(()=>{

    const fetchProducts = async()=>{

      try{

        const res = await fetch("/api/products",{
          method: "POST",
          body: JSON.stringify({})
        });

        const data = await res.json();

        setProducts(data.products);

      } catch(err){
        alert(err.message);
      }
    }

    fetchProducts();

  },[])


  return (
    <div id='products' className='mt-[50px] px-[20px]'>
      
      <h1 className='mb-[40px] font-semibold text-[30px]'>Our Products: </h1>

      {
        products.length === 0
         
        ? <div>

          <ThreeDots
            visible={true}
            height="100"
            width="100"
            color="#0d53bb"
            radius="9"
            ariaLabel="three-dots-loading"
          />

        </div>

        : <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] mb-[50px]'>
          {
            products.map(product=><Product key={product.id} product={product} />)
          }
        </div>
      }

      
    </div>
  )
}

export default Products
