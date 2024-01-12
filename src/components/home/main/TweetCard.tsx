"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import SpinnerLoader from "@/components/ui/spinner";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
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
    const { data, status } = useSession()
    const { toast } = useToast()
    const { mutate: CreateNewPost, isPending } = useMutation({
        mutationFn: async ({ text, userId }: TweetType) => await axios.post("/api/tweet", { text, userId }),
        onSuccess: (data) => {
            setText("")
            queryClient.invalidateQueries({ queryKey: ['getTweets'] })
        },
        onError: (err: any) => {
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
                    <Avatar>
                        <AvatarImage src={data?.user.image ?? ''} />
                        <AvatarFallback>{data?.user.name?.at(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                </CardHeader>
                <CardContent className="flex-grow p-4">
                    <ReactTextareaAutosize
                        placeholder="What is happening?!"
                        value={text}
                        onChange={(e: FormEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value)}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        rows={3}
                        maxRows={8} />
                </CardContent>
            </div>
            <CardFooter className="justify-end p-4">
                <Button
                    disabled={text.length < 1 || isPending}
                    onClick={() => CreateNewPost({ text, userId: data?.user.id as string })}>
                    {isPending ? <SpinnerLoader />
                        :
                        "Post"
                    }
                </Button>
            </CardFooter>
        </Card>);
}

export default TweetCard;