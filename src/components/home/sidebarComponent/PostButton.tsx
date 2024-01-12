import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FC } from "react";
import PostCard from "../main/TweetCard";

const PostButton: FC = () => {
    return (
        <Dialog>
            <DialogTrigger className={buttonVariants({ variant: 'default' })}>
                Post
            </DialogTrigger>
            <DialogContent className="p-0 pt-12">
                <PostCard />
            </DialogContent>
        </Dialog>
    )
}

export default PostButton