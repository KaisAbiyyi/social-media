import { FC } from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


type ProfileCardProps = {
    trigger: "name" | "username" | "avatar";
    name: string;
    username: string;
    avatar: string;
    className?: string;
}

const ProfileCard: FC<ProfileCardProps> = ({ trigger, name, username, avatar, className }) => {
    return (<>
        <HoverCard>
            <HoverCardTrigger asChild>
                {(
                    () => {
                        if (trigger === "name") {
                            return (
                                <Link href={`/${username}`}>
                                    <CardTitle className={cn("text-base font-bold p-0 m-0 hover:underline cursor-pointer", className)}>{name}</CardTitle>
                                </Link>
                            )
                        } else if (trigger === "avatar") {
                            return (
                                <Link href={`/${username}`}>
                                    <Avatar className={cn("hover:opacity-80 transition ease-in cursor-pointer", className)}>
                                        <AvatarImage src={avatar} />
                                        <AvatarFallback>{name?.at(0)?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Link>
                            )
                        } else {
                            return (
                                <Link href={`/${username}`}>
                                    <CardDescription className={cn("cursor-pointer", className)}>@{username}</CardDescription>
                                </Link>
                            )
                        }
                    })()
                }
            </HoverCardTrigger>
            <HoverCardContent className="flex flex-col gap-4 cursor-default">
                <div className="flex justify-between">
                    <CardHeader className="p-0">
                        <Avatar>
                            <AvatarImage src={avatar} />
                            <AvatarFallback>{name?.at(0)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Link href={"/"} className="hover:underline text-lg">{name}</Link>
                        <Link href={"/"} className="text-muted-foreground">@{username}</Link>
                    </CardHeader>
                    <Button className="h-fit">Follow</Button>
                </div>
                <CardContent className="p-0">
                    <p>description</p>
                </CardContent>
                <CardFooter className="flex gap-4 p-0">
                    <Link href={"/"} className="hover:underline">
                        <div className="flex items-center gap-1">
                            <CardTitle className="text-sm">40</CardTitle>
                            <CardDescription>Following</CardDescription>
                        </div>
                    </Link>
                    <Link href={"/"} className="hover:underline">
                        <div className="flex items-center gap-1">
                            <CardTitle className="text-sm">40M</CardTitle>
                            <CardDescription>Followers</CardDescription>
                        </div>
                    </Link>
                </CardFooter>
            </HoverCardContent>
        </HoverCard>

    </>);
}

export default ProfileCard;         