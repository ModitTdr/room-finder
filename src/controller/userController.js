import userService from "../services/userService.js";
import validateUserInput  from "../utils/validateUserInput.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "../secret.js"

export const getAllUser = async (req, res) => {
  try{
    const users = await userService.getAllUserService();
    if(!users || users.length === 0) return res.status(404).json({message:"No Users Available "});
    res.status(200).json({message:"All User's Data",data: users});
  }catch(error){
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  try{
    const user = await userService.getUserByIdService(userId);
    if (!user) return res.status(404).json({ message: "User Not Found"});
    res.status(200).json({data: user});
  }catch(error){
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
};

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
      UserInfo:{
        "email" : user.email,
        "role" : user.role,
      }
    },
    JWT_SECRET,
    {expiresIn: '15m'}
    );
  } catch(error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Something went wrong'});
  }

  

  return res.status(200).json({ message: "Logged in" , accessToken});
};

export const userSignup = async (req,res) => {

  const {valid,message,validatedData} = await validateUserInput(req.body);
  if(!valid){
    return res.status(400).json({message: message});
  }
  
  try{
    const newUser = await userService.createSignupService(validatedData);
    res.status(201).json({message:'User Created', data:newUser});
  }catch(error){
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Something went wrong'});
  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  if(isNaN(userId)){
    return res.status(400).json({ message: "Invalid user ID"});
  }
  try{
    if(!await userService.getUserByIdService(userId)) return res.status(400).json({ message: 'User Not Found' });
    const deletedUser = await userService.deleteUserService(userId);
    res.status(200).json({ message: 'User Deleted', data:delUser });
  } catch(error) {
    console.log(error);
    res.status(500).json({message:"Something went wrong"});
  }
};

export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  if(isNaN(userId)){
    return res.status(400).json({ message: "Invalid user ID"});
  }

  const {valid,message,validatedData} = await validateUserInput(req.body,userId,true);
  if(!valid){
    return res.status(400).json({message: message});
  }

  try{
    const updatedUserData = await userService.updateUserService(validatedData,userId);
    if(!updatedUserData) return res.status(404).json({ message: "User not found or no changes applied." });
    res.status(200).json({message:"User Updated", data:updatedUserData});
  }catch(error){
    console.log(error);
    res.status(500).json({message:"Something went wrong"});
  }
};

export default {
    getAllUser,
    getUserById,
    userLogin,
    userSignup,
    deleteUser,
    updateUser
};