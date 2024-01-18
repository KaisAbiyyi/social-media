"use client"

import { tweetsType } from "@/app/api/tweet/route";
import {
    Card
} from "@/components/ui/card";
import { FC, useEffect, useState } from "react";
import Tweet from "./Tweet";

type TweetsListType = {
    data: tweetsType[],
    queryKey: string;
}

const TweetsList: FC<TweetsListType> = ({ data, queryKey }) => {
    const [tweets, setTweets] = useState<tweetsType[]>(data)
    const [key, setKey] = useState<string>(queryKey)

    useEffect(() => {
        setTweets(data)
    }, [data])
    useEffect(() => {
        setKey(queryKey)
    }, [queryKey])

    return (<>
        {tweets.length > 0 &&
            <Card className="overflow-hidden">
                {tweets.map((tweet: tweetsType, index: number, array: tweetsType[]) => (
                    <Tweet tweet={tweet} index={index} array={array} queryKey={queryKey} key={tweet.id}/>
                ))}
            </Card >
        }
    </>)
}

export default TweetsList;  