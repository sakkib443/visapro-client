"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiFileText, FiLoader, FiTrash2, FiEye,
    FiRefreshCw, FiPlus, FiX, FiUser, FiPhone,
    FiEdit, FiChevronLeft, FiChevronRight, FiCheckCircle,
} from "react-icons/fi";
import { LuFileText, LuCalendar, LuGlobe, LuBadgeCheck } from "react-icons/lu";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATUS_CONFIG = {
    pending:    { label: "Pending",    color: "bg-yellow-100 text-yellow-700" },
    processing: { label: "Processing", color: "bg-blue-100 text-blue-700" },
    delivered:  { label: "Delivered",  color: "bg-green-100 text-green-700" },
};

export default function AdminVisaDocuments() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewingDoc, setViewingDoc] = useState(null);
    const [editingDoc, setEditingDoc] = useState(null);
    const [editStatus, setEditStatus] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;
    const token = useSelector(selectToken);

    const fetchDocs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set("searchTerm", search);
            if (statusFilter !== "all") params.set("status", statusFilter);
            params.set("page", page);
            params.set("limit", limit);

            const res = await fetch(`${API_BASE}/api/visa-documents?${params}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            if (data.success) {
                setDocs(data.data || []);
                setTotal(data.meta?.total || 0);
            } else {
                setDocs([]);
            }
        } catch {
            setDocs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDocs(); }, [search, statusFilter, page]);

    const handleDelete = async (id) => {
        if (!confirm("এই ডকুমেন্টটি মুছে ফেলবেন?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/visa-documents/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Document deleted");
                fetchDocs();
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const handleUpdateStatus = async () => {
        if (!editingDoc) return;
        try {
            const res = await fetch(`${API_BASE}/api/visa-documents/${editingDoc._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: editStatus }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Status updated");
                setEditingDoc(null);
                fetchDocs();
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const filtered = docs.filter(d =>
        !search || (
            d.applicantName?.toLowerCase().includes(search.toLowerCase()) ||
            d.passportNo?.toLowerCase().includes(search.toLowerCase()) ||
            d.country?.toLowerCase().includes(search.toLowerCase())
        )
    );

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="p-4 lg:p-6 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <LuFileText className="text-[#1D7EDD]" />
                        Visa Documents
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Total: {total} documents
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchDocs} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all" title="Refresh">
                        <FiRefreshCw size={15} className="text-gray-500" />
                    </button>
                    <Link
                        href="/dashboard/admin/visa-documents/create"
                        className="flex items-center gap-2 px-4 py-2 bg-[#1D7EDD] text-white rounded-lg text-sm font-semibold hover:bg-[#1565c0] transition-all"
                    >
                        <FiPlus size={15} />
                        Create Document
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search by name, passport, country..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD] bg-white"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD] bg-white"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <FiLoader size={24} className="animate-spin text-[#1D7EDD]" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <LuFileText size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No documents found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">#</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Applicant</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Country / Visa</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Passport No</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Images</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((doc, i) => (
                                    <tr key={doc._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * limit + i + 1}</td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-semibold text-gray-800 text-[13px]">{doc.applicantName}</p>
                                                {doc.user && (
                                                    <p className="text-[11px] text-gray-400">
                                                        {doc.user.firstName} {doc.user.lastName}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-[13px] font-medium text-gray-700">{doc.country || "—"}</p>
                                            <p className="text-[11px] text-gray-400">{doc.visaType || "—"}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-[12px] text-gray-600">{doc.passportNo || "—"}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[12px] text-gray-500">{doc.images?.length || 0} img</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${STATUS_CONFIG[doc.status]?.color || "bg-gray-100 text-gray-600"}`}>
                                                {STATUS_CONFIG[doc.status]?.label || doc.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-[12px] text-gray-500">
                                            {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-BD") : "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => setViewingDoc(doc)}
                                                    className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 transition-all"
                                                    title="View"
                                                >
                                                    <FiEye size={13} />
                                                </button>
                                                <button
                                                    onClick={() => { setEditingDoc(doc); setEditStatus(doc.status); }}
                                                    className="p-1.5 rounded-md hover:bg-orange-50 text-orange-500 transition-all"
                                                    title="Edit Status"
                                                >
                                                    <FiEdit size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doc._id)}
                                                    className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-all"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-all"
                        >
                            <FiChevronLeft size={14} />
                        </button>
                        <span className="text-sm text-gray-600">{page} / {totalPages}</span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-all"
                        >
                            <FiChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* View Modal */}
            <AnimatePresence>
                {viewingDoc && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setViewingDoc(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-800">Visa Document Details</h3>
                                <button onClick={() => setViewingDoc(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <FiX size={16} />
                                </button>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {[
                                        ["Applicant Name", viewingDoc.applicantName],
                                        ["Applicant Name (BN)", viewingDoc.applicantNameBn],
                                        ["Phone", viewingDoc.phone],
                                        ["Passport No", viewingDoc.passportNo],
                                        ["Visa Type", viewingDoc.visaType],
                                        ["Country", viewingDoc.country],
                                        ["Visa No", viewingDoc.visaNo],
                                        ["Issue Date", viewingDoc.issueDate ? new Date(viewingDoc.issueDate).toLocaleDateString() : "—"],
                                        ["Expiry Date", viewingDoc.expiryDate ? new Date(viewingDoc.expiryDate).toLocaleDateString() : "—"],
                                        ["Entry Type", viewingDoc.entryType],
                                        ["Status", viewingDoc.status],
                                    ].filter(([, v]) => v).map(([label, value]) => (
                                        <div key={label}>
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                                            <p className="font-semibold text-gray-800 capitalize">{value}</p>
                                        </div>
                                    ))}
                                </div>
                                {viewingDoc.notes && (
                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Notes</p>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{viewingDoc.notes}</p>
                                    </div>
                                )}
                                {viewingDoc.user && (
                                    <div className="bg-blue-50 rounded-lg p-3">
                                        <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">Assigned User</p>
                                        <p className="text-sm font-semibold text-blue-800">
                                            {viewingDoc.user.firstName} {viewingDoc.user.lastName}
                                        </p>
                                        <p className="text-xs text-blue-600">{viewingDoc.user.email}</p>
                                    </div>
                                )}
                                {viewingDoc.images?.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
                                            Uploaded Images ({viewingDoc.images.length})
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {viewingDoc.images.map((img, i) => (
                                                <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                                                    <img src={img} alt={`doc-${i + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Status Modal */}
            <AnimatePresence>
                {editingDoc && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setEditingDoc(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Update Status</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Applicant: <strong>{editingDoc.applicantName}</strong>
                            </p>
                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD] mb-4"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="delivered">Delivered</option>
                            </select>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingDoc(null)}
                                    className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateStatus}
                                    className="flex-1 py-2.5 bg-[#1D7EDD] text-white rounded-lg text-sm font-semibold hover:bg-[#1565c0]"
                                >
                                    Update
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
