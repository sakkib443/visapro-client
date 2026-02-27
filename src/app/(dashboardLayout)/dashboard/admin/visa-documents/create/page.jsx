"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FiArrowLeft, FiLoader, FiUpload, FiX, FiUser, FiSave,
} from "react-icons/fi";
import { LuFileText, LuGlobe, LuCalendar } from "react-icons/lu";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const VISA_TYPES = ["Tourist", "Student", "Business", "Work", "Medical", "Visit", "Transit", "Spouse/Family"];

export default function CreateVisaDocument() {
    const router = useRouter();
    const token = useSelector(selectToken);
    const fileInputRef = useRef(null);

    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);

    const [form, setForm] = useState({
        user: "",
        applicantName: "",
        applicantNameBn: "",
        phone: "",
        passportNo: "",
        visaType: "",
        country: "",
        visaNo: "",
        issueDate: "",
        expiryDate: "",
        entryType: "single",
        notes: "",
        status: "pending",
    });

    // Fetch users for dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/users/admin/all?limit=200`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success && data.data) {
                    setUsers(Array.isArray(data.data) ? data.data : data.data.users || []);
                }
            } catch {
                toast.error("Could not load users");
            } finally {
                setUsersLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Upload images to Cloudinary
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const remaining = 5 - uploadedImages.length;
        if (remaining <= 0) {
            toast.error("Maximum 5 images allowed");
            return;
        }

        setUploading(true);
        try {
            const toUpload = files.slice(0, remaining);
            const formData = new FormData();
            toUpload.forEach(f => formData.append("images", f));

            const res = await fetch(`${API_BASE}/api/upload/multiple`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (data.success && data.data) {
                const urls = Array.isArray(data.data) ? data.data.map(d => d.url || d) : [data.data.url || data.data];
                setUploadedImages(prev => [...prev, ...urls]);
                toast.success(`${urls.length} image(s) uploaded`);
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (idx) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.user) { toast.error("Please select a user"); return; }
        if (!form.applicantName.trim()) { toast.error("Applicant name is required"); return; }

        setSubmitting(true);
        try {
            const payload = { ...form, images: uploadedImages };
            const res = await fetch(`${API_BASE}/api/visa-documents`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Visa document created successfully!");
                router.push("/dashboard/admin/visa-documents");
            } else {
                toast.error(data.message || "Failed to create");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/dashboard/admin/visa-documents" className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                    <FiArrowLeft size={18} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <LuFileText className="text-[#1D7EDD]" />
                        Create Visa Document
                    </h1>
                    <p className="text-sm text-gray-500">ইউজারের জন্য ভিসা ডকুমেন্ট তৈরি করুন</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">

                {/* User Selection */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FiUser className="text-[#1D7EDD]" />
                        Select User
                    </h2>
                    {usersLoading ? (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <FiLoader size={14} className="animate-spin" />
                            Loading users...
                        </div>
                    ) : (
                        <select
                            name="user"
                            value={form.user}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD] bg-white"
                            required
                        >
                            <option value="">-- Select a registered user --</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>
                                    {u.firstName} {u.lastName} — {u.email} {u.phone ? `(${u.phone})` : ""}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Applicant Info */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                        Applicant Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                                Full Name (English) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="applicantName" value={form.applicantName}
                                onChange={handleChange}
                                placeholder="e.g. Mohammad Sakib"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD]"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                                Full Name (Bengali)
                            </label>
                            <input
                                type="text" name="applicantNameBn" value={form.applicantNameBn}
                                onChange={handleChange}
                                placeholder="যেমন: মোহাম্মদ সাকিব"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Phone Number</label>
                            <input
                                type="text" name="phone" value={form.phone}
                                onChange={handleChange}
                                placeholder="e.g. 01712114770"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Passport Number</label>
                            <input
                                type="text" name="passportNo" value={form.passportNo}
                                onChange={handleChange}
                                placeholder="e.g. AB1234567"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD]"
                            />
                        </div>
                    </div>
                </div>

                {/* Visa Details */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <LuGlobe className="text-[#1D7EDD]" />
                        Visa Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Visa Type</label>
                            <select
                                name="visaType" value={form.visaType}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD] bg-white"
                            >
                                <option value="">-- Select visa type --</option>
                                {VISA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Country</label>
                            <input
                                type="text" name="country" value={form.country}
                                onChange={handleChange}
                                placeholder="e.g. Japan, Canada, UK"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Visa Number</label>
                            <input
                                type="text" name="visaNo" value={form.visaNo}
                                onChange={handleChange}
                                placeholder="e.g. V987654321"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Entry Type</label>
                            <select
                                name="entryType" value={form.entryType}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD] bg-white"
                            >
                                <option value="single">Single Entry</option>
                                <option value="multiple">Multiple Entry</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                                <span className="flex items-center gap-1"><LuCalendar size={12} /> Issue Date</span>
                            </label>
                            <input
                                type="date" name="issueDate" value={form.issueDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD]"
                                style={{ colorScheme: 'light' }}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                                <span className="flex items-center gap-1"><LuCalendar size={12} /> Expiry Date</span>
                            </label>
                            <input
                                type="date" name="expiryDate" value={form.expiryDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD]"
                                style={{ colorScheme: 'light' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FiUpload className="text-[#1D7EDD]" />
                        Upload Visa Images ({uploadedImages.length}/5)
                    </h2>

                    <div
                        className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#1D7EDD]/50 hover:bg-blue-50/20 transition-all"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <FiLoader size={24} className="animate-spin text-[#1D7EDD]" />
                                <p className="text-sm text-gray-500">Uploading...</p>
                            </div>
                        ) : (
                            <>
                                <FiUpload size={24} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-sm font-semibold text-gray-500">Click to upload visa scans</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP • Max 5MB each • Up to 5 images</p>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                    {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                            {uploadedImages.map((url, i) => (
                                <div key={i} className="relative group">
                                    <img src={url} alt={`img-${i}`} className="w-full h-20 object-cover rounded-lg border border-gray-200" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FiX size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notes & Status */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Additional Info</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Notes</label>
                            <textarea
                                name="notes" value={form.notes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Additional information..."
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD] resize-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Status</label>
                            <select
                                name="status" value={form.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1D7EDD] bg-white"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/admin/visa-documents"
                        className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 px-8 py-2.5 bg-[#1D7EDD] text-white rounded-lg text-sm font-semibold hover:bg-[#1565c0] disabled:opacity-60 transition-all"
                    >
                        {submitting ? <FiLoader size={14} className="animate-spin" /> : <FiSave size={14} />}
                        {submitting ? "Creating..." : "Create Document"}
                    </button>
                </div>
            </form>
        </div>
    );
}
