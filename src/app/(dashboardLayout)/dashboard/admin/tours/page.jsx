"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiLoader, FiEdit, FiTrash2, FiEye,
    FiRefreshCw, FiCalendar, FiPlus, FiX, FiMapPin,
    FiUsers, FiDollarSign, FiClock, FiStar, FiFilter,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const mockTours = [
    { _id: "1", name: "Cox's Bazar Premium Beach Resort", destination: "Cox's Bazar, Bangladesh", duration: "3 Days 2 Nights", price: 12500, groupSize: 24, departureDate: "2025-03-05", status: "active", rating: 4.8, bookings: 18, image: "", category: "beach" },
    { _id: "2", name: "Sundarban Mangrove Adventure", destination: "Sundarban, Bangladesh", duration: "4 Days 3 Nights", price: 15000, groupSize: 16, departureDate: "2025-03-12", status: "active", rating: 4.6, bookings: 12, image: "", category: "adventure" },
    { _id: "3", name: "Thailand Discovery Package", destination: "Bangkok-Pattaya, Thailand", duration: "5 Days 4 Nights", price: 45000, groupSize: 20, departureDate: "2025-04-01", status: "active", rating: 4.9, bookings: 15, image: "", category: "international" },
    { _id: "4", name: "Malaysia Heritage Tour", destination: "KL-Langkawi, Malaysia", duration: "6 Days 5 Nights", price: 55000, groupSize: 18, departureDate: "2025-04-15", status: "upcoming", rating: 4.7, bookings: 8, image: "", category: "international" },
    { _id: "5", name: "Sajek Valley Retreat", destination: "Sajek, Rangamati", duration: "2 Days 1 Night", price: 6500, groupSize: 30, departureDate: "2025-03-20", status: "active", rating: 4.5, bookings: 25, image: "", category: "hill" },
    { _id: "6", name: "Dubai Luxury Experience", destination: "Dubai, UAE", duration: "5 Days 4 Nights", price: 85000, groupSize: 15, departureDate: "2025-05-01", status: "upcoming", rating: 5.0, bookings: 5, image: "", category: "luxury" },
];

