"use client"

import { tweetsType } from "@/app/api/tweet/route";
import Tweet from "@/components/home/main/Tweet";
import TweetsListSkeleton from "@/components/home/main/components/TweetsListSkeleton";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";

interface TweetPageProps {
    params: {
        tweetId: string
    }
}


const TweetPage: FC<TweetPageProps> = ({ params }) => {
    const { data, isPending } = useQuery({
        queryKey: ["getTweetDetail"],
        queryFn: async () => {
            const { data } = await axios.get(`/api/tweet/${params.tweetId}`)
            return data.data
        }
    })
    console.log(data)

    return (
        <div className="flex flex-col gap-4">
            {isPending ?
                <TweetsListSkeleton /> :
                <Card>
                    <Tweet queryKey="getTweetDetail" tweet={data.tweet} />
                </Card>
            }
        </div>
    );
}

export default TweetPage;