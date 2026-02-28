"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
    LuTicket,
    LuBed,
    LuMapPin,
    LuPlane,
    LuCalendar,
    LuSearch,
    LuChevronDown,
    LuClock,
    LuMessageCircle,
    LuCalendarCheck,
    LuGlobe,
    LuArrowRight,
    LuStar,
    LuX,
    LuCheck,
} from "react-icons/lu";
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Reusable Custom Dropdown ────────────────────────────────────────────────
function CustomDropdown({ icon, label, value, placeholder, options, onSelect, onClear, searchable, bnFont, isBn }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = useMemo(() => {
        if (!searchable || !search) return options;
        const q = search.toLowerCase();
        return options.filter(o => o.label.toLowerCase().includes(q) || (o.labelBn && o.labelBn.includes(search)));
    }, [options, search, searchable]);

    const displayValue = value ? (options.find(o => o.value === value)?.[isBn ? 'labelBn' : 'label'] || value) : null;

    return (
        <div className="relative h-full" ref={ref}>
            <button
                type="button"
                onClick={() => { setOpen(!open); setSearch(""); }}
                className="w-full h-full flex items-center gap-2.5 px-3 lg:px-4 py-2.5 border border-gray-100 rounded-lg bg-gray-50/30 hover:bg-white hover:border-[#1D7EDD]/40 transition-all text-left min-h-[56px]"
            >
                <span className="text-gray-400 flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center">
                    {icon}
                </span>
                <div className="flex-grow min-w-0">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1" style={{ fontFamily: bnFont }}>
                        {label}
                    </p>
                    <p className={`text-[13px] font-semibold leading-snug truncate ${displayValue ? 'text-gray-800' : 'text-gray-400'}`} style={{ fontFamily: bnFont }}>
                        {displayValue || placeholder}
                    </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    {value && (
                        <span
                            onClick={(e) => { e.stopPropagation(); onClear(); }}
                            className="w-4 h-4 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer"
                        >
                            <LuX size={9} />
                        </span>
                    )}
                    <LuChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.12 }}
                        className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        {searchable && (
                            <div className="p-2.5 border-b border-gray-50">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                    <LuSearch size={13} className="text-gray-400 flex-shrink-0" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder={isBn ? "খুঁজুন..." : "Search..."}
                                        className="flex-grow text-[13px] bg-transparent outline-none text-gray-700 placeholder-gray-400"
                                        style={{ fontFamily: bnFont }}
                                        autoFocus
                                    />
                                    {search && <button onClick={() => setSearch("")}><LuX size={11} className="text-gray-400" /></button>}
                                </div>
                            </div>
                        )}
                        <div className="max-h-[260px] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
                            {filtered.length > 0 ? filtered.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => { onSelect(opt.value); setOpen(false); setSearch(""); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all hover:bg-gray-50 ${value === opt.value ? 'bg-[#1D7EDD]/5' : ''}`}
                                >
                                    {opt.flag && <span className="text-base flex-shrink-0">{opt.flag}</span>}
                                    {opt.icon && <span className="flex-shrink-0 text-gray-400">{opt.icon}</span>}
                                    <div className="flex-grow min-w-0">
                                        <p className={`text-[13px] font-semibold truncate ${value === opt.value ? 'text-[#1D7EDD]' : 'text-gray-800'}`} style={{ fontFamily: bnFont }}>
                                            {isBn && opt.labelBn ? opt.labelBn : opt.label}
                                        </p>
                                        {opt.sub && <p className="text-[10px] text-gray-400">{opt.sub}</p>}
                                    </div>
                                    {value === opt.value && <LuCheck size={13} className="text-[#1D7EDD] flex-shrink-0" />}
                                </button>
                            )) : (
                                <div className="py-6 text-center text-gray-400 text-[13px]" style={{ fontFamily: bnFont }}>
                                    {isBn ? 'কিছু পাওয়া যায়নি' : 'No results found'}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Star Rating Picker ───────────────────────────────────────────────────────
function StarPicker({ value, onChange, isBn, bnFont }) {
    const stars = [
        { v: '3', label: '3★', labelBn: '৩★' },
        { v: '4', label: '4★', labelBn: '৪★' },
        { v: '5', label: '5★', labelBn: '৫★' },
    ];
    return (
        <div className="flex items-center gap-2.5 px-3 lg:px-4 py-2.5 border border-gray-100 rounded-lg bg-gray-50/30 hover:bg-white transition-all min-h-[56px]">
            <LuStar className="text-gray-400 w-[18px] h-[18px] flex-shrink-0" />
            <div className="flex-grow min-w-0">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-2" style={{ fontFamily: bnFont }}>
                    {isBn ? 'তারকা রেটিং' : 'Star Rating'}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${!value ? 'bg-[#1D7EDD] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        style={{ fontFamily: bnFont }}
                    >
                        {isBn ? 'সব' : 'All'}
                    </button>
                    {stars.map(s => (
                        <button
                            key={s.v}
                            type="button"
                            onClick={() => onChange(value === s.v ? '' : s.v)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${value === s.v ? 'bg-[#EF8C2C] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-[#EF8C2C]/10 hover:text-[#EF8C2C]'}`}
                        >
                            {isBn ? s.labelBn : s.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Date Field ───────────────────────────────────────────────────────────────
function DateField({ icon, label, value, onChange, bnFont }) {
    const today = new Date().toISOString().split('T')[0];
    return (
        <div className="flex items-center gap-2.5 px-3 lg:px-4 py-2.5 border border-gray-100 rounded-lg bg-gray-50/30 hover:bg-white hover:border-[#1D7EDD]/40 transition-all min-h-[56px]">
            {icon}
            <div className="flex-grow min-w-0">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1" style={{ fontFamily: bnFont }}>
                    {label}
                </p>
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    min={today}
                    className="w-full text-[13px] font-semibold text-gray-700 bg-transparent outline-none leading-snug cursor-pointer"
                    style={{ colorScheme: 'light' }}
                />
            </div>
        </div>
    );
}

// ─── Main Hero Component ──────────────────────────────────────────────────────
export default function Hero() {
    const [activeTab, setActiveTab] = useState("visa");
    const { t, language } = useLanguage();
    const videoRef = useRef(null);
    const router = useRouter();
    const isBn = language === 'bn';
    const bnFont = isBn ? 'Hind Siliguri, sans-serif' : undefined;

    // ── Visa State ──
    const [countries, setCountries] = useState([]);
    const [visaCategories, setVisaCategories] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // ── Hotel State ──
    const [hotelCity, setHotelCity] = useState("");
    const [hotelCheckIn, setHotelCheckIn] = useState("");
    const [hotelStar, setHotelStar] = useState("");

    // ── Tour State ──
    const [tourDest, setTourDest] = useState("");
    const [tourType, setTourType] = useState("");
    const [tourDate, setTourDate] = useState("");

    // Fetch API data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cRes, vRes] = await Promise.all([
                    fetch(`${API_BASE}/api/countries/active`),
                    fetch(`${API_BASE}/api/visa-categories/active`),
                ]);
                const cData = await cRes.json();
                const vData = await vRes.json();
                if (cData.success && cData.data) setCountries(cData.data);
                if (vData.success && vData.data) setVisaCategories(vData.data);
            } catch (err) {
                console.error("Hero fetch error:", err);
            }
        };
        fetchData();
    }, []);

    // ── Options ──
    const countryOptions = useMemo(() => countries.map(c => ({
        value: c.slug,
        label: c.name,
        labelBn: c.nameBn,
        flag: c.flag,
        sub: isBn && c.regionBn ? c.regionBn : c.region,
    })), [countries, isBn]);

    const categoryOptions = useMemo(() => visaCategories.map(c => ({
        value: c.slug,
        label: c.name,
        labelBn: c.nameBn,
    })), [visaCategories]);

    const hotelCityOptions = [
        { value: 'Dhaka', label: 'Dhaka', labelBn: 'ঢাকা', flag: '🇧🇩', sub: 'Bangladesh' },
        { value: "Cox's Bazar", label: "Cox's Bazar", labelBn: 'কক্সবাজার', flag: '🇧🇩', sub: 'Bangladesh' },
        { value: 'Sylhet', label: 'Sylhet', labelBn: 'সিলেট', flag: '🇧🇩', sub: 'Bangladesh' },
        { value: 'Dubai', label: 'Dubai', labelBn: 'দুবাই', flag: '🇦🇪', sub: 'UAE' },
        { value: 'Singapore', label: 'Singapore', labelBn: 'সিঙ্গাপুর', flag: '🇸🇬', sub: 'Singapore' },
        { value: 'Kuala Lumpur', label: 'Kuala Lumpur', labelBn: 'কুয়ালালামপুর', flag: '🇲🇾', sub: 'Malaysia' },
        { value: 'Bangkok', label: 'Bangkok', labelBn: 'ব্যাংকক', flag: '🇹🇭', sub: 'Thailand' },
        { value: 'Kathmandu', label: 'Kathmandu', labelBn: 'কাঠমান্ডু', flag: '🇳🇵', sub: 'Nepal' },
    ];

    const tourDestOptions = [
        { value: 'sundarbans', label: 'Sundarbans', labelBn: 'সুন্দরবন', flag: '🇧🇩', sub: 'Bangladesh' },
        { value: 'coxs-bazar', label: "Cox's Bazar", labelBn: 'কক্সবাজার', flag: '🇧🇩', sub: 'Bangladesh' },
        { value: 'sajek', label: 'Sajek Valley', labelBn: 'সাজেক ভ্যালি', flag: '🇧🇩', sub: 'Bangladesh' },
        { value: 'sylhet', label: 'Sylhet Tea Garden', labelBn: 'সিলেট চা বাগান', flag: '🇧🇩', sub: 'Bangladesh' },
        { value: 'dubai', label: 'Dubai', labelBn: 'দুবাই', flag: '🇦🇪', sub: 'UAE' },
        { value: 'bangkok', label: 'Bangkok & Phuket', labelBn: 'ব্যাংকক ও ফুকেট', flag: '🇹🇭', sub: 'Thailand' },
        { value: 'kuala-lumpur', label: 'Kuala Lumpur', labelBn: 'কুয়ালালামপুর', flag: '🇲🇾', sub: 'Malaysia' },
        { value: 'nepal', label: 'Nepal Trekking', labelBn: 'নেপাল ট্রেকিং', flag: '🇳🇵', sub: 'Nepal' },
    ];

    const tourTypeOptions = [
        { value: 'group', label: 'Group Tour', labelBn: 'গ্রুপ ট্যুর' },
        { value: 'family', label: 'Family Tour', labelBn: 'ফ্যামিলি ট্যুর' },
        { value: 'couple', label: 'Honeymoon Tour', labelBn: 'হানিমুন ট্যুর' },
        { value: 'adventure', label: 'Adventure Tour', labelBn: 'অ্যাডভেঞ্চার ট্যুর' },
        { value: 'nature', label: 'Nature & Wildlife', labelBn: 'প্রকৃতি ও বন্যপ্রাণী' },
        { value: 'beach', label: 'Beach Tour', labelBn: 'বিচ ট্যুর' },
    ];

    // ── Search Handlers ──
    const handleVisaSearch = () => {
        if (selectedCountry) router.push(`/visa/country/${selectedCountry}`);
        else router.push('/visa');
    };

    const handleHotelSearch = () => {
        const p = new URLSearchParams();
        if (hotelCity) p.set('city', hotelCity);
        if (hotelStar) p.set('star', hotelStar);
        if (hotelCheckIn) p.set('checkIn', hotelCheckIn);
        router.push(p.toString() ? `/hotel?${p}` : '/hotel');
    };

    const handleTourSearch = () => {
        const p = new URLSearchParams();
        if (tourDest) p.set('destination', tourDest);
        if (tourType) p.set('category', tourType);
        if (tourDate) p.set('date', tourDate);
        router.push(p.toString() ? `/tour?${p}` : '/tour');
    };

    // ── Tabs (no flight) ──
    const tabs = [
        { id: "visa", label: isBn ? 'ভিসা' : 'Visa', icon: <LuTicket size={14} /> },
        { id: "hotel", label: isBn ? 'হোটেল' : 'Hotel', icon: <LuBed size={14} /> },
        { id: "tour", label: isBn ? 'ট্যুর' : 'Tour', icon: <LuMapPin size={14} /> },
    ];

    const searchConfig = {
        visa: { handler: handleVisaSearch, btnLabel: isBn ? 'ভিসা আবেদন' : 'Apply Now' },
        hotel: { handler: handleHotelSearch, btnLabel: isBn ? 'হোটেল খুঁজুন' : 'Find Hotel' },
        tour: { handler: handleTourSearch, btnLabel: isBn ? 'ট্যুর খুঁজুন' : 'Find Tour' },
    };

    const fieldProps = { isBn, bnFont };

    return (
        <section className="relative min-h-[100svh] lg:min-h-[75vh] flex flex-col overflow-hidden bg-[#0a1a14]">
            {/* Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a1a14 0%, #0d2e1f 25%, #1a4a35 50%, #0f3d2a 75%, #0a1a14 100%)' }} />
                <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(53,144,207,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(239,140,44,0.1) 0%, transparent 50%)' }} />
                <video
                    ref={videoRef}
                    autoPlay loop muted playsInline
                    onLoadedMetadata={() => { if (videoRef.current) { videoRef.current.defaultPlaybackRate = 0.75; videoRef.current.playbackRate = 0.75; } }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
                >
                    <source src="https://res.cloudinary.com/dyjx0hfwi/video/upload/hero_jnba7p.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40 lg:bg-transparent z-10" />
            </div>

            {/* Navbar spacer */}
            <div className="h-24 lg:h-20 flex-shrink-0" />

            {/* Content */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-6 flex-1 flex flex-col items-center justify-center">

                {/* Hero Text */}
                <div className="flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-5"
                    >
                        <LuClock className="text-white w-3.5 h-3.5" />
                        <span className="text-white text-[9px] lg:text-[10px] font-bold tracking-widest uppercase" style={{ fontFamily: bnFont }}>
                            {t('openingHour')}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-black text-white mb-5 lg:mb-4 tracking-tight uppercase"
                        style={{
                            fontFamily: isBn ? '"Hind Siliguri", sans-serif' : '"Teko", sans-serif',
                            color: '#FFFFFF',
                            textShadow: '0 8px 30px rgba(0,0,0,0.5)',
                            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                            lineHeight: '0.95',
                        }}
                    >
                        {t('heroTitle')}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
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

                {/* ── Search Box ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-4xl w-full mx-auto mt-8 lg:mt-12"
                >
                    {/* Tab Buttons */}
                    <div className="flex gap-1 lg:gap-1.5 mb-0 justify-center lg:justify-start lg:ml-3 relative z-30">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3.5 lg:px-4 py-2 rounded-t-lg font-semibold text-[10px] lg:text-[12px] transition-all duration-200 ${activeTab === tab.id
                                    ? "bg-white text-[#1D7EDD] shadow-md"
                                    : "bg-white/80 backdrop-blur-md text-gray-600 hover:bg-white"}`}
                                style={{ fontFamily: bnFont }}
                            >
                                <span className={activeTab === tab.id ? "text-[#1D7EDD]" : "text-[#EF8C2C]"}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Card */}
                    <div className="bg-white rounded-xl lg:rounded-tl-none p-3 lg:p-5 shadow-2xl relative">
                        <AnimatePresence mode="sync">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.15 }}
                                className="flex flex-col lg:flex-row gap-2.5 lg:gap-2 items-stretch"
                            >
                                {/* ─ VISA TAB ─ */}
                                {activeTab === "visa" && (
                                    <>
                                        {/* From: Bangladesh (fixed) */}
                                        <div className="flex items-center gap-2.5 px-3 lg:px-4 py-2.5 border border-gray-100 rounded-lg bg-gray-50 min-h-[56px]">
                                            <span className="text-xl flex-shrink-0">🇧🇩</span>
                                            <div>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1" style={{ fontFamily: bnFont }}>
                                                    {isBn ? 'থেকে' : 'From'}
                                                </p>
                                                <p className="text-[13px] font-semibold text-gray-700 leading-snug" style={{ fontFamily: bnFont }}>
                                                    {isBn ? 'বাংলাদেশ' : 'Bangladesh'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* To: Country */}
                                        <div className="flex-1 min-w-0">
                                            <CustomDropdown
                                                icon={<LuGlobe size={16} />}
                                                label={isBn ? 'গন্তব্য দেশ' : 'Destination'}
                                                value={selectedCountry}
                                                placeholder={isBn ? 'দেশ নির্বাচন করুন' : 'Select country'}
                                                options={countryOptions}
                                                onSelect={setSelectedCountry}
                                                onClear={() => setSelectedCountry('')}
                                                searchable={true}
                                                {...fieldProps}
                                            />
                                        </div>

                                        {/* Visa Type */}
                                        <div className="flex-1 min-w-0">
                                            <CustomDropdown
                                                icon={<LuTicket size={16} />}
                                                label={isBn ? 'ভিসার ধরন' : 'Visa Type'}
                                                value={selectedCategory}
                                                placeholder={isBn ? 'ক্যাটাগরি বাছুন' : 'Select type'}
                                                options={categoryOptions}
                                                onSelect={setSelectedCategory}
                                                onClear={() => setSelectedCategory('')}
                                                searchable={false}
                                                {...fieldProps}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* ─ HOTEL TAB ─ */}
                                {activeTab === "hotel" && (
                                    <>
                                        <div className="flex-1 min-w-0">
                                            <CustomDropdown
                                                icon={<LuMapPin size={16} />}
                                                label={isBn ? 'গন্তব্য শহর' : 'Destination City'}
                                                value={hotelCity}
                                                placeholder={isBn ? 'শহর নির্বাচন করুন' : 'Select city'}
                                                options={hotelCityOptions}
                                                onSelect={setHotelCity}
                                                onClear={() => setHotelCity('')}
                                                searchable={false}
                                                {...fieldProps}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <DateField
                                                icon={<LuCalendar className="text-gray-400 w-[18px] h-[18px] flex-shrink-0" />}
                                                label={isBn ? 'চেক-ইন তারিখ' : 'Check-in Date'}
                                                value={hotelCheckIn}
                                                onChange={setHotelCheckIn}
                                                bnFont={bnFont}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <StarPicker value={hotelStar} onChange={setHotelStar} {...fieldProps} />
                                        </div>
                                    </>
                                )}

                                {/* ─ TOUR TAB ─ */}
                                {activeTab === "tour" && (
                                    <>
                                        <div className="flex-1 min-w-0">
                                            <CustomDropdown
                                                icon={<LuMapPin size={16} />}
                                                label={isBn ? 'গন্তব্য' : 'Destination'}
                                                value={tourDest}
                                                placeholder={isBn ? 'গন্তব্য বাছুন' : 'Select destination'}
                                                options={tourDestOptions}
                                                onSelect={setTourDest}
                                                onClear={() => setTourDest('')}
                                                searchable={false}
                                                {...fieldProps}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <CustomDropdown
                                                icon={<LuSearch size={16} />}
                                                label={isBn ? 'ট্যুরের ধরন' : 'Tour Type'}
                                                value={tourType}
                                                placeholder={isBn ? 'ধরন বাছুন' : 'Select type'}
                                                options={tourTypeOptions}
                                                onSelect={setTourType}
                                                onClear={() => setTourType('')}
                                                searchable={false}
                                                {...fieldProps}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <DateField
                                                icon={<LuCalendar className="text-gray-400 w-[18px] h-[18px] flex-shrink-0" />}
                                                label={isBn ? 'ভ্রমণের তারিখ' : 'Travel Date'}
                                                value={tourDate}
                                                onChange={setTourDate}
                                                bnFont={bnFont}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Search Button */}
                                <button
                                    type="button"
                                    onClick={searchConfig[activeTab]?.handler}
                                    className="w-full lg:w-auto px-6 py-3 lg:py-0 flex items-center justify-center gap-2 text-white rounded-lg font-semibold text-[13px] transition-all active:scale-[0.97] group flex-shrink-0"
                                    style={{
                                        background: 'linear-gradient(135deg, #1D7EDD 0%, #1565c0 100%)',
                                        fontFamily: bnFont,
                                        boxShadow: '0 4px 15px rgba(29, 126, 221, 0.35)',
                                    }}
                                >
                                    <LuSearch size={15} />
                                    {searchConfig[activeTab]?.btnLabel}
                                    <LuArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-30 px-5 lg:px-10 py-4 lg:py-5 flex flex-col lg:flex-row items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-3">
                    {[
                        { icon: <FaFacebookF />, hover: "hover:bg-[#1877F2]" },
                        { icon: <FaTwitter />, hover: "hover:bg-[#1DA1F2]" },
                        { icon: <FaYoutube />, hover: "hover:bg-[#FF0000]" },
                    ].map((s, i) => (
                        <motion.a key={i} href="#" whileHover={{ y: -2 }}
                            className={`w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-[11px] transition-all ${s.hover}`}>
                            {s.icon}
                        </motion.a>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center lg:items-end">
                        <span className="text-white/60 text-[8px] font-bold tracking-widest uppercase mb-0.5" style={{ fontFamily: bnFont }}>
                            {t('hotline247')}
                        </span>
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
