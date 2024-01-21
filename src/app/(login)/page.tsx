"use client"

import SignInDialog from "@/components/auth/SignInDialog"
import SignUpDialog from "@/components/auth/SignUpDialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { signIn, useSession } from "next-auth/react"

export default function LoginPage() {

  return <>
    <div className="flex flex-col md:flex-row container mx-auto h-screen items-center">
      <div className="flex-grow flex items-center justify-center">
        <span className="bg-primary text-primary-foreground text-3xl font-semibold lg:text-5xl py-4 px-8 rounded-full">social-media</span>
      </div>
      <div className="flex flex-col flex-grow">
        <h1 className="text-6xl font-bold">Happening now</h1>
        <h3 className="mt-10 text-3xl font-bold">Join today.</h3>
        <div className="flex flex-col gap-2 items-center mt-8 lg:w-1/2">
          <Button type="button" variant={"secondary"} className="w-full" onClick={() => signIn("google", { callbackUrl: "/home" })}>Google Sign in</Button>
          <Button type="button" variant={"secondary"} className="w-full" onClick={() => signIn("github", { callbackUrl: "/home" })}>Github Sign in</Button>
          <Separator className="mt-2" />
          <SignUpDialog />
          <div className="mt-10 flex flex-col w-full gap-4">
            <h5 className="text-xl font-bold">Already have an account?</h5>
            <SignInDialog />
          </div>
        </div>
      </div>
    </div>
  </>
}