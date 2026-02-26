"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 600);
                    return 100;
                }
                const increment = Math.floor(Math.random() * 12) + 3;
                return Math.min(prev + increment, 100);
            });
        }, 180);

        return () => clearInterval(interval);
    }, []);

    const svgVariants = {
        initial: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 Z" },
        exit: {
            d: [
                "M 0 0 V 100 Q 50 100 100 100 V 0 Z",
                "M 0 0 V 50 Q 50 25 100 50 V 0 Z",
                "M 0 0 V 0 Q 50 0 100 0 V 0 Z"
            ],
            transition: { duration: 1.0, ease: "linear", delay: 0.1 }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 1, transition: { duration: 1.2 } }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* SVG Curtain */}
                    <svg
                        className="absolute top-0 w-full h-[100vh] fill-[#021E14]"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <motion.path variants={svgVariants} initial="initial" exit="exit" />
                    </svg>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }}
                        exit={{ opacity: 0, y: -100, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* Plane Flight Animation */}
                        <div className="relative w-80 h-32 mb-6">
                            {/* Curved dashed flight path */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 128" fill="none">
                                <motion.path
                                    d="M 10 100 C 80 20, 160 20, 200 64 C 240 108, 280 40, 310 28"
                                    stroke="rgba(239, 140, 44, 0.15)"
                                    strokeWidth="1.5"
                                    strokeDasharray="5 5"
                                    fill="none"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                                {/* Small dots along path */}
                                {[
                                    { cx: 60, cy: 52 },
                                    { cx: 130, cy: 30 },
                                    { cx: 200, cy: 64 },
                                    { cx: 260, cy: 55 },
                                ].map((dot, i) => (
                                    <motion.circle
                                        key={i}
                                        cx={dot.cx}
                                        cy={dot.cy}
                                        r="2"
                                        fill="#EF8C2C"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.5,
                                            ease: "easeInOut",
                                        }}
                                    />
                                ))}
                            </svg>

                            {/* The Flying Plane */}
                            <motion.div
                                className="absolute z-10"
                                style={{ offsetPath: "path('M 10 100 C 80 20, 160 20, 200 64 C 240 108, 280 40, 310 28')", offsetRotate: "auto" }}
                                initial={{ offsetDistance: "0%" }}
                                animate={{ offsetDistance: "100%" }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: [0.25, 0.1, 0.25, 1],
                                    repeatDelay: 0.3,
                                }}
                            >
                                <motion.div
                                    animate={{ y: [0, -2, 0, 2, 0] }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "rotate(90deg)" }}>
                                        <path d="M22 16.21v-1.895L14 8.38V3.5a2 2 0 1 0-4 0v4.88L2 14.315v1.895l8-2.526v4.868l-2 1.517v1.422L12 20.5l4 .99v-1.421l-2-1.517v-4.868l8 2.526z" fill="#EF8C2C" />
                                    </svg>
                                </motion.div>
                            </motion.div>

                            {/* Soft clouds */}
                            {[
                                { left: "8%", top: "20%", w: 40, h: 12, delay: 0 },
                                { left: "55%", top: "75%", w: 30, h: 10, delay: 1 },
                                { left: "78%", top: "15%", w: 35, h: 11, delay: 0.5 },
                            ].map((c, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{
                                        left: c.left,
                                        top: c.top,
                                        width: c.w,
                                        height: c.h,
                                        background: "rgba(255,255,255,0.06)",
                                    }}
                                    animate={{ x: [-8, 8, -8], opacity: [0.04, 0.1, 0.04] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: c.delay, ease: "easeInOut" }}
                                />
                            ))}
                        </div>

                        {/* Logo */}
                        <div className="flex flex-col items-center mb-10">
                            <img
                                src="/images/logo.png"
                                alt="VisaPro Logo"
                                className="w-[120px] h-auto object-contain mb-2"
                            />
                            <motion.p
                                className="text-[10px] text-white/35 tracking-[0.5em] uppercase font-bold"
                                animate={{ opacity: [0.35, 0.6, 0.35] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                Elite Travel Assistance
                            </motion.p>
                        </div>

                        {/* Progress */}
                        <div className="flex flex-col items-center w-64">
                            <span className="text-white text-5xl font-bold tracking-tighter tabular-nums mb-4">
                                {progress}%
                            </span>

                            {/* Progress bar */}
                            <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                                <motion.div
                                    className="absolute left-0 top-0 h-full rounded-full"
                                    style={{ background: "linear-gradient(90deg, #EF8C2C, #3590CF)" }}
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3, ease: "linear" }}
                                />
                                {/* Shimmer */}
                                <motion.div
                                    className="absolute top-0 h-full w-12 rounded-full"
                                    style={{
                                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                                    }}
                                    animate={{ left: ["-48px", "256px"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                            </div>

                            <motion.p
                                className="mt-5 text-[10px] text-white/25 tracking-[0.2em] font-medium uppercase"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Preparing Your Journey...
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
