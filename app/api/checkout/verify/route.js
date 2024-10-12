import { httpStatus } from "@/utils/https.status"
import { verifyCheckoutData } from "@/utils/input.validate";
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/checkout/verify:
 *   post:
 *     tags:
 *       - Order APIs
 *     summary: Verify Order's User Data
 *     description: Verification of Data.
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
 *               phoneNumber:
 *                 type: string
 *                 description: The user's Phone Number
 *                 example: "0791792707"
  *               address:
 *                 type: string
 *                 description: The user's Address
 *                 example: "Boussouf,Constantine,Algeria"
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
 *                 phoneNumber:
 *                   type: string
 *                 address:
 *                   type: string
 *       500:
 *         description: Server Error
 */


export const POST = async(req)=>{

    try{

        const body = await req.json();

        const errors = verifyCheckoutData(body);

        if(errors.length > 0){

            return NextResponse.json({status: httpStatus.FAIL, message: errors});
        }

        return NextResponse.json({status: httpStatus.SUCCESS})

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}