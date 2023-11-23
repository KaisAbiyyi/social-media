"use client"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button, buttonVariants } from "../ui/button";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import ReactTextareaAutosize from "react-textarea-autosize";

import Link from "next/link";
import { Bell, Home, Mail, MoreHorizontal, PenSquare, Search, Settings, User } from "lucide-react";

export default function MainSidebar() {
    const router = useRouter()
    return <>
        <div className="flex flex-col flex-grow gap-6">
            <Card>
                <CardHeader className="p-4">
                    <Link href="/home" className={buttonVariants({ variant: 'default', class: 'justify-start w-fit !text-lg font-semibold' })}>socal-media</Link>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 py-4">
                    <Link href="/home" className={buttonVariants({ variant: 'ghost', size: "lg", class: 'justify-start w-fit gap-4' })}>
                        <Home />
                        <span className="text-lg font-semibold">Home</span>
                    </Link>
                    <Link href="/explore" className={buttonVariants({ variant: 'ghost', size: "lg", class: 'justify-start w-fit gap-4' })}>
                        <Search />
                        <span className="text-lg font-semibold">Explore</span>
                    </Link>
                    <Link href="/notifications" className={buttonVariants({ variant: 'ghost', size: "lg", class: 'justify-start w-fit gap-4' })}>
                        <Bell />
                        <span className="text-lg font-semibold">Notifications</span>
                    </Link>
                    <Link href="/messages" className={buttonVariants({ variant: 'ghost', size: "lg", class: 'justify-start w-fit gap-4' })}>
                        <Mail />
                        <span className="text-lg font-semibold">Messages</span>
                    </Link>
                    <Link href="/profile" className={buttonVariants({ variant: 'ghost', size: "lg", class: 'justify-start w-fit gap-4' })}>
                        <User />
                        <span className="text-lg font-semibold">Profile</span>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "lg", class: "justify-start w-fit gap-4" })}>
                            <MoreHorizontal />
                            <span className="text-lg font-semibold">More</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80" align="start">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className={buttonVariants({ variant: "ghost", className: "!rounded-none justify-between !font-semibold" })}>
                                        Settings and Support
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Link href="/settings/account" className={buttonVariants({ variant: "ghost", className: "!rounded-none gap-2 !justify-start w-full" })}>
                                            <Settings size={20} />
                                            <span className="font-semibold">Settings and privacy</span>
                                        </Link>
                                        <Dialog>
                                            <DialogTrigger className={buttonVariants({ variant: "ghost", className: "!rounded-none gap-2 !justify-start w-full" })}>
                                                <PenSquare size={20} />
                                                <span className="font-semibold">Display</span>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader className="gap-4">
                                                    <DialogTitle className="text-xl text-center">Customize your view</DialogTitle>
                                                    <DialogDescription className="text-center">
                                                        This settings affect all the <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground">social-media</span> accounts on this browser.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogHeader className="gap-4">
                                                    <DialogHeader>
                                                        <DialogDescription>Color</DialogDescription>
                                                        <Card>
                                                            <CardContent className="flex justify-between px-0 py-0 !p-2">
                                                                <Button type="button" variant={"ghost"} className="flex-grow">blue</Button>
                                                                <Button type="button" variant={"ghost"} className="flex-grow">blue</Button>
                                                                <Button type="button" variant={"ghost"} className="flex-grow">blue</Button>
                                                            </CardContent>
                                                        </Card>
                                                    </DialogHeader>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog>
                        <DialogTrigger className={buttonVariants({ variant: 'default' })}>
                            Post
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <Button type="button" variant={'secondary'} className="w-fit">Draft</Button>
                            </DialogHeader>
                            <DialogDescription>
                                <ReactTextareaAutosize placeholder="What is happening?!" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" rows={3} maxRows={8} />
                            </DialogDescription>
                            <DialogFooter>
                                <Button type="button">Post</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
            <div className="flex">
                <DropdownMenu>
                    <DropdownMenuTrigger className={buttonVariants({ variant: "default" })}>
                        username
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full" align="start">
                        <DropdownMenuItem>Add an existing account</DropdownMenuItem>
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </>
}