import pool from "@/db/connection";
import { decryptData } from "@/utils/crypt";
import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags:
 *       - Order APIs 
 *     summary: Get User's Orders
 *     description: Returns Users's Orders
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
 *                 id:
 *                   type: string
 *                 id_user:
 *                   type: string
 *                 data:
 *                   type: string
 *                 address:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 paid:
 *                   type: boolean
 *                 date: 
 *                   type: date
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */


export const GET = async(req)=>{

    try{

        const headers = new Headers(req.headers);

        const token = decodeURIComponent(headers.get('ath').split(' ')[1]);

        if(!token){

            return NextResponse.json({status: httpStatus.FAIL, message: "Unauthorized action"});
        }

        const user = decryptData(token);

        const orders = await pool`SELECT * FROM "order" WHERE id_user=${user.id} ORDER BY date DESC`;

        return NextResponse.json({status: httpStatus.SUCCESS,orders});

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}