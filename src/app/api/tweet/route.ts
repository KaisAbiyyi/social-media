import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Bookmark, Like, Prisma, Repost } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export type tweetsType = {
    Reposting?: boolean;
    id?: string;
    userId: string;
    text: string;
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


export async function GET(req: NextRequest) {
    const session = await getToken({ req })

    const tweets = await prisma.tweet.findMany({
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
        },
        where: {
            repliedId: null,
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const data: tweetsType[] = tweets.map((item: Tweet) => (
        {
            id: item.id,
            text: item.text,
            userId: item.userId,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            LikeAmount: item.Like.length,
            Liked: !!(item.Like.find((item: Like) => item.userId === session?.id)),
            Bookmarked: !!(item.Bookmark.find((item: Bookmark) => item.userId === session?.id)),
            RepostAmount: item.Repost.length,
            Reposted: !!(item.Repost.find((item: Repost) => item.userId === session?.id)),
            ReplyAmount: item.replies.length,
            User: {
                id: item.User.id,
                image: item.User.image as string,
                name: item.User.name as string,
                username: item.User.username as string,
                email: item.User.email as string,
                followers: item.User.followers.length,
                following: item.User.following.length,
                followed: session?.id === item.User.id ? false : !!((item.User.followers.find((item) => item.followerId === session?.id!))),
            },
            quote: item.quote ? {
                id: item.quote.id as string,
                text: item.quote?.text as string,
                createdAt: item.quote?.createdAt as Date,
                updatedAt: item.quote?.updatedAt as Date,
                User: {
                    name: item.quote?.User.name as string,
                    username: item.quote?.User.username as string,
                    image: item.quote?.User.image as string
                }
            } : null,
        }
    ))

    return NextResponse.json({
        success: true,
        data
    }, { status: 200 })
}

export async function POST(request: Request) {
    try {
        const session = await getAuthSession()
        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }

        const body = await request.json()
        const { text, userId, userTweetId, tweetId } = body
        const requiredFields = ["text", "userId"];
        const errResponse = requiredFields
            .filter(field => !body[field])
            .map(field => ({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be null` }));

        if (errResponse.length > 0) {
            return NextResponse.json({ success: false, message: errResponse }, { status: 403 });
        }


        if (userTweetId && tweetId) {
            const tweet = await prisma.tweet.findFirst({
                where: {
                    userId: userTweetId,
                    id: tweetId
                }
            })
            if (!tweet) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid Tweet ID",
                }, { status: 404 })
            }

            const quote = await prisma.tweet.create({
                data: {
                    quotedId: tweetId,
                    text,
                    userId,
                }
            })

            return NextResponse.json({
                success: true,
                message: "Quote created",
            }, { status: 201 })
        } else {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                }
            })
            if (!user) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid user id"
                }, { status: 403 });
            }

            const tweet = await prisma.tweet.create({
                data: {
                    text,
                    userId
                }
            })

            return NextResponse.json({
                success: true,
                message: "Tweet posted"
            }, { status: 201 })
        }


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Invalid JSON"
        })
    }
}