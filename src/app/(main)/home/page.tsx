
import PostCard from "@/components/home/main/TweetCard";
import TweetsList from "@/components/home/main/TweetsList";

export default function HomePage() {
    return <>
        <div className="flex flex-col gap-4">
            <PostCard />
            <TweetsList />
        </div>
    </>
}