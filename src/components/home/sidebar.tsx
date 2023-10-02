"use client"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button, buttonVariants } from "../ui/button";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { Textarea } from "../ui/textarea";
import Link from "next/link";

export default function MainSidebar() {
    const router = useRouter()
    return <>
        <div className="flex flex-col flex-grow gap-6">
            <Card>
                <CardHeader>
                    <Link href="/home" className={buttonVariants({ variant: 'ghost', class: 'justify-start w-fit' })}>socal-media</Link>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Link href="/home" className={buttonVariants({ variant: 'ghost', class: 'justify-start w-fit' })}>Home</Link>
                    <Link href="/home" className={buttonVariants({ variant: 'ghost', class: 'justify-start w-fit' })}>Explore</Link>
                    <Link href="/home" className={buttonVariants({ variant: 'ghost', class: 'justify-start w-fit' })}>Notifications</Link>
                    <Link href="/home" className={buttonVariants({ variant: 'ghost', class: 'justify-start w-fit' })}>Messages</Link>
                    <Link href="/home" className={buttonVariants({ variant: 'ghost', class: 'justify-start w-fit' })}>Profile</Link>
                    <Dialog>
                        <DialogTrigger className={buttonVariants({ variant: 'default' })}>
                            Post
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <Button type="button" variant={'secondary'} className="w-fit">Draft</Button>
                            </DialogHeader>
                            <DialogDescription>
                                <Textarea />
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
                    <DropdownMenuContent className="w-full">
                        <DropdownMenuItem>Add an existing account</DropdownMenuItem>
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </>
}