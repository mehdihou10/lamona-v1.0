import pool from "@/db/connection";
import { httpStatus } from "@/utils/https.status"
import { verifyCheckoutData } from "@/utils/input.validate";
import { sendEmail } from "@/utils/send.email";
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

            items.push(`${item.qte} x ${item.name}`);

            console.log(item.id_product);

            await pool`UPDATE product 
                       SET stock=stock - ${item.qte},
                           orders = orders + 1
                       WHERE id=${item.id_product}`;           
        }

        await pool`DELETE FROM cart WHERE id_user=${userData.id}`;

        const currentTime = new Date();


        await pool`INSERT INTO "order" (id_user,data,address,total,paid,date)
                   VALUES(${userData.id},${items},${userData.address},${total},${paid},${currentTime})`;
                   
         
                   const html = `
                   <html>
                     <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
                       <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                         <h2 style="color: #4CAF50; text-align: center;">Thank You for Your Order!</h2>
                         <p style="font-size: 16px;">Hello <strong>${userData.username}</strong>,</p>
                         <p style="font-size: 16px;">We are pleased to confirm your order. Below are the details of your purchase:</p>
                         
                         <h3 style="color: #4CAF50;">Order Details:</h3>
                         <table style="width: 100%; border-collapse: collapse;">
                           <thead>
                             <tr>
                               <th style="border-bottom: 1px solid #dddddd; padding: 10px;">Item</th>
                               <th style="border-bottom: 1px solid #dddddd; padding: 10px;">Quantity</th>
                               <th style="border-bottom: 1px solid #dddddd; padding: 10px;">Price</th>
                             </tr>
                           </thead>
                           <tbody>
                             ${cart.map(item => `
                               <tr>
                                 <td style="border-bottom: 1px solid #dddddd; padding: 10px;">${item.name}</td>
                                 <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: center;">${item.qte}</td>
                                 <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: right;">$${item.price}</td>
                               </tr>
                             `).join('')}
                             <tr>
                                 <td style="border-bottom: 1px solid #dddddd; padding: 10px;">Delivery</td>
                                 <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: center;">/</td>
                                 <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: right;">$10</td>
                               </tr>
                           </tbody>
                         </table>
                         
                         <h3 style="color: #4CAF50; text-align: right;">Total Amount: $${total}</h3>
                         
                         <h3 style="color: #4CAF50;">Customer Information:</h3>
                         <p>Email: <a href="mailto:${userData.email}">${userData.email}</a></p>
                         <p>Phone: <a href="tel:${userData.phoneNumber}">${userData.phoneNumber}</a></p>
                 
                         <p style="font-size: 16px;">If you have any questions about your order, feel free to reach out to us.</p>
                         <p style="font-size: 16px;">Thank you for shopping with us!</p>
                         
                         
                         <p style="text-align: center; font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Lamona. All rights reserved.</p>
                       </div>
                     </body>
                   </html>
                 `;
                 
        
        sendEmail(html,userData.email,"Order Invoice");


        return NextResponse.json({status: httpStatus.SUCCESS})           


    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}