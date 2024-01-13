import { prisma } from "@/lib/db";
import { Bookmark, Like, Repost } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { tweetsType } from "../../tweet/route";
import { getToken } from "next-auth/jwt";

export type ProfileType = {
    name: string;
    username: string;
    image: string;
    createdAt: Date;
    Tweet?: tweetsType[] | null
}



export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
    const session = await getToken({ req })
    const username = params.username;
    const getUser = await prisma.user.findUnique({
        where: {
            username
        },
        include: {
            Tweet: {
                include: {
                    quote: {
                        include: {
                            User: true
                        }
                    },
                    Like: true,
                    Bookmark: true,
                    Reply: true,
                    Repost: true,
                    User: true
                }
            },
            Repost: {
                include: {
                    Tweet: true
                }
            }
        }
    })
    if (!getUser) {
        return NextResponse.json({
            success: false,
            message: "User not found"
        }, { status: 404 })
    }

    const data: ProfileType = {
        name: getUser.name as string,
        username: getUser.name as string,
        image: getUser.image as string,
        createdAt: getUser.createdAt as Date,
        Tweet: getUser.Tweet ? getUser.Tweet.map((tweet) => ({
            id: tweet.id,
            userId: tweet.userId,
            text: tweet.text,
            createdAt: tweet.createdAt,
            updatedAt: tweet.updatedAt,
            LikeAmount: tweet.Like.length,
            Liked: !!(tweet.Like.find((item: Like) => item.userId === session?.id)),
            Bookmarked: !!(tweet.Bookmark.find((item: Bookmark) => item.userId === session?.id)),
            RepostAmount: tweet.Repost.length,
            Reposted: !!(tweet.Repost.find((item: Repost) => item.userId === session?.id)),
            ReplyAmount: tweet.Reply.length,
            User: {
                id: tweet.User.id as string,
                name: tweet.User.name as string,
                image: tweet.User.image as string,
                username: tweet.User.username as string,
                email: tweet.User.email as string,
            },
            quote: tweet.quote ? {
                text: tweet.quote?.text,
                createdAt: tweet.quote?.createdAt,
                updatedAt: tweet.quote?.updatedAt,
                User: {
                    name: tweet.quote?.User.name as string,
                    image: tweet.quote?.User.image as string,
                    username: tweet.quote?.User.username as string,
                },
            } : null,
        })) : null,
    }

    return NextResponse.json({
        success: true,
        message: "User found!",
        data
    }, { status: 200 })
}