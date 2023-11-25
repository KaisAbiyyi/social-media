"use client"

import { FC, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { signIn } from "next-auth/react";
import { Separator } from "../ui/separator";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";

const formSchema = z.object({
    email: z.string().min(1, {
        message: "Email cannot null.",
    }).email(),
    password: z.string().min(1, {
        message: "Password cannot null.",
    }),
})

const SignInDialog: FC = () => {
    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: '',
        },
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={buttonVariants({ variant: "outline" })}>Sign in</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="px-2 py-1 rounded-full font-bold bg-primary w-fit">social-media</DialogTitle>
                </DialogHeader>
                <DialogHeader>
                    <div className="flex flex-col gap-4 mt-6">
                        <DialogTitle className="text-xl">Sign in to social-media</DialogTitle>
                        <Button type="button" variant={"secondary"} onClick={() => signIn("google", { callbackUrl: "/home" })}>Google Sign in</Button>
                        <Button type="button" variant={"secondary"} onClick={() => signIn("github", { callbackUrl: "/home" })}>Github Sign in</Button>
                        <Separator />
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(async (values: z.infer<typeof formSchema>) => {
                                const login = await signIn("credentials", { email: values.email, password: values.password, redirect: false })
                                if (login?.ok) {
                                    router.push('/home')
                                } else {
                                    toast({
                                        title: "Something went wrong",
                                        description: "Email or password incorrect",
                                        action: <ToastAction altText="Try again">Try again</ToastAction>,
                                        variant: "destructive",
                                    })

                                }
                            })} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Enter your email here..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter your password here..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" >Sign in with credentials</Button>
                            </form>
                        </Form>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default SignInDialog