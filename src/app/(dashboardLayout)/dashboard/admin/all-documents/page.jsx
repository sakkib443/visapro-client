"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FiEdit3, FiTrash2, FiPlus, FiLoader, FiEye, FiSearch, FiRefreshCw,
} from "react-icons/fi";
import { LuFileText, LuUser, LuCalendar, LuGlobe } from "react-icons/lu";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TYPE_COLORS = {
    visa: "bg-green-100 text-green-700",
    flight_ticket: "bg-orange-100 text-orange-700",
    passport: "bg-blue-100 text-blue-700",
    hotel_booking: "bg-purple-100 text-purple-700",
    itinerary: "bg-cyan-100 text-cyan-700",
    other: "bg-gray-100 text-gray-700",
};

export default function AllDocumentsPage() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState(null);

    const fetchDocs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/doc-entries`);
            const json = await res.json();
            if (json.success) setDocs(json.data || []);
        } catch {
            toast.error("Documents লোড ব্যর্থ");
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchDocs(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("এই Document মুছে ফেলতে চান?")) return;
        setDeleting(id);
        try {
            const res = await fetch(`${API}/api/doc-entries/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (json.success) {
                setDocs(prev => prev.filter(d => d._id !== id));
                toast.success("🗑️ Document মুছে ফেলা হয়েছে");
            }
        } catch {
            toast.error("Delete ব্যর্থ");
        } finally { setDeleting(null); }
    };

    const filtered = docs.filter(d => {
        const q = search.toLowerCase();
        return !q ||
            (d.fullNameEn || "").toLowerCase().includes(q) ||
            (d.documentNumber || "").toLowerCase().includes(q) ||
            (d.passportNo || "").toLowerCase().includes(q) ||
            (d.country || "").toLowerCase().includes(q) ||
            (d.documentType || "").toLowerCase().includes(q);
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-5">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                            <LuFileText className="text-blue-600" /> All Documents
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">সব সংরক্ষিত Visa/Travel Document দেখুন, Edit করুন</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchDocs} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">
                            <FiRefreshCw size={13} /> Refresh
                        </button>
                        <Link href="/dashboard/admin/visa-documents/create"
                            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">
                            <FiPlus size={14} /> New Document
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, document no, passport, country..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-all" />
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <FiLoader size={32} className="animate-spin text-blue-500" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <LuFileText size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-semibold">
                            {search ? "কোনো Document পাওয়া যায়নি" : "কোনো Document সেভ করা হয়নি"}
                        </p>
                        <Link href="/dashboard/admin/visa-documents/create"
                            className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
                            <FiPlus size={14} /> নতুন Document তৈরি করুন
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-xs text-gray-400 font-medium">{filtered.length} টি Document পাওয়া গেছে</p>

                        {filtered.map((d, idx) => (
                            <motion.div key={d._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">

                                <div className="flex flex-col sm:flex-row">
                                    {/* Left: Type badge */}
                                    <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white p-4 sm:w-44 flex flex-col items-center justify-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${TYPE_COLORS[d.documentType] || TYPE_COLORS.other}`}>
                                            {(d.documentType || "other").replace(/_/g, " ")}
                                        </span>
                                        {d.country && (
                                            <div className="flex items-center gap-1 text-xs text-slate-300">
                                                <LuGlobe size={10} /> {d.country}
                                            </div>
                                        )}
                                    </div>

                                    {/* Middle: Details */}
                                    <div className="flex-1 p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <LuUser size={12} className="text-blue-500" />
                                                    <span className="text-sm font-bold text-gray-800">{d.fullNameEn || "No Name"}</span>
                                                    {d.fullNameBn && <span className="text-xs text-gray-400">({d.fullNameBn})</span>}
                                                </div>
                                                <div className="flex items-center gap-4 text-[11px] text-gray-500 flex-wrap">
                                                    {d.documentNumber && <span>📋 Ref: <b className="text-gray-700">{d.documentNumber}</b></span>}
                                                    {d.passportNo && <span>🛂 Passport: <b className="text-gray-700">{d.passportNo}</b></span>}
                                                    {d.visaNumber && <span>🔖 Visa: <b className="text-gray-700">{d.visaNumber}</b></span>}
                                                    {d.visaType && <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold">{d.visaType}</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <LuCalendar size={10} />
                                                {new Date(d.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                            </span>
                                            {d.phone && <span>📞 {d.phone}</span>}
                                            {d.fromCity && d.toCity && <span>✈ {d.fromCity} → {d.toCity}</span>}
                                            {d.hotelName && <span>🏨 {d.hotelName}</span>}
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex sm:flex-col items-center gap-2 p-3 sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-100">
                                        <Link href={`/dashboard/admin/visa-documents/create?id=${d._id}`}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold hover:bg-blue-100 transition-all">
                                            <FiEdit3 size={12} /> Edit
                                        </Link>
                                        <Link href={`/dashboard/admin/visa-documents/create?id=${d._id}`}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-[11px] font-bold hover:bg-green-100 transition-all">
                                            <FiEye size={12} /> View
                                        </Link>
                                        <button onClick={() => handleDelete(d._id)} disabled={deleting === d._id}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-[11px] font-bold hover:bg-red-100 transition-all disabled:opacity-50">
                                            {deleting === d._id ? <FiLoader size={12} className="animate-spin" /> : <FiTrash2 size={12} />} Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
