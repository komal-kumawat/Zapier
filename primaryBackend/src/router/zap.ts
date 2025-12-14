import { Router } from "express";
import { authMiddleware } from "../middleware/Authmiddleware.js";
import { ZapCreateSchema } from "../models/user.js";
import { prismaclient } from "../db/index.js";

const router = Router();

// create a zap
router.post("/" , authMiddleware, async(req , res)=>{
    // @ts-ignore
    const id:string = req.id;
    const body = req.body;
    const parsedData = ZapCreateSchema.safeParse(body);

    if(!parsedData.success){
        return res.status(409).json({
            message:"incorrect inputs"
        })
    };

    const zapId = await prismaclient.$transaction()

})
router.get("/" ,authMiddleware ,  (req , res)=>{
    console.log("zap");
})
router.get("/:zapId" , (req , res)=>{
    const zapId = req.params;
    console.log(`zap ${zapId}`);
})

export const zapRouter = router;