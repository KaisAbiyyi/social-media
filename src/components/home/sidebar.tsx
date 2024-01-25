"use client"
import { Card, CardContent, CardHeader } from "../ui/card";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { Bell, Bookmark, Home, Mail, Search, User } from "lucide-react";
import ProfileButton from "./sidebarComponent/ProfileButton";
import PostButton from "./sidebarComponent/PostButton";
import MoreButton from "./sidebarComponent/MoreButton";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function MainSidebar() {
    const { data: session } = useSession()
    const router = usePathname()
    return <>
        <div className="flex flex-col gap-8 sticky top-4 left-0">
            <Card className="w-fit lg:w-full">
                <CardHeader className="p-0 w-fit lg:w-full">
                    <Link href="/home" className={buttonVariants({ variant: 'ghost', className: '!text-lg !justify-start rounded-b-none font-semibold' })}>
                        <span className="hidden lg:block">social-media</span>
                        <span className="lg:hidden block">sm</span>
                    </Link>
                </CardHeader>
                <CardContent className="flex flex-col w-full lg:w-full gap-0 px-0 py-0">
                    <Link href="/home" className={buttonVariants({ variant: 'ghost', size: "lg", className: '!justify-start gap-4 !rounded-none py-6' })}>
                        <Home />
                        <span className="text-lg font-semibold hidden lg:block">Home</span>
                    </Link>
                    <Link href="/explore" className={buttonVariants({ variant: 'ghost', size: "lg", className: '!justify-start gap-4 !rounded-none py-6' })}>
                        <Search />
                        <span className="text-lg font-semibold hidden lg:block">Explore</span>
                    </Link>
                    <Link href="/notifications" className={buttonVariants({ variant: 'ghost', size: "lg", className: '!justify-start gap-4 !rounded-none py-6' })}>
                        <Bell />
                        <span className="text-lg font-semibold hidden lg:block">Notifications</span>
                    </Link>
                    <Link href="/messages" className={buttonVariants({ variant: 'ghost', size: "lg", className: '!justify-start gap-4 !rounded-none py-6' })}>
                        <Mail />
                        <span className="text-lg font-semibold hidden lg:block">Messages</span>
                    </Link>
                    <Link href="/bookmarks" className={buttonVariants({ variant: 'ghost', size: "lg", className: '!justify-start gap-4 !rounded-none py-6' })}>
                        <Bookmark />
                        <span className="text-lg font-semibold hidden lg:block">Bookmarks</span>
                    </Link>
                    <a href={`/profile/${session?.user.username}`} className={buttonVariants({ variant: 'ghost', size: "lg", className: '!justify-start gap-4 !rounded-none py-6' })}>
                        <User />
                        <span className="text-lg font-semibold hidden lg:block">Profile</span>
                    </a>
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