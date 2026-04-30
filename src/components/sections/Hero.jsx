"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import {
    LuTicket,
    LuBed,
    LuMapPin,
    LuPlane,
    LuCalendar,
    LuSearch,
    LuChevronDown,
    LuClock,
    LuCalendarCheck,
    LuGlobe,
    LuArrowRight,
    LuStar,
    LuX,
    LuCheck,
} from "react-icons/lu";
import { FaFacebookF, FaTwitter, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
    useSiteSettings,
    buildWhatsAppUrl,
    buildTelUrl,
} from "@/context/SiteSettingsContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Brand tokens — single source of truth
const BRAND = {
    primary: "#1D7EDD",
    primaryDark: "#1565c0",
    accent: "#EF8C2C",
    accentDark: "#D97A1E",
    whatsapp: "#25D366",
    whatsappDark: "#1FB955",
};

// ─── Field Label ─────────────────────────────────────────────────────────────
const FieldLabel = ({ children, bnFont }) => (
    <p
        className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.08em] leading-none mb-1.5"
        style={{ fontFamily: bnFont }}
    >
        {children}
    </p>
);

// ─── Dropdown Component (Portal-based — escapes all stacking contexts) ──────
function Dropdown({ icon, label, value, placeholder, options, onSelect, onClear, searchable, bnFont, isBn }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
    const [mounted, setMounted] = useState(false);
    const triggerRef = useRef(null);
    const panelRef = useRef(null);

    useEffect(() => setMounted(true), []);

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setPos({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX,
            width: rect.width,
        });
    }, []);

    useEffect(() => {
        if (!open) return;
        updatePosition();
        const onScroll = () => updatePosition();
        const onResize = () => updatePosition();
        const onClickOutside = (e) => {
            const t = e.target;
            if (
                triggerRef.current && !triggerRef.current.contains(t) &&
                panelRef.current && !panelRef.current.contains(t)
            ) {
                setOpen(false);
                setSearch("");
            }
        };
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onResize);
        document.addEventListener("click", onClickOutside);
        return () => {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onResize);
            document.removeEventListener("click", onClickOutside);
        };
    }, [open, updatePosition]);

    const filtered = useMemo(() => {
        if (!searchable || !search.trim()) return options;
        const q = search.trim().toLowerCase();
        return options.filter(
            (o) =>
                o.label.toLowerCase().includes(q) ||
                (o.labelBn && o.labelBn.includes(search.trim()))
        );
    }, [options, search, searchable]);

    const selected = useMemo(
        () => options.find((o) => o.value === value),
        [options, value]
    );
    const displayValue = selected
        ? (isBn && selected.labelBn ? selected.labelBn : selected.label)
        : null;

    return (
        <div className="relative">
            {/* Trigger */}
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full h-[64px] flex items-center gap-3 pl-4 pr-12 rounded-xl border border-gray-200 bg-white hover:border-[#1D7EDD]/60 text-left cursor-pointer"
            >
                <span className="text-gray-400 flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                    <FieldLabel bnFont={bnFont}>{label}</FieldLabel>
                    <p
                        className={`text-[13px] font-semibold leading-snug truncate ${displayValue ? "text-gray-900" : "text-gray-400"}`}
                        style={{ fontFamily: bnFont }}
                    >
                        {displayValue || placeholder}
                    </p>
                </div>
            </button>

            {/* Right-side icons */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                {value && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClear();
                        }}
                        className="pointer-events-auto w-5 h-5 rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center cursor-pointer"
                        aria-label="Clear selection"
                    >
                        <LuX size={11} />
                    </button>
                )}
                <LuChevronDown
                    size={16}
                    className={open ? "rotate-180 text-[#1D7EDD]" : "text-gray-400"}
                />
            </div>

            {/* Dropdown panel — rendered in portal at document.body to escape stacking contexts */}
            {mounted && open && createPortal(
                <div
                    ref={panelRef}
                    style={{
                        position: "absolute",
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        zIndex: 9999,
                    }}
                    className="bg-white border border-gray-200 rounded-xl shadow-2xl shadow-black/20"
                >
                    {searchable && (
                        <div className="p-2 border-b border-gray-100">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={isBn ? "টাইপ করে খুঁজুন" : "Type to search"}
                                className="w-full px-3 py-2 text-[13px] bg-gray-50 rounded-lg outline-none text-gray-800 placeholder-gray-400"
                                style={{ fontFamily: bnFont }}
                            />
                        </div>
                    )}
                    <ul
                        role="listbox"
                        className="max-h-[280px] overflow-y-auto p-1 m-0 list-none"
                    >
                        {filtered.length > 0 ? (
                            filtered.map((opt) => {
                                const isSelected = value === opt.value;
                                const code = (opt.value || "").slice(0, 3).toUpperCase();
                                return (
                                    <li key={opt.value} className="m-0 p-0">
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => {
                                                onSelect(opt.value);
                                                setOpen(false);
                                                setSearch("");
                                            }}
                                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left cursor-pointer ${
                                                isSelected
                                                    ? "bg-[#1D7EDD]/10"
                                                    : "hover:bg-gray-100"
                                            }`}
                                        >
                                            {opt.flag && (
                                                <span className="text-lg flex-shrink-0 leading-none">
                                                    {opt.flag}
                                                </span>
                                            )}
                                            {opt.icon && !opt.flag && (
                                                <span className="text-gray-400 flex-shrink-0">{opt.icon}</span>
                                            )}
                                            <span className="flex-1 min-w-0 block">
                                                <span
                                                    className={`block text-[13px] font-semibold truncate leading-tight ${
                                                        isSelected ? "text-[#1D7EDD]" : "text-gray-900"
                                                    }`}
                                                    style={{ fontFamily: bnFont }}
                                                >
                                                    {isBn && opt.labelBn ? opt.labelBn : opt.label}
                                                </span>
                                                {opt.sub && (
                                                    <span className="block text-[11px] text-gray-500 truncate leading-tight mt-px">
                                                        {opt.sub}
                                                    </span>
                                                )}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold tracking-wider flex-shrink-0 ${
                                                    isSelected ? "text-[#1D7EDD]" : "text-gray-400"
                                                }`}
                                            >
                                                {isSelected ? <LuCheck size={14} /> : code}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li
                                className="py-8 text-center text-gray-400 text-[13px]"
                                style={{ fontFamily: bnFont }}
                            >
                                {isBn ? "কিছু পাওয়া যায়নি" : "No results found"}
                            </li>
                        )}
                    </ul>
                </div>,
                document.body
            )}
        </div>
    );
}

