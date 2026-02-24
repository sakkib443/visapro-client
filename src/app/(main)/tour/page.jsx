"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuSearch,
    LuClock,
    LuMapPin,
    LuStar,
    LuFilter,
    LuChevronDown,
    LuLayoutGrid,
    LuList,
    LuCalendar,
    LuUsers,
    LuArrowRight,
    LuHeart,
    LuEye,
    LuCompass,
    LuCheck
} from "react-icons/lu";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

// Mock Data for Tours
const tourData = [
    {
        id: 1,
        title: "Majestic Switzerland: Alpine Adventure",
        titleBn: "মনোরম সুইজারল্যান্ড: আল্পাইন অ্যাডভেঞ্চার",
        location: "Switzerland", locationBn: "সুইজারল্যান্ড",
        category: "Adventure",
        tourType: "Solo Tour", tourTypeBn: "একক ট্যুর",
        duration: "07/Days", durationBn: "০৭/দিন",
        price: 1850.00,
        oldPrice: 2100.00,
        rating: 4.9,
        reviews: 124,
        image: "https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Experience the breathtaking beauty of the Swiss Alps, crystal clear lakes, and charming villages.",
        descriptionBn: "সুইস আল্পসের মনোমুগ্ধকর সৌন্দর্য, স্ফটিক স্বচ্ছ হ্রদ এবং মনোরম গ্রামগুলো উপভোগ করুন।",
        featured: true,
        tags: ["Alpine", "Nature", "Luxury"]
    },
    {
        id: 2,
        title: "Dubai Skyline & Desert Safari",
        titleBn: "দুবাই স্কাইলাইন ও ডেজার্ট সাফারি",
        location: "Saudi Arabia", locationBn: "সৌদি আরব",
        category: "City Tour",
        tourType: "Group Tour", tourTypeBn: "গ্রুপ ট্যুর",
        duration: "05/Hours", durationBn: "০৫/ঘণ্টা",
        price: 850.00,
        oldPrice: 950.00,
        rating: 4.8,
        reviews: 210,
        image: "https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "From the world's tallest building to the golden sands of the Arabian desert, explore the wonders of Dubai.",
        descriptionBn: "বিশ্বের সবচেয়ে উঁচু ভবন থেকে আরব মরুভূমির স্বর্ণালী বালু পর্যন্ত, দুবাইয়ের বিস্ময়কর জায়গাগুলো ঘুরে দেখুন।",
        featured: false,
        tags: ["City", "Safari", "Shopping"]
    },
    {
        id: 3,
        title: "Culture & Cuisine Discovery",
        titleBn: "সংস্কৃতি ও রন্ধনশিল্প আবিষ্কার",
        location: "Saudi Arabia", locationBn: "সৌদি আরব",
        category: "Culture",
        tourType: "Solo Tour", tourTypeBn: "একক ট্যুর",
        duration: "02/Hours", durationBn: "০২/ঘণ্টা",
        price: 65.00,
        oldPrice: 85.00,
        rating: 4.9,
        reviews: 89,
        image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Walk through the blue-domed churches of Oia and enjoy the most beautiful sunsets in the world.",
        descriptionBn: "ওইয়ার নীল গম্বুজবিশিষ্ট গির্জাগুলোতে হাঁটুন এবং পৃথিবীর সবচেয়ে সুন্দর সূর্যাস্ত উপভোগ করুন।",
        featured: true,
        tags: ["Beach", "History", "Couple"]
    },
    {
        id: 4,
        title: "Tropical Paradise: Bali Explorer",
        titleBn: "ক্রান্তীয় স্বর্গ: বালি এক্সপ্লোরার",
        location: "Indonesia", locationBn: "ইন্দোনেশিয়া",
        category: "Nature",
        tourType: "Family Tour", tourTypeBn: "ফ্যামিলি ট্যুর",
        duration: "08/Days", durationBn: "০৮/দিন",
        price: 650.00,
        oldPrice: 750.00,
        rating: 4.7,
        reviews: 156,
        image: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Discover the spiritual heart of Bali, lush rice terraces, and pristine beaches of Nusa Penida.",
        descriptionBn: "বালির আধ্যাত্মিক হৃদয়, সবুজ ধানের সিঁড়ি এবং নুসা পেনিদার অকলুষ সমুদ্র সৈকত আবিষ্কার করুন।",
        featured: false,
        tags: ["Spiritual", "Tropical", "Budget"]
    },
];

