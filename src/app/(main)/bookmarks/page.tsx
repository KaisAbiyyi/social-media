"use client"

import TweetsList from "@/components/home/main/TweetsList";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import SpinnerLoader from "@/components/ui/spinner";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC } from "react";


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
                <div className="flex justify-center">
                    <SpinnerLoader />
                </div> :
                BookmarksData.length > 0 ?
                    <TweetsList data={BookmarksData} queryKey="getBookmarks" /> :
                    <CardHeader className="mx-auto">
                        <CardTitle className="text-center">Save Posts for Later</CardTitle>
                        <CardDescription>Bookmark posts to easily find them again in the future</CardDescription>
                    </CardHeader>
            }
        </div>
    );
}

export default BookmarksPage;