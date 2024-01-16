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
            if (key === "getTweets") {
                await queryClient.cancelQueries({ queryKey: ["getTweets"] })
                const previousTweet = queryClient.getQueryData<tweetsType[]>(["getTweets"])
                queryClient.setQueryData(["getTweets"], (previousTweet?.map((item) => {
                    console.log(item)
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

                return { previousTweet }
            } else if (key === 'getProfile') {
                await queryClient.cancelQueries({ queryKey: ["getProfile"] })
                const previousProfile = queryClient.getQueryData<ProfileType>(["getProfile"])
                queryClient.setQueryData(["getProfile"], {
                    ...previousProfile,
                    Tweet: previousProfile?.Tweet?.map((item: tweetsType) => {
                        if (item.id === tweetId) {
                            if (item.Liked) {
                                return { ...item, LikeAmount: item.LikeAmount - 1, Liked: false };
                            }
                            return { ...item, LikeAmount: item.LikeAmount + 1, Liked: true };
                        } else {
                            return { ...item };
                        }
                    })
                })

                return { previousProfile }
            }

        },
        onError: (_, __, context) => {
            if (key === "getTweets") {
                queryClient.setQueryData(["getTweets"], () => context?.previousTweet);
            } else {
                queryClient.setQueryData(["getProfile"], () => context?.previousTweet);
            }
        },
        onSettled: () => {
            if (key === "getTweets") {
                queryClient.invalidateQueries({ queryKey: ["getTweets"] })
            } else {
                queryClient.invalidateQueries({ queryKey: ["getProfile"] })
            }
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