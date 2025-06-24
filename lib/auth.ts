import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import { connectToDb } from "./db";
import User from "@/model/user";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        Github({
            clientId: "",
            clientSecret: ""
        }),
        Credentials({
            name: "creds",
            credentials: {
                email: {
                    label: "email",
                    type: "text"
                },
                password: {
                    label: "password",
                    type: "password"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email/password")
                }

                try {
                    await connectToDb();
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("user not found")
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("invalid password")
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email
                    }

                } catch (error) {
                    console.log("login error::",error);
                    throw new Error("server error (login)")
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },
        async session({ session, token, user }) {
            if (session.user) {
                session.user.id = token.id as string;
            }

            return session;
        },
        async redirect({ baseUrl }) {

            return baseUrl
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30*24*60*60
    },
    secret: process.env.NEXTAUTH_SECRET
};