export default function TourPackages() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [viewingTour, setViewingTour] = useState(null);
    const token = useSelector(selectToken);

    const fetchTours = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/tours`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            if (data.success && data.data) {
                setTours(Array.isArray(data.data) ? data.data : data.data.data || mockTours);
            } else {
                setTours(mockTours);
            }
        } catch {
            setTours(mockTours);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTours(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this tour package?")) return;
        try {
            await fetch(`${API_BASE}/api/tours/${id}`, {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
        } catch { }
        setTours(prev => prev.filter(t => t._id !== id));
        toast.success("Tour package deleted");
    };

    const filtered = tours.filter(t => {
        const matchSearch =
            t.name?.toLowerCase().includes(search.toLowerCase()) ||
            t.destination?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || t.status === filter || t.category === filter;
        return matchSearch && matchFilter;
    });

    const totalRevenue = tours.reduce((sum, t) => sum + (t.price * t.bookings), 0);
    const totalBookings = tours.reduce((sum, t) => sum + t.bookings, 0);

    const getCategoryColor = (cat) => {
        const colors = {
            beach: "#3B82F6", adventure: "#10B981", international: "#8B5CF6",
            hill: "#F59E0B", luxury: "#EF4444", religious: "#EC4899",
        };
        return colors[cat] || "#6B7280";
    };

    return (
        <div className="p-4 lg:p-6 space-y-5">
            {/* View Modal */}
            <AnimatePresence>
                {viewingTour && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setViewingTour(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-gray-100" style={{ backgroundColor: '#021E14' }}>
                                <div className="flex items-center justify-between">
                                    <div className="text-white">
                                        <p className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Tour Package</p>
                                        <h3 className="text-lg font-bold mt-0.5">{viewingTour.name}</h3>
                                    </div>
                                    <button onClick={() => setViewingTour(null)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                                        <FiX size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Destination", value: viewingTour.destination, icon: FiMapPin },
                                        { label: "Duration", value: viewingTour.duration, icon: FiClock },
                                        { label: "Price", value: `৳${viewingTour.price?.toLocaleString()}`, icon: FiDollarSign },
                                        { label: "Group Size", value: viewingTour.groupSize, icon: FiUsers },
                                        { label: "Bookings", value: `${viewingTour.bookings} / ${viewingTour.groupSize}`, icon: FiCalendar },
                                        { label: "Rating", value: `⭐ ${viewingTour.rating}`, icon: FiStar },
                                    ].map((item) => (
                                        <div key={item.label} className="bg-[#F8FAFC] dark:bg-gray-700/30 rounded-lg p-3">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">{item.label}</p>
                                            <p className="text-[13px] font-semibold text-gray-700 mt-0.5">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Link
                                        href={`/dashboard/admin/tours/${viewingTour._id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold text-white" style={{ backgroundColor: '#021E14' }}
                                    >
                                        <FiEdit size={13} /> Edit Package
                                    </Link>
                                    <button
                                        onClick={() => { setViewingTour(null); handleDelete(viewingTour._id); }}
                                        className="px-4 py-2.5 rounded-lg text-[12px] font-semibold text-red-500 border border-red-200 hover:bg-red-50"
                                    >
                                        <FiTrash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>
                        Tour Packages
                    </h1>
                    <p className="text-[12px] text-gray-400 mt-0.5">{tours.length} packages • {totalBookings} total bookings</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchTours} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50">
                        <FiRefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <Link href="/dashboard/admin/tours/create" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold text-white" style={{ backgroundColor: '#021E14' }}>
                        <FiPlus size={13} /> New Package
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Total Packages", value: tours.length, color: "#021E14" },
                    { label: "Total Bookings", value: totalBookings, color: "#3B82F6" },
                    { label: "Est. Revenue", value: `৳${(totalRevenue / 1000).toFixed(0)}K`, color: "#10B981" },
                    { label: "Active Packages", value: tours.filter(t => t.status === "active").length, color: "#EF8C2C" },
                ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl p-3.5 border border-gray-100 dark:border-gray-700/50">
                        <p className="text-xl font-semibold text-gray-800">{s.value}</p>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        placeholder="Search tours..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F5F6FA] dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-[13px] focus:border-[#021E14] outline-none"
                    />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {["all", "active", "upcoming", "completed"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${filter === s
                                ? "text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                            style={filter === s ? { backgroundColor: '#021E14' } : {}}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tour Cards Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <FiLoader className="animate-spin" size={24} style={{ color: '#021E14' }} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((tour, i) => (
                        <motion.div
                            key={tour._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden group hover:shadow-lg transition-all"
                        >
                            {/* Card Image / Placeholder */}
                            <div className="h-40 relative overflow-hidden" style={{ backgroundColor: '#021E14' }}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FiMapPin size={40} className="text-white/10" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase text-white"
                                        style={{ backgroundColor: getCategoryColor(tour.category) }}>
                                        {tour.category}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setViewingTour(tour)} className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur flex items-center justify-center text-gray-600 hover:bg-white">
                                        <FiEye size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(tour._id)} className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur flex items-center justify-center text-red-500 hover:bg-white">
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-4">
                                <h3 className="text-[13px] font-bold text-gray-800 dark:text-white line-clamp-1">{tour.name}</h3>
                                <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                                    <FiMapPin size={10} /> {tour.destination}
                                </p>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                                    <div>
                                        <p className="text-lg font-bold" style={{ color: '#021E14' }}>৳{tour.price?.toLocaleString()}</p>
                                        <p className="text-[10px] text-gray-400">{tour.duration}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] font-semibold text-gray-600">{tour.bookings}/{tour.groupSize}</p>
                                        <p className="text-[10px] text-gray-400">Booked</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-3">
                                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className="h-1.5 rounded-full transition-all"
                                            style={{
                                                width: `${Math.min((tour.bookings / tour.groupSize) * 100, 100)}%`,
                                                backgroundColor: '#EF8C2C',
                                            }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-semibold text-gray-400">
                                        {Math.round((tour.bookings / tour.groupSize) * 100)}%
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mt-3">
                                    <Link
                                        href={`/dashboard/admin/tours/${tour._id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                                    >
                                        <FiEdit size={12} /> Edit
                                    </Link>
                                    <button
                                        onClick={() => setViewingTour(tour)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold text-white transition-colors"
                                        style={{ backgroundColor: '#021E14' }}
                                    >
                                        <FiEye size={12} /> View
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
