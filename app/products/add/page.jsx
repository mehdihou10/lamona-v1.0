import React from 'react'
import {ProductForm} from '@/components';

const AddProduct = () => {


  return (
    <>

      <ProductForm 
      action="Add"
      api="add"
      method="POST"
       />
    </>
  )
}

export default AddProduct
