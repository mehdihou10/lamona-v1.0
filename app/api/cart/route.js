import pool from "@/db/connection";
import { decryptData } from "@/utils/crypt";
import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags:
 *       - Cart APIs 
 *     summary: Get Cart Products
 *     description: Returns Cart's Products
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
 *                 id_product:
 *                   type: integer
 *                 qte:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */




export const GET = async (req) => {
    try {
      const headers = new Headers(req.headers);
      const token = headers.get("ath");
  
      if (!token) {
        return NextResponse.json({ status: httpStatus.FAIL, message: "Unauthorized Action" });
      }
  
      const cryptedData = decodeURIComponent(token.split(" ")[1]);
  
      const data = decryptData(cryptedData); 
  
      const cart = await pool`SELECT C.id,C.id_product,P.name,P.image,P.price,C.qte
                              FROM cart C,product P
                              WHERE C.id_product=P.id AND id_user=${data.id}`;

      return NextResponse.json({ status: httpStatus.SUCCESS, cart });
  
    } catch (err) {
      return NextResponse.json({ status: httpStatus.ERROR, message: err.message }, { status: 500 });
    }
  };