"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
export default function ProfileButton() {
    const { data, status } = useSession()
    const location = usePathname()
    const [username, setUsername] = useState<string>(data?.user.username as string)
    useEffect(() => {
        if (location.startsWith("/profile")) {
            const pathSplitted = location.split("/")
            setUsername(pathSplitted[2])
        }
    }, [location])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "default", className: "w-full justify-between" })}>
                <div className="flex gap-4 items-center">
                    <Avatar>
                        <AvatarImage src={data?.user.image ?? ''} />
                        <AvatarFallback>{data?.user.name?.at(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-start">
                        <h1 className="text-lg font-semibold">{data?.user?.name}</h1>
                        <span className="text-sm opacity-80">{username}</span>
                    </div>
                </div>
                <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full" align="start">
                <DropdownMenuItem>Add an existing account</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}