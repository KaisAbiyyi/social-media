"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import SpinnerLoader from "../ui/spinner";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";
import { CredentialLoginValidator, CredentialPayload } from "@/lib/validators/CredentialLoginValidator";



const SignInDialog: FC = () => {
    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()
    const form = useForm<CredentialPayload>({
        resolver: zodResolver(CredentialLoginValidator),
        defaultValues: {
            email: "",
            password: '',
        },
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={buttonVariants({ variant: "outline" })}>Sign in</DialogTrigger>
            <DialogContent className="p-0 pt-12 bg-secondary">
                <Card>
                    <CardHeader>
                        <DialogTitle className="px-2 py-1 rounded-full font-bold bg-primary w-fit">social-media</DialogTitle>
                    </CardHeader>
                    <CardContent className="mb-0">
                        <div className="flex flex-col gap-4 mt-6">
                            <DialogTitle className="text-xl">Sign in to social-media</DialogTitle>
                            <div className="flex gap-4">
                                <Button type="button" variant={"secondary"} className="w-1/2" onClick={() => signIn("google", { callbackUrl: "/home" })}>Google Sign in</Button>
                                <Button type="button" variant={"secondary"} className="w-1/2" onClick={() => signIn("github", { callbackUrl: "/home" })}>Github Sign in</Button>
                            </div>
                            <Separator />
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(async (values: CredentialPayload) => {
                                    try {
                                        setIsLoading(true)
                                        const login = await signIn("credentials", { email: values.email, password: values.password, redirect: false })
                                        if (login?.ok) {
                                            router.push('/home')
                                        }
                                    } catch (error) {
                                        console.log(error)
                                        toast({
                                            title: "Something went wrong",
                                            description: "Email or password incorrect",
                                            action: <ToastAction altText="Try again">Try again</ToastAction>,
                                            variant: "destructive",
                                        })
                                    } finally {
                                        setIsLoading(false)
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
                                    <Button type="submit" className="w-full flex gap-2" disabled={isLoading}>Sign in with credentials {isLoading ? <SpinnerLoader /> : ""}</Button>
                                </form>
                            </Form>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}

export default SignInDialog