import pool from "@/db/connection";
import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     tags:
 *       - Product APIs 
 *     summary: Get a single Product
 *     description: Returns the product's information
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: string
 *           example: "1"
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
 *                   type: string
 *                 orders:
 *                   type: integer
 *                 stock:
 *                   type: integer
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server Error
 */



export const GET = async(req,{params})=>{

    try{

        const {productId} = params;

        if(!Number(productId)){

            return NextResponse.json({status: httpStatus.FAIL, message: "Method Not Allowed"});
        }

        const product = await pool`SELECT * FROM product WHERE id=${productId}`;

        if(product.length === 0){

            return NextResponse.json({status: httpStatus.FAIL, message: "Product Not Found"});
        }

        return NextResponse.json({status: httpStatus.SUCCESS, product: product[0]});

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}