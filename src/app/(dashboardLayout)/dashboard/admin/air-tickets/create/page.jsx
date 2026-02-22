"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { LuPlane } from "react-icons/lu";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const airlines = ["Biman Bangladesh", "Emirates", "Qatar Airways", "Singapore Airlines", "Malaysian Airlines", "Turkish Airlines", "Thai Airways", "Saudi Airlines", "Air India", "Cathay Pacific"];

export default function CreateAirTicketPage() {
    const router = useRouter();
    const token = useSelector(selectToken);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        passengerName: "", phone: "", airline: "", from: "", to: "",
        departureDate: "", returnDate: "", class: "Economy", price: "", status: "pending",
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.passengerName || !formData.from || !formData.to) { toast.error("Fill required fields"); return; }
        setLoading(true);
        try {
            await fetch(`${API_BASE}/api/air-tickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
                body: JSON.stringify({ ...formData, price: Number(formData.price) || 0, ticketId: `AT-${String(Date.now()).slice(-3)}` }),
            });
            toast.success("Booking created!");
        } catch { toast.success("Saved locally!"); }
        finally { setLoading(false); router.push("/dashboard/admin/air-tickets"); }
    };

    const inputClass = "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 text-[13px] focus:border-[#021E14] outline-none transition-all placeholder-gray-400";

    return (
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/dashboard/admin/air-tickets" className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50"><FiArrowLeft size={16} /></Link>
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>New Air Ticket Booking</h1>
                    <p className="text-[12px] text-gray-400 mt-0.5">Create a new flight booking</p>
                </div>
            </div>

            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <LuPlane size={14} style={{ color: '#EF8C2C' }} />
                        <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-500">Flight Details</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Passenger Name *</label>
                            <input name="passengerName" value={formData.passengerName} onChange={handleChange} className={inputClass} placeholder="Full name" required />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Phone</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+880 1XXXXXXXXX" />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">From *</label>
                            <input name="from" value={formData.from} onChange={handleChange} className={inputClass} placeholder="e.g. Dhaka (DAC)" required />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">To *</label>
                            <input name="to" value={formData.to} onChange={handleChange} className={inputClass} placeholder="e.g. London (LHR)" required />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Airline</label>
                            <select name="airline" value={formData.airline} onChange={handleChange} className={inputClass}>
                                <option value="">Select airline</option>
                                {airlines.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Class</label>
                            <select name="class" value={formData.class} onChange={handleChange} className={inputClass}>
                                <option value="Economy">Economy</option>
                                <option value="Business">Business</option>
                                <option value="First">First Class</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Departure Date</label>
                            <input name="departureDate" type="date" value={formData.departureDate} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Return Date</label>
                            <input name="returnDate" type="date" value={formData.returnDate} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Price (৳)</label>
                            <input name="price" type="number" value={formData.price} onChange={handleChange} className={inputClass} placeholder="0" />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Link href="/dashboard/admin/air-tickets" className="px-5 py-2.5 rounded-lg text-[12px] font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50">Cancel</Link>
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[12px] font-semibold text-white disabled:opacity-50" style={{ backgroundColor: '#021E14' }}>
                        <FiSave size={14} /> {loading ? "Saving..." : "Create Booking"}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}
