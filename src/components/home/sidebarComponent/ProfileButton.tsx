"use client"

import { buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
export default function ProfileButton() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "default" })}>
                username
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full" align="start">
                <DropdownMenuItem>Add an existing account</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}