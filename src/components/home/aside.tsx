import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { buttonVariants } from "../ui/button";

export default function MainAside() {
    return <>
        <div className="flex flex-col flex-grow gap-6">
            <Input type="search" />
            <Card>
                <CardHeader>
                    <CardTitle>What's happening</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Link href={'/'} className={buttonVariants({ variant: 'ghost', class: 'px-0 py-0 mx-0 my-0 justify-start w-full' })}>
                        <Card className="w-full m-0">
                            keren
                        </Card>
                    </Link>
                </CardContent>
            </Card>
        </div>
    </>
}