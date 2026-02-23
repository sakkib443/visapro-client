"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuHotel,
    LuUsers,
    LuCalendar,
    LuMapPin,
    LuCheck,
} from "react-icons/lu";
import { FaKaaba, FaMosque } from "react-icons/fa6";

// ─── Hajj Packages Data ───
const hajjPackages = [
    {
        id: 1,
        name: "Economy Hajj",
        subtitle: "Essential Spiritual Journey",
        price: 4500,
        originalPrice: 5200,
        duration: "21 Days",
        groupSize: "40-50",
        hotel: "3-Star Hotel",
        distance: "800m from Haram",
        meals: "Breakfast & Dinner",
        features: ["Shared Room (4 persons)", "Air-conditioned Bus", "Visa Processing", "Guided Rituals", "Makkah & Madinah Stay", "Basic Meals Included"],
        popular: false,
    },
    {
        id: 2,
        name: "Standard Hajj",
        subtitle: "Comfortable Pilgrimage Experience",
        price: 6500,
        originalPrice: 7500,
        duration: "25 Days",
        groupSize: "25-30",
        hotel: "4-Star Hotel",
        distance: "400m from Haram",
        meals: "Full Board",
        features: ["Shared Room (2 persons)", "Private AC Transport", "Visa + Insurance", "Scholar Guidance", "Makkah & Madinah Stay", "Full Board Meals", "Ziyarah Tours", "Emergency Support"],
        popular: true,
    },
    {
        id: 3,
        name: "Premium Hajj",
        subtitle: "Luxury VIP Experience",
        price: 12000,
        originalPrice: 14000,
        duration: "30 Days",
        groupSize: "10-15",
        hotel: "5-Star Hotel",
        distance: "50m from Haram",
        meals: "Full Board + Snacks",
        features: ["Private Room", "Luxury Transport", "VIP Visa Service", "Personal Scholar", "Haram View Room", "Gourmet Meals", "All Ziyarah Tours", "24/7 Concierge", "Laundry Service", "Medical Support"],
        popular: false,
    },
];

// ─── Umrah Packages Data ───
const umrahPackages = [
    {
        id: 1,
        name: "7-Day Umrah",
        price: 1200,
        duration: "7 Days",
        hotel: "3-Star",
        description: "A short but spiritually fulfilling Umrah experience with all essentials covered.",
        features: ["Visa Processing", "Return Flights", "Hotel Accommodation", "Airport Transfers", "Guided Umrah"],
    },
    {
        id: 2,
        name: "10-Day Umrah",
        price: 1800,
        duration: "10 Days",
        hotel: "4-Star",
        description: "Extended stay with comfortable accommodation near Haram for a peaceful journey.",
        features: ["Visa Processing", "Return Flights", "4-Star Hotel", "Full Board Meals", "Guided Umrah", "Ziyarah Tours"],
    },
    {
        id: 3,
        name: "14-Day Umrah",
        price: 2500,
        duration: "14 Days",
        hotel: "4-Star",
        description: "Comprehensive Umrah package with extended stays in both Makkah and Madinah.",
        features: ["Visa Processing", "Return Flights", "4-Star Hotel", "Full Board Meals", "Guided Umrah", "All Ziyarah", "Private Transport"],
    },
    {
        id: 4,
        name: "Ramadan Umrah",
        price: 3200,
        duration: "15 Days",
        hotel: "5-Star",
        description: "Experience the blessed month of Ramadan in the holy cities with premium services.",
        features: ["Visa Processing", "Return Flights", "5-Star Hotel", "Iftar & Suhoor", "Premium Guided Umrah", "All Ziyarah", "Private Transport", "Laundry"],
    },
];

