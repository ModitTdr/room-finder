import db from "../prismaClient.js";

export const getAllUserProfileService = async () => {
  const profile = await db.profile.findMany();
  return 'profile';
}

export const getCreateUserProfileService = async (id) => {
  const profile = await db.profile.findFirst(id);
  return profile;
} 
