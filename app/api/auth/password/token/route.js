import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/auth/password/token:
 *   post:
 *     tags:
 *       - User APIs
 *     summary: Verify Token Validity
 *     description: Token Validation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT Token
 *                 example: "..."
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       500:
 *         description: Server Error
 */


export const POST = async(req)=>{

    try{

        const {token} = await req.json();

        jwt.verify(token,process.env.JWT_KEY);

        return NextResponse.json({status: httpStatus.SUCCESS});

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500})
    }
}