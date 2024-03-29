import { prisma } from "@/lib/db";
import { Bookmark, Like, Repost } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { tweetsType } from "../../tweet/route";

export type ProfileType = {
    name: string;
    username: string;
    image: string;
    createdAt: Date;
    bio: string;
    followers: number;
    following: number;
    followed: boolean;
    tweet: tweetsType[] | null
}



export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
    const session = await getToken({ req })
    const username = params.username;
    const getUser = await prisma.user.findUnique({
        where: {
            username
        },
        include: {
            followers: true,
            following: true,
            Tweet: {
                where: {
                    repliedId: null
                },
                include: {
                    quote: {
                        include: {
                            User: true
                        }
                    },
                    Like: true,
                    Bookmark: true,
                    replies: true,
                    Repost: true,
                    User: {
                        include: {
                            followers: true,
                            following: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            },
            Repost: {
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
                            replies: true,
                            Repost: true,
                            User: {
                                include: {
                                    followers: true,
                                    following: true
                                }
                            }
                        },
                    }
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

    const GeneralTweets: tweetsType[] = getUser?.Tweet.map((tweet) => ({
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
        ReplyAmount: tweet.replies.length,
        User: {
            id: tweet.User.id as string,
            name: tweet.User.name as string,
            image: tweet.User.image as string,
            username: tweet.User.username as string,
            email: tweet.User.email as string,
            followers: tweet.User.followers.length,
            following: tweet.User.following.length,
            followed: session?.id === tweet.User.id ? false : !!((tweet.User.followers.find((item) => item.followerId === session?.id!))),
        },
        quote: tweet.quote ? {
            id: tweet.quote.User.id,
            text: tweet.quote?.text,
            createdAt: tweet.quote?.createdAt,
            updatedAt: tweet.quote?.updatedAt,
            User: {
                name: tweet.quote?.User.name as string,
                image: tweet.quote?.User.image as string,
                username: tweet.quote?.User.username as string,
            },
        } : null,
    })) ?? []

    const RepostedTweets: tweetsType[] = getUser?.Repost.map((tweet) => ({
        Reposting: true,
        id: tweet.id,
        userId: tweet.Tweet.userId,
        text: tweet.Tweet.text,
        createdAt: tweet.createdAt,
        updatedAt: tweet.Tweet.updatedAt,
        LikeAmount: tweet.Tweet.Like.length,
        Liked: !!(tweet.Tweet.Like.find((item: Like) => item.userId === session?.id)),
        Bookmarked: !!(tweet.Tweet.Bookmark.find((item: Bookmark) => item.userId === session?.id)),
        RepostAmount: tweet.Tweet.Repost.length,
        Reposted: !!(tweet.Tweet.Repost.find((item: Repost) => item.userId === session?.id)),
        ReplyAmount: tweet.Tweet.replies.length,
        User: {
            id: tweet.Tweet.User.id as string,
            name: tweet.Tweet.User.name as string,
            image: tweet.Tweet.User.image as string,
            username: tweet.Tweet.User.username as string,
            email: tweet.Tweet.User.email as string,
            followers: tweet.Tweet.User.followers.length,
            following: tweet.Tweet.User.following.length,
            followed: session?.id === tweet.Tweet.User.id ? false : !!((tweet.Tweet.User.followers.find((item) => item.followerId === session?.id!))),
        },
    })) ?? []

    const tweet: tweetsType[] = [...GeneralTweets, ...RepostedTweets].sort((a, b) => (new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()))


    const data: ProfileType = {
        name: getUser.name as string,
        username: getUser.username as string,
        image: getUser.image as string,
        createdAt: getUser.createdAt as Date,
        bio: getUser.bio as string,
        followers: getUser.followers.length,
        following: getUser.following.length,
        followed: session?.id === getUser.id ? false : !!((getUser.followers.find((item) => item.followerId === session?.id!))),
        tweet
    }

    return NextResponse.json({
        success: true,
        message: "User found!",
        data
    }, { status: 200 })
}


export async function POST(request: Request, { params }: { params: { username: string } }) {
    try {
        const { newName, newBio, newImg } = await request.json()
        const username = params.username
        const findUser = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if (!findUser) {
            return NextResponse.json({
                success: false
            }, { status: 404 })
        }

        const data = await prisma.user.update({
            where: {
                id: findUser.id
            },
            data: {
                name: newName,
                bio: newBio,
                image: newImg
            }
        })

        return NextResponse.json({
            success: true,
            message: "Profile Updated!",
            data
        }, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false
        }, { status: 403 })
    }
}