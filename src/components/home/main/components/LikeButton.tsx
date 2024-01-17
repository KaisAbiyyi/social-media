import { ProfileType } from "@/app/api/profile/[username]/route";
import { tweetsType } from "@/app/api/tweet/route";
import { Button } from "@/components/ui/button";
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
        mutationFn: async ({ tweetId, userId }: { tweetId: string, userId: string }) => await axios.post(`/api/tweet/like`, { tweetId, userId }),
        onMutate: async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
            await queryClient.cancelQueries({ queryKey: [key] })
            const previousData = key === "getTweets" ? queryClient.getQueryData<tweetsType[]>([key]) : queryClient.getQueryData<ProfileType>([key])
            if (key === "getTweets") {
                queryClient.setQueryData(["getTweets"], ((previousData as tweetsType[])?.map((item) => {
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

            } else if (key === 'getProfile') {
                queryClient.setQueryData(["getProfile"], {
                    ...previousData,
                    Tweet: (previousData as ProfileType)?.Tweet?.map((item: tweetsType) => {
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
            }
            return { previousData }

        },
        onError: (_, __, context) => {
            queryClient.setQueryData([key], () => context?.previousData);
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