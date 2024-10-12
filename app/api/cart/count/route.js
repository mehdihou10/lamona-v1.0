import pool from "@/db/connection";
import { decryptData } from "@/utils/crypt";
import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/cart/count:
 *   get:
 *     tags:
 *       - Cart APIs 
 *     summary: count Products in Cart
 *     description: Returns the counter of user's Products in the Cart
 *     parameters:
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
 *                 count:
 *                   type: string
 */


export const GET = async(req)=>{

    try{

        const headers = new Headers(req.headers);

        const token = decodeURIComponent(headers.get("ath").split(" ")[1]);

        const user = decryptData(token);

        const count = await pool`SELECT COUNT(*) FROM cart WHERE id_user=${user.id}`;

        return NextResponse.json({status: httpStatus.SUCCESS, count: count[0].count});

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}