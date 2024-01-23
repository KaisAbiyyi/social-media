import { ProfileType } from "@/app/api/profile/[username]/route";
import { TweetDetailType } from "@/app/api/tweet/[tweetId]/route";
import { tweetsType } from "@/app/api/tweet/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import SpinnerLoader from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { ReplyButtonPayload } from "@/lib/validators/ActionButtonValidator";
import { UploadButton } from "@/utils/uploadthing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Image } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC, FormEvent, useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

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

const ReplyField: FC<ReplyButtonProps> = ({ tweetId, tweetText, tweetUserImage, tweetUserName, tweetUserUsername, tweetReplyAmount, queryKey }) => {
    const { data, status } = useSession()
    const [text, setText] = useState<string>("")
    const [replyAmount, setReplyAmount] = useState<number>(tweetReplyAmount)
    const [key, setKey] = useState<string>(queryKey)
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const [inputFocus, setInputFocus] = useState<boolean>(false)

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
            const previousData = key === "getProfile" ? queryClient.getQueryData<ProfileType>([key]) : queryClient.getQueryData<tweetsType[]>([key])
            if (key === "getProfile") {
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
            } else if (key === "getTweetDetail") {
                const previousData = queryClient.getQueryData<TweetDetailType>([key])
                queryClient.setQueryData([key], {
                    ...previousData,
                    tweet: {
                        ...previousData?.tweet,
                        ReplyAmount: previousData?.tweet.ReplyAmount! + 1,
                    } as tweetsType,
                })
            } else {
                queryClient.setQueryData([key], ((previousData as tweetsType[])?.map((item) => {
                    if (item.id === tweetId) {
                        return ({ ...item, ReplyAmount: item.ReplyAmount + 1 })
                    }
                    else {
                        return ({ ...item })
                    }
                })))
            }

            return { previousData }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData([key], () => context?.previousData);
        },
        onSettled: () => {
            setText("")
            setInputFocus(false)
            queryClient.invalidateQueries({ queryKey: [key] })
        }
    })

    return (
        <Card className="border-none">
            <div className="flex flex-col items-start">
                <div className="flex w-full items-start">
                    <CardHeader className="px-4">
                        <Avatar>
                            <AvatarImage src={data?.user.image as string} />
                            <AvatarFallback>{data?.user.name?.at(0)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </CardHeader>
                    <div className={`flex flex-grow gap-4 items-start p-4 ${inputFocus && "flex-col"}`}>
                        {inputFocus &&
                            <CardDescription>Replying to
                                <span className="text-primary"> @{tweetUserUsername}</span>
                            </CardDescription>
                        }
                        <ReactTextareaAutosize
                            onClick={() => setInputFocus(true)}
                            placeholder="Post your reply"
                            value={text}
                            onChange={(e: FormEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value)}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            rows={3}
                            maxRows={8} />
                        <CardFooter className={`justify-between w-fit px-0 py-4 ${inputFocus && 'w-full'}`}>
                            <UploadButton
                                appearance={{
                                    allowedContent: "hidden",
                                    container: "!p-0",
                                    button: buttonVariants({ variant: "default", size: "icon", className: `rounded-full ${inputFocus ? "" : "hidden"}` })
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
                            <Button
                                onClick={() => { submitReply({ userId: data?.user.id as string, tweetId, text }); }}
                                disabled={text.length < 1 || replyPending}>
                                {replyPending ? <SpinnerLoader /> : "Reply"}
                            </Button>
                        </CardFooter>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default ReplyField;