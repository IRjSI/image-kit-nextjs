import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import User from "@/model/user";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                {error: "email/password required"},
                {status: 400}
            )
        }

        // check db connection status
        await connectToDb()

        const user = await User.findOne({ email })
        if (user) {
            return NextResponse.json(
                {error: "user already registered"},
                {status: 400}
            )
        }

        await User.create({ email, password })

        return NextResponse.json(
            {message: "user registered"},
            {status: 201}
        )
    } catch (error) {
        console.log("registration error::",error);
        return NextResponse.json(
            {error: "server error(registration)"},
            {status: 400}
        )
    }
}