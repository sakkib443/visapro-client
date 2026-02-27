"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiLoader, FiDownload, FiFileText, FiCalendar,
} from "react-icons/fi";
import { LuFileText, LuGlobe, LuCalendar, LuBadgeCheck, LuShield } from "react-icons/lu";
import { useSelector } from "react-redux";
import { selectToken, selectCurrentUser } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATUS_CONFIG = {
    pending:    { label: "Pending",    color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    processing: { label: "Processing", color: "bg-blue-100 text-blue-700 border-blue-200" },
    delivered:  { label: "Delivered",  color: "bg-green-100 text-green-700 border-green-200" },
};

// ─── Plain PDF Template ───────────────────────────────────────────
function PlainTemplate({ doc }) {
    const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "—";
    return (
        <div id="pdf-plain" style={{
            width: "794px", minHeight: "1123px", background: "#fff", padding: "60px",
            fontFamily: "Arial, sans-serif", color: "#1a1a1a", boxSizing: "border-box",
        }}>
            {/* Header */}
            <div style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: "24px", marginBottom: "32px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "2px", color: "#111827", margin: 0 }}>
                    VISA DOCUMENT
                </h1>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "6px 0 0" }}>
                    Issued by VisaPro — Ref: {doc._id?.slice(-8).toUpperCase()}
                </p>
            </div>

            {/* Fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 40px", marginBottom: "32px" }}>
                {[
                    ["Applicant Name", doc.applicantName],
                    ["Applicant Name (BN)", doc.applicantNameBn],
                    ["Passport Number", doc.passportNo],
                    ["Phone", doc.phone],
                    ["Visa Type", doc.visaType],
                    ["Country", doc.country],
                    ["Visa Number", doc.visaNo],
                    ["Entry Type", doc.entryType ? doc.entryType.charAt(0).toUpperCase() + doc.entryType.slice(1) + " Entry" : "—"],
                    ["Issue Date", fmt(doc.issueDate)],
                    ["Expiry Date", fmt(doc.expiryDate)],
                ].map(([label, value]) => value ? (
                    <div key={label} style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "12px" }}>
                        <p style={{ fontSize: "10px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>
                            {label}
                        </p>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>{value}</p>
                    </div>
                ) : null)}
            </div>

            {doc.notes && (
                <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "16px", marginBottom: "32px" }}>
                    <p style={{ fontSize: "10px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>Notes</p>
                    <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>{doc.notes}</p>
                </div>
            )}

            {/* Images */}
            {doc.images?.length > 0 && (
                <div>
                    <p style={{ fontSize: "10px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px" }}>
                        Visa Documents ({doc.images.length})
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                        {doc.images.map((img, i) => (
                            <img key={i} src={img} alt={`visa-${i + 1}`}
                                style={{ width: "100%", borderRadius: "6px", border: "1px solid #e5e7eb", objectFit: "cover", maxHeight: "260px" }}
                                crossOrigin="anonymous"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div style={{ marginTop: "48px", borderTop: "1px solid #e5e7eb", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>
                    Generated: {new Date().toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
                <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>VisaPro • visapro.com.bd</p>
            </div>
        </div>
    );
}

// ─── Branded PDF Template ─────────────────────────────────────────
function BrandedTemplate({ doc }) {
    const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "—";
    return (
        <div id="pdf-branded" style={{
            width: "794px", minHeight: "1123px", background: "#fff",
            fontFamily: "Arial, sans-serif", color: "#1a1a1a", boxSizing: "border-box",
        }}>
            {/* Green Header */}
            <div style={{
                background: "#021E14", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "900", color: "#EF8C2C", letterSpacing: "2px", margin: 0 }}>VISAPRO</h1>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", margin: "4px 0 0", letterSpacing: "1px" }}>
                        YOUR TRUSTED VISA PARTNER
                    </p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: 0 }}>+880 17 1211 4770</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: "2px 0 0" }}>visapro.com.bd</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: "2px 0 0" }}>info@visapro.com.bd</p>
                </div>
            </div>

            {/* Orange Title Bar */}
            <div style={{ background: "#EF8C2C", padding: "10px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "13px", fontWeight: "800", color: "#fff", letterSpacing: "2px", margin: 0 }}>
                    OFFICIAL VISA DOCUMENT
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)", margin: 0 }}>
                    Ref: {doc._id?.slice(-8).toUpperCase()}
                </p>
            </div>

            {/* Main Content */}
            <div style={{ padding: "40px 48px" }}>
                {/* Fields Table */}
                <div style={{ background: "#f8fafc", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0", marginBottom: "28px" }}>
                    {[
                        ["Applicant Name", doc.applicantName],
                        ["Applicant Name (BN)", doc.applicantNameBn],
                        ["Passport Number", doc.passportNo],
                        ["Phone", doc.phone],
                        ["Visa Type", doc.visaType],
                        ["Country", doc.country],
                        ["Visa Number", doc.visaNo],
                        ["Entry Type", doc.entryType ? doc.entryType.charAt(0).toUpperCase() + doc.entryType.slice(1) + " Entry" : null],
                        ["Issue Date", fmt(doc.issueDate)],
                        ["Expiry Date", fmt(doc.expiryDate)],
                    ].filter(([, v]) => v).map(([label, value], i) => (
                        <div key={label} style={{
                            display: "flex", alignItems: "center",
                            background: i % 2 === 0 ? "#fff" : "#f8fafc",
                            borderBottom: "1px solid #e2e8f0",
                        }}>
                            <div style={{
                                width: "180px", flexShrink: 0, padding: "12px 20px",
                                background: i % 2 === 0 ? "#f1f5f9" : "#e8f0fb",
                                borderRight: "1px solid #e2e8f0",
                            }}>
                                <p style={{ fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                                    {label}
                                </p>
                            </div>
                            <div style={{ padding: "12px 20px", flex: 1 }}>
                                <p style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", margin: 0 }}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {doc.notes && (
                    <div style={{
                        background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px",
                        padding: "16px 20px", marginBottom: "28px",
                    }}>
                        <p style={{ fontSize: "11px", fontWeight: "700", color: "#b45309", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>Notes</p>
                        <p style={{ fontSize: "13px", color: "#78350f", margin: 0 }}>{doc.notes}</p>
                    </div>
                )}

                {/* Images */}
                {doc.images?.length > 0 && (
                    <div>
                        <p style={{ fontSize: "12px", fontWeight: "700", color: "#021E14", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 14px", paddingBottom: "8px", borderBottom: "2px solid #EF8C2C", display: "inline-block" }}>
                            Visa Documents
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" }}>
                            {doc.images.map((img, i) => (
                                <div key={i} style={{ border: "2px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                                    <img src={img} alt={`visa-${i + 1}`}
                                        style={{ width: "100%", objectFit: "cover", maxHeight: "240px", display: "block" }}
                                        crossOrigin="anonymous"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{
                background: "#021E14", padding: "16px 48px",
                display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto",
            }}>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: 0 }}>
                    Generated: {new Date().toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
                <p style={{ fontSize: "11px", color: "#EF8C2C", margin: 0, fontWeight: "700" }}>
                    VisaPro — Your Trusted Visa Partner
                </p>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────
export default function MyVisaDocuments() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
    const [downloadType, setDownloadType] = useState(null);
    const [previewDoc, setPreviewDoc] = useState(null);
    const [previewType, setPreviewType] = useState(null);

    const token = useSelector(selectToken);
    const user = useSelector(selectCurrentUser);

    const fetchDocs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/visa-documents/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setDocs(data.data || []);
            }
        } catch {
            toast.error("Could not load documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDocs(); }, []);

    const downloadPDF = async (doc, type) => {
        setDownloadingId(doc._id);
        setDownloadType(type);

        // Set preview for rendering
        setPreviewDoc(doc);
        setPreviewType(type);

        // Wait for DOM render
        await new Promise(r => setTimeout(r, 400));

        try {
            const { default: jsPDF } = await import("jspdf");
            const { default: html2canvas } = await import("html2canvas");

            const elementId = type === "plain" ? "pdf-plain" : "pdf-branded";
            const element = document.getElementById(elementId);

            if (!element) {
                toast.error("PDF template not found");
                return;
            }

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                backgroundColor: "#ffffff",
                logging: false,
            });

            const imgData = canvas.toDataURL("image/jpeg", 0.92);
            const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

            const filename = `visapro-${doc.applicantName?.replace(/\s+/g, "-")}-${doc.country || "visa"}-${type}.pdf`;
            pdf.save(filename);

            toast.success(`${type === "plain" ? "Plain" : "Branded"} PDF downloaded!`);
        } catch (err) {
            console.error(err);
            toast.error("PDF generation failed");
        } finally {
            setDownloadingId(null);
            setDownloadType(null);
            setPreviewDoc(null);
            setPreviewType(null);
        }
    };

    const fmt = (d) => d ? new Date(d).toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    return (
        <div className="p-4 lg:p-6 space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <LuFileText className="text-[#1D7EDD]" />
                    My Visa Documents
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    {user?.firstName && `Welcome, ${user.firstName}! `}
                    আপনার ভিসা ডকুমেন্ট এখান থেকে ডাউনলোড করুন।
                </p>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <FiLoader size={28} className="animate-spin text-[#1D7EDD]" />
                </div>
            ) : docs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <LuFileText size={48} className="mx-auto mb-4 text-gray-200" />
                    <h3 className="text-lg font-bold text-gray-400 mb-2">No Documents Yet</h3>
                    <p className="text-sm text-gray-400">
                        আপনার ভিসা প্রসেস হলে এখানে ডকুমেন্ট দেখা যাবে।
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {docs.map((doc) => (
                        <motion.div
                            key={doc._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="p-4 lg:p-5 border-b border-gray-50">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#1D7EDD]/10 flex items-center justify-center flex-shrink-0">
                                            <LuGlobe className="text-[#1D7EDD]" size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-800">
                                                {doc.country || "Visa Document"}
                                                {doc.visaType && <span className="text-gray-400 font-normal text-sm ml-2">— {doc.visaType}</span>}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-0.5">{doc.applicantName}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border self-start ${STATUS_CONFIG[doc.status]?.color}`}>
                                        {STATUS_CONFIG[doc.status]?.label}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 lg:p-5">
                                {/* Info Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                    {[
                                        { label: "Passport No", value: doc.passportNo },
                                        { label: "Visa No", value: doc.visaNo },
                                        { label: "Issue Date", value: fmt(doc.issueDate) },
                                        { label: "Expiry Date", value: fmt(doc.expiryDate) },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="bg-gray-50 rounded-lg p-2.5">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                                            <p className="text-[12px] font-semibold text-gray-700">{value || "—"}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Images Preview */}
                                {doc.images?.length > 0 && (
                                    <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                                        {doc.images.map((img, i) => (
                                            <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                                                <img src={img} alt={`visa-${i}`} className="h-16 w-24 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity" />
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {/* Download Buttons */}
                                {doc.status === "delivered" ? (
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button
                                            onClick={() => downloadPDF(doc, "plain")}
                                            disabled={downloadingId === doc._id}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-60 transition-all"
                                        >
                                            {downloadingId === doc._id && downloadType === "plain" ? (
                                                <FiLoader size={14} className="animate-spin" />
                                            ) : (
                                                <FiDownload size={14} />
                                            )}
                                            Plain Download (সাদা)
                                        </button>
                                        <button
                                            onClick={() => downloadPDF(doc, "branded")}
                                            disabled={downloadingId === doc._id}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#021E14] rounded-xl text-sm font-semibold text-white hover:bg-[#032d1e] disabled:opacity-60 transition-all"
                                        >
                                            {downloadingId === doc._id && downloadType === "branded" ? (
                                                <FiLoader size={14} className="animate-spin" />
                                            ) : (
                                                <FiDownload size={14} />
                                            )}
                                            VisaPro Branded
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-yellow-50 rounded-xl px-4 py-2.5 border border-yellow-100">
                                        <LuShield size={14} className="text-yellow-500 flex-shrink-0" />
                                        <p className="text-xs text-yellow-700 font-medium">
                                            ডকুমেন্ট এখনো প্রস্তুত হয়নি। Status: <strong>{STATUS_CONFIG[doc.status]?.label}</strong> — Admin যখন "Delivered" করবে তখন download করা যাবে।
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Hidden PDF Templates — rendered off-screen for html2canvas */}
            {previewDoc && previewType === "plain" && (
                <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1 }}>
                    <PlainTemplate doc={previewDoc} />
                </div>
            )}
            {previewDoc && previewType === "branded" && (
                <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1 }}>
                    <BrandedTemplate doc={previewDoc} />
                </div>
            )}
        </div>
    );
}
