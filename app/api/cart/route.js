import pool from "@/db/connection";
import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server"


export const POST = async(req)=>{

  try{

    const {cart} = await req.json();

    let validProducts = [];

    let invalidProducts = [];

    for(const item of cart){

      const product = await pool`SELECT * FROM product WHERE id=${item.id}`;

      if(product.length > 0){

        validProducts.push({...product[0], quantity: item.qte});

      } else{

        invalidProducts.push(item.id);
      }
    }


    return NextResponse.json({status: httpStatus.SUCCESS, validProducts, invalidProducts});

  } catch(err){

    return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
  }
}