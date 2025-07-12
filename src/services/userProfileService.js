import db from "../prismaClient.js";

export const getUserProfileService = async (id) => {
  const profile = await db.profile.findFirst({
    where: { userId: id }
  });
  return profile;
}

export const getCreateUserProfileService = async (id, validatedData) => {
  if (validatedData.data.phone) {
    const phoneExists = await db.profile.findFirst({
      where: {
        phone: validatedData.data.phone,
        NOT: { userId: id },
      }
    });
    if (phoneExists) {
      return { message: "Phone number already exists" };
    }
  }
  if (validatedData.data.citizenshipID) {
    const citizenshipExists = await db.profile.findFirst({
      where: {
        citizenshipID: validatedData.data.citizenshipID,
        NOT: { userId: id },
      }
    });
    if (citizenshipExists) {
      return { message: "Citizenship ID already exists" };
    }
  }

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
