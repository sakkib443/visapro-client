"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiFileText, FiLoader, FiEdit, FiTrash2, FiEye,
    FiRefreshCw, FiCalendar, FiPlus, FiX, FiCheck, FiFilter,
    FiChevronLeft, FiChevronRight, FiGlobe, FiUser, FiPhone,
    FiMail, FiDollarSign, FiMapPin, FiDownload,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Mock data for demo
const mockApplications = [
    { _id: "1", applicationId: "VA-2025-001", firstName: "Mohammad", lastName: "Sakib", email: "sakib@email.com", phone: "+880171XXXXXXX", visaType: "Tourist Visa", country: "United Kingdom", passportNo: "AB1234567", status: "processing", fee: 15000, appliedDate: "2025-02-20", notes: "Documents submitted" },
    { _id: "2", applicationId: "VA-2025-002", firstName: "Fatima", lastName: "Rahman", email: "fatima@email.com", phone: "+880181XXXXXXX", visaType: "Student Visa", country: "Canada", passportNo: "CD2345678", status: "approved", fee: 25000, appliedDate: "2025-02-19", notes: "Approved - Pickup ready" },
    { _id: "3", applicationId: "VA-2025-003", firstName: "Ahmed", lastName: "Hasan", email: "ahmed@email.com", phone: "+880191XXXXXXX", visaType: "Work Visa", country: "Australia", passportNo: "EF3456789", status: "pending", fee: 35000, appliedDate: "2025-02-18", notes: "Awaiting employer letter" },
    { _id: "4", applicationId: "VA-2025-004", firstName: "Nusrat", lastName: "Jahan", email: "nusrat@email.com", phone: "+880161XXXXXXX", visaType: "Visit Visa", country: "United States", passportNo: "GH4567890", status: "approved", fee: 20000, appliedDate: "2025-02-17", notes: "" },
    { _id: "5", applicationId: "VA-2025-005", firstName: "Kamal", lastName: "Uddin", email: "kamal@email.com", phone: "+880151XXXXXXX", visaType: "Tourist Visa", country: "Malaysia", passportNo: "IJ5678901", status: "rejected", fee: 8000, appliedDate: "2025-02-16", notes: "Insufficient funds" },
    { _id: "6", applicationId: "VA-2025-006", firstName: "Rina", lastName: "Akter", email: "rina@email.com", phone: "+880141XXXXXXX", visaType: "Student Visa", country: "Germany", passportNo: "KL6789012", status: "processing", fee: 22000, appliedDate: "2025-02-15", notes: "Interview scheduled" },
    { _id: "7", applicationId: "VA-2025-007", firstName: "Tanvir", lastName: "Islam", email: "tanvir@email.com", phone: "+880131XXXXXXX", visaType: "Business Visa", country: "Japan", passportNo: "MN7890123", status: "pending", fee: 30000, appliedDate: "2025-02-14", notes: "" },
    { _id: "8", applicationId: "VA-2025-008", firstName: "Sumaiya", lastName: "Khan", email: "sumaiya@email.com", phone: "+880121XXXXXXX", visaType: "Medical Visa", country: "India", passportNo: "OP8901234", status: "approved", fee: 5000, appliedDate: "2025-02-13", notes: "Hospital appointment letter received" },
];

const countryFlags = {
    "United Kingdom": "🇬🇧", "Canada": "🇨🇦", "Australia": "🇦🇺", "United States": "🇺🇸",
    "Malaysia": "🇲🇾", "Germany": "🇩🇪", "Japan": "🇯🇵", "India": "🇮🇳",
    "United Arab Emirates": "🇦🇪", "Saudi Arabia": "🇸🇦", "Singapore": "🇸🇬", "Thailand": "🇹🇭",
};

