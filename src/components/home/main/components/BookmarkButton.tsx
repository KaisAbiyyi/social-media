import { ProfileType } from "@/app/api/profile/[username]/route";
import { tweetsType } from "@/app/api/tweet/route";
import { Button } from "@/components/ui/button";
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
        mutationFn: async ({ tweetId, userId }: { tweetId: string, userId: string }) => await axios.post(`/api/tweet/bookmark`, { tweetId, userId }),
        onMutate: async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
            await queryClient.cancelQueries({ queryKey: [queryKey] })

            const previousTweet = key === "getTweets" ? queryClient.getQueryData<tweetsType[]>([key]) : queryClient.getQueryData<ProfileType>([key])
            if (key === "getTweets") {
                queryClient.setQueryData([key], ((previousTweet as tweetsType[]).map((item: tweetsType) => {
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
            } else {
                queryClient.setQueryData([key], {
                    ...previousTweet,
                    Tweet: (previousTweet as ProfileType)?.Tweet?.map((item: tweetsType) => {
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
            }

            return { previousTweet }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData([key], () => context?.previousTweet);
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
                bookmarkHandler({ tweetId, userId })}
            size="sm"
            className="p-2 flex gap-2">
            <Bookmark className={bookmarked ? "fill-primary text-primary" : ""} size={16} />
        </Button>
    );
}

export default BookmarkButton