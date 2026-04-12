"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LuSearch, LuFilter, LuLoader, LuTrash2, LuCheckCircle, LuXCircle, LuClock, LuRefreshCw } from "react-icons/lu";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const STATUSES = ["pending", "processing", "confirmed", "cancelled", "rejected"];
const TYPES = ["visa", "hotel", "tour", "hajj", "study"];
const TYPE_LABEL = { visa: "Visa", hotel: "Hotel", tour: "Tour", hajj: "Hajj/Umrah", study: "Study" };
const TYPE_COLOR = { visa: "#3b82f6", hotel: "#f59e0b", tour: "#10b981", hajj: "#8b5cf6", study: "#ef4444" };

const STATUS_STYLE = {
    pending:    "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    confirmed:  "bg-green-100 text-green-800",
    cancelled:  "bg-gray-100 text-gray-600",
    rejected:   "bg-red-100 text-red-700",
};

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState(null);
    const [noteModal, setNoteModal] = useState(null); // { id, status }
    const [note, setNote] = useState("");

    const token = typeof window !== "undefined" ? (localStorage.getItem("token") || sessionStorage.getItem("token")) : "";

    const fetchBookings = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (typeFilter) params.set("type", typeFilter);
        if (statusFilter) params.set("status", statusFilter);
        const res = await fetch(`${BACKEND}/api/bookings?${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data.data || []);
        setLoading(false);
    };

    useEffect(() => { fetchBookings(); }, [typeFilter, statusFilter]);

    const updateStatus = async (id, status, adminNote = "") => {
        setUpdating(id);
        await fetch(`${BACKEND}/api/bookings/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status, adminNote }),
        });
        setUpdating(null);
        setNoteModal(null);
        setNote("");
        fetchBookings();
    };

    const deleteBooking = async (id) => {
        if (!confirm("Delete this booking?")) return;
        await fetch(`${BACKEND}/api/bookings/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchBookings();
    };

    const filtered = bookings.filter(b =>
        !search || b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.email?.toLowerCase().includes(search.toLowerCase()) ||
        b.phone?.includes(search)
    );

    return (
        <div className="p-4 md:p-8 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">All Bookings</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Manage visa, hotel, tour, hajj & study bookings</p>
                    </div>
                    <button onClick={fetchBookings} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
                        <LuRefreshCw size={14} /> Refresh
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 flex-1 min-w-48">
                        <LuSearch size={16} className="text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone..."
                            className="w-full text-sm outline-none" />
                    </div>
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                        <option value="">All Types</option>
                        {TYPES.map(t => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                    </select>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                        <option value="">All Status</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    {TYPES.map(t => {
                        const count = bookings.filter(b => b.type === t).length;
                        return (
                            <div key={t} className="bg-white rounded-xl border border-gray-100 p-3 text-center cursor-pointer hover:border-blue-300 transition"
                                onClick={() => setTypeFilter(typeFilter === t ? "" : t)}>
                                <div className="text-2xl font-bold" style={{ color: TYPE_COLOR[t] }}>{count}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{TYPE_LABEL[t]}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center py-16"><LuLoader size={32} className="animate-spin text-blue-500" /></div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        {["Type", "Service", "Customer", "Contact", "Status", "Date", "Actions"].map(h => (
                                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.length === 0 && (
                                        <tr><td colSpan={7} className="text-center py-12 text-gray-400">No bookings found</td></tr>
                                    )}
                                    {filtered.map((b, i) => (
                                        <motion.tr key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                            className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                                                    style={{ background: TYPE_COLOR[b.type] }}>
                                                    {TYPE_LABEL[b.type]}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800 max-w-32 truncate">{b.serviceName}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-800">{b.name}</div>
                                                <div className="text-xs text-gray-400">{b.user?.email || b.email}</div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                <div>{b.phone}</div>
                                                <div className="text-xs">{b.email}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <select value={b.status}
                                                    onChange={e => {
                                                        if (["confirmed", "rejected"].includes(e.target.value)) {
                                                            setNoteModal({ id: b._id, status: e.target.value });
                                                        } else {
                                                            updateStatus(b._id, e.target.value);
                                                        }
                                                    }}
                                                    disabled={updating === b._id}
                                                    className={`text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer ${STATUS_STYLE[b.status]}`}>
                                                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">
                                                {new Date(b.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => deleteBooking(b._id)}
                                                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                    <LuTrash2 size={15} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Note Modal */}
            {noteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="font-bold text-gray-800 mb-2">
                            {noteModal.status === "confirmed" ? "✅ Confirm Booking" : "❌ Reject Booking"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">Add an optional note for the user</p>
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                            placeholder="e.g. Your booking is confirmed for May 15..."
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />
                        <div className="flex gap-3">
                            <button onClick={() => { setNoteModal(null); setNote(""); }}
                                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={() => updateStatus(noteModal.id, noteModal.status, note)}
                                className={`flex-1 py-2 rounded-lg text-sm text-white font-medium transition ${noteModal.status === "confirmed" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
                                {noteModal.status === "confirmed" ? "Confirm" : "Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
