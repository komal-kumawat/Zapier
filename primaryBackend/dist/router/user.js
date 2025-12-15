import { Router } from "express";
import { authMiddleware } from "../middleware/Authmiddleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { signinSchema, signupSchema } from "../models/user.js";
import prismaclient from "../db/index.js";
dotenv.config();
const router = Router();
router.post("/signup", async (req, res) => {
    const body = req.body;
    const parsedData = signupSchema.safeParse(body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        return res.status(400).json({
            message: "Incorrect inputs"
        });
    }
    const userAlreadyExists = await prismaclient.user.findFirst({
        where: {
            email: parsedData.data.username
        }
    });
    if (userAlreadyExists) {
        return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    const user = await prismaclient.user.create({
        data: {
            email: parsedData.data.username,
            name: parsedData.data.name,
            password: hashedPassword
        }
    });
    return res.status(201).json({ message: "user created successfully", user });
});
router.post("/signin", async (req, res) => {
    const body = req.body;
    const parsedData = signinSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Incorrect input"
        });
    }
    try {
        const user = await prismaclient.user.findFirst({
            where: {
                email: parsedData.data.username
            }
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "komalsecret", { expiresIn: "1h" });
        return res.status(200).json({
            message: "User successfully signed in",
            token
        });
    }
    catch (e) {
        return res.status(500).json({ message: "Error while signing in", e });
    }
});
router.get("/me", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const id = req.id;
        const user = await prismaclient.user.findFirst({
            where: {
                id
            },
            select: {
                name: true,
                email: true
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    }
    catch {
        return res.status(500).json({ message: "Internal server error" });
    }
});
export const userRouter = router;
