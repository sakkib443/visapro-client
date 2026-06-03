"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiLoader, FiEdit, FiTrash2, FiEye,
    FiRefreshCw, FiPlus, FiX, FiDollarSign,
    FiCalendar, FiGlobe, FiMapPin, FiBookOpen,
} from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const countryFlags = { "Canada": "🇨🇦", "Germany": "🇩🇪", "United Kingdom": "🇬🇧", "Australia": "🇦🇺", "Malaysia": "🇲🇾", "United States": "🇺🇸", "Japan": "🇯🇵" };

export default function StudyAbroadPage() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [viewingProg, setViewingProg] = useState(null);
    const token = useSelector(selectToken);

    const fetch_programs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/study-abroad`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            const data = await res.json();
            if (res.ok && data.success && data.data) {
                const list = Array.isArray(data.data) ? data.data : data.data.data;
                setPrograms(Array.isArray(list) ? list : []);
            } else {
                setPrograms([]);
            }
        } catch {
            toast.error("Failed to fetch programs");
            setPrograms([]);
        }
        finally { setLoading(false); }
    };

    useEffect(() => { fetch_programs(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this program?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/study-abroad/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success) {
                setPrograms(prev => prev.filter(p => p._id !== id));
                if (viewingProg?._id === id) setViewingProg(null);
                toast.success("Program deleted");
            } else {
                toast.error(data.message || "Failed to delete program");
            }
        } catch {
            toast.error("Failed to delete program");
        }
    };

    const filtered = programs.filter(p => {
        const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.country?.toLowerCase().includes(search.toLowerCase()) || p.university?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || p.degree?.toLowerCase() === filter || p.status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="p-4 lg:p-6 space-y-5">
            {/* View Modal */}
            <AnimatePresence>
                {viewingProg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingProg(null)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="p-5 border-b border-gray-100 rounded-t-xl" style={{ background: 'linear-gradient(135deg, #021E14, #0A3D2B)' }}>
                                <div className="flex items-center justify-between">
                                    <div className="text-white">
                                        <p className="text-[10px] uppercase tracking-wider opacity-60 font-bold">🎓 Study Abroad Program</p>
                                        <h3 className="text-[15px] font-bold mt-0.5 leading-tight">{viewingProg.name}</h3>
                                    </div>
                                    <button onClick={() => setViewingProg(null)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><FiX size={16} /></button>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Country", value: `${countryFlags[viewingProg.country] || "🌍"} ${viewingProg.country}` },
                                        { label: "University", value: viewingProg.university },
                                        { label: "Degree", value: viewingProg.degree },
                                        { label: "Duration", value: viewingProg.duration },
                                        { label: "Tuition", value: viewingProg.tuition === 0 ? "Tuition Free" : `৳${viewingProg.tuition?.toLocaleString()}` },
                                        { label: "Deadline", value: viewingProg.deadline },
                                        { label: "Applications", value: viewingProg.applications },
                                        { label: "Scholarship", value: viewingProg.scholarship },
                                    ].map(item => (
                                        <div key={item.label} className="bg-[#F8FAFC] rounded-lg p-3">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">{item.label}</p>
                                            <p className="text-[12px] font-semibold text-gray-700 mt-0.5">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                                {viewingProg.requirements && (
                                    <div className="bg-blue-50/50 rounded-lg p-3">
                                        <p className="text-[10px] font-bold uppercase text-blue-600 mb-1">Requirements</p>
                                        <p className="text-[12px] text-gray-600">{viewingProg.requirements}</p>
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
                    <h1 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>Study Abroad Programs</h1>
                    <p className="text-[12px] text-gray-400 mt-0.5">{programs.length} programs available</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetch_programs} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50">
                        <FiRefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <Link href="/dashboard/admin/study-abroad/create" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold text-white" style={{ backgroundColor: '#021E14' }}>
                        <FiPlus size={13} /> Add Program
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-3 border border-gray-100 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input placeholder="Search programs, universities, countries..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F5F6FA] border border-gray-100 text-[13px] focus:border-[#021E14] outline-none" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {["all", "open", "upcoming", "bachelor's", "master's"].map(s => (
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
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <LuGraduationCap size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-[13px]">No programs found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Program</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Country</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Degree</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Tuition</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Deadline</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Apps</th>
                                    <th className="text-center px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((prog, i) => (
                                    <motion.tr key={prog._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="text-[12px] font-semibold text-gray-700 line-clamp-1">{prog.name}</p>
                                            <p className="text-[10px] text-gray-400">{prog.university}</p>
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">{countryFlags[prog.country] || "🌍"} <span className="text-[11px] text-gray-600">{prog.country}</span></td>
                                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600">{prog.degree}</span></td>
                                        <td className="px-4 py-3 text-[12px] font-semibold text-gray-700">{prog.tuition === 0 ? <span className="text-emerald-500">Free</span> : `৳${(prog.tuition / 100000).toFixed(1)}L`}</td>
                                        <td className="px-4 py-3 text-[11px] text-gray-500">{prog.deadline}</td>
                                        <td className="px-4 py-3 text-[12px] font-semibold text-gray-600">{prog.applications}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => setViewingProg(prog)} className="w-7 h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-400 flex items-center justify-center"><FiEye size={13} /></button>
                                                <button onClick={() => handleDelete(prog._id)} className="w-7 h-7 rounded-md bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center"><FiTrash2 size={13} /></button>
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
