"use client"
import { FC } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bookmark, Heart, MessageCircle, MoreHorizontal, PencilLine, RefreshCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import SpinnerLoader from "@/components/ui/spinner";
import ProfileCard from "./ProfileCard";
import { Separator } from "@/components/ui/separator";
import { tweetsType } from "@/app/api/tweet/route";
import { useSession } from "next-auth/react";
import LikeButton from "./components/LikeButton";
import BookmarkButton from "./components/BookmarkButton";
import RepostButton from "./components/RepostButton";
import QuoteButton from "./components/QuoteButton";


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
        <Card>
            {data.map((tweet: tweetsType, index: number, array: tweetsType[]) => (
                <>
                    <div className="flex" key={tweet.id}>
                        <CardHeader className="p-4">
                            <ProfileCard avatar={tweet.User.image as string} trigger="avatar" name={tweet.User.name as string} username={tweet.User.username as string} />
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
                                        <DropdownMenuItem className="font-semibold">Unfollow @{tweet.User.username}</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                                <p>{tweet.text}</p>
                            </CardContent>
                            <CardFooter className="px-4 pb-4 flex justify-between gap-4">
                                <div className="flex gap-4">
                                    <Button type="button" variant={"ghost"} size="sm" className="p-2 flex gap-2">
                                        <MessageCircle size={16} />
                                        <span>12k</span>
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            className={buttonVariants({ variant: "ghost", size: "sm", className: "p-2 flex gap-2" })}>
                                            <RefreshCcw className={tweet.Reposted ? " text-green-500" : ""} size={16} />
                                            <span>{tweet.RepostAmount}</span>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <RepostButton
                                                userId={user?.user.id as string}
                                                tweetId={tweet.id}
                                                Reposted={tweet.Reposted} />
                                            <QuoteButton
                                                userId={user?.user.id as string}
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
                </>
            ))}
        </Card >
    </>)
}

export default TweetsList;