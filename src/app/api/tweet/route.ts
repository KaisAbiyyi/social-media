import { prisma } from "@/lib/db";
import { Bookmark, Like, Prisma, Repost } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export type tweetsType = {
    id: string;
    userId: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    User: {
        id: string;
        name: string;
        image: string;
        username: string;
        email: string;
    },
    LikeAmount: number;
    Liked: boolean;
    Bookmarked: boolean;
    RepostAmount: number;
    Reposted: boolean;
}

type Tweet = Prisma.TweetGetPayload<{
    include: {
        User: true,
        Like: true,
        Bookmark: true,
        Repost: true
    }
}>


export async function GET(req: NextRequest) {
    const session = await getToken({ req })

    const tweets = await prisma.tweet.findMany({
        include: {
            User: true,
            Like: true,
            Bookmark: true,
            Repost: true,
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
            User: {
                id: item.User.id,
                image: item.User.image || '',
                name: item.User.name || '',
                username: item.User.username || '',
                email: item.User.email || ''
            },
            LikeAmount: item.Like.length,
            Liked: !!(item.Like.find((item: Like) => item.userId === session?.id)),
            Bookmarked: !!(item.Bookmark.find((item: Bookmark) => item.userId === session?.id)),
            RepostAmount: item.Repost.length,
            Reposted: !!(item.Repost.find((item: Repost) => item.userId === session?.id)),
        }
    ))

    return NextResponse.json({
        success: true,
        data
    }, { status: 200 })
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { text, userId } = body
        const requiredFields = ["text", "userId"];

        const errResponse = requiredFields
            .filter(field => !body[field])
            .map(field => ({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be null` }));

        if (errResponse.length > 0) {
            return NextResponse.json({ success: false, message: errResponse }, { status: 403 });
        }

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

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Invalid JSON"
        })
    }
}