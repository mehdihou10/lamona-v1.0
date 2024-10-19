import nodemailer from 'nodemailer';

export const sendEmail = async (html, email, subject) => {
  try {

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
      from: process.env.USER_EMAIL,
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

  } catch (err) {
    console.log(err.message);
  }
};
