"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
    FiSave, FiLoader, FiArrowLeft, FiPlus, FiTrash2, FiGlobe
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const emptyVisaType = {
    name: "", nameBn: "", processingTime: "", processingTimeBn: "",
    fee: "", governmentFee: "", duration: "", durationBn: "",
    entryType: "single", isAvailable: true,
};

const emptyDocument = {
    title: "", titleBn: "", description: "", descriptionBn: "", isRequired: true,
};

export default function CreateCountryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const isEdit = !!editId;
    const token = useSelector(selectToken);

    const [saving, setSaving] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [activeSection, setActiveSection] = useState("basic");

    // Form state
    const [form, setForm] = useState({
        name: "", nameBn: "", flag: "", image: "",
        region: "", regionBn: "", capital: "", capitalBn: "",
        currency: "", timezone: "", touristsPerYear: "",
        description: "", descriptionBn: "",
        startingPrice: "", submissionType: "in-person",
        metaTitle: "", metaDescription: "",
        isActive: true, isFeatured: false, order: 0,
    });
    const [visaTypes, setVisaTypes] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [embassy, setEmbassy] = useState({
        name: "", nameBn: "", address: "", addressBn: "",
        phone: "", email: "", website: "",
        workingHours: "", workingHoursBn: "", mapUrl: "",
    });

    // Fetch for edit mode
    useEffect(() => {
        if (isEdit) {
            setLoadingEdit(true);
            fetch(`${API_BASE}/api/countries/${editId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data) {
                        const c = data.data;
                        setForm({
                            name: c.name || "", nameBn: c.nameBn || "",
                            flag: c.flag || "", image: c.image || "",
                            region: c.region || "", regionBn: c.regionBn || "",
                            capital: c.capital || "", capitalBn: c.capitalBn || "",
                            currency: c.currency || "", timezone: c.timezone || "",
                            touristsPerYear: c.touristsPerYear || "",
                            description: c.description || "", descriptionBn: c.descriptionBn || "",
                            startingPrice: c.startingPrice || "",
                            submissionType: c.submissionType || "in-person",
                            metaTitle: c.metaTitle || "", metaDescription: c.metaDescription || "",
                            isActive: c.isActive ?? true, isFeatured: c.isFeatured ?? false,
                            order: c.order || 0,
                        });
                        setVisaTypes(c.visaTypes || []);
                        setDocuments(c.documentRequirements || []);
                        setEmbassy(c.embassyInfo || {
                            name: "", nameBn: "", address: "", addressBn: "",
                            phone: "", email: "", website: "",
                            workingHours: "", workingHoursBn: "", mapUrl: "",
                        });
                    }
                })
                .catch(() => toast.error("Failed to load country"))
                .finally(() => setLoadingEdit(false));
        }
    }, [editId]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleVisaTypeChange = (idx, field, value) => {
        setVisaTypes(prev => prev.map((vt, i) =>
            i === idx ? { ...vt, [field]: value } : vt
        ));
    };

    const handleDocChange = (idx, field, value) => {
        setDocuments(prev => prev.map((doc, i) =>
            i === idx ? { ...doc, [field]: value } : doc
        ));
    };

    const handleEmbassyChange = (field, value) => {
        setEmbassy(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Country name is required");
            return;
        }

        setSaving(true);
        try {
            const body = {
                ...form,
                startingPrice: form.startingPrice ? Number(form.startingPrice) : undefined,
                order: Number(form.order) || 0,
                visaTypes: visaTypes.map(vt => ({
                    ...vt,
                    fee: vt.fee ? Number(vt.fee) : undefined,
                    governmentFee: vt.governmentFee ? Number(vt.governmentFee) : undefined,
                })),
                documentRequirements: documents,
                embassyInfo: embassy,
            };

            const url = isEdit
                ? `${API_BASE}/api/countries/${editId}`
                : `${API_BASE}/api/countries`;

            const res = await fetch(url, {
                method: isEdit ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(isEdit ? "Country updated!" : "Country created!");
                router.push("/dashboard/admin/countries");
            } else {
                toast.error(data.message || "Failed to save");
            }
        } catch (err) {
            toast.error("Error saving country");
        } finally {
            setSaving(false);
        }
    };

    const sections = [
        { id: "basic", label: "Basic Info", icon: "🌍" },
        { id: "visa", label: "Visa Types", icon: "📋" },
        { id: "documents", label: "Documents", icon: "📄" },
        { id: "embassy", label: "Embassy", icon: "🏛️" },
        { id: "seo", label: "SEO", icon: "🔍" },
    ];

    const inputClass = "w-full px-3 py-2.5 rounded-md bg-gray-50 border border-gray-200 text-[14px] text-gray-900 outline-none focus:border-[#1D7EDD] transition-colors";
    const labelClass = "block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5";

    if (loadingEdit) {
        return (
            <div className="flex items-center justify-center py-40">
                <FiLoader className="animate-spin" size={32} style={{ color: 'var(--color-primary)' }} />
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6 space-y-4 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard/admin/countries"
                    className="w-9 h-9 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                    <FiArrowLeft size={16} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: 'var(--color-secondary-dark)' }}>
                        {isEdit ? "Edit Country" : "Add Country"}
                    </h1>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2">
                {sections.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setActiveSection(s.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-semibold transition-all ${activeSection === s.id
                            ? 'bg-[#1D7EDD] text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span>{s.icon}</span>
                        {s.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {/* Basic Info Section */}
                {activeSection === "basic" && (
                    <div className="bg-white rounded-md border border-gray-100 p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Country Name (English) *</label>
                                <input value={form.name} onChange={e => handleChange("name", e.target.value)} className={inputClass} placeholder="e.g. Singapore" required />
                            </div>
                            <div>
                                <label className={labelClass}>Country Name (Bengali)</label>
                                <input value={form.nameBn} onChange={e => handleChange("nameBn", e.target.value)} className={inputClass} placeholder="e.g. সিঙ্গাপুর" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Flag Emoji</label>
                                <input value={form.flag} onChange={e => handleChange("flag", e.target.value)} className={inputClass} placeholder="🇸🇬" />
                            </div>
                            <div>
                                <label className={labelClass}>Region</label>
                                <select value={form.region} onChange={e => handleChange("region", e.target.value)} className={inputClass}>
                                    <option value="">Select Region</option>
                                    {["Asian", "European", "North American", "South American", "African", "Oceania", "Middle Eastern"].map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Region (Bengali)</label>
                                <input value={form.regionBn} onChange={e => handleChange("regionBn", e.target.value)} className={inputClass} placeholder="e.g. এশিয়ান" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Capital</label>
                                <input value={form.capital} onChange={e => handleChange("capital", e.target.value)} className={inputClass} placeholder="e.g. Singapore" />
                            </div>
                            <div>
                                <label className={labelClass}>Currency</label>
                                <input value={form.currency} onChange={e => handleChange("currency", e.target.value)} className={inputClass} placeholder="e.g. SGD" />
                            </div>
                            <div>
                                <label className={labelClass}>Timezone</label>
                                <input value={form.timezone} onChange={e => handleChange("timezone", e.target.value)} className={inputClass} placeholder="e.g. GMT+8" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Image URL</label>
                                <input value={form.image} onChange={e => handleChange("image", e.target.value)} className={inputClass} placeholder="https://..." />
                            </div>
                            <div>
                                <label className={labelClass}>Tourists Per Year</label>
                                <input value={form.touristsPerYear} onChange={e => handleChange("touristsPerYear", e.target.value)} className={inputClass} placeholder="e.g. 19.1M" />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Description (English)</label>
                            <textarea value={form.description} onChange={e => handleChange("description", e.target.value)} className={inputClass} rows={3} placeholder="About this country's visa..." />
                        </div>
                        <div>
                            <label className={labelClass}>Description (Bengali)</label>
                            <textarea value={form.descriptionBn} onChange={e => handleChange("descriptionBn", e.target.value)} className={inputClass} rows={3} placeholder="এই দেশের ভিসা সম্পর্কে..." />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Starting Price (BDT)</label>
                                <input type="number" value={form.startingPrice} onChange={e => handleChange("startingPrice", e.target.value)} className={inputClass} placeholder="e.g. 4500" />
                            </div>
                            <div>
                                <label className={labelClass}>Submission Type</label>
                                <select value={form.submissionType} onChange={e => handleChange("submissionType", e.target.value)} className={inputClass}>
                                    <option value="in-person">In-Person</option>
                                    <option value="e-visa">E-Visa</option>
                                    <option value="flexible">Flexible</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Order (sort)</label>
                                <input type="number" value={form.order} onChange={e => handleChange("order", e.target.value)} className={inputClass} placeholder="0" />
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.isActive} onChange={e => handleChange("isActive", e.target.checked)} className="w-4 h-4 accent-[#1D7EDD]" />
                                <span className="text-[13px] font-semibold text-gray-700">Active</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.isFeatured} onChange={e => handleChange("isFeatured", e.target.checked)} className="w-4 h-4 accent-[#EF8C2C]" />
                                <span className="text-[13px] font-semibold text-gray-700">Featured</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Visa Types Section */}
                {activeSection === "visa" && (
                    <div className="bg-white rounded-md border border-gray-100 p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">Visa Types ({visaTypes.length})</h2>
                            <button type="button" onClick={() => setVisaTypes(prev => [...prev, { ...emptyVisaType }])} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1D7EDD] text-white text-[12px] font-bold hover:opacity-90 transition-all">
                                <FiPlus size={13} /> Add Visa Type
                            </button>
                        </div>
                        {visaTypes.map((vt, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-md p-4 space-y-3 relative">
                                <button type="button" onClick={() => setVisaTypes(prev => prev.filter((_, i) => i !== idx))} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                                    <FiTrash2 size={15} />
                                </button>
                                <p className="text-[11px] font-bold text-gray-400 uppercase">Visa Type #{idx + 1}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Name *</label>
                                        <input value={vt.name} onChange={e => handleVisaTypeChange(idx, "name", e.target.value)} className={inputClass} placeholder="Tourist Visa" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Name (Bengali)</label>
                                        <input value={vt.nameBn || ""} onChange={e => handleVisaTypeChange(idx, "nameBn", e.target.value)} className={inputClass} placeholder="ট্যুরিস্ট ভিসা" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div>
                                        <label className={labelClass}>Processing Time</label>
                                        <input value={vt.processingTime || ""} onChange={e => handleVisaTypeChange(idx, "processingTime", e.target.value)} className={inputClass} placeholder="5-7 Days" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Duration</label>
                                        <input value={vt.duration || ""} onChange={e => handleVisaTypeChange(idx, "duration", e.target.value)} className={inputClass} placeholder="30 Days" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Service Fee (BDT)</label>
                                        <input type="number" value={vt.fee || ""} onChange={e => handleVisaTypeChange(idx, "fee", e.target.value)} className={inputClass} placeholder="4500" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Embassy Fee (BDT)</label>
                                        <input type="number" value={vt.governmentFee || ""} onChange={e => handleVisaTypeChange(idx, "governmentFee", e.target.value)} className={inputClass} placeholder="3000" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Entry Type</label>
                                        <select value={vt.entryType} onChange={e => handleVisaTypeChange(idx, "entryType", e.target.value)} className={inputClass}>
                                            <option value="single">Single</option>
                                            <option value="multiple">Multiple</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={vt.isAvailable} onChange={e => handleVisaTypeChange(idx, "isAvailable", e.target.checked)} className="w-4 h-4 accent-[#10B981]" />
                                            <span className="text-[13px] font-semibold text-gray-700">Available</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {visaTypes.length === 0 && (
                            <div className="text-center py-10 text-gray-400">
                                <FiGlobe size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-[14px]">No visa types added yet</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Documents Section */}
                {activeSection === "documents" && (
                    <div className="bg-white rounded-md border border-gray-100 p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">Document Requirements ({documents.length})</h2>
                            <button type="button" onClick={() => setDocuments(prev => [...prev, { ...emptyDocument }])} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1D7EDD] text-white text-[12px] font-bold hover:opacity-90 transition-all">
                                <FiPlus size={13} /> Add Document
                            </button>
                        </div>
                        {documents.map((doc, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-md p-4 space-y-3 relative">
                                <button type="button" onClick={() => setDocuments(prev => prev.filter((_, i) => i !== idx))} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                                    <FiTrash2 size={15} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Title *</label>
                                        <input value={doc.title} onChange={e => handleDocChange(idx, "title", e.target.value)} className={inputClass} placeholder="Valid Passport" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Title (Bengali)</label>
                                        <input value={doc.titleBn || ""} onChange={e => handleDocChange(idx, "titleBn", e.target.value)} className={inputClass} placeholder="বৈধ পাসপোর্ট" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Description</label>
                                    <input value={doc.description || ""} onChange={e => handleDocChange(idx, "description", e.target.value)} className={inputClass} placeholder="Minimum 6 months validity from travel date" />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={doc.isRequired} onChange={e => handleDocChange(idx, "isRequired", e.target.checked)} className="w-4 h-4 accent-red-500" />
                                    <span className="text-[13px] font-semibold text-gray-700">Required</span>
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {/* Embassy Section */}
                {activeSection === "embassy" && (
                    <div className="bg-white rounded-md border border-gray-100 p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Embassy / Consulate Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Embassy Name</label>
                                <input value={embassy.name || ""} onChange={e => handleEmbassyChange("name", e.target.value)} className={inputClass} placeholder="Embassy of Singapore" />
                            </div>
                            <div>
                                <label className={labelClass}>Name (Bengali)</label>
                                <input value={embassy.nameBn || ""} onChange={e => handleEmbassyChange("nameBn", e.target.value)} className={inputClass} placeholder="সিঙ্গাপুর দূতাবাস" />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Address</label>
                            <textarea value={embassy.address || ""} onChange={e => handleEmbassyChange("address", e.target.value)} className={inputClass} rows={2} placeholder="House 1, Road 1, Gulshan-1, Dhaka" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Phone</label>
                                <input value={embassy.phone || ""} onChange={e => handleEmbassyChange("phone", e.target.value)} className={inputClass} placeholder="+880-2-..." />
                            </div>
                            <div>
                                <label className={labelClass}>Email</label>
                                <input value={embassy.email || ""} onChange={e => handleEmbassyChange("email", e.target.value)} className={inputClass} placeholder="embassy@example.com" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Website</label>
                                <input value={embassy.website || ""} onChange={e => handleEmbassyChange("website", e.target.value)} className={inputClass} placeholder="https://..." />
                            </div>
                            <div>
                                <label className={labelClass}>Working Hours</label>
                                <input value={embassy.workingHours || ""} onChange={e => handleEmbassyChange("workingHours", e.target.value)} className={inputClass} placeholder="Sun-Thu, 9AM-4PM" />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Google Maps URL</label>
                            <input value={embassy.mapUrl || ""} onChange={e => handleEmbassyChange("mapUrl", e.target.value)} className={inputClass} placeholder="https://maps.google.com/..." />
                        </div>
                    </div>
                )}

                {/* SEO Section */}
                {activeSection === "seo" && (
                    <div className="bg-white rounded-md border border-gray-100 p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">SEO Settings</h2>
                        <div>
                            <label className={labelClass}>Meta Title</label>
                            <input value={form.metaTitle} onChange={e => handleChange("metaTitle", e.target.value)} className={inputClass} placeholder="Singapore Visa from Bangladesh | VisaPro" />
                        </div>
                        <div>
                            <label className={labelClass}>Meta Description</label>
                            <textarea value={form.metaDescription} onChange={e => handleChange("metaDescription", e.target.value)} className={inputClass} rows={3} placeholder="Apply for Singapore visa from Bangladesh. Fast processing, 98% success rate..." />
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center gap-3 mt-6">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 rounded-md text-[13px] font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        {saving ? <FiLoader size={14} className="animate-spin" /> : <FiSave size={14} />}
                        {isEdit ? "Update Country" : "Create Country"}
                    </button>
                    <Link
                        href="/dashboard/admin/countries"
                        className="px-6 py-3 rounded-md text-[13px] font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
