"use client"

import PostCard from "@/components/home/main/TweetCard";
import PostsList from "@/components/home/main/TweetsList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
    return <>
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Home</CardTitle>
                </CardHeader>
            </Card>
            <PostCard />
            <PostsList/>
        </div>
    </>
}