import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await prisma.tweet.findMany({
        include: {
            quotes: true,
            quote: true,
        }
    })
    return NextResponse.json({
        data
    })
}