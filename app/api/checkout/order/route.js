import pool from "@/db/connection";
import { httpStatus } from "@/utils/https.status"
import { verifyCheckoutData } from "@/utils/input.validate";
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/checkout/order:
 *   post:
 *     tags:
 *       - Order APIs
 *     summary: Create a new order
 *     description: Endpoint to create an order based on user data, cart items, and payment status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userData:
 *                 type: object
 *                 description: The user's data
 *                 example: { "id": 1, username: "mehdi", "email": "example@m.com", "phoneNumber": "0791792707" }
 *               cart:
 *                 type: array
 *                 description: The list of items in the user's cart
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_product:
 *                       type: integer
 *                     qte:
 *                       type: integer
 *                     name:
 *                       type: string
 *               total:
 *                 type: integer
 *                 description: The total amount of the order
 *               paid:
 *                 type: boolean
 *                 description: Payment status (true if paid, false otherwise)
 *     responses:
 *       200:
 *         description: Successful operation with order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userData:
 *                   type: object
 *                   description: The user's data
 *                 cart:
 *                   type: array
 *                   description: The list of items in the cart
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_product:
 *                         type: integer
 *                       qte:
 *                         type: integer
 *                       name:
 *                         type: string
 *                 total:
 *                   type: integer
 *                   description: The total amount of the order
 *                 paid:
 *                   type: boolean
 *                   description: Payment status (true if paid, false otherwise)
 *       500:
 *         description: Server error
 */



export const POST = async(req)=>{

    try{

        const {cart,userData,total,paid} = await req.json();

        const errors = verifyCheckoutData(userData);

        
        if(errors.length > 0){
            
            return NextResponse.json({status: httpStatus.FAIL, message: errors});
        }

        const items = [];

        for(const item of cart){

            items.push(`${item.quantity} x ${item.name}`);

            await pool`UPDATE product 
                       SET stock=stock - ${item.quantity},
                           orders = orders + 1
                       WHERE id=${item.id}`;           
        }

        const currentTime = new Date();


        await pool`INSERT INTO "order" (id_user,data,address,total,paid,date)
                   VALUES(${userData.id},${items},${userData.address},${total},${paid},${currentTime})`;
                   


        return NextResponse.json({status: httpStatus.SUCCESS})           


    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}