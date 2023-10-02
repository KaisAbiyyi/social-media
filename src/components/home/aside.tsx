import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

export default function MainAside() {
    return <>
        <div className="flex flex-col flex-grow gap-6">
            <Input type="search" placeholder="Search" />
            <Card>
                <CardHeader className="p-4">
                    <CardTitle>What's happening</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <Link href={'/'}>
                        <Card className={buttonVariants({ variant: "ghost", class: 'flex justify-between w-full h-full px-0 py-0' })}>
                            <CardHeader className="p-4">
                                <CardTitle className="text-lg">tags</CardTitle>
                                <CardDescription>amount of post with this tag</CardDescription>
                            </CardHeader>
                            <CardFooter className="p-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className={buttonVariants({ variant: 'default' })}>...</DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Not interested in this</DropdownMenuItem>
                                        <DropdownMenuItem>This trend is harmfull or spammy</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardFooter>
                        </Card>
                    </Link>
                </CardContent>
                <CardFooter className="p-4">
                    <Button variant={"default"} className="w-full">Show More</Button>
                </CardFooter>
            </Card>
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
                                            <CardTitle className="text-lg">name</CardTitle>
                                        </HoverCardTrigger>
                                        <HoverCardTrigger asChild>
                                            <CardDescription>@username</CardDescription>
                                        </HoverCardTrigger>
                                    </CardHeader>
                                </div>
                                <HoverCardContent className="flex flex-col gap-4">
                                    <div className="flex justify-between">
                                        <CardHeader className="p-0">
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <CardTitle className="text-lg">name</CardTitle>
                                            <CardDescription>@username</CardDescription>
                                        </CardHeader>
                                        <Button>Follow</Button>
                                    </div>
                                    <CardContent className="p-0">
                                        <p>description</p>
                                    </CardContent>
                                    <CardFooter className="flex gap-4 p-0">
                                        <div className="flex items-center gap-1">
                                            <CardTitle className="text-sm">40</CardTitle>
                                            <CardDescription>Following</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CardTitle className="text-sm">40M</CardTitle>
                                            <CardDescription>Followers</CardDescription>
                                        </div>
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
        </div>
    </>
}