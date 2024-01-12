import { tweetsType } from "@/app/api/tweet/route";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface RepostButtonProps {
    userId: string;
    tweetId: string;
    Reposted: boolean;
}

const RepostButton: FC<RepostButtonProps> = ({ userId, tweetId, Reposted }) => {
    const queryClient = useQueryClient()
    const [reposted, setReposted] = useState<boolean>(Reposted)
    useEffect(() => {
        setReposted(Reposted)
    }, [Reposted])

    const { mutate: repostHandler, isPending: loadingRepost } = useMutation({
        mutationFn: async ({ tweetId, userId }: { tweetId: string, userId: string }) => await axios.post(`/api/tweet/repost`, { tweetId, userId }),
        onMutate: async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
            await queryClient.cancelQueries({ queryKey: ["getTweets"] })

            const previousTweet = queryClient.getQueryData<tweetsType[]>(["getTweets"])
            queryClient.setQueryData(["getTweets"], (previousTweet?.map((item) => {
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

            return { previousTweet }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(["getTweets"], () => context?.previousTweet);
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