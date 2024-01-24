import { z } from 'zod'

export const ActionButtonValidator = z.object({
    tweetId: z.string().min(3),
    userId: z.string().min(3),
})

export const QuoteButtonValidator = z.object({
    tweetId: z.string().min(3),
    userId: z.string().min(3),
    userTweetId: z.string().min(3),
    text: z.string().min(3).max(300),
})

export const ReplyButtonValidator = z.object({
    text: z.string().max(300),
    tweetId: z.string().min(3),
    userId: z.string().min(3),
})

export type ActionButtonPayload = z.infer<typeof ActionButtonValidator>
export type QuoteButtonPayload = z.infer<typeof QuoteButtonValidator>
export type ReplyButtonPayload = z.infer<typeof ReplyButtonValidator>