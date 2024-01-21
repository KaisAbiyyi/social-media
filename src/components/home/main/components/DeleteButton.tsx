"use client"

import { ProfileType } from "@/app/api/profile/[username]/route";
import { tweetsType } from "@/app/api/tweet/route";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface DeleteButtonProps {
    id: string;
    queryKey: string
}

const DeleteButton: FC<DeleteButtonProps> = ({ id, queryKey }) => {
    const queryClient = useQueryClient()
    const [key, setKey] = useState<string>(queryKey)
    const { toast } = useToast()

    useEffect(() => {
        setKey(queryKey)
    }, [queryKey])

    const { mutate: HandleDelete, isPending } = useMutation({
        mutationFn: async ({ id }: { id: string }) => await axios.delete(`/api/tweet/${id}`),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: [key] })
            if (key === "getProfile" || key ==="getTweetProfile") {
                const previousData = queryClient.getQueryData<ProfileType>([key])
                queryClient.setQueryData([key], {
                    ...previousData,
                    tweet: (previousData as ProfileType)?.tweet?.filter((item: tweetsType) => item.id !== id)
                } as ProfileType)
                return { previousData }
            } else {
                const previousData = queryClient.getQueryData<tweetsType[]>([key])
                queryClient.setQueryData([key], previousData?.filter((item: tweetsType) => item.id !== id))
                return { previousData }
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [key] })
        },
        onError: (error, _, context) => {
            queryClient.setQueryData([key], () => context?.previousData);
            toast({
                title: "Something went wrong",
                description: "There was some error when deleteing the data",
                action: <ToastAction onClick={() => HandleDelete} altText="Try again">Try again</ToastAction>,
                variant: "destructive",
            })
        }
    })

    return (
        <DropdownMenuItem onClick={() => HandleDelete({ id })} className="font-semibold flex gap-2 text-red-500">
            <Trash size={16} />
            <span>Delete</span>
        </DropdownMenuItem>
    );
}

export default DeleteButton;