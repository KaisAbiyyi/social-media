import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import { FC, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ToastAction } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ProfileType } from "@/app/api/profile/[username]/route";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

interface EditProfileDialogProps {
    name: string;
    username?: string;
    bio?: string;
    image?: string
}

const formSchema = z.object({
    newName: z.string().min(1, {
        message: "Name cannot null.",
    }),
    newUsername: z.string().min(1, {
        message: "Username cannot null.",
    }),
    newBio: z.string()

})


const EditProfileDialog: FC<EditProfileDialogProps> = ({ name, username, bio, image }) => {
    const { toast } = useToast()
    const [open, setOpen] = useState<boolean>(false)
    const queryClient = useQueryClient()
    const router = useRouter()
    const [users, setUsers] = useState<object>({ newName: name, newUsername: username, newBio: bio ?? "" })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: users,
    })

    const { mutate: handleSubmit, isPending } = useMutation({
        mutationFn: async ({ newName, newUsername, newBio }: z.infer<typeof formSchema>) => await axios.post(`/api/profile/${username}`, { newName, newUsername, newBio }),
        onMutate: async ({ newName, newUsername, newBio }: z.infer<typeof formSchema>) => {
            await queryClient.cancelQueries({ queryKey: ["getProfile"] })
            const previousData = queryClient.getQueryData<ProfileType>(["getProfile"])
            queryClient.setQueryData(["getProfile"], {
                bio: newBio,
                username: newUsername,
                name: newName,
                ...previousData
            })
            setOpen(false)
            return { previousData }
        },
        onError: (error, _, context) => {
            queryClient.setQueryData(["getProfile"], () => context?.previousData);
            toast({
                title: "Something went wrong",
                description: "There was some error when fetching the data",
                variant: "destructive",
            })
        },
        onSettled: (data) => {
            router.replace(`/profile/${data?.data.data.username}`)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={buttonVariants({ variant: "outline" })}>Edit Profile </DialogTrigger>
            <DialogContent className="p-0 pt-12">
                <Card className="flex">
                    <CardHeader>
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={image} />
                            <AvatarFallback>{name.at(0)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow p-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(async (values: z.infer<typeof formSchema>) => handleSubmit({ newUsername: values.newUsername, newName: values.newName, newBio: values.newBio }))} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="newName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Enter your name here..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="newUsername"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Enter your username here..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="newBio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter your bio here..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end">
                                    <Button type="submit" className="px-6 flex gap-2" >Save</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}

export default EditProfileDialog;