import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { tweetsType } from "../route"
import { Bookmark, Like, Prisma, Repost } from "@prisma/client"
import { getToken } from "next-auth/jwt"
import { getAuthSession } from "@/lib/auth"

export type ReplyType = {
    Reposting?: boolean;
    id?: string;
    userId: string;
    text: string;
    repliedId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    LikeAmount: number;
    Liked: boolean;
    Bookmarked: boolean;
    RepostAmount: number;
    Reposted: boolean;
    ReplyAmount: number;
    User: {
        id: string;
        name: string;
        image: string;
        username: string;
        email: string;
        followers: number;
        following: number;
        followed: boolean;
    },
    quote?: {
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        User: {
            name: string;
            image: string;
            username: string;
        }
    } | null,
    replies?: ReplyType[];
}

export type TweetDetailType = {
    tweet: tweetsType,
    replies: ReplyType[]
}

type Tweet = Prisma.TweetGetPayload<{
    include: {
        User: {
            include: {
                followers: true,
                following: true
            }
        },
        Like: true,
        Bookmark: true,
        Repost: true,
        replies: true,
        quote: {
            include: {
                User: true
            }
        }
    }
}>

export async function DELETE(request: Request, { params }: { params: { tweetId: string } }) {
    try {
        const tweetId = params.tweetId
        const tweet = await prisma.tweet.findFirst({
            where: {
                id: tweetId,
            }
        })
        await prisma.tweet.deleteMany({
            where: {
                quotedId: tweetId
            }
        })

        await prisma.tweet.delete({
            where: {
                id: tweetId
            }
        })

        return NextResponse.json({
            success: true,
            message: "Tweet Deleted"
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 403 })
    }
}

export async function GET(request: Request, { params }: { params: { tweetId: string } }) {
    try {
        const session = await getAuthSession()
        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }
        const tweetId = params.tweetId
        const Tweet = await prisma.tweet.findFirst({
            where: {
                id: tweetId
            },
            include: {
                User: {
                    include: {
                        followers: true,
                        following: true,
                    }
                },
                Like: true,
                Bookmark: true,
                Repost: true,
                replies: {
                    include: {
                        replies: true,
                        User: {
                            include: {
                                followers: true,
                                following: true,
                            }
                        },
                        Like: true,
                        Bookmark: true,
                        Repost: true,
                        quote: {
                            include: {
                                User: true
                            }
                        }
                    },
                },
                quote: {
                    include: {
                        User: true
                    }
                }
            }
        })

        const tweet: tweetsType = {
            id: Tweet?.id,
            text: Tweet?.text!,
            userId: Tweet?.userId!,
            createdAt: Tweet?.createdAt,
            updatedAt: Tweet?.updatedAt,
            LikeAmount: Tweet?.Like.length ?? 0,
            Liked: !!(Tweet?.Like.find((item?: Like) => item?.userId === session?.user.id)),
            Bookmarked: !!(Tweet?.Bookmark.find((item?: Bookmark) => item?.userId === session?.user.id)),
            RepostAmount: Tweet?.Repost.length ?? 0,
            Reposted: !!(Tweet?.Repost.find((item?: Repost) => item?.userId === session?.user.id)),
            ReplyAmount: Tweet?.replies.length ?? 0,
            User: {
                id: Tweet?.User.id!,
                image: Tweet?.User.image as string,
                name: Tweet?.User.name as string,
                username: Tweet?.User.username as string,
                email: Tweet?.User.email as string,
                followers: Tweet?.User.followers.length ?? 0,
                following: Tweet?.User.following.length ?? 0,
                followed: session?.user.id === Tweet?.User.id ? false : !!((Tweet?.User.followers.find((item) => item.followerId === session?.user.id!))),
            },
            quote: Tweet?.quote ? {
                id: Tweet?.quote.id as string,
                text: Tweet?.quote?.text as string,
                createdAt: Tweet?.quote?.createdAt as Date,
                updatedAt: Tweet?.quote?.updatedAt as Date,
                User: {
                    name: Tweet?.quote?.User.name as string,
                    username: Tweet?.quote?.User.username as string,
                    image: Tweet?.quote?.User.image as string
                }
            } : null,
        }

        const repliesData = (data: any) => {
            const temp: ReplyType[] = data.map((item: Tweet) => ({
                id: item?.id,
                text: item?.text!,
                userId: item?.userId!,
                createdAt: item?.createdAt,
                updatedAt: item?.updatedAt,
                repliedId: item?.repliedId as string,
                LikeAmount: item?.Like.length ?? 0,
                Liked: !!(item?.Like.find((item?: Like) => item?.userId === session?.user.id)),
                Bookmarked: !!(item?.Bookmark.find((item?: Bookmark) => item?.userId === session?.user.id)),
                RepostAmount: item?.Repost.length ?? 0,
                Reposted: !!(item?.Repost.find((item?: Repost) => item?.userId === session?.user.id)),
                ReplyAmount: item?.replies.length ?? 0,
                User: {
                    id: item?.User.id!,
                    image: item?.User.image as string,
                    name: item?.User.name as string,
                    username: item?.User.username as string,
                    email: item?.User.email as string,
                    followers: item?.User.followers.length ?? 0,
                    following: item?.User.following.length ?? 0,
                    followed: session?.user.id === item?.User.id ? false : !!((item?.User.followers.find((item) => item.followerId === session?.user.id!))),
                },
                quote: item?.quote ? {
                    id: item?.quote.id as string,
                    text: item?.quote?.text as string,
                    createdAt: item?.quote?.createdAt as Date,
                    updatedAt: item?.quote?.updatedAt as Date,
                    User: {
                        name: item?.quote?.User.name as string,
                        username: item?.quote?.User.username as string,
                        image: item?.quote?.User.image as string
                    }
                } : null,
                replies: repliesData(item.replies) as ReplyType[]
            }))

            return temp
        }

        const replies: ReplyType[] = repliesData(Tweet?.replies as Tweet[])

        return NextResponse.json({
            success: true,
            message: "Tweet details",
            data: {
                tweet,
                replies
            } as TweetDetailType
        }, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 403 })
    }
}