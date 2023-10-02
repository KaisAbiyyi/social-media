import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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
                        <Textarea placeholder="What is happening?!"></Textarea>
                    </CardContent>
                </div>
                <CardFooter className="justify-end p-4">
                    <Button>Post</Button>
                </CardFooter>
            </Card>
        </div>
    </>
}