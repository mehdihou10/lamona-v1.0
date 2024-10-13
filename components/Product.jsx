import Link from "next/link"

const Product = ({product}) => {

  console.log(product)
  return (
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
  )
}

export default Product
