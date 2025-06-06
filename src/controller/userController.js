import userService from "../services/userService.js";
import validateUserInput  from "../utils/validateUserInput.js";
import { userLogout } from "./authController.js";

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
  if(!req.body || Object.keys(req.body).length === 0 )
      return res.status(404).json("Request Body Missing")
    
  const userId = parseInt(req.params.id);
  if(isNaN(userId)){
    return res.status(400).json({ message: "Invalid user ID"});
  }

  const {valid,message,validatedData} = await validateUserInput(req.body,userId,true);
  if(!valid){
    return res.status(400).json({message: message});
  }
  
  try{
    let updatedUserData;
    const isAdmin = req.user.role === "ADMIN";
    
    updatedUserData = await userService.updateUserService(validatedData,userId,isAdmin);
    if(!updatedUserData) return res.status(404).json({ message: "User not found or no changes applied." });

    if(updatedUserData.password || updatedUserData.email || updatedUserData.role){
       res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0), 
        sameSite: 'Strict'
      });
      return res.status(200).json({message:"User updated"});
    }

    res.status(200).json({message:"User Updated", data:updatedUserData});
  }catch(error){
    console.log(error);
    res.status(500).json({message:"Something went wrong"});
  }
};

export default {
    getAllUser,
    getUserById,
    deleteUser,
    updateUser
};