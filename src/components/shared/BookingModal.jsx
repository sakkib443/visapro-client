"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX, LuSend, LuLoader } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function BookingModal({ isOpen, onClose, type, serviceName, serviceId = "", extraFields = [] }) {
    const router = useRouter();
    const token = useSelector(selectToken);
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", ...Object.fromEntries(extraFields.map(f => [f.key, ""])) });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const typeLabels = { visa: "Visa Application", hotel: "Hotel Booking", tour: "Tour Booking", hajj: "Hajj/Umrah Booking", study: "Study Abroad" };

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Check auth token from Redux store
        if (!token) {
            setLoading(false);
            onClose();
            router.push("/login");
            return;
        }

        try {
            const { name, email, phone, message, ...rest } = form;
            const body = {
                type,
                serviceName,
                serviceId,
                name, email, phone,
                details: { ...rest, message },
            };

            const res = await fetch(`${BACKEND}/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");

            setSuccess(true);
            setTimeout(() => { setSuccess(false); onClose(); }, 2500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{typeLabels[type]}</h2>
                                <p className="text-sm text-gray-500 mt-0.5">{serviceName}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <LuX size={20} />
                            </button>
                        </div>

                        {/* Success */}
                        {success ? (
                            <div className="p-8 text-center">
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-xl font-bold text-green-600 mb-2">Booking Submitted!</h3>
                                <p className="text-gray-500 text-sm">We will contact you shortly to confirm.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                {/* Common fields */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input name="name" value={form.name} onChange={handleChange} required
                                        placeholder="Your full name"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} required
                                        placeholder="+880 1XXXXXXXXX"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange} required
                                        placeholder="your@email.com"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                {/* Extra type-specific fields */}
                                {extraFields.map(f => (
                                    <div key={f.key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}{f.required && " *"}</label>
                                        {f.type === "select" ? (
                                            <select name={f.key} value={form[f.key]} onChange={handleChange} required={f.required}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="">Select...</option>
                                                {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        ) : (
                                            <input name={f.key} type={f.type || "text"} value={form[f.key]} onChange={handleChange}
                                                placeholder={f.placeholder || ""} required={f.required}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        )}
                                    </div>
                                ))}

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                                    <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                                        placeholder="Any specific requirements or questions..."
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                                </div>

                                {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

                                <button type="submit" disabled={loading}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2">
                                    {loading ? <><LuLoader size={16} className="animate-spin" /> Submitting...</> : <><LuSend size={16} /> Submit Booking</>}
                                </button>

                                <p className="text-xs text-gray-400 text-center">
                                    You must be logged in to book. We'll contact you to confirm.
                                </p>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
