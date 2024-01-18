"use client"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { FC } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import TweetsList from "@/components/home/main/TweetsList";


interface BookmarksPageProps {

}

const BookmarksPage: FC<BookmarksPageProps> = () => {
    const { data: User, status } = useSession()
    const { toast } = useToast()
    const { data: BookmarksData, isPending: BookmarksPending, isError } = useQuery({
        queryKey: ["getBookmarks"],
        queryFn: async () => {
            const { data } = await axios.get(`/api/bookmarks`)
            return data.data
        }
    })

    if (isError) {
        toast({
            title: "Something went wrong",
            description: "There was some error when fetching the data",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
            variant: "destructive",
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <Card className="flex justify-between">
                <CardHeader>
                    <CardTitle>Bookmarks</CardTitle>
                    <CardDescription>@{User?.user.username}</CardDescription>
                </CardHeader>
                <CardFooter>
                    <DropdownMenu>
                        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "sm" })}>
                            <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardFooter>
            </Card>
            {BookmarksPending ?
                "loading..." :
                <TweetsList data={BookmarksData} queryKey="getBookmarks" />
            }
        </div>
    );
}

export default BookmarksPage;