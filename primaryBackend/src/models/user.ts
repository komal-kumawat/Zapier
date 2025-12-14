import { z } from "zod";
export const signupSchema = z.object({
    username: z.string().min(5),
    password: z.string().min(6),
    name: z.string().min(3)
})

export const signinSchema = z.object({
    username: z.string().min(5),
    password: z.string().min(6)
})

export const ZapCreateSchema = z.object({
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(),
    actions: z.array(z.object({
        availableTriggerId: z.string(),
        triggerMetadata: z.any().optional()
    }))
})