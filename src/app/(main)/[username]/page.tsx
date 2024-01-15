"use client"

import { ProfileType } from "@/app/api/profile/[username]/route";
import { tweetsType } from "@/app/api/tweet/route";
import ProfileCard from "@/components/home/main/ProfileCard";
import BookmarkButton from "@/components/home/main/components/BookmarkButton";
import LikeButton from "@/components/home/main/components/LikeButton";
import QuoteButton from "@/components/home/main/components/QuoteButton";
import ReplyButton from "@/components/home/main/components/ReplyButton";
import RepostButton from "@/components/home/main/components/RepostButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MoreHorizontal, RefreshCcw, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";

interface ProfilePageProps {
    params: {
        username: string
    }
}

const ProfilePage: FC<ProfilePageProps> = ({ params }) => {
    const { data: user } = useSession()
    const { data: ProfileData, isPending: ProfileLoading } = useQuery({
        queryKey: ["getProfile"],
        queryFn: async () => {
            const { data } = await axios.get(`/api/profile/${params.username}`)
            return data?.data as ProfileType
        }
    })

    const ProfileTweet = ProfileData?.Tweet ?? []

    return (
        <div className="flex flex-col gap-6">
            {ProfileLoading ?
                <Card className="flex">
                    <CardHeader>
                        <Skeleton className="h-20 w-20 rounded-full" />
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-5 w-24" />
                    </CardContent>
                </Card>
                :
                <Card className="flex items-start">
                    <CardHeader>
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={ProfileData?.image} />
                            <AvatarFallback className="text-lg">{ProfileData?.name.at(0)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <CardTitle>{ProfileData?.name}</CardTitle>
                            <CardDescription>@{ProfileData?.username}</CardDescription>
                        </div>
                        <CardDescription>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(ProfileData?.createdAt as Date))}</CardDescription>
                        <div className="flex gap-4">
                            <div className="flex gap-2">
                                <CardTitle className="text-base">14K</CardTitle>
                                <CardDescription className="text-base">Following</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <CardTitle className="text-base">14K</CardTitle>
                                <CardDescription className="text-base">Followers</CardDescription>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-4">
                        <Button type="button">Following</Button>
                    </CardFooter>
                </Card>
            }
            {ProfileTweet.length > 0 &&
                <Card>
                    {ProfileTweet.map((tweet: tweetsType, index: number, array: tweetsType[]) => (
                        <div className="relative flex flex-col" key={tweet.id}>
                            {tweet.Reposting &&
                                <CardDescription className="flex gap-2 items-center p-1 italic font-semibold text-sm">
                                    <RefreshCcw size={12} />
                                    <span>
                                        {tweet.User.username}
                                    </span>
                                    <span>reposted</span>
                                </CardDescription>
                            }
                            <Link href={`/${tweet.User.username}/status/${tweet.id}`} className="absolute w-full h-full" />
                            <div className="flex">
                                <CardHeader className="p-4">
                                    <ProfileCard className="z-40" avatar={tweet.User.image as string} trigger="avatar" name={tweet.User.name as string} username={tweet.User.username as string} />
                                </CardHeader>
                                <div className="flex flex-col flex-grow">
                                    <CardHeader className="flex flex-row space-y-0 px-4 py-4 !items-center justify-between">
                                        <div className="flex gap-4 items-center">
                                            <ProfileCard avatar={tweet.User.image as string} trigger="name" name={tweet.User.name as string} username={tweet.User.username as string} />
                                            <ProfileCard avatar={tweet.User.image as string} trigger="username" name={tweet.User.name as string} username={tweet.User.username as string} />
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "sm" })}><MoreHorizontal /></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {tweet.userId === user?.user.id ?
                                                    <DropdownMenuItem className="font-semibold flex gap-2 text-red-500">
                                                        <Trash size={16} />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                    :
                                                    <DropdownMenuItem className="font-semibold">Unfollow @{tweet.User.username}</DropdownMenuItem>
                                                }
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4">
                                        <p>{tweet.text}</p>
                                        {tweet.quote != null &&
                                            <Card className="flex flex-col mt-2">
                                                <CardHeader className="p-4 flex flex-row gap-2 items-center">
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarImage src={tweet.quote.User.image as string} />
                                                        <AvatarFallback className="text-xs">{tweet.quote.User.name.at(0)?.toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <CardTitle className="text-sm font-bold p-0 m-0">{tweet.quote.User.name}</CardTitle>
                                                    <CardDescription className="text-sm p-0 m-0">@{tweet.quote.User.username}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="px-4 pb-4">
                                                    <p>{tweet.quote.text}</p>
                                                </CardContent>
                                            </Card>
                                        }
                                    </CardContent>
                                    <CardFooter className="px-4 pb-4 flex justify-between gap-4 z-40">
                                        <div className="flex gap-4">
                                            <ReplyButton
                                                tweetId={tweet.id}
                                                tweetText={tweet.text}
                                                tweetUserImage={tweet.User.image}
                                                tweetUserName={tweet.User.name}
                                                tweetUserUsername={tweet.User.username}
                                                tweetReplyAmount={tweet.ReplyAmount} />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    className={buttonVariants({ variant: "ghost", size: "sm", className: "p-2 flex gap-2" })}>
                                                    <RefreshCcw className={tweet.Reposted ? " text-green-500" : ""} size={16} />
                                                    <span className={tweet.Reposted ? "text-green-500" : ""}>{tweet.RepostAmount}</span>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <RepostButton
                                                        userId={user?.user.id as string}
                                                        tweetId={tweet.id}
                                                        Reposted={tweet.Reposted} />
                                                    <QuoteButton
                                                        userImage={tweet.User.image}
                                                        userUsername={tweet.User.username}
                                                        userName={tweet.User.name}
                                                        userText={tweet.text}
                                                        userTweetId={tweet.userId}
                                                        tweetId={tweet.id} />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <LikeButton
                                                userId={user?.user.id as string}
                                                tweetId={tweet.id}
                                                LikeAmount={tweet.LikeAmount}
                                                Liked={tweet.Liked}
                                            />
                                        </div>
                                        <BookmarkButton
                                            userId={user?.user.id as string}
                                            tweetId={tweet.id}
                                            Bookmarked={tweet.Bookmarked} />
                                    </CardFooter>
                                </div>
                            </div>
                            {index !== array.length - 1 ?
                                <Separator /> :
                                ""
                            }
                        </div>
                    ))}
                </Card >
            }

        </div>
    );
}

export default ProfilePage;