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

// Mock Data for Tours
const tourData = [
    {
        id: 1,
        title: "Majestic Switzerland: Alpine Adventure",
        location: "Switzerland",
        category: "Adventure",
        tourType: "Solo Tour",
        duration: "07/Days",
        price: 1850.00,
        oldPrice: 2100.00,
        rating: 4.9,
        reviews: 124,
        image: "https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Experience the breathtaking beauty of the Swiss Alps, crystal clear lakes, and charming villages.",
        featured: true,
        tags: ["Alpine", "Nature", "Luxury"]
    },
    {
        id: 2,
        title: "Dubai Skyline & Desert Safari",
        location: "Saudi Arabia",
        category: "City Tour",
        tourType: "Group Tour",
        duration: "05/Hours",
        price: 850.00,
        oldPrice: 950.00,
        rating: 4.8,
        reviews: 210,
        image: "https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "From the world's tallest building to the golden sands of the Arabian desert, explore the wonders of Dubai.",
        featured: false,
        tags: ["City", "Safari", "Shopping"]
    },
    {
        id: 3,
        title: "Culture & Cuisine Discovery",
        location: "Saudi Arabia",
        category: "Culture",
        tourType: "Solo Tour",
        duration: "02/Hours",
        price: 65.00,
        oldPrice: 85.00,
        rating: 4.9,
        reviews: 89,
        image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Walk through the blue-domed churches of Oia and enjoy the most beautiful sunsets in the world.",
        featured: true,
        tags: ["Beach", "History", "Couple"]
    },
    {
        id: 4,
        title: "Tropical Paradise: Bali Explorer",
        location: "Indonesia",
        category: "Nature",
        tourType: "Family Tour",
        duration: "08/Days",
        price: 650.00,
        oldPrice: 750.00,
        rating: 4.7,
        reviews: 156,
        image: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Discover the spiritual heart of Bali, lush rice terraces, and pristine beaches of Nusa Penida.",
        featured: false,
        tags: ["Spiritual", "Tropical", "Budget"]
    },
];

const tourCategories = ["All Tours", "Adventure", "City Tour", "Romantic", "Nature", "Culture", "History", "Beach"];

