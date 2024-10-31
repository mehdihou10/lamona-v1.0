import pool from "@/db/connection";
import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server"

export const POST = async(req)=>{

    try{

        const {wishlist} = await req.json();

        const validProducts = [];

        const invalidProducts = [];

        for(const id of wishlist){

            const product = await pool`SELECT * FROM product WHERE id=${id}`;

            if(product.length > 0){

                validProducts.push(product[0]);

            } else{

                invalidProducts.push(id);
            }
        }

        return NextResponse.json({status: httpStatus.SUCCESS, validProducts, invalidProducts});


    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}