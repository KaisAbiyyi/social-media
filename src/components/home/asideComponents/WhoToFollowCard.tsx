"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Link from "next/link";
import { FC } from "react";
import ProfileCard from "../main/ProfileCard";

const WhoToFollowCard: FC = () => {
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle>Who to follow</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Card className={buttonVariants({ variant: "ghost", class: 'flex relative justify-between w-full h-full px-0 py-0 rounded-none border-none' })}>
                    <Link href={"/"} className="absolute w-full h-full"/>
                    <div className="flex items-center">
                        <CardHeader className="p-4">
                            <ProfileCard trigger="avatar" avatar="https://github.com/shadcn.png" name="John Doe" username="johndoe" />
                        </CardHeader>
                        <CardHeader className="p-0">
                            <ProfileCard trigger="name" avatar="https://github.com/shadcn.png" name="John Doe" username="johndoe" />
                            <ProfileCard trigger="username" avatar="https://github.com/shadcn.png" name="John Doe" username="johndoe" />
                        </CardHeader>
                    </div>
                    <CardFooter className="p-4">
                        <Button>Follow</Button>
                    </CardFooter>
                </Card>
            </CardContent>
            <CardFooter className="p-0">
                <Button variant={"default"} className="w-full rounded-t-none">Show More</Button>
            </CardFooter>
        </Card>
    )
}

export default WhoToFollowCard