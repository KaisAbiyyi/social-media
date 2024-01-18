import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SpinnerLoader from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PencilLine } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC, FormEvent, useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

interface QuoteButtonProps {
    userTweetId: string;
    tweetId: string;
    userUsername: string;
    userName: string;
    userImage: string;
    userText: string;
    queryKey: string;
}

type TweetType = {
    text: string;
    userId: string;
    userTweetId?: string;
    tweetId?: string;
}


const QuoteButton: FC<QuoteButtonProps> = ({ userTweetId, tweetId, userImage, userName, userUsername, userText, queryKey }) => {
    const [text, setText] = useState<string>("")
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [key, setKey] = useState<string>(queryKey)
    const queryClient = useQueryClient()
    const { data, status } = useSession()
    const { toast } = useToast()

    useEffect(() => {
        setKey(queryKey)
    }, [queryKey])

    const { mutate: QuoteTweet, isPending } = useMutation({
        mutationFn: async ({ text, userId, userTweetId, tweetId }: TweetType) => await axios.post("/api/tweet", { text, userId, userTweetId, tweetId }),
        onSettled: (data) => {
            setText("")
            queryClient.invalidateQueries({ queryKey: [key] })
            setDialogOpen(false)
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="p-2 flex items-center gap-2 relative cursor-pointer w-full hover:bg-accent select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <PencilLine size={16} />
                <span>Quote</span>
            </DialogTrigger>
            <DialogContent className="p-0 pt-12 bg-secondary">
                <Card>
                    <div className="flex">
                        <CardHeader className="p-4">
                            <Avatar>
                                <AvatarImage src={data?.user.image ?? ''} />
                                <AvatarFallback>{data?.user.name?.at(0)?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </CardHeader>
                        <div className="flex-flex-col flex-grow gap-2">
                            <CardContent className="p-4">
                                <ReactTextareaAutosize
                                    placeholder="What is happening?!"
                                    value={text}
                                    onChange={(e: FormEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value)}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={3}
                                    maxRows={8} />
                            </CardContent>
                            <Card className="flex flex-col mx-4">
                                <CardHeader className="p-4 flex flex-row gap-2 items-center">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={userImage as string} />
                                        <AvatarFallback className="text-xs">{userName.at(0)?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <CardTitle className="text-sm font-bold p-0 m-0">{userName}</CardTitle>
                                    <CardDescription className="text-sm p-0 m-0">@{userUsername}</CardDescription>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <p>{userText}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <CardFooter className="justify-end p-4">
                        <Button
                            disabled={text.length < 1 || isPending}
                            onClick={() => QuoteTweet({ text, userId: data?.user.id as string, userTweetId, tweetId })}>
                            {isPending ? <SpinnerLoader />
                                :
                                "Post"
                            }
                        </Button>
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>

    );
}

export default QuoteButton;