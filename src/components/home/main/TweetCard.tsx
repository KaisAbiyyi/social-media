"use client"

import { tweetsType } from "@/app/api/tweet/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import SpinnerLoader from "@/components/ui/spinner";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, FormEvent, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

interface TweetCardProps {

}

type TweetType = {
    text: string;
    userId: string;
}

const TweetCard: FC<TweetCardProps> = () => {
    const [text, setText] = useState<string>("")
    const queryClient = useQueryClient()
    const { data: User, status } = useSession()
    const { toast } = useToast()
    const { mutate: CreateNewPost, isPending } = useMutation({
        mutationFn: async ({ text, userId }: TweetType) => await axios.post("/api/tweet", { text, userId }),
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ["getTweets"] })
            const previousData = queryClient.getQueryData<tweetsType[]>(["getTweets"])
            const optimisTicData: tweetsType = {
                text: text,
                Bookmarked: false,
                LikeAmount: 0,
                Liked: false,
                ReplyAmount: 0,
                RepostAmount: 0,
                Reposted: false,
                userId: User?.user.id!,
                User: {
                    email: User?.user.email!,
                    id: User?.user.id!,
                    image: User?.user.image!,
                    name: User?.user.name!,
                    username: User?.user.username!
                },
            }
            queryClient.setQueryData(["getTweets"], (old: tweetsType[]) => [optimisTicData, ...old])

            return { previousData }
        },
        onSettled: (data) => {
            setText("")
            queryClient.invalidateQueries({ queryKey: ['getTweets'] })
        },
        onError: (err: any, _, context) => {
            queryClient.setQueryData(["getTweets"], () => context?.previousData);
            toast({
                title: "Something went wrong",
                description: err?.response.data.message,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
                variant: "destructive",
            })
        }
    })

    return (
        <Card>
            <div className="flex">
                <CardHeader className="p-4">
                    <Avatar className="relative">
                        <Link href={`/${User?.user.username}`} className="w-full h-full absolute" />
                        <AvatarImage src={User?.user.image ?? ''} />
                        <AvatarFallback>{User?.user.name?.at(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                </CardHeader>
                <CardContent className="flex-grow p-4">
                    <ReactTextareaAutosize
                        placeholder="What is happening?!"
                        value={text}
                        onChange={(e: FormEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value)}
                        className="flex min-h-[80px] w-full rounded-none bg-transparent border-x-0 border-t-0 border-b-1 px-0 py-0 text-lg focus:border-b-primary border-b-accent focus:outline-none focus:ring-0 ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        rows={3}
                        maxRows={8} />
                </CardContent>
            </div>
            <CardFooter className="justify-end p-4">
                <Button
                    disabled={text.length < 1 || isPending}
                    onClick={() => CreateNewPost({ text, userId: User?.user.id as string })}>
                    {isPending ? <SpinnerLoader />
                        :
                        "Post"
                    }
                </Button>
            </CardFooter>
        </Card>);
}

export default TweetCard;