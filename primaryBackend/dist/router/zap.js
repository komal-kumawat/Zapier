import { Router } from "express";
import { authMiddleware } from "../middleware/Authmiddleware.js";
import { ZapCreateSchema } from "../models/user.js";
import prismaclient from "../db/index.js";
const router = Router();
// create a zap
router.post("/", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const id = req.id;
        const body = req.body;
        const parsedData = ZapCreateSchema.safeParse(body);
        if (!parsedData.success) {
            return res.status(409).json({
                message: "incorrect inputs"
            });
        }
        ;
        const zapId = await prismaclient.$transaction(async (tx) => {
            const zap = await prismaclient.zap.create({
                data: {
                    userId: parseInt(id),
                    triggerId: "",
                    actions: {
                        create: parsedData.data.actions.map((x, index) => ({
                            actionId: x.availableActionId,
                            sortingOrder: index,
                            metadata: x.actionMetadata,
                        }))
                    }
                }
            });
            const trigger = await tx.trigger.create({
                data: {
                    triggerId: parsedData.data.availableTriggerId,
                    zapId: zap.id
                }
            });
            await tx.zap.update({
                where: {
                    id: zap.id
                },
                data: {
                    triggerId: trigger.id
                }
            });
            return zap.id;
        });
        return res.status(201).json({ message: "zap created successfully", zapId });
    }
    catch (e) {
        return res.status(500).json({ msg: "Internal server error" });
    }
});
router.get("/", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const id = req.id;
        const zaps = await prismaclient.zap.findMany({
            where: {
                userId: id
            },
            include: {
                actions: {
                    include: {
                        type: true
                    }
                },
                trigger: {
                    include: {
                        type: true
                    }
                }
            }
        });
        return res.status(201).json({ zaps });
    }
    catch (e) {
        return res.status(500).json({ msg: "Internal server error", e });
    }
});
router.get("/:zapId", async (req, res) => {
    try {
        // @ts-ignore
        const id = req.id;
        const zapId = req.params.zapId;
        const zap = await prismaclient.zap.findFirst({
            where: {
                id: zapId,
                userId: id
            },
            include: {
                actions: {
                    include: {
                        type: true
                    }
                },
                trigger: {
                    include: {
                        type: true
                    }
                }
            }
        });
        if (!zap) {
            return res.json("no zap found");
        }
        return res.status(201).json({ zap });
    }
    catch (e) {
        return res.status(500).json({ msg: "Internal server error" });
    }
});
export const zapRouter = router;
