"use client";

import Loader from 'react-js-loader';

const PageLoading = () => {
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-[#000000bd] grid place-items-center z-[10]'>

        <Loader type="box-up" />
      
    </div>
  )
}

export default PageLoading
