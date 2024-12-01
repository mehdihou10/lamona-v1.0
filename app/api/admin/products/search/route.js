import pool from "@/db/connection";
import { httpStatus } from "@/utils/https.status"
import { verifySearchText } from "@/utils/input.validate";
import { NextResponse } from "next/server"

export const POST = async(req)=>{

    try{

        let {searchText} = await req.json();

        searchText = searchText.toLowerCase();

        const error = verifySearchText(searchText);

        if(error.length > 0){

            return NextResponse.json({status: httpStatus.FAIL, message: error},{status: 400});
        }

        const products = await pool`
        SELECT * 
        FROM product 
        WHERE LOWER(name) LIKE ${'%' + searchText + '%'} 
           OR LOWER(description) LIKE ${'%' + searchText + '%'}`;
      
        return NextResponse.json({status: httpStatus.SUCCESS, products});

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}