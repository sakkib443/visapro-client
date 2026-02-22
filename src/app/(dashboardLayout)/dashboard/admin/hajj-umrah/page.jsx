"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiLoader, FiEdit, FiTrash2, FiEye,
    FiRefreshCw, FiCalendar, FiPlus, FiX,
    FiUsers, FiDollarSign, FiClock, FiStar,
} from "react-icons/fi";
import { FaKaaba } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const mockPackages = [
    { _id: "1", name: "Umrah Standard Package - March", type: "umrah", duration: "10 Days", price: 185000, groupSize: 40, departureDate: "2025-03-20", status: "active", bookings: 32, hotel: "3 Star Makkah + 3 Star Madinah", includes: "Visa, Hotel, Food, Transport, Guide" },
    { _id: "2", name: "Umrah Premium Package - April", type: "umrah", duration: "12 Days", price: 265000, groupSize: 25, departureDate: "2025-04-15", status: "upcoming", bookings: 12, hotel: "5 Star Makkah + 4 Star Madinah", includes: "Visa, Hotel, Full Board, VIP Transport, Guide" },
    { _id: "3", name: "Hajj 2025 Economy Package", type: "hajj", duration: "21 Days", price: 650000, groupSize: 50, departureDate: "2025-06-01", status: "upcoming", bookings: 28, hotel: "Economy Makkah + Economy Madinah + Mina Tent", includes: "Visa, Hotel, Meals, Transport, Sacrifice, Guide" },
    { _id: "4", name: "Hajj 2025 Premium Package", type: "hajj", duration: "25 Days", price: 950000, groupSize: 30, departureDate: "2025-05-28", status: "upcoming", bookings: 8, hotel: "5 Star Makkah + 5 Star Madinah + VIP Mina", includes: "Visa, 5 Star Hotel, Full Board, AC VIP Transport, Sacrifice, Private Guide" },
    { _id: "5", name: "Umrah Ramadan Special", type: "umrah", duration: "15 Days", price: 225000, groupSize: 35, departureDate: "2025-03-10", status: "active", bookings: 30, hotel: "4 Star Makkah + 3 Star Madinah", includes: "Visa, Hotel, Iftar+Suhoor, Transport, Guide" },
];

