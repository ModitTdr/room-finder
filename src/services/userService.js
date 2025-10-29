import { PrismaClient } from "@prisma/client";
import db from "../prismaClient.js";
import bcrypt from "bcrypt";

export const getAllUserService = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      profile: {
        select: {
          citizenshipID: true,
          phone: true,
        }
      }
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
  if (userData.password) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
  }
  const updatedUser = await db.user.update({
    where: { id: userId },
    data: userData
  })
  return updatedUser;
};

export const updateUserByAdminService = async (userData, userId) => {
  const validRoles = ['ADMIN', 'SEEKER', 'OWNER'];
  const validStatus = ['PENDING', 'REJECTED', 'ACCEPTED'];
  const updateData = {};
  if (userData.role) {
    if (!validRoles.includes(userData.role)) {
      throw new Error('Invalid role');
    }
    updateData.role = userData.role;
  }
  if (userData.isVerified !== undefined) {
    if (typeof userData.isVerified === 'boolean') {
      updateData.isVerified = userData.isVerified;
    } else {
      throw new Error('isVerified must be a boolean value');
    }
  }
  if (userData.requestedOwnerRole && isVerified) {
    if (!validStatus.includes(userData.requestedOwnerRole)) {
      throw new Error('Invalid Status');
    }
    updateData.requestedOwnerRole = userData.requestedOwnerRole;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error('No valid fields (role or isVerified) to update');
  }

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: updateData
  });

  return updatedUser;
};

const prisma = new PrismaClient();
const savePasswordResetToken = async (userId, token, expiry) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { resetToken: token, resetTokenExpiry: BigInt(expiry) }
  });
};

const getUserByResetToken = async (id, token) => {
  return await prisma.user.findFirst({
    where: {
      id,
      resetToken: token,
    }
  });
};

const updatePassword = async (id, newHashedPassword) => {
  return await prisma.user.update({
    where: { id },
    data: { password: newHashedPassword }
  });
};

const clearResetToken = async (id) => {
  return await prisma.user.update({
    where: { id },
    data: { resetToken: null, resetTokenExpiry: null }
  });
};



export default {
  getAllUserService,
  getUserByIdService,
  getUserByEmailService,
  getUserByPhoneService,
  userSignupService,
  deleteUserService,
  updateUserService,
  updateUserByAdminService,
  savePasswordResetToken,
  getUserByResetToken,
  updatePassword,
  clearResetToken,
};
