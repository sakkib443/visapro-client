"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuGraduationCap,
    LuGlobe,
    LuCalendar,
    LuMapPin,
    LuCheck,
    LuDollarSign,
    LuBookOpen,
    LuUsers,
    LuBriefcase,
    LuAward,
    LuFileText,
    LuPlane,
} from "react-icons/lu";

// ─── Destination Data ───
const destinations = [
    {
        id: 1,
        country: "United Kingdom",
        flag: "🇬🇧",
        universities: "150+",
        tuition: "$15,000 - $40,000",
        intake: "Sep, Jan",
        duration: "1-3 Years",
        scholarships: true,
        highlights: ["World-Renowned Universities", "Post-Study Work Visa (2 yrs)", "Part-time Work Allowed", "IELTS Required", "Multicultural Environment", "Research Excellence"],
        popular: true,
        programs: ["Business", "Engineering", "Medicine", "Law", "Arts"],
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
    },
    {
        id: 2,
        country: "United States",
        flag: "🇺🇸",
        universities: "500+",
        tuition: "$20,000 - $55,000",
        intake: "Fall, Spring",
        duration: "2-4 Years",
        scholarships: true,
        highlights: ["Ivy League Access", "OPT Work Permit (3 yrs)", "Flexible Curriculum", "GRE/GMAT Accepted", "Campus Life Culture", "Research Funding"],
        popular: false,
        programs: ["CS & IT", "Business", "Engineering", "Medicine", "Arts"],
        image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=600&q=80",
    },
    {
        id: 3,
        country: "Canada",
        flag: "🇨🇦",
        universities: "100+",
        tuition: "$12,000 - $35,000",
        intake: "Sep, Jan, May",
        duration: "1-4 Years",
        scholarships: true,
        highlights: ["PR Pathway Available", "Co-op Programs", "Affordable Living", "IELTS Required", "Safe & Friendly", "Work While Study"],
        popular: true,
        programs: ["Business", "Engineering", "Healthcare", "IT", "Hospitality"],
        image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&q=80",
    },
    {
        id: 4,
        country: "Australia",
        flag: "🇦🇺",
        universities: "40+",
        tuition: "$18,000 - $45,000",
        intake: "Feb, Jul",
        duration: "1-3 Years",
        scholarships: true,
        highlights: ["Post-Study Work Visa (4 yrs)", "High Quality Education", "Beautiful Lifestyle", "Part-time Work", "Research Opportunities", "Diverse Culture"],
        popular: false,
        programs: ["Engineering", "IT", "Business", "Health", "Environment"],
        image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80",
    },
    {
        id: 5,
        country: "Germany",
        flag: "🇩🇪",
        universities: "80+",
        tuition: "$0 - $15,000",
        intake: "Oct, Apr",
        duration: "2-3 Years",
        scholarships: true,
        highlights: ["Low/No Tuition Fees", "Strong Engineering", "18-month Job Seeker Visa", "DAAD Scholarships", "English Programs Available", "Innovation Hub"],
        popular: false,
        programs: ["Engineering", "IT", "Business", "Science", "Automotive"],
        image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80",
    },
    {
        id: 6,
        country: "Malaysia",
        flag: "🇲🇾",
        universities: "50+",
        tuition: "$3,000 - $12,000",
        intake: "Feb, Jul, Sep",
        duration: "1-4 Years",
        scholarships: true,
        highlights: ["Affordable Education", "International Branches", "Halal Friendly", "Part-time Work", "Easy Visa Process", "Cultural Diversity"],
        popular: false,
        programs: ["Business", "IT", "Engineering", "Medicine", "Tourism"],
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80",
    },
];

// ─── Services Data ───
const services = [
    { icon: <LuBookOpen size={22} />, title: "University Selection", desc: "Expert guidance to find the perfect university matching your profile and goals." },
    { icon: <LuFileText size={22} />, title: "Application Support", desc: "End-to-end application assistance including SOP, LOR, and document preparation." },
    { icon: <LuPlane size={22} />, title: "Visa Processing", desc: "Complete visa guidance with high success rate and mock interview preparation." },
    { icon: <LuDollarSign size={22} />, title: "Scholarship Guidance", desc: "Identify and apply for suitable scholarships to fund your education." },
    { icon: <LuAward size={22} />, title: "IELTS / Test Prep", desc: "Professional coaching for IELTS, TOEFL, GRE, GMAT, and SAT exams." },
    { icon: <LuBriefcase size={22} />, title: "Pre-Departure Support", desc: "Accommodation, travel, and orientation assistance for smooth transition." },
];

