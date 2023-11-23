"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ReactTextareaAutosize from "react-textarea-autosize";

export default function HomePage() {
    return <>
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Home</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <div className="flex">
                    <CardHeader className="p-4">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </CardHeader>
                    <CardContent className="flex-grow p-4">
                        <ReactTextareaAutosize placeholder="What is happening?!" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" rows={3} maxRows={8} />
                    </CardContent>
                </div>
                <CardFooter className="justify-end p-4">
                    <Button>Post</Button>
                </CardFooter>
            </Card>
        </div>
    </>
}