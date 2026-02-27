"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiPhone } from "react-icons/fi";
import { LuPlane, LuGlobe, LuShieldCheck, LuCheck, LuHeadphones } from "react-icons/lu";
import { authService } from "@/services/api";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch("password");

    const [serverError, setServerError] = useState("");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError("");
        try {
            const userData = {
                firstName: data.firstName,
                lastName: data.lastName || "",
                email: data.email,
                password: data.password,
                ...(data.phone && { phone: data.phone }),
                role: "user",
            };

            const response = await authService.register(userData);

            if (response.success) {
                toast.success("Registration successful! Please login.");
                router.push("/login");
            }
        } catch (error) {
            // Show server validation errors properly
            if (error?.errorSources?.length) {
                const msg = error.errorSources[0]?.message || error.message;
                setServerError(msg);
            } else {
                setServerError(error.message || "Registration failed. Please try again.");
            }
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

                {/* Floating Icons */}
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
                    <Link href="/" className="mb-14 block">
                        <img src="/images/logo.png" alt="VisaPro" className="w-[120px] h-auto object-contain" />
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl xl:text-5xl font-black uppercase tracking-tight mb-4 leading-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#FFFFFF' }}>
                            Join Our<br />
                            <span style={{ color: '#EF8C2C' }}>Global</span> Community
                        </h2>
                        <p className="text-sm font-normal leading-relaxed mb-10 max-w-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            Create your free account and get access to visa tracking, travel bookings, and exclusive deals.
                        </p>
                    </motion.div>

                    {/* Benefits */}
                    <div className="space-y-3">
                        {[
                            { text: "Access to all visa services & tracking" },
                            { text: "Exclusive tour & travel deals" },
                            { text: "Free consultation with experts" },
                            { text: "24/7 dedicated customer support" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg"
                                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(239,140,44,0.2)' }}>
                                    <LuCheck size={11} style={{ color: '#EF8C2C' }} />
                                </div>
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

            {/* Right Side - Register Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-8 bg-[#F8FAFC] overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[420px] py-4"
                >
                    {/* Mobile Logo */}
                    <Link href="/" className="lg:hidden flex items-center gap-2 mb-6">
                        <img src="/images/logo.png" alt="VisaPro" className="w-[100px] h-auto object-contain" />
                    </Link>

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-black uppercase tracking-tight mb-2" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>
                            Create Account
                        </h1>
                        <p className="text-sm text-gray-500 font-normal">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold hover:underline" style={{ color: '#EF8C2C' }}>
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                                    First Name
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
                                    <input
                                        type="text"
                                        {...register("firstName", { required: "First name is required" })}
                                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800
                                            placeholder-gray-400 focus:outline-none focus:border-[#021E14] focus:ring-1 focus:ring-[#021E14]/10 transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                {errors.firstName && (
                                    <p className="text-red-500 text-[10px] mt-1">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                                    Last Name <span className="text-gray-300 normal-case font-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("lastName")}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800
                                        placeholder-gray-400 focus:outline-none focus:border-[#021E14] focus:ring-1 focus:ring-[#021E14]/10 transition-all"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800
                                        placeholder-gray-400 focus:outline-none focus:border-[#021E14] focus:ring-1 focus:ring-[#021E14]/10 transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                                Phone Number <span className="text-gray-300 normal-case font-normal">(optional)</span>
                            </label>
                            <div className="relative">
                                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
                                <input
                                    type="tel"
                                    {...register("phone")}
                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800
                                        placeholder-gray-400 focus:outline-none focus:border-[#021E14] focus:ring-1 focus:ring-[#021E14]/10 transition-all"
                                    placeholder="01XXXXXXXXX"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800
                                        placeholder-gray-400 focus:outline-none focus:border-[#021E14] focus:ring-1 focus:ring-[#021E14]/10 transition-all"
                                    placeholder="Min 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                                >
                                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-[10px] mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: (value) =>
                                            value === password || "Passwords do not match",
                                    })}
                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800
                                        placeholder-gray-400 focus:outline-none focus:border-[#021E14] focus:ring-1 focus:ring-[#021E14]/10 transition-all"
                                    placeholder="Re-enter your password"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-[10px] mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2.5 pt-1">
                            <input
                                type="checkbox"
                                {...register("terms")}
                                className="w-3.5 h-3.5 mt-0.5 rounded border-gray-300 accent-[#021E14]"
                            />
                            <label className="text-[11px] text-gray-500 leading-relaxed">
                                I agree to the{" "}
                                <Link href="/terms" className="font-semibold hover:underline" style={{ color: '#EF8C2C' }}>
                                    Terms of Service
                                </Link>
                                {" "}and{" "}
                                <Link href="/privacy" className="font-semibold hover:underline" style={{ color: '#EF8C2C' }}>
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Server Error */}
                        {serverError && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
                                <svg className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p className="text-red-600 text-[11px] font-medium leading-snug">{serverError}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-lg text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                            style={{ backgroundColor: '#021E14' }}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <FiArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="px-4 bg-[#F8FAFC] text-gray-400 font-semibold uppercase tracking-wider">Or sign up with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 bg-white text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 bg-white text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-[10px] text-gray-400 mt-6 pb-4">
                        © 2024 VisaPro. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
