import { utapi } from "@/server/uploadthing";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { key } = await request.json()
        await utapi.deleteFiles(key)

        return NextResponse.json({
            success: true,
            message: "Files Deleted"
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 })
    }
}