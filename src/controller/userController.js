import userService from "../services/userService.js";

export const getAllUser = async (req, res) => {
  try{
    const users = await userService.getAllUserService();
    if(!users) return res.status(404).json({message:"No Users Available ", success:false});
    res.status(200).json({data: users, success:true});
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
    if (!user) return res.status(404).json({message:"User Not Found", success:false});
    res.status(200).json({data: user, success:true});
  }catch(error){
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
};

export const createUser = async (req,res) => {
  const newUserData = req.body;
  try{
    const newUser = await userService.createUserService(newUserData);
    res.status(201).json({message:'User Created', data:newUser});
  }catch(error){
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const deletedUser = await userService.deleteUserService(userId);
  res.status(200).json({ error: 'User Deleted', data:delUser });
};

export const updateUser = async (req, res) => {
  const userData = req.body;
  const userId = parseInt(req.params.id);

  try{
    const updatedUserData = await userService.updateUserService(userData,userId);
    res.status(200).json({message:"User Updated", data:updatedUserData});
  }catch(error){
    console.log(error);
    res.status(500).json({message:"Something went wrong"});
  }
};

export default {
    getAllUser,
    getUserById,
    createUser,
    deleteUser,
    updateUser
};