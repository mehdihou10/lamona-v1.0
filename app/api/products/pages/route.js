import pool from "@/db/connection";
import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server"
import { LIMIT } from "@/utils/pagination.data";

export const GET = async(req)=>{

    try{

        const headers = new Headers(req.headers);

        if(!headers){

            return NextResponse.json({status: httpStatus.FAIL, message: "Not Authorized"},{status: 400});
        }

        const count = await pool`SELECT COUNT(id) FROM product`;

        const productsCount = +count[0].count;

        const pages = Math.ceil(productsCount / LIMIT);

        return NextResponse.json({status: httpStatus.SUCCESS, pages})

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}