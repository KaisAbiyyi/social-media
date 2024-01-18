import { ProfileType } from "@/app/api/profile/[username]/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface EditProfileDialogProps {
    name: string;
    username?: string;
    bio?: string;
    image?: string;
}

const formSchema = z.object({
    newName: z.string().min(1, {
        message: "Name cannot null.",
    }),
    newBio: z.string()

})


const EditProfileDialog: FC<EditProfileDialogProps> = ({ name, username, bio, image }) => {
    const { toast } = useToast()
    const [open, setOpen] = useState<boolean>(false)
    const queryClient = useQueryClient()
    const router = useRouter()
    const [users, setUsers] = useState<object>({ newName: name, newBio: bio ?? "" })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: users,
    })

    const { mutate: handleSubmit, isPending } = useMutation({
        mutationFn: async ({ newName, newBio }: z.infer<typeof formSchema>) => await axios.post(`/api/profile/${username}`, { newName, newBio }),
        onMutate: async ({ newName, newBio }: z.infer<typeof formSchema>) => {
            await queryClient.cancelQueries({ queryKey: ["getProfile"] })
            const previousData = queryClient.getQueryData<ProfileType>(["getProfile"])
            queryClient.setQueryData(["getProfile"], {
                ...previousData,
                name: newName,
                bio: newBio,
            } as ProfileType)
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
            queryClient.invalidateQueries({ queryKey: ["getProfile"] })
            router.push(`/profile/${data?.data.data.username}`)
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
                            <form onSubmit={form.handleSubmit(async (values: z.infer<typeof formSchema>) => handleSubmit({ newName: values.newName, newBio: values.newBio }))} className="space-y-8">
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
        </Dialog >
    );
}

export default EditProfileDialog;