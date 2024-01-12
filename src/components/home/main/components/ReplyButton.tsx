import { Button, buttonVariants } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { FC, FormEvent, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import SpinnerLoader from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { tweetsType } from "@/app/api/tweet/route";

interface ReplyButtonProps {
    tweetId: string;
    tweetText: string;
    tweetUserImage: string;
    tweetUserName: string;
    tweetUserUsername: string;
    tweetReplyAmount: number;
}

interface ReplyTweetType {
    tweetId: string;
    text: string;
    userId: string
}

const ReplyButton: FC<ReplyButtonProps> = ({ tweetId, tweetText, tweetUserImage, tweetUserName, tweetUserUsername, tweetReplyAmount }) => {
    const { data, status } = useSession()
    const [text, setText] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)
    const [replyAmount, setReplyAmount] = useState<number>(tweetReplyAmount)
    const { toast } = useToast()
    const queryClient = useQueryClient()

    useEffect(() => {
        setReplyAmount(tweetReplyAmount)
    }, [tweetReplyAmount])

    const { mutate: submitReply, isPending: replyPending } = useMutation({
        mutationFn: async ({ tweetId, userId, text }: ReplyTweetType) => await axios.post("/api/tweet/reply", { userId, tweetId, text }),
        onSuccess: (data) => {
            setText("")
        },
        onMutate: async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
            await queryClient.cancelQueries({ queryKey: ["getTweets"] })

            const previousTweet = queryClient.getQueryData<tweetsType[]>(["getTweets"])
            queryClient.setQueryData(["getTweets"], (previousTweet?.map((item) => {
                if (item.id === tweetId) {
                    if (item.ReplyAmount) {
                        return ({ ...item, ReplyAmount: item.ReplyAmount - 1 })
                    }
                    return ({ ...item, ReplyAmount: item.ReplyAmount + 1 })
                }
                else {
                    return ({ ...item })
                }
            })))

            return { previousTweet }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(["getTweets"], () => context?.previousTweet);
        },
        onSettled: () => {
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['getTweets'] })
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={buttonVariants({ variant: "ghost", size: "sm", className: "p-2 flex gap-2" })}>
                <MessageCircle size={16} />
                <span>{tweetReplyAmount}</span>
            </DialogTrigger>
            <DialogContent className="p-0 pt-12 flex flex-col bg-secondary">
                <Card>
                    <div className="flex">
                        <CardHeader className="p-4">
                            <Avatar>
                                <AvatarImage src={tweetUserImage} />
                                <AvatarFallback>{tweetUserName.at(0)?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </CardHeader>
                        <div className="flex flex-col flex-grow">
                            <CardHeader className="px-4 py-4 space-y-0 flex gap-4 flex-row !items-center pb-4">
                                <CardTitle className="text-base">{tweetUserName}</CardTitle>
                                <CardDescription className="text-base">@{tweetUserUsername}</CardDescription>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                                <p>{tweetText} </p>
                                <CardDescription className="text-base mt-4 flex gap-4">
                                    Replying to
                                    <span className="text-primary">@{tweetUserUsername}</span>
                                </CardDescription>
                            </CardContent>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <CardHeader className="px-4">
                            <Avatar>
                                <AvatarImage src={data?.user.image as string} />
                                <AvatarFallback>{data?.user.name?.at(0)?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </CardHeader>
                        <div className="flex flex-col flex-grow p-3">
                            <ReactTextareaAutosize
                                placeholder="Post your reply"
                                value={text}
                                onChange={(e: FormEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value)}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                rows={3}
                                maxRows={8} />
                        </div>
                    </div>
                    <CardFooter className="justify-end p-4">
                        <Button
                            onClick={() => { submitReply({ userId: data?.user.id as string, tweetId, text }); }}
                            disabled={text.length < 1 || replyPending}>
                            {replyPending ? <SpinnerLoader /> : "Reply"}
                        </Button>
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>
    );
}

export default ReplyButton;