import { ProfileType } from "@/app/api/profile/[username]/route";
import { TweetDetailType } from "@/app/api/tweet/[tweetId]/route";
import { tweetsType } from "@/app/api/tweet/route";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { ActionButtonPayload } from "@/lib/validators/ActionButtonValidator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Heart } from "lucide-react";
import { FC, useEffect, useState } from "react";

type LikeButtonProps = {
    userId: string;
    tweetId: string;
    Liked: boolean;
    LikeAmount: number;
    queryKey: string
}

const LikeButton: FC<LikeButtonProps> = ({ userId, tweetId, LikeAmount, Liked, queryKey }) => {
    const queryClient = useQueryClient()
    const [liked, setLiked] = useState<boolean>(Liked)
    const [likeAmount, setLikeAmount] = useState<number>(LikeAmount)
    const [key, setKey] = useState<string>(queryKey)
    const { toast } = useToast()

    useEffect(() => {
        setLiked(Liked)
    }, [Liked])
    useEffect(() => {
        setLikeAmount(LikeAmount)
    }, [LikeAmount])
    useEffect(() => {
        setKey(queryKey)
    }, [queryKey])

    const { mutate: likeHandler, isPending: loadingLike } = useMutation({
        mutationFn: async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
            const payload: ActionButtonPayload = {
                tweetId,
                userId
            }
            await axios.post(`/api/tweet/like`, payload)
        },
        onMutate: async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
            await queryClient.cancelQueries({ queryKey: [key] })
            if (key === "getProfile") {
                const previousData = queryClient.getQueryData<ProfileType>([key])
                queryClient.setQueryData([key], {
                    ...previousData,
                    tweet: (previousData as ProfileType)?.tweet?.map((item: tweetsType) => {
                        if (item.id === tweetId) {
                            if (item.Liked) {
                                return { ...item, LikeAmount: item.LikeAmount - 1, Liked: false };
                            }
                            return { ...item, LikeAmount: item.LikeAmount + 1, Liked: true };
                        } else {
                            return { ...item };
                        }
                    })
                } as ProfileType)
                return { previousData }
            } else if (key === "getTweetDetail") {
                const previousData = queryClient.getQueryData<TweetDetailType>([key])
                queryClient.setQueryData([key], {
                    ...previousData,
                    tweet: {
                        ...previousData?.tweet,
                        LikeAmount: previousData?.tweet.Liked ? previousData.tweet.LikeAmount - 1 : previousData?.tweet.LikeAmount! + 1,
                        Liked: previousData?.tweet.Liked ? false : true
                    } as tweetsType,
                })
            }
            else {
                const previousData = queryClient.getQueryData<tweetsType[]>([key])
                queryClient.setQueryData([key], ((previousData as tweetsType[])?.map((item) => {
                    if (item.id === tweetId) {
                        if (item.Liked) {
                            return ({ ...item, LikeAmount: item.LikeAmount - 1, Liked: false })
                        }
                        return ({ ...item, LikeAmount: item.LikeAmount + 1, Liked: true })
                    }
                    else {
                        return ({ ...item })
                    }
                })))
                return { previousData }
            }

        },
        onError: (error, __, context) => {
            console.log(error)
            queryClient.setQueryData([key], () => context?.previousData);
            toast({
                title: "Something went wrong",
                description: "There was some error when fetching the data",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
                variant: "destructive",
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [key] })
        }
    })

    return (
        <Button
            type="button"
            variant={"ghost"}
            onClick={() =>
                likeHandler({ tweetId, userId })}
            size="sm"
            className="p-2 flex gap-2">
            <Heart
                fill={liked ? "#e11d48" : "transparent"}
                color={liked ? "#e11d48" : "currentColor"}
                size={16} />
            <span className={liked ? "text-[#e11d48]" : ""}>{likeAmount}</span>
        </Button>
    );
}

export default LikeButton