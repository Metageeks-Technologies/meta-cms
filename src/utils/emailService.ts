const nodemailer = require('nodemailer');

export const sendEmail = async (email: string, subject: string, body: string) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject, 
        html: body,
    });

    console.log("Email info: ", info)
    return info;
}