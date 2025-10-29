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
      throw new Error("Phone number already exists");
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
  let profile;
  if (!profileExists) {
    profile = await db.profile.create({
      data: {
        userId: id,
        ...validatedData.data,
        amenityPreferences: validatedData.data.amenityPreferences || [],
      }
    });
  } else {
    profile = await db.profile.update({
      where: { userId: id },
      data: {
        ...validatedData.data
      }
    });
  }
  if (profile.phone && profile.address) {
    await db.user.update({
      where: { id },
      data: { isVerified: true }
    });
  }

  return profileExists
    ? { message: "Profile updated", update: profile }
    : { message: "Profile created", create: profile };
} 
