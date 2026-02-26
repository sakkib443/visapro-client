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
import CountryFlag, { preloadFlags } from "@/components/shared/CountryFlag";

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
    const [tours, setTours] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTour, setSelectedTour] = useState("");
    const [countrySearch, setCountrySearch] = useState("");
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const countryDropdownRef = useRef(null);

    // Fetch countries and visa categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [countriesRes, categoriesRes, toursRes] = await Promise.all([
                    fetch(`${API_BASE}/api/countries/active`),
                    fetch(`${API_BASE}/api/visa-categories/active`),
                    fetch(`${API_BASE}/api/tours/active`)
                ]);
                const countriesData = await countriesRes.json();
                const categoriesData = await categoriesRes.json();
                const toursData = await toursRes.json();

                if (countriesData.success && countriesData.data) {
                    setCountries(countriesData.data);
                    // Preload all flag SVGs immediately so they're cached before user opens dropdown
                    preloadFlags(countriesData.data.map(c => c.name));
                }
                if (categoriesData.success && categoriesData.data) {
                    setVisaCategories(categoriesData.data);
                }
                if (toursData.success && toursData.data) {
                    setTours(toursData.data);
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
        let sourceList = countries;

        // If tour tab is active, only show countries that have at least one tour
        if (activeTab === "tour") {
            // Support partial matching (e.g., "Cox's Bazar, Bangladesh" matches "Bangladesh")
            sourceList = countries.filter(c =>
                tours.some(t => {
                    const dest = t.destination.toLowerCase();
                    const countryName = c.name.toLowerCase();
                    return dest === countryName || dest.endsWith(`, ${countryName}`) || dest.includes(countryName);
                })
            );
        }

        if (!countrySearch) return sourceList;
        const q = countrySearch.toLowerCase();
        return sourceList.filter(c =>
            c.name.toLowerCase().includes(q) ||
            (c.nameBn && c.nameBn.includes(countrySearch))
        );
    }, [countries, tours, countrySearch, activeTab]);

    // Get selected country display name
    const selectedCountryName = useMemo(() => {
        if (!selectedCountry) return isBn ? 'দেশ নির্বাচন করুন' : 'Select Country';
        const c = countries.find(c => c.slug === selectedCountry);
        if (!c) return selectedCountry;
        return isBn && c.nameBn ? c.nameBn : c.name;
    }, [selectedCountry, countries, isBn]);

    const selectedCountryData = useMemo(() => {
        if (!selectedCountry) return null;
        return countries.find(c => c.slug === selectedCountry) || null;
    }, [selectedCountry, countries]);

    // Handle visa search
    const handleVisaSearch = () => {
        if (selectedCountry) {
            router.push(`/visa/country/${selectedCountry}`);
        } else {
            router.push('/visa');
        }
    };

    // Handle tour search
    const handleTourSearch = () => {
        if (selectedTour) {
            router.push(`/tour/${selectedTour}`);
        } else if (selectedCountry) {
            router.push(`/tour?country=${selectedCountry}`);
        } else {
            router.push('/tour');
        }
    };

    // Filter tours based on selected country
    const filteredToursByCountry = useMemo(() => {
        if (!selectedCountry) return tours;
        const selectedCountryNameRaw = countries.find(c => c.slug === selectedCountry)?.name;
        if (!selectedCountryNameRaw) return tours;
        return tours.filter(t => {
            const dest = t.destination.toLowerCase();
            const countryName = selectedCountryNameRaw.toLowerCase();
            return dest === countryName || dest.includes(countryName);
        });
    }, [tours, selectedCountry, countries]);

    const tabs = [
        { id: "visa", name: t('tabVisa'), icon: <LuTicket /> },
        { id: "tour", name: t('tabTour'), icon: <LuMapPin /> },
    ];

    const bnFont = language === 'bn' ? 'Hind Siliguri, sans-serif' : undefined;

    // Render search fields based on active tab
    const renderSearchFields = () => {
        if (activeTab === "visa") {
            return (
                <>
                    {/* FROM: Bangladesh (Fixed) */}
                    <div className="flex items-center gap-3 px-4 py-3 border border-gray-200/80 rounded-xl bg-gray-50/60">
                        <CountryFlag name="Bangladesh" size={26} />
                        <div className="text-left min-w-0">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5" style={{ fontFamily: bnFont }}>
                                {isBn ? 'থেকে' : 'From'}
                            </p>
                            <p className="text-[13px] font-bold text-gray-800 leading-snug" style={{ fontFamily: bnFont }}>
                                {isBn ? 'বাংলাদেশ' : 'Bangladesh'}
                            </p>
                        </div>
                    </div>

                    {/* TO: Country Destination */}
                    <div className={`relative ${showCountryDropdown ? 'z-[9999]' : 'z-0'}`} ref={countryDropdownRef}>
                        <div
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className={`flex items-center gap-3 px-4 py-3 border rounded-xl transition-all cursor-pointer select-none ${showCountryDropdown ? 'border-[#1D7EDD]/50 bg-white shadow-sm' : 'border-gray-200/80 bg-white/80 hover:border-[#1D7EDD]/30 hover:bg-white'}`}
                        >
                            <span className="flex-shrink-0">
                                {selectedCountryData ? <CountryFlag name={selectedCountryData.name} flag={selectedCountryData.flag} size={26} /> : <LuGlobe className="text-[#1D7EDD] w-5 h-5" />}
                            </span>
                            <div className="text-left flex-grow min-w-0">
                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5" style={{ fontFamily: bnFont }}>
                                    {isBn ? 'গন্তব্য' : 'Traveling To'}
                                </p>
                                <p className={`text-[13px] font-bold leading-snug truncate ${selectedCountry ? 'text-gray-800' : 'text-gray-400'}`} style={{ fontFamily: bnFont }}>
                                    {selectedCountryName}
                                </p>
                            </div>
                            <LuChevronRight className={`text-gray-300 w-4 h-4 flex-shrink-0 transition-transform duration-200 ${showCountryDropdown ? 'rotate-90' : ''}`} />
                        </div>

                        {/* Country Dropdown */}
                        <AnimatePresence>
                            {showCountryDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] max-h-[280px] overflow-y-auto"
                                    style={{ overscrollBehavior: 'contain' }}
                                >
                                    <div className="py-1">
                                        {filteredCountries.length > 0 ? (
                                            filteredCountries.map(c => (
                                                <div
                                                    key={c._id || c.slug}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCountry(c.slug || c._id);
                                                        setShowCountryDropdown(false);
                                                        setCountrySearch("");
                                                    }}
                                                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer select-none transition-colors ${selectedCountry === (c.slug || c._id) ? 'bg-[#1D7EDD]/8 text-[#1D7EDD]' : 'text-gray-700 hover:bg-gray-50'}`}
                                                    style={{ fontFamily: bnFont }}
                                                >
                                                    <CountryFlag name={c.name} flag={c.flag} size={22} />
                                                    <span className="text-[13px] font-semibold truncate flex-grow">
                                                        {isBn && c.nameBn ? c.nameBn : c.name}
                                                    </span>
                                                    {selectedCountry === (c.slug || c._id) && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#1D7EDD] flex-shrink-0" />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-6 text-center text-gray-400 text-[13px]" style={{ fontFamily: bnFont }}>
                                                {isBn ? 'কোন দেশ পাওয়া যায়নি' : 'No countries found'}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Visa Category Selector */}
                    <div className="flex items-center gap-3 px-4 py-3 border border-gray-200/80 rounded-xl bg-white/80 hover:border-[#1D7EDD]/30 hover:bg-white transition-all cursor-pointer">
                        <LuTicket className="text-[#1D7EDD] w-5 h-5 flex-shrink-0" />
                        <div className="text-left flex-grow min-w-0">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5" style={{ fontFamily: bnFont }}>
                                {isBn ? 'ক্যাটাগরি' : 'Category'}
                            </p>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full text-[13px] font-bold text-gray-800 bg-transparent outline-none cursor-pointer leading-snug appearance-none"
                                style={{ fontFamily: bnFont }}
                            >
                                <option value="">{isBn ? "ভিসার ধরন" : "Visa Type"}</option>
                                {visaCategories.map(cat => (
                                    <option key={cat._id} value={cat.slug}>
                                        {isBn && cat.nameBn ? cat.nameBn : cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <LuChevronRight className="text-gray-300 w-4 h-4 flex-shrink-0 rotate-90" />
                    </div>
                </>
            );
        }

        if (activeTab === "tour") {
            return (
                <>
                    {/* Destination */}
                    <div className={`relative ${showCountryDropdown ? 'z-[9999]' : 'z-0'}`} ref={countryDropdownRef}>
                        <div
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className={`flex items-center gap-3 px-4 py-3 border rounded-xl transition-all cursor-pointer select-none ${showCountryDropdown ? 'border-[#F97316]/50 bg-white shadow-sm' : 'border-gray-200/80 bg-white/80 hover:border-[#F97316]/30 hover:bg-white'}`}
                        >
                            <span className="flex-shrink-0">
                                {selectedCountryData ? <CountryFlag name={selectedCountryData.name} flag={selectedCountryData.flag} size={26} /> : <LuMapPin className="text-[#F97316] w-5 h-5" />}
                            </span>
                            <div className="text-left flex-grow min-w-0">
                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5" style={{ fontFamily: bnFont }}>
                                    {isBn ? 'গন্তব্য' : 'Destination'}
                                </p>
                                <p className={`text-[13px] font-bold leading-snug truncate ${selectedCountry ? 'text-gray-800' : 'text-gray-400'}`} style={{ fontFamily: bnFont }}>
                                    {selectedCountryName}
                                </p>
                            </div>
                            <LuChevronRight className={`text-gray-300 w-4 h-4 flex-shrink-0 transition-transform duration-200 ${showCountryDropdown ? 'rotate-90' : ''}`} />
                        </div>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {showCountryDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] max-h-[280px] overflow-y-auto"
                                    style={{ overscrollBehavior: 'contain' }}
                                >
                                    <div className="py-1">
                                        {filteredCountries.length > 0 ? (
                                            filteredCountries.map(c => (
                                                <div
                                                    key={c._id || c.slug}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCountry(c.slug || c._id);
                                                        setShowCountryDropdown(false);
                                                        setCountrySearch("");
                                                    }}
                                                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer select-none transition-colors ${selectedCountry === (c.slug || c._id) ? 'bg-[#F97316]/8 text-[#F97316]' : 'text-gray-700 hover:bg-gray-50'}`}
                                                    style={{ fontFamily: bnFont }}
                                                >
                                                    <CountryFlag name={c.name} flag={c.flag} size={22} />
                                                    <span className="text-[13px] font-semibold truncate flex-grow">
                                                        {isBn && c.nameBn ? c.nameBn : c.name}
                                                    </span>
                                                    {selectedCountry === (c.slug || c._id) && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-6 text-center text-gray-400 text-[13px]" style={{ fontFamily: bnFont }}>
                                                {isBn ? 'কোন গন্তব্য পাওয়া যায়নি' : 'No destination found'}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Select Tour */}
                    <div className="flex items-center gap-3 px-4 py-3 border border-gray-200/80 rounded-xl bg-white/80 hover:border-[#F97316]/30 hover:bg-white transition-all cursor-pointer">
                        <LuMapPin className="text-[#F97316] w-5 h-5 flex-shrink-0" />
                        <div className="text-left flex-grow min-w-0">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5" style={{ fontFamily: bnFont }}>{isBn ? 'ট্যুর প্যাকেজ' : 'Select Tour'}</p>
                            <select
                                value={selectedTour}
                                onChange={(e) => setSelectedTour(e.target.value)}
                                className="w-full text-[13px] font-bold text-gray-800 bg-transparent outline-none cursor-pointer leading-snug truncate appearance-none"
                                style={{ fontFamily: bnFont }}
                            >
                                <option value="">{isBn ? "ট্যুর নির্বাচন" : "Pick a Tour"}</option>
                                {filteredToursByCountry.map(t => (
                                    <option key={t._id} value={t.slug}>
                                        {isBn && t.titleBn ? t.titleBn : t.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <LuChevronRight className="text-gray-300 w-4 h-4 flex-shrink-0 rotate-90" />
                    </div>

                    {/* Tour Type */}
                    <div className="flex items-center gap-3 px-4 py-3 border border-gray-200/80 rounded-xl bg-white/80 hover:border-[#F97316]/30 hover:bg-white transition-all cursor-pointer">
                        <LuLayoutList className="text-[#F97316] w-5 h-5 flex-shrink-0" />
                        <div className="text-left flex-grow min-w-0">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5" style={{ fontFamily: bnFont }}>{isBn ? 'ট্যুর টাইপ' : 'Tour Type'}</p>
                            <select
                                className="w-full text-[13px] font-bold text-gray-800 bg-transparent outline-none cursor-pointer leading-snug appearance-none"
                                style={{ fontFamily: bnFont }}
                            >
                                <option value="">{isBn ? "সব ধরন" : "All Types"}</option>
                                <option value="Solo Tour">{isBn ? "একক ট্যুর" : "Solo Tour"}</option>
                                <option value="Group Tour">{isBn ? "গ্রুপ ট্যুর" : "Group Tour"}</option>
                                <option value="Family Tour">{isBn ? "ফ্যামিলি ট্যুর" : "Family Tour"}</option>
                                <option value="Couple Tour">{isBn ? "কাপল ট্যুর" : "Couple Tour"}</option>
                            </select>
                        </div>
                        <LuChevronRight className="text-gray-300 w-4 h-4 flex-shrink-0 rotate-90" />
                    </div>
                </>
            );
        }

        // Default tab content fallback
        return null;
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
                {/* Dark overlay — pointer-events-none so it never blocks clicks */}
                <div className="absolute inset-0 bg-black/40 lg:bg-transparent z-10 pointer-events-none" />
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
                                onClick={() => { setActiveTab(tab.id); setSelectedCountry(""); setSelectedTour(""); setShowCountryDropdown(false); }}
                                className={`flex items-center gap-1.5 px-4 lg:px-5 py-2.5 rounded-t-xl font-bold text-[11px] lg:text-[12px] transition-all duration-200 tracking-wide ${activeTab === tab.id
                                    ? "bg-white text-[#1D7EDD] shadow-lg"
                                    : "bg-white/80 backdrop-blur-md text-gray-500 hover:bg-white hover:text-gray-700"
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
                    <div className="bg-white rounded-2xl lg:rounded-tl-none p-4 lg:p-5 shadow-2xl relative z-[40]" style={{ overflow: 'visible' }}>
                        <div className="flex flex-col lg:flex-row gap-3 lg:gap-3 items-stretch" style={{ overflow: 'visible' }}>
                            {/* Input Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:gap-3 flex-grow w-full" style={{ overflow: 'visible' }}>
                                {renderSearchFields()}
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={activeTab === "visa" ? handleVisaSearch : handleTourSearch}
                                className="w-full lg:w-auto px-7 py-3.5 lg:py-0 flex items-center justify-center gap-2 text-white rounded-xl font-bold text-[13px] transition-all active:scale-[0.97] hover:shadow-xl group flex-shrink-0"
                                style={{
                                    background: activeTab === "visa"
                                        ? 'linear-gradient(135deg, #1D7EDD 0%, #1565c0 100%)'
                                        : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                                    fontFamily: bnFont,
                                    boxShadow: activeTab === "visa"
                                        ? '0 4px 20px rgba(29, 126, 221, 0.4)'
                                        : '0 4px 20px rgba(249, 115, 22, 0.4)',
                                }}
                            >
                                {activeTab === "visa" ? (isBn ? 'আবেদন করুন' : 'Apply Now') : (isBn ? 'খুঁজুন' : 'Search')}
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
