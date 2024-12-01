import pool from "@/db/connection";
import { httpStatus } from "@/utils/https.status"
import { verifyProductData } from "@/utils/input.validate";
import { NextResponse } from "next/server"

export const POST = async(req)=>{

    try{

        const body = await req.json();

        const errors = verifyProductData(body);

        if(errors.length > 0){

            return NextResponse.json({status: httpStatus.FAIL, message: errors},{status: 400});
        }

        const {name,image,price,description,stock} = body;

        await pool`INSERT INTO product (name,image,price,description,stock)
                   VALUES(${name},${image},${price},${description},${stock})`;


        return NextResponse.json({status: httpStatus.SUCCESS})           

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}