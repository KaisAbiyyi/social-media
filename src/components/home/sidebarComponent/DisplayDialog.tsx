import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PenSquare } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'

interface Props { }

const DisplayDialog = () => {
    const { setTheme, theme } = useTheme()
    return (
        <Dialog>
            <DialogTrigger className={buttonVariants({ variant: "ghost", className: "!rounded-none gap-2 !justify-start w-full" })}>
                <PenSquare size={20} />
                <span className="font-semibold">Display</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="gap-4">
                    <DialogTitle className="text-xl text-center">Customize your view</DialogTitle>
                    <DialogDescription className="text-center">
                        This settings affect all the <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground">social-media</span> accounts on this browser.
                    </DialogDescription>
                </DialogHeader>
                <DialogHeader className="gap-4">
                    <DialogHeader>
                        <DialogDescription>Color</DialogDescription>
                        <Card>
                            <CardContent className="flex justify-between px-0 py-0 !p-2">
                                <RadioGroup defaultValue={theme} className='flex flex-row w-full'>
                                    <div className="flex items-center flex-grow gap-4 p-4">
                                        <RadioGroupItem value="light" id="option-one" onClick={() => setTheme('light')} />
                                        <Label htmlFor="option-one">Default</Label>
                                    </div>
                                    <div className="flex items-center flex-grow gap-4 p-4">
                                        <RadioGroupItem value="dark" id="option-two" onClick={() => setTheme('dark')} />
                                        <Label htmlFor="option-two">Dark</Label>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    </DialogHeader>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default DisplayDialog