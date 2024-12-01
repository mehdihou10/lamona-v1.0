"use client";

import {useState,useEffect} from 'react'
import {ThreeDots} from 'react-loader-spinner';
import { useRouter } from 'next/navigation';
import { Table } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { httpStatus } from '@/utils/https.status';
import Swal from 'sweetalert2';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { FaChevronLeft,FaChevronRight } from "react-icons/fa6";
import { MdClose } from 'react-icons/md';



const Products = () => {

  const router = useRouter();

  const [products,setProducts] = useState([]);
  const [page,setPage] = useState(1);
  const [pages,setPages] = useState(0);
  const [searchText,setSearchText] = useState("");
  const [showPagination,setShowPagination] = useState(true);

  useEffect(()=>{

    if(searchText === ""){
      getPages();
      fetchProducts(1);
    }
    

  },[searchText])

  async function fetchProducts(page){

    try{

      const res = await fetch(`/api/products`,{
        headers: {
          "page": page
        }
      });

      const data = await res.json();

      if(res.ok){

        const productsData = data.products;

        if(productsData.length > 0) setProducts(data.products);
        
      } else{

        router.push("/");

      }

    } catch(err){

      console.log(err);
    }
  }

  async function getPages(){

    try{

      const res = await fetch("/api/products/pages",{
        headers: {
          "ath": "admin"
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

  function deleteProduct(id){


    Swal.fire({
      icon: "warning",
      title: "Are You Sure?",
      showCancelButton: true

    }).then(async(res)=>{

      if(res.isConfirmed){

        setProducts([]);
        setShowPagination(false);
        
        try{

          const res = await fetch(`/api/admin/products/${id}`,{
            method: "DELETE"
          });

          const data = await res.json();
    
          if(res.ok){
    
            toast.success("Product Deleted!");
            fetchProducts(1);
            getPages();
            setShowPagination(true)
            setSearchText("");
    
    
          } else{
    
            toast.error(data.message);
            fetchProducts(page)
          }
    
        } catch(err){

          console.log(err);
          fetchProducts(page)
        }
      }
    })

    
  }

  let items = [];

  for(let i = 1; i <= pages; i++){

    items.push(i);
  }

  function handlePageClick(e){

    const currentPage = (+e.selected + 1);
    setProducts([]);
    setPage(currentPage)
    fetchProducts(currentPage)
  }

  async function handleChange(e){

    setProducts([]);

    const text = e.target.value;

    setSearchText(text);

    try{

      const res = await fetch("/api/admin/products/search",{
        method: "POST",
        body: JSON.stringify({searchText: text})
      });

      const data = await res.json();

      if(res.ok){

        const products = data.products;

        if(products.length === 0){

          setProducts(null);

        } else{

          setProducts(products);
        }

      }

    } catch(err){

      console.log(err);
    }


  }


  return (
    <>

    <ToastContainer theme='colored' position='top-left' />

    <div className="px-[20px]">

    <Link href="/products/add" className='my-[20px] w-[125px] max-w-full h-[40px] grid place-items-center bg-main text-white font-semibold'>Add Product</Link>


<div className="relative w-fit">

   <input 
     onChange={handleChange}
     value={searchText}
     className='block mb-[20px] rounded-[5px] w-[300px] max-w-full'
     type="text"
     placeholder='Search For Products...' 
     />

     { searchText !== "" &&
      <MdClose
      onClick={()=>setSearchText("")}
      className='absolute top-1/2 -translate-y-1/2 right-[10px] cursor-pointer text-black' 
    />
    }

   </div>


    </div>

      { products === null ? <p className='text-gray-700 italic text-center font-semibold'>Nothing To Show</p>

        : (products.length === 0 ?

        <div className="px-[30px]">
         <ThreeDots
        visible={true}
        height="100"
        width="100"
        color="#0d53bb"
        radius="9"
        ariaLabel="three-dots-loading"
      />

       </div>

      : <div className='px-[20px]'>

      <div>

      <div className="overflow-x-auto">

  <Table>
    <Table.Head>
      <Table.HeadCell>Image</Table.HeadCell>
      <Table.HeadCell>Product name</Table.HeadCell>
      <Table.HeadCell>Price</Table.HeadCell>
      <Table.HeadCell>Stock</Table.HeadCell>
      <Table.HeadCell>Orders</Table.HeadCell>

      <Table.HeadCell>
        <span className="sr-only">Delete</span>
      </Table.HeadCell>
    </Table.Head>
    <Table.Body className="divide-y">

        {
            products.map(product=>(

    <Table.Row key={product.id} className="bg-white">

        <Table.Cell>
            <img className='w-[60px] h-[60px] object-contain' src={product.image} alt="product" />
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
          {product.name}
        </Table.Cell>
        <Table.Cell>${product.price}</Table.Cell>
        <Table.Cell>{product.stock}</Table.Cell>
        <Table.Cell>{product.orders}</Table.Cell>
        <Table.Cell>
          <div className="flex items-center gap-[15px]">

          <button onClick={()=>deleteProduct(product.id)} className="text-red-500 font-medium hover:underline">
            Delete
          </button>

          <Link href={`/products/${product.id}/update`} className="text-orange-400 font-medium hover:underline">
            Update
          </Link>

          </div>

        </Table.Cell>
      </Table.Row>

            ))
        }
      

    </Table.Body>
  </Table>
        </div>


      </div>


    </div>)
      }

      { (searchText === "" && showPagination) &&

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
  }
      
    </>
  )
}

export default Products
