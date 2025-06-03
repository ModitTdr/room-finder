import db from "../prismaClient.js";
import bcrypt from "bcrypt";

export const getAllUserService = async () => {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true
      },
    })
    return users;
};

export const getUserByIdService = async (userId) => {
    const user = await db.user.findFirst({ 
      where:{id: userId} 
    });
    return user;
}

export const getUserByEmailService = async (userEmail) => {
    const user = await db.user.findFirst({ 
      where:{email: userEmail} 
    });
    return user;
}

export const getUserByPhoneService = async (userPhone) => {
    const user = await db.user.findFirst({ 
      where:{phone: userPhone} 
    });
    return user;
}

export const createSignupService = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password,10);
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
    where:{id:userId}
  });
  return deletedUser;
};

export const updateUserService = async (userData,userId) => {
    const updatedUser = await db.user.update({
        where: {id: userId},
        data: userData
    })
    return updatedUser;
};


export default {
    getAllUserService,
    getUserByIdService,
    getUserByEmailService,
    getUserByPhoneService,
    createSignupService,
    deleteUserService,
    updateUserService,
};