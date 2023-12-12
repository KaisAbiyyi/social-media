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
import { MoreHorizontal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import SpinnerLoader from "@/components/ui/spinner";
import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Tweet = Prisma.TweetGetPayload<{
    include: {
        User: true
    }
}>


const PostsList: FC = () => {
    const { toast } = useToast()
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

    if (isPending) return <SpinnerLoader />

    return (<>
        {data.map((tweet: Tweet) => (
            <Card className="flex">
                <CardHeader className="p-2">
                    <Avatar>
                        <AvatarImage src={tweet.User.image ?? ''} />
                        <AvatarFallback>{tweet.User.name?.at(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                </CardHeader>
                <div className="flex flex-col flex-grow">
                    <CardHeader className="flex flex-row space-y-0 p-2 !items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <CardTitle className="text-base font-bold p-0 m-0">{tweet.User.name}</CardTitle>
                            <CardDescription>@{tweet.User.username}</CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "sm" })}><MoreHorizontal /></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="font-semibold">Unfollow @username</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-2 pb-4">
                        <p>{tweet.text}</p>
                    </CardContent>
                </div>
            </Card>
        ))}
    </>)
}

export default PostsList;