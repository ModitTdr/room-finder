import express from "express";
import bcrypt from "bcrypt";
import db from "../prismaClient.js";

const router = express.Router();

router.get('/',async (req,res) => {
  const result = await db.user.findMany()
  res.status(200).json({success:true,data: result})
});

router.post('/',async (req,res) => {
  const user = req.body
  const hashedPassword = await bcrypt.hash(req.body.password,10);
  
  try{
    const result = await db.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
    res.status(201).json({message:'User Created', data:result});
  }catch(error){
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/:id',async (req,res) => {
  const userId = parseInt(req.params.id);
  try{
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const result = await db.user.findFirst({ 
      where:{id: userId} 
    });
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(201).json({result});
  }catch(error){
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
});

router.delete('/:id',async (req,res) => {
  const userId = parseInt(req.params.id);
  const result = await db.user.delete({
    where:{id:userId}
  });

});

router.put('/:id',async (req,res) => {
  const userData = req.body;
  const userId = parseInt(req.params.id);

  try{
    const result = await db.user.update({
    where:{
      id: userId,
    },
    data:userData
  })  
  res.status(200).json({message:"User Updated", data:result});
  }catch(error){
    console.log(error);
    res.status(500).json({message:"Something went wrong"});
  }
});

export default router;