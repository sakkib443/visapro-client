"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LuCalendar, LuPackage, LuClock, LuCircleCheck, LuCircleX, LuLoader } from "react-icons/lu";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const STATUS_STYLE = {
    pending:    { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: <LuClock size={14}/> },
    processing: { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   icon: <LuLoader size={14} className="animate-spin"/> },
    confirmed:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  icon: <LuCircleCheck size={14}/> },
    cancelled:  { bg: "bg-gray-50",   text: "text-gray-500",   border: "border-gray-200",   icon: <LuCircleX size={14}/> },
    rejected:   { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    icon: <LuCircleX size={14}/> },
};

const TYPE_COLOR = { visa: "#3b82f6", hotel: "#f59e0b", tour: "#10b981", hajj: "#8b5cf6", study: "#ef4444" };
const TYPE_LABEL = { visa: "Visa Application", hotel: "Hotel Booking", tour: "Tour Booking", hajj: "Hajj/Umrah", study: "Study Abroad" };

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const token = useSelector(selectToken);

    useEffect(() => {
        if (!token) { setLoading(false); return; }

        fetch(`${BACKEND}/api/bookings/my`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(d => { setBookings(d.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    const filtered = filter === "all" ? bookings : bookings.filter(b => b.type === filter);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
                    <p className="text-gray-500 text-sm mt-1">Track all your service applications and bookings</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {["all", "visa", "hotel", "tour", "hajj", "study"].map(t => (
                        <button key={t} onClick={() => setFilter(t)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${filter === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
                            {t === "all" ? "All" : TYPE_LABEL[t]}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-16">
                        <LuLoader size={32} className="animate-spin text-blue-500" />
                    </div>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-16">
                        <LuPackage size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No bookings found</p>
                        <p className="text-gray-400 text-sm mt-1">Start by applying for a visa, hotel, tour, or more.</p>
                    </div>
                )}

                {/* Booking Cards */}
                <div className="space-y-4">
                    {filtered.map((b, i) => {
                        const st = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
                        return (
                            <motion.div key={b._id}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-stretch">
                                    {/* Color bar */}
                                    <div className="w-1.5 flex-shrink-0" style={{ background: TYPE_COLOR[b.type] || "#6b7280" }} />

                                    <div className="flex-1 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white mb-2 inline-block"
                                                    style={{ background: TYPE_COLOR[b.type] || "#6b7280" }}>
                                                    {TYPE_LABEL[b.type] || b.type}
                                                </span>
                                                <h3 className="font-semibold text-gray-800 text-sm mt-1">{b.serviceName}</h3>
                                                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                    <LuCalendar size={11} />
                                                    {new Date(b.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                                </p>
                                            </div>

                                            {/* Status badge */}
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${st.bg} ${st.text} ${st.border}`}>
                                                {st.icon}
                                                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                            </span>
                                        </div>

                                        {/* Contact */}
                                        <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-4 text-xs text-gray-500">
                                            <span>📞 {b.phone}</span>
                                            <span>✉️ {b.email}</span>
                                        </div>

                                        {/* Admin note */}
                                        {b.adminNote && (
                                            <div className="mt-2 text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
                                                <b>Note from admin:</b> {b.adminNote}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
