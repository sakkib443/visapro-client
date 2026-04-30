"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuSearch,
    LuStar,
    LuFilter,
    LuChevronDown,
    LuLayoutGrid,
    LuList,
    LuArrowRight,
    LuCompass,
    LuLoader,
    LuBed,
    LuMapPin,
    LuWifi,
    LuUsers,
} from "react-icons/lu";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import BookingModal from "@/components/shared/BookingModal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const hotelCategories = [
    { en: "All Hotels", bn: "সব হোটেল", key: "all" },
    { en: "Luxury", bn: "বিলাসবহুল", key: "luxury" },
    { en: "Mid-Range", bn: "মধ্যম মানের", key: "mid-range" },
    { en: "Budget", bn: "বাজেট", key: "budget" },
    { en: "Boutique", bn: "বুটিক", key: "boutique" },
    { en: "Resort", bn: "রিসোর্ট", key: "resort" },
    { en: "Business", bn: "বিজনেস", key: "business" },
    { en: "Hostel", bn: "হোস্টেল", key: "hostel" },
];

const starFilters = [
    { en: "All Stars", bn: "সব রেটিং", key: "all" },
    { en: "5 Stars", bn: "৫ তারকা", key: "5" },
    { en: "4 Stars", bn: "৪ তারকা", key: "4" },
    { en: "3 Stars", bn: "৩ তারকা", key: "3" },
    { en: "2 Stars", bn: "২ তারকা", key: "2" },
    { en: "1 Star", bn: "১ তারকা", key: "1" },
];

