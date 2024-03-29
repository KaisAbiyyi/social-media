import { ProfileType } from "@/app/api/profile/[username]/route";
import { TweetDetailType } from "@/app/api/tweet/[tweetId]/route";
import { tweetsType } from "@/app/api/tweet/route";
import { Button } from "@/components/ui/button";
import { ActionButtonPayload } from "@/lib/validators/ActionButtonValidator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Bookmark } from "lucide-react";
import { FC, useEffect, useState } from "react";

type BookmarkButtonProps = {
    userId: string;
    tweetId: string;
    Bookmarked: boolean;
    queryKey: string;
}

const BookmarkButton: FC<BookmarkButtonProps> = ({ userId, tweetId, Bookmarked, queryKey }) => {
    const queryClient = useQueryClient()
    const [bookmarked, setBookmarked] = useState<boolean>(Bookmarked)
    const [key, setKey] = useState<string>(queryKey)

    useEffect(() => {
        setKey(queryKey)
    }, [queryKey])
    useEffect(() => {
        setBookmarked(Bookmarked)
    }, [Bookmarked])

    const { mutate: bookmarkHandler, isPending: loadingBookmark } = useMutation({
        mutationFn: async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
            const payload: ActionButtonPayload = {
                tweetId, userId
            }

            await axios.post(`/api/tweet/bookmark`, payload)
        },
        onMutate: async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
            await queryClient.cancelQueries({ queryKey: [queryKey] })
            if (key === "getProfile") {
                const previousData = queryClient.getQueryData<ProfileType>([key])
                queryClient.setQueryData([key], {
                    ...previousData,
                    tweet: (previousData as ProfileType)?.tweet?.map((item: tweetsType) => {
                        if (item.id === tweetId) {
                            if (item.Bookmarked) {
                                return { ...item, Bookmarked: false };
                            }
                            return { ...item, Bookmarked: true };
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
                        Bookmarked: previousData?.tweet.Bookmarked ? false : true
                    } as tweetsType,
                })
                return { previousData }
            } else if (key === "getTweetDetailReplies") {
                const previousData = queryClient.getQueryData<TweetDetailType>(["getTweetDetail"])
                queryClient.setQueryData(["getTweetDetail"], {
                    ...previousData,
                    replies: previousData?.replies.map((item: tweetsType) => {
                        if (item.id === tweetId) {
                            if (item.Bookmarked) {
                                return ({ ...item, Bookmarked: false })
                            }
                            return ({ ...item, Bookmarked: true })
                        }
                        else {
                            return ({ ...item })
                        }
                    })
                } as TweetDetailType)
                return { previousData }
            } else if (key === 'getBookmarks') {
                const previousData = queryClient.getQueryData<tweetsType[]>([key])
                queryClient.setQueryData([key], (previousData as tweetsType[])?.filter((item: tweetsType) => item.id !== tweetId))
                return { previousData }
            } else {
                const previousData = queryClient.getQueryData<tweetsType[]>([key])
                queryClient.setQueryData([key], ((previousData as tweetsType[]).map((item: tweetsType) => {
                    if (item.id === tweetId) {
                        if (item.Bookmarked) {
                            return ({ ...item, Bookmarked: false })
                        }
                        return ({ ...item, Bookmarked: true })
                    }
                    else {
                        return ({ ...item })
                    }
                })))
                return { previousData }
            }

        },
        onError: (_, __, context) => {
            queryClient.setQueryData([key], () => context?.previousData);
        },
        onSettled: () => {
            if (key === "getTweetDetailReplies") {
                queryClient.invalidateQueries({ queryKey: ["getTweetDetail"] })
            } else {
                queryClient.invalidateQueries({ queryKey: [key] })
            }
        }
    })

    return (
        <Button
            type="button"
            variant={"ghost"}
            onClick={() =>
                bookmarkHandler({ tweetId, userId })}
            size="sm"
            className="p-2 flex gap-2">
            <Bookmark className={bookmarked ? "fill-primary text-primary" : ""} size={16} />
        </Button>
    );
}

export default BookmarkButton