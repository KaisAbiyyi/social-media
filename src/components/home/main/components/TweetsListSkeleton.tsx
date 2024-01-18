import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

const TweetsListSkeleton: FC = () => {
    return (
        <Card className="flex">
            <CardHeader className="p-4">
                <Skeleton className="w-10 h-10 rounded-full" />
            </CardHeader>
            <CardContent className="p-0 flex flex-col flex-grow">
                <CardHeader className="flex flex-row space-y-0 px-4 py-4 !items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <Skeleton className="w-32 h-6" />
                        <Skeleton className="w-28 h-4" />
                    </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col gap-2">
                    <Skeleton className="w-33 h-4" />
                    <Skeleton className="w-33 h-4" />
                    <Skeleton className="w-33 h-4" />
                </CardContent>
            </CardContent>
        </Card>
    );
}

export default TweetsListSkeleton;