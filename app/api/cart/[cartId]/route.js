import pool from "@/db/connection";
import { decryptData } from "@/utils/crypt";
import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/cart/{cartId}:
 *   delete:
 *     tags:
 *       - Cart APIs 
 *     summary: Delete Cart Item
 *     description: Cart's Item delete
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         description: The ID of the cart to delete
 *         schema:
 *           type: string
 *           example: "1"
 *       - in: header
 *         name: ath
 *         required: true
 *         description: Custom Bearer token for authorization
 *         schema:
 *           type: string
 *           example: "Bearer U2FsdGVkX1%2FoLhHgVVi%2FXEohrWJvQg9v%2Fg6B1cM8pIZsh4LJZg%2FcSLltds8YQYFRLUICHnqQawQpy9nSsVEP89QDMwtMi%2F8GbM4OqWg21UmYcrlkPkzHgZ6fiV4B3HFkTfgyOEgOpsu1dwPTHm93Tw%3D%3D"
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
 *                 id_user:
 *                   type: string
 *                 id_product:
 *                   type: integer
 *                 qte:
 *                   type: integer
 *       500:
 *         description: Server Error
 */


export const DELETE = async(req,{params})=>{

    try{

        const {cartId} = params;

        const headers = new Headers(req.headers);

        const token = decodeURIComponent(headers.get("ath").split(' ')[1]);

        if(!token){

            return NextResponse.json({status: httpStatus.FAIL, message: "Unauthorized action"});
        }

        const user = decryptData(token);

        await pool`DELETE FROM cart WHERE id=${cartId} AND id_user=${user.id}`;

        return NextResponse.json({status: httpStatus.SUCCESS});

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}