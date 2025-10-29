import userService from "../services/userService.js";
import validateUserInput from "../utils/validateUserInput.js";

export const getAllUser = async (req, res) => {
  try {
    const users = await userService.getAllUserService();
    if (!users || users.length === 0) return res.status(404).json({ message: "No Users Available " });
    res.status(200).json({ message: "All User's Data", data: users });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getUserById = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await userService.getUserByIdService(userId);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    const { password, created_at, updated_at, ...withoutPassword } = user;
    const safeUser = JSON.parse(
      JSON.stringify(withoutPassword, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    res.status(200).json(safeUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

};

export const deleteUser = async (req, res) => {
  const userId = req.user.id;
  try {
    if (!await userService.getUserByIdService(userId)) return res.status(400).json({ message: 'User Not Found' });
    const deletedUser = await userService.deleteUserService(userId);
    res.status(200).json({ message: 'User Deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUser = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0)
    return res.status(404).json("Request Body Missing")

  const userId = req.user.id;

  const restrictedFields = ['isVerified', 'role'];
  for (const field of restrictedFields) {
    if (req.body[field] !== undefined) {
      return res.status(403).json({ message: 'Not authorized to modify restricted fields.' });
    }
  }
  if (req.body.requestedOwnerRole && req.body.requestedOwnerRole !== "PENDING") {
    return res.status(403).json({ message: 'Not authorized to set this value.' });
  }

  const { valid, message, validatedData } = await validateUserInput(req.body, userId, true);
  if (!valid) {
    return res.status(400).json({ message: message });
  }

  try {
    let updatedUserData;
    const isAdmin = req.user.role === "ADMIN";

    updatedUserData = await userService.updateUserService(validatedData, userId, isAdmin);
    if (!updatedUserData) return res.status(404).json({ message: "User not found or no changes applied." });

    if (updatedUserData.password || updatedUserData.email || updatedUserData.role) {
      res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0),
        sameSite: 'Strict'
      });
      return res.status(200).json({ message: "User updated" });
    }

    res.status(200).json({ message: "User Updated", data: updatedUserData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUserByAdmin = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  const isAdmin = req.user.role === 'ADMIN';
  if (!isAdmin) {
    res.status(404).json({ message: 'Not Authorized' });
  }
  try {
    const updatedUser = await userService.updateUserByAdminService(userData, id);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export default {
  getAllUser,
  getUserById,
  deleteUser,
  updateUser,
  updateUserByAdmin,
};
