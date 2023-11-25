import { prisma } from "@/lib/db";
import { hashSync } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, username, email, password } = body
        const requiredFields = ['email', 'password', 'name', 'username'];

        const errResponse = requiredFields
            .filter(field => !body[field])
            .map(field => ({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be null` }));

        if (errResponse.length > 0) {
            return NextResponse.json({ success: false, message: errResponse }, { status: 403 });
        }

        const checkEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })
        const checkUsername = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if (checkEmail) return NextResponse.json({
            success: false,
            message: "Email already used"
        }, { status: 403 })

        if (checkUsername) return NextResponse.json({
            success: false,
            message: "Username already used"
        }, { status: 403 })

        const user = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashSync(password, 12)
            }
        })

        return NextResponse.json({
            success: true,
            data: user
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Invalid JSON"
        })
    }
}