export default function HajjUmrahPage() {
    const [activeTab, setActiveTab] = useState("hajj");

    return (
        <div className="bg-[#F8FAFC] min-h-screen" style={{ fontFamily: 'Poppins, sans-serif' }}>

            {/* ═══════════════════════════════════════════════════
                1. HERO SECTION
            ═══════════════════════════════════════════════════ */}
            <section className="relative py-14 md:py-28 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(2,30,20,0.75)' }} />
                </div>

                {/* Decorative Islamic Pattern Overlay */}
                <div className="absolute inset-0 z-[1] opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />

                <div className="relative z-10 max-w-4xl w-full px-4 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6"
                    >
                        <FaKaaba size={48} style={{ color: '#EF8C2C' }} />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4"
                        style={{ color: 'rgba(239,140,44,0.8)' }}
                    >
                        Your Sacred Journey Begins Here
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight mb-4"
                        style={{ fontFamily: 'Teko, sans-serif', color: '#FFFFFF' }}
                    >
                        Hajj & <span style={{ color: '#EF8C2C' }}>Umrah</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-sm font-normal mb-10 max-w-lg"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                        Embark on a life-changing pilgrimage with our expertly crafted packages. We handle every detail so you can focus on your spiritual journey.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="flex flex-wrap gap-4 justify-center"
                    >
                        <a href="#packages" className="px-8 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-90" style={{ backgroundColor: '#EF8C2C', color: '#FFFFFF' }}>
                            View Packages
                        </a>
                        <a href="#contact" className="px-8 py-3 rounded-lg border text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF' }}>
                            Get a Quote
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                2. TRUST STATS BAR
            ═══════════════════════════════════════════════════ */}
            <section className="relative -mt-8 z-20 max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100"
                >
                    {[
                        { value: "15+", label: "Years Experience" },
                        { value: "10K+", label: "Pilgrims Served" },
                        { value: "98%", label: "Satisfaction Rate" },
                        { value: "24/7", label: "Support Available" },
                    ].map((stat, i) => (
                        <div key={i} className="py-6 px-4 text-center">
                            <p className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>{stat.value}</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════════════
                3. PACKAGES SECTION (Tabbed - Hajj / Umrah)
            ═══════════════════════════════════════════════════ */}
            <section id="packages" className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#EF8C2C' }}>Our Packages</p>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>
                        Choose Your <span style={{ color: '#EF8C2C' }}>Package</span>
                    </h2>
                    <p className="text-sm text-gray-500 font-normal max-w-md mx-auto">
                        We offer a range of packages designed to suit every budget and preference. Each includes comprehensive support and guidance.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-10 md:mb-12">
                    <div className="bg-gray-100 rounded-lg p-1 flex flex-col sm:flex-row gap-1 w-full sm:w-auto">
                        {["hajj", "umrah"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 sm:px-8 py-2.5 rounded-md text-[12px] font-bold uppercase tracking-wider transition-all ${activeTab === tab
                                    ? "text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                                style={activeTab === tab ? { backgroundColor: '#021E14' } : {}}
                            >
                                {tab === "hajj" ? "🕋 Hajj Packages" : "🕌 Umrah Packages"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Packages Grid */}
                <AnimatePresence mode="wait">
                    {activeTab === "hajj" && (
                        <motion.div
                            key="hajj"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {hajjPackages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className={`relative bg-white rounded-xl border overflow-hidden transition-all hover:shadow-lg ${pkg.popular ? "border-[#EF8C2C] shadow-md" : "border-gray-200"
                                        }`}
                                >
                                    {pkg.popular && (
                                        <div className="absolute top-0 left-0 right-0 py-1.5 text-center text-[9px] font-bold uppercase tracking-widest text-white" style={{ backgroundColor: '#EF8C2C' }}>
                                            Most Popular
                                        </div>
                                    )}
                                    <div className={`p-6 ${pkg.popular ? "pt-10" : ""}`}>
                                        <h3 className="text-2xl font-black uppercase tracking-wider mb-1" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>
                                            {pkg.name}
                                        </h3>
                                        <p className="text-[11px] text-gray-400 font-normal mb-5">{pkg.subtitle}</p>

                                        <div className="mb-5">
                                            <div className="flex items-end gap-2">
                                                <span className="text-4xl font-black" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>${pkg.price}</span>
                                                <span className="text-sm text-gray-400 line-through mb-1">${pkg.originalPrice}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1">Per Person</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-5">
                                            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                <LuCalendar size={13} style={{ color: '#EF8C2C' }} />
                                                {pkg.duration}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                <LuUsers size={13} style={{ color: '#EF8C2C' }} />
                                                {pkg.groupSize} pax
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                <LuHotel size={13} style={{ color: '#EF8C2C' }} />
                                                {pkg.hotel}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                <LuMapPin size={13} style={{ color: '#EF8C2C' }} />
                                                {pkg.distance}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 my-5" />

                                        <div className="space-y-2.5 mb-6">
                                            {pkg.features.map((f, i) => (
                                                <div key={i} className="flex items-center gap-2.5">
                                                    <LuCheck size={14} style={{ color: '#EF8C2C' }} />
                                                    <span className="text-[12px] text-gray-600 font-normal">{f}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            className={`w-full py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${pkg.popular
                                                ? "text-white hover:opacity-90"
                                                : "border hover:bg-gray-50"
                                                }`}
                                            style={
                                                pkg.popular
                                                    ? { backgroundColor: '#EF8C2C' }
                                                    : { borderColor: '#021E14', color: '#021E14' }
                                            }
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === "umrah" && (
                        <motion.div
                            key="umrah"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                        >
                            {umrahPackages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all hover:border-[#EF8C2C]/30 group"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaMosque size={16} style={{ color: '#EF8C2C' }} />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{pkg.duration} • {pkg.hotel}</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-wider mb-2" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>
                                        {pkg.name}
                                    </h3>
                                    <p className="text-[11px] text-gray-500 font-normal leading-relaxed mb-4">{pkg.description}</p>

                                    <div className="text-3xl font-black mb-4" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>
                                        ${pkg.price} <span className="text-xs font-normal text-gray-400">/person</span>
                                    </div>

                                    <div className="space-y-2 mb-5">
                                        {pkg.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <LuCheck size={12} style={{ color: '#EF8C2C' }} />
                                                <span className="text-[11px] text-gray-600">{f}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full py-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all hover:text-white group-hover:border-[#021E14]" style={{ borderColor: '#e5e7eb', color: '#021E14' }}
                                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#021E14'; e.target.style.color = '#fff'; }}
                                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#021E14'; }}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
}
