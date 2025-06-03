import userService from "../services/userService.js";
import validateUserInput  from "../utils/validateUserInput.js";

export const getAllUser = async (req, res) => {
  try{
    const users = await userService.getAllUserService();
    if(!users) return res.status(404).json({message:"No Users Available "});
    res.status(200).json({data: users});
  }catch(error){
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  try{
    const user = await userService.getUserByIdService(userId);
    if (!user) return res.status(404).json({message:"User Not Found"});
    res.status(200).json({data: user});
  }catch(error){
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
};

export const signup = async (req,res) => {

  const {valid,message,sanitizedData} = await validateUserInput(req.body);
  if(!valid){
    return res.status(400).json({error: message});
  }

  try{
    const newUser = await userService.createUserService(sanitizedData);
    res.status(201).json({message:'User Created', data:newUser});
  }catch(error){
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Something went wrong'});
  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  if(isNaN(userId)){
    return res.status(400).json({ message: "Invalid user ID"});
  }
  const deletedUser = await userService.deleteUserService(userId);
  res.status(200).json({ error: 'User Deleted', data:delUser });
};

export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  if(isNaN(userId)){
    return res.status(400).json({ message: "Invalid user ID"});
  }

  const {valid,message,validatedData} = await validateUserInput(req.body,userId);
  if(!valid){
    return res.status(400).json({error: message});
  }
  try{
    const updatedUserData = await userService.updateUserService(validatedData,userId);
    res.status(200).json({message:"User Updated", data:updatedUserData});
  }catch(error){
    console.log(error);
    res.status(500).json({message:"Something went wrong"});
  }
};

export default {
    getAllUser,
    getUserById,
    signup,
    deleteUser,
    updateUser
};