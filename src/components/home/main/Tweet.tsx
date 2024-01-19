"use client"

import { tweetsType } from "@/app/api/tweet/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import BookmarkButton from "./components/BookmarkButton";
import DeleteButton from "./components/DeleteButton";
import LikeButton from "./components/LikeButton";
import QuoteButton from "./components/QuoteButton";
import ReplyButton from "./components/ReplyButton";
import RepostButton from "./components/RepostButton";

interface TweetProps {
    tweet: tweetsType;
    queryKey: string;
}

const Tweet: FC<TweetProps> = ({ tweet, queryKey }) => {
    const [key, setKey] = useState<string>(queryKey)
    const { data: user, status } = useSession()

    useEffect(() => {
        setKey(queryKey)
    }, [queryKey])

    return (<>
        <div className={buttonVariants({ variant: "ghost", className: "relative !px-0 w-full flex flex-col h-full rounded-none !py-0" })} key={tweet.id}>
            {tweet.Reposting &&
                <div className="flex w-full items-center" key={tweet.id}>
                    <CardHeader className="p-4">
                        <CardDescription className="flex gap-2 items-center"><RefreshCcw size={12} /> @{user?.user.username} reposted</CardDescription>
                    </CardHeader>
                </div>
            }
            <Link href={`/profile/${tweet.User.username}/status/${tweet.id}`} className="absolute z-0 w-full h-full" />
            <div className="flex w-full">
                <CardHeader className="p-4">
                    <ProfileCard
                        followed={tweet.User.followed}
                        followers={tweet.User.followers}
                        following={tweet.User.following}
                        username={tweet.User.username}
                        name={tweet.User.name}
                        image={tweet.User.image}
                        trigger="avatar"
                        tweetId={tweet.id}
                        queryKey={key}
                        className="z-10" />
                </CardHeader>
                <CardContent className="flex flex-col flex-grow p-0">
                    <CardHeader className="flex flex-row space-y-0 p-4 !items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <ProfileCard
                                followed={tweet.User.followed}
                                followers={tweet.User.followers}
                                following={tweet.User.following}
                                username={tweet.User.username}
                                name={tweet.User.name}
                                image={tweet.User.image}
                                tweetId={tweet.id}
                                queryKey={key}
                                trigger="name" />
                            <ProfileCard
                                tweetId={tweet.id}
                                followed={tweet.User.followed}
                                followers={tweet.User.followers}
                                following={tweet.User.following}
                                username={tweet.User.username}
                                name={tweet.User.name}
                                image={tweet.User.image}
                                queryKey={key}
                                trigger="username" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "sm", className: "z-40" })}><MoreHorizontal /></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {tweet.userId === user?.user.id ?
                                    <DeleteButton queryKey={key} id={tweet.id!} />
                                    :
                                    <DropdownMenuItem className="font-semibold">Unfollow @{tweet.User.username}</DropdownMenuItem>
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-4">
                        <p>{tweet.text}</p>
                        {tweet.quote != null &&
                            <Card className={buttonVariants({ variant: "ghost", className: "flex flex-col justify-start items-start rounded-lg px-0 py-0 mt-2 bg-transparent relative border-secondary" })}>
                                <Link href={`/${tweet.quote.User.username}/status/${tweet.quote.id}`} className="w-full h-full absolute z-10" />
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
                    <CardFooter className="px-4 pb-4 flex justify-between gap-4 z-10">
                        <div className="flex gap-4">
                            <ReplyButton
                                tweetId={tweet.id!}
                                tweetText={tweet.text}
                                tweetUserImage={tweet.User.image}
                                tweetUserName={tweet.User.name}
                                tweetUserUsername={tweet.User.username}
                                tweetReplyAmount={tweet.ReplyAmount}
                                queryKey={key} />
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    className={buttonVariants({ variant: "ghost", size: "sm", className: "p-2 flex gap-2" })}>
                                    <RefreshCcw className={tweet.Reposted ? " text-green-500" : ""} size={16} />
                                    <span className={tweet.Reposted ? "text-green-500" : ""}>{tweet.RepostAmount}</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <RepostButton
                                        userId={user?.user.id as string}
                                        queryKey={key}
                                        tweetId={tweet.id!}
                                        Reposted={tweet.Reposted} />
                                    <QuoteButton
                                        userImage={tweet.User.image}
                                        userUsername={tweet.User.username}
                                        userName={tweet.User.name}
                                        userText={tweet.text}
                                        userTweetId={tweet.userId}
                                        tweetId={tweet.id!}
                                        queryKey={key} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <LikeButton
                                queryKey={key}
                                userId={user?.user.id as string}
                                tweetId={tweet.id!}
                                LikeAmount={tweet.LikeAmount}
                                Liked={tweet.Liked}
                            />
                        </div>
                        <BookmarkButton
                            queryKey={key}
                            userId={user?.user.id as string}
                            tweetId={tweet.id!}
                            Bookmarked={tweet.Bookmarked} />
                    </CardFooter>
                </CardContent>
            </div>
        </div>
    </>);
}

export default Tweet;