import { getAllUserProfileService, getCreateUserProfileService } from "../services/userProfileService.js"
import { userProfileSchema } from "../utils/validateUserProfile.js"

export const getUserProfile = async (req, res) => {
  const user = await getAllUserProfileService();
  return res.send(user);
}

export const createUserProfile = async (req, res) => {
  if (!req.body || Object.keys(req.body).length == 0)
    return res.status(400).json("Response Body Missing");

  try {
    const validatedData = userProfileSchema.safeParse(req.body);
    if (!validatedData.success) return res.status(400).json({ message: validatedData.error.errors[0].message });
    return res.status(200).json({ message: "Profile Created" });
  } catch (err) {
    console.log(err)
  }
}

export default {
  getUserProfile,
  createUserProfile,
}