"use client"
import { tweetsType } from "@/app/api/tweet/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import SpinnerLoader from "@/components/ui/spinner";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MoreHorizontal, RefreshCcw, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC } from "react";
import ProfileCard from "./ProfileCard";
import BookmarkButton from "./components/BookmarkButton";
import LikeButton from "./components/LikeButton";
import QuoteButton from "./components/QuoteButton";
import ReplyButton from "./components/ReplyButton";
import RepostButton from "./components/RepostButton";
import Link from "next/link";


const TweetsList: FC = () => {
    const { toast } = useToast()
    const { data: user, status } = useSession()
    const { data, isPending, isError } = useQuery({
        queryKey: ["getTweets"],
        queryFn: async () => {
            const { data } = await axios.get("/api/tweet");
            return data.data
        },
    })
    if (isError) {
        toast({
            title: "Something went wrong",
            description: "There was some error when fetching the data",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
            variant: "destructive",
        })
    }

    if (isPending) return (
        <div className="flex flex-col items-center">
            <SpinnerLoader />
        </div>
    )

    return (<>
        {data.length > 0 &&
            <Card>
                {data.map((tweet: tweetsType, index: number, array: tweetsType[]) => (
                    <div className="relative" key={tweet.id}>
                        <Link href={`/${tweet.User.username}/status/${tweet.id}`} className="absolute z-0 w-full h-full" />
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
                                <CardFooter className="px-4 pb-4 flex justify-between gap-4 z-50">
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
    </>)
}

export default TweetsList;