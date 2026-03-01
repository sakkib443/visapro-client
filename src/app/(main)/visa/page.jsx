"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuSearch,
    LuClock,
    LuChevronRight,
    LuLayoutGrid,
    LuList,
    LuTriangleAlert,
    LuChevronDown,
    LuMapPin,
    LuCheck,
    LuPlane,
    LuArrowRight,
    LuGlobe
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import CountryFlag, { preloadFlags } from "@/components/shared/CountryFlag";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const continents = [
    { en: "Asian", bn: "এশিয়ান", key: "Asian" },
    { en: "European", bn: "ইউরোপীয়", key: "European" },
    { en: "North American", bn: "উত্তর আমেরিকান", key: "North American" },
    { en: "Middle East", bn: "মধ্যপ্রাচ্য", key: "Middle East" },
    { en: "Oceania", bn: "ওশেনিয়া", key: "Oceania" },
    { en: "African", bn: "আফ্রিকান", key: "African" },
];

function VisaContent() {
    const searchParams = useSearchParams();
    const initialRegion = searchParams.get("region") || "";
    const { language } = useLanguage();
    const isBn = language === 'bn';
    const fontFamily = isBn ? 'Hind Siliguri, sans-serif' : 'Poppins, sans-serif';
    const headingFont = isBn ? 'Hind Siliguri, sans-serif' : 'Teko, sans-serif';

    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRegions, setSelectedRegions] = useState(initialRegion ? [initialRegion] : []);
    const [selectedSubmissionTypes, setSelectedSubmissionTypes] = useState([]);
    const [priceRange, setPriceRange] = useState(50000);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("Recently Added");
    const [showFilters, setShowFilters] = useState(false);

    // Dynamic visa categories from database
    const [visaCategories, setVisaCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [countriesRes, categoriesRes] = await Promise.all([
                    fetch(`${API_BASE}/api/countries/active`),
                    fetch(`${API_BASE}/api/visa-categories/active`).catch(() => null)
                ]);
                const countriesData = await countriesRes.json();
                if (countriesData.success && countriesData.data) {
                    setCountries(countriesData.data);
                    preloadFlags(countriesData.data.map(c => c.name));
                }
                if (categoriesRes) {
                    const categoriesData = await categoriesRes.json();
                    if (categoriesData.success && categoriesData.data) {
                        setVisaCategories(categoriesData.data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredCountries = useMemo(() => {
        let result = countries.filter(country => {
            const matchesSearch = country.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                country.nameBn?.includes(searchQuery) ||
                country.region?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(country.region);
            const matchesSubmission = selectedSubmissionTypes.length === 0 || selectedSubmissionTypes.includes(country.submissionType);
            const matchesPrice = (country.startingPrice || country.visaTypes?.[0]?.fee || 0) <= priceRange;
            return matchesSearch && matchesRegion && matchesSubmission && matchesPrice;
        });

        // Sort
        if (sortBy === "Price (Low to High)" || sortBy === "মূল্য (কম থেকে বেশি)") {
            result.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
        } else if (sortBy === "Price (High to Low)" || sortBy === "মূল্য (বেশি থেকে কম)") {
            result.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
        } else if (sortBy === "Most Popular" || sortBy === "সবচেয়ে জনপ্রিয়") {
            result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        } else {
            result.sort((a, b) => a.name?.localeCompare(b.name));
        }

        return result;
    }, [countries, searchQuery, selectedRegions, selectedSubmissionTypes, priceRange, sortBy]);

    const toggleFilter = (item, state, setState) => {
        if (state.includes(item)) {
            setState(state.filter(i => i !== item));
        } else {
            setState([...state, item]);
        }
    };

    const submissionTypes = [
        { en: "E-Visa", bn: "ই-ভিসা", key: "e-visa" },
        { en: "In-Person", bn: "সশরীর", key: "in-person" },
        { en: "Flexible", bn: "ফ্লেক্সিবল", key: "flexible" },
    ];

    return (
        <div className="bg-[#F9FAFB] min-h-screen">
            {/* Main Header Space for consistent padding with navbar */}
            <div className="h-24 md:h-32" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-20">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-gray-200 text-sm font-bold text-gray-700 shadow-sm"
                        style={{ fontFamily }}
                    >
                        <LuSearch size={16} />
                        {showFilters ? (isBn ? 'ফিল্টার লুকান' : 'Hide Filters') : (isBn ? 'ফিল্টার দেখান' : 'Show Filters')}
                        <LuChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT SIDEBAR - FILTERS */}
                    <aside className={`w-full lg:w-[320px] flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 lg:sticky lg:top-32">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between" style={{ fontFamily }}>
                                {isBn ? 'ফিল্টার করুন' : 'Filter By'}
                                <button
                                    onClick={() => { setSelectedRegions([]); setSelectedSubmissionTypes([]); setPriceRange(50000); }}
                                    className="text-xs font-semibold text-[#1D7EDD] hover:underline"
                                    style={{ fontFamily }}
                                >
                                    {isBn ? 'রিসেট' : 'Reset'}
                                </button>
                            </h2>

                            {/* Section Divider */}
                            <div className="h-px bg-gray-100 mb-6" />

                            {/* Region/Continent Filter */}
                            <div className="mb-6">
                                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-between cursor-pointer group" style={{ fontFamily }}>
                                    {isBn ? 'গন্তব্য' : 'Destination'}
                                    <LuChevronDown className="text-gray-400 group-hover:text-gray-600 transition-all w-4 h-4" />
                                </h3>
                                <div className="space-y-3">
                                    {continents.map(region => (
                                        <label key={region.key} className="flex items-center group cursor-pointer">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:bg-[#1D7EDD] checked:border-[#1D7EDD]"
                                                    checked={selectedRegions.includes(region.key)}
                                                    onChange={() => toggleFilter(region.key, selectedRegions, setSelectedRegions)}
                                                />
                                                <LuCheck className="absolute left-0.5 opacity-0 text-white peer-checked:opacity-100 transition-opacity pointer-events-none" size={12} />
                                            </div>
                                            <span className="ml-3 text-[13px] font-normal text-gray-600 group-hover:text-gray-900 transition-colors" style={{ fontFamily }}>
                                                {isBn ? region.bn : region.en}
                                            </span>
                                            <span className="ml-auto text-[11px] font-normal text-gray-400">
                                                {countries.filter(c => c.region === region.key).length}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 mb-6" />

                            {/* Submission Type Filter */}
                            <div className="mb-6">
                                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-between" style={{ fontFamily }}>
                                    {isBn ? 'ভিসার ধরন' : 'Visa Type'}
                                    <LuChevronDown className="text-gray-400 w-4 h-4" />
                                </h3>
                                <div className="space-y-3">
                                    {submissionTypes.map(type => (
                                        <label key={type.key} className="flex items-center group cursor-pointer">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:bg-[#1D7EDD] checked:border-[#1D7EDD]"
                                                    checked={selectedSubmissionTypes.includes(type.key)}
                                                    onChange={() => toggleFilter(type.key, selectedSubmissionTypes, setSelectedSubmissionTypes)}
                                                />
                                                <LuCheck className="absolute left-0.5 opacity-0 text-white peer-checked:opacity-100 transition-opacity pointer-events-none" size={12} />
                                            </div>
                                            <span className="ml-3 text-[13px] font-normal text-gray-600 group-hover:text-gray-900 transition-colors" style={{ fontFamily }}>
                                                {isBn ? type.bn : type.en}
                                            </span>
                                            <span className="ml-auto text-[11px] font-normal text-gray-400">
                                                {countries.filter(c => c.submissionType === type.key).length}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 mb-6" />

                            {/* Price Slider */}
                            <div className="mb-6">
                                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-between" style={{ fontFamily }}>
                                    {isBn ? 'মূল্য' : 'Price'}
                                    <LuChevronDown className="text-gray-400 w-4 h-4" />
                                </h3>
                                <div className="relative w-full h-1.5 bg-gray-100 rounded-lg mb-6 mt-4">
                                    <input
                                        type="range"
                                        min="1000"
                                        max="50000"
                                        step="500"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                        className="absolute w-full h-full appearance-none bg-transparent cursor-pointer z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1D7EDD] [&::-webkit-slider-thumb]:shadow-md"
                                    />
                                    <div
                                        className="absolute h-full bg-[#1D7EDD] rounded-lg"
                                        style={{ width: `${((priceRange - 1000) / 49000) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[11px] font-bold text-gray-700">
                                    <span>৳1,000</span>
                                    <span>৳{priceRange.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT CONTENT AREA */}
                    <main className="flex-grow min-w-0">
                        {/* Top Bar Navigation */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                            <div className="relative flex-grow max-w-lg">
                                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1D7EDD]" />
                                <input
                                    type="text"
                                    placeholder={isBn ? "দেশের নাম অনুসন্ধান করুন..." : "Search country name..."}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1D7EDD]/10 focus:border-[#1D7EDD] outline-none transition-all text-sm font-semibold text-gray-700"
                                    style={{ fontFamily }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative min-w-0 flex-1 sm:min-w-[160px]">
                                    <select
                                        className="w-full pl-3 pr-8 py-3 bg-white border border-gray-200 rounded-md appearance-none text-xs font-bold text-gray-700 outline-none cursor-pointer"
                                        style={{ fontFamily }}
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option>{isBn ? 'সাম্প্রতিক যোগ' : 'Sort (Recently Added)'}</option>
                                        <option>{isBn ? 'মূল্য (কম থেকে বেশি)' : 'Price (Low to High)'}</option>
                                        <option>{isBn ? 'মূল্য (বেশি থেকে কম)' : 'Price (High to Low)'}</option>
                                        <option>{isBn ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}</option>
                                    </select>
                                    <LuChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>

                                <div className="hidden sm:flex bg-white rounded-md border border-gray-200 p-1">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-gray-100 text-[#1D7EDD]" : "text-gray-400 hover:text-gray-600"}`}
                                    >
                                        <LuLayoutGrid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-gray-100 text-[#1D7EDD]" : "text-gray-400 hover:text-gray-600"}`}
                                    >
                                        <LuList size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Country Cards */}
                        {loading ? (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8" : "space-y-6"}>
                                {Array.from({ length: 6 }).map((_, idx) => (
                                    <div key={idx} className={`bg-white rounded-md overflow-hidden border border-gray-100 shadow-sm flex flex-col ${viewMode === "list" ? "md:flex-row h-auto md:h-64" : ""}`}
                                        style={{ animation: `fadeInUp 0.4s ease-out ${idx * 0.08}s both` }}>
                                        {/* Skeleton Image */}
                                        <div className={`relative overflow-hidden bg-gray-100 ${viewMode === "grid" ? "h-48" : "w-full md:w-1/3 h-48 md:h-full"}`}>
                                            <div className="absolute inset-0 skeleton-shimmer" />
                                        </div>
                                        {/* Skeleton Content */}
                                        <div className={`p-5 flex flex-col justify-between ${viewMode === "list" ? "md:w-2/3" : ""}`}>
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-3 h-3 rounded-full bg-gray-100 skeleton-shimmer" />
                                                    <div className="h-3 w-16 rounded bg-gray-100 skeleton-shimmer" />
                                                </div>
                                                <div className="h-5 w-3/4 rounded bg-gray-100 mb-3 skeleton-shimmer" />
                                                <div className="flex gap-1.5 mb-4">
                                                    <div className="h-5 w-16 rounded bg-gray-50 skeleton-shimmer" />
                                                    <div className="h-5 w-20 rounded bg-gray-50 skeleton-shimmer" />
                                                </div>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="h-2.5 w-14 rounded bg-gray-100 skeleton-shimmer" />
                                                        <div className="h-4 w-20 rounded bg-gray-100 skeleton-shimmer" />
                                                    </div>
                                                    <div className="h-6 w-px bg-gray-100" />
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="h-2.5 w-14 rounded bg-gray-100 skeleton-shimmer" />
                                                        <div className="h-4 w-16 rounded bg-gray-100 skeleton-shimmer" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-grow h-10 rounded-md bg-gray-100 skeleton-shimmer" />
                                                <div className="w-10 h-10 rounded-md bg-gray-50 skeleton-shimmer" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {filteredCountries.length > 0 ? (
                                    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8" : "space-y-6"}>
                                        {filteredCountries.map((country, idx) => (
                                            <motion.div
                                                layout
                                                key={country._id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                                className={`group bg-white rounded-md overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col ${viewMode === "list" ? "md:flex-row h-auto md:h-64" : ""
                                                    }`}
                                            >
                                                <Link href={`/visa/country/${country.slug}`} className={`block ${viewMode === "list" ? "md:flex md:w-full" : ""}`}>
                                                    {/* Image Wrapper */}
                                                    <div className={`relative overflow-hidden ${viewMode === "grid" ? "h-48" : "w-full md:w-1/3 h-48 md:h-full"}`}>
                                                        {country.image ? (
                                                            <img
                                                                src={country.image}
                                                                alt={isBn && country.nameBn ? country.nameBn : country.name}
                                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-[#1a2e5a] to-[#2d4a7a] flex items-center justify-center">
                                                                <CountryFlag name={country.name} flag={country.flag} size={64} rounded={false} />
                                                            </div>
                                                        )}
                                                        {/* Gradient overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                                        {country.isFeatured && (
                                                            <div className="absolute top-3 left-3 bg-[#EF8C2C] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm" style={{ fontFamily }}>
                                                                {isBn ? 'ফিচার্ড' : 'Featured'}
                                                            </div>
                                                        )}

                                                        {/* Country flag + region on image */}
                                                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                                            <CountryFlag name={country.name} flag={country.flag} size={28} />
                                                            {country.region && (
                                                                <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded" style={{ fontFamily }}>
                                                                    {isBn && country.regionBn ? country.regionBn : country.region}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Content Wrapper */}
                                                    <div className={`p-5 flex flex-col justify-between ${viewMode === "list" ? "md:w-2/3" : ""}`}>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <LuMapPin className="text-[#EF8C2C]" size={12} />
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none" style={{ fontFamily }}>
                                                                    {isBn && country.regionBn ? country.regionBn : (country.region || 'Worldwide')}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-start justify-between mb-2">
                                                                <h3 className="text-[18px]! font-bold text-gray-900 group-hover:text-[#1D7EDD] transition-colors leading-tight" style={{ fontFamily }}>
                                                                    {isBn && country.nameBn ? country.nameBn : country.name}
                                                                </h3>
                                                                {country.submissionType && (
                                                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${country.submissionType === 'e-visa'
                                                                        ? 'bg-green-50 text-green-600'
                                                                        : country.submissionType === 'in-person'
                                                                            ? 'bg-blue-50 text-blue-600'
                                                                            : 'bg-orange-50 text-orange-600'
                                                                        }`} style={{ fontFamily }}>
                                                                        {country.submissionType === 'e-visa' ? 'E-Visa' : country.submissionType === 'in-person' ? 'In-Person' : 'Flexible'}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Visa Types Tags */}
                                                            {country.visaTypes?.length > 0 && (
                                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                                    {country.visaTypes.slice(0, 3).map((vt, i) => (
                                                                        <span key={i} className="text-[10px] font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded" style={{ fontFamily }}>
                                                                            {isBn && vt.nameBn ? vt.nameBn : vt.name}
                                                                        </span>
                                                                    ))}
                                                                    {country.visaTypes.length > 3 && (
                                                                        <span className="text-[10px] font-semibold text-[#1D7EDD] bg-[#1D7EDD]/5 px-2 py-0.5 rounded">
                                                                            +{country.visaTypes.length - 3} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div className="flex items-center gap-4 mb-4">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider leading-none mb-1.5" style={{ fontFamily }}>
                                                                        {isBn ? 'ভিসার ধরন' : 'Visa Types'}
                                                                    </span>
                                                                    <span className="text-[12px] font-bold text-gray-700" style={{ fontFamily }}>
                                                                        {country.visaTypes?.length || 0} {isBn ? 'টি উপলব্ধ' : 'Available'}
                                                                    </span>
                                                                </div>
                                                                <div className="h-6 w-px bg-gray-100" />
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider leading-none mb-1.5" style={{ fontFamily }}>
                                                                        {isBn ? 'শুরু হচ্ছে' : 'Starting From'}
                                                                    </span>
                                                                    <div className="flex items-baseline gap-1.5 leading-none">
                                                                        <span className="text-base font-bold text-[#1D7EDD]">
                                                                            ৳{(country.startingPrice || country.visaTypes?.[0]?.fee || 0).toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <span className="flex-grow py-2.5 bg-[#1D7EDD] hover:bg-[#1868b8] text-white rounded-md font-bold text-[11px] uppercase tracking-wider transition-all text-center" style={{ fontFamily }}>
                                                                {isBn ? 'বিস্তারিত দেখুন' : 'View Details'}
                                                            </span>
                                                            <span className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center justify-center text-gray-400 transition-all border border-gray-100">
                                                                <LuArrowRight size={18} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-96 flex flex-col items-center justify-center text-center">
                                        <LuTriangleAlert size={64} className="text-gray-200 mb-6" />
                                        <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tight" style={{ fontFamily: headingFont }}>
                                            {isBn ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No Results Found'}
                                        </h3>
                                        <p className="text-gray-400 text-sm font-medium mt-2 max-w-xs" style={{ fontFamily }}>
                                            {isBn ? 'আরো অপশন খুঁজে পেতে আপনার ফিল্টার বা সার্চ কীওয়ার্ড পরিবর্তন করুন।' : 'Try changing your filters or search keywords to find more options.'}
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        )}
                    </main>
                </div>
            </div>

            {/* Support Section */}
            <section className="bg-white border-t border-gray-100 py-12 md:py-24">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tight mb-6 md:mb-8" style={{ fontFamily: headingFont }}>
                        {isBn ? 'আপনি যা খুঁজছেন তা পাননি?' : "Didn't find what you are looking for?"}
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10 font-medium" style={{ fontFamily }}>
                        {isBn
                            ? 'আমাদের বিশেষজ্ঞরা আপনার নির্দিষ্ট প্রয়োজন ও গন্তব্য অনুযায়ী ব্যক্তিগতকৃত ভিসা সমাধান নিয়ে সাহায্য করতে প্রস্তুত।'
                            : 'Our experts are here to help you with personalized visa solutions tailored to your specific needs and destination.'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-10 py-5 bg-[#EF8C2C] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#EF8C2C]/20 hover:-translate-y-1 transition-all" style={{ fontFamily }}>
                            {isBn ? 'সাপোর্ট কল করুন' : 'Call Support'}
                        </button>
                        <button className="px-10 py-5 bg-[#021E14] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:-translate-y-1 transition-all" style={{ fontFamily }}>
                            {isBn ? 'লাইভ চ্যাট' : 'Live Chat'}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function VisaPage() {
    return (
        <main>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                    <div className="w-16 h-16 border-4 border-[#1D7EDD] border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                <VisaContent />
            </Suspense>
        </main>
    );
}