// ─── Date Field ──────────────────────────────────────────────────────────────
function DateField({ icon, label, value, onChange, bnFont }) {
    const today = new Date().toISOString().split("T")[0];
    return (
        <label className="group h-[64px] flex items-center gap-3 px-4 rounded-xl border border-gray-200 bg-white hover:border-[#1D7EDD]/60 hover:shadow-sm focus-within:border-[#1D7EDD] focus-within:ring-4 focus-within:ring-[#1D7EDD]/10 transition-all cursor-pointer">
            <span className="text-gray-400 group-hover:text-[#1D7EDD] transition-colors flex-shrink-0">
                {icon}
            </span>
            <div className="flex-1 min-w-0">
                <FieldLabel bnFont={bnFont}>{label}</FieldLabel>
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    min={today}
                    className="w-full text-[13px] font-semibold text-gray-900 bg-transparent outline-none cursor-pointer leading-snug"
                    style={{ colorScheme: "light" }}
                />
            </div>
        </label>
    );
}

// ─── Star Rating Picker ──────────────────────────────────────────────────────
function StarPicker({ value, onChange, isBn, bnFont }) {
    const stars = [
        { v: "3", label: "3★", labelBn: "৩★" },
        { v: "4", label: "4★", labelBn: "৪★" },
        { v: "5", label: "5★", labelBn: "৫★" },
    ];
    return (
        <div className="group h-[64px] flex items-center gap-3 px-4 rounded-xl border border-gray-200 bg-white hover:border-[#1D7EDD]/60 transition-all">
            <LuStar className="text-gray-400 group-hover:text-[#1D7EDD] transition-colors w-[18px] h-[18px] flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <FieldLabel bnFont={bnFont}>{isBn ? "তারকা রেটিং" : "Star Rating"}</FieldLabel>
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                            !value
                                ? "bg-[#1D7EDD] text-white shadow-sm"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        style={{ fontFamily: bnFont }}
                    >
                        {isBn ? "সব" : "All"}
                    </button>
                    {stars.map((s) => (
                        <button
                            key={s.v}
                            type="button"
                            onClick={() => onChange(value === s.v ? "" : s.v)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                value === s.v
                                    ? "bg-[#EF8C2C] text-white shadow-sm"
                                    : "bg-gray-100 text-gray-600 hover:bg-[#EF8C2C]/10 hover:text-[#EF8C2C]"
                            }`}
                        >
                            {isBn ? s.labelBn : s.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Fixed "From: Bangladesh" Field ──────────────────────────────────────────
function FromField({ isBn, bnFont }) {
    return (
        <div className="h-[64px] flex items-center gap-3 px-4 rounded-xl border border-gray-200 bg-gray-50/80">
            <span className="text-2xl flex-shrink-0">🇧🇩</span>
            <div className="flex-1 min-w-0">
                <FieldLabel bnFont={bnFont}>{isBn ? "থেকে" : "From"}</FieldLabel>
                <p
                    className="text-[13px] font-semibold text-gray-900 leading-snug"
                    style={{ fontFamily: bnFont }}
                >
                    {isBn ? "বাংলাদেশ" : "Bangladesh"}
                </p>
            </div>
        </div>
    );
}

// ─── Tab Button ──────────────────────────────────────────────────────────────
function TabButton({ active, icon, label, onClick, bnFont }) {
    return (
        <button
            type="button"
            onClick={onClick}
            role="tab"
            aria-selected={active}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-semibold text-[12px] transition-all duration-200 cursor-pointer ${
                active
                    ? "bg-white text-[#1D7EDD] shadow-[0_-2px_10px_rgba(0,0,0,0.08)]"
                    : "bg-white/80 backdrop-blur-md text-gray-600 hover:bg-white hover:text-gray-900"
            }`}
            style={{ fontFamily: bnFont }}
        >
            <span className={active ? "text-[#1D7EDD]" : "text-[#EF8C2C]"}>{icon}</span>
            {label}
            {active && (
                <motion.span
                    layoutId="active-tab"
                    className="absolute -bottom-px left-3 right-3 h-[3px] bg-[#1D7EDD] rounded-full"
                />
            )}
        </button>
    );
}

// ─── Search Submit Button ────────────────────────────────────────────────────
function SearchButton({ label, onClick, bnFont }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group h-[64px] w-full lg:w-auto px-7 flex items-center justify-center gap-2.5 rounded-xl text-white font-semibold text-[13px] tracking-wide transition-all active:scale-[0.98] hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            style={{
                background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)`,
                fontFamily: bnFont,
                boxShadow: `0 6px 20px ${BRAND.primary}55`,
            }}
        >
            <LuSearch size={16} />
            {label}
            <LuArrowRight
                size={15}
                className="group-hover:translate-x-0.5 transition-transform"
            />
        </button>
    );
}

// ─── Main Hero Component ─────────────────────────────────────────────────────
export default function Hero() {
    const [activeTab, setActiveTab] = useState("visa");
    const { t, language } = useLanguage();
    const { settings } = useSiteSettings();
    const videoRef = useRef(null);
    const router = useRouter();
    const isBn = language === "bn";
    const bnFont = isBn ? "Hind Siliguri, sans-serif" : undefined;

    // ── Data ──
    const [countries, setCountries] = useState([]);
    const [visaCategories, setVisaCategories] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [tours, setTours] = useState([]);

    // ── Visa State ──
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

    // Fetch all data from API
    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                const [cRes, vRes, hRes, tRes] = await Promise.all([
                    fetch(`${API_BASE}/api/countries/active`, { signal: ac.signal }),
                    fetch(`${API_BASE}/api/visa-categories/active`, { signal: ac.signal }),
                    fetch(`${API_BASE}/api/hotels/active`, { signal: ac.signal }).catch(() => null),
                    fetch(`${API_BASE}/api/tours/active`, { signal: ac.signal }).catch(() => null),
                ]);
                const [cData, vData] = await Promise.all([cRes.json(), vRes.json()]);
                if (cData.success && cData.data) setCountries(cData.data);
                if (vData.success && vData.data) setVisaCategories(vData.data);
                if (hRes) {
                    const hData = await hRes.json();
                    if (hData.success && hData.data) setHotels(hData.data);
                }
                if (tRes) {
                    const tData = await tRes.json();
                    if (tData.success && tData.data) setTours(tData.data);
                }
            } catch (err) {
                if (err.name !== "AbortError") console.error("Hero fetch error:", err);
            }
        })();
        return () => ac.abort();
    }, []);

    // ── Options ──
    // Show only countries that have at least one visa type configured
    const countryOptions = useMemo(
        () =>
            countries
                .filter((c) => Array.isArray(c.visaTypes) && c.visaTypes.length > 0)
                .map((c) => ({
                    value: c.slug,
                    label: c.name,
                    labelBn: c.nameBn,
                    flag: c.flag,
                    sub: isBn && c.regionBn ? c.regionBn : c.region,
                })),
        [countries, isBn]
    );

    // Only show visa categories that at least one country actually offers
    const categoryOptions = useMemo(() => {
        const usedNames = new Set();
        for (const c of countries) {
            for (const vt of c.visaTypes || []) {
                if (vt?.name) usedNames.add(vt.name.toLowerCase().trim());
            }
        }
        return visaCategories
            .filter((c) => usedNames.has((c.name || "").toLowerCase().trim()))
            .map((c) => ({
                value: c.slug,
                label: c.name,
                labelBn: c.nameBn,
            }));
    }, [visaCategories, countries]);

    // Derive unique hotel cities from API data
    const hotelCityOptions = useMemo(() => {
        const seen = new Set();
        const out = [];
        for (const h of hotels) {
            const city = h.city;
            if (!city || seen.has(city)) continue;
            seen.add(city);
            out.push({
                value: city,
                label: city,
                labelBn: h.cityBn || city,
                sub: h.country || h.location || "",
            });
        }
        return out;
    }, [hotels]);

    // Derive unique tour destinations from API data
    const tourDestOptions = useMemo(() => {
        const seen = new Set();
        const out = [];
        for (const t of tours) {
            const dest = t.destination;
            if (!dest || seen.has(dest)) continue;
            seen.add(dest);
            out.push({
                value: dest,
                label: dest,
                labelBn: t.destinationBn || dest,
                sub: t.country || "",
            });
        }
        return out;
    }, [tours]);

    // Derive unique tour categories from API data
    const tourTypeOptions = useMemo(() => {
        const labelMap = {
            adventure: { en: "Adventure", bn: "অ্যাডভেঞ্চার" },
            beach: { en: "Beach Tour", bn: "বিচ ট্যুর" },
            nature: { en: "Nature & Wildlife", bn: "প্রকৃতি ও বন্যপ্রাণী" },
            culture: { en: "Cultural", bn: "সাংস্কৃতিক" },
            historical: { en: "Historical", bn: "ঐতিহাসিক" },
            religious: { en: "Religious", bn: "ধর্মীয়" },
            hill: { en: "Hill Station", bn: "পাহাড়" },
            city: { en: "City Tour", bn: "সিটি ট্যুর" },
            international: { en: "International", bn: "আন্তর্জাতিক" },
            luxury: { en: "Luxury", bn: "বিলাসবহুল" },
        };
        const seen = new Set();
        const out = [];
        for (const t of tours) {
            const cat = t.category;
            if (!cat || seen.has(cat)) continue;
            seen.add(cat);
            const m = labelMap[cat];
            out.push({
                value: cat,
                label: m ? m.en : cat.charAt(0).toUpperCase() + cat.slice(1),
                labelBn: m ? m.bn : cat,
            });
        }
        return out;
    }, [tours]);

    // ── Search Handlers ──
    const handleVisaSearch = useCallback(() => {
        const params = new URLSearchParams();
        if (selectedCategory) params.set("category", selectedCategory);
        const path = selectedCountry ? `/visa/country/${selectedCountry}` : "/visa";
        const qs = params.toString();
        router.push(qs ? `${path}?${qs}` : path);
    }, [selectedCountry, selectedCategory, router]);

    const handleHotelSearch = useCallback(() => {
        const params = new URLSearchParams();
        if (hotelCity) params.set("city", hotelCity);
        if (hotelStar) params.set("star", hotelStar);
        if (hotelCheckIn) params.set("checkIn", hotelCheckIn);
        const qs = params.toString();
        router.push(qs ? `/hotel?${qs}` : "/hotel");
    }, [hotelCity, hotelStar, hotelCheckIn, router]);

    const handleTourSearch = useCallback(() => {
        const params = new URLSearchParams();
        if (tourDest) params.set("destination", tourDest);
        if (tourType) params.set("category", tourType);
        if (tourDate) params.set("date", tourDate);
        const qs = params.toString();
        router.push(qs ? `/tour?${qs}` : "/tour");
    }, [tourDest, tourType, tourDate, router]);

    // ── Tab Configuration ──
    const tabs = [
        { id: "visa", label: isBn ? "ভিসা" : "Visa", icon: <LuTicket size={14} /> },
        { id: "hotel", label: isBn ? "হোটেল" : "Hotel", icon: <LuBed size={14} /> },
        { id: "tour", label: isBn ? "ট্যুর" : "Tour", icon: <LuMapPin size={14} /> },
    ];

    const searchConfig = {
        visa: { handler: handleVisaSearch, btnLabel: isBn ? "ভিসা আবেদন" : "Apply Now" },
        hotel: { handler: handleHotelSearch, btnLabel: isBn ? "হোটেল খুঁজুন" : "Find Hotel" },
        tour: { handler: handleTourSearch, btnLabel: isBn ? "ট্যুর খুঁজুন" : "Find Tour" },
    };

    const fieldProps = { isBn, bnFont };

    return (
        <section className="relative min-h-[100svh] lg:min-h-[75vh] flex flex-col bg-[#0a1a14]">
            {/* Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(135deg, #0a1a14 0%, #0d2e1f 25%, #1a4a35 50%, #0f3d2a 75%, #0a1a14 100%)",
                    }}
                />
                <div
                    className="absolute inset-0 opacity-60"
                    style={{
                        background:
                            "radial-gradient(ellipse at 30% 50%, rgba(53,144,207,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(239,140,44,0.1) 0%, transparent 50%)",
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
                    <source
                        src="https://res.cloudinary.com/dyjx0hfwi/video/upload/hero_jnba7p.mp4"
                        type="video/mp4"
                    />
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-5"
                    >
                        <LuClock className="text-white w-3.5 h-3.5" />
                        <span
                            className="text-white text-[9px] lg:text-[10px] font-bold tracking-widest uppercase"
                            style={{ fontFamily: bnFont }}
                        >
                            {t("openingHour")}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-black text-white mb-5 lg:mb-4 tracking-tight uppercase"
                        style={{
                            fontFamily: isBn ? '"Hind Siliguri", sans-serif' : '"Teko", sans-serif',
                            color: "#FFFFFF",
                            textShadow: "0 8px 30px rgba(0,0,0,0.5)",
                            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                            lineHeight: "0.95",
                        }}
                    >
                        {t("heroTitle")}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3 lg:mt-5 w-full max-w-sm sm:max-w-none"
                    >
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#EF8C2C] hover:bg-[#D97A1E] text-white rounded-lg font-semibold text-[12px] transition-all shadow-lg hover:-translate-y-0.5"
                            style={{ fontFamily: bnFont }}
                        >
                            <LuCalendarCheck className="w-3.5 h-3.5" />
                            {isBn ? "বুকিং এর জন্য যোগাযোগ" : "Contact for booking"}
                        </Link>
                        <a
                            href={buildWhatsAppUrl(settings.whatsappNumber, isBn ? "ভিসা/ট্যুর সম্পর্কে জানতে চাই" : "I need help with visa/tour services")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1FB955] text-white rounded-lg font-semibold text-[12px] transition-all shadow-lg hover:-translate-y-0.5"
                            style={{ fontFamily: bnFont }}
                        >
                            <FaWhatsapp className="w-4 h-4" />
                            {isBn ? "প্রশ্ন করুন" : "Ask a question"}
                        </a>
                    </motion.div>
                </div>

                {/* ════════════════════════════════════════════════════════════════
                    SEARCH WIDGET — Tabs + Card (no Framer Motion to avoid hit-test offset)
                ════════════════════════════════════════════════════════════════ */}
                <div className="w-full max-w-5xl mx-auto mt-8 lg:mt-12">
                    {/* Tabs */}
                    <div
                        role="tablist"
                        className="flex gap-1 px-1 justify-center lg:justify-start"
                    >
                        {tabs.map((tab) => (
                            <TabButton
                                key={tab.id}
                                active={activeTab === tab.id}
                                icon={tab.icon}
                                label={tab.label}
                                onClick={() => setActiveTab(tab.id)}
                                bnFont={bnFont}
                            />
                        ))}
                    </div>

                    {/* Search Card */}
                    <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-3 lg:p-4">
                        <div
                            className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1.2fr_auto] gap-2.5"
                        >
                                {/* ─ VISA TAB ─ */}
                                {activeTab === "visa" && (
                                    <>
                                        <FromField {...fieldProps} />
                                        <Dropdown
                                            icon={<LuGlobe size={18} />}
                                            label={isBn ? "গন্তব্য দেশ" : "Destination"}
                                            value={selectedCountry}
                                            placeholder={isBn ? "দেশ নির্বাচন করুন" : "Select country"}
                                            options={countryOptions}
                                            onSelect={setSelectedCountry}
                                            onClear={() => setSelectedCountry("")}
                                            searchable
                                            {...fieldProps}
                                        />
                                        <Dropdown
                                            icon={<LuTicket size={18} />}
                                            label={isBn ? "ভিসার ধরন" : "Visa Type"}
                                            value={selectedCategory}
                                            placeholder={isBn ? "ক্যাটাগরি বাছুন" : "Select type"}
                                            options={categoryOptions}
                                            onSelect={setSelectedCategory}
                                            onClear={() => setSelectedCategory("")}
                                            {...fieldProps}
                                        />
                                    </>
                                )}

                                {/* ─ HOTEL TAB ─ */}
                                {activeTab === "hotel" && (
                                    <>
                                        <Dropdown
                                            icon={<LuMapPin size={18} />}
                                            label={isBn ? "গন্তব্য শহর" : "City"}
                                            value={hotelCity}
                                            placeholder={isBn ? "শহর নির্বাচন করুন" : "Select city"}
                                            options={hotelCityOptions}
                                            onSelect={setHotelCity}
                                            onClear={() => setHotelCity("")}
                                            searchable
                                            {...fieldProps}
                                        />
                                        <DateField
                                            icon={<LuCalendar size={18} />}
                                            label={isBn ? "চেক-ইন তারিখ" : "Check-in"}
                                            value={hotelCheckIn}
                                            onChange={setHotelCheckIn}
                                            bnFont={bnFont}
                                        />
                                        <StarPicker
                                            value={hotelStar}
                                            onChange={setHotelStar}
                                            {...fieldProps}
                                        />
                                    </>
                                )}

                                {/* ─ TOUR TAB ─ */}
                                {activeTab === "tour" && (
                                    <>
                                        <Dropdown
                                            icon={<LuMapPin size={18} />}
                                            label={isBn ? "গন্তব্য" : "Destination"}
                                            value={tourDest}
                                            placeholder={isBn ? "গন্তব্য বাছুন" : "Select destination"}
                                            options={tourDestOptions}
                                            onSelect={setTourDest}
                                            onClear={() => setTourDest("")}
                                            searchable
                                            {...fieldProps}
                                        />
                                        <Dropdown
                                            icon={<LuSearch size={18} />}
                                            label={isBn ? "ট্যুরের ধরন" : "Tour Type"}
                                            value={tourType}
                                            placeholder={isBn ? "ধরন বাছুন" : "Select type"}
                                            options={tourTypeOptions}
                                            onSelect={setTourType}
                                            onClear={() => setTourType("")}
                                            {...fieldProps}
                                        />
                                        <DateField
                                            icon={<LuCalendar size={18} />}
                                            label={isBn ? "ভ্রমণের তারিখ" : "Travel Date"}
                                            value={tourDate}
                                            onChange={setTourDate}
                                            bnFont={bnFont}
                                        />
                                    </>
                                )}

                            <SearchButton
                                label={searchConfig[activeTab]?.btnLabel}
                                onClick={searchConfig[activeTab]?.handler}
                                bnFont={bnFont}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-30 px-5 lg:px-10 py-4 lg:py-5 flex flex-col lg:flex-row items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-3">
                    {[
                        { key: "facebook", url: settings.social?.facebook, icon: <FaFacebookF />, hover: "hover:bg-[#1877F2]" },
                        { key: "twitter", url: settings.social?.twitter, icon: <FaTwitter />, hover: "hover:bg-[#1DA1F2]" },
                        { key: "youtube", url: settings.social?.youtube, icon: <FaYoutube />, hover: "hover:bg-[#FF0000]" },
                    ]
                        .filter((s) => s.url && s.url.trim())
                        .map((s) => (
                            <motion.a
                                key={s.key}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -2 }}
                                className={`w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-[11px] transition-all ${s.hover}`}
                            >
                                {s.icon}
                            </motion.a>
                        ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center lg:items-end">
                        <span
                            className="text-white/60 text-[8px] font-bold tracking-widest uppercase mb-0.5"
                            style={{ fontFamily: bnFont }}
                        >
                            {t("hotline247")}
                        </span>
                        <a
                            href={buildTelUrl(settings.contactPhone)}
                            className="flex items-center gap-2 bg-white/15 backdrop-blur-lg border border-white/20 px-3.5 py-1.5 rounded-lg transition-all hover:bg-white/25"
                        >
                            <div className="w-5 h-5 rounded-full bg-[#EF8C2C] flex items-center justify-center text-white">
                                <LuPlane className="w-2.5 h-2.5 rotate-45" />
                            </div>
                            <span className="text-[13px] font-bold text-white tracking-wider leading-none">
                                {settings.contactPhone}
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
