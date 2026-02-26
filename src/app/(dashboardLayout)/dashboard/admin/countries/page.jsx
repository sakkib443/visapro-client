"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiLoader, FiEdit, FiTrash2,
    FiRefreshCw, FiPlus, FiGlobe,
    FiToggleLeft, FiToggleRight, FiStar,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";
import CountryFlag, { preloadFlags } from "@/components/shared/CountryFlag";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CountriesPage() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState(null);
    const token = useSelector(selectToken);
    const router = useRouter();

    const fetchCountries = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/countries`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            if (data.success && data.data) {
                const list = Array.isArray(data.data) ? data.data : [];
                setCountries(list);
                preloadFlags(list.map(c => c.name));
            } else {
                setCountries([]);
            }
        } catch {
            setCountries([]);
            toast.error("Failed to fetch countries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const handleDelete = async (id, name) => {
        if (!confirm(`"${name}" দেশটি ডিলিট করতে চান? এই action undo করা যাবে না।`)) return;
        setDeleting(id);
        try {
            const res = await fetch(`${API_BASE}/api/countries/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
            const data = await res.json();
            if (data.success) {
                setCountries(prev => prev.filter(c => c._id !== id));
                toast.success("Country deleted successfully");
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch {
            toast.error("Failed to delete country");
        } finally {
            setDeleting(null);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const res = await fetch(`${API_BASE}/api/countries/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setCountries(prev => prev.map(c =>
                    c._id === id ? { ...c, isActive: !currentStatus } : c
                ));
                toast.success(`Country ${!currentStatus ? "activated" : "deactivated"}`);
            } else {
                toast.error("Failed to update status");
            }
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleToggleFeatured = async (id, currentFeatured) => {
        try {
            const res = await fetch(`${API_BASE}/api/countries/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({ isFeatured: !currentFeatured }),
            });
            const data = await res.json();
            if (data.success) {
                setCountries(prev => prev.map(c =>
                    c._id === id ? { ...c, isFeatured: !currentFeatured } : c
                ));
                toast.success(`Country ${!currentFeatured ? "featured" : "unfeatured"}`);
            } else {
                toast.error("Failed to update");
            }
        } catch {
            toast.error("Failed to update");
        }
    };

    const filtered = countries.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.nameBn?.includes(search) ||
        c.region?.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = countries.filter(c => c.isActive).length;
    const featuredCount = countries.filter(c => c.isFeatured).length;

    return (
        <div className="p-4 lg:p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: 'var(--color-secondary-dark)' }}>
                        Countries
                    </h1>
                    <p className="text-[14px] text-gray-600 mt-0.5">{countries.length} total countries</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchCountries}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        <FiRefreshCw size={13} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    <Link
                        href="/dashboard/admin/countries/create"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <FiPlus size={13} /> Add Country
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Total", value: countries.length, color: "var(--color-secondary)", icon: "🌍" },
                    { label: "Active", value: activeCount, color: "#10B981", icon: "✅" },
                    { label: "Featured", value: featuredCount, color: "#EF8C2C", icon: "⭐" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-md p-4 border border-gray-100 hover:shadow-sm transition-all">
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
                        placeholder="Search countries..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 border border-gray-100 text-[15px] text-gray-900 outline-none transition-all"
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
                        <p className="text-[15px] font-medium">No countries found</p>
                        <p className="text-[13px] mt-1">
                            {countries.length === 0 ? "Click 'Add Country' to create your first country" : "Try adjusting your search"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100" style={{ backgroundColor: 'var(--color-secondary-10)' }}>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Flag</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Country</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Region</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Visa Types</th>
                                    <th className="text-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Starting Price</th>
                                    <th className="text-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Status</th>
                                    <th className="text-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-secondary-dark)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((country, i) => (
                                    <motion.tr
                                        key={country._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <CountryFlag name={country.name} flag={country.flag} size={30} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-[15px] font-semibold text-gray-900">{country.name}</p>
                                                {country.nameBn && <p className="text-[13px] text-gray-600">{country.nameBn}</p>}
                                                <p className="text-[11px] font-mono text-gray-400">{country.slug}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[13px] text-gray-600">
                                                {country.region || "—"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[13px] font-semibold text-gray-700">
                                                {country.visaTypes?.length || 0} types
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-[13px] font-bold" style={{ color: 'var(--color-primary)' }}>
                                                {country.startingPrice ? `৳${country.startingPrice.toLocaleString()}` : "—"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col items-center gap-1">
                                                <button
                                                    onClick={() => handleToggleStatus(country._id, country.isActive)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${country.isActive
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    {country.isActive ? (
                                                        <><FiToggleRight size={11} /> Active</>
                                                    ) : (
                                                        <><FiToggleLeft size={11} /> Inactive</>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleToggleFeatured(country._id, country.isFeatured)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${country.isFeatured
                                                        ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                                                        : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    <FiStar size={11} />
                                                    {country.isFeatured ? "Featured" : "Normal"}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => router.push(`/dashboard/admin/countries/create?edit=${country._id}`)}
                                                    className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                                                    style={{ backgroundColor: 'var(--color-primary-10)', color: 'var(--color-primary)' }}
                                                    title="Edit"
                                                >
                                                    <FiEdit size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(country._id, country.name)}
                                                    disabled={deleting === country._id}
                                                    className="w-7 h-7 rounded-md bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deleting === country._id ? (
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
