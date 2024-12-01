import pool from "@/db/connection";
import { httpStatus } from "@/utils/https.status"
import { verifyProductData } from "@/utils/input.validate";
import { NextResponse } from "next/server"

export const PUT = async(req,{params})=>{

    try{

        const {productId} = params;

        const body = await req.json();

        const errors = verifyProductData(body);

        if(errors.length > 0){

            return NextResponse.json({status: httpStatus.FAIL, message: errors},{status: 400});
        }

        const {name,image,price,description,stock} = body;


        await pool`UPDATE product
                   SET name=${name},
                   image=${image},
                   price=${price},
                   description=${description},
                   stock=${stock}
                   WHERE id=${productId}`
        

        return NextResponse.json({status: httpStatus.SUCCESS});
        
        
    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}

export const DELETE = async(req,{params})=>{

    try{

        const {productId} = params;

        const count = await pool`SELECT COUNT(id) from product`;

        if(+count[0].count === 1){

            return NextResponse.json({status: httpStatus.FAIL, message: "You must At Least have 1 Product"},{status: 400});
        }

        await pool`DELETE FROM product WHERE id=${productId}`;

        return NextResponse.json({status: httpStatus.SUCCESS})

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}