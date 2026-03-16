"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    FiUpload, FiLoader, FiX, FiDownload, FiRefreshCw, FiSave,
    FiCheck, FiEdit3, FiEye, FiPlus, FiPrinter, FiList, FiMaximize2, FiMinimize2,
} from "react-icons/fi";
import { LuPlane, LuUser, LuScanLine, LuFileText, LuBanknote } from "react-icons/lu";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* Templates */
const mkP = () => ({ name: "", type: "ADT", gender: "MALE", passportNo: "", cabin: "7 KG", checked: "1PC (23KG)", eTicket: "" });
const mkF = () => ({ airline: "", flightNo: "", from: "", fromAirport: "", to: "", toAirport: "", departDay: "", departDate: "", departTime: "", arriveDay: "", arriveDate: "", arriveTime: "", classInfo: "Economy (T)", refund: "Non-Refundable", route: "One-way", duration: "", personalItem: "Laptop Bag", selfTransfer: "No", terminalChange: "No", codeshare: "No", ssrRemarks: "No", transitInfo: "" });
const mkFare = () => ({ type: "ADT", baseFare: "", tax: "", ait: "", grossFare: "", pax: "1", total: "" });

const INIT = {
    bookingRef: "", airlinePnr: "", dateOfIssue: "", status: "Confirmed",
    passengers: [mkP()], flights: [mkF()], fares: [mkFare()], grandTotal: "",
    agencyWebsite: "www.visaprocm.com", agencyPhone: "+880 1712-114770",
    agencyEmail: "info@visaprocm.com", agencyOffice: "Dhaka, Bangladesh",
};

/* Input Field - empty fields get yellow highlight */
const F = ({ label, value, onChange, placeholder, className = "", select, options = [] }) => {
    const isEmpty = !value || value.toString().trim() === "";
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className={`text-[10px] font-bold uppercase tracking-wider ${isEmpty ? "text-amber-500" : "text-gray-400"}`}>{label} {isEmpty && <span className="text-red-400">*</span>}</label>
            {select ? (
                <select value={value} onChange={onChange}
                    className={`px-2.5 py-1.5 border rounded-lg text-[12px] outline-none bg-white text-gray-700 ${isEmpty ? "border-amber-300 bg-amber-50/50" : "border-gray-200 focus:border-blue-400"}`}>
                    {options.map(o => <option key={o}>{o}</option>)}
                </select>
            ) : (
                <input type="text" value={value} onChange={onChange} placeholder={placeholder}
                    className={`px-2.5 py-1.5 border rounded-lg text-[12px] outline-none transition-all ${isEmpty ? "border-amber-300 bg-amber-50/50 placeholder:text-amber-300" : "border-gray-200 focus:border-blue-400 bg-white"}`} />
            )}
        </div>
    );
};


/* Barcode */
function Barcode({ value }) {
    const chars = (value || "AMB0000000").split("");
    const bars = [];
    for (let i = 0; i < 60; i++) {
        const seed = (chars[i % chars.length]?.charCodeAt(0) || 65) + i;
        bars.push(seed % 4 === 0 ? 3 : seed % 3 === 0 ? 2 : 1);
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 1, height: 36 }}>
                {bars.map((w, i) => (
                    <div key={i} style={{ width: w, height: i % 7 === 0 ? 36 : i % 5 === 0 ? 28 : 22, background: "#1f2937", flexShrink: 0 }} />
                ))}
            </div>
            <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: 1, color: "#374151", fontWeight: 600 }}>
                {value || "AMB0000000"}
            </span>
        </div>
    );
}