function HotelContent() {
    const { language } = useLanguage();
    const isBn = language === 'bn';
    const fontFamily = isBn ? 'Hind Siliguri, sans-serif' : 'Poppins, sans-serif';
    const headingFont = isBn ? 'Hind Siliguri, sans-serif' : 'Teko, sans-serif';

    const searchParams = useSearchParams();
    const initialCity = searchParams.get("city") || "";
    const initialStar = searchParams.get("star") || "all";
    const initialCheckIn = searchParams.get("checkIn") || "";

    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialCity);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStar, setSelectedStar] = useState(initialStar);
    const [checkInDate, setCheckInDate] = useState(initialCheckIn);
    const [priceRange, setPriceRange] = useState(50000);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("Featured");
    const [showFilters, setShowFilters] = useState(false);
    const [bookingModal, setBookingModal] = useState({ open: false, hotel: null });

    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/api/hotels/active`);
                const data = await res.json();
                if (data.success && data.data) {
                    setHotels(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch hotels:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    const filteredHotels = useMemo(() => {
        return hotels.filter(hotel => {
            const matchesSearch =
                hotel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                hotel.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                hotel.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (hotel.nameBn && hotel.nameBn.includes(searchQuery)) ||
                (hotel.cityBn && hotel.cityBn.includes(searchQuery));

            const matchesCategory = selectedCategory === "all" || hotel.hotelCategory === selectedCategory;
            const matchesStar = selectedStar === "all" || hotel.starRating === Number(selectedStar);
            const matchesPrice = (hotel.pricePerNight || 0) <= priceRange;

            return matchesSearch && matchesCategory && matchesStar && matchesPrice;
        });
    }, [hotels, searchQuery, selectedCategory, selectedStar, priceRange]);

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedStar("all");
        setCheckInDate("");
        setPriceRange(50000);
    };

    const getCurrencySymbol = (currency) => {
        return currency === 'USD' ? '$' : '৳';
    };

    const renderStars = (count) => {
        return Array.from({ length: 5 }, (_, i) => (
            <LuStar
                key={i}
                size={11}
                className={i < count ? 'fill-[#EF8C2C] text-[#EF8C2C]' : 'text-gray-200'}
            />
        ));
    };



    return (
        <>
        <div className="bg-[#F8FAFC] min-h-screen text-[#021E14]" style={{ fontFamily }}>
            {/* 1. Hero Section */}
            <section className="relative py-14 md:py-20 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url('/images/hotel-hero-bg.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <div className="absolute inset-0 bg-[#021E14]/50" />
                </div>

                <div className="relative z-10 max-w-4xl w-full px-4 text-center flex flex-col items-center">
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4"
                        style={{ color: 'rgba(255,255,255,0.7)', fontFamily }}
                    >
                        {isBn ? 'আপনার স্বপ্নের হোটেল খুঁজুন' : 'Find Your Perfect Stay'}
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4"
                        style={{ fontFamily: headingFont, color: '#FFFFFF' }}
                    >
                        {isBn ? 'হোটেল ' : 'Hotel '}<span style={{ color: '#EF8C2C' }}>{isBn ? 'বুকিং' : 'Booking'}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-sm font-normal mb-8 max-w-md"
                        style={{ color: 'rgba(255,255,255,0.6)', fontFamily }}
                    >
                        {isBn
                            ? 'সেরা মানের হোটেলে আরামদায়ক রাত কাটান সেরা মূল্যে।'
                            : 'Experience comfort and luxury at the best hotels with unbeatable prices.'}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="w-full max-w-xl relative group mx-auto"
                    >
                        <LuSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10" size={18} />
                        <input
                            type="text"
                            placeholder={isBn ? "শহর বা হোটেলের নাম খুঁজুন..." : "Search by city or hotel name..."}
                            className="w-full pl-12 pr-4 sm:pr-32 py-4 bg-white/95 backdrop-blur-md rounded-2xl text-sm font-normal shadow-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            style={{ fontFamily }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="hidden sm:block absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-[#021E14] text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-primary transition-all" style={{ fontFamily }}>
                            {isBn ? 'সার্চ' : 'Search'}
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* 2. Main Body Layout */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-16">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-lg border border-gray-200 text-sm font-bold text-gray-700 shadow-sm"
                        style={{ fontFamily }}
                    >
                        <LuFilter size={16} />
                        {showFilters ? (isBn ? 'ফিল্টার লুকান' : 'Hide Filters') : (isBn ? 'ফিল্টার দেখান' : 'Show Filters')}
                        <LuChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

                    {/* LEFT SIDEBAR */}
                    <aside className={`w-full lg:w-[300px] flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="lg:sticky lg:top-32 space-y-5">
                            <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden">
                                {/* Sidebar Header */}
                                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="text-lg font-black text-[#021E14] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: headingFont }}>
                                        <LuFilter size={16} style={{ color: '#EF8C2C' }} /> {isBn ? 'ফিল্টার' : 'Filters'}
                                    </h3>
                                    <button
                                        onClick={resetFilters}
                                        className="text-[10px] font-semibold uppercase tracking-wider hover:underline"
                                        style={{ color: '#3590CF', fontFamily }}
                                    >
                                        {isBn ? 'সব রিসেট' : 'Reset All'}
                                    </button>
                                </div>

                                {/* Hotel Category */}
                                <div className="px-5 py-5 border-b border-gray-100">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily }}>{isBn ? 'ক্যাটেগরি' : 'Category'}</h4>
                                    <div className="space-y-0.5">
                                        {hotelCategories.map(cat => (
                                            <button
                                                key={cat.key}
                                                onClick={() => setSelectedCategory(cat.key)}
                                                className={`w-full text-left px-3 py-2 rounded transition-all text-[13px] flex items-center justify-between ${selectedCategory === cat.key
                                                    ? "bg-gray-100 text-[#021E14] font-semibold"
                                                    : "text-gray-600 hover:bg-gray-50 font-normal"
                                                    }`}
                                                style={{ fontFamily }}
                                            >
                                                {isBn ? cat.bn : cat.en}
                                                {selectedCategory === cat.key && (
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#EF8C2C' }} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Star Rating Filter */}
                                <div className="px-5 py-5 border-b border-gray-100">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily }}>{isBn ? 'তারকা রেটিং' : 'Star Rating'}</h4>
                                    <div className="space-y-0.5">
                                        {starFilters.map(star => (
                                            <button
                                                key={star.key}
                                                onClick={() => setSelectedStar(star.key)}
                                                className={`w-full text-left px-3 py-2 rounded transition-all text-[13px] flex items-center justify-between ${selectedStar === star.key
                                                    ? "bg-gray-100 text-[#021E14] font-semibold"
                                                    : "text-gray-600 hover:bg-gray-50 font-normal"
                                                    }`}
                                                style={{ fontFamily }}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {star.key !== 'all' && (
                                                        <span className="flex">
                                                            {Array.from({ length: Number(star.key) }, (_, i) => (
                                                                <LuStar key={i} size={10} className="text-[#EF8C2C] fill-[#EF8C2C]" />
                                                            ))}
                                                        </span>
                                                    )}
                                                    {isBn ? star.bn : star.en}
                                                </span>
                                                {selectedStar === star.key && (
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#EF8C2C' }} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="px-5 py-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]" style={{ fontFamily }}>{isBn ? 'মূল্য সীমা (প্রতি রাত)' : 'Price/Night'}</h4>
                                        <span className="text-[12px] font-bold" style={{ color: '#021E14' }}>৳{priceRange.toLocaleString()}</span>
                                    </div>
                                    <div className="relative w-full h-1 bg-gray-100 rounded-full">
                                        <input
                                            type="range"
                                            min="500"
                                            max="50000"
                                            step="500"
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                            className="absolute w-full h-full appearance-none bg-transparent cursor-pointer z-20
                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#021E14] [&::-webkit-slider-thumb]:border-2
                                            [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                                        />
                                        <div
                                            className="absolute h-full rounded-full transition-all"
                                            style={{ width: `${((priceRange - 500) / 49500) * 100}%`, backgroundColor: '#021E14' }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-[10px] text-gray-400">৳500</span>
                                        <span className="text-[10px] text-gray-400">৳50,000</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="p-5 rounded-lg text-white relative overflow-hidden" style={{ backgroundColor: '#021E14' }}>
                                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: 'rgba(239,140,44,0.15)' }} />
                                <h4 className="text-sm font-black uppercase tracking-[0.15em] mb-2" style={{ fontFamily: headingFont, color: '#EF8C2C' }}>
                                    {isBn ? 'বিশেষ অফার' : 'Special Offer'}
                                </h4>
                                <p className="text-[11px] font-normal leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.5)', fontFamily }}>
                                    {isBn
                                        ? 'আমাদের বিশেষজ্ঞ দল আপনার জন্য সেরা হোটেল খুঁজে দেবে।'
                                        : 'Our expert team will find the best hotel deals just for you.'}
                                </p>
                                <button className="w-full py-2.5 rounded border text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white hover:text-[#021E14]" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontFamily }}>
                                    {isBn ? 'যোগাযোগ করুন' : 'Contact Us'}
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT CONTENT AREA */}
                    <main className="flex-grow min-w-0">
                        {/* Control Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-10 pb-4 md:pb-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-[#021E14] uppercase leading-none mb-1.5" style={{ fontFamily: headingFont }}>
                                    {isBn
                                        ? (hotelCategories.find(c => c.key === selectedCategory)?.bn || 'সব হোটেল')
                                        : (hotelCategories.find(c => c.key === selectedCategory)?.en || 'All Hotels')}
                                </h2>
                                <p className="text-[10px] text-gray-400 font-normal uppercase tracking-[0.2em]" style={{ fontFamily }}>
                                    {isBn ? `${filteredHotels.length}টি হোটেল পাওয়া গেছে` : `Found ${filteredHotels.length} hotels`}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex bg-white rounded-md p-1 border border-gray-100">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-gray-50 text-primary" : "text-gray-300 hover:text-gray-500"}`}
                                    >
                                        <LuLayoutGrid size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-gray-50 text-primary" : "text-gray-300 hover:text-gray-500"}`}
                                    >
                                        <LuList size={16} />
                                    </button>
                                </div>
                                <div className="relative">
                                    <select
                                        className="pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-md text-[10px] font-bold uppercase tracking-widest text-gray-600 outline-none cursor-pointer appearance-none min-w-[140px] shadow-sm"
                                        style={{ fontFamily }}
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option>{isBn ? 'ফিচার্ড' : 'Featured'}</option>
                                        <option>{isBn ? 'মূল্য: কম-বেশি' : 'Price: Low-High'}</option>
                                        <option>{isBn ? 'মূল্য: বেশি-কম' : 'Price: High-Low'}</option>
                                        <option>{isBn ? 'রেটিং' : 'Rating'}</option>
                                    </select>
                                    <LuChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8" : "space-y-6 md:space-y-8"}>
                                {Array.from({ length: 6 }).map((_, idx) => (
                                    <div key={idx} className={`bg-white rounded-md overflow-hidden border border-gray-100 shadow-sm flex flex-col ${viewMode === "list" ? "md:flex-row h-auto md:h-64" : ""}`}
                                        style={{ animation: `fadeInUp 0.4s ease-out ${idx * 0.08}s both` }}>
                                        {/* Skeleton Image */}
                                        <div className={`relative overflow-hidden bg-gray-100 ${viewMode === "grid" ? "h-52" : "w-full md:w-1/3 h-52 md:h-full"}`}>
                                            <div className="absolute inset-0 skeleton-shimmer" />
                                        </div>
                                        {/* Skeleton Content */}
                                        <div className={`p-5 flex flex-col justify-between flex-grow ${viewMode === "list" ? "md:w-2/3" : ""}`}>
                                            <div>
                                                <div className="h-5 w-4/5 rounded bg-gray-100 mb-2 skeleton-shimmer" />
                                                <div className="h-3 w-1/3 rounded bg-gray-100 mb-3 skeleton-shimmer" />
                                                <div className="flex items-center gap-1.5 mb-3">
                                                    <div className="w-16 h-3 rounded bg-gray-100 skeleton-shimmer" />
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    <div className="h-5 w-14 rounded bg-gray-50 skeleton-shimmer" />
                                                    <div className="h-5 w-14 rounded bg-gray-50 skeleton-shimmer" />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                                <div className="flex flex-col gap-1">
                                                    <div className="h-2.5 w-12 rounded bg-gray-100 skeleton-shimmer" />
                                                    <div className="h-5 w-20 rounded bg-gray-100 skeleton-shimmer" />
                                                </div>
                                                <div className="h-9 w-28 rounded bg-gray-100 skeleton-shimmer" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {filteredHotels.length > 0 ? (
                                    <div className={viewMode === "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8"
                                        : "space-y-6 md:space-y-8"
                                    }>
                                        {filteredHotels.map((hotel, idx) => {
                                            const sym = getCurrencySymbol(hotel.currency);
                                            return (
                                                <motion.div
                                                    layout
                                                    key={hotel._id || idx}
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.98 }}
                                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                                    className={`group bg-white rounded-md overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col ${viewMode === "list" ? "md:flex-row h-auto md:h-64" : ""}`}
                                                >
                                                    {/* Image Section */}
                                                    <div className={`relative overflow-hidden ${viewMode === "grid" ? "h-52" : "w-full md:w-1/3 h-52 md:h-full"}`}>
                                                        {hotel.image ? (
                                                            <img
                                                                src={hotel.image}
                                                                alt={isBn ? hotel.nameBn || hotel.name : hotel.name}
                                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#021E14' }}>
                                                                <LuBed size={40} className="text-white/10" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                                        {/* Featured Badge */}
                                                        {hotel.isFeatured && (
                                                            <div className="absolute top-3 left-3">
                                                                <span className="px-2.5 py-1 bg-[#EF8C2C] text-white text-[8px] font-bold uppercase tracking-widest rounded-md shadow-sm" style={{ fontFamily }}>
                                                                    {isBn ? 'ফিচার্ড' : 'Featured'}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Star Rating Badge */}
                                                        <div className="absolute top-3 right-3">
                                                            <span className="flex items-center gap-0.5 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-white text-[9px] font-bold" style={{ fontFamily }}>
                                                                {'★'.repeat(hotel.starRating || 1)}
                                                            </span>
                                                        </div>

                                                        {/* Location on image */}
                                                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                                            <LuMapPin size={11} className="text-[#EF8C2C]" />
                                                            <span className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow" style={{ fontFamily }}>
                                                                {isBn ? (hotel.cityBn || hotel.city) : hotel.city}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Details Section */}
                                                    <div className={`p-5 flex flex-col justify-between flex-grow ${viewMode === "list" ? "md:w-2/3" : ""}`}>
                                                        <div>
                                                            <h3 className="text-base font-bold text-gray-900 group-hover:text-[#3590CF] transition-colors leading-snug mb-2 line-clamp-2" style={{ fontFamily }}>
                                                                {isBn ? (hotel.nameBn || hotel.name) : hotel.name}
                                                            </h3>

                                                            {/* Location */}
                                                            <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-3" style={{ fontFamily }}>
                                                                <LuMapPin size={10} />
                                                                {isBn ? (hotel.locationBn || hotel.location) : hotel.location}
                                                            </p>

                                                            {/* Stars Row */}
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <div className="flex items-center gap-0.5">
                                                                    {renderStars(hotel.starRating || 0)}
                                                                </div>
                                                                {hotel.rating > 0 && (
                                                                    <span className="text-[11px] font-bold text-gray-700">{hotel.rating}</span>
                                                                )}
                                                                {hotel.reviewsCount > 0 && (
                                                                    <span className="text-[10px] text-gray-300">({hotel.reviewsCount})</span>
                                                                )}
                                                            </div>

                                                            {/* Amenities Preview */}
                                                            {hotel.amenities?.length > 0 && (
                                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                                    {hotel.amenities.slice(0, 3).map((am, i) => (
                                                                        <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded text-[10px] text-gray-500 border border-gray-100" style={{ fontFamily }}>
                                                                            <LuWifi size={9} /> {isBn && hotel.amenitiesBn?.[i] ? hotel.amenitiesBn[i] : am}
                                                                        </span>
                                                                    ))}
                                                                    {hotel.amenities.length > 3 && (
                                                                        <span className="px-2 py-0.5 bg-gray-50 rounded text-[10px] text-gray-400 border border-gray-100" style={{ fontFamily }}>
                                                                            +{hotel.amenities.length - 3}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                                            <div>
                                                                <span className="text-[10px] text-gray-300 font-medium" style={{ fontFamily }}>{isBn ? 'প্রতি রাত' : 'per night'}</span>
                                                                <div className="flex items-baseline gap-1.5">
                                                                    <span className="text-lg font-black" style={{ color: '#3590CF' }}>
                                                                        {sym}{hotel.pricePerNight?.toLocaleString()}
                                                                    </span>
                                                                    {hotel.oldPrice > 0 && (
                                                                        <span className="text-[10px] text-gray-300 line-through">{sym}{hotel.oldPrice?.toLocaleString()}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => setBookingModal({ open: true, hotel })}
                                                                    className="px-4 py-2.5 border border-[#EF8C2C] text-[#EF8C2C] hover:bg-[#EF8C2C] hover:text-white rounded-md text-[10px] font-bold uppercase tracking-wider transition-all"
                                                                    style={{ fontFamily }}
                                                                >
                                                                    {isBn ? 'বুক করুন' : 'Book'}
                                                                </button>
                                                                <Link
                                                                    href={`/hotel/${hotel.slug || hotel._id}`}
                                                                    className="px-5 py-2.5 bg-[#EF8C2C] hover:bg-[#d97b1f] text-white rounded-md text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                                                                    style={{ fontFamily }}
                                                                >
                                                                    {isBn ? 'বিস্তারিত' : 'Details'} <LuArrowRight size={12} />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-96 flex flex-col items-center justify-center text-center py-20 bg-white rounded-md border border-dashed border-gray-200">
                                        <motion.div
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            className="mb-8 p-6 bg-gray-50 rounded-full"
                                        >
                                            <LuBed size={48} className="text-gray-200" />
                                        </motion.div>
                                        <h3 className="text-xl font-black text-gray-300 uppercase tracking-tight" style={{ fontFamily: headingFont }}>
                                            {isBn ? 'কিছু পাওয়া যায়নি' : 'Nothing Found'}
                                        </h3>
                                        <p className="text-gray-400 text-[11px] font-normal mt-2 max-w-[200px]" style={{ fontFamily }}>
                                            {isBn ? 'আপনার শর্ত অনুযায়ী কোনো হোটেল পাওয়া যায়নি।' : "No hotels match your search criteria."}
                                        </p>
                                        <button
                                            onClick={resetFilters}
                                            className="mt-6 px-6 py-2.5 bg-[#021E14] text-white rounded-md text-[10px] font-bold uppercase tracking-widest transition-all"
                                            style={{ fontFamily }}
                                        >
                                            {isBn ? 'সার্চ ক্লিয়ার করুন' : 'Clear Search'}
                                        </button>
                                    </div>
                                )}
                            </AnimatePresence>
                        )}
                    </main>
                </div>
            </div>

            {/* Newsletter */}
            <section className="bg-white py-24 border-t border-gray-50">
                <div className="max-w-[1400px] mx-auto px-4 text-center">
                    <LuUsers className="text-secondary mx-auto mb-6" size={32} />
                    <h2 className="text-3xl md:text-5xl font-black text-[#021E14] uppercase tracking-tight mb-4" style={{ fontFamily: headingFont }}>
                        {isBn ? 'সেরা ডিল ' : 'Get The Best '}<span style={{ color: '#EF8C2C' }}>{isBn ? 'পান' : 'Hotel Deals'}</span>
                    </h2>
                    <p className="text-gray-400 text-[12px] max-w-lg mx-auto mb-10 font-normal leading-relaxed" style={{ fontFamily }}>
                        {isBn
                            ? 'এক্সক্লুসিভ হোটেল ডিল এবং অফার সরাসরি আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন।'
                            : 'Subscribe to get exclusive hotel deals and special offers delivered straight to your inbox.'}
                    </p>
                    <form className="max-w-md mx-auto flex gap-2 p-1.5 bg-gray-50 rounded-md border border-gray-100 focus-within:bg-white transition-all shadow-sm">
                        <input type="email" placeholder={isBn ? "ইমেইল এড্রেস" : "Email address"} className="flex-grow px-5 py-3 text-[11px] bg-transparent outline-none font-normal" style={{ fontFamily }} />
                        <button className="px-6 py-3 bg-[#021E14] text-white rounded-md font-bold text-[9px] uppercase tracking-widest shadow-lg shadow-black/10" style={{ fontFamily }}>
                            {isBn ? 'যোগ দিন' : 'Subscribe'}
                        </button>
                    </form>
                </div>
            </section>
        </div>

        <BookingModal
            isOpen={bookingModal.open}
            onClose={() => setBookingModal({ open: false, hotel: null })}
            type="hotel"
            serviceName={bookingModal.hotel?.name || ""}
            serviceId={bookingModal.hotel?._id || ""}
            extraFields={[
                { key: "checkIn", label: "Check-in Date", type: "date", required: true },
                { key: "checkOut", label: "Check-out Date", type: "date", required: true },
                { key: "rooms", label: "Number of Rooms", type: "number", placeholder: "1", required: true },
            ]}
        />
        </>
    );
}

export default function HotelPage() {
    return (
        <main>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                </div>
            }>
                <HotelContent />
            </Suspense>
        </main>
    );
}
