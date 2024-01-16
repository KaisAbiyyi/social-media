
"use client"

import TweetCard from "@/components/home/main/TweetCard";
import TweetsList from "@/components/home/main/TweetsList";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function HomePage() {
    const { toast } = useToast()
    const { data, isPending, isError } = useQuery({
        queryKey: ["getTweets"],
        queryFn: async () => {
            const { data } = await axios.get("/api/tweet");
            return data.data
        },
    })

    if (isError) {
        toast({
            title: "Something went wrong",
            description: "There was some error when fetching the data",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
            variant: "destructive",
        })
    }

    return <>
        <div className="flex flex-col gap-4">
            <TweetCard />
            {isPending ?
                'loading' :
                <TweetsList data={data} queryKey="getTweets" />
            }
        </div>
    </>
}