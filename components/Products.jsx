"use client";

import {useEffect,useState} from 'react'
import { ThreeDots } from 'react-loader-spinner';
import { Product } from '@/components';
import ReactPaginate from 'react-paginate';
import { FaChevronLeft,FaChevronRight } from "react-icons/fa6";



const Products = () => {

  const [products,setProducts] = useState([]);
  const [pages,setPages] = useState(0);

  useEffect(()=>{

    getPages();
    fetchProducts(1);

  },[])

  const fetchProducts = async(page)=>{

    try{

      const res = await fetch("/api/products",{
        headers: {
          "page": page
        },
      });

      const data = await res.json();

      setProducts(data.products);

    } catch(err){
      alert(err.message);
    }
  }

  async function getPages(){

    try{

      const res = await fetch("/api/products/pages",{
        headers: {
          "ath": "user"
        }
      });

      if(res.ok){

        const data = await res.json();
        setPages(data.pages);

      } else{

        toast.error(httpStatus.SERVER_ERROR_MESSAGE)
      }

    } catch(err){

      console.log(err.message);
    }
  }

  function handlePageClick(e){

    setProducts([]);
    const currentPage = (+e.selected + 1);
    fetchProducts(currentPage)
  }

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

        :
        
         <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]'>
          {
            products.map(product=><Product key={product.id} product={product} />)
          }
        </div>

        
      }

      <ReactPaginate
        breakLabel="..."
        pageCount={pages}
        pageRangeDisplayed={1}
        marginPagesDisplayed={1}
        renderOnZeroPageCount={null}
        onPageChange={handlePageClick}
        previousClassName={"pagination-direction"}
        nextClassName={"pagination-direction"}
        previousLabel={<FaChevronLeft style={{ fontSize: 18, width: 150 }} />}
        nextLabel={<FaChevronRight style={{ fontSize: 18, width: 150 }} />}
        containerClassName={'pagination'}
        pageLinkClassName={'pagination-item'}
        activeLinkClassName={'pagination-active '}
      />

      
    </div>
  )
}

export default Products
