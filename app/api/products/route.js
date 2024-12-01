import pool from "@/db/connection";
import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server"
import { LIMIT } from "@/utils/pagination.data";

export const GET = async(req)=>{

    try{

        const headers = new Headers(req.headers);

        if(!headers){

            return NextResponse.json({status: httpStatus.FAIL, message: "Unauthorized Action"},{status: 401})
        }

        const page = headers.get('page');

        if(!page){

            return NextResponse.json({status: httpStatus.FAIL, message: "Unauthorized Action"},{status: 401})
        }

        const skip = (+page - 1) * LIMIT;

        const products = await pool`SELECT * FROM product ORDER BY orders DESC LIMIT ${LIMIT} OFFSET ${skip}`

        return NextResponse.json({status: httpStatus.SUCCESS, products})

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message}, {status: 500});
    }
}