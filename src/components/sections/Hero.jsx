"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
    LuCalendarCheck,
    LuGlobe,
    LuArrowRight
} from "react-icons/lu";
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Hero() {
    const [activeTab, setActiveTab] = useState("visa");
    const { t, language } = useLanguage();
    const videoRef = useRef(null);
    const router = useRouter();
    const isBn = language === 'bn';

    // ==================== Dynamic Data ====================
    const [countries, setCountries] = useState([]);
    const [visaCategories, setVisaCategories] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [countrySearch, setCountrySearch] = useState("");
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const countryDropdownRef = useRef(null);

    // Fetch countries and visa categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [countriesRes, categoriesRes] = await Promise.all([
                    fetch(`${API_BASE}/api/countries/active`),
                    fetch(`${API_BASE}/api/visa-categories/active`)
                ]);
                const countriesData = await countriesRes.json();
                const categoriesData = await categoriesRes.json();

                if (countriesData.success && countriesData.data) {
                    setCountries(countriesData.data);
                }
                if (categoriesData.success && categoriesData.data) {
                    setVisaCategories(categoriesData.data);
                }
            } catch (err) {
                console.error("Failed to fetch hero data:", err);
            }
        };
        fetchData();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
                setShowCountryDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter countries by search
    const filteredCountries = useMemo(() => {
        if (!countrySearch) return countries;
        const q = countrySearch.toLowerCase();
        return countries.filter(c =>
            c.name.toLowerCase().includes(q) ||
            (c.nameBn && c.nameBn.includes(countrySearch))
        );
    }, [countries, countrySearch]);

    // Get selected country display name
    const selectedCountryName = useMemo(() => {
        if (!selectedCountry) return isBn ? 'দেশ নির্বাচন করুন' : 'Select Country';
        const c = countries.find(c => c.slug === selectedCountry);
        if (!c) return selectedCountry;
        return isBn && c.nameBn ? c.nameBn : c.name;
    }, [selectedCountry, countries, isBn]);

    const selectedCountryFlag = useMemo(() => {
        if (!selectedCountry) return null;
        const c = countries.find(c => c.slug === selectedCountry);
        return c?.flag || null;
    }, [selectedCountry, countries]);

    // Handle visa search
    const handleVisaSearch = () => {
        if (selectedCountry) {
            router.push(`/visa/country/${selectedCountry}`);
        } else {
            router.push('/visa');
        }
    };

    const tabs = [
        { id: "visa", name: t('tabVisa'), icon: <LuTicket /> },
        { id: "hotel", name: t('tabHotel'), icon: <LuBed /> },
        { id: "tour", name: t('tabTour'), icon: <LuMapPin /> },
        { id: "flight", name: t('tabFlight'), icon: <LuPlane /> },
    ];

    const bnFont = language === 'bn' ? 'Hind Siliguri, sans-serif' : undefined;

    // Render search fields based on active tab
    const renderSearchFields = () => {
        if (activeTab === "visa") {
            return (
                <>
                    {/* FROM: Bangladesh (Fixed) */}
                    <div className="flex items-center gap-2.5 px-3 lg:px-4 py-2.5 border border-gray-100 rounded-lg bg-gray-50/50">
                        <span className="text-lg flex-shrink-0">🇧🇩</span>
                        <div className="text-left min-w-0">
                            <p className="text-[10px] text-gray-400 font-medium uppercase leading-none" style={{ fontFamily: bnFont }}>
                                {isBn ? 'থেকে' : 'From'}
                            </p>
                            <p className="text-[13px] font-semibold text-gray-800 leading-snug" style={{ fontFamily: bnFont }}>
                                {isBn ? 'বাংলাদেশ' : 'Bangladesh'}
                            </p>
                        </div>
                    </div>

                    {/* TO: Country Destination */}
                    <div className="relative" ref={countryDropdownRef}>
                        <div
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className="flex items-center gap-2.5 px-3 lg:px-4 py-2.5 border border-gray-100 rounded-lg bg-gray-50/30 hover:bg-white hover:border-[#1D7EDD]/30 transition-all cursor-pointer"
                        >
                            <span className="text-lg flex-shrink-0">
                                {selectedCountryFlag || <LuGlobe className="text-gray-400 w-[18px] h-[18px]" />}
                            </span>
                            <div className="text-left flex-grow min-w-0">
                                <p className="text-[10px] text-gray-400 font-medium uppercase leading-none" style={{ fontFamily: bnFont }}>
                                    {isBn ? 'গন্তব্য' : 'Traveling To'}
                                </p>
                                <p className="text-[13px] font-semibold text-gray-800 leading-snug truncate" style={{ fontFamily: bnFont }}>
                                    {selectedCountryName}
                                </p>
                            </div>
                            <LuChevronRight className={`text-gray-400 w-3.5 h-3.5 flex-shrink-0 transition-transform ${showCountryDropdown ? 'rotate-90' : ''}`} />
                        </div>

                        {/* Country Dropdown */}
                        <AnimatePresence>
                            {showCountryDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-2xl z-[9999] max-h-[280px] flex flex-col"
                                >
                                    <div className="p-2.5 border-b border-gray-100">
                                        <input
                                            type="text"
                                            placeholder={isBn ? "দেশ খুঁজুন..." : "Search country..."}
                                            value={countrySearch}
                                            onChange={(e) => setCountrySearch(e.target.value)}
                                            className="w-full px-3 py-1.5 text-[13px] border border-gray-200 rounded-md outline-none focus:border-[#1D7EDD] transition-colors"
                                            style={{ fontFamily: bnFont }}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="overflow-y-auto max-h-[210px]">
                                        {filteredCountries.length > 0 ? (
                                            filteredCountries.map(c => (
                                                <button
                                                    key={c._id || c.slug}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setSelectedCountry(c.slug);
                                                        setShowCountryDropdown(false);
                                                        setCountrySearch("");
                                                    }}
                                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors text-[13px] cursor-pointer ${selectedCountry === c.slug ? 'bg-[#1D7EDD]/5 text-[#1D7EDD]' : 'text-gray-700'}`}
                                                    style={{ fontFamily: bnFont }}
                                                >
                                                    {c.flag && <span className="text-base flex-shrink-0 pointer-events-none">{c.flag}</span>}
                                                    <span className="font-medium truncate pointer-events-none">
                                                        {isBn && c.nameBn ? c.nameBn : c.name}
                                                    </span>
                                                    {c.region && (
                                                        <span className="ml-auto text-[10px] text-gray-400 font-medium flex-shrink-0 pointer-events-none">
                                                            {isBn && c.regionBn ? c.regionBn : c.region}
                                                        </span>
                                                    )}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="py-5 text-center text-gray-400 text-[13px]" style={{ fontFamily: bnFont }}>
                                                {isBn ? 'কোন দেশ পাওয়া যায়নি' : 'No countries found'}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Visa Category Selector */}
                    <div className="flex items-center gap-2.5 px-3 lg:px-4 py-2.5 border border-gray-100 rounded-lg bg-gray-50/30 hover:bg-white hover:border-[#1D7EDD]/30 transition-all cursor-pointer">
                        <LuTicket className="text-gray-400 w-[18px] h-[18px] flex-shrink-0" />
                        <div className="text-left flex-grow min-w-0">
                            <p className="text-[10px] text-gray-400 font-medium uppercase leading-none" style={{ fontFamily: bnFont }}>
                                {isBn ? 'ক্যাটাগরি' : 'Category'}
                            </p>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full text-[13px] font-semibold text-gray-800 bg-transparent outline-none cursor-pointer leading-snug"
                                style={{ fontFamily: bnFont }}
                            >
                                <option value="">{isBn ? "ভিসার ধরন নির্বাচন" : "Select Visa Type"}</option>
                                {visaCategories.map(cat => (
                                    <option key={cat._id} value={cat.slug}>
                                        {isBn && cat.nameBn ? cat.nameBn : cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </>
            );
        }

        // Default tab content (hotel, tour, flight)
        return (
            <>
                <div className="flex items-center gap-2.5 px-3 lg:px-4 py-2.5 border border-gray-100 rounded-lg bg-gray-50/30 hover:bg-white transition-all cursor-pointer">
                    <LuMapPin className="text-gray-400 w-[18px] h-[18px] flex-shrink-0" />
                    <div className="text-left">
                        <p className="text-[10px] text-gray-400 font-medium uppercase leading-none" style={{ fontFamily: bnFont }}>{t('destination')}</p>
                        <p className="text-[13px] font-semibold text-gray-800 leading-snug" style={{ fontFamily: bnFont }}>{t('selectLabel')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 px-3 lg:px-4 py-2.5 border border-gray-100 rounded-lg bg-gray-50/30 hover:bg-white transition-all cursor-pointer">
                    <LuCalendar className="text-gray-400 w-[18px] h-[18px] flex-shrink-0" />
                    <div className="text-left">
                        <p className="text-[10px] text-gray-400 font-medium uppercase leading-none">Date</p>
                        <p className="text-[13px] font-semibold text-gray-800 leading-snug">18 February, 2026</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 px-3 lg:px-4 py-2.5 border border-gray-100 rounded-lg bg-gray-50/30 hover:bg-white transition-all cursor-pointer">
                    <LuLayoutList className="text-gray-400 w-[18px] h-[18px] flex-shrink-0" />
                    <div className="text-left">
                        <p className="text-[10px] text-gray-400 font-medium uppercase leading-none" style={{ fontFamily: bnFont }}>{t('tourTypes')}</p>
                        <p className="text-[13px] font-semibold text-gray-800 leading-snug" style={{ fontFamily: bnFont }}>{t('selectLabel')}</p>
                    </div>
                </div>
            </>
        );
    };

    return (
        <section className="relative min-h-[100svh] lg:min-h-[75vh] flex flex-col bg-[#0a1a14]">
            {/* Background with Video + Gradient Fallback */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #0a1a14 0%, #0d2e1f 25%, #1a4a35 50%, #0f3d2a 75%, #0a1a14 100%)',
                    }}
                />
                <div
                    className="absolute inset-0 opacity-60"
                    style={{
                        background: 'radial-gradient(ellipse at 30% 50%, rgba(53, 144, 207, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(239, 140, 44, 0.1) 0%, transparent 50%)',
                    }}
                />
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedMetadata={() => {
                        if (videoRef.current) {
                            videoRef.current.defaultPlaybackRate = 0.75;
                            videoRef.current.playbackRate = 0.75;
                        }
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
                >
                    <source src="https://res.cloudinary.com/dyjx0hfwi/video/upload/v1772076798/hero_jnba7p.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40 lg:bg-transparent z-10" />
            </div>

            {/* Spacer for navbar */}
            <div className="h-24 lg:h-20 flex-shrink-0" />

            {/* Content Container */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-6 flex-1 flex flex-col items-center justify-center">
                {/* Hero Text */}
                <div className="flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-5"
                    >
                        <LuClock className="text-white w-3.5 h-3.5" />
                        <span className="text-white text-[9px] lg:text-[10px] font-bold tracking-widest uppercase" style={{ fontFamily: bnFont }}>
                            {t('openingHour')}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-black text-white mb-5 lg:mb-4 tracking-tight uppercase"
                        style={{
                            fontFamily: language === 'bn' ? '"Hind Siliguri", sans-serif' : '"Teko", sans-serif',
                            color: '#FFFFFF',
                            textShadow: '0 8px 30px rgba(0,0,0,0.5)',
                            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                            lineHeight: '0.95'
                        }}
                    >
                        {t('heroTitle')}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3 lg:mt-5 w-full max-w-sm sm:max-w-none"
                    >
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#EF8C2C] hover:bg-[#D97A1E] text-white rounded-lg font-semibold text-[12px] transition-all shadow-lg hover:-translate-y-0.5" style={{ fontFamily: bnFont }}>
                            <LuCalendarCheck className="w-3.5 h-3.5" />
                            {t('bookAppointment')}
                        </button>
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/25 text-white rounded-lg font-semibold text-[12px] transition-all hover:-translate-y-0.5" style={{ fontFamily: bnFont }}>
                            <LuMessageCircle className="w-3.5 h-3.5" />
                            {t('askQuestion')}
                        </button>
                    </motion.div>
                </div>

                {/* Search Interface */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-4xl w-full mx-auto mt-8 lg:mt-12"
                >
                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap gap-1 lg:gap-1.5 mb-0 justify-center lg:justify-start lg:ml-3 relative z-30">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3.5 lg:px-4 py-2 rounded-t-lg font-semibold text-[10px] lg:text-[12px] transition-all duration-200 ${activeTab === tab.id
                                    ? "bg-white text-[#1D7EDD] shadow-md"
                                    : "bg-white/80 backdrop-blur-md text-gray-600 hover:bg-white"
                                    }`}
                                style={{ fontFamily: bnFont }}
                            >
                                <span className={`text-sm ${activeTab === tab.id ? "text-[#1D7EDD]" : "text-[#EF8C2C]"}`}>
                                    {tab.icon}
                                </span>
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Search Card */}
                    <div className="bg-white rounded-xl lg:rounded-tl-none p-3 lg:p-5 shadow-2xl relative z-[40]" style={{ overflow: 'visible' }}>
                        <div className="flex flex-col lg:flex-row gap-2.5 lg:gap-3 items-stretch">
                            {/* Input Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-2.5 flex-grow w-full">
                                {renderSearchFields()}
                            </div>

                            {/* Action Button - Redesigned */}
                            <button
                                onClick={activeTab === "visa" ? handleVisaSearch : undefined}
                                className="w-full lg:w-auto px-6 py-3 lg:py-0 flex items-center justify-center gap-2 text-white rounded-lg font-semibold text-[13px] transition-all active:scale-[0.97] group flex-shrink-0"
                                style={{
                                    background: 'linear-gradient(135deg, #1D7EDD 0%, #1565c0 100%)',
                                    fontFamily: bnFont,
                                    boxShadow: '0 4px 15px rgba(29, 126, 221, 0.35)',
                                }}
                            >
                                {activeTab === "visa" ? (isBn ? 'আবেদন করুন' : 'Apply Now') : t('search')}
                                <LuArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Social & Hotline */}
            <div className="relative z-30 px-5 lg:px-10 py-4 lg:py-5 flex flex-col lg:flex-row items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-3">
                    {[
                        { icon: <FaFacebookF />, color: "hover:bg-[#1877F2]", name: "Facebook" },
                        { icon: <FaTwitter />, color: "hover:bg-[#1DA1F2]", name: "Twitter" },
                        { icon: <FaYoutube />, color: "hover:bg-[#FF0000]", name: "Youtube" },
                    ].map((social, i) => (
                        <motion.a
                            key={i}
                            href="#"
                            whileHover={{ y: -2 }}
                            className={`w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-[11px] transition-all ${social.color}`}
                        >
                            {social.icon}
                        </motion.a>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center lg:items-end">
                        <span className="text-white/60 text-[8px] font-bold tracking-widest uppercase mb-0.5" style={{ fontFamily: bnFont }}>{t('hotline247')}</span>
                        <a href="tel:+8801712114770" className="flex items-center gap-2 bg-white/15 backdrop-blur-lg border border-white/20 px-3.5 py-1.5 rounded-lg transition-all hover:bg-white/25">
                            <div className="w-5 h-5 rounded-full bg-[#EF8C2C] flex items-center justify-center text-white">
                                <LuPlane className="w-2.5 h-2.5 rotate-45" />
                            </div>
                            <span className="text-[13px] font-bold text-white tracking-wider leading-none">017 1211 4770</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
