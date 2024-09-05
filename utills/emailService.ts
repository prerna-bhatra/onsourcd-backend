import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// const { EMAIL_USER, EMAIL_PASS, JWT_SECRET } = process.env;

// if (!EMAIL_USER || !EMAIL_PASS || !JWT_SECRET) {
//   throw new Error("Missing environment variables");
// }

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "",
    pass: "",
  },
});


export const sendVerificationEmail = async (token:string , email:string) => {
  const mailOptions = {
    from: 
  to: email,
    subject: 'Email Verification',
    html: `
      <h1>Email Verification</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a>Verify Email</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('Verification email sent successfully');
    return true;
  } catch (error) {
    return false
    console.error('Error sending verification email:', error);
  }
};


export const sendResetPasswodOtp = async (otp:number , email:string) => {
  const mailOptions = {
    from: "bhatraprerna061@gmail.com",
  to: email,
    subject: 'Password Reset ',
    html: `Use the code ${otp} to create new password  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('Verification email sent successfully');
    return true;
  } catch (error) {
    return false
    console.error('Error sending verification email:', error);
  }
};

// sendVerificationEmail("hi","")
