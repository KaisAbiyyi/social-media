import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PenSquare } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'

const DisplayDialog = () => {
    const { setTheme, theme, themes } = useTheme()

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
                    <RadioGroup defaultValue={theme} className='flex flex-col gap-4 w-full'>
                        <DialogHeader>
                            <DialogDescription>Light Mode</DialogDescription>
                            <Card className='overflow-hidden'>
                                <CardContent className="flex justify-between flex-wrap px-0 py-0 !p-2 bg-slate-100 text-slate-900">
                                    <div className="flex items-center flex-grow gap-4 p-4 lightRed">
                                        <RadioGroupItem value="lightRed" id="option-lightRed" onClick={() => setTheme('lightRed')} />
                                        <Label htmlFor="option-lightRed">Red</Label>
                                    </div>
                                    <div className="flex items-center flex-grow gap-4 p-4">
                                        <RadioGroupItem value="lightViolet" id="option-lightViolet" onClick={() => setTheme('lightViolet')} />
                                        <Label htmlFor="option-lightViolet">Violet</Label>
                                    </div>
                                    <div className="flex items-center flex-grow gap-4 p-4 lightBlue">
                                        <RadioGroupItem value="lightBlue" id="option-lightBlue" onClick={() => setTheme('lightBlue')} />
                                        <Label htmlFor="option-lightBlue">Blue</Label>
                                    </div>
                                    <div className="flex items-center flex-grow gap-4 p-4 lightGreen">
                                        <RadioGroupItem value="lightGreen" id="option-lightGreen" onClick={() => setTheme('lightGreen')} />
                                        <Label htmlFor="option-lightGreen">Green</Label>
                                    </div>
                                    <div className="flex items-center flex-grow gap-4 p-4 lightOrange">
                                        <RadioGroupItem value="lightOrange" id="option-lightOrange" onClick={() => setTheme('lightOrange')} />
                                        <Label htmlFor="option-lightOrange">Orange</Label>
                                    </div>
                                    <div className="flex items-center flex-grow gap-4 p-4 lightYellow">
                                        <RadioGroupItem value="lightYellow" id="option-lightYellow" onClick={() => setTheme('lightYellow')} />
                                        <Label htmlFor="option-lightYellow">Yellow</Label>
                                    </div>
                                </CardContent>
                            </Card>
                        </DialogHeader>
                        <DialogHeader>
                            <DialogDescription>Dark Mode</DialogDescription>
                            <Card className='overflow-hidden'>
                                <CardContent className="flex justify-between px-0 py-0 !p-2 bg-slate-900 text-slate-100">
                                    <div className="flex items-center flex-grow gap-4 p-4 darkRed">
                                        <RadioGroupItem value="darkRed" id="option-darkRed" onClick={() => { setTheme('darkRed') }} />
                                        <Label htmlFor="option-darkRed">Red</Label>
                                    </div>
                                    <div className="flex items-center flex-grow gap-4 p-4 darkViolet">
                                        <RadioGroupItem value="darkViolet" id="option-darkViolet" onClick={() => setTheme('darkViolet')} />
                                        <Label htmlFor="option-darkViolet">Violet</Label>
                                    </div>
                                    <div className="flex items-center flex-grow gap-4 p-4 darkBlue">
                                        <RadioGroupItem value="darkBlue" id="option-darkBlue" onClick={() => setTheme('darkBlue')} />
                                        <Label htmlFor="option-darkBlue">Blue</Label>
                                    </div>
                                    <div className="flex items-center flex-grow gap-4 p-4 darkGreen">
                                        <RadioGroupItem value="darkGreen" id="option-darkGreen" onClick={() => setTheme('darkGreen')} />
                                        <Label htmlFor="option-darkGreen">Green</Label>
                                    </div>
                                    <div className="flex items-center flex-grow gap-4 p-4 darkOrange">
                                        <RadioGroupItem value="darkOrange" id="option-darkOrange" onClick={() => setTheme('darkOrange')} />
                                        <Label htmlFor="option-darkOrange">Orange</Label>
                                    </div>
                                    <div className="flex items-center flex-grow gap-4 p-4 darkYellow">
                                        <RadioGroupItem value="darkYellow" id="option-darkYellow" onClick={() => setTheme('darkYellow')} />
                                        <Label htmlFor="option-darkYellow">Yellow</Label>
                                    </div>
                                </CardContent>
                            </Card>
                        </DialogHeader>
                    </RadioGroup>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default DisplayDialog