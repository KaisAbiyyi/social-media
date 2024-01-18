import { FC } from "react";

interface TweetPageProps {
    params: {
        tweetId: string
    }
}

const TweetPage: FC<TweetPageProps> = ({ params }) => {
    return (<h1>{params.tweetId}</h1>);
}

export default TweetPage;