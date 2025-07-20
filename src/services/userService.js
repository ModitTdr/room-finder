import db from "../prismaClient.js";
import bcrypt from "bcrypt";

export const getAllUserService = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    },
  })
  return users;
};

export const getUserByIdService = async (userId) => {
  try {
    const user = await db.user.findFirst({
      where: { id: userId },
      include: { profile: true }
    });
    return user;
  } catch (error) {
    console.error("Database query failed:", error);
    return null;
  }
}

export const getUserByEmailService = async (userEmail) => {
  const user = await db.user.findFirst({
    where: { email: userEmail }
  });
  return user;
}

export const getUserByPhoneService = async (userPhone) => {
  const user = await db.user.findFirst({
    where: { phone: userPhone }
  });
  return user;
}

export const userSignupService = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  delete userData.role;
  const newUser = await db.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });
  return newUser;
}

export const deleteUserService = async (userId) => {
  const deletedUser = await db.user.delete({
    where: { id: userId }
  });
  return deletedUser;
};

export const updateUserService = async (userData, userId, isAdmin = false) => {
  if (!isAdmin) delete userData.role;
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      ...userData,
      password: hashedPassword
    }
  })
  return updatedUser;
};


export default {
  getAllUserService,
  getUserByIdService,
  getUserByEmailService,
  getUserByPhoneService,
  userSignupService,
  deleteUserService,
  updateUserService,
};