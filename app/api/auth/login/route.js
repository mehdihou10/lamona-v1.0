import pool from "@/db/connection";
import { encryptData } from "@/utils/crypt";
import { httpStatus } from "@/utils/https.status"
import { verifyUserLogin } from "@/utils/input.validate";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - User APIs
 *     summary: Login User
 *     description: Login.
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
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: "070809Lotfi#"
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
 *                 password:
 *                   type: string
 *       500:
 *         description: Server Error
 */


export const POST = async(req)=>{

    try{

        const {email,password} = await req.json();

        const errors = verifyUserLogin(email,password);

        if(errors.length > 0){

            return NextResponse.json({status: httpStatus.FAIL, message: errors})
        }

        const user = await pool`SELECT * FROM "user" WHERE email=${email}`;

        if(user.length === 0){

            return NextResponse.json({status: httpStatus.FAIL, message: "User Not Found"});
        }

        const isPasswordCorrect = await bcrypt.compare(password,user[0].password);

        if(!isPasswordCorrect){

            return NextResponse.json({status: httpStatus.FAIL, message: "Wrong Password"});
        }

        const cryptedData = encryptData({
            id: user[0].id,
            username: user[0].username,
            email: user[0].email,
            phoneNumber: user[0].phone_number
        });

        return NextResponse.json({status: httpStatus.SUCCESS, data: cryptedData});

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}