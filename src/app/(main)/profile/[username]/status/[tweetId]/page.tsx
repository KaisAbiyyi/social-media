"use client"

import { tweetsType } from "@/app/api/tweet/route";
import ProfileCard from "@/components/home/main/ProfileCard";
import TweetsList from "@/components/home/main/TweetsList";
import BookmarkButton from "@/components/home/main/components/BookmarkButton";
import LikeButton from "@/components/home/main/components/LikeButton";
import QuoteButton from "@/components/home/main/components/QuoteButton";
import ReplyButton from "@/components/home/main/components/ReplyButton";
import ReplyField from "@/components/home/main/components/ReplyField";
import RepostButton from "@/components/home/main/components/RepostButton";
import TweetsListSkeleton from "@/components/home/main/components/TweetsListSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import SpinnerLoader from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC } from "react";

interface TweetPageProps {
    params: {
        tweetId: string
    }
}


const TweetPage: FC<TweetPageProps> = ({ params }) => {
    const { data: user, status } = useSession()

    const { data, isPending } = useQuery({
        queryKey: ["getTweetDetail"],
        queryFn: async () => {
            const { data } = await axios.get(`/api/tweet/${params.tweetId}`)
            return data.data
        }
    })

    return (
        <div className="flex flex-col gap-4">
            {isPending ?
                <TweetsListSkeleton /> :
                <>
                    <Card>
                        <div className="flex flex-col w-full-h-full">
                            <div className="flex w-full">
                                <CardHeader className="p-4">
                                    <ProfileCard
                                        followed={data?.tweet.User.followed as boolean}
                                        followers={data?.tweet.User.followers as number}
                                        following={data?.tweet.User.following as number}
                                        image={data?.tweet.User.image as string}
                                        name={data?.tweet.User.name as string}
                                        username={data?.tweet.User.username as string}
                                        trigger="avatar"
                                        queryKey="getTweetDetail"
                                        tweetId={data?.tweet.id} />
                                </CardHeader>
                                <div className="flex flex-col p-4">
                                    <ProfileCard
                                        followed={data?.tweet.User.followed as boolean}
                                        followers={data?.tweet.User.followers as number}
                                        following={data?.tweet.User.following as number}
                                        image={data?.tweet.User.image as string}
                                        name={data?.tweet.User.name as string}
                                        username={data?.tweet.User.username as string}
                                        trigger="name"
                                        queryKey="getTweetDetail"
                                        tweetId={data?.tweet.id} />
                                    <ProfileCard
                                        followed={data?.tweet.User.followed as boolean}
                                        followers={data?.tweet.User.followers as number}
                                        following={data?.tweet.User.following as number}
                                        image={data?.tweet.User.image as string}
                                        name={data?.tweet.User.name as string}
                                        username={data?.tweet.User.username as string}
                                        trigger="username"
                                        queryKey="getTweetDetail"
                                        tweetId={data?.tweet.id} />
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <p>{data?.tweet.text}</p>
                                <CardDescription className="mt-2">{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(data?.tweet.createdAt as Date))}</CardDescription>
                            </CardContent>
                            <Separator orientation="horizontal" />
                            <CardContent className="p-4 flex justify-between flex-row">
                                <div className="flex gap-4">
                                    <ReplyButton
                                        queryKey="getTweetDetail"
                                        tweetId={data?.tweet.id}
                                        tweetReplyAmount={data?.tweet.ReplyAmount}
                                        tweetText={data?.tweet.text}
                                        tweetUserImage={data?.tweet.User.image}
                                        tweetUserName={data?.tweet.User.name}
                                        tweetUserUsername={data?.tweet.User.username}
                                    />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            className={buttonVariants({ variant: "ghost", size: "sm", className: "p-2 flex gap-2" })}>
                                            <RefreshCcw className={data?.tweet.Reposted ? " text-green-500" : ""} size={16} />
                                            <span className={data?.tweet.Reposted ? "text-green-500" : ""}>{data?.tweet.RepostAmount}</span>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <RepostButton
                                                userId={user?.user.id as string}
                                                queryKey="getTweetDetail"
                                                tweetId={data?.tweet.id!}
                                                Reposted={data?.tweet.Reposted} />
                                            <QuoteButton
                                                userImage={data?.tweet.User.image}
                                                userUsername={data?.tweet.User.username}
                                                userName={data?.tweet.User.name}
                                                userText={data?.tweet.text}
                                                userTweetId={data?.tweet.userId}
                                                tweetId={data?.tweet.id!}
                                                queryKey="getTweetDetail" />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <LikeButton
                                        queryKey="getTweetDetail"
                                        tweetId={data?.tweet.id}
                                        LikeAmount={data?.tweet.LikeAmount}
                                        Liked={data?.tweet.Liked}
                                        userId={user?.user.id as string}
                                    />
                                </div>
                                <BookmarkButton
                                    queryKey={"getTweetDetail"}
                                    userId={user?.user.id as string}
                                    tweetId={data?.tweet.id!}
                                    Bookmarked={data?.tweet.Bookmarked} />
                            </CardContent>
                        </div>
                        <Separator />
                        <ReplyField
                            queryKey="getTweetDetail"
                            tweetId={data?.tweet.id}
                            tweetReplyAmount={data?.tweet.ReplyAmount}
                            tweetText={data?.tweet.text}
                            tweetUserImage={data?.tweet.User.image}
                            tweetUserName={data?.tweet.User.name}
                            tweetUserUsername={data?.tweet.User.username}
                        />
                    </Card>
                </>
            }
            {isPending ?
                <SpinnerLoader />
                :
                <TweetsList queryKey="getTweetDetail" data={data.replies} />
            }
        </div>
    );
}

export default TweetPage;