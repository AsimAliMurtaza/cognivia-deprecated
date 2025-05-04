// lib/sendVerificationEmail.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string, link: string) {
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

export const sendEmail = async ({
  from,
  to,
  subject,
  text,
}: {
  from: string;
  to: string;
  subject: string;
  text: string;
}) => {
  await transporter.sendMail({
    from: `"Cognivia" <${from}>`,
    to,
    subject,
    text,
  });
};

export async function sendSuspiciousLoginEmail(toEmail: string, token: string) {
  const unblockLink = `${process.env.NEXTAUTH_URL}/unblock-account?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"security@Cognivia" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Suspicious Login Detected - Action Required",
    html: `
      <p>We detected multiple failed login attempts to your account and have temporarily blocked it.</p>
      <p>If this was you, please click the link below to unblock your account:</p>
      <a href="${unblockLink}">Unblock My Account</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

export async function sendPasswordEmail(
  to: string,
  subject: string,
  text: string
) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"security@Cognivia" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
