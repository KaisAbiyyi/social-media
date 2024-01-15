"use client"
import { Card, CardContent, CardHeader } from "../ui/card";
import { buttonVariants } from "../ui/button";


import Link from "next/link";
import { Bell, Home, Mail, Search, User } from "lucide-react";
import ProfileButton from "./sidebarComponent/ProfileButton";
import PostButton from "./sidebarComponent/PostButton";
import MoreButton from "./sidebarComponent/MoreButton";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function MainSidebar() {
    const { data: session } = useSession()
    const router = usePathname()
    return <>
        <div className="flex flex-col gap-6 sticky top-4 left-0">
            <Card>
                <CardHeader className="p-4">
                    <Link href="/home" className={buttonVariants({ variant: 'default', class: 'justify-start w-fit !text-lg font-semibold' })}>socal-media</Link>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 px-2 py-4">
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
                    <Link href={`/${session?.user.username}`} className={buttonVariants({ variant: 'ghost', size: "lg", class: 'justify-start w-fit gap-4' })}>
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