"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
  
        setError(null);
        setLoading(true);
        
        try {
            const response = await signIn("credentials", {
                email,
                password,
                redirect: false
            });

            if (response?.ok) {
                router.push("/");
            } else {
                console.log(response?.error);
            }
        } catch (error: any) {
            setError(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1a1333] via-[#030017] to-[#0a0636] text-[#e6eaff]">
        <div className="border border-[#403c85] bg-[#18123a]/80 shadow-xl p-10 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center tracking-wide text-[#b6baff]">
                Welcome back, adventurer! 🗝️
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <button onClick={() => signIn("github")} className='p-2 border border-white rounded-xl bg-black'>Sign-in with Github</button>
                <label className="flex flex-col gap-1 text-[#b6baff] font-medium">
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="border border-[#403c85] bg-[#221a44] text-[#e6eaff] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#403c85] transition"
                        disabled={loading}
                        autoComplete="email"
                    />
                </label>
                <label className="flex flex-col gap-1 text-[#b6baff] font-medium">
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="border border-[#403c85] bg-[#221a44] text-[#e6eaff] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#403c85] transition"
                        disabled={loading}
                        autoComplete="current-password"
                    />
                </label>
                {error && (
                    <div className="text-red-400 text-sm text-center">{error}</div>
                )}
                <button
                    type="submit"
                    className="bg-gradient-to-r from-[#403c85] to-[#729fe9] hover:from-[#729fe9] hover:to-[#403c85] text-white font-semibold px-4 py-2 rounded-lg shadow transition disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="mt-6 text-center text-[#b6baff]">
                Don't have an account?{" "}
                <a href="/register" className="text-[#729fe9] underline hover:text-[#b6baff] transition">
                    Register
                </a>
            </p>
        </div>
    </div>
  )
}

export default Login