function TourContent() {
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
                tour.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === "All Tours" || tour.category === selectedCategory;
            const matchesPrice = tour.price <= priceRange;
            const matchesType = selectedType === "All Types" || tour.tourType === selectedType; // Updated filtering logic

            // Duration matching logic
            let matchesDuration = true;
            if (selectedDurations.length > 0) {
                matchesDuration = selectedDurations.some(d => tour.duration.includes(d));
            }

            return matchesSearch && matchesCategory && matchesPrice && matchesType && matchesDuration;
        });
    }, [searchQuery, selectedCategory, priceRange, selectedType, selectedDurations]); // Updated dependency array

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All Tours");
        setPriceRange(2000);
        setSelectedType("All Types"); // Updated reset logic
        setSelectedDurations([]);
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen text-[#021E14]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {/* 1. Hero Section - Content-fit, Professional */}
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
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                        Discover Amazing Places
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4"
                        style={{ fontFamily: 'Teko, sans-serif', color: '#FFFFFF' }}
                    >
                        Explore The <span style={{ color: '#EF8C2C' }}>World</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-sm font-normal mb-8 max-w-md"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                        Handcrafted tour packages designed for unforgettable experiences.
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
                            placeholder="Find your next destination..."
                            className="w-full pl-12 pr-4 sm:pr-32 py-4 bg-white/95 backdrop-blur-md rounded-2xl text-sm font-normal shadow-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="hidden sm:block absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-[#021E14] text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-primary transition-all">
                            Search
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
                    >
                        <LuFilter size={16} />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                        <LuChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

                    {/* LEFT SIDEBAR - Clean Classic Filter */}
                    <aside className={`w-full lg:w-[300px] flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="lg:sticky lg:top-32 space-y-5">
                            <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden">
                                {/* Sidebar Header */}
                                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="text-lg font-black text-[#021E14] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Teko, sans-serif' }}>
                                        <LuFilter size={16} style={{ color: '#EF8C2C' }} /> Filters
                                    </h3>
                                    <button
                                        onClick={resetFilters}
                                        className="text-[10px] font-semibold uppercase tracking-wider hover:underline"
                                        style={{ color: '#3590CF' }}
                                    >
                                        Reset All
                                    </button>
                                </div>

                                {/* Tour Category */}
                                <div className="px-5 py-5 border-b border-gray-100">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Category</h4>
                                    <div className="space-y-0.5">
                                        {tourCategories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`w-full text-left px-3 py-2 rounded transition-all text-[13px] flex items-center justify-between ${selectedCategory === cat
                                                    ? "bg-gray-100 text-[#021E14] font-semibold"
                                                    : "text-gray-600 hover:bg-gray-50 font-normal"
                                                    }`}
                                            >
                                                {cat}
                                                {selectedCategory === cat && (
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#EF8C2C' }} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="px-5 py-5 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Price Range</h4>
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
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Tour Type</h4>
                                    <div className="space-y-0.5">
                                        {["All Types", "Solo Tour", "Group Tour", "Family Tour"].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={`w-full text-left px-3 py-2 rounded transition-all text-[13px] flex items-center justify-between ${selectedType === type
                                                    ? "bg-gray-100 text-[#021E14] font-semibold"
                                                    : "text-gray-600 hover:bg-gray-50 font-normal"
                                                    }`}
                                            >
                                                {type}
                                                {selectedType === type && (
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#EF8C2C' }} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Duration */}
                                <div className="px-5 py-5">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Duration</h4>
                                    <div className="flex gap-2">
                                        {["Hours", "Days"].map(dur => (
                                            <button
                                                key={dur}
                                                onClick={() => toggleFilter(dur, selectedDurations, setSelectedDurations)}
                                                className={`flex-1 py-2 rounded text-[11px] font-semibold uppercase tracking-wider border transition-all ${selectedDurations.includes(dur)
                                                    ? "text-[#021E14] border-[#021E14] bg-gray-100 font-bold"
                                                    : "text-gray-500 border-gray-200 hover:border-gray-300 bg-white"
                                                    }`}
                                            >
                                                {dur}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="p-5 rounded-lg text-white relative overflow-hidden" style={{ backgroundColor: '#021E14' }}>
                                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: 'rgba(239,140,44,0.15)' }} />
                                <h4 className="text-sm font-black uppercase tracking-[0.15em] mb-2" style={{ fontFamily: 'Teko, sans-serif', color: '#EF8C2C' }}>Custom Experience</h4>
                                <p className="text-[11px] font-normal leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Plan a unique journey tailored just for you by our travel experts.</p>
                                <button className="w-full py-2.5 rounded border text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white hover:text-[#021E14]" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                    Get a Quote
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT CONTENT AREA - Refined Grid & Cards */}
                    <main className="flex-grow min-w-0">
                        {/* Control Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-10 pb-4 md:pb-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-[#021E14] uppercase leading-none mb-1.5" style={{ fontFamily: 'Teko, sans-serif' }}>
                                    {selectedCategory}
                                </h2>
                                <p className="text-[10px] text-gray-400 font-normal uppercase tracking-[0.2em]">
                                    Found {filteredTours.length} results
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
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option>Featured</option>
                                        <option>Price: Low-High</option>
                                        <option>Price: High-Low</option>
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
                                            className={`group bg-white p-4 rounded-md border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col ${viewMode === "list" ? "md:flex-row h-auto md:h-72" : ""
                                                }`}
                                        >
                                            {/* Image Section - Professional Refinement */}
                                            <div className={`relative overflow-hidden rounded-md ${viewMode === "grid" ? "h-[220px]" : "w-full md:w-[35%] h-[220px] md:h-full"}`}>
                                                <img
                                                    src={tour.image}
                                                    alt={tour.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                {/* Tour Type Badge */}
                                                <div className="absolute top-3 right-3">
                                                    <span className="px-4 py-1.5 bg-[#FFD700] text-black text-[10px] font-bold rounded-full shadow-md">
                                                        {tour.tourType || "Solo Tour"}
                                                    </span>
                                                </div>

                                                {/* Slider Indicators */}
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1 px-2 bg-black/10 backdrop-blur-sm rounded-full">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full opacity-100" />
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60" />
                                                    <div className="w-5 h-1.5 bg-primary rounded-full" />
                                                </div>
                                            </div>

                                            {/* Details Section */}
                                            <div className={`pt-5 flex flex-col justify-between flex-grow ${viewMode === "list" ? "md:pl-6 md:pt-0 md:w-[65%]" : ""}`}>
                                                <div>
                                                    <h3 className="text-[20px] font-bold text-[#021E14] group-hover:text-primary transition-colors leading-tight mb-3 line-clamp-2">
                                                        {tour.title}
                                                    </h3>

                                                    {/* Meta Info Line */}
                                                    <div className="flex items-center gap-4 mb-5">
                                                        <div className="flex items-center gap-1.5 text-gray-500">
                                                            <LuMapPin className="text-gray-400" size={14} />
                                                            <span className="text-[12px] font-normal">{tour.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-500">
                                                            <div className="flex items-center justify-center rotate-[-45deg] border border-gray-300 rounded-full w-4 h-4 text-[10px]">↔</div>
                                                            <span className="text-[12px] font-normal">{tour.duration}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Footer Info */}
                                                <div className="flex items-end justify-between">
                                                    <Link
                                                        href={`/tour/${tour.id}`}
                                                        className="px-6 py-3 bg-primary hover:bg-[#021E14] text-white rounded-md text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                                                    >
                                                        Book Now <LuArrowRight className="rotate-[-45deg]" size={14} />
                                                    </Link>

                                                    <div className="text-right">
                                                        <span className="block text-[10px] text-gray-400 font-normal mb-1">per person</span>
                                                        <span className="text-[22px] font-black text-[#021E14]">
                                                            ${tour.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </div>
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
                                    <h3 className="text-xl font-black text-gray-300 uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif' }}>Nothing Found</h3>
                                    <p className="text-gray-400 text-[11px] font-normal mt-2 max-w-[200px]">We couldn't find any tours matching your criteria.</p>
                                    <button
                                        onClick={() => { setSearchQuery(""); setSelectedCategory("All Tours"); }}
                                        className="mt-6 px-6 py-2.5 bg-[#021E14] text-white rounded-md text-[10px] font-bold uppercase tracking-widest transition-all"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Newsletter - Cleaner Design */}
            <section className="bg-white py-24 border-t border-gray-50">
                <div className="max-w-[1400px] mx-auto px-4 text-center">
                    <LuUsers className="text-secondary mx-auto mb-6" size={32} />
                    <h2 className="text-3xl md:text-5xl font-black text-[#021E14] uppercase tracking-tight mb-4" style={{ fontFamily: 'Teko, sans-serif' }}>
                        Join Our <span className="text-primary">Global Club</span>
                    </h2>
                    <p className="text-gray-400 text-[12px] max-w-lg mx-auto mb-10 font-normal leading-relaxed">
                        Stay updated with ultra-exclusive tour deals and luxury travel inspiration delivered once a week.
                    </p>
                    <form className="max-w-md mx-auto flex gap-2 p-1.5 bg-gray-50 rounded-md border border-gray-100 focus-within:bg-white transition-all shadow-sm">
                        <input type="email" placeholder="Email address" className="flex-grow px-5 py-3 text-[11px] bg-transparent outline-none font-normal" />
                        <button className="px-6 py-3 bg-[#021E14] text-white rounded-md font-bold text-[9px] uppercase tracking-widest shadow-lg shadow-black/10">Join Now</button>
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