export default function StudyAbroadPage() {
    const [selectedCountry, setSelectedCountry] = useState(null);

    return (
        <div className="bg-[#F8FAFC] min-h-screen" style={{ fontFamily: 'Poppins, sans-serif' }}>

            {/* ═══════════════════════════════════════════════════
                1. HERO SECTION
            ═══════════════════════════════════════════════════ */}
            <section className="relative py-14 md:py-28 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(2,30,20,0.78)' }} />
                </div>

                <div className="relative z-10 max-w-4xl w-full px-4 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6"
                    >
                        <LuGraduationCap size={48} style={{ color: '#EF8C2C' }} />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4"
                        style={{ color: 'rgba(239,140,44,0.8)' }}
                    >
                        Your Global Education Partner
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight mb-4"
                        style={{ fontFamily: 'Teko, sans-serif', color: '#FFFFFF' }}
                    >
                        Study <span style={{ color: '#EF8C2C' }}>Abroad</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-sm font-normal mb-10 max-w-lg"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                        Transform your future with world-class education. We guide you from university selection to visa approval and beyond.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="flex flex-wrap gap-4 justify-center"
                    >
                        <a href="#destinations" className="px-8 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-90" style={{ backgroundColor: '#EF8C2C', color: '#FFFFFF' }}>
                            Explore Destinations
                        </a>
                        <a href="#services" className="px-8 py-3 rounded-lg border text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF' }}>
                            Free Consultation
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
                        { value: "5000+", label: "Students Placed" },
                        { value: "50+", label: "Partner Universities" },
                        { value: "15+", label: "Countries" },
                        { value: "98%", label: "Visa Success Rate" },
                    ].map((stat, i) => (
                        <div key={i} className="py-6 px-4 text-center">
                            <p className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>{stat.value}</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════════════
                3. DESTINATIONS GRID
            ═══════════════════════════════════════════════════ */}
            <section id="destinations" className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
                <div className="text-center mb-12">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#EF8C2C' }}>Top Destinations</p>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>
                        Where Do You Want to <span style={{ color: '#EF8C2C' }}>Study</span>?
                    </h2>
                    <p className="text-sm text-gray-500 font-normal max-w-md mx-auto">
                        Choose from top study destinations worldwide. Each country offers unique opportunities for academic and career growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((dest) => (
                        <motion.div
                            key={dest.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`relative bg-white rounded-xl border overflow-hidden transition-all hover:shadow-lg cursor-pointer ${dest.popular ? "border-[#EF8C2C] shadow-md" : "border-gray-200"
                                }`}
                            onClick={() => setSelectedCountry(selectedCountry === dest.id ? null : dest.id)}
                        >
                            {dest.popular && (
                                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest text-white" style={{ backgroundColor: '#EF8C2C' }}>
                                    Popular
                                </div>
                            )}

                            {/* Country Image */}
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={dest.image}
                                    alt={dest.country}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,30,20,0.6) 0%, transparent 60%)' }} />
                                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                    <span className="text-2xl">{dest.flag}</span>
                                    <h3 className="text-xl font-black uppercase tracking-wider text-white" style={{ fontFamily: 'Teko, sans-serif' }}>
                                        {dest.country}
                                    </h3>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-5">
                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                        <LuGraduationCap size={13} style={{ color: '#EF8C2C' }} />
                                        {dest.universities} Universities
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                        <LuDollarSign size={13} style={{ color: '#EF8C2C' }} />
                                        {dest.tuition}/yr
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                        <LuCalendar size={13} style={{ color: '#EF8C2C' }} />
                                        {dest.intake}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                        <LuBookOpen size={13} style={{ color: '#EF8C2C' }} />
                                        {dest.duration}
                                    </div>
                                </div>

                                {/* Programs */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {dest.programs.map((p, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-100">
                                            {p}
                                        </span>
                                    ))}
                                </div>

                                {/* Expandable Highlights */}
                                <AnimatePresence>
                                    {selectedCountry === dest.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-gray-100 pt-4 mb-4">
                                                <div className="space-y-2">
                                                    {dest.highlights.map((h, i) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <LuCheck size={12} style={{ color: '#EF8C2C' }} />
                                                            <span className="text-[11px] text-gray-600">{h}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* CTA */}
                                <button
                                    className="w-full py-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-[#021E14] hover:text-white hover:border-[#021E14]"
                                    style={{ borderColor: '#e5e7eb', color: '#021E14' }}
                                >
                                    {selectedCountry === dest.id ? "Apply Now" : "View Details"}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                4. OUR SERVICES
            ═══════════════════════════════════════════════════ */}
            <section id="services" className="py-20" style={{ backgroundColor: '#021E14' }}>
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="text-center mb-14">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#EF8C2C' }}>What We Offer</p>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4" style={{ fontFamily: 'Teko, sans-serif', color: '#FFFFFF' }}>
                            Our <span style={{ color: '#EF8C2C' }}>Services</span>
                        </h2>
                        <p className="text-sm font-normal max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            Comprehensive support at every step of your study abroad journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {services.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="rounded-xl p-5 text-center border transition-all hover:border-[#EF8C2C]/30 group"
                                style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }}
                            >
                                <div className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgba(239,140,44,0.1)' }}>
                                    <span style={{ color: '#EF8C2C' }}>{item.icon}</span>
                                </div>
                                <h4 className="text-sm font-bold mb-1 text-white">{item.title}</h4>
                                <p className="text-[10px] font-normal leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
