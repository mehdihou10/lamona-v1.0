import pool from "@/db/connection";
import { encryptData } from "@/utils/crypt";
import { httpStatus } from "@/utils/https.status"
import { verifyUserSignup } from "@/utils/input.validate";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - User APIs
 *     summary: Sign up new User
 *     description: Create new User.
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
 *               userCode:
 *                 type: integer
 *                 description: User Input
 *                 example: 123456
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
 *                 phoneNumber:
 *                   type: string
 *                 password:
 *                   type: string
 *                 code:
 *                   type: integer 
 *                 userCode:
 *                   type: integer  
 *       500:
 *         description: Server Error
 */


export const POST = async(req)=>{

    try{

        const body = await req.json();

        const errors = verifyUserSignup(body);

        if(errors.length > 0){

            return NextResponse.json({status: httpStatus.FAIL, message: errors});
        }

        if(body.userCode.trim() === ""){

            return NextResponse.json({status: httpStatus.FAIL, message: "Your Code is Empty"})
        }

        const user = await pool`SELECT id
                                FROM "user"
                                WHERE email=${body.email}
                                 OR phone_number=${body.phoneNumber}
                                 OR LOWER(username)=${body.username.toLowerCase()}`;

        if(user.length > 0){

            return NextResponse.json({status: httpStatus.FAIL, message: "User Already Signed Up"});

        }

        if(+body.code !== +body.userCode){

            return NextResponse.json({status: httpStatus.FAIL, message: "Incorrect Code"});
        }

        const hashedPassword = await bcrypt.hash(body.password,10);


        await pool` INSERT INTO "user" (username,email,password,phone_number)
                    VALUES(${body.username},${body.email},${hashedPassword},${body.phoneNumber})`;

        const newUser = await pool`SELECT id,username,email,phone_number FROM "user" WHERE email=${body.email}`;            

        const cryptedData = encryptData({
            id: newUser[0].id,
            username: newUser[0].username,
            email: newUser[0].email,
            phoneNumber: newUser[0].phone_number
        });
        
        return NextResponse.json({status: httpStatus.SUCCESS, data: cryptedData});


    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500})
    }
}