"use client";

import Image from 'next/image';
import Link from 'next/link';
import {useCookies} from 'react-cookie';


const SuccessPage = () => {

    const [cookie,setCookie] = useCookies(['lamona-user']);


  return (
    <div className='flex flex-col items-center mt-[100px]'>

        <Image
        src="/images/success.png"
        width={230}
        height={230}
        alt='success'
        />

        <h1 className='text-[35px] font-semibold'>Order Completed!</h1>

        <div className="buttons flex flex-wrap gap-[15px] mt-[30px]">

            {cookie["lamona-user"] &&

             <Link
              href="/orders"
              className='grid place-items-center w-[120px] h-[40px] rounded-[6px] border border-gray-500'
              >
                Show Orders
            </Link>

            }

            <Link
             href="/" 
             className='grid place-items-center w-[120px] h-[40px] rounded-[6px] bg-gray-500 text-white'
             >
                Home
            </Link>
        </div>
      
    </div>
  )
}

export default SuccessPage
