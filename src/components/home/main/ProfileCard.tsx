"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn, formatNumberWithSuffix } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import FollowButton from "./components/FollowButton";


type ProfileCardProps = {
    trigger: "name" | "username" | "avatar";
    className?: string;
    tweetId?: string
    queryKey?: string;
    image: string;
    name: string;
    username: string;
    followers: number;
    followed: boolean;
    following: number;
}

const ProfileCard: FC<ProfileCardProps> = (
    {
        trigger,
        image,
        name,
        username,
        followers,
        followed,
        following,
        className,
        tweetId,
        queryKey }) => {
    const { data: session } = useSession()
    const [key, setKey] = useState<string>(queryKey as string)

    useEffect(() => {
        setKey(queryKey as string)
    }, [queryKey])

    return (<>
        <HoverCard>
            <HoverCardTrigger asChild className="z-10">
                {(
                    () => {
                        if (trigger === "name") {
                            return (
                                <Link href={`/profile/${username}`}>
                                    <CardTitle className={cn("text-base font-bold p-0 m-0 hover:underline cursor-pointer", className)}>{name}</CardTitle>
                                </Link>
                            )
                        } else if (trigger === "avatar") {
                            return (
                                <Link href={`/profile/${username}`}>
                                    <Avatar className={cn("hover:opacity-80 transition ease-in cursor-pointer", className)}>
                                        <AvatarImage src={image} />
                                        <AvatarFallback>{name?.at(0)?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Link>
                            )
                        } else {
                            return (
                                <Link href={`/profile/${username}`}>
                                    <CardDescription className={cn("cursor-pointer", className)}>@{username}</CardDescription>
                                </Link>
                            )
                        }
                    })()
                }
            </HoverCardTrigger>
            <HoverCardContent className="flex flex-col gap-4 cursor-default !z-[99]">
                <div className="flex justify-between">
                    <CardHeader className="p-0">
                        <Avatar>
                            <AvatarImage src={image} />
                            <AvatarFallback>{name?.at(0)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Link href={`/profile/${username}`} className="hover:underline text-lg">{name}</Link>
                        <Link href={`/profile/${username}`} className="text-muted-foreground">@{username}</Link>
                    </CardHeader>
                    {username !== session?.user.username &&
                        <FollowButton queryKey={key} tweetId={tweetId} followed={followed} username={username} />
                    }
                </div>
                <CardContent className="p-0">
                    <p>description</p>
                </CardContent>
                <CardFooter className="flex gap-4 p-0">
                    <Link href={"/"} className="hover:underline">
                        <div className="flex items-center gap-1">
                            <CardTitle className="text-sm">{formatNumberWithSuffix(following ?? 0)}</CardTitle>
                            <CardDescription>Following</CardDescription>
                        </div>
                    </Link>
                    <Link href={"/"} className="hover:underline">
                        <div className="flex items-center gap-1">
                            <CardTitle className="text-sm">{formatNumberWithSuffix(followers ?? 0)}</CardTitle>
                            <CardDescription>Followers</CardDescription>
                        </div>
                    </Link>
                </CardFooter>
            </HoverCardContent>
        </HoverCard>

    </>);
}

export default ProfileCard;         