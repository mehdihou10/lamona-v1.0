import pool from "@/db/connection";
import { httpStatus } from "@/utils/https.status"
import { NextResponse } from "next/server"

export const GET = async(req)=>{

    try{

        const headers = new Headers(req.headers);

        if(!headers.get("ath")) return NextResponse.json({status: httpStatus.FAIL, message: "Unauthorized action"});

        const users = await pool`SELECT COUNT(id) FROM "user" WHERE type='user'`;
        const orders = await pool`SELECT COUNT(id) FROM "order"`;
        const products = await pool`SELECT COUNT(id) FROM product`;

        const onlineOrders = await pool`SELECT COUNT(id) FROM "order" WHERE paid='true'`;
        const offlineOrders = await pool`SELECT COUNT(id) FROM "order" WHERE paid='false'`;

        const clients_percentage = await pool`SELECT COUNT(*)
                                              FROM "user"
                                              WHERE id IN(
                                              SELECT id_user
                                              from "order"
                                              )`


        return NextResponse.json({status: httpStatus.SUCCESS, data: {
            users: users[0].count,
            orders: orders[0].count,
            products: products[0].count,
            onlineOrders: onlineOrders[0].count,
            offlineOrders: offlineOrders[0].count,
            clientsPercentage: (clients_percentage[0].count / users[0].count) * 100
    }})

    } catch(err){

        return NextResponse.json({status: httpStatus.ERROR, message: err.message},{status: 500});
    }
}