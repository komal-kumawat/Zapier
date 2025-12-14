import { Router, type Request, type Response } from "express";
import { authMiddleware } from "../middleware/Authmiddleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { signupSchema } from "../models/user.js";
import { prismaclient } from "../db/index.js";
dotenv.config();

const router = Router();

router.post("/signup" , async(req:Request,res:Response)=>{
   const body = req.body;
   const parsedData = signupSchema.safeParse(body);
   if(!parsedData.success){
    console.log(parsedData.error);
    return res.status(400).json({
        message:"Incorrect inputs"
    })
   }

   const userAlreadyExists = await prismaclient.user.findFirst({
    where:{
        email:parsedData.data.username
    }
   });

   if(userAlreadyExists){
    return res.status(409).json({message:"User already exists"});
   }

   const hashedPassword = await bcrypt.hash(parsedData.data.password , 10);

   const user = await prismaclient.user.create({
    data:{
        email:parsedData.data.username,
        name:parsedData.data.name,
        password:hashedPassword
    }
   });

   return res.status(201).json({message:"user created successfully" , user})
})

router.post("/signin" , (req:Request,res:Response)=>{
    console.log("signin handler")
})

router.get("/user" ,authMiddleware, (req:Request,res:Response)=>{
    console.log("user");
    res.send("User route accessed");

})

export const userRouter = router;