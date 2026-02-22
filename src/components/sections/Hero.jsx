"use client";

import { useState } from "react";
import {
    LuTicket,
    LuBed,
    LuMapPin,
    LuPlane,
    LuCalendar,
    LuLayoutList,
    LuSearch,
    LuChevronRight,
    LuClock,
    LuMessageCircle,
    LuCalendarCheck
} from "react-icons/lu";
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
    { id: "visa", name: "Visa", icon: <LuTicket /> },
    { id: "hotel", name: "Hotel", icon: <LuBed /> },
    { id: "tour", name: "Tour", icon: <LuMapPin /> },
    { id: "flight", name: "Flight", icon: <LuPlane /> },
];

export default function Hero() {
    const [activeTab, setActiveTab] = useState("tour");

    return (
        <section className="relative min-h-[900px] sm:min-h-screen lg:min-h-[75vh] flex items-center justify-center py-20 lg:py-20 overflow-hidden">
            {/* Background with Video - NO OVERLAY */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/hero.mp4" type="video/mp4" />
                </video>
                {/* Subtle dark overlay for mobile readability */}
                <div className="absolute inset-0 bg-black/40 lg:bg-transparent z-10" />
            </div>

            {/* Content Container */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col items-center justify-center text-center mt-10 lg:mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6"
                    >
                        <LuClock className="text-white w-3.5 h-3.5" />
                        <span className="text-white text-[9px] lg:text-[10px] font-bold tracking-widest uppercase">
                            Opening Hour: 9.30 AM To 8.30 PM
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 lg:mb-4 tracking-tight leading-[0.9] lg:leading-none uppercase"
                        style={{
                            fontFamily: '"Teko", sans-serif',
                            color: '#FFFFFF',
                            textShadow: '0 8px 30px rgba(0,0,0,0.5)'
                        }}
                    >
                        Your Dream <br className="lg:hidden" /> to Destination
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 lg:mt-6 w-full max-w-md lg:max-w-none"
                    >
                        <button className="w-[85%] sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#EF8C2C] hover:bg-[#D97A1E] text-white rounded-xl font-bold text-xs transition-all shadow-lg hover:-translate-y-1">
                            <LuCalendarCheck className="w-4 h-4" />
                            Book Appointment
                        </button>
                        <button className="w-[85%] sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition-all hover:-translate-y-1">
                            <LuMessageCircle className="w-4 h-4" />
                            Ask Question
                        </button>
                    </motion.div>
                </div>

                {/* Search Interface */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-5xl mx-auto mt-12 lg:mt-16"
                >
                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap gap-1.5 lg:gap-2 mb-0 justify-center lg:justify-start lg:ml-4 relative z-30">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-t-xl font-bold text-[10px] lg:text-sm transition-all duration-300 ${activeTab === tab.id
                                    ? "bg-white text-[#1D7EDD] shadow-lg"
                                    : "bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white"
                                    }`}
                            >
                                <span className={activeTab === tab.id ? "text-[#1D7EDD]" : "text-[#EF8C2C]"}>
                                    {tab.icon}
                                </span>
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Search Card */}
                    <div className="bg-white rounded-2xl lg:rounded-tl-none p-5 lg:p-8 shadow-2xl relative z-20">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            {/* Input Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 flex-grow w-full">
                                {/* Destination Selector */}
                                <div className="group flex items-center gap-3 px-4 lg:px-5 py-3 lg:py-3 border border-gray-100 rounded-xl bg-gray-50/30 hover:bg-white transition-all cursor-pointer">
                                    <div className="w-9 h-9 flex-shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <LuMapPin className="text-lg text-gray-400 group-hover:text-[#1D7EDD]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm lg:text-base font-bold text-gray-800 leading-none">Select</p>
                                        <p className="text-[9px] lg:text-[10px] text-gray-400 font-medium uppercase mt-1">Destination</p>
                                    </div>
                                </div>

                                {/* Date Selector */}
                                <div className="group flex items-center gap-3 px-4 lg:px-5 py-3 lg:py-3 border border-gray-100 rounded-xl bg-gray-50/30 hover:bg-white transition-all cursor-pointer">
                                    <div className="w-9 h-9 flex-shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <LuCalendar className="text-lg text-gray-400 group-hover:text-[#1D7EDD]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm lg:text-base font-bold text-gray-800 leading-none">18 February</p>
                                        <p className="text-[9px] lg:text-[10px] text-gray-400 font-medium uppercase mt-1">Wednesday 2026</p>
                                    </div>
                                </div>

                                {/* Tour Type Selector */}
                                <div className="group flex items-center gap-3 px-4 lg:px-5 py-3 lg:py-3 border border-gray-100 rounded-xl bg-gray-50/30 hover:bg-white transition-all cursor-pointer">
                                    <div className="w-9 h-9 flex-shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <LuLayoutList className="text-lg text-gray-400 group-hover:text-[#1D7EDD]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm lg:text-base font-bold text-gray-800 leading-none">Select</p>
                                        <p className="text-[9px] lg:text-[10px] text-gray-400 font-medium uppercase mt-1">Tour Types</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button className="w-full lg:w-auto px-8 h-[52px] lg:h-[56px] flex items-center justify-center gap-3 bg-[#1D7EDD] hover:bg-[#1868b8] text-white rounded-xl font-bold text-sm lg:text-base transition-all shadow-lg active:scale-95 group">
                                <LuSearch className="text-lg" />
                                <span className="tracking-widest">SEARCH</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Floating Social & Hotline Footer */}
            <div className="absolute bottom-6 left-0 right-0 z-30 px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4 pointer-events-none">
                <div className="flex items-center gap-4 lg:gap-3 pointer-events-auto">
                    {[
                        { icon: <FaFacebookF />, color: "hover:bg-[#1877F2]", name: "Facebook" },
                        { icon: <FaTwitter />, color: "hover:bg-[#1DA1F2]", name: "Twitter" },
                        { icon: <FaYoutube />, color: "hover:bg-[#FF0000]", name: "Youtube" },
                    ].map((social, i) => (
                        <motion.a
                            key={i}
                            href="#"
                            whileHover={{ y: -3 }}
                            className={`w-9 h-9 lg:w-9 lg:h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all ${social.color}`}
                        >
                            {social.icon}
                        </motion.a>
                    ))}
                </div>

                <div className="flex items-center gap-3 pointer-events-auto">
                    <div className="flex flex-col items-center lg:items-end">
                        <span className="text-white/70 text-[8px] font-bold tracking-widest uppercase mb-1 lg:mb-0.5">Hotline 24/7</span>
                        <a href="tel:+8801712114770" className="flex items-center gap-2 bg-white/20 backdrop-blur-lg border border-white/30 px-4 py-1.5 lg:py-1.5 rounded-xl transition-all hover:bg-white/30">
                            <div className="w-6 h-6 rounded-full bg-[#EF8C2C] flex items-center justify-center text-white">
                                <LuPlane className="w-3 h-3 rotate-45" />
                            </div>
                            <span className="text-sm lg:text-base font-black text-white tracking-widest leading-none">017 1211 4770</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

