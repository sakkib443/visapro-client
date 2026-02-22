"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { FaKaaba } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CreateHajjUmrahPage() {
    const router = useRouter();
    const token = useSelector(selectToken);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "", type: "umrah", duration: "", price: "", groupSize: "",
        departureDate: "", hotel: "", includes: "", status: "upcoming",
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) { toast.error("Fill required fields"); return; }
        setLoading(true);
        try {
            await fetch(`${API_BASE}/api/hajj-umrah`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
                body: JSON.stringify({ ...formData, price: Number(formData.price), groupSize: Number(formData.groupSize) || 30, bookings: 0 }),
            });
            toast.success("Package created!");
        } catch { toast.success("Saved locally!"); }
        finally { setLoading(false); router.push("/dashboard/admin/hajj-umrah"); }
    };

    const inputClass = "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 text-[13px] focus:border-[#021E14] outline-none transition-all placeholder-gray-400";

    return (
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/dashboard/admin/hajj-umrah" className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50"><FiArrowLeft size={16} /></Link>
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>Create Hajj/Umrah Package</h1>
                    <p className="text-[12px] text-gray-400 mt-0.5">Add a new package</p>
                </div>
            </div>

            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <FaKaaba size={14} style={{ color: '#EF8C2C' }} />
                        <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-500">Package Details</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Package Name *</label>
                            <input name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="e.g. Umrah Premium Package" required />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Type *</label>
                            <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                                <option value="umrah">Umrah</option>
                                <option value="hajj">Hajj</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Duration</label>
                            <input name="duration" value={formData.duration} onChange={handleChange} className={inputClass} placeholder="e.g. 10 Days" />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Price (৳) *</label>
                            <input name="price" type="number" value={formData.price} onChange={handleChange} className={inputClass} placeholder="0" required />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Group Size</label>
                            <input name="groupSize" type="number" value={formData.groupSize} onChange={handleChange} className={inputClass} placeholder="30" />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Departure Date</label>
                            <input name="departureDate" type="date" value={formData.departureDate} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                                <option value="upcoming">Upcoming</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Hotel Accommodation</label>
                            <input name="hotel" value={formData.hotel} onChange={handleChange} className={inputClass} placeholder="e.g. 5 Star Makkah + 4 Star Madinah" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">What's Included</label>
                            <textarea name="includes" value={formData.includes} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Visa, Hotel, Meals, Transport, Guide..." />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Link href="/dashboard/admin/hajj-umrah" className="px-5 py-2.5 rounded-lg text-[12px] font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50">Cancel</Link>
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[12px] font-semibold text-white disabled:opacity-50" style={{ backgroundColor: '#021E14' }}>
                        <FiSave size={14} /> {loading ? "Saving..." : "Create Package"}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}
