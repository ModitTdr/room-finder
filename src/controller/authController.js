import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import userService from "../services/userService.js";
import validateUserInput  from "../utils/validateUserInput.js";


export const userLogin = async (req,res) => {
  const {email,password} = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({message: "Invalid email format" });

  try{
    const user = await userService.getUserByEmailService(email);
    if(!user) return res.status(404).json({message: "Your Email doesn't exists" });
    
    if(password.length < 8) return res.status(400).json({message: "Password must be atleast 8 characters" });
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({message: "Invalid Credentials" });

    let accessToken = jwt.sign(
    {
      "id" : user.id,
      "email" : user.email,
      "role" : user.role,
    },
    process.env.JWT_SECRET,
    {expiresIn: '15m'}
    );
    return res.status(200).json({ message: "Logged in" , accessToken});
    
  } catch(error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Something went wrong'});
  }


};

export const userSignup = async (req,res) => {

  try{
    const {valid,message,validatedData} = await validateUserInput(req.body);
    if(!valid){
      return res.status(400).json({message: message});
    }
    const newUser = await userService.userSignupService(validatedData);
    res.status(201).json({message:'User Created', data:newUser});
  }catch(error){
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Something went wrong'});
  }
};

export default {
    userLogin,
    userSignup
};