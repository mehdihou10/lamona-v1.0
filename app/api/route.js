import { NextResponse } from "next/server"
import pool from "@/db/connection";
import {encryptData,decryptData} from '@/utils/crypt';

/**
 * @swagger
 * /api:
 *   get:
 *     tags:
 *       - User APIs 
 *     summary: Get user information
 *     description: Returns the user's information
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
 *                 name:
 *                   type: string
 */


export const GET = async(req)=>{

    try{

        const users = await pool`SELECT * FROM "user"`;

        const cr = encryptData(users[0]);

        const dr = decryptData(cr)

        return NextResponse.json({users,dr});

    } catch(err){

        return NextResponse.json({status: "ERROR",message: err.message},{status: 500});
    }
}