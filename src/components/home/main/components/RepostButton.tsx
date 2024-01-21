import { ProfileType } from "@/app/api/profile/[username]/route";
import { TweetDetailType } from "@/app/api/tweet/[tweetId]/route";
import { tweetsType } from "@/app/api/tweet/route";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ActionButtonPayload } from "@/lib/validators/ActionButtonValidator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface RepostButtonProps {
    userId: string;
    tweetId: string;
    Reposted: boolean;
    queryKey: string;
}

const RepostButton: FC<RepostButtonProps> = ({ userId, tweetId, Reposted, queryKey }) => {
    const queryClient = useQueryClient()
    const [key, setKey] = useState<string>(queryKey)
    const [reposted, setReposted] = useState<boolean>(Reposted)

    useEffect(() => {
        setReposted(Reposted)
    }, [Reposted])
    useEffect(() => {
        setKey(queryKey)
    }, [queryKey])

    const { mutate: repostHandler, isPending: loadingRepost } = useMutation({
        mutationFn: async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
            const payload: ActionButtonPayload = {
                tweetId, userId
            }
            await axios.post(`/api/tweet/repost`, payload)
        },
        onMutate: async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
            await queryClient.cancelQueries({ queryKey: [key] })
            const previousData = key === "getProfile" ? queryClient.getQueryData<ProfileType>([key]) : queryClient.getQueryData<tweetsType[]>([key])
            if (key === "getProfile") {
                queryClient.setQueryData([key], {
                    ...previousData,
                    tweet: (previousData as ProfileType)?.tweet?.map((item: tweetsType) => {
                        if (item.id === tweetId) {
                            if (item.Reposted) {
                                return { ...item, RepostAmount: item.RepostAmount - 1, Reposted: false };
                            }
                            return { ...item, RepostAmount: item.RepostAmount + 1, Reposted: true };
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
                        RepostAmount: previousData?.tweet.Reposted ? previousData.tweet.RepostAmount - 1 : previousData?.tweet.RepostAmount! + 1,
                        Reposted: previousData?.tweet.Reposted ? false : true
                    } as tweetsType,
                })
            } else {
                queryClient.setQueryData([key], ((previousData as tweetsType[])?.map((item) => {
                    if (item.id === tweetId) {
                        if (item.Reposted) {
                            return ({ ...item, RepostAmount: item.RepostAmount - 1, Reposted: false })
                        }
                        return ({ ...item, RepostAmount: item.RepostAmount + 1, Reposted: true })
                    }
                    else {
                        return ({ ...item })
                    }
                })))
            }

            return { previousData }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(["getTweets"], () => context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["getTweets"] })
        }
    })

    return (
        <DropdownMenuItem
            className="p-2 cursor-pointer flex items-center gap-2"
            onClick={() =>
                repostHandler({ userId, tweetId })}>
            <RefreshCcw size={16} />
            <span>{Reposted ? "Undo Repost" : "Repost"}</span>
        </DropdownMenuItem>
    );
}

export default RepostButton;