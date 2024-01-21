import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FC } from "react";
import TweetCard from "../main/TweetCard";
import { Plus } from "lucide-react";

const PostButton: FC = () => {
    return (
        <Dialog>
            <DialogTrigger className={buttonVariants({ variant: 'default', className: "!rounded-t-none flex gap-4" })}>
                <Plus  className="lg:hidden"/>
                <span className="hidden lg:block">Post</span>
            </DialogTrigger>
            <DialogContent className="p-0 pt-12 bg-secondary">
                <TweetCard />
            </DialogContent>
        </Dialog>
    )
}

export default PostButton