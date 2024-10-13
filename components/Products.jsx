"use client";

import {useEffect,useState} from 'react'
import { ThreeDots } from 'react-loader-spinner';
import Link from 'next/link';


const Products = () => {

  const [products,setProducts] = useState([]);

  useEffect(()=>{

    const fetchProducts = async()=>{

      try{

        const res = await fetch("/api/products");

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
            products.map(product=>(
              <div className='bg-white rounded-[6px] overflow-hidden'>

              <img
               src={product.image}
                alt="product"
              />
        
              <div className="px-[20px]">
        
              <h3 className='text-[18px] font-semibold h-[80px]'>{product.name}</h3>
        
              <h1 className='text-center text-main text-[25px] font-bold my-[15px]'>${product.price}</h1>
        
              <h3 className='font-semibold text-[18px]'>Stock: <span className='font-bold text-[20px]'>{product.stock}</span></h3>
        
              <Link 
              href={`/products/${product.id}`}
              className="grid place-items-center w-full h-[40px] text-[18px] font-semibold text-white bg-main my-[20px]"
              >
                More Details
              </Link>
              </div>
        
            </div>
            ))
          }
        </div>
      }

      
    </div>
  )
}

export default Products
