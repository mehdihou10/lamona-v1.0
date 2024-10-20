import pool from "@/db/connection";
import { encryptData } from "@/utils/crypt";
import { httpStatus } from "@/utils/https.status"
import { verifyEmail } from "@/utils/input.validate";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';


/**
 * @swagger
 * /api/auth/password/send:
 *   post:
 *     tags:
 *       - User APIs
 *     summary: Send Reset Link To User's Email
 *     description: Reset Link.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: "user@example.com"
 *               url:
 *                 type: string
 *                 description: The Website Location Origin
 *                 example: "http://localhost:3000"
 *     responses:
 *       200:
 *         description: Successful/Failed response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 url:
 *                   type: string
 *       500:
 *         description: Server Error
 */



export const POST = async(req)=>{

    try{

        const {email,url} = await req.json();

        const error = verifyEmail(email);

        if(error.length > 0){

            return NextResponse.json({status: httpStatus.FAIL, message: error});
        }

        const user = await pool`SELECT id FROM "user" WHERE email=${email}`;

        if(user.length === 0){

            return NextResponse.json({status: httpStatus.FAIL, message: "User Not Found"});
        }

        const cryptedLink = encryptData(user[0]);

        const token = jwt.sign({url: cryptedLink},process.env.JWT_KEY,{expiresIn: "5min"});

        const html = `
        <p>Follow this link to reset your password.</p>
        <a href=${url}/auth/password/reset/${token}>
        Click Here
        </a>

        <h3>(this link will expire in 5 minutes)</h3>
        `

        return NextResponse.json({status: httpStatus.SUCCESS, html});

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}