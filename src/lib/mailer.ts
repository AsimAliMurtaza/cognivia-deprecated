// lib/sendVerificationEmail.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  link: string
) {
  const mailOptions = {
    from: '"Cognivia" <no-reply@cognivia.com>',
    to: email,
    subject: "Verify Your Email",
    html: `
      <p>Click the link below to verify your email:</p>
      <a href="${link}">${link}</a>
    `,
  };

  await transporter.sendMail(mailOptions);
}
