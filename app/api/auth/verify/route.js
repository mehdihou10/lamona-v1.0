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
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #4CAF50; text-align: center;">Email Verification</h2>
      <p style="font-size: 16px;">Please copy the verification code below to complete your signup process:</p>
      <h3 style="width: fit-content; padding: 10px 20px; background: #ccc; text-align: center;">${body.code}</h3>
      <p style="font-size: 16px;">If you did not request this verification, please ignore this email.</p>
      <p style="text-align: center; font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Lamona. All rights reserved.</p>
    </div>
  </body>
</html>
`;


        sendEmail(html,body.email,"Email Verification");

        return NextResponse.json({status: httpStatus.SUCCESS});

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}