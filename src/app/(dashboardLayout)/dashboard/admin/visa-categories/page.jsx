"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiLoader, FiEdit, FiTrash2,
    FiRefreshCw, FiPlus, FiGlobe,
    FiToggleLeft, FiToggleRight,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categoryIcons = {
    "Tourist Visa": "🏖️",
    "Working Visa": "💼",
    "Student Visa": "🎓",
    "Business Visa": "📊",
    "Medical Visa": "🏥",
    "Transit Visa": "✈️",
};

export default function VisaCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState(null);
    const token = useSelector(selectToken);
    const router = useRouter();

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/visa-categories`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            if (data.success && data.data) {
                setCategories(Array.isArray(data.data) ? data.data : []);
            } else {
                setCategories([]);
            }
        } catch {
            setCategories([]);
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id, name) => {
        if (!confirm(`"${name}" ক্যাটাগরি ডিলিট করতে চান? এই action undo করা যাবে না।`)) return;
        setDeleting(id);
        try {
            const res = await fetch(`${API_BASE}/api/visa-categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
            const data = await res.json();
            if (data.success) {
                setCategories(prev => prev.filter(cat => cat._id !== id));
                toast.success("Category deleted successfully");
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch {
            toast.error("Failed to delete category");
        } finally {
            setDeleting(null);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const res = await fetch(`${API_BASE}/api/visa-categories/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setCategories(prev => prev.map(cat =>
                    cat._id === id ? { ...cat, isActive: !currentStatus } : cat
                ));
                toast.success(`Category ${!currentStatus ? "activated" : "deactivated"}`);
            } else {
                toast.error("Failed to update status");
            }
        } catch {
            toast.error("Failed to update status");
        }
    };

    const filtered = categories.filter(cat =>
        cat.name?.toLowerCase().includes(search.toLowerCase()) ||
        cat.nameBn?.includes(search) ||
        cat.description?.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = categories.filter(c => c.isActive).length;
    const inactiveCount = categories.filter(c => !c.isActive).length;

    return (
        <div className="p-4 lg:p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: 'var(--color-secondary-dark)' }}>
                        Visa Categories
                    </h1>
                    <p className="text-[14px] text-gray-600 mt-0.5">{categories.length} total categories</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchCategories}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        <FiRefreshCw size={13} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    <Link
                        href="/dashboard/admin/visa-categories/create"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <FiPlus size={13} /> Add Category
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Total", value: categories.length, bg: "var(--color-secondary-10)", color: "var(--color-secondary)", icon: "📋" },
                    { label: "Active", value: activeCount, bg: "#ecfdf5", color: "#10B981", icon: "✅" },
                    { label: "Inactive", value: inactiveCount, bg: "#fef2f2", color: "#EF4444", icon: "⏸️" },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="bg-white rounded-md p-4 border border-gray-100 hover:shadow-sm transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xl">{s.icon}</span>
                            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                        </div>
                        <p className="text-[12px] font-semibold text-gray-600 uppercase mt-1.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white rounded-md p-3 border border-gray-100">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 border border-gray-100 text-[15px] text-gray-900 outline-none transition-all"
                        style={{ '--tw-ring-color': 'var(--color-secondary)' }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-secondary)'}
                        onBlur={(e) => e.target.style.borderColor = ''}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-md border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <FiLoader className="animate-spin" size={24} style={{ color: 'var(--color-primary)' }} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <FiGlobe size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-[15px] font-medium">No categories found</p>
                        <p className="text-[13px] mt-1">
                            {categories.length === 0 ? "Click 'Add Category' to create your first visa category" : "Try adjusting your search"}
                        </p>
                        {categories.length === 0 && (
                            <Link
                                href="/dashboard/admin/visa-categories/create"
                                className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-md text-[14px] font-semibold text-white hover:opacity-90 transition-all"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            >
                                <FiPlus size={13} /> Add Category
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100" style={{ backgroundColor: 'var(--color-secondary-10)' }}>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Order</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Category</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Slug</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Description</th>
                                    <th className="text-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Status</th>
                                    <th className="text-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((cat, i) => (
                                    <motion.tr
                                        key={cat._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-[13px] font-bold text-gray-800">
                                                {cat.order || 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-md flex items-center justify-center text-lg"
                                                    style={{ backgroundColor: 'var(--color-primary-10)' }}
                                                >
                                                    {cat.icon || categoryIcons[cat.name] || "🌐"}
                                                </div>
                                                <div>
                                                    <p className="text-[15px] font-semibold text-gray-900">{cat.name}</p>
                                                    {cat.nameBn && <p className="text-[13px] text-gray-600">{cat.nameBn}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[13px] font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md">
                                                {cat.slug}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-[13px] text-gray-700 max-w-[200px] truncate">
                                                {cat.description || "—"}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleToggleStatus(cat._id, cat.isActive)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-bold transition-all ${cat.isActive
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {cat.isActive ? (
                                                    <><FiToggleRight size={12} /> Active</>
                                                ) : (
                                                    <><FiToggleLeft size={12} /> Inactive</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => router.push(`/dashboard/admin/visa-categories/create?edit=${cat._id}`)}
                                                    className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                                                    style={{ backgroundColor: 'var(--color-primary-10)', color: 'var(--color-primary)' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-20)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-10)'}
                                                    title="Edit"
                                                >
                                                    <FiEdit size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat._id, cat.name)}
                                                    disabled={deleting === cat._id}
                                                    className="w-7 h-7 rounded-md bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deleting === cat._id ? (
                                                        <FiLoader size={13} className="animate-spin" />
                                                    ) : (
                                                        <FiTrash2 size={13} />
                                                    )}
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
