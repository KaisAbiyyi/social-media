import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Link from "next/link";
import { FC } from "react";

const WhoToFollowCard: FC = () => {
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle>Who to follow</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <Link href={'/'}>
                    <Card className={buttonVariants({ variant: "ghost", class: 'flex justify-between w-full h-full px-0 py-0' })}>
                        <HoverCard>
                            <div className="flex items-center">
                                <HoverCardTrigger asChild>
                                    <CardHeader className="p-4">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </CardHeader>
                                </HoverCardTrigger>
                                <CardHeader className="p-0">
                                    <HoverCardTrigger asChild>
                                        <CardTitle className="text-lg hover:underline">name</CardTitle>
                                    </HoverCardTrigger>
                                    <HoverCardTrigger asChild>
                                        <CardDescription>@username</CardDescription>
                                    </HoverCardTrigger>
                                </CardHeader>
                            </div>
                            <HoverCardContent className="flex flex-col gap-4 cursor-default">
                                <div className="flex justify-between">
                                    <CardHeader className="p-0">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <Link href={"/"} className="hover:underline text-lg">name</Link>
                                        <Link href={"/"} className="text-muted-foreground">@username</Link>
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
                        <CardFooter className="p-4">
                            <Button>Follow</Button>
                        </CardFooter>
                    </Card>
                </Link>
            </CardContent>
            <CardFooter className="p-4">
                <Button variant={"default"} className="w-full">Show More</Button>
            </CardFooter>
        </Card>
    )
}

export default WhoToFollowCard