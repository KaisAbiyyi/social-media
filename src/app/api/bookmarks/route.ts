import { prisma } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { tweetsType } from "../tweet/route";
import { Like, Prisma, Repost } from "@prisma/client";

type Bookmark = Prisma.BookmarkGetPayload<{
    include: {
        Tweet: {
            include: {
                User: true,
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
        }
    }
}>

export async function GET(req: NextRequest) {
    const token = await getToken({ req })
    const bookmarks = await prisma.bookmark.findMany({
        where: {
            userId: token?.id as string
        },
        include: {
            Tweet: {
                include: {
                    User: true,
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
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const data: tweetsType[] = bookmarks.map((item: Bookmark) => ({
        id: item.Tweet.id,
        text: item.Tweet.text,
        userId: item.Tweet.userId,
        createdAt: item.Tweet.createdAt,
        updatedAt: item.Tweet.updatedAt,
        LikeAmount: item.Tweet.Like.length,
        Liked: !!(item.Tweet.Like.find((item: Like) => item.userId === token?.id)),
        Bookmarked: !!(item.Tweet.Bookmark.find((item) => item.userId === token?.id)),
        RepostAmount: item.Tweet.Repost.length,
        Reposted: !!(item.Tweet.Repost.find((item: Repost) => item.userId === token?.id)),
        ReplyAmount: item.Tweet.replies.length,
        User: {
            id: item.Tweet.User.id,
            image: item.Tweet.User.image as string,
            name: item.Tweet.User.name as string,
            username: item.Tweet.User.username as string,
            email: item.Tweet.User.email as string
        },
        quote: item.Tweet.quote ? {
            id: item.Tweet.quote.id as string,
            text: item.Tweet.quote?.text as string,
            createdAt: item.Tweet.quote?.createdAt as Date,
            updatedAt: item.Tweet.quote?.updatedAt as Date,
            User: {
                name: item.Tweet.quote?.User.name as string,
                username: item.Tweet.quote?.User.username as string,
                image: item.Tweet.quote?.User.image as string
            }
        } : null,
    }))

    return NextResponse.json({
        success: true,
        data
    })
}