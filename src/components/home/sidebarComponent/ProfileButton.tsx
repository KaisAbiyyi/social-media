"use client"

import { buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ProfileButton() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "default" })}>
                username
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full" align="start">
                <DropdownMenuItem>Add an existing account</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}