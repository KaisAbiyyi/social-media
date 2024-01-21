import { ProfileType } from "@/app/api/profile/[username]/route";
import { tweetsType } from "@/app/api/tweet/route";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FollowUserPayload } from "@/lib/validators/FollowUserValidator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FC, useEffect, useState } from "react";

interface FollowButtonProps {
    username: string
    followed: boolean
    queryKey: string;
    tweetId?: string
}

const FollowButton: FC<FollowButtonProps> = ({ username, followed, queryKey, tweetId }) => {
    const queryClient = useQueryClient()
    const [key, setKey] = useState<string>(queryKey)

    useEffect(() => {
        setKey(queryKey)
    }, [queryKey])

    const { mutate: FollowUser, isPending } = useMutation({
        mutationFn: async () => {
            const payload: FollowUserPayload = {
                username: username
            }

            const { data } = await axios.post(`/api/profile/${username}/follow`, payload)
            return data
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: [key] })
            if (key === "getProfile" || key ==="getTweetDetail") {
                const previousData = queryClient.getQueryData<ProfileType>([key])
                queryClient.setQueryData([key], {
                    ...previousData,
                    followed: true,
                    followers: previousData?.followed ? (previousData.followers as number) - 1 : (previousData?.followers as number) + 1,
                    tweet: (previousData as ProfileType)?.tweet?.map((item: tweetsType) => {
                        if (item.id === tweetId) {
                            if (item.User.followed) {
                                return ({
                                    ...item, User: {
                                        ...item.User,
                                        followed: false,
                                        followers: item.User.followers - 1
                                    }
                                })
                            }
                            return ({
                                ...item, User: {
                                    ...item.User,
                                    followed: true,
                                    followers: item.User.followers + 1
                                }
                            })
                        } else {
                            return { ...item };
                        }
                    })
                } as ProfileType)
            } else {
                const previousData = queryClient.getQueryData<tweetsType[]>([key])
                queryClient.setQueryData([key], ((previousData as tweetsType[])?.map((item) => {
                    if (item.id === tweetId) {
                        if (item.User.followed) {
                            return ({
                                ...item, User: {
                                    ...item.User,
                                    followed: false,
                                    followers: item.User.followers - 1
                                }
                            })
                        }
                        return ({
                            ...item, User: {
                                ...item.User,
                                followed: true,
                                followers: item.User.followers + 1
                            }
                        })
                    }
                    else {
                        return ({ ...item })
                    }
                })))
            }
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    return toast({
                        title: "User doesnt exists",
                        description: "The User username you're trying to follow doesnt exists",
                        variant: "destructive"
                    })
                }

                if (error.response?.status === 422) {
                    return toast({
                        title: "Invalid username",
                        description: "Invalid username format",
                        variant: "destructive"
                    })
                }

                if (error.response?.status === 401) {
                    return toast({
                        title: "Unauthorized",
                        variant: "destructive"
                    })
                }
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] })
        }
    })

    return (
        <>
            {followed ?
                <Button variant="outline" onClick={() => FollowUser()} disabled={isPending} className="h-fit">Following</Button>
                :
                <Button className="h-fit" onClick={() => FollowUser()} disabled={isPending}>Follow</Button>
            }
        </>
    );
}

export default FollowButton;