import { decryptData } from "@/utils/crypt";
import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/decrypt:
 *   get:
 *     tags:
 *       - User APIs
 *     summary: Decrypt the user token
 *     description: Returns decrypted user information based on a custom Bearer token.
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
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */



export const GET = async(req)=>{


    try{

        const headers = new Headers(req.headers);

        const token = headers.get("ath")


        const crypted = decodeURIComponent(token.split(' ')[1]);
        
        const user = decryptData(crypted);

        return NextResponse.json({status: httpStatus.SUCCESS, user});

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}