const tourCategories = [
    { en: "All Tours", bn: "সব ট্যুর", key: "All Tours" },
    { en: "Adventure", bn: "অ্যাডভেঞ্চার", key: "Adventure" },
    { en: "City Tour", bn: "সিটি ট্যুর", key: "City Tour" },
    { en: "Romantic", bn: "রোমান্টিক", key: "Romantic" },
    { en: "Nature", bn: "প্রকৃতি", key: "Nature" },
    { en: "Culture", bn: "সংস্কৃতি", key: "Culture" },
    { en: "History", bn: "ইতিহাস", key: "History" },
    { en: "Beach", bn: "সমুদ্র সৈকত", key: "Beach" },
];

const tourTypes = [
    { en: "All Types", bn: "সব ধরন", key: "All Types" },
    { en: "Solo Tour", bn: "একক ট্যুর", key: "Solo Tour" },
    { en: "Group Tour", bn: "গ্রুপ ট্যুর", key: "Group Tour" },
    { en: "Family Tour", bn: "ফ্যামিলি ট্যুর", key: "Family Tour" },
];

const durationFilters = [
    { en: "Hours", bn: "ঘণ্টা", key: "Hours" },
    { en: "Days", bn: "দিন", key: "Days" },
];

function TourContent() {
    const { language } = useLanguage();
    const isBn = language === 'bn';
    const fontFamily = isBn ? 'Hind Siliguri, sans-serif' : 'Poppins, sans-serif';
    const headingFont = isBn ? 'Hind Siliguri, sans-serif' : 'Teko, sans-serif';

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Tours");
    const [priceRange, setPriceRange] = useState(2000);
    const [selectedType, setSelectedType] = useState("All Types");
    const [selectedDurations, setSelectedDurations] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("Featured");
    const [showFilters, setShowFilters] = useState(false);

    const toggleFilter = (item, state, setState) => {
        if (state.includes(item)) {
            const newState = state.filter(i => i !== item);
            setState(newState);
        } else {
            setState([...state, item]);
        }
    };

    const filteredTours = useMemo(() => {
        return tourData.filter(tour => {
            const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (tour.titleBn && tour.titleBn.includes(searchQuery)) ||
                (tour.locationBn && tour.locationBn.includes(searchQuery));

            const matchesCategory = selectedCategory === "All Tours" || tour.category === selectedCategory;
            const matchesPrice = tour.price <= priceRange;
            const matchesType = selectedType === "All Types" || tour.tourType === selectedType;

            let matchesDuration = true;
            if (selectedDurations.length > 0) {
                matchesDuration = selectedDurations.some(d => tour.duration.includes(d));
            }

            return matchesSearch && matchesCategory && matchesPrice && matchesType && matchesDuration;
        });
    }, [searchQuery, selectedCategory, priceRange, selectedType, selectedDurations]);

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All Tours");
        setPriceRange(2000);
        setSelectedType("All Types");
        setSelectedDurations([]);
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen text-[#021E14]" style={{ fontFamily }}>
            {/* 1. Hero Section */}
            <section className="relative py-14 md:py-20 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url('/images/ture bg.webp')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <div className="absolute inset-0 bg-[#021E14]/40" />
                </div>

                <div className="relative z-10 max-w-4xl w-full px-4 text-center flex flex-col items-center">
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4"
                        style={{ color: 'rgba(255,255,255,0.7)', fontFamily }}
                    >
                        {isBn ? 'আশ্চর্যজনক জায়গা আবিষ্কার করুন' : 'Discover Amazing Places'}
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4"
                        style={{ fontFamily: headingFont, color: '#FFFFFF' }}
                    >
                        {isBn ? 'বিশ্ব ' : 'Explore The '}<span style={{ color: '#EF8C2C' }}>{isBn ? 'ঘুরে দেখুন' : 'World'}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-sm font-normal mb-8 max-w-md"
                        style={{ color: 'rgba(255,255,255,0.6)', fontFamily }}
                    >
                        {isBn ? 'অবিস্মরণীয় অভিজ্ঞতার জন্য হস্তশিল্পে তৈরি ট্যুর প্যাকেজ।' : 'Handcrafted tour packages designed for unforgettable experiences.'}
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
                            placeholder={isBn ? "আপনার পরবর্তী গন্তব্য খুঁজুন..." : "Find your next destination..."}
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

                                {/* Tour Category */}
                                <div className="px-5 py-5 border-b border-gray-100">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily }}>{isBn ? 'ক্যাটেগরি' : 'Category'}</h4>
                                    <div className="space-y-0.5">
                                        {tourCategories.map(cat => (
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

                                {/* Price Range */}
                                <div className="px-5 py-5 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]" style={{ fontFamily }}>{isBn ? 'মূল্য সীমা' : 'Price Range'}</h4>
                                        <span className="text-[12px] font-bold" style={{ color: '#021E14' }}>${priceRange}</span>
                                    </div>
                                    <div className="relative w-full h-1 bg-gray-100 rounded-full">
                                        <input
                                            type="range"
                                            min="50"
                                            max="2000"
                                            step="50"
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                            className="absolute w-full h-full appearance-none bg-transparent cursor-pointer z-20 
                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#021E14] [&::-webkit-slider-thumb]:border-2 
                                            [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                                        />
                                        <div
                                            className="absolute h-full rounded-full transition-all"
                                            style={{ width: `${((priceRange - 50) / 1950) * 100}%`, backgroundColor: '#021E14' }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-[10px] text-gray-400">$50</span>
                                        <span className="text-[10px] text-gray-400">$2,000</span>
                                    </div>
                                </div>

                                {/* Tour Type */}
                                <div className="px-5 py-5 border-b border-gray-100">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily }}>{isBn ? 'ট্যুরের ধরন' : 'Tour Type'}</h4>
                                    <div className="space-y-0.5">
                                        {tourTypes.map(type => (
                                            <button
                                                key={type.key}
                                                onClick={() => setSelectedType(type.key)}
                                                className={`w-full text-left px-3 py-2 rounded transition-all text-[13px] flex items-center justify-between ${selectedType === type.key
                                                    ? "bg-gray-100 text-[#021E14] font-semibold"
                                                    : "text-gray-600 hover:bg-gray-50 font-normal"
                                                    }`}
                                                style={{ fontFamily }}
                                            >
                                                {isBn ? type.bn : type.en}
                                                {selectedType === type.key && (
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#EF8C2C' }} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Duration */}
                                <div className="px-5 py-5">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily }}>{isBn ? 'সময়কাল' : 'Duration'}</h4>
                                    <div className="flex gap-2">
                                        {durationFilters.map(dur => (
                                            <button
                                                key={dur.key}
                                                onClick={() => toggleFilter(dur.key, selectedDurations, setSelectedDurations)}
                                                className={`flex-1 py-2 rounded text-[11px] font-semibold uppercase tracking-wider border transition-all ${selectedDurations.includes(dur.key)
                                                    ? "text-[#021E14] border-[#021E14] bg-gray-100 font-bold"
                                                    : "text-gray-500 border-gray-200 hover:border-gray-300 bg-white"
                                                    }`}
                                                style={{ fontFamily }}
                                            >
                                                {isBn ? dur.bn : dur.en}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="p-5 rounded-lg text-white relative overflow-hidden" style={{ backgroundColor: '#021E14' }}>
                                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: 'rgba(239,140,44,0.15)' }} />
                                <h4 className="text-sm font-black uppercase tracking-[0.15em] mb-2" style={{ fontFamily: headingFont, color: '#EF8C2C' }}>
                                    {isBn ? 'কাস্টম অভিজ্ঞতা' : 'Custom Experience'}
                                </h4>
                                <p className="text-[11px] font-normal leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.5)', fontFamily }}>
                                    {isBn ? 'আমাদের ট্রাভেল বিশেষজ্ঞদের দ্বারা শুধুমাত্র আপনার জন্য তৈরি একটি অনন্য যাত্রা পরিকল্পনা করুন।' : 'Plan a unique journey tailored just for you by our travel experts.'}
                                </p>
                                <button className="w-full py-2.5 rounded border text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white hover:text-[#021E14]" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontFamily }}>
                                    {isBn ? 'কোটেশন নিন' : 'Get a Quote'}
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
                                    {isBn ? (tourCategories.find(c => c.key === selectedCategory)?.bn || selectedCategory) : selectedCategory}
                                </h2>
                                <p className="text-[10px] text-gray-400 font-normal uppercase tracking-[0.2em]" style={{ fontFamily }}>
                                    {isBn ? `${filteredTours.length}টি ফলাফল পাওয়া গেছে` : `Found ${filteredTours.length} results`}
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
                                    </select>
                                    <LuChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {filteredTours.length > 0 ? (
                                <div className={viewMode === "grid"
                                    ? "grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8"
                                    : "space-y-6 md:space-y-8"
                                }>
                                    {filteredTours.map((tour, idx) => (
                                        <motion.div
                                            layout
                                            key={tour.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                                            className={`group bg-white rounded-md overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col ${viewMode === "list" ? "md:flex-row h-auto md:h-64" : ""
                                                }`}
                                        >
                                            {/* Image Section */}
                                            <div className={`relative overflow-hidden ${viewMode === "grid" ? "h-52" : "w-full md:w-1/3 h-52 md:h-full"}`}>
                                                <img
                                                    src={tour.image}
                                                    alt={isBn ? tour.titleBn : tour.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                                {/* Tour Type Badge */}
                                                {tour.featured && (
                                                    <div className="absolute top-3 left-3">
                                                        <span className="px-2.5 py-1 bg-[#EF8C2C] text-white text-[8px] font-bold uppercase tracking-widest rounded-md shadow-sm" style={{ fontFamily }}>
                                                            {isBn ? 'ফিচার্ড' : 'Featured'}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="absolute top-3 right-3">
                                                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-[9px] font-bold rounded-md shadow-sm" style={{ fontFamily }}>
                                                        {isBn ? (tour.tourTypeBn || tour.tourType) : (tour.tourType || "Solo Tour")}
                                                    </span>
                                                </div>

                                                {/* Location on image */}
                                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                                    <LuMapPin size={11} className="text-[#EF8C2C]" />
                                                    <span className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow" style={{ fontFamily }}>
                                                        {isBn ? tour.locationBn : tour.location}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Details Section */}
                                            <div className={`p-5 flex flex-col justify-between flex-grow ${viewMode === "list" ? "md:w-2/3" : ""}`}>
                                                <div>
                                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#3590CF] transition-colors leading-snug mb-3 line-clamp-2" style={{ fontFamily }}>
                                                        {isBn ? tour.titleBn : tour.title}
                                                    </h3>

                                                    {/* Meta Info */}
                                                    <div className="flex items-center gap-4 text-gray-400 mb-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <LuClock size={13} />
                                                            <span className="text-[11px] font-medium" style={{ fontFamily }}>{isBn ? tour.durationBn : tour.duration}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <LuStar size={13} className="text-[#EF8C2C] fill-[#EF8C2C]" />
                                                            <span className="text-[11px] font-bold text-gray-700">{tour.rating}</span>
                                                            <span className="text-[10px] text-gray-300">({tour.reviews})</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Footer: Price + CTA */}
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                                    <div>
                                                        <span className="text-[10px] text-gray-300 font-medium" style={{ fontFamily }}>{isBn ? 'প্রতি জন' : 'per person'}</span>
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="text-lg font-black" style={{ color: '#3590CF' }}>
                                                                ${tour.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                            </span>
                                                            <span className="text-[10px] text-gray-300 line-through">${tour.oldPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={`/tour/${tour.id}`}
                                                        className="px-5 py-2.5 bg-[#EF8C2C] hover:bg-[#d97b1f] text-white rounded-md text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                                                        style={{ fontFamily }}
                                                    >
                                                        {isBn ? 'বিস্তারিত' : 'View Details'} <LuArrowRight size={12} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-96 flex flex-col items-center justify-center text-center py-20 bg-white rounded-md border border-dashed border-gray-200">
                                    <motion.div
                                        initial={{ rotate: 0 }}
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="mb-8 p-6 bg-gray-50 rounded-full"
                                    >
                                        <LuCompass size={48} className="text-gray-200" />
                                    </motion.div>
                                    <h3 className="text-xl font-black text-gray-300 uppercase tracking-tight" style={{ fontFamily: headingFont }}>
                                        {isBn ? 'কিছু পাওয়া যায়নি' : 'Nothing Found'}
                                    </h3>
                                    <p className="text-gray-400 text-[11px] font-normal mt-2 max-w-[200px]" style={{ fontFamily }}>
                                        {isBn ? 'আপনার শর্ত অনুযায়ী কোনো ট্যুর পাওয়া যায়নি।' : "We couldn't find any tours matching your criteria."}
                                    </p>
                                    <button
                                        onClick={() => { setSearchQuery(""); setSelectedCategory("All Tours"); }}
                                        className="mt-6 px-6 py-2.5 bg-[#021E14] text-white rounded-md text-[10px] font-bold uppercase tracking-widest transition-all"
                                        style={{ fontFamily }}
                                    >
                                        {isBn ? 'সার্চ ক্লিয়ার করুন' : 'Clear Search'}
                                    </button>
                                </div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Newsletter */}
            <section className="bg-white py-24 border-t border-gray-50">
                <div className="max-w-[1400px] mx-auto px-4 text-center">
                    <LuUsers className="text-secondary mx-auto mb-6" size={32} />
                    <h2 className="text-3xl md:text-5xl font-black text-[#021E14] uppercase tracking-tight mb-4" style={{ fontFamily: headingFont }}>
                        {isBn ? 'আমাদের ' : 'Join Our '}<span className="text-primary">{isBn ? 'গ্লোবাল ক্লাবে যোগ দিন' : 'Global Club'}</span>
                    </h2>
                    <p className="text-gray-400 text-[12px] max-w-lg mx-auto mb-10 font-normal leading-relaxed" style={{ fontFamily }}>
                        {isBn
                            ? 'সপ্তাহে একবার আল্ট্রা-এক্সক্লুসিভ ট্যুর ডিল এবং বিলাসবহুল ভ্রমণ অনুপ্রেরণা পেতে আপডেট থাকুন।'
                            : 'Stay updated with ultra-exclusive tour deals and luxury travel inspiration delivered once a week.'}
                    </p>
                    <form className="max-w-md mx-auto flex gap-2 p-1.5 bg-gray-50 rounded-md border border-gray-100 focus-within:bg-white transition-all shadow-sm">
                        <input type="email" placeholder={isBn ? "ইমেইল এড্রেস" : "Email address"} className="flex-grow px-5 py-3 text-[11px] bg-transparent outline-none font-normal" style={{ fontFamily }} />
                        <button className="px-6 py-3 bg-[#021E14] text-white rounded-md font-bold text-[9px] uppercase tracking-widest shadow-lg shadow-black/10" style={{ fontFamily }}>
                            {isBn ? 'যোগ দিন' : 'Join Now'}
                        </button>
                    </form>
                </div>
            </section>

        </div >
    );
}

export default function TourPage() {
    return (
        <main>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                </div>
            }>
                <TourContent />
            </Suspense>
        </main>
    );
}
