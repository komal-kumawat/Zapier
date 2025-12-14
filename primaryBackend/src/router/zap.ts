import { Router } from "express";
import { authMiddleware } from "../middleware/Authmiddleware.js";

const router = Router();

router.post("/" , authMiddleware,(req , res)=>{
    console.log("create a zap");
})
router.get("/" ,authMiddleware ,  (req , res)=>{
    console.log("zap");
})
router.get("/:zapId" , (req , res)=>{
    const zapId = req.params;
    console.log(`zap ${zapId}`);
})

export const zapRouter = router;