import { httpStatus } from "@/utils/https.status"
import { verifyPassword } from "@/utils/input.validate";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { decryptData } from "@/utils/crypt";
import pool from "@/db/connection";

/**
 * @swagger
 * /api/auth/password/reset:
 *   post:
 *     tags:
 *       - User APIs
 *     summary: Reset User's Passwrd
 *     description: Reset Password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: "070707Lotfi#"
 *               token:
 *                 type: string
 *                 description: JWT Token
 *                 example: "..."
 *     responses:
 *       200:
 *         description: Successful/Failed response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 password:
 *                   type: string
 *                 token:
 *                   type: string
 *       500:
 *         description: Server Error
 */


export const POST = async(req)=>{

    try{

        const {password,token} = await req.json();

        const error = verifyPassword(password);

        try{

            jwt.verify(token,process.env.JWT_KEY);

        } catch(err){

            return NextResponse.json({status: httpStatus.FAIL, message: "Your Token is Invalid"});
        }

        if(error.length > 0){

            return NextResponse.json({status: httpStatus.FAIL, message: error});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const decoded = jwt.decode(token,process.env.JWT_KEY);

        const user = decryptData(decoded.url);

        const id = user.id;

        await pool`UPDATE "user"
               SET password=${hashedPassword}
               WHERE id=${id}`;

        
        return NextResponse.json({status: httpStatus.SUCCESS});       

        

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}