import { Input } from "../ui/input";
import WhatsHappeningCard from "./asideComponents/WhatsHappeningCard";
import WhoToFollowCard from './asideComponents/WhoToFollowCard';

export default function MainAside() {
    return <>
        <div className="flex flex-col flex-grow gap-6">
            <Input type="search" placeholder="Search" />
            <WhatsHappeningCard />
            <WhoToFollowCard />
        </div>
    </>
}