import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "komalsecret");
        // @ts-ignore
        req.id = payload.id;
        next();
    }
    catch (err) {
        return res.status(403).json({
            message: "You are not logged in. "
        });
    }
};
