import db from "../prismaClient.js";

export const getUserProfileService = async (id) => {
  const profile = await db.profile.findFirst({
    where: { userId: id }
  });
  return profile;
}

export const getCreateUserProfileService = async (id, validatedData) => {
  const profileExists = await db.profile.findUnique({
    where: { userId: id },
  });
  if (!profileExists) {
    const create = await db.profile.create({
      data: {
        userId: id,
        ...validatedData.data
      }
    })
    return { message: "Profile created", create };
  }
  if (profileExists) {
    const update = await db.profile.update({
      where: { userId: id },
      data: {
        userId: id,
        ...validatedData.data
      }
    })
    return { message: "Profile updated", update };
  }
} 
