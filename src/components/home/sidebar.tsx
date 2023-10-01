"use client"

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MainSidebar() {
    const router = useRouter()
    return <>
        <div className="flex flex-col flex-grow gap-6">
            <Card>
                <CardHeader>
                    <Button type="button" variant={"ghost"} className="justify-start w-fit" onClick={() => router.push('/home')}>social-media</Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Button type="button" variant={"ghost"} className="justify-start w-fit" onClick={() => router.push('/home')}>Home</Button>
                    <Button type="button" variant={"ghost"} className="justify-start w-fit" onClick={() => router.push('/explore')}>Explore</Button>
                    <Button type="button" variant={"ghost"} className="justify-start w-fit" onClick={() => router.push('/notifications')}>Notifications</Button>
                    <Button type="button" variant={"ghost"} className="justify-start w-fit" onClick={() => router.push('/messages')}>Messages</Button>
                    <Button type="button" variant={"ghost"} className="justify-start w-fit" onClick={() => router.push('/profile')}>Profile</Button>
                    <Button type="button" variant={"default"} onClick={() => router.push('/home')}>Post</Button>
                </CardContent>
            </Card>
            <div className="flex">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant={"default"} type="button">username</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <DropdownMenuItem>Add an existing account</DropdownMenuItem>
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </>
}