export default function VisaApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewingApp, setViewingApp] = useState(null);
    const [editingApp, setEditingApp] = useState(null);
    const [editStatus, setEditStatus] = useState("");
    const [editNotes, setEditNotes] = useState("");
    const token = useSelector(selectToken);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            // Try to fetch from API, fall back to mock
            const res = await fetch(`${API_BASE}/api/visa-applications`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            if (data.success && data.data) {
                setApplications(Array.isArray(data.data) ? data.data : data.data.data || mockApplications);
            } else {
                setApplications(mockApplications);
            }
        } catch {
            setApplications(mockApplications);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleUpdateStatus = async (id) => {
        try {
            // Try API update
            await fetch(`${API_BASE}/api/visa-applications/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({ status: editStatus, notes: editNotes }),
            });
        } catch { }

        // Optimistic update
        setApplications(prev => prev.map(app =>
            app._id === id ? { ...app, status: editStatus, notes: editNotes } : app
        ));
        toast.success("Application updated");
        setEditingApp(null);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this application? This action cannot be undone.")) return;
        try {
            await fetch(`${API_BASE}/api/visa-applications/${id}`, {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
        } catch { }
        setApplications(prev => prev.filter(app => app._id !== id));
        toast.success("Application deleted");
    };

    const filtered = applications.filter(app => {
        const matchSearch =
            app.applicationId?.toLowerCase().includes(search.toLowerCase()) ||
            `${app.firstName} ${app.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
            app.country?.toLowerCase().includes(search.toLowerCase()) ||
            app.visaType?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || app.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === "pending").length,
        processing: applications.filter(a => a.status === "processing").length,
        approved: applications.filter(a => a.status === "approved").length,
        rejected: applications.filter(a => a.status === "rejected").length,
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "approved": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "processing": return "bg-blue-50 text-blue-600 border-blue-100";
            case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
            case "rejected": return "bg-red-50 text-red-500 border-red-100";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    const getStatusDot = (status) => {
        switch (status) {
            case "approved": return "bg-emerald-500";
            case "processing": return "bg-blue-500";
            case "pending": return "bg-amber-500";
            case "rejected": return "bg-red-500";
            default: return "bg-gray-400";
        }
    };

    return (
        <div className="p-4 lg:p-6 space-y-5">
            {/* View Modal */}
            <AnimatePresence>
                {viewingApp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setViewingApp(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-5 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between" style={{ backgroundColor: '#021E14' }}>
                                <div className="text-white">
                                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Application Details</p>
                                    <h3 className="text-lg font-bold mt-0.5">{viewingApp.applicationId}</h3>
                                </div>
                                <button
                                    onClick={() => setViewingApp(null)}
                                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                >
                                    <FiX size={16} />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase text-gray-400">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize border ${getStatusStyle(viewingApp.status)}`}>
                                        {viewingApp.status}
                                    </span>
                                </div>

                                {/* Applicant Info */}
                                <div className="bg-[#F8FAFC] dark:bg-gray-700/30 rounded-lg p-4 space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Applicant Information</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[10px] text-gray-400">Full Name</p>
                                            <p className="text-[13px] font-semibold text-gray-700">{viewingApp.firstName} {viewingApp.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400">Email</p>
                                            <p className="text-[13px] text-gray-600">{viewingApp.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400">Phone</p>
                                            <p className="text-[13px] text-gray-600">{viewingApp.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400">Passport No</p>
                                            <p className="text-[13px] font-mono text-gray-600">{viewingApp.passportNo}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Visa Info */}
                                <div className="bg-[#F8FAFC] dark:bg-gray-700/30 rounded-lg p-4 space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Visa Details</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[10px] text-gray-400">Visa Type</p>
                                            <p className="text-[13px] font-semibold text-gray-700">{viewingApp.visaType}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400">Country</p>
                                            <p className="text-[13px] text-gray-600">{countryFlags[viewingApp.country] || "🌍"} {viewingApp.country}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400">Fee</p>
                                            <p className="text-[13px] font-semibold text-emerald-600">৳{viewingApp.fee?.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400">Applied Date</p>
                                            <p className="text-[13px] text-gray-600">{viewingApp.appliedDate}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {viewingApp.notes && (
                                    <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">Notes</p>
                                        <p className="text-[12px] text-gray-600">{viewingApp.notes}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => {
                                            setViewingApp(null);
                                            setEditingApp(viewingApp);
                                            setEditStatus(viewingApp.status);
                                            setEditNotes(viewingApp.notes || "");
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold text-white transition-colors" style={{ backgroundColor: '#021E14' }}
                                    >
                                        <FiEdit size={13} /> Update Status
                                    </button>
                                    <button
                                        onClick={() => { setViewingApp(null); handleDelete(viewingApp._id); }}
                                        className="px-4 py-2.5 rounded-lg text-[12px] font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                                    >
                                        <FiTrash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Status Modal */}
            <AnimatePresence>
                {editingApp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setEditingApp(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-gray-100 dark:border-gray-700/50">
                                <h3 className="text-sm font-semibold text-gray-800">Update Application Status</h3>
                                <p className="text-[11px] text-gray-400 mt-0.5">{editingApp.applicationId} • {editingApp.firstName} {editingApp.lastName}</p>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Status</label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 text-[13px] focus:border-[#021E14] outline-none"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Notes</label>
                                    <textarea
                                        value={editNotes}
                                        onChange={(e) => setEditNotes(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 text-[13px] focus:border-[#021E14] outline-none resize-none"
                                        placeholder="Add notes about this application..."
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdateStatus(editingApp._id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold text-white transition-colors" style={{ backgroundColor: '#021E14' }}
                                    >
                                        <FiCheck size={13} /> Save Changes
                                    </button>
                                    <button
                                        onClick={() => setEditingApp(null)}
                                        className="px-4 py-2.5 rounded-lg text-[12px] font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
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
                        Visa Applications
                    </h1>
                    <p className="text-[12px] text-gray-400 mt-0.5">{applications.length} total applications</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchApplications}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50 transition-all"
                    >
                        <FiRefreshCw size={13} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    <Link
                        href="/dashboard/admin/visa-applications/create"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold text-white transition-all" style={{ backgroundColor: '#021E14' }}
                    >
                        <FiPlus size={13} /> New Application
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                    { label: "Total", value: stats.total, color: "#021E14" },
                    { label: "Pending", value: stats.pending, color: "#F59E0B" },
                    { label: "Processing", value: stats.processing, color: "#3B82F6" },
                    { label: "Approved", value: stats.approved, color: "#10B981" },
                    { label: "Rejected", value: stats.rejected, color: "#EF4444" },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="bg-white dark:bg-gray-800 rounded-xl p-3.5 border border-gray-100 dark:border-gray-700/50 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => setStatusFilter(s.label === "Total" ? "all" : s.label.toLowerCase())}
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                            <p className="text-xl font-semibold text-gray-800 dark:text-white">{s.value}</p>
                        </div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        placeholder="Search by name, ID, country, visa type..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F5F6FA] dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-[13px] focus:border-[#021E14] outline-none transition-all"
                    />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {["all", "pending", "processing", "approved", "rejected"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${statusFilter === s
                                ? "text-white" : "bg-gray-50 dark:bg-gray-700 text-gray-500 hover:bg-gray-100"
                                }`}
                            style={statusFilter === s ? { backgroundColor: '#021E14' } : {}}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <FiLoader className="animate-spin" size={24} style={{ color: '#021E14' }} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <FiFileText size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-[13px] font-medium">No applications found</p>
                        <p className="text-[11px] mt-1">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Application</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Applicant</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Visa Type</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Country</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Fee</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                                    <th className="text-center px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((app, i) => (
                                    <motion.tr
                                        key={app._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="text-[11px] font-mono font-semibold text-gray-500">{app.applicationId}</p>
                                            <p className="text-[10px] text-gray-400">{app.appliedDate}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-200">{app.firstName} {app.lastName}</p>
                                            <p className="text-[10px] text-gray-400">{app.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-[11px] text-gray-600">{app.visaType}</td>
                                        <td className="px-4 py-3 text-[12px]">
                                            {countryFlags[app.country] || "🌍"} <span className="text-[11px] text-gray-600">{app.country}</span>
                                        </td>
                                        <td className="px-4 py-3 text-[12px] font-semibold text-gray-700">৳{app.fee?.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(app.status)}`} />
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${getStatusStyle(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => setViewingApp(app)}
                                                    className="w-7 h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye size={13} />
                                                </button>
                                                <button
                                                    onClick={() => { setEditingApp(app); setEditStatus(app.status); setEditNotes(app.notes || ""); }}
                                                    className="w-7 h-7 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-500 flex items-center justify-center transition-colors"
                                                    title="Update Status"
                                                >
                                                    <FiEdit size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(app._id)}
                                                    className="w-7 h-7 rounded-md bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={13} />
                                                </button>
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
