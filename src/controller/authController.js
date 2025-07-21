import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv"
dotenv.config()

import userService from "../services/userService.js";
import validateUserInput from "../utils/validateUserInput.js";

export const userLogin = async (req, res) => {

  if (!req.body || Object.keys(req.body).length === 0)
    return res.status(400).json("Request Body Missing")

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });

  try {
    const user = await userService.getUserByEmailService(email);
    if (!user) return res.status(404).json({ message: "Invalid Credentials" });

    if (password.length < 8) return res.status(400).json({ message: "Password must be atleast 8 characters" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid Credentials" });

    let accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '60m' }
    );
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      maxAge: 60 * 60 * 1000
    });
    return res.status(200).json({
      message: "Logged in",
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }


};

export const userSignup = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0)
    return res.status(404).json("Request Body Missing")

  try {
    const { valid, message, validatedData } = await validateUserInput(req.body);
    if (!valid) {
      return res.status(400).json({ message: message });
    }
    const user = await userService.userSignupService(validatedData);
    if (user) {
      let accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 60 * 60 * 1000
      });
      return res.status(200).json({
        message: "User Created",
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } else {
      return res.status(400).json({ message: 'Failed to Create' });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const userLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
    expires: new Date(0),
    path: '/',
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const userStatus = (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User is logged in",
      user: req.user,
    });
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await userService.getUserByEmailService(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expiry = Date.now() + 3600000; // 1 hour

    await userService.savePasswordResetToken(user.id, hashedToken, expiry);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&id=${user.id}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    res.status(200).json({ message: "Reset email sent" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id, token, newPassword } = req.body;
    if (!token || !id || !newPassword) return res.status(400).json({ message: "All fields required" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userService.getUserByResetToken(id, hashedToken);

    if (!user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userService.updatePassword(user.id, hashedPassword);

    // Clear reset token
    await userService.clearResetToken(user.id);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const googleLogin = async (req, res) => {
  const prisma = new PrismaClient();
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }
    const appToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token: appToken, user });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};


export default {
  userLogin,
  userSignup,
  userLogout,
  userStatus,
  forgotPassword,
  resetPassword,
  googleLogin
};