"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiLoader, FiEdit, FiTrash2, FiEye,
    FiRefreshCw, FiPlus, FiX, FiCalendar, FiDollarSign,
} from "react-icons/fi";
import { LuPlane } from "react-icons/lu";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const mockTickets = [
    { _id: "1", ticketId: "AT-001", passengerName: "Mohammad Sakib", airline: "Biman Bangladesh", from: "Dhaka (DAC)", to: "London (LHR)", departureDate: "2025-03-15", returnDate: "2025-04-15", class: "Economy", price: 85000, status: "confirmed", phone: "+880171XXXXXXX" },
    { _id: "2", ticketId: "AT-002", passengerName: "Fatima Rahman", airline: "Emirates", from: "Dhaka (DAC)", to: "Dubai (DXB)", departureDate: "2025-03-20", returnDate: "2025-03-28", class: "Business", price: 125000, status: "confirmed", phone: "+880181XXXXXXX" },
    { _id: "3", ticketId: "AT-003", passengerName: "Ahmed Hasan", airline: "Singapore Airlines", from: "Dhaka (DAC)", to: "Singapore (SIN)", departureDate: "2025-04-05", returnDate: "2025-04-12", class: "Economy", price: 45000, status: "pending", phone: "+880191XXXXXXX" },
    { _id: "4", ticketId: "AT-004", passengerName: "Nusrat Jahan", airline: "Qatar Airways", from: "Dhaka (DAC)", to: "Toronto (YYZ)", departureDate: "2025-05-01", returnDate: "", class: "Economy", price: 95000, status: "confirmed", phone: "+880161XXXXXXX" },
    { _id: "5", ticketId: "AT-005", passengerName: "Kamal Uddin", airline: "Malaysian Airlines", from: "Dhaka (DAC)", to: "Kuala Lumpur (KUL)", departureDate: "2025-03-25", returnDate: "2025-04-01", class: "Economy", price: 32000, status: "cancelled", phone: "+880151XXXXXXX" },
];

export default function AirTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [viewingTicket, setViewingTicket] = useState(null);
    const token = useSelector(selectToken);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/air-tickets`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            const data = await res.json();
            setTickets(data.success && data.data ? (Array.isArray(data.data) ? data.data : data.data.data || mockTickets) : mockTickets);
        } catch { setTickets(mockTickets); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchTickets(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this booking?")) return;
        try { await fetch(`${API_BASE}/api/air-tickets/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} }); } catch { }
        setTickets(prev => prev.filter(t => t._id !== id));
        toast.success("Booking deleted");
    };

    const filtered = tickets.filter(t => {
        const matchSearch = t.passengerName?.toLowerCase().includes(search.toLowerCase()) || t.ticketId?.toLowerCase().includes(search.toLowerCase()) || t.airline?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || t.status === filter;
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

    return (
        <div className="p-4 lg:p-6 space-y-5">
            {/* View Modal */}
            <AnimatePresence>
                {viewingTicket && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingTicket(null)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="p-5 rounded-t-xl" style={{ backgroundColor: '#021E14' }}>
                                <div className="flex items-center justify-between text-white">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider opacity-60 font-bold">✈️ Flight Booking</p>
                                        <h3 className="text-lg font-bold mt-0.5">{viewingTicket.ticketId}</h3>
                                    </div>
                                    <button onClick={() => setViewingTicket(null)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"><FiX size={16} /></button>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex items-center justify-center gap-4 py-3">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-gray-800">{viewingTicket.from?.split("(")[1]?.replace(")", "")}</p>
                                        <p className="text-[10px] text-gray-400">{viewingTicket.from?.split("(")[0]}</p>
                                    </div>
                                    <div className="flex-1 border-t-2 border-dashed border-gray-200 relative">
                                        <LuPlane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#EF8C2C] bg-white px-1" size={20} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-gray-800">{viewingTicket.to?.split("(")[1]?.replace(")", "")}</p>
                                        <p className="text-[10px] text-gray-400">{viewingTicket.to?.split("(")[0]}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Passenger", value: viewingTicket.passengerName },
                                        { label: "Airline", value: viewingTicket.airline },
                                        { label: "Class", value: viewingTicket.class },
                                        { label: "Price", value: `৳${viewingTicket.price?.toLocaleString()}` },
                                        { label: "Departure", value: viewingTicket.departureDate },
                                        { label: "Return", value: viewingTicket.returnDate || "One Way" },
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
                    <h1 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>Air Tickets</h1>
                    <p className="text-[12px] text-gray-400 mt-0.5">{tickets.length} bookings</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchTickets} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50">
                        <FiRefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <Link href="/dashboard/admin/air-tickets/create" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold text-white" style={{ backgroundColor: '#021E14' }}>
                        <FiPlus size={13} /> New Booking
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Total Bookings", value: tickets.length },
                    { label: "Confirmed", value: tickets.filter(t => t.status === "confirmed").length },
                    { label: "Pending", value: tickets.filter(t => t.status === "pending").length },
                    { label: "Revenue", value: `৳${(tickets.reduce((s, t) => s + (t.status !== "cancelled" ? t.price : 0), 0) / 1000).toFixed(0)}K` },
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
                    <input placeholder="Search by name, ticket ID, airline..." value={search} onChange={(e) => setSearch(e.target.value)}
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

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-20"><FiLoader className="animate-spin" size={24} style={{ color: '#021E14' }} /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Ticket</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Passenger</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Route</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Airline</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Date</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Price</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                                    <th className="text-center px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((ticket, i) => (
                                    <motion.tr key={ticket._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3 text-[11px] font-mono font-semibold text-gray-500">{ticket.ticketId}</td>
                                        <td className="px-4 py-3 text-[12px] font-semibold text-gray-700">{ticket.passengerName}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-[11px] text-gray-600">
                                                <span>{ticket.from?.split("(")[1]?.replace(")", "")}</span>
                                                <LuPlane size={10} className="text-[#EF8C2C]" />
                                                <span>{ticket.to?.split("(")[1]?.replace(")", "")}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[11px] text-gray-600">{ticket.airline}</td>
                                        <td className="px-4 py-3 text-[11px] text-gray-500">{ticket.departureDate}</td>
                                        <td className="px-4 py-3 text-[12px] font-semibold text-gray-700">৳{ticket.price?.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getStatusStyle(ticket.status)}`}>{ticket.status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => setViewingTicket(ticket)} className="w-7 h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-400 flex items-center justify-center"><FiEye size={13} /></button>
                                                <button onClick={() => handleDelete(ticket._id)} className="w-7 h-7 rounded-md bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center"><FiTrash2 size={13} /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
