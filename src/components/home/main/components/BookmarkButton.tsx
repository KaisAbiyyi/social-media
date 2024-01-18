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
            const previousData = key === "getProfile" ? queryClient.getQueryData<ProfileType>([key]) : queryClient.getQueryData<tweetsType[]>([key])
            if (key === "getProfile") {
                queryClient.setQueryData([key], {
                    ...previousData,
                    Tweet: (previousData as ProfileType)?.Tweet?.map((item: tweetsType) => {
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
            } else if (key === 'getBookmarks') {
                queryClient.setQueryData([key], (previousData as tweetsType[])?.filter((item: tweetsType) => item.id !== tweetId))
            } else {
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
                bookmarkHandler({ tweetId, userId })}
            size="sm"
            className="p-2 flex gap-2">
            <Bookmark className={bookmarked ? "fill-primary text-primary" : ""} size={16} />
        </Button>
    );
}

export default BookmarkButton