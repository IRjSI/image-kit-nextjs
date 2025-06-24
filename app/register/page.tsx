"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Password and confirm password do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Registration failed");
            }

            router.push("/login");
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
                Beginning of a legendary journey⚔️
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                        autoComplete="new-password"
                    />
                </label>
                <label className="flex flex-col gap-1 text-[#b6baff] font-medium">
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        className="border border-[#403c85] bg-[#221a44] text-[#e6eaff] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#403c85] transition"
                        disabled={loading}
                        autoComplete="new-password"
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
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            <p className="mt-6 text-center text-[#b6baff]">
                Already have an account?{" "}
                <a href="/login" className="text-[#729fe9] underline hover:text-[#b6baff] transition">
                    Login
                </a>
            </p>
        </div>
    </div>
)
}

export default Register
