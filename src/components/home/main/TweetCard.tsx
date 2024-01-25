"use client"

import { tweetsType } from "@/app/api/tweet/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import SpinnerLoader from "@/components/ui/spinner";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { UploadButton } from "@/utils/uploadthing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Image, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, FormEvent, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

interface TweetCardProps {

}

type TweetType = {
    text: string;
    userId: string;
    image?: {
        imageUrl: string;
        imageKey: string;
        imageName: string;
    }
}

type fileResponse = {
    url: string;
    name: string;
    key: string;
}

const TweetCard: FC<TweetCardProps> = () => {
    const [text, setText] = useState<string>("")
    const queryClient = useQueryClient()
    const [images, setImages] = useState<fileResponse[]>([])
    const [imageUploading, setImageUploading] = useState<boolean>(false)
    const { data: User, status } = useSession()
    const { toast } = useToast()
    const { mutate: CreateNewPost, isPending } = useMutation({
        mutationFn: async ({ text, userId, image }: TweetType) => await axios.post("/api/tweet", { text, userId, image }),
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
                    username: User?.user.username!,
                    followed: false,
                    followers: 0,
                    following: 0
                },
            }
            queryClient.setQueryData(["getTweets"], (old: tweetsType[]) => [optimisTicData, ...old])

            return { previousData }
        },
        onSettled: (data) => {
            setText("")
            setImages([])
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

    const { mutate: removeFileHandler, isPending: removeFilePending } = useMutation({
        mutationFn: async ({ key }: { key: string }) => axios.post("/api/uploadthing/delete", { key }),
        onMutate: () => {
            setImages([])
        },
    })

    return (
        <Card>
            <div className="flex">
                <CardHeader className="p-4">
                    <Avatar className="relative">
                        <Link href={`/profile/${User?.user.username}`} className="w-full h-full absolute" />
                        <AvatarImage src={User?.user.image ?? ''} />
                        <AvatarFallback>{User?.user.name?.at(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col gap-4 p-4">
                    <ReactTextareaAutosize
                        placeholder="What is happening?!"
                        value={text}
                        onChange={(e: FormEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value)}
                        className="flex min-h-[80px] w-full rounded-none bg-transparent border-x-0 border-t-0 border-b-1 px-0 py-0 text-lg focus:border-b-primary border-b-accent focus:outline-none focus:ring-0 ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        rows={3}
                        maxRows={8} />
                    {images.length > 0 &&
                        <div className="relative w-fit">
                            <img className={`object-cover h-full rounded-lg w-full lg:w-[350px]`}
                                src={images[0].url}
                                alt={images[0].name} />
                            <Button onClick={() => removeFileHandler({ key: images[0].key })} type="button" variant="destructive" size="icon" className="absolute right-1 top-1">
                                <X />
                            </Button>
                        </div>
                    }
                    <CardFooter className="justify-between p-0 w-full">
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
                            onUploadProgress={() => setImageUploading(true)}
                            endpoint="mediaUploader"
                            onClientUploadComplete={(res) => {
                                setImages(res as [])
                                setImageUploading(false)
                            }}
                            onUploadError={(err: Error) => {
                                return toast({
                                    title: "Something went wrong",
                                    description: err.message
                                })
                            }} />
                        <Button
                            disabled={text.length < 1 || isPending || imageUploading}
                            onClick={() => CreateNewPost({
                                text, userId: User?.user.id as string, image: {
                                    imageKey: images[0].key,
                                    imageName: images[0].name,
                                    imageUrl: images[0].url,
                                }
                            })}>
                            {isPending ? <SpinnerLoader />
                                :
                                "Post"
                            }
                        </Button>
                    </CardFooter>
                </CardContent>
            </div>
        </Card>);
}

export default TweetCard;