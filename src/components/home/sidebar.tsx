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
import ProfileButton from "./sidebarComponent/ProfileButton";
import PostButton from "./sidebarComponent/PostButton";
import MoreButton from "./sidebarComponent/MoreButton";

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
                    <MoreButton />
                    <PostButton />
                </CardContent>
            </Card>
            <div className="flex">
                <ProfileButton />
            </div>
        </div>
    </>
}