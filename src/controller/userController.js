import userService from "../services/userService.js";

export const getAllUser = async (req, res) => {
  const users = await userService.getAllUserService();
  res.status(200).json({success:true,data: users})
}

export const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  try{
    const user = await userService.getUserByIdService(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(201).json({user});
  }catch(error){
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
};

export const createUser = async (req,res) => {
  const userData = req.body;
  try{
    const newUser = await userService.createUserService(userData);
    res.status(201).json({message:'User Created', data:newUser});
  }catch(error){
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const delUser = await userService.deleteUserService(userId);
  res.status(500).json({ error: 'User Deleted', data:delUser });
};

export const updateUser = async (req, res) => {
  const userData = req.body;
  const userId = parseInt(req.params.id);

  try{
    const updateUser = await userService.updateUserService(userData,userId);
    res.status(200).json({message:"User Updated", data:updateUser});
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