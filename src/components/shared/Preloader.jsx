"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LuPlane } from "react-icons/lu";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 500);
                    return 100;
                }
                const increment = Math.floor(Math.random() * 15) + 5;
                return Math.min(prev + increment, 100);
            });
        }, 150);

        return () => clearInterval(interval);
    }, []);

    const svgVariants = {
        initial: {
            d: "M 0 0 V 100 Q 50 100 100 100 V 0 Z",
        },
        exit: {
            d: [
                "M 0 0 V 100 Q 50 100 100 100 V 0 Z",
                "M 0 0 V 50 Q 50 25 100 50 V 0 Z",
                "M 0 0 V 0 Q 50 0 100 0 V 0 Z"
            ],
            transition: {
                duration: 1.0,
                ease: "linear",
                delay: 0.1
            }
        }
    };

    const containerVariants = {
        initial: { opacity: 1 },
        exit: {
            opacity: 1,
            transition: { duration: 1.2 }
        }
    };

    const contentVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            y: -100,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    variants={containerVariants}
                    initial="initial"
                    animate="initial"
                    exit="exit"
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* SVG Curtain with Curved Wave Animation - Maintained as requested */}
                    <svg
                        className="absolute top-0 w-full h-[100vh] fill-[#021E14]"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <motion.path
                            variants={svgVariants}
                            initial="initial"
                            exit="exit"
                        />
                    </svg>

                    {/* Content Container - Redesigned for VISAPRO */}
                    <motion.div
                        variants={contentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* Branding Section */}
                        <div className="flex flex-col items-center mb-12">
                            <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <LuPlane className="text-secondary w-12 h-12 mb-6" />
                            </motion.div>
                            <h1 className="text-6xl md:text-7xl font-black tracking-[0.15em] uppercase leading-none" style={{ fontFamily: 'Teko, sans-serif' }}>
                                <span className="text-secondary">VISA</span><span className="text-white">PRO</span>
                            </h1>
                            <p className="text-[10px] text-white/40 tracking-[0.5em] uppercase font-bold mt-2">
                                Elite Travel Assistance
                            </p>
                        </div>

                        {/* Progress Section */}
                        <div className="flex flex-col items-center w-64">
                            <div className="h-10 flex items-center justify-center mb-4">
                                <span className="text-white text-5xl font-bold tracking-tighter tabular-nums">
                                    {progress}%
                                </span>
                            </div>

                            {/* Professional Progress Bar */}
                            <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                                <motion.div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3, ease: "linear" }}
                                />
                            </div>

                            <motion.p
                                className="mt-6 text-[10px] text-white/30 tracking-[0.2em] font-medium uppercase"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Checking Visa Status...
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
