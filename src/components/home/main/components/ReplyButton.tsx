import { Button, buttonVariants } from "@/components/ui/button";
import { Image, MessageCircle } from "lucide-react";
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
import axios, { AxiosError } from "axios";
import SpinnerLoader from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { tweetsType } from "@/app/api/tweet/route";
import { ProfileType } from "@/app/api/profile/[username]/route";
import { TweetDetailType } from "@/app/api/tweet/[tweetId]/route";
import { ReplyButtonPayload } from "@/lib/validators/ActionButtonValidator";
import { UploadButton } from "@/utils/uploadthing";

interface ReplyButtonProps {
    tweetId: string;
    tweetText: string;
    tweetUserImage: string;
    tweetUserName: string;
    tweetUserUsername: string;
    tweetReplyAmount: number;
    queryKey: string
}

interface ReplyTweetType {
    tweetId: string;
    text: string;
    userId: string
}

const ReplyButton: FC<ReplyButtonProps> = ({ tweetId, tweetText, tweetUserImage, tweetUserName, tweetUserUsername, tweetReplyAmount, queryKey }) => {
    const { data, status } = useSession()
    const [text, setText] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)
    const [replyAmount, setReplyAmount] = useState<number>(tweetReplyAmount)
    const [key, setKey] = useState<string>(queryKey)
    const { toast } = useToast()
    const queryClient = useQueryClient()

    useEffect(() => {
        setReplyAmount(tweetReplyAmount)
    }, [tweetReplyAmount])
    useEffect(() => {
        setKey(queryKey)
    }, [queryKey])

    const { mutate: submitReply, isPending: replyPending } = useMutation({
        mutationFn: async ({ tweetId, userId, text }: ReplyTweetType) => {
            const payload: ReplyButtonPayload = {
                tweetId, userId, text
            }
            await axios.post("/api/tweet/reply", payload)
        },
        onMutate: async ({ tweetId }: { tweetId: string }) => {
            await queryClient.cancelQueries({ queryKey: [key] })
            if (key === "getProfile") {
                const previousData = queryClient.getQueryData<ProfileType>([key])
                queryClient.setQueryData([key], {
                    ...previousData,
                    tweet: (previousData as ProfileType)?.tweet?.map((item: tweetsType) => {
                        if (item.id === tweetId) {
                            return { ...item, ReplyAmount: item.ReplyAmount + 1 };
                        } else {
                            return { ...item };
                        }
                    })
                } as ProfileType)
                return { previousData }
            } else if (key === "getTweetDetail") {
                const previousData = queryClient.getQueryData<TweetDetailType>([key])
                const updatedReplies = [
                    {
                        userId: data?.user.id,
                        Bookmarked: false,
                        LikeAmount: 0,
                        Liked: false,
                        ReplyAmount: 0,
                        RepostAmount: 0,
                        Reposted: false,
                        text,
                        User: {
                            id: data?.user.id,
                            email: data?.user.email,
                            image: data?.user.image,
                            username: data?.user.username,
                            name: data?.user.name,
                        },
                    },
                    ...(previousData?.replies || []),
                ];
                queryClient.setQueryData([key], {
                    tweet: {
                        ...previousData?.tweet,
                        ReplyAmount: previousData?.tweet.ReplyAmount! + 1,
                    } as tweetsType,
                    replies: updatedReplies
                } as TweetDetailType)
                return { previousData }
            } else if (key === "getTweetDetailReplies") {
                const previousData = queryClient.getQueryData<TweetDetailType>(["getTweetDetail"])
                queryClient.setQueryData(["getTweetDetail"], {
                    ...previousData,
                    replies: previousData?.replies.map((item: tweetsType) => {
                        if (item.id === tweetId) {
                            return ({ ...item, ReplyAmount: item.ReplyAmount + 1 })
                        }
                        else {
                            return ({ ...item })
                        }
                    })
                } as TweetDetailType)
                return { previousData }
            } else {
                const previousData = queryClient.getQueryData<tweetsType[]>([key])
                queryClient.setQueryData([key], ((previousData as tweetsType[])?.map((item) => {
                    if (item.id === tweetId) {
                        return ({ ...item, ReplyAmount: item.ReplyAmount + 1 })
                    }
                    else {
                        return ({ ...item })
                    }
                })))
                return { previousData }
            }

        },
        onError: (error, __, context) => {
            queryClient.setQueryData([key], () => context?.previousData);
            console.log(error)
            if (error instanceof AxiosError) {
                if (error.response?.status === 422) {
                    return toast({
                        title: "Something went wrong",
                        description: "Reply must be at least 3 characters long",
                        variant: "destructive"
                    })
                } else {
                    return toast({
                        title: "Something went wrong",
                        description: "Error while uploading your reply, try again later",
                        variant: "destructive"
                    })
                }
            }
        },
        onSettled: () => {
            setOpen(false)
            setText("")
            if (key === "getTweetDetailReplies") {
                queryClient.invalidateQueries({ queryKey: ["getTweetDetail"] })
            } else {
                queryClient.invalidateQueries({ queryKey: [key] })
            }
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={buttonVariants({ variant: "ghost", size: "sm", className: "p-2 flex gap-2 !z-40" })}>
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
                    <CardFooter className="justify-between p-4 mt-4">
                        <div className="flex-grow flex">
                            <UploadButton
                                appearance={{
                                    allowedContent: "hidden",
                                    container: "!p-0",
                                    button: buttonVariants({ variant: "default", size: "icon", className: "rounded-full" })
                                }}
                                content={{
                                    button({ ready }) {
                                        if (ready) return <Image />
                                        return <SpinnerLoader />
                                    },
                                }}
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    console.log(res)
                                }}
                                onUploadError={(err: Error) => {
                                    return toast({
                                        title: "Something went wrong",
                                        description: err.message
                                    })
                                }} />
                        </div>
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