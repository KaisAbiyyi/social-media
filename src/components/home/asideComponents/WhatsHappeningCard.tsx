import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

const WhatsHappeningCard: FC = () => {
    return (
        <Card className="flex flex-col">
            <CardHeader className="p-4">
                <CardTitle>What's happening</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Link href={'/'}>
                    <Card className={buttonVariants({ variant: "ghost", class: 'flex justify-between w-full rounded-none border-none h-full px-0 py-0' })}>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">tags</CardTitle>
                            <CardDescription>amount of post with this tag</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
                                    <MoreHorizontal size={12} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Not interested in this</DropdownMenuItem>
                                    <DropdownMenuItem>This trend is harmfull or spammy</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </Card>
                </Link>
                <Link href={'/'}>
                    <Card className={buttonVariants({ variant: "ghost", class: 'flex justify-between w-full rounded-none border-none h-full px-0 py-0' })}>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">tags</CardTitle>
                            <CardDescription>amount of post with this tag</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
                                    <MoreHorizontal size={12} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Not interested in this</DropdownMenuItem>
                                    <DropdownMenuItem>This trend is harmfull or spammy</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </Card>
                </Link>
                <Link href={'/'}>
                    <Card className={buttonVariants({ variant: "ghost", class: 'flex justify-between w-full rounded-none border-none h-full px-0 py-0' })}>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">tags</CardTitle>
                            <CardDescription>amount of post with this tag</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
                                    <MoreHorizontal size={12} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Not interested in this</DropdownMenuItem>
                                    <DropdownMenuItem>This trend is harmfull or spammy</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </Card>
                </Link>
                <Link href={'/'}>
                    <Card className={buttonVariants({ variant: "ghost", class: 'flex justify-between w-full rounded-none border-none h-full px-0 py-0' })}>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">tags</CardTitle>
                            <CardDescription>amount of post with this tag</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
                                    <MoreHorizontal size={12} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Not interested in this</DropdownMenuItem>
                                    <DropdownMenuItem>This trend is harmfull or spammy</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </Card>
                </Link>
                <Link href={'/'}>
                    <Card className={buttonVariants({ variant: "ghost", class: 'flex justify-between w-full rounded-none border-none h-full px-0 py-0' })}>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">tags</CardTitle>
                            <CardDescription>amount of post with this tag</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
                                    <MoreHorizontal size={12} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Not interested in this</DropdownMenuItem>
                                    <DropdownMenuItem>This trend is harmfull or spammy</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </Card>
                </Link>
            </CardContent>
            <CardFooter className="p-0">
                <Button variant={"default"} className="w-full rounded-t-none">Show More</Button>
            </CardFooter>
        </Card>
    )
}

export default WhatsHappeningCard