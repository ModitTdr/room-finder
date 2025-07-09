import { getUserProfileService, getCreateUserProfileService } from "../services/userProfileService.js"
import { userProfileSchema } from "../utils/validateUserProfile.js"

export const getUserProfile = async (req, res) => {
  const user = await getUserProfileService(req.params.id);
  if (!user) return res.status(400).json({ message: 'Profile not found' });
  return res.status(200).json(user);
}

export const createUserProfile = async (req, res) => {
  if (!req.body || Object.keys(req.body).length == 0)
    return res.status(400).json("Response Body Missing");

  try {
    const userId = req.params.id;
    if (userId === null || userId === undefined || userId === '') {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const validatedData = userProfileSchema.safeParse(req.body);
    if (!validatedData.success) return res.status(400).json({ message: validatedData.error.errors[0].message });
    const response = await getCreateUserProfileService(userId, validatedData);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong." });
  }
}

export default {
  getUserProfile,
  createUserProfile,
}