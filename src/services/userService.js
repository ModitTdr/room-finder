import db from "../prismaClient.js";
import bcrypt from "bcrypt";

export const getAllUserService = async () => {
    const result = await db.user.findMany()
    return result;
};

export const getUserByIdService = async (userId) => {
    const result = await db.user.findFirst({ 
      where:{id: userId} 
    });
    return result;
}

export const createUserService = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password,10);
    const result = await db.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    return result;
}

export const deleteUserService = async (userId) => {
  const result = await db.user.delete({
    where:{id:userId}
  });
  return result;
};

export const updateUserService = async (userData,userId) => {
    const result = await db.user.update({
        where: {id: userId},
        data: userData
    })
    return result;
};


export default {
    getAllUserService,
    getUserByIdService,
    createUserService,
    deleteUserService,
    updateUserService,
};