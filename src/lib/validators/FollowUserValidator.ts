import { z } from "zod";

export const FollowUserValidator = z.object({
    username: z.string().min(2, {
        message: "Username cannot null"
    })
})

export type FollowUserPayload = z.infer<typeof FollowUserValidator>