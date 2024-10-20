import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req) => {
  try {
    const { email,html,subject } = await req.json();

    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
      secure: true,
    });

    // Verify the connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    const mailData = {
      from: {
        name: "Mehdi Houari",
        address: process.env.USER_EMAIL
      },
      replyTo: email,
      to: email,
      subject: subject,
      html: html,
    };

    // Send the email and store the info
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });

    // Log the response after the email is sent
    console.log("Email sent successfully:", info.response);

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.log(err.message);
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
};
