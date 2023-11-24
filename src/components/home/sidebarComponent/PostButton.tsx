import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import ReactTextareaAutosize from 'react-textarea-autosize'
import { FC } from "react";

const PostButton: FC = () => {
    return (
        <Dialog>
            <DialogTrigger className={buttonVariants({ variant: 'default' })}>
                Post
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <Button type="button" variant={'secondary'} className="w-fit">Draft</Button>
                </DialogHeader>
                <DialogDescription>
                    <ReactTextareaAutosize placeholder="What is happening?!" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" rows={3} maxRows={8} />
                </DialogDescription>
                <DialogFooter>
                    <Button type="button">Post</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PostButton