import pool from "@/db/connection";
import { httpStatus } from "@/utils/https.status";
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Product APIs 
 *     summary: Get All Products
 *     description: Returns the products' information
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: integer
 *                 image:
 *                   type: string
 *                 description:
 *                    type: string
 *                 orders:
 *                    type: integer
 *                 stock:
 *                    type: integer
 *                 
 */

export const GET = async(req)=>{

    try{

        const products = await pool`SELECT * FROM product ORDER BY orders DESC`;

        const response = NextResponse.json({ status: 'success', products });

        // Add the Cache-Control header to disable caching
       response.headers.set('Cache-Control', 'no-store'); 

       return response;

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}