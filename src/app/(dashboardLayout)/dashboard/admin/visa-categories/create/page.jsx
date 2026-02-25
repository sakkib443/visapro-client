"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiArrowLeft, FiSave, FiGlobe, FiLoader, FiImage,
    FiHash, FiType, FiToggleRight, FiToggleLeft,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const iconOptions = [
    { label: "Beach/Tourist", value: "🏖️" },
    { label: "Work/Job", value: "💼" },
    { label: "Student", value: "🎓" },
    { label: "Business", value: "📊" },
    { label: "Medical", value: "🏥" },
    { label: "Transit", value: "✈️" },
    { label: "Globe", value: "🌍" },
    { label: "Document", value: "📃" },
    { label: "Family", value: "🏠" },
    { label: "Religious", value: "🕌" },
    { label: "Event", value: "🎪" },
    { label: "Diplomatic", value: "🤝" },
];

export default function CreateVisaCategory() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const isEditMode = !!editId;
    const token = useSelector(selectToken);

    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        nameBn: "",
        description: "",
        descriptionBn: "",
        icon: "🌍",
        image: "",
        isActive: true,
        order: 0,
    });

    useEffect(() => {
        if (isEditMode && editId) {
            fetchCategoryData(editId);
        }
    }, [editId]);

    const fetchCategoryData = async (id) => {
        setFetchingData(true);
        try {
            const res = await fetch(`${API_BASE}/api/visa-categories/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            if (data.success && data.data) {
                const cat = data.data;
                setFormData({
                    name: cat.name || "",
                    nameBn: cat.nameBn || "",
                    description: cat.description || "",
                    descriptionBn: cat.descriptionBn || "",
                    icon: cat.icon || "🌍",
                    image: cat.image || "",
                    isActive: cat.isActive !== undefined ? cat.isActive : true,
                    order: cat.order || 0,
                });
            } else {
                toast.error("Category not found");
                router.push("/dashboard/admin/visa-categories");
            }
        } catch {
            toast.error("Failed to fetch category data");
            router.push("/dashboard/admin/visa-categories");
        } finally {
            setFetchingData(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : name === "order" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Category name is required");
            return;
        }

        setLoading(true);
        try {
            const url = isEditMode
                ? `${API_BASE}/api/visa-categories/${editId}`
                : `${API_BASE}/api/visa-categories`;

            const method = isEditMode ? "PATCH" : "POST";

            const payload = { ...formData };
            if (!payload.image) delete payload.image;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(isEditMode ? "Category updated successfully!" : "Category created successfully!");
                router.push("/dashboard/admin/visa-categories");
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (err) {
            toast.error("Failed to save category");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="p-4 lg:p-6 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <FiLoader className="animate-spin mx-auto mb-3" size={28} style={{ color: 'var(--color-primary)' }} />
                    <p className="text-[13px] text-gray-400">Loading category data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard/admin/visa-categories"
                    className="w-9 h-9 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                >
                    <FiArrowLeft size={16} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: 'var(--color-secondary-dark)' }}>
                        {isEditMode ? "Edit Category" : "Add Category"}
                    </h1>
                    <p className="text-[14px] text-gray-600 mt-0.5">
                        {isEditMode ? "Update visa category information" : "Create a new visa category"}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Basic Info */}
                        <div className="bg-white rounded-md border border-gray-100 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2" style={{ backgroundColor: 'var(--color-secondary-10)' }}>
                                <FiType size={14} style={{ color: 'var(--color-secondary)' }} />
                                <h2 className="text-[15px] font-bold" style={{ color: 'var(--color-secondary-dark)' }}>Basic Information</h2>
                            </div>
                            <div className="p-5 space-y-4">
                                {/* Name English */}
                                <div>
                                    <label className="text-[13px] font-bold uppercase text-gray-700 mb-1.5 block">
                                        Category Name (English) <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Tourist Visa"
                                        className="w-full px-4 py-2.5 rounded-md border border-gray-200 text-[15px] text-gray-900 outline-none transition-all"
                                        style={{ '--focus-color': 'var(--color-secondary)' }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-secondary)'; e.target.style.boxShadow = '0 0 0 3px var(--color-secondary-10)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                                        required
                                    />
                                </div>

                                {/* Name Bengali */}
                                <div>
                                    <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">
                                        Category Name (বাংলা)
                                    </label>
                                    <input
                                        type="text"
                                        name="nameBn"
                                        value={formData.nameBn}
                                        onChange={handleChange}
                                        placeholder="যেমন: পর্যটক ভিসা"
                                        className="w-full px-4 py-2.5 rounded-md border border-gray-200 text-[15px] text-gray-900 outline-none transition-all"
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-secondary)'; e.target.style.boxShadow = '0 0 0 3px var(--color-secondary-10)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                                    />
                                </div>

                                {/* Description English */}
                                <div>
                                    <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">
                                        Description (English)
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Brief description of this visa category..."
                                        className="w-full px-4 py-2.5 rounded-md border border-gray-200 text-[15px] text-gray-900 outline-none transition-all resize-none"
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-secondary)'; e.target.style.boxShadow = '0 0 0 3px var(--color-secondary-10)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                                    />
                                </div>

                                {/* Description Bengali */}
                                <div>
                                    <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">
                                        Description (বাংলা)
                                    </label>
                                    <textarea
                                        name="descriptionBn"
                                        value={formData.descriptionBn}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="এই ভিসা ক্যাটাগরির সংক্ষিপ্ত বিবরণ..."
                                        className="w-full px-4 py-2.5 rounded-md border border-gray-200 text-[13px] outline-none transition-all resize-none"
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-secondary)'; e.target.style.boxShadow = '0 0 0 3px var(--color-secondary-10)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="bg-white rounded-md border border-gray-100 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2" style={{ backgroundColor: 'var(--color-secondary-10)' }}>
                                <FiImage size={14} style={{ color: 'var(--color-secondary)' }} />
                                <h2 className="text-[15px] font-bold" style={{ color: 'var(--color-secondary-dark)' }}>Category Image</h2>
                            </div>
                            <div className="p-5">
                                <label className="text-[13px] font-bold uppercase text-gray-700 mb-1.5 block">
                                    Image URL
                                </label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 text-[15px] text-gray-900 outline-none transition-all"
                                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-secondary)'; e.target.style.boxShadow = '0 0 0 3px var(--color-secondary-10)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                                />
                                {formData.image && (
                                    <div className="mt-3 rounded-md overflow-hidden border border-gray-100">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-full h-40 object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Preview */}
                        <div className="bg-white rounded-md border border-gray-100 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100">
                                <h2 className="text-[15px] font-bold text-gray-800">Preview</h2>
                            </div>
                            <div className="p-5">
                                <div className="rounded-md p-5 text-center bg-gray-100 border border-gray-200">
                                    <div className="w-14 h-14 rounded-md bg-white flex items-center justify-center text-2xl mx-auto mb-3 border border-gray-200">
                                        {formData.icon || "🌍"}
                                    </div>
                                    <h3 className="text-gray-900 font-bold text-[16px]">
                                        {formData.name || "Category Name"}
                                    </h3>
                                    {formData.nameBn && (
                                        <p className="text-gray-600 text-[13px] mt-0.5">{formData.nameBn}</p>
                                    )}
                                    <p className="text-gray-500 text-[12px] mt-2 line-clamp-2">
                                        {formData.description || "Description will appear here"}
                                    </p>
                                    <div className={`inline-flex items-center gap-1 mt-3 px-2.5 py-1 rounded-md text-[12px] font-bold ${formData.isActive
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                        : "bg-red-50 text-red-500 border border-red-200"
                                        }`}>
                                        {formData.isActive ? "Active" : "Inactive"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Icon Selection */}
                        <div className="bg-white rounded-md border border-gray-100 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2" style={{ backgroundColor: 'var(--color-primary-10)' }}>
                                <FiGlobe size={14} style={{ color: 'var(--color-primary)' }} />
                                <h2 className="text-[15px] font-bold" style={{ color: 'var(--color-primary-dark)' }}>Icon</h2>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-6 gap-1.5">
                                    {iconOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, icon: opt.value }))}
                                            className={`w-full py-2 rounded-md flex items-center justify-center text-base transition-all ${formData.icon === opt.value
                                                ? "scale-105"
                                                : "bg-gray-50 hover:bg-gray-100"
                                                }`}
                                            style={formData.icon === opt.value ? {
                                                backgroundColor: 'var(--color-primary-10)',
                                                boxShadow: '0 0 0 2px var(--color-primary)',
                                            } : {}}
                                            title={opt.label}
                                        >
                                            {opt.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="bg-white rounded-md border border-gray-100 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2" style={{ backgroundColor: 'var(--color-primary-10)' }}>
                                <FiHash size={14} style={{ color: 'var(--color-primary)' }} />
                                <h2 className="text-[15px] font-bold" style={{ color: 'var(--color-primary-dark)' }}>Settings</h2>
                            </div>
                            <div className="p-5 space-y-4">
                                {/* Order */}
                                <div>
                                    <label className="text-[13px] font-bold uppercase text-gray-700 mb-1.5 block">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-4 py-2.5 rounded-md border border-gray-200 text-[15px] text-gray-900 outline-none transition-all"
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-secondary)'; e.target.style.boxShadow = '0 0 0 3px var(--color-secondary-10)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                                    />
                                    <p className="text-[12px] text-gray-500 mt-1">Lower numbers appear first</p>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="text-[13px] font-bold uppercase text-gray-700 mb-1.5 block">
                                        Status
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md border transition-all ${formData.isActive
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                            : "border-gray-200 bg-gray-50 text-gray-500"
                                            }`}
                                    >
                                        <span className="text-[14px] font-semibold">
                                            {formData.isActive ? "Active" : "Inactive"}
                                        </span>
                                        {formData.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md text-[15px] font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            {loading ? (
                                <><FiLoader size={15} className="animate-spin" /> Saving...</>
                            ) : (
                                <><FiSave size={15} /> {isEditMode ? "Update Category" : "Create Category"}</>
                            )}
                        </motion.button>

                        {/* Cancel */}
                        <Link
                            href="/dashboard/admin/visa-categories"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md text-[15px] font-semibold border transition-all hover:bg-gray-50"
                            style={{ color: 'var(--color-secondary)', borderColor: 'var(--color-secondary-20)' }}
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