export default function HajjUmrahPage() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [viewingPkg, setViewingPkg] = useState(null);
    const token = useSelector(selectToken);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/hajj-umrah`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            setPackages(data.success && data.data ? (Array.isArray(data.data) ? data.data : data.data.data || mockPackages) : mockPackages);
        } catch { setPackages(mockPackages); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPackages(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this package?")) return;
        try { await fetch(`${API_BASE}/api/hajj-umrah/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} }); } catch { }
        setPackages(prev => prev.filter(p => p._id !== id));
        toast.success("Package deleted");
    };

    const filtered = packages.filter(p => {
        const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || p.type === filter || p.status === filter;
        return matchSearch && matchFilter;
    });

    const totalBookings = packages.reduce((s, p) => s + p.bookings, 0);
    const totalRevenue = packages.reduce((s, p) => s + (p.price * p.bookings), 0);

    return (
        <div className="p-4 lg:p-6 space-y-5">
            {/* View Modal */}
            <AnimatePresence>
                {viewingPkg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingPkg(null)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="p-5 border-b border-gray-100 rounded-t-xl" style={{ backgroundColor: '#2D1B4E' }}>
                                <div className="flex items-center justify-between">
                                    <div className="text-white">
                                        <p className="text-[10px] uppercase tracking-wider opacity-60 font-bold">{viewingPkg.type === 'hajj' ? '🕋 Hajj' : '🕌 Umrah'} Package</p>
                                        <h3 className="text-lg font-bold mt-0.5">{viewingPkg.name}</h3>
                                    </div>
                                    <button onClick={() => setViewingPkg(null)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><FiX size={16} /></button>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Duration", value: viewingPkg.duration },
                                        { label: "Price", value: `৳${viewingPkg.price?.toLocaleString()}` },
                                        { label: "Hotel", value: viewingPkg.hotel },
                                        { label: "Bookings", value: `${viewingPkg.bookings} / ${viewingPkg.groupSize}` },
                                        { label: "Departure", value: viewingPkg.departureDate },
                                        { label: "Status", value: viewingPkg.status },
                                    ].map((item) => (
                                        <div key={item.label} className="bg-[#F8FAFC] dark:bg-gray-700/30 rounded-lg p-3">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">{item.label}</p>
                                            <p className="text-[12px] font-semibold text-gray-700 mt-0.5 capitalize">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                                {viewingPkg.includes && (
                                    <div className="bg-emerald-50/50 rounded-lg p-4">
                                        <p className="text-[10px] font-bold uppercase text-emerald-600 mb-1">Includes</p>
                                        <p className="text-[12px] text-gray-600">{viewingPkg.includes}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>
                        Hajj & Umrah Packages
                    </h1>
                    <p className="text-[12px] text-gray-400 mt-0.5">{packages.length} packages • {totalBookings} bookings</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchPackages} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50">
                        <FiRefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <Link href="/dashboard/admin/hajj-umrah/create" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold text-white" style={{ backgroundColor: '#021E14' }}>
                        <FiPlus size={13} /> New Package
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Total Packages", value: packages.length },
                    { label: "Total Bookings", value: totalBookings },
                    { label: "Hajj Packages", value: packages.filter(p => p.type === "hajj").length },
                    { label: "Umrah Packages", value: packages.filter(p => p.type === "umrah").length },
                ].map(s => (
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
                    <input placeholder="Search packages..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F5F6FA] dark:bg-gray-700 border border-gray-100 text-[13px] focus:border-[#021E14] outline-none" />
                </div>
                <div className="flex gap-1.5">
                    {["all", "hajj", "umrah"].map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase ${filter === s ? "text-white" : "bg-gray-50 text-gray-500"}`}
                            style={filter === s ? { backgroundColor: '#021E14' } : {}}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards */}
            {loading ? (
                <div className="flex justify-center py-20"><FiLoader className="animate-spin" size={24} style={{ color: '#021E14' }} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((pkg, i) => (
                        <motion.div key={pkg._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden hover:shadow-lg transition-all">
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mb-2 ${pkg.type === 'hajj' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {pkg.type === 'hajj' ? '🕋 Hajj' : '🕌 Umrah'}
                                        </span>
                                        <h3 className="text-[14px] font-bold text-gray-800 dark:text-white">{pkg.name}</h3>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${pkg.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {pkg.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    <div className="bg-[#F8FAFC] rounded-lg p-2.5 text-center">
                                        <p className="text-[10px] text-gray-400">Duration</p>
                                        <p className="text-[12px] font-semibold text-gray-700">{pkg.duration}</p>
                                    </div>
                                    <div className="bg-[#F8FAFC] rounded-lg p-2.5 text-center">
                                        <p className="text-[10px] text-gray-400">Price</p>
                                        <p className="text-[12px] font-semibold text-emerald-600">৳{(pkg.price / 1000).toFixed(0)}K</p>
                                    </div>
                                    <div className="bg-[#F8FAFC] rounded-lg p-2.5 text-center">
                                        <p className="text-[10px] text-gray-400">Booked</p>
                                        <p className="text-[12px] font-semibold text-gray-700">{pkg.bookings}/{pkg.groupSize}</p>
                                    </div>
                                </div>

                                <p className="text-[11px] text-gray-400 mb-3">📍 {pkg.hotel}</p>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                        <div className="h-1.5 rounded-full" style={{ width: `${(pkg.bookings / pkg.groupSize) * 100}%`, backgroundColor: '#EF8C2C' }} />
                                    </div>
                                    <span className="text-[10px] font-semibold text-gray-400">{Math.round((pkg.bookings / pkg.groupSize) * 100)}%</span>
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={() => setViewingPkg(pkg)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold text-white" style={{ backgroundColor: '#021E14' }}>
                                        <FiEye size={12} /> View
                                    </button>
                                    <button onClick={() => handleDelete(pkg._id)} className="px-3 py-2 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 text-[11px]">
                                        <FiTrash2 size={12} />
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
