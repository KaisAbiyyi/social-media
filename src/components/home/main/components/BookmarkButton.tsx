import { tweetsType } from "@/app/api/tweet/route";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Bookmark, Heart } from "lucide-react";
import { FC, useEffect, useState } from "react";

type BookmarkButtonProps = {
    userId: string;
    tweetId: string;
    Bookmarked: boolean;
}

const BookmarkButton: FC<BookmarkButtonProps> = ({ userId, tweetId, Bookmarked }) => {
    const queryClient = useQueryClient()
    const [bookmarked, setBookmarked] = useState<boolean>(Bookmarked)

    useEffect(() => {
        setBookmarked(Bookmarked)
    }, [Bookmarked])

    const { mutate: bookmarkHandler, isPending: loadingBookmark } = useMutation({
        mutationFn: async ({ tweetId, userId }: { tweetId: string, userId: string }) => await axios.post(`/api/tweet/bookmark`, { tweetId, userId }),
        onMutate: async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
            await queryClient.cancelQueries({ queryKey: ["getTweets"] })

            const previousTweet = queryClient.getQueryData<tweetsType[]>(["getTweets"])
            queryClient.setQueryData(["getTweets"], (previousTweet?.map((item) => {
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