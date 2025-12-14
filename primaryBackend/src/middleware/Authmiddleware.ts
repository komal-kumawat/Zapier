import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authMiddleware = async(req:Request , res:Response, next:NextFunction)=>{
    const token = req.headers.authorization as string;
    try{
        const payload = jwt.verify(token , (process.env.JWT_SECRET as string)||"komalsecret" );
        // @ts-ignore
        req.id = payload.id;
        next();
    }catch(err){
        return res.status(403).json({
            message:"You are not logged in. "
        })
    }

}