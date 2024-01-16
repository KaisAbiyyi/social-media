import { Input } from "../ui/input";
import WhatsHappeningCard from "./asideComponents/WhatsHappeningCard";
import WhoToFollowCard from './asideComponents/WhoToFollowCard';

export default function MainAside() {
    return <>
        <div className="flex flex-col gap-4 flex-grow sticky top-4 right-0">
            <Input type="search" placeholder="Search" />
            <WhatsHappeningCard />
            <WhoToFollowCard />
        </div>
    </>
}