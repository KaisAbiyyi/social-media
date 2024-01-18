import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { tweetsType } from "../route"
import { Bookmark, Like, Repost } from "@prisma/client"
import { getToken } from "next-auth/jwt"

export type ReplyType = {
    id: string;
    tweetId: string;
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
    }
    replies?: ReplyType[];
}

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

// export async function GET(req: NextRequest, { params }: { params: { tweetId: string } }) {
//     try {
//         const session = await getToken({ req })
//         const tweetId = params.tweetId
//         const Tweet = await prisma.tweet.findFirst({
//             where: {
//                 id: tweetId
//             },
//             include: {
//                 User: true,
//                 Like: true,
//                 Bookmark: true,
//                 Repost: true,
//                 Reply: {
//                     include: {
//                         replies: true,
//                         replied: true,
//                         User: true
//                     },
//                 },
//                 quote: {
//                     include: {
//                         User: true
//                     }
//                 }
//             }
//         })

//         const tweet: tweetsType = {
//             id: Tweet?.id,
//             text: Tweet?.text!,
//             userId: Tweet?.userId!,
//             createdAt: Tweet?.createdAt,
//             updatedAt: Tweet?.updatedAt,
//             LikeAmount: Tweet?.Like.length ?? 0,
//             Liked: !!(Tweet?.Like.find((item?: Like) => item?.userId === session?.id)),
//             Bookmarked: !!(Tweet?.Bookmark.find((item?: Bookmark) => item?.userId === session?.id)),
//             RepostAmount: Tweet?.Repost.length ?? 0,
//             Reposted: !!(Tweet?.Repost.find((item?: Repost) => item?.userId === session?.id)),
//             ReplyAmount: Tweet?.Reply.length ?? 0,
//             User: {
//                 id: Tweet?.User.id!,
//                 image: Tweet?.User.image as string,
//                 name: Tweet?.User.name as string,
//                 username: Tweet?.User.username as string,
//                 email: Tweet?.User.email as string
//             },
//             quote: Tweet?.quote ? {
//                 id: Tweet?.quote.id as string,
//                 text: Tweet?.quote?.text as string,
//                 createdAt: Tweet?.quote?.createdAt as Date,
//                 updatedAt: Tweet?.quote?.updatedAt as Date,
//                 User: {
//                     name: Tweet?.quote?.User.name as string,
//                     username: Tweet?.quote?.User.username as string,
//                     image: Tweet?.quote?.User.image as string
//                 }
//             } : null,

//         }

//         const replies: ReplyType[] = Tweet?.Reply.map((item) => ({
//             id: item.id,
//             text: item.text,
//             tweetId: item.tweetId,
//             userId: item.userId,
//             createdAt:item.createdAt,
//             updatedAt:item.updatedAt,
//             User:{
//                 id:item.User.id,
//                 name:item.User.name,
//                 username:item.User.username,
//                 email:item.User.email,
//                 image:item.User.image
//             },
//             replies: 
//         }))

//         return NextResponse.json({
//             success: true,
//             message: "Tweet details",
//             data: {
//                 tweet,
//                 replies
//             }
//         }, { status: 200 })

//     } catch (error) {
//         console.log(error)
//         return NextResponse.json({
//             success: false,
//             message: "Something went wrong"
//         }, { status: 403 })
//     }
// }