/* Ticket Preview */
function TicketPreview({ form }) {
    const S = {
        thBlue: { background: "#1a4a8a", color: "#fff", fontSize: 9, fontWeight: 700, padding: "6px 8px", textAlign: "left", borderRight: "1px solid #2563eb", whiteSpace: "nowrap" },
        td: { fontSize: 10, padding: "5px 8px", borderBottom: "1px solid #e5e7eb", borderRight: "1px solid #f3f4f6", verticalAlign: "middle" },
        tdAlt: { fontSize: 10, padding: "5px 8px", borderBottom: "1px solid #e5e7eb", borderRight: "1px solid #f3f4f6", background: "#f8fafc", verticalAlign: "middle" },
    };
    return (
        <div id="ticket-print" style={{ fontFamily: "Arial, sans-serif", background: "#fff", width: "100%", fontSize: 11, color: "#1f2937" }}>
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px 10px", borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#1e40af,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #dbeafe" }}>
                        <span style={{ fontSize: 24, color: "#fff" }}>&#9992;</span>
                    </div>
                    <div>
                        <div style={{ display: "flex", gap: 0, alignItems: "baseline" }}>
                            <span style={{ fontSize: 22, fontWeight: 900, color: "#1e40af", letterSpacing: -0.5 }}>VISA</span>
                            <span style={{ fontSize: 22, fontWeight: 900, color: "#f97316", letterSpacing: -0.5 }}>PRO</span>
                        </div>
                        <div style={{ fontSize: 8, color: "#6b7280", fontWeight: 600 }}>Consultancy &amp; Migration</div>
                        <div style={{ fontSize: 8, color: "#3b82f6" }}>{form.agencyWebsite}</div>
                    </div>
                </div>
                <div style={{ textAlign: "right", fontSize: 9, color: "#6b7280", lineHeight: 1.9 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1e40af" }}>Flight Booking Made Smart and Reliable</div>
                    <div>{form.agencyEmail}</div>
                    <div>{form.agencyPhone}</div>
                </div>
            </div>
            <div style={{ height: 3, background: "linear-gradient(90deg,#f97316 50%,#1e40af 50%)" }} />
            {/* TITLE + BARCODE */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", background: "#fff" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", border: "1px solid #d1d5db", borderRadius: 999, padding: "4px 24px", display: "flex", alignItems: "center", gap: 6 }}>
                    &#9992; &nbsp;e-Ticket Itinerary
                </div>
                <Barcode value={form.bookingRef} />
            </div>
            <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {/* BOOKING BAR */}
                <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #d1d5db" }}>
                    <thead><tr>
                        <th style={S.thBlue}>Booking Reference</th><th style={S.thBlue}>Airline PNR</th>
                        <th style={S.thBlue}>Date of Issue</th><th style={{ ...S.thBlue, borderRight: "none" }}>Status</th>
                    </tr></thead>
                    <tbody><tr>
                        <td style={{ ...S.td, fontWeight: 700, fontSize: 11 }}>{form.bookingRef || "\u2014"}</td>
                        <td style={{ ...S.td, fontWeight: 700, fontSize: 11 }}>{form.airlinePnr || "\u2014"}</td>
                        <td style={S.td}>{form.dateOfIssue || "\u2014"}</td>
                        <td style={{ ...S.td, borderRight: "none" }}>
                            <span style={{ background: "#1a4a8a", color: "#fff", padding: "2px 10px", borderRadius: 3, fontSize: 9, fontWeight: 700 }}>{form.status || "Confirmed"}</span>
                        </td>
                    </tr></tbody>
                </table>
                {/* PASSENGER INFO */}
                <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1f2937", marginBottom: 4 }}>Passenger Information</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #d1d5db" }}>
                        <thead><tr>
                            {["Passenger Name", "Type", "Gender", "Passport Number", "Cabin", "Checked", "E-Ticket"].map((h, i, a) => (
                                <th key={h} style={{ ...S.thBlue, borderRight: i < a.length - 1 ? "1px solid #2563eb" : "none" }}>{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {form.passengers.map((p, i) => (
                                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                    <td style={{ ...S.td, fontWeight: 600 }}>{p.name || "\u2014"}</td>
                                    <td style={{ ...S.td, textAlign: "center" }}>{p.type}</td>
                                    <td style={{ ...S.td, textAlign: "center" }}>{p.gender}</td>
                                    <td style={{ ...S.td, fontFamily: "monospace" }}>{p.passportNo || "\u2014"}</td>
                                    <td style={{ ...S.td, textAlign: "center" }}>{p.cabin}</td>
                                    <td style={{ ...S.td, textAlign: "center" }}>{p.checked}</td>
                                    <td style={{ ...S.td, fontFamily: "monospace", fontSize: 9, borderRight: "none" }}>{p.eTicket || "\u2014"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* ITINERARY INFO */}
                <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1f2937", marginBottom: 4 }}>Itinerary Information</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #d1d5db" }}>
                        <thead><tr>
                            {["Airline", "From", "To", "Depart", "Arrive", "Info"].map((h, i, a) => (
                                <th key={h} style={{ ...S.thBlue, borderRight: i < a.length - 1 ? "1px solid #2563eb" : "none", width: h === "Info" ? "22%" : h === "Airline" ? "10%" : h === "Depart" || h === "Arrive" ? "13%" : "auto" }}>{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {form.flights.map((f, i) => (
                                <>
                                    <tr key={`f${i}`} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", verticalAlign: "top" }}>
                                        <td style={{ ...S.td, padding: "8px" }}>
                                            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 3 }}>
                                                <span style={{ fontSize: 14 }}>&#9992;</span>
                                            </div>
                                            <div style={{ fontWeight: 700, color: "#1e40af", fontSize: 10 }}>{f.airline || "\u2014"}</div>
                                            <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 600 }}>{f.flightNo}</div>
                                        </td>
                                        <td style={{ ...S.td, padding: "8px" }}>
                                            <div style={{ fontSize: 22, fontWeight: 900, color: "#1f2937", lineHeight: 1 }}>{f.from || "\u2014"}</div>
                                            <div style={{ fontSize: 9, color: "#6b7280", marginTop: 2, lineHeight: 1.3 }}>{f.fromAirport}</div>
                                        </td>
                                        <td style={{ ...S.td, padding: "8px" }}>
                                            <div style={{ fontSize: 22, fontWeight: 900, color: "#1f2937", lineHeight: 1 }}>{f.to || "\u2014"}</div>
                                            <div style={{ fontSize: 9, color: "#6b7280", marginTop: 2, lineHeight: 1.3 }}>{f.toAirport}</div>
                                        </td>
                                        <td style={{ ...S.td, padding: "8px" }}>
                                            <div style={{ fontSize: 9, color: "#6b7280" }}>{f.departDay}</div>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937" }}>{f.departDate}</div>
                                            <div style={{ fontSize: 14, fontWeight: 900, color: "#1e40af", marginTop: 2 }}>{f.departTime}</div>
                                        </td>
                                        <td style={{ ...S.td, padding: "8px" }}>
                                            <div style={{ fontSize: 9, color: "#6b7280" }}>{f.arriveDay}</div>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937" }}>{f.arriveDate}</div>
                                            <div style={{ fontSize: 14, fontWeight: 900, color: "#16a34a", marginTop: 2 }}>{f.arriveTime}</div>
                                        </td>
                                        <td style={{ ...S.td, padding: "8px", fontSize: 9, color: "#4b5563", lineHeight: 1.7, borderRight: "none" }}>
                                            {f.classInfo && <div><b>Class:</b> {f.classInfo}</div>}
                                            {f.refund && <div><b>Refund:</b> {f.refund}</div>}
                                            {f.route && <div><b>Route:</b> {f.route}</div>}
                                            {f.duration && <div><b>Duration:</b> {f.duration}</div>}
                                            {f.personalItem && <div><b>Personal Item:</b> {f.personalItem}</div>}
                                            {f.selfTransfer && <div><b>Self-Transfer:</b> {f.selfTransfer}</div>}
                                            {f.terminalChange && <div><b>Terminal Change:</b> {f.terminalChange}</div>}
                                            {f.codeshare && <div><b>Codeshare:</b> {f.codeshare}</div>}
                                            {f.ssrRemarks && <div><b>SSR Remarks:</b> {f.ssrRemarks}</div>}
                                        </td>
                                    </tr>
                                    {f.transitInfo && (
                                        <tr key={`t${i}`}>
                                            <td colSpan={6} style={{ background: "#eff6ff", padding: "5px 12px", textAlign: "center", fontSize: 10, fontWeight: 600, color: "#1e40af", fontStyle: "italic", borderTop: "1px dashed #bfdbfe", borderBottom: "1px dashed #bfdbfe" }}>
                                                {f.transitInfo}
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* FARE DETAILS */}
                <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1f2937", marginBottom: 4 }}>Fare Details</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #d1d5db" }}>
                        <thead><tr>
                            {["Type", "Base Fare", "Tax", "AIT", "Gross Fare", "No of PAX", "Total (BDT)"].map((h, i, a) => (
                                <th key={h} style={{ ...S.thBlue, borderRight: i < a.length - 1 ? "1px solid #2563eb" : "none", textAlign: "right" }}>{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {form.fares.map((f, i) => (
                                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                    <td style={{ ...S.td, fontWeight: 600 }}>{f.type}</td>
                                    <td style={{ ...S.td, textAlign: "right" }}>{f.baseFare}</td>
                                    <td style={{ ...S.td, textAlign: "right" }}>{f.tax}</td>
                                    <td style={{ ...S.td, textAlign: "right" }}>{f.ait}</td>
                                    <td style={{ ...S.td, textAlign: "right", fontWeight: 600 }}>{f.grossFare}</td>
                                    <td style={{ ...S.td, textAlign: "center" }}>{f.pax}</td>
                                    <td style={{ ...S.td, textAlign: "right", fontWeight: 700, borderRight: "none" }}>{f.total}</td>
                                </tr>
                            ))}
                            <tr style={{ background: "#fef3c7" }}>
                                <td colSpan={6} style={{ ...S.td, fontWeight: 900, fontSize: 11, textAlign: "right", paddingRight: 12 }}>Grand Total (BDT)</td>
                                <td style={{ ...S.td, fontWeight: 900, fontSize: 13, textAlign: "right", color: "#b45309", borderRight: "none" }}>{form.grandTotal}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {/* FOOTER */}
            <div style={{ background: "#1e293b", padding: "12px 20px", color: "#e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><span style={{ fontWeight: 900, color: "#f97316", fontSize: 12, letterSpacing: 0.5 }}>{form.agencyWebsite?.toUpperCase()}</span></div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ color: "#94a3b8", fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>CUSTOMER SERVICE</div>
                        <div style={{ color: "#fff", fontSize: 9 }}>{form.agencyEmail}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#94a3b8", fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>HELPLINE</div>
                        <div style={{ color: "#fff", fontSize: 9 }}>{form.agencyPhone}</div>
                    </div>
                </div>
                <div style={{ borderTop: "1px solid #334155", marginTop: 8, paddingTop: 5, textAlign: "center", fontSize: 8, color: "#64748b" }}>
                    Office: {form.agencyOffice}
                </div>
            </div>
        </div>
    );
}

/* Main Page */
export default function TicketGeneratorPage() {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [imgPrev, setImgPrev] = useState(null);
    const [extracting, setExtracting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [form, setForm] = useState({ ...INIT, passengers: [mkP()], flights: [mkF()], fares: [mkFare()] });
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editId, setEditId] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [scanLine, setScanLine] = useState(0);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const fileRef = useRef(null);

    /* Load existing ticket if ?id= */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (id) {
            setEditId(id);
            fetch(`${API}/api/tickets/${id}`).then(r => r.json()).then(json => {
                if (json.success && json.data) {
                    const d = json.data;
                    setForm({ ...INIT, ...d, passengers: d.passengers?.length ? d.passengers : [mkP()], flights: d.flights?.length ? d.flights : [mkF()], fares: d.fares?.length ? d.fares : [mkFare()] });
                    toast.success("Document loaded!");
                }
            }).catch(() => toast.error("Load failed"));
        }
    }, []);

    const handleFile = useCallback((f) => {
        if (!f) return;
        const isPdf = f.type === "application/pdf";
        const isImg = f.type.startsWith("image/");
        if (!isPdf && !isImg) { toast.error("PDF or Image only"); return; }
        setFile(f); setFileType(isPdf ? "pdf" : "image");
        if (isImg) { const r = new FileReader(); r.onload = e => setImgPrev(e.target.result); r.readAsDataURL(f); setPdfUrl(null); }
        else { setImgPrev(null); setPdfUrl(URL.createObjectURL(f)); }
    }, []);

    /* AI extract with scanning animation */
    const handleScanExtract = async () => {
        if (!file) { toast.error("Upload a file first"); return; }
        setScanning(true); setExtracting(true); setProgress(0); setScanLine(0);
        const scanInterval = setInterval(() => { setScanLine(prev => (prev >= 100 ? 0 : prev + 2)); }, 50);
        try {
            const fd = new FormData(); fd.append("pdf", file);
            setProgress(30);
            const res = await fetch(`${API}/api/pdf-extract`, { method: "POST", body: fd });
            setProgress(70);
            const json = await res.json();
            if (!json.success) throw new Error(json.message || "Failed");
            const d = json.data; setProgress(100); clearInterval(scanInterval); setScanLine(100);
            setForm(prev => ({ ...prev, bookingRef: d.bookingRef || prev.bookingRef, airlinePnr: d.airlinePnr || prev.airlinePnr, dateOfIssue: d.dateOfIssue || prev.dateOfIssue, status: d.status || prev.status, grandTotal: d.grandTotal || prev.grandTotal, passengers: d.passengers?.length ? d.passengers : [mkP()], flights: d.flights?.length ? d.flights : [mkF()], fares: d.fares?.length ? d.fares : [mkFare()] }));
            toast.success(json.aiParsed ? "AI extracted all data!" : "Text extracted, please check");
        } catch (e) { clearInterval(scanInterval); console.error("Extract error:", e); toast.error(e.message === "Failed to fetch" ? "Backend server not running! Start backend first." : `Extract failed: ${e.message}`); }
        finally { setExtracting(false); setScanning(false); setProgress(0); setScanLine(0); }
    };

    const add = (k, mk) => setForm(p => ({ ...p, [k]: [...p[k], mk()] }));
    const del = (k, i) => setForm(p => ({ ...p, [k]: p[k].filter((_, j) => j !== i) }));
    const upd = (k, i, field, v) => setForm(p => { const a = [...p[k]]; a[i] = { ...a[i], [field]: v }; return { ...p, [k]: a }; });

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = editId ? `${API}/api/tickets/${editId}` : `${API}/api/tickets`;
            const method = editId ? "PUT" : "POST";
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            const json = await res.json();
            if (!json.success) throw new Error(json.message || "Save failed");
            if (!editId && json.data?._id) setEditId(json.data._id);
            toast.success(editId ? "Updated!" : "Saved!");
        } catch (e) { toast.error("Save failed"); }
        finally { setSaving(false); }
    };

    const downloadPDF = async () => {
        setGenerating(true);
        try {
            const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
            const el = document.getElementById("ticket-print");
            const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
            const pdf = new jsPDF("p", "px", [canvas.width / 2, canvas.height / 2]);
            pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`eTicket_${form.bookingRef || "VisaPro"}.pdf`);
            toast.success("PDF downloaded!");
        } catch { toast.error("PDF generation failed"); }
        finally { setGenerating(false); }
    };

    const downloadImg = async () => {
        setGenerating(true);
        try {
            const { default: html2canvas } = await import("html2canvas");
            const el = document.getElementById("ticket-print");
            const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
            const a = document.createElement("a");
            a.download = `eTicket_${form.bookingRef || "VisaPro"}.png`;
            a.href = canvas.toDataURL("image/png"); a.click();
            toast.success("Image downloaded!");
        } catch { toast.error("Image download failed"); }
        finally { setGenerating(false); }
    };

    const reset = () => { setStep(1); setFile(null); setFileType(null); setImgPrev(null); setEditId(null); setForm({ ...INIT, passengers: [mkP()], flights: [mkF()], fares: [mkFare()] }); window.history.replaceState({}, '', window.location.pathname); };
    useEffect(() => { import("html2canvas").catch(() => { }); import("jspdf").catch(() => { }); }, []);

    /* Count filled fields */
    const countFilled = () => {
        let filled = 0, total = 0;
        ['bookingRef', 'airlinePnr', 'dateOfIssue', 'status'].forEach(k => { total++; if (form[k]) filled++; });
        form.passengers.forEach(p => { ['name', 'type', 'gender', 'passportNo', 'cabin', 'checked', 'eTicket'].forEach(k => { total++; if (p[k]) filled++; }); });
        form.flights.forEach(f => { ['airline', 'flightNo', 'from', 'fromAirport', 'to', 'toAirport', 'departDay', 'departDate', 'departTime', 'arriveDay', 'arriveDate', 'arriveTime', 'classInfo', 'refund', 'route', 'duration', 'personalItem', 'selfTransfer', 'terminalChange', 'codeshare', 'ssrRemarks', 'transitInfo'].forEach(k => { total++; if (f[k]) filled++; }); });
        form.fares.forEach(f => { ['type', 'baseFare', 'tax', 'ait', 'grossFare', 'pax', 'total'].forEach(k => { total++; if (f[k]) filled++; }); });
        ['grandTotal', 'agencyWebsite', 'agencyPhone', 'agencyEmail', 'agencyOffice'].forEach(k => { total++; if (form[k]) filled++; });
        return { filled, total };
    };
    const { filled: filledCount, total: totalFields } = countFilled();
    const fillPercent = totalFields > 0 ? Math.round((filledCount / totalFields) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-4 lg:p-6 max-w-[1400px] mx-auto space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2"><LuPlane className="text-blue-600" /> Ticket Generator</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Upload &rarr; Scan &rarr; Edit &rarr; Preview &amp; Download</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/dashboard/admin/all-tickets" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100"><FiList size={13} /> All Tickets</Link>
                        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100"><FiRefreshCw size={13} /> Reset</button>
                    </div>
                </div>
                {/* Progress bar */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Fields Filled</span>
                            <span className="text-[11px] font-black text-blue-600">{filledCount}/{totalFields} ({fillPercent}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div className="h-full rounded-full" animate={{ width: `${fillPercent}%` }} style={{ background: fillPercent === 100 ? '#22c55e' : fillPercent > 50 ? '#3b82f6' : '#f59e0b' }} transition={{ duration: 0.5 }} />
                        </div>
                    </div>
                    {fillPercent === 100 && <span className="text-green-500 text-xs font-bold flex items-center gap-1"><FiCheck size={14} /> Complete!</span>}
                </div>

                {step !== 3 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        {/* LEFT: Form Fields */}
                        <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                            {/* Booking */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border-b border-blue-100"><FiEdit3 size={12} className="text-blue-500" /><span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Booking Information</span></div>
                                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <F label="Booking Reference" value={form.bookingRef} onChange={e => setForm(p => ({ ...p, bookingRef: e.target.value }))} placeholder="AMB2509107220" />
                                    <F label="Airline PNR" value={form.airlinePnr} onChange={e => setForm(p => ({ ...p, airlinePnr: e.target.value }))} placeholder="RCU7HW" />
                                    <F label="Date of Issue" value={form.dateOfIssue} onChange={e => setForm(p => ({ ...p, dateOfIssue: e.target.value }))} placeholder="19-Sep-2025" />
                                    <F label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} select options={["Confirmed", "Pending", "Cancelled"]} />
                                </div>
                            </div>
                            {/* Passengers */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2.5 bg-purple-50 border-b border-purple-100">
                                    <div className="flex items-center gap-2"><LuUser size={12} className="text-purple-500" /><span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Passengers ({form.passengers.length})</span></div>
                                    <button onClick={() => add("passengers", mkP)} className="flex items-center gap-1 text-[10px] font-bold text-purple-600 hover:underline"><FiPlus size={11} /> Add</button>
                                </div>
                                <div className="p-4 space-y-3">
                                    {form.passengers.map((p, i) => (
                                        <div key={i} className="relative p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Passenger #{i + 1}</span>
                                                {form.passengers.length > 1 && <button onClick={() => del("passengers", i)} className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"><FiX size={9} /></button>}
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                <F label="Full Name" value={p.name} onChange={e => upd("passengers", i, "name", e.target.value)} placeholder="MR GOLAM MONZUR AHAMED" className="col-span-2" />
                                                <F label="Type" value={p.type} onChange={e => upd("passengers", i, "type", e.target.value)} select options={["ADT", "CHD", "INF"]} />
                                                <F label="Gender" value={p.gender} onChange={e => upd("passengers", i, "gender", e.target.value)} select options={["MALE", "FEMALE"]} />
                                                <F label="Passport No" value={p.passportNo} onChange={e => upd("passengers", i, "passportNo", e.target.value)} placeholder="A07141595" />
                                                <F label="Cabin Baggage" value={p.cabin} onChange={e => upd("passengers", i, "cabin", e.target.value)} placeholder="7 KG" />
                                                <F label="Checked Baggage" value={p.checked} onChange={e => upd("passengers", i, "checked", e.target.value)} placeholder="1PC (23KG)" />
                                                <F label="E-Ticket No" value={p.eTicket} onChange={e => upd("passengers", i, "eTicket", e.target.value)} placeholder="1762872306487" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Flights */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2.5 bg-orange-50 border-b border-orange-100">
                                    <div className="flex items-center gap-2"><LuPlane size={12} className="text-orange-500" /><span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider">Flights ({form.flights.length})</span></div>
                                    <button onClick={() => add("flights", mkF)} className="flex items-center gap-1 text-[10px] font-bold text-orange-600 hover:underline"><FiPlus size={11} /> Add</button>
                                </div>
                                <div className="p-4 space-y-4">
                                    {form.flights.map((f, i) => (
                                        <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Flight #{i + 1}</span>
                                                {form.flights.length > 1 && <button onClick={() => del("flights", i)} className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"><FiX size={9} /></button>}
                                            </div>
                                            <div className="space-y-2">
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                    <F label="Airline" value={f.airline} onChange={e => upd("flights", i, "airline", e.target.value)} placeholder="Emirates" />
                                                    <F label="Flight No" value={f.flightNo} onChange={e => upd("flights", i, "flightNo", e.target.value)} placeholder="EK 585" />
                                                    <F label="From (IATA)" value={f.from} onChange={e => upd("flights", i, "from", e.target.value)} placeholder="DAC" />
                                                    <F label="To (IATA)" value={f.to} onChange={e => upd("flights", i, "to", e.target.value)} placeholder="DXB" />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <F label="From Airport" value={f.fromAirport} onChange={e => upd("flights", i, "fromAirport", e.target.value)} placeholder="Hazrat Shahjalal Intl Airport" />
                                                    <F label="To Airport" value={f.toAirport} onChange={e => upd("flights", i, "toAirport", e.target.value)} placeholder="Dubai International Airport" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="p-2 bg-blue-50 rounded-lg">
                                                        <p className="text-[9px] font-bold text-blue-500 mb-1.5 uppercase">Departure</p>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <F label="Day" value={f.departDay} onChange={e => upd("flights", i, "departDay", e.target.value)} placeholder="FRI" />
                                                            <F label="Date" value={f.departDate} onChange={e => upd("flights", i, "departDate", e.target.value)} placeholder="29 May 2026" />
                                                            <F label="Time" value={f.departTime} onChange={e => upd("flights", i, "departTime", e.target.value)} placeholder="01:40" />
                                                        </div>
                                                    </div>
                                                    <div className="p-2 bg-green-50 rounded-lg">
                                                        <p className="text-[9px] font-bold text-green-500 mb-1.5 uppercase">Arrival</p>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <F label="Day" value={f.arriveDay} onChange={e => upd("flights", i, "arriveDay", e.target.value)} placeholder="FRI" />
                                                            <F label="Date" value={f.arriveDate} onChange={e => upd("flights", i, "arriveDate", e.target.value)} placeholder="29 May 2026" />
                                                            <F label="Time" value={f.arriveTime} onChange={e => upd("flights", i, "arriveTime", e.target.value)} placeholder="04:30" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                    <F label="Class" value={f.classInfo} onChange={e => upd("flights", i, "classInfo", e.target.value)} placeholder="Economy (T)" />
                                                    <F label="Duration" value={f.duration} onChange={e => upd("flights", i, "duration", e.target.value)} placeholder="4h 50m" />
                                                    <F label="Refund" value={f.refund} onChange={e => upd("flights", i, "refund", e.target.value)} placeholder="Non-Refundable" />
                                                    <F label="Route" value={f.route} onChange={e => upd("flights", i, "route", e.target.value)} placeholder="One-way" />
                                                    <F label="Personal Item" value={f.personalItem} onChange={e => upd("flights", i, "personalItem", e.target.value)} placeholder="Laptop Bag" />
                                                    <F label="Self-Transfer" value={f.selfTransfer} onChange={e => upd("flights", i, "selfTransfer", e.target.value)} select options={["No", "Yes"]} />
                                                    <F label="Terminal Change" value={f.terminalChange} onChange={e => upd("flights", i, "terminalChange", e.target.value)} select options={["No", "Yes"]} />
                                                    <F label="Codeshare" value={f.codeshare} onChange={e => upd("flights", i, "codeshare", e.target.value)} select options={["No", "Yes"]} />
                                                    <F label="SSR Remarks" value={f.ssrRemarks} onChange={e => upd("flights", i, "ssrRemarks", e.target.value)} placeholder="No" />
                                                </div>
                                                <F label="Transit Info" value={f.transitInfo} onChange={e => upd("flights", i, "transitInfo", e.target.value)} placeholder="Transit in Dubai (DXB) 4h 15m" className="w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Fares */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2.5 bg-green-50 border-b border-green-100">
                                    <div className="flex items-center gap-2"><LuBanknote size={12} className="text-green-500" /><span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">Fare Details</span></div>
                                    <button onClick={() => add("fares", mkFare)} className="flex items-center gap-1 text-[10px] font-bold text-green-600 hover:underline"><FiPlus size={11} /> Add</button>
                                </div>
                                <div className="p-4 space-y-2">
                                    {form.fares.map((f, i) => (
                                        <div key={i} className="relative grid grid-cols-3 sm:grid-cols-7 gap-2 p-2 bg-gray-50 rounded-xl">
                                            {form.fares.length > 1 && <button onClick={() => del("fares", i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center z-10"><FiX size={9} /></button>}
                                            <F label="Type" value={f.type} onChange={e => upd("fares", i, "type", e.target.value)} select options={["ADT", "CHD", "INF"]} />
                                            <F label="Base Fare" value={f.baseFare} onChange={e => upd("fares", i, "baseFare", e.target.value)} placeholder="1,23,093" />
                                            <F label="Tax" value={f.tax} onChange={e => upd("fares", i, "tax", e.target.value)} placeholder="26,106" />
                                            <F label="AIT" value={f.ait} onChange={e => upd("fares", i, "ait", e.target.value)} placeholder="22" />
                                            <F label="Gross Fare" value={f.grossFare} onChange={e => upd("fares", i, "grossFare", e.target.value)} placeholder="1,49,222" />
                                            <F label="PAX" value={f.pax} onChange={e => upd("fares", i, "pax", e.target.value)} placeholder="2" />
                                            <F label="Total (BDT)" value={f.total} onChange={e => upd("fares", i, "total", e.target.value)} placeholder="2,98,444" />
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                                        <span className="text-xs font-bold text-gray-600">Grand Total (BDT)</span>
                                        <input value={form.grandTotal} onChange={e => setForm(p => ({ ...p, grandTotal: e.target.value }))} placeholder="4,10,367" className="w-40 px-3 py-1.5 border-2 border-orange-300 rounded-xl text-sm font-bold text-orange-600 outline-none focus:border-orange-500 text-right" />
                                    </div>
                                </div>
                            </div>
                            {/* Agency */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100"><span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Agency Info</span></div>
                                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <F label="Website" value={form.agencyWebsite} onChange={e => setForm(p => ({ ...p, agencyWebsite: e.target.value }))} placeholder="www.visaprocm.com" />
                                    <F label="Phone" value={form.agencyPhone} onChange={e => setForm(p => ({ ...p, agencyPhone: e.target.value }))} placeholder="+880 1712-114770" />
                                    <F label="Email" value={form.agencyEmail} onChange={e => setForm(p => ({ ...p, agencyEmail: e.target.value }))} placeholder="info@visaprocm.com" />
                                    <F label="Office" value={form.agencyOffice} onChange={e => setForm(p => ({ ...p, agencyOffice: e.target.value }))} placeholder="Dhaka, Bangladesh" />
                                </div>
                            </div>
                            <button onClick={() => setStep(3)} className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 mb-4"><FiEye size={14} /> Preview &amp; Download</button>
                        </div>

                        {/* RIGHT: Upload & Scan */}
                        <div className="lg:col-span-2">
                            <div className="lg:sticky lg:top-4 space-y-4">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border-b border-indigo-100"><LuScanLine size={13} className="text-indigo-500" /><span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Document Scanner</span></div>
                                    <div className="p-4 space-y-4">
                                        {/* Upload / Preview Area */}
                                        <div onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }} onDragOver={e => e.preventDefault()}
                                            className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all ${file ? "border-green-400 bg-green-50/30" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer"}`}
                                            onClick={() => !file && !scanning && fileRef.current?.click()}
                                            style={{ minHeight: file ? "auto" : 200 }}>
                                            {/* Scanning line */}
                                            {scanning && <motion.div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent z-20" animate={{ top: `${scanLine}%` }} transition={{ duration: 0.05 }} style={{ boxShadow: "0 0 15px 3px rgba(59,130,246,0.5)" }} />}
                                            {scanning && <div className="absolute inset-0 bg-blue-500/5 z-10 flex items-center justify-center"><div className="text-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><LuScanLine size={40} className="text-blue-500 mx-auto" /></motion.div><p className="text-xs font-bold text-blue-600 mt-2">AI Scanning... {progress}%</p></div></div>}

                                            {file ? (
                                                <div className="relative">
                                                    {/* Fullscreen button */}
                                                    <button onClick={(e) => { e.stopPropagation(); setShowFullscreen(true); }}
                                                        className="absolute top-2 right-2 z-30 bg-white/90 hover:bg-white border border-gray-200 rounded-lg p-1.5 shadow-sm transition-all hover:scale-110" title="Full Screen">
                                                        <FiMaximize2 size={14} className="text-gray-600" />
                                                    </button>
                                                    {/* Preview */}
                                                    {fileType === "pdf" && pdfUrl ? (
                                                        <iframe src={pdfUrl} className="w-full rounded-xl" style={{ height: 280 }} title="PDF Preview" />
                                                    ) : imgPrev ? (
                                                        <img src={imgPrev} className="w-full max-h-64 object-contain rounded-xl" alt="preview" />
                                                    ) : (
                                                        <div className="w-16 h-16 mx-auto my-6 bg-red-50 rounded-2xl flex items-center justify-center"><LuFileText size={32} className="text-red-400" /></div>
                                                    )}
                                                    <div className="p-2 text-center border-t border-gray-100">
                                                        <p className="text-[11px] font-bold text-green-600 flex items-center justify-center gap-1 truncate"><FiCheck size={12} />{file.name}</p>
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${fileType === "pdf" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>{fileType}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-6 text-center cursor-pointer">
                                                    <FiUpload size={36} className="mx-auto text-gray-300 mb-3" />
                                                    <p className="font-bold text-gray-600 text-sm">Click or Drag &amp; Drop</p>
                                                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, WEBP</p>
                                                </div>
                                            )}
                                            <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={e => handleFile(e.target.files?.[0])} className="hidden" />
                                        </div>

                                        {extracting && <div className="space-y-1"><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full" style={{ width: `${progress}%` }} /></div><p className="text-xs text-center text-gray-400">Extracting... {progress}%</p></div>}
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={handleScanExtract} disabled={!file || extracting} className="col-span-2 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm disabled:opacity-40 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200">
                                                {extracting ? <><FiLoader size={14} className="animate-spin" /> Scanning...</> : <><LuScanLine size={14} /> AI Scan &amp; Extract</>}
                                            </button>
                                            <button onClick={() => fileRef.current?.click()} disabled={extracting} className="flex items-center justify-center gap-2 py-2 border border-gray-200 text-gray-600 rounded-xl font-semibold text-xs disabled:opacity-30 hover:bg-gray-50"><FiUpload size={12} /> Change File</button>
                                            <button onClick={() => { setFile(null); setImgPrev(null); setFileType(null); setPdfUrl(null); }} disabled={!file || extracting} className="flex items-center justify-center gap-2 py-2 border border-gray-200 text-gray-600 rounded-xl font-semibold text-xs disabled:opacity-30 hover:bg-gray-50"><FiX size={12} /> Clear</button>
                                        </div>
                                    </div>
                                </div>
                                {/* Quick Stats */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Summary</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-purple-50 rounded-xl p-3 text-center"><p className="text-xl font-black text-purple-600">{form.passengers.length}</p><p className="text-[10px] text-purple-400 font-bold">Passengers</p></div>
                                        <div className="bg-orange-50 rounded-xl p-3 text-center"><p className="text-xl font-black text-orange-600">{form.flights.length}</p><p className="text-[10px] text-orange-400 font-bold">Flights</p></div>
                                        <div className="bg-green-50 rounded-xl p-3 text-center"><p className="text-xl font-black text-green-600">{form.fares.length}</p><p className="text-[10px] text-green-400 font-bold">Fare Types</p></div>
                                        <div className="bg-blue-50 rounded-xl p-3 text-center"><p className="text-lg font-black text-blue-600 truncate">{form.grandTotal || "\u2014"}</p><p className="text-[10px] text-blue-400 font-bold">Total (BDT)</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Preview & Download */
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                            <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">&larr; Edit</button>
                            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-60 shadow-lg shadow-green-200">{saving ? <FiLoader size={14} className="animate-spin" /> : <FiSave size={14} />} {editId ? "Update" : "Save"}</button>
                            <button onClick={downloadPDF} disabled={generating} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 shadow-lg shadow-blue-200">{generating ? <FiLoader size={14} className="animate-spin" /> : <FiDownload size={14} />} PDF</button>
                            <button onClick={downloadImg} disabled={generating} className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 disabled:opacity-60">{generating ? <FiLoader size={14} className="animate-spin" /> : <FiDownload size={14} />} Image</button>
                            <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50"><FiPrinter size={14} /> Print</button>
                        </div>
                        <div className="bg-gray-200 rounded-2xl p-6 overflow-x-auto">
                            <div className="mx-auto shadow-2xl rounded-xl overflow-hidden" style={{ maxWidth: 900 }}><TicketPreview form={form} /></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {showFullscreen && file && (
                <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={() => setShowFullscreen(false)}>
                    <div className="relative w-full h-full max-w-5xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
                            <span className="text-sm font-bold text-gray-700 truncate">{file.name}</span>
                            <button onClick={() => setShowFullscreen(false)} className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600"><FiMinimize2 size={12} /> Close</button>
                        </div>
                        <div className="w-full h-[calc(100%-44px)]">
                            {fileType === "pdf" && pdfUrl ? (
                                <iframe src={pdfUrl} className="w-full h-full" title="PDF Full Preview" />
                            ) : imgPrev ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50 p-4">
                                    <img src={imgPrev} className="max-w-full max-h-full object-contain rounded-lg shadow-lg" alt="Full Preview" />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

