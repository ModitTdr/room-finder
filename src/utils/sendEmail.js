import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
   if (!to) throw new Error("Recipient email (to) is missing");

   const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS,
      },
   });

   await transporter.sendMail({
      from: `"RoomFinder Support" <support@roomfinder.com>`,
      to,
      subject,
      html,
   });
};
