import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PencilLine } from "lucide-react";
import { FC } from "react";

interface QuoteButtonProps {
    userId: string;
    tweetId: string;
}

const QuoteButton: FC<QuoteButtonProps> = ({ userId, tweetId }) => {
    return (
        <Dialog>
            <DialogTrigger className="p-2 flex items-center gap-2 relative cursor-pointer w-full hover:bg-accent select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <PencilLine size={16} />
                <span>Quote</span>
            </DialogTrigger>
            <DialogContent className="p-0 pt-12">
                
            </DialogContent>
        </Dialog>

    );
}

export default QuoteButton;