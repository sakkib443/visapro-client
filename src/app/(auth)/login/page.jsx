"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { LuPlane, LuGlobe, LuShieldCheck, LuHeadphones } from "react-icons/lu";
import { setCredentials } from "@/redux/features/authSlice";
import { authService } from "@/services/api";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await authService.login(data);

            if (response.success) {
                dispatch(setCredentials({
                    user: response.data.user,
                    token: response.data.tokens.accessToken,
                }));

                toast.success("Login successful!");

                const role = response.data.user.role;
                if (role === "admin" || role === "superadmin") {
                    router.push("/dashboard/admin");
                } else if (role === "seller" || role === "mentor") {
                    router.push("/dashboard/seller");
                } else {
                    router.push("/dashboard/user");
                }
            }
        } catch (error) {
            toast.error(error.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {/* Left Side - Branding Panel */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden" style={{ backgroundColor: '#021E14' }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-16 w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(239,140,44,0.15)' }}
                >
                    <LuPlane size={24} style={{ color: '#EF8C2C' }} />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-44 left-12 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(239,140,44,0.1)' }}
                >
                    <LuGlobe size={22} style={{ color: '#EF8C2C' }} />
                </motion.div>
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-32 right-20 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(239,140,44,0.12)' }}
                >
                    <LuShieldCheck size={20} style={{ color: '#EF8C2C' }} />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
                    {/* Logo */}
                    <Link href="/" className="mb-16">
                        <span className="text-3xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#FFFFFF' }}>
                            Visa<span style={{ color: '#EF8C2C' }}>Pro</span>
                        </span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl xl:text-5xl font-black uppercase tracking-tight mb-4 leading-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#FFFFFF' }}>
                            Your Journey<br />
                            Starts <span style={{ color: '#EF8C2C' }}>Here</span>
                        </h2>
                        <p className="text-sm font-normal leading-relaxed mb-10 max-w-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            Sign in to manage your visa applications, track your travel bookings, and access exclusive services.
                        </p>
                    </motion.div>

                    {/* Feature Cards */}
                    <div className="space-y-3">
                        {[
                            { icon: <LuPlane size={16} />, text: "Track visa applications in real-time" },
                            { icon: <LuShieldCheck size={16} />, text: "Secure & verified processing" },
                            { icon: <LuHeadphones size={16} />, text: "24/7 dedicated support team" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg"
                                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                                <span style={{ color: '#EF8C2C' }}>{item.icon}</span>
                                <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {[
                            { val: "15K+", label: "Happy Clients" },
                            { val: "98%", label: "Success Rate" },
                            { val: "50+", label: "Countries" },
                        ].map((s, i) => (
                            <div key={i}>
                                <p className="text-xl font-black" style={{ fontFamily: 'Teko, sans-serif', color: '#EF8C2C' }}>{s.val}</p>
                                <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-8 bg-[#F8FAFC]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[400px]"
                >
                    {/* Mobile Logo */}
                    <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
                        <span className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>
                            Visa<span style={{ color: '#EF8C2C' }}>Pro</span>
                        </span>
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black uppercase tracking-tight mb-2" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>
                            Welcome Back
                        </h1>
                        <p className="text-sm text-gray-500 font-normal">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-semibold hover:underline" style={{ color: '#EF8C2C' }}>
                                Sign up free
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800
                                        placeholder-gray-400 focus:outline-none focus:border-[#021E14] focus:ring-1 focus:ring-[#021E14]/10 transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-[11px] mt-1.5">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                    className="w-full pl-11 pr-11 py-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800
                                        placeholder-gray-400 focus:outline-none focus:border-[#021E14] focus:ring-1 focus:ring-[#021E14]/10 transition-all"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                                >
                                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-[11px] mt-1.5">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 accent-[#021E14]" />
                                <span className="text-[12px] text-gray-500">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-[12px] font-semibold hover:underline" style={{ color: '#EF8C2C' }}>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-lg text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                            style={{ backgroundColor: '#021E14' }}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <FiArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="px-4 bg-[#F8FAFC] text-gray-400 font-semibold uppercase tracking-wider">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-200 bg-white text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-200 bg-white text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-[10px] text-gray-400 mt-8">
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
