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
import SpinnerLoader from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { UploadButton } from "@/utils/uploadthing";
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
    newBio: z.string(),
    newImg: z.string()
})


const EditProfileDialog: FC<EditProfileDialogProps> = ({ name, username, bio, image }) => {
    const { toast } = useToast()
    const [open, setOpen] = useState<boolean>(false)
    const queryClient = useQueryClient()
    const router = useRouter()
    const [imgUrl, setImgUrl] = useState<string>(image as string)
    const [users, setUsers] = useState<z.infer<typeof formSchema>>({ newName: name, newBio: bio ?? "", newImg: imgUrl })
    const [uploadLoading, setUploadLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: users,
    })

    const { mutate: handleSubmit, isPending } = useMutation({
        mutationFn: async ({ newName, newBio, newImg }: z.infer<typeof formSchema>) => await axios.post(`/api/profile/${username}`, { newName, newBio, newImg }),
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
                    <CardHeader className="flex flex-col gap-2 items-center">

                        <UploadButton
                            appearance={{
                                button: "h-full w-full bg-transparent rounded-full"
                            }}
                            content={{
                                button({ ready }) {
                                    if (ready) return (
                                        <Avatar className="w-20 h-20">
                                            <AvatarImage src={imgUrl} />
                                            <AvatarFallback>{name.at(0)?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    )
                                    return <SpinnerLoader />
                                }
                            }}
                            endpoint="profilePicture"
                            onClientUploadComplete={(res) => {
                                setImgUrl(res[0].url)
                                setUploadLoading(false)
                            }}
                            onUploadProgress={() => setUploadLoading(true)}
                            onUploadError={(error: Error) => {
                                toast({
                                    title: "Something went wrong",
                                    description: error.message
                                })
                            }} />
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow p-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(async (values: z.infer<typeof formSchema>) => handleSubmit({ newName: values.newName, newBio: values.newBio, newImg: imgUrl }))} className="space-y-8">
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
                                    <Button type="submit" disabled={uploadLoading} className="px-6 flex gap-2" >Save</Button>
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