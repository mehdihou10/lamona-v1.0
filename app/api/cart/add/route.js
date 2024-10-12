import pool from "@/db/connection";
import { decryptData } from "@/utils/crypt";
import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     tags:
 *       - Cart APIs
 *     summary: Add Product to Cart
 *     description: Add To Cart.
 *     parameters:
 *       - in: header
 *         name: ath
 *         required: true
 *         description: Custom Bearer token for authorization
 *         schema:
 *           type: string
 *           example: "Bearer U2FsdGVkX1%2FoLhHgVVi%2FXEohrWJvQg9v%2Fg6B1cM8pIZsh4LJZg%2FcSLltds8YQYFRLUICHnqQawQpy9nSsVEP89QDMwtMi%2F8GbM4OqWg21UmYcrlkPkzHgZ6fiV4B3HFkTfgyOEgOpsu1dwPTHm93Tw%3D%3D"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Product Id
 *                 example: "1"
 *               qte:
 *                 type: integer
 *                 description: Product's Quantity
 *                 example: "2"
 *     responses:
 *       200:
 *         description: Successful/Failed response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                 qte:
 *                   type: integer
 *       500:
 *         description: Server Error
 */


export const POST = async(req)=>{

    try{

        const body = await req.json();

        const headers = new Headers(req.headers);

        const token = decodeURIComponent(headers.get('ath').split(' ')[1]);

        if(!token){

            return NextResponse.json({status: httpStatus.FAIL, message: "Unauthorized Action"});
        }

        const user = decryptData(token);

        const {id} = user;

        const cartData = await pool`SELECT id FROM cart WHERE id_user=${id} AND id_product=${body.productId}`;

        if(cartData.length > 0){

            return NextResponse.json({status: httpStatus.FAIL, message: "Product Already in Cart"})
        }

        await pool`INSERT INTO cart (id_user,id_product,qte) VALUES (${id},${body.productId},${body.qte})`;

        return NextResponse.json({status: httpStatus.SUCCESS});

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}