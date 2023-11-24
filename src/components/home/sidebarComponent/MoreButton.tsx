import { buttonVariants } from '@/components/ui/button'
import { MoreHorizontal, Settings } from 'lucide-react'
import { FC } from 'react'
import DisplayDialog from './DisplayDialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

interface Props { }


const MoreButton: FC = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "lg", class: "justify-start w-fit gap-4" })}>
                <MoreHorizontal />
                <span className="text-lg font-semibold">More</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="start">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className={buttonVariants({ variant: "ghost", className: "!rounded-none justify-between !font-semibold" })}>
                            Settings and Support
                        </AccordionTrigger>
                        <AccordionContent>
                            <Link href="/settings/account" className={buttonVariants({ variant: "ghost", className: "!rounded-none gap-2 !justify-start w-full" })}>
                                <Settings size={20} />
                                <span className="font-semibold">Settings and privacy</span>
                            </Link>
                            <DisplayDialog />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default MoreButton