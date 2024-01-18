"use client"

import { ProfileType } from "@/app/api/profile/[username]/route";
import { tweetsType } from "@/app/api/tweet/route";
import TweetsList from "@/components/home/main/TweetsList";
import EditProfileDialog from "@/components/home/profile/EditProfileDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";

interface ProfilePageProps {
    params: {
        username: string
    }
}

const ProfilePage: FC<ProfilePageProps> = ({ params }) => {
    const { toast } = useToast()
    const { data: User, status } = useSession()
    const [username, setUsername] = useState<string>(params.username)

    useEffect(() => {
        setUsername(params.username)
    }, [params.username])

    const { data: ProfileData, isPending: ProfileLoading, isError } = useQuery({
        queryKey: ["getProfile"],
        queryFn: async () => {
            const { data } = await axios.get(`/api/profile/${params.username}`)
            return data?.data as ProfileType
        }
    })

    if (isError) {
        toast({
            title: "Something went wrong",
            description: "There was some error when fetching the data",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
            variant: "destructive",
        })
    }

    return (
        <div className="flex flex-col gap-6">
            {ProfileLoading ?
                <Card className="flex">
                    <CardHeader>
                        <Skeleton className="h-20 w-20 rounded-full" />
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-5 w-24" />
                    </CardContent>
                </Card>
                :
                <>
                    <Card className="flex items-start">
                        <CardHeader>
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={ProfileData?.image} />
                                <AvatarFallback className="text-lg">{ProfileData?.name.at(0)?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <CardTitle>{ProfileData?.name}</CardTitle>
                                <CardDescription>@{ProfileData?.username}</CardDescription>
                            </div>
                            <p>{ProfileData?.bio}</p>
                            <CardDescription className="flex items-center gap-2"><Calendar size={14} /> {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(ProfileData?.createdAt as Date))}</CardDescription>
                            <div className="flex gap-4">
                                <div className="flex gap-2">
                                    <CardTitle className="text-base">14K</CardTitle>
                                    <CardDescription className="text-base">Following</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <CardTitle className="text-base">14K</CardTitle>
                                    <CardDescription className="text-base">Followers</CardDescription>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4">
                            {username === ProfileData?.username ?
                                <EditProfileDialog
                                    username={ProfileData?.username as string}
                                    name={ProfileData?.name as string}
                                    image={ProfileData?.image as string}
                                    bio={ProfileData?.bio} /> :
                                <Button type="button">Following</Button>
                            }
                        </CardFooter>
                    </Card>
                    <TweetsList data={ProfileData?.Tweet as tweetsType[]} queryKey="getProfile" />
                </>
            }

        </div>
    );
}

export default ProfilePage;