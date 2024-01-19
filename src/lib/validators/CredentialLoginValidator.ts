import { z } from "zod";

export const CredentialLoginValidator = z.object({
    email: z.string().min(1, {
        message: "Email cannot null.",
    }).email(),
    password: z.string().min(1, {
        message: "Password cannot null.",
    }),
})

export type CredentialPayload = z.infer<typeof CredentialLoginValidator>