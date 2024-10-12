import { httpStatus } from "@/utils/https.status"
import { verifyUserSignup } from "@/utils/input.validate";
import { sendEmail } from "@/utils/send.email";
import { NextResponse } from "next/server";
import pool from "@/db/connection";

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     tags:
 *       - User APIs
 *     summary: Verify User Email
 *     description: Verifies the user's email and returns the request status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *                 example: "mehdi008"
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: "070809Lotfi#"
 *               phoneNumber:
 *                 type: string
 *                 description: The user's phone number
 *                 example: "0791792707"
 *               code:
 *                 type: integer
 *                 description: Verification code sent to the user
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Successful/Failed response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 code:
 *                   type: integer  
 *       500:
 *         description: Server Error
 */



export const POST = async(req)=>{

    try{

        const body = await req.json();

        const errors = verifyUserSignup(body);

        if(errors.length > 0){

            return NextResponse.json({status: httpStatus.FAIL,message: errors});
        }

        const user = await pool`SELECT id,username,email,phone_number
                                FROM "user"
                                WHERE email=${body.email}
                                 OR phone_number=${body.phoneNumber}
                                 OR LOWER(username)=${body.username.toLowerCase()}`;

        if(user.length > 0){

            return NextResponse.json({status: httpStatus.FAIL, message: "User Already Signed Up"});

        }

        const html = `
        <p>Please Copy This Code:</p>
        <h3 style='width: fit-content; padding: 10px 20px; background: #ccc'>${body.code}</h3>
        `

        sendEmail(html,body.email,"Email Verification");

        return NextResponse.json({status: httpStatus.SUCCESS});

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}