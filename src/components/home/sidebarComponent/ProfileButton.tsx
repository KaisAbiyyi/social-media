"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
export default function ProfileButton() {
    const { data, status } = useSession()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "default", className: "lg:w-full w-fit !p-2 justify-between" })}>
                <div className="flex gap-4 items-center">
                    <Avatar>
                        <AvatarImage src={data?.user.image ?? ''} />
                        <AvatarFallback>{data?.user.name?.at(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="lg:flex-col text-start hidden lg:flex">
                        <h1 className="text-lg font-semibold">{data?.user?.name}</h1>
                        <span className="text-sm opacity-80">{data?.user.username}</span>
                    </div>
                </div>
                <MoreHorizontal className="hidden lg:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full" align="start">
                <DropdownMenuItem>Add an existing account</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}