import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
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


export default {
  userLogin,
  userSignup,
  userLogout,
  userStatus,
};