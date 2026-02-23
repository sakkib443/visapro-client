"use client";

import { useState, useMemo, Suspense } from "react";
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
    LuHeart,
    LuEye
} from "react-icons/lu";

// Mock Data for Visas
const visaData = [
    {
        id: 1,
        country: "Singapore",
        type: "Tourist Visa",
        category: "Tourist Visa",
        region: "Asian",
        processingTime: "5-7 Days",
        price: 4500,
        oldPrice: 5200,
        image: "https://images.unsplash.com/photo-1525625232767-1293af883071?q=80&w=800&auto=format&fit=crop",
        description: "Official entry permit for tourism and visiting friends or family in Singapore.",
        featured: true,
        discount: "15% Off",
        nextSteps: ["Document Collection", "Online Application", "Visa Issuance"],
        availability: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    {
        id: 2,
        country: "Malaysia",
        type: "Tourist (e-Visa)",
        category: "Tourist Visa",
        region: "Asian",
        processingTime: "3-5 Days",
        price: 3800,
        oldPrice: 4200,
        image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop",
        description: "Electronic visa for tourism purposes, valid for a single entry stay of up to 30 days.",
        featured: false,
        discount: "10% Off",
        nextSteps: ["Data Entry", "Verification", "e-Visa Delivery"],
        availability: ["Jan", "Feb", "Mar", "Apr", "May", "Sep", "Oct", "Nov", "Dec"]
    },
    {
        id: 3,
        country: "USA",
        type: "B1/B2 Visitor",
        category: "Business Visa",
        region: "North American",
        processingTime: "Interview Based",
        price: 18500,
        oldPrice: 21000,
        image: "https://images.unsplash.com/photo-1550945034-5e9721e471ba?q=80&w=800&auto=format&fit=crop",
        description: "Non-immigrant visa for persons wanting to enter the US for business or tourism.",
        featured: true,
        discount: "20% Off",
        nextSteps: ["DS-160 Form", "Fee Payment", "Interview"],
        availability: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"]
    },
    {
        id: 4,
        country: "UK",
        type: "Standard Visitor",
        category: "Tourist Visa",
        region: "European",
        processingTime: "15-20 Days",
        price: 14200,
        oldPrice: 16000,
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
        description: "Standard visa for travel, business meetings, or visiting family in the United Kingdom.",
        featured: true,
        discount: "12% Off",
        nextSteps: ["Appt. Booking", "Biometrics", "Decision"],
        availability: ["Jan", "Feb", "Mar", "Oct", "Nov", "Dec"]
    },
    {
        id: 5,
        country: "Italy",
        type: "Schengen Visa",
        category: "Tourist Visa",
        region: "European",
        processingTime: "15-20 Days",
        price: 12500,
        oldPrice: 14500,
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop",
        description: "Access 27 European countries with a single Schengen visa issued by Italy.",
        featured: false,
        discount: "Free Insurance",
        nextSteps: ["Documents", "Appt. at VFS", "Processing"],
        availability: ["May", "Jun", "Jul", "Aug", "Sep"]
    },
    {
        id: 6,
        country: "Australia",
        type: "Subclass 600",
        category: "Tourist Visa",
        region: "Oceania",
        processingTime: "25-30 Days",
        price: 16800,
        oldPrice: 18500,
        image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800&auto=format&fit=crop",
        description: "The Visitor visa allows you to visit Australia for a holiday or to visit friends and family.",
        featured: false,
        discount: "Hot Deal",
        nextSteps: ["Online File", "Biometrics", "Grant"],
        availability: ["Sep", "Oct", "Nov", "Dec"]
    },
];

const visaCategories = [
    "Tourist Visa",
    "Working Visa",
    "Student Visa",
    "Business Visa",
    "Medical Visa",
    "Transit Visa"
];

const continents = ["All", "Asian", "European", "North American", "Middle East", "Oceania"];

function VisaContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(initialCategory === "All" ? [] : [initialCategory]);
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [priceRange, setPriceRange] = useState(25000);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("Recently Added");
    const [showFilters, setShowFilters] = useState(false);

    const filteredVisas = useMemo(() => {
        return visaData.filter(visa => {
            const matchesSearch = visa.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                visa.type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(visa.category);
            const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(visa.region);
            const matchesPrice = visa.price <= priceRange;
            return matchesSearch && matchesCategory && matchesRegion && matchesPrice;
        });
    }, [searchQuery, selectedCategory, selectedRegions, priceRange]);

    const toggleFilter = (item, state, setState) => {
        if (state.includes(item)) {
            setState(state.filter(i => i !== item));
        } else {
            setState([...state, item]);
        }
    };

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
                    >
                        <LuSearch size={16} />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                        <LuChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT SIDEBAR - FILTERS */}
                    <aside className={`w-full lg:w-[320px] flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-32">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                                Filter By
                                <button
                                    onClick={() => { setSelectedCategory([]); setSelectedRegions([]); setPriceRange(25000); }}
                                    className="text-xs font-semibold text-[#1D7EDD] hover:underline"
                                >
                                    Reset
                                </button>
                            </h2>

                            {/* Section Divider */}
                            <div className="h-px bg-gray-100 mb-6" />

                            {/* Visa Type Filter */}
                            <div className="mb-6">
                                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-between cursor-pointer group">
                                    Visa Category
                                    <LuChevronDown className="text-gray-400 group-hover:text-gray-600 transition-all w-4 h-4" />
                                </h3>
                                <div className="space-y-3">
                                    {visaCategories.map(cat => (
                                        <label key={cat} className="flex items-center group cursor-pointer">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:bg-[#1D7EDD] checked:border-[#1D7EDD]"
                                                    checked={selectedCategory.includes(cat)}
                                                    onChange={() => toggleFilter(cat, selectedCategory, setSelectedCategory)}
                                                />
                                                <LuCheck className="absolute left-0.5 opacity-0 text-white peer-checked:opacity-100 transition-opacity pointer-events-none" size={12} />
                                            </div>
                                            <span className="ml-3 text-[13px] font-normal text-gray-600 group-hover:text-gray-900 transition-colors">
                                                {cat}
                                            </span>
                                            <span className="ml-auto text-[11px] font-normal text-gray-400">
                                                {visaData.filter(v => v.category === cat).length}
                                            </span>
                                        </label>
                                    ))}
                                    <button className="text-[11px] font-semibold text-[#1D7EDD] hover:underline mt-2">Show More</button>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 mb-6" />

                            {/* Region Filter */}
                            <div className="mb-6">
                                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-between">
                                    Destination
                                    <LuChevronDown className="text-gray-400 w-4 h-4" />
                                </h3>
                                <div className="space-y-3">
                                    {continents.filter(c => c !== "All").map(region => (
                                        <label key={region} className="flex items-center group cursor-pointer">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:bg-[#1D7EDD] checked:border-[#1D7EDD]"
                                                    checked={selectedRegions.includes(region)}
                                                    onChange={() => toggleFilter(region, selectedRegions, setSelectedRegions)}
                                                />
                                                <LuCheck className="absolute left-0.5 opacity-0 text-white peer-checked:opacity-100 transition-opacity pointer-events-none" size={12} />
                                            </div>
                                            <span className="ml-3 text-[13px] font-normal text-gray-600 group-hover:text-gray-900 transition-colors">
                                                {region}
                                            </span>
                                            <span className="ml-auto text-[11px] font-normal text-gray-400">
                                                {visaData.filter(v => v.region === region).length}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 mb-6" />

                            {/* Price Slider */}
                            <div className="mb-6">
                                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-between">
                                    Price
                                    <LuChevronDown className="text-gray-400 w-4 h-4" />
                                </h3>
                                <div className="relative w-full h-1.5 bg-gray-100 rounded-lg mb-6 mt-4">
                                    <input
                                        type="range"
                                        min="2000"
                                        max="25000"
                                        step="500"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                        className="absolute w-full h-full appearance-none bg-transparent cursor-pointer z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1D7EDD] [&::-webkit-slider-thumb]:shadow-md"
                                    />
                                    <div
                                        className="absolute h-full bg-[#1D7EDD] rounded-lg"
                                        style={{ width: `${((priceRange - 2000) / 23000) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[11px] font-bold text-gray-700">
                                    <span>৳2,000</span>
                                    <span>৳{priceRange.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Duration Widget */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center justify-between">
                                    Duration
                                    <LuChevronDown className="text-gray-400" />
                                </h3>
                                <div className="space-y-3">
                                    {["Short Stay", "Long Stay", "Permanent"].map(d => (
                                        <label key={d} className="flex items-center group cursor-pointer">
                                            <div className="relative flex items-center">
                                                <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-200 transition-all checked:bg-[#1D7EDD]" />
                                                <LuCheck className="absolute left-1 opacity-0 text-white peer-checked:opacity-100 transition-opacity" size={12} />
                                            </div>
                                            <span className="ml-3 text-sm font-semibold text-gray-600 group-hover:text-gray-900">{d}</span>
                                        </label>
                                    ))}
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
                                    placeholder="Search country or visa type..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1D7EDD]/10 focus:border-[#1D7EDD] outline-none transition-all text-sm font-semibold text-gray-700"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative min-w-0 flex-1 sm:min-w-[160px]">
                                    <select
                                        className="w-full pl-3 pr-8 py-3 bg-white border border-gray-200 rounded-xl appearance-none text-xs font-bold text-gray-700 outline-none cursor-pointer"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option>Sort (Recently Added)</option>
                                        <option>Price (Low to High)</option>
                                        <option>Price (High to Low)</option>
                                        <option>Most Popular</option>
                                    </select>
                                    <LuChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>

                                <div className="hidden sm:flex bg-white rounded-xl border border-gray-200 p-1">
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

                        {/* Visa Cards Grid */}
                        <AnimatePresence mode="popLayout">
                            {filteredVisas.length > 0 ? (
                                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8" : "space-y-6"}>
                                    {filteredVisas.map((visa, idx) => (
                                        <motion.div
                                            layout
                                            key={visa.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                                            className={`group bg-white rounded-md overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col ${viewMode === "list" ? "md:flex-row h-auto md:h-64" : ""
                                                }`}
                                        >
                                            {/* Image Wrapper */}
                                            <div className={`relative overflow-hidden ${viewMode === "grid" ? "h-48" : "w-full md:w-1/3 h-48 md:h-full"}`}>
                                                <img
                                                    src={visa.image}
                                                    alt={visa.country}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                />
                                                {visa.featured && (
                                                    <div className="absolute top-3 left-3 bg-[#EF8C2C] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                                                        Featured
                                                    </div>
                                                )}
                                                <button className="absolute top-3 right-3 w-8 h-8 rounded-md bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all">
                                                    <LuHeart size={16} />
                                                </button>
                                            </div>

                                            {/* Content Wrapper */}
                                            <div className={`p-5 flex flex-col justify-between ${viewMode === "list" ? "md:w-2/3" : ""}`}>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <LuMapPin className="text-[#EF8C2C]" size={12} />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{visa.country}</span>
                                                    </div>

                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="text-[18px]! font-bold text-gray-900 group-hover:text-[#1D7EDD] transition-colors leading-tight">
                                                            {visa.type}
                                                        </h3>
                                                        <span className="text-[#EF8C2C] text-[10px] font-black uppercase">
                                                            {visa.discount}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-500 text-[12px] font-normal leading-relaxed mb-4 line-clamp-2">
                                                        {visa.description}
                                                    </p>

                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider leading-none mb-1.5">Duration</span>
                                                            <span className="text-[12px] font-bold text-gray-700">{visa.processingTime}</span>
                                                        </div>
                                                        <div className="h-6 w-px bg-gray-100" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider leading-none mb-1.5">Starting From</span>
                                                            <div className="flex items-baseline gap-1.5 leading-none">
                                                                <span className="text-base font-bold text-[#1D7EDD]">৳{visa.price.toLocaleString()}</span>
                                                                <span className="text-[10px] font-normal text-gray-300 line-through">৳{visa.oldPrice.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button className="flex-grow py-2.5 bg-[#1D7EDD] hover:bg-[#1868b8] text-white rounded-md font-bold text-[11px] uppercase tracking-wider transition-all">
                                                        View Details
                                                    </button>
                                                    <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center justify-center text-gray-400 transition-all border border-gray-100">
                                                        <LuEye size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-96 flex flex-col items-center justify-center text-center">
                                    <LuTriangleAlert size={64} className="text-gray-200 mb-6" />
                                    <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tight">No Results Found</h3>
                                    <p className="text-gray-400 text-sm font-medium mt-2 max-w-xs">Try changing your filters or search keywords to find more options.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Support Section */}
            <section className="bg-white border-t border-gray-100 py-12 md:py-24">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tight mb-6 md:mb-8" style={{ fontFamily: '"Teko", sans-serif' }}>
                        Didn't find what you are looking for?
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10 font-medium">
                        Our experts are here to help you with personalized visa solutions tailored to your specific needs and destination.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-10 py-5 bg-[#EF8C2C] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#EF8C2C]/20 hover:-translate-y-1 transition-all">
                            Call Support
                        </button>
                        <button className="px-10 py-5 bg-[#021E14] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:-translate-y-1 transition-all">
                            Live Chat
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
