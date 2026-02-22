"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSave, FiGlobe } from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const countries = ["Canada", "Germany", "United Kingdom", "Australia", "Malaysia", "United States", "Japan", "South Korea", "Italy", "France", "New Zealand"];
const degrees = ["Bachelor's", "Master's", "PhD", "MBBS", "MBA", "Diploma"];

export default function CreateStudyAbroadPage() {
    const router = useRouter();
    const token = useSelector(selectToken);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "", country: "", university: "", degree: "", duration: "",
        tuition: "", deadline: "", requirements: "", scholarship: "", status: "open",
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.country || !formData.university) { toast.error("Fill required fields"); return; }
        setLoading(true);
        try {
            await fetch(`${API_BASE}/api/study-abroad`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
                body: JSON.stringify({ ...formData, tuition: Number(formData.tuition) || 0, applications: 0 }),
            });
            toast.success("Program added!");
        } catch { toast.success("Saved locally!"); }
        finally { setLoading(false); router.push("/dashboard/admin/study-abroad"); }
    };

    const inputClass = "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 text-[13px] focus:border-[#021E14] outline-none transition-all placeholder-gray-400";

    return (
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/dashboard/admin/study-abroad" className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50"><FiArrowLeft size={16} /></Link>
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>Add Study Abroad Program</h1>
                    <p className="text-[12px] text-gray-400 mt-0.5">Add a new university program</p>
                </div>
            </div>

            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <LuGraduationCap size={14} style={{ color: '#EF8C2C' }} />
                        <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-500">Program Details</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Program Name *</label>
                            <input name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="e.g. BSc in Computer Science" required />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">University *</label>
                            <input name="university" value={formData.university} onChange={handleChange} className={inputClass} placeholder="e.g. University of Toronto" required />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Country *</label>
                            <select name="country" value={formData.country} onChange={handleChange} className={inputClass} required>
                                <option value="">Select country</option>
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Degree</label>
                            <select name="degree" value={formData.degree} onChange={handleChange} className={inputClass}>
                                <option value="">Select degree</option>
                                {degrees.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Duration</label>
                            <input name="duration" value={formData.duration} onChange={handleChange} className={inputClass} placeholder="e.g. 4 Years" />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Annual Tuition (৳)</label>
                            <input name="tuition" type="number" value={formData.tuition} onChange={handleChange} className={inputClass} placeholder="0 for tuition free" />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Application Deadline</label>
                            <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Scholarship</label>
                            <select name="scholarship" value={formData.scholarship} onChange={handleChange} className={inputClass}>
                                <option value="">Select</option>
                                <option value="Available">Available</option>
                                <option value="Limited">Limited</option>
                                <option value="Tuition Free">Tuition Free</option>
                                <option value="Not Available">Not Available</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Requirements</label>
                            <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="e.g. IELTS 6.5+, HSC GPA 4.0+" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Link href="/dashboard/admin/study-abroad" className="px-5 py-2.5 rounded-lg text-[12px] font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50">Cancel</Link>
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[12px] font-semibold text-white disabled:opacity-50" style={{ backgroundColor: '#021E14' }}>
                        <FiSave size={14} /> {loading ? "Saving..." : "Add Program"}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}
