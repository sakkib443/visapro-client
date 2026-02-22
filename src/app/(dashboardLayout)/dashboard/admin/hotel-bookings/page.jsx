"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiLoader, FiTrash2, FiEye,
    FiRefreshCw, FiPlus, FiX, FiCalendar, FiDollarSign,
    FiStar, FiUsers,
} from "react-icons/fi";
import { LuHotel } from "react-icons/lu";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const mockBookings = [
    { _id: "1", bookingId: "HB-001", guestName: "Mohammad Sakib", hotel: "Radisson Blu Dhaka", city: "Dhaka", checkIn: "2025-03-15", checkOut: "2025-03-18", rooms: 1, roomType: "Deluxe", price: 25000, status: "confirmed", phone: "+880171XXXXXXX" },
    { _id: "2", bookingId: "HB-002", guestName: "Fatima Rahman", hotel: "Hilton Kuala Lumpur", city: "Kuala Lumpur", checkIn: "2025-04-01", checkOut: "2025-04-05", rooms: 2, roomType: "Suite", price: 85000, status: "confirmed", phone: "+880181XXXXXXX" },
    { _id: "3", bookingId: "HB-003", guestName: "Ahmed Hasan", hotel: "Long Beach Hotel Coxbazar", city: "Cox's Bazar", checkIn: "2025-03-20", checkOut: "2025-03-23", rooms: 1, roomType: "Ocean View", price: 18000, status: "pending", phone: "+880191XXXXXXX" },
    { _id: "4", bookingId: "HB-004", guestName: "Nusrat Jahan", hotel: "JW Marriott Dubai", city: "Dubai", checkIn: "2025-05-10", checkOut: "2025-05-15", rooms: 1, roomType: "Premium", price: 120000, status: "confirmed", phone: "+880161XXXXXXX" },
    { _id: "5", bookingId: "HB-005", guestName: "Kamal Uddin", hotel: "Pan Pacific Singapore", city: "Singapore", checkIn: "2025-04-12", checkOut: "2025-04-14", rooms: 1, roomType: "Standard", price: 35000, status: "cancelled", phone: "+880151XXXXXXX" },
];

export default function HotelBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [viewingBooking, setViewingBooking] = useState(null);
    const token = useSelector(selectToken);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/hotel-bookings`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            const data = await res.json();
            setBookings(data.success && data.data ? (Array.isArray(data.data) ? data.data : data.data.data || mockBookings) : mockBookings);
        } catch { setBookings(mockBookings); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this booking?")) return;
        try { await fetch(`${API_BASE}/api/hotel-bookings/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} }); } catch { }
        setBookings(prev => prev.filter(b => b._id !== id));
        toast.success("Booking deleted");
    };

    const filtered = bookings.filter(b => {
        const matchSearch = b.guestName?.toLowerCase().includes(search.toLowerCase()) || b.hotel?.toLowerCase().includes(search.toLowerCase()) || b.bookingId?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || b.status === filter;
        return matchSearch && matchFilter;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case "confirmed": return "bg-emerald-50 text-emerald-600";
            case "pending": return "bg-amber-50 text-amber-600";
            case "cancelled": return "bg-red-50 text-red-500";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    const getNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        return Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="p-4 lg:p-6 space-y-5">
            {/* View Modal */}
            <AnimatePresence>
                {viewingBooking && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingBooking(null)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="p-5 rounded-t-xl" style={{ backgroundColor: '#021E14' }}>
                                <div className="flex items-center justify-between text-white">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider opacity-60 font-bold">🏨 Hotel Booking</p>
                                        <h3 className="text-lg font-bold mt-0.5">{viewingBooking.hotel}</h3>
                                    </div>
                                    <button onClick={() => setViewingBooking(null)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"><FiX size={16} /></button>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Guest", value: viewingBooking.guestName },
                                        { label: "City", value: viewingBooking.city },
                                        { label: "Check-in", value: viewingBooking.checkIn },
                                        { label: "Check-out", value: viewingBooking.checkOut },
                                        { label: "Nights", value: getNights(viewingBooking.checkIn, viewingBooking.checkOut) },
                                        { label: "Room Type", value: viewingBooking.roomType },
                                        { label: "Rooms", value: viewingBooking.rooms },
                                        { label: "Total Price", value: `৳${viewingBooking.price?.toLocaleString()}` },
                                    ].map(item => (
                                        <div key={item.label} className="bg-[#F8FAFC] rounded-lg p-3">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">{item.label}</p>
                                            <p className="text-[12px] font-semibold text-gray-700 mt-0.5">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>Hotel Bookings</h1>
                    <p className="text-[12px] text-gray-400 mt-0.5">{bookings.length} bookings</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchBookings} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50">
                        <FiRefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <Link href="/dashboard/admin/hotel-bookings/create" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold text-white" style={{ backgroundColor: '#021E14' }}>
                        <FiPlus size={13} /> New Booking
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Total Bookings", value: bookings.length },
                    { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length },
                    { label: "Pending", value: bookings.filter(b => b.status === "pending").length },
                    { label: "Revenue", value: `৳${(bookings.reduce((s, b) => s + (b.status !== "cancelled" ? b.price : 0), 0) / 1000).toFixed(0)}K` },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl p-3.5 border border-gray-100">
                        <p className="text-xl font-semibold text-gray-800">{s.value}</p>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-3 border border-gray-100 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input placeholder="Search by guest, hotel, booking ID..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F5F6FA] border border-gray-100 text-[13px] focus:border-[#021E14] outline-none" />
                </div>
                <div className="flex gap-1.5">
                    {["all", "confirmed", "pending", "cancelled"].map(s => (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((booking, i) => (
                        <motion.div key={booking._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-[10px] font-mono text-gray-400">{booking.bookingId}</p>
                                    <h3 className="text-[13px] font-bold text-gray-800 mt-0.5">{booking.hotel}</h3>
                                    <p className="text-[11px] text-gray-400">{booking.city}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getStatusStyle(booking.status)}`}>{booking.status}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <div className="bg-[#F8FAFC] rounded-lg p-2 text-center">
                                    <p className="text-[9px] text-gray-400">Check-in</p>
                                    <p className="text-[11px] font-semibold text-gray-700">{booking.checkIn?.split("-").slice(1).join("/")}</p>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-lg p-2 text-center">
                                    <p className="text-[9px] text-gray-400">Nights</p>
                                    <p className="text-[11px] font-semibold text-gray-700">{getNights(booking.checkIn, booking.checkOut)}</p>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-lg p-2 text-center">
                                    <p className="text-[9px] text-gray-400">Rooms</p>
                                    <p className="text-[11px] font-semibold text-gray-700">{booking.rooms}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-[10px] text-gray-400">Guest</p>
                                    <p className="text-[12px] font-semibold text-gray-700">{booking.guestName}</p>
                                </div>
                                <p className="text-lg font-bold" style={{ color: '#021E14' }}>৳{booking.price?.toLocaleString()}</p>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => setViewingBooking(booking)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold text-white" style={{ backgroundColor: '#021E14' }}>
                                    <FiEye size={12} /> View
                                </button>
                                <button onClick={() => handleDelete(booking._id)} className="px-3 py-2 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 text-[11px]">
                                    <FiTrash2 size={12} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
