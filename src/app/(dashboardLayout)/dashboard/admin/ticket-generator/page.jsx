"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiUpload, FiLoader, FiX, FiDownload, FiRefreshCw,
    FiCheck, FiImage, FiEdit3, FiEye, FiPlus, FiTrash2,
} from "react-icons/fi";
import { LuPlane, LuUser, LuScanLine, LuFileText } from "react-icons/lu";

const INITIAL_PASSENGER = { name: "", type: "ADT", gender: "MALE", passportNo: "", cabin: "7 KG", checked: "1PC (23KG)", eTicket: "" };
const INITIAL_FLIGHT = { airline: "", flightNo: "", from: "", fromAirport: "", to: "", toAirport: "", departDate: "", departTime: "", arriveDate: "", arriveTime: "", classInfo: "Economy (T)", refund: "Non-Refundable", route: "One-way", duration: "", transitInfo: "" };
const INITIAL_FARE = { type: "ADT", baseFare: "", tax: "", ait: "", grossFare: "", pax: "1", total: "" };

const INITIAL_FORM = {
    bookingRef: "",
    airlinePnr: "",
    dateOfIssue: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    status: "Confirmed",
    passengers: [{ ...INITIAL_PASSENGER }],
    flights: [{ ...INITIAL_FLIGHT }],
    fares: [{ ...INITIAL_FARE }],
    grandTotal: "",
    agencyName: "VisaPro Consultancy & Migration",
    agencyPhone: "+880 1712-114770",
    agencyEmail: "info@visaprocm.com",
    agencyWebsite: "www.visaprocm.com",
    agencyOffice: "Dhaka, Bangladesh",
};

export default function TicketGeneratorPage() {
    const [step, setStep] = useState(1);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractProgress, setExtractProgress] = useState(0);
    const [form, setForm] = useState({ ...INITIAL_FORM });
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef(null);

    const processFile = useCallback((file) => {
        if (!file) return;
        const isImage = file.type.startsWith("image/");
        const isPdf = file.type === "application/pdf";
        if (!isImage && !isPdf) { toast.error("Image or PDF file দিন"); return; }
        setUploadedFile(file);
        setFileType(isPdf ? "pdf" : "image");
        if (isImage) {
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        } else { setImagePreview(null); }
    }, []);

    const handleFileInput = useCallback((e) => processFile(e.target.files?.[0]), [processFile]);
    const handleDrop = useCallback((e) => { e.preventDefault(); processFile(e.dataTransfer.files?.[0]); }, [processFile]);

    // ==================== Extract Data (PDF via Backend API / Image via OCR) ====================
    const handleExtract = async () => {
        if (!uploadedFile) { toast.error("ফাইল আপলোড করুন"); return; }
        setIsExtracting(true); setExtractProgress(0);
        try {
            let text = "";
            if (fileType === "pdf") {
                toast("PDF থেকে ডাটা extract হচ্ছে...", { icon: "📄" });
                setExtractProgress(30);
                const formData = new FormData();
                formData.append("pdf", uploadedFile);
                const res = await fetch("http://localhost:5000/api/pdf-extract", {
                    method: "POST",
                    body: formData,
                });
                setExtractProgress(70);
                const json = await res.json();
                if (!json.success) throw new Error(json.message || "PDF extract failed");
                text = json.data.text;
                setExtractProgress(100);
            } else {
                toast("Image OCR চলছে...", { icon: "🔍" });
                const Tesseract = (await import("tesseract.js")).default;
                const result = await Tesseract.recognize(uploadedFile, "eng", {
                    logger: (m) => { if (m.status === "recognizing text") setExtractProgress(Math.round(m.progress * 100)); },
                });
                text = result.data.text;
            }
            console.log("Extracted Text:", text);
            const parsed = parseTicketData(text);
            setForm((prev) => ({ ...prev, ...parsed }));
            toast.success("ডাটা extract হয়েছে! চেক করে নিন।");
            setStep(2);
        } catch (err) {
            console.error("Extract Error:", err);
            toast.error("Extract ব্যর্থ। ম্যানুয়ালি দিন।");
            setStep(2);
        } finally { setIsExtracting(false); setExtractProgress(0); }
    };

    const parseTicketData = (text) => {
        const upper = text.toUpperCase();
        const data = {};
        const pnrM = upper.match(/(?:PNR|BOOKING\s*(?:REF|ID|NO)|CONFIRMATION|REFERENCE)[:\s#]*([A-Z0-9]{5,10})/i);
        if (pnrM) data.airlinePnr = pnrM[1].trim();
        const bookM = upper.match(/(?:AMB|BDF|TFB)\d{6,}/);
        if (bookM) data.bookingRef = bookM[0];
        const nameM = upper.match(/(?:MR|MRS|MS|MISS)\s+([A-Z\s]{4,40})/g);
        if (nameM?.length) {
            data.passengers = nameM.map(n => ({ ...INITIAL_PASSENGER, name: n.trim() }));
        }
        const flightM = upper.match(/\b([A-Z]{2}\s?\d{2,4})\b/g);
        const airlines = ["EMIRATES", "QATAR", "BIMAN", "US-BANGLA", "NOVOAIR", "SAUDIA", "TURKISH", "INDIGO", "FLYNAS", "FLYDUBAI", "AIR ARABIA", "ETIHAD"];
        let foundAirline = "";
        for (const a of airlines) { if (upper.includes(a)) { foundAirline = a; break; } }
        if (flightM) {
            data.flights = flightM.slice(0, 4).map(f => ({ ...INITIAL_FLIGHT, flightNo: f.trim(), airline: foundAirline }));
        }
        const airports = upper.match(/\b(DAC|DXB|DOH|IST|JFK|JED|RUH|CGP|SIN|KUL|BKK|LHR|CDG|BOM|DEL|CCU)\b/g);
        if (airports?.length >= 2 && data.flights?.[0]) {
            data.flights[0].from = airports[0]; data.flights[0].to = airports[1];
            if (airports[2] && data.flights[1]) { data.flights[1].from = airports[2]; data.flights[1].to = airports[3] || ""; }
        }
        const dateM = upper.match(/\d{1,2}\s*(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*\d{4}/gi);
        if (dateM?.[0] && data.flights?.[0]) data.flights[0].departDate = dateM[0].trim();
        if (dateM?.[1] && data.flights?.[0]) data.flights[0].arriveDate = dateM[1].trim();
        const timeM = upper.match(/\b(\d{1,2}:\d{2})\b/g);
        if (timeM?.[0] && data.flights?.[0]) data.flights[0].departTime = timeM[0];
        if (timeM?.[1] && data.flights?.[0]) data.flights[0].arriveTime = timeM[1];
        return data;
    };

    // ==================== Dynamic Array Helpers ====================
    const addItem = (key, template) => setForm(p => ({ ...p, [key]: [...p[key], { ...template }] }));
    const removeItem = (key, idx) => setForm(p => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));
    const updateItem = (key, idx, field, val) => setForm(p => {
        const arr = [...p[key]]; arr[idx] = { ...arr[idx], [field]: val }; return { ...p, [key]: arr };
    });

    // ==================== Generate PDF ====================
    const handleGeneratePDF = async () => {
        setIsGenerating(true);
        try {
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF("p", "mm", "a4");
            const W = doc.internal.pageSize.getWidth();
            const M = 12; const cW = W - M * 2; let y = 0;

            // Header
            doc.setFillColor(2, 30, 20);
            doc.rect(0, 0, W, 28, "F");
            doc.setTextColor(239, 140, 44);
            doc.setFontSize(20); doc.setFont("helvetica", "bold");
            doc.text("VISAPRO", M + 2, 14);
            doc.setFontSize(7); doc.setTextColor(200, 200, 200); doc.setFont("helvetica", "normal");
            doc.text("Consultancy & Migration", M + 2, 20);
            doc.setTextColor(255, 255, 255); doc.setFontSize(7);
            doc.text(form.agencyPhone, W - M, 11, { align: "right" });
            doc.text(form.agencyEmail, W - M, 16, { align: "right" });
            doc.text(form.agencyWebsite, W - M, 21, { align: "right" });

            // Orange bar
            doc.setFillColor(239, 140, 44); doc.rect(0, 28, W, 2.5, "F");

            // e-Ticket title
            y = 38;
            doc.setFillColor(245, 247, 250); doc.roundedRect(M, y, cW, 10, 2, 2, "F");
            doc.setTextColor(2, 30, 20); doc.setFontSize(11); doc.setFont("helvetica", "bold");
            doc.text("e-Ticket Itinerary", W / 2, y + 7, { align: "center" });

            // Booking bar
            y += 15;
            doc.setFillColor(53, 144, 207); doc.roundedRect(M, y, cW, 10, 2, 2, "F");
            doc.setTextColor(255, 255, 255); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
            const bCols = [["Booking Reference", form.bookingRef], ["Airline PNR", form.airlinePnr], ["Date of Issue", form.dateOfIssue], ["Status", form.status]];
            const bW = cW / bCols.length;
            bCols.forEach(([l, v], i) => {
                const x = M + i * bW + 4;
                doc.text(l, x, y + 4);
                doc.setFont("helvetica", "normal"); doc.text(v || "—", x, y + 8); doc.setFont("helvetica", "bold");
            });

            // Passenger table
            y += 16;
            doc.setTextColor(2, 30, 20); doc.setFontSize(9); doc.setFont("helvetica", "bold");
            doc.text("Passenger Information", M, y); y += 5;
            const pHeaders = ["Passenger Name", "Type", "Gender", "Passport Number", "Cabin", "Checked", "E-Ticket"];
            const pColW = [50, 14, 18, 30, 14, 22, 38];
            doc.setFillColor(53, 144, 207); doc.rect(M, y, cW, 6, "F");
            doc.setTextColor(255, 255, 255); doc.setFontSize(5.5); doc.setFont("helvetica", "bold");
            let cx = M;
            pHeaders.forEach((h, i) => { doc.text(h, cx + 1.5, y + 4); cx += pColW[i]; }); y += 6;
            form.passengers.forEach((p) => {
                doc.setDrawColor(220, 220, 220); doc.line(M, y + 5, M + cW, y + 5);
                doc.setTextColor(30, 30, 30); doc.setFontSize(5.5); doc.setFont("helvetica", "normal");
                cx = M;
                [p.name, p.type, p.gender, p.passportNo, p.cabin, p.checked, p.eTicket].forEach((v, i) => {
                    doc.text(v || "—", cx + 1.5, y + 3.5); cx += pColW[i];
                }); y += 6;
            });

            // Itinerary
            y += 4;
            doc.setTextColor(2, 30, 20); doc.setFontSize(9); doc.setFont("helvetica", "bold");
            doc.text("Itinerary Information", M, y); y += 5;
            const fHeaders = ["Airline", "From", "To", "Depart", "Arrive", "Info"];
            const fColW = [28, 35, 35, 25, 25, 38];
            doc.setFillColor(53, 144, 207); doc.rect(M, y, cW, 6, "F");
            doc.setTextColor(255, 255, 255); doc.setFontSize(5.5); doc.setFont("helvetica", "bold");
            cx = M;
            fHeaders.forEach((h, i) => { doc.text(h, cx + 1.5, y + 4); cx += fColW[i]; }); y += 6;
            form.flights.forEach((f) => {
                const rowH = 20;
                doc.setFillColor(249, 250, 251); doc.rect(M, y, cW, rowH, "F");
                doc.setDrawColor(220, 220, 220); doc.rect(M, y, cW, rowH, "S");
                doc.setTextColor(30, 30, 30); doc.setFontSize(5.5); doc.setFont("helvetica", "bold");
                cx = M; let ty = y + 5;
                doc.text(f.airline || "—", cx + 1.5, ty); doc.setFontSize(5); doc.text(f.flightNo || "", cx + 1.5, ty + 4);
                cx += fColW[0]; doc.setFontSize(7); doc.setFont("helvetica", "bold");
                doc.text(f.from || "—", cx + 1.5, ty); doc.setFontSize(5); doc.setFont("helvetica", "normal");
                doc.text(f.fromAirport || "", cx + 1.5, ty + 4);
                cx += fColW[1]; doc.setFontSize(7); doc.setFont("helvetica", "bold");
                doc.text(f.to || "—", cx + 1.5, ty); doc.setFontSize(5); doc.setFont("helvetica", "normal");
                doc.text(f.toAirport || "", cx + 1.5, ty + 4);
                cx += fColW[2]; doc.setFontSize(5.5); doc.setFont("helvetica", "bold");
                doc.text(f.departDate || "", cx + 1.5, ty); doc.setFontSize(7);
                doc.text(f.departTime || "", cx + 1.5, ty + 5);
                cx += fColW[3]; doc.setFontSize(5.5); doc.setFont("helvetica", "bold");
                doc.text(f.arriveDate || "", cx + 1.5, ty); doc.setFontSize(7);
                doc.text(f.arriveTime || "", cx + 1.5, ty + 5);
                cx += fColW[4]; doc.setFontSize(4.5); doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
                const infoLines = [`Class: ${f.classInfo}`, `Refund: ${f.refund}`, `Route: ${f.route}`, `Duration: ${f.duration}`].filter(l => !l.endsWith(": "));
                infoLines.forEach((l, li) => doc.text(l, cx + 1.5, ty + li * 3.5));
                if (f.transitInfo) {
                    y += rowH;
                    doc.setFillColor(240, 245, 250); doc.rect(M, y, cW, 5, "F");
                    doc.setTextColor(53, 144, 207); doc.setFontSize(5); doc.setFont("helvetica", "bold");
                    doc.text(f.transitInfo, W / 2, y + 3.5, { align: "center" }); y += 5;
                } else { y += rowH; }
            });

            // Fare Details
            y += 4;
            doc.setTextColor(2, 30, 20); doc.setFontSize(9); doc.setFont("helvetica", "bold");
            doc.text("Fare Details", M, y); y += 5;
            const farH = ["Type", "Base Fare", "Tax", "AIT", "Gross Fare", "No of PAX", "Total (BDT)"];
            const farW = [22, 28, 24, 18, 28, 22, 44];
            doc.setFillColor(53, 144, 207); doc.rect(M, y, cW, 6, "F");
            doc.setTextColor(255, 255, 255); doc.setFontSize(5.5); doc.setFont("helvetica", "bold");
            cx = M; farH.forEach((h, i) => { doc.text(h, cx + 1.5, y + 4); cx += farW[i]; }); y += 6;
            form.fares.forEach((f) => {
                doc.setDrawColor(220, 220, 220); doc.line(M, y + 5, M + cW, y + 5);
                doc.setTextColor(30, 30, 30); doc.setFontSize(5.5); doc.setFont("helvetica", "normal");
                cx = M;
                [f.type, f.baseFare, f.tax, f.ait, f.grossFare, f.pax, f.total].forEach((v, i) => {
                    doc.text(v || "—", cx + 1.5, y + 3.5); cx += farW[i];
                }); y += 6;
            });
            // Grand total row
            doc.setFillColor(245, 247, 250); doc.rect(M, y, cW, 7, "F");
            doc.setTextColor(2, 30, 20); doc.setFontSize(7); doc.setFont("helvetica", "bold");
            doc.text("Grand Total", M + cW - farW[6] - 20, y + 5);
            doc.setTextColor(239, 140, 44);
            doc.text(form.grandTotal || "—", M + cW - 2, y + 5, { align: "right" });

            // Travel Notes
            y += 14;
            doc.setFillColor(249, 250, 251); doc.roundedRect(M, y, cW, 30, 2, 2, "F");
            doc.setDrawColor(200, 200, 200); doc.roundedRect(M, y, cW, 30, 2, 2, "S");
            doc.setTextColor(2, 30, 20); doc.setFontSize(7); doc.setFont("helvetica", "bold");
            doc.text("TRAVEL NOTES", M + 4, y + 6);
            doc.setFontSize(5); doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
            const notes = [
                "Report at the check-in counter at least 1 hour before domestic flights and 3 hours before international flights.",
                "Late reporting may lead to denied boarding.",
                "Carry a valid photo ID and all required travel documents.",
                "Ensure your baggage meets airline rules for weight, size, and restricted items.",
            ];
            notes.forEach((n, i) => doc.text(`•  ${n}`, M + 6, y + 12 + i * 4.5));

            // Footer
            y = 280;
            doc.setFillColor(2, 30, 20); doc.rect(0, y, W, 17, "F");
            doc.setFillColor(239, 140, 44); doc.rect(0, y, W, 1.5, "F");
            doc.setTextColor(239, 140, 44); doc.setFontSize(7); doc.setFont("helvetica", "bold");
            doc.text(form.agencyWebsite.toUpperCase(), M + 2, y + 8);
            doc.setTextColor(200, 200, 200); doc.setFontSize(5.5); doc.setFont("helvetica", "normal");
            doc.text(`CUSTOMER SERVICE: ${form.agencyEmail}`, W / 2, y + 7, { align: "center" });
            doc.text(`HELPLINE: ${form.agencyPhone}`, W - M, y + 7, { align: "right" });
            doc.text(`Office: ${form.agencyOffice}`, W / 2, y + 12, { align: "center" });

            const fileName = `VisaPro_eTicket_${form.passengers[0]?.name?.replace(/\s+/g, "_") || "Ticket"}_${Date.now()}.pdf`;
            doc.save(fileName);
            toast.success("PDF downloaded!");
        } catch (err) { console.error(err); toast.error("PDF generation failed"); }
        finally { setIsGenerating(false); }
    };

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    const handleReset = () => { setStep(1); setUploadedFile(null); setFileType(null); setImagePreview(null); setForm({ ...INITIAL_FORM, passengers: [{ ...INITIAL_PASSENGER }], flights: [{ ...INITIAL_FLIGHT }], fares: [{ ...INITIAL_FARE }] }); };

    const InputField = ({ label, name, value, onChange, placeholder, className = "" }) => (
        <div className={className}>
            <label className="text-[10px] font-semibold text-gray-500 mb-1 block">{label}</label>
            <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder}
                className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-[12px] outline-none focus:border-[#1D7EDD] transition-all" />
        </div>
    );

    return (
        <div className="p-4 lg:p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <LuPlane className="text-[#EF8C2C]" /> Ticket Generator
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">টিকেটের ছবি আপলোড → OCR → সুন্দর PDF ডাউনলোড</p>
                </div>
                <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                    <FiRefreshCw size={14} /> Reset
                </button>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                {[{ n: 1, l: "Upload", ic: FiImage }, { n: 2, l: "Review & Edit", ic: FiEdit3 }, { n: 3, l: "Download PDF", ic: FiDownload }].map((s, i) => (
                    <div key={s.n} className="flex items-center gap-2 flex-1">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg flex-1 transition-all cursor-pointer ${step === s.n ? "bg-[#021E14] text-white" : step > s.n ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`} onClick={() => { if (s.n < step) setStep(s.n); }}>
                            {step > s.n ? <FiCheck size={13} /> : <s.ic size={13} />}
                            <span className="text-[11px] font-semibold hidden sm:inline">{s.l}</span>
                        </div>
                        {i < 2 && <div className={`w-5 h-0.5 ${step > s.n ? "bg-green-300" : "bg-gray-200"}`} />}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* ========== STEP 1: Upload ========== */}
                {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><LuScanLine className="text-[#1D7EDD]" /> Upload Ticket (Image / PDF)</h2>
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${uploadedFile ? "border-green-300 bg-green-50/20" : "border-gray-200 hover:border-[#EF8C2C]/50"}`}
                            onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                            {uploadedFile ? (
                                <div className="space-y-2">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Ticket" className="max-h-56 mx-auto rounded-lg border shadow-sm" />
                                    ) : (
                                        <div className="w-20 h-20 mx-auto bg-red-50 rounded-xl flex items-center justify-center"><LuFileText size={36} className="text-red-400" /></div>
                                    )}
                                    <p className="text-sm text-green-600 font-semibold flex items-center justify-center gap-1"><FiCheck size={14} /> {uploadedFile.name}</p>
                                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${fileType === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{fileType}</span>
                                </div>
                            ) : (
                                <div><FiUpload size={32} className="mx-auto text-gray-300 mb-2" /><p className="text-sm font-semibold text-gray-600">Click or Drag & Drop</p><p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, WEBP</p></div>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*,.pdf,application/pdf" onChange={handleFileInput} className="hidden" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleExtract} disabled={!uploadedFile || isExtracting} className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#021E14] text-white rounded-lg text-sm font-semibold disabled:opacity-40 transition-all">
                                {isExtracting ? <><FiLoader size={14} className="animate-spin" /> Extracting... {extractProgress}%</> : <><LuScanLine size={14} /> Extract Data</>}
                            </button>
                            <button onClick={() => { setStep(2); toast("Enter manually", { icon: "✍️" }); }} className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                                <FiEdit3 size={14} /> Manual Entry
                            </button>
                        </div>
                        {isExtracting && <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-[#EF8C2C] to-[#021E14] rounded-full" initial={{ width: 0 }} animate={{ width: `${extractProgress}%` }} /></div>}
                    </motion.div>
                )}

                {/* ========== STEP 2: Review & Edit ========== */}
                {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 space-y-4">
                                {/* Booking Info */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                    <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Booking Info</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <InputField label="Booking Ref" name="bookingRef" value={form.bookingRef} onChange={handleChange} placeholder="AMB..." />
                                        <InputField label="Airline PNR" name="airlinePnr" value={form.airlinePnr} onChange={handleChange} placeholder="RCUTHW" />
                                        <InputField label="Date of Issue" name="dateOfIssue" value={form.dateOfIssue} onChange={handleChange} placeholder="19-Sep-2025" />
                                        <InputField label="Status" name="status" value={form.status} onChange={handleChange} placeholder="Confirmed" />
                                    </div>
                                </div>

                                {/* Passengers */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5"><LuUser size={12} /> Passengers ({form.passengers.length})</h2>
                                        <button onClick={() => addItem("passengers", INITIAL_PASSENGER)} className="text-[10px] font-semibold text-[#1D7EDD] flex items-center gap-1 hover:underline"><FiPlus size={11} /> Add</button>
                                    </div>
                                    {form.passengers.map((p, i) => (
                                        <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 pb-3 border-b border-gray-50 last:border-0 relative">
                                            {form.passengers.length > 1 && <button onClick={() => removeItem("passengers", i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px]"><FiX size={10} /></button>}
                                            <InputField label="Name" value={p.name} onChange={(e) => updateItem("passengers", i, "name", e.target.value)} placeholder="MR GOLAM..." className="col-span-2" />
                                            <InputField label="Type" value={p.type} onChange={(e) => updateItem("passengers", i, "type", e.target.value)} placeholder="ADT" />
                                            <InputField label="Gender" value={p.gender} onChange={(e) => updateItem("passengers", i, "gender", e.target.value)} placeholder="MALE" />
                                            <InputField label="Passport No" value={p.passportNo} onChange={(e) => updateItem("passengers", i, "passportNo", e.target.value)} placeholder="A071..." />
                                            <InputField label="Cabin" value={p.cabin} onChange={(e) => updateItem("passengers", i, "cabin", e.target.value)} placeholder="7 KG" />
                                            <InputField label="Checked" value={p.checked} onChange={(e) => updateItem("passengers", i, "checked", e.target.value)} placeholder="1PC (23KG)" />
                                            <InputField label="E-Ticket" value={p.eTicket} onChange={(e) => updateItem("passengers", i, "eTicket", e.target.value)} placeholder="176287..." />
                                        </div>
                                    ))}
                                </div>

                                {/* Flights */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5"><LuPlane size={12} /> Flights ({form.flights.length})</h2>
                                        <button onClick={() => addItem("flights", INITIAL_FLIGHT)} className="text-[10px] font-semibold text-[#1D7EDD] flex items-center gap-1 hover:underline"><FiPlus size={11} /> Add</button>
                                    </div>
                                    {form.flights.map((f, i) => (
                                        <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 pb-3 border-b border-gray-50 last:border-0 relative">
                                            {form.flights.length > 1 && <button onClick={() => removeItem("flights", i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"><FiX size={10} /></button>}
                                            <InputField label="Airline" value={f.airline} onChange={(e) => updateItem("flights", i, "airline", e.target.value)} placeholder="Emirates" />
                                            <InputField label="Flight No" value={f.flightNo} onChange={(e) => updateItem("flights", i, "flightNo", e.target.value)} placeholder="EK 585" />
                                            <InputField label="From (Code)" value={f.from} onChange={(e) => updateItem("flights", i, "from", e.target.value)} placeholder="DAC" />
                                            <InputField label="To (Code)" value={f.to} onChange={(e) => updateItem("flights", i, "to", e.target.value)} placeholder="DXB" />
                                            <InputField label="From Airport" value={f.fromAirport} onChange={(e) => updateItem("flights", i, "fromAirport", e.target.value)} placeholder="Hazrat Shahjalal..." />
                                            <InputField label="To Airport" value={f.toAirport} onChange={(e) => updateItem("flights", i, "toAirport", e.target.value)} placeholder="Dubai International..." />
                                            <InputField label="Depart Date" value={f.departDate} onChange={(e) => updateItem("flights", i, "departDate", e.target.value)} placeholder="29 May 2026" />
                                            <InputField label="Depart Time" value={f.departTime} onChange={(e) => updateItem("flights", i, "departTime", e.target.value)} placeholder="01:40" />
                                            <InputField label="Arrive Date" value={f.arriveDate} onChange={(e) => updateItem("flights", i, "arriveDate", e.target.value)} placeholder="29 May 2026" />
                                            <InputField label="Arrive Time" value={f.arriveTime} onChange={(e) => updateItem("flights", i, "arriveTime", e.target.value)} placeholder="04:30" />
                                            <InputField label="Class" value={f.classInfo} onChange={(e) => updateItem("flights", i, "classInfo", e.target.value)} placeholder="Economy (T)" />
                                            <InputField label="Duration" value={f.duration} onChange={(e) => updateItem("flights", i, "duration", e.target.value)} placeholder="4h 50m" />
                                            <InputField label="Refund" value={f.refund} onChange={(e) => updateItem("flights", i, "refund", e.target.value)} placeholder="Non-Refundable" />
                                            <InputField label="Route" value={f.route} onChange={(e) => updateItem("flights", i, "route", e.target.value)} placeholder="One-way" />
                                            <InputField label="Transit Info" value={f.transitInfo} onChange={(e) => updateItem("flights", i, "transitInfo", e.target.value)} placeholder="Transit in Dubai (DXB) 4h 15m" className="col-span-2" />
                                        </div>
                                    ))}
                                </div>

                                {/* Fares */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Fare Details</h2>
                                        <button onClick={() => addItem("fares", INITIAL_FARE)} className="text-[10px] font-semibold text-[#1D7EDD] flex items-center gap-1 hover:underline"><FiPlus size={11} /> Add</button>
                                    </div>
                                    {form.fares.map((f, i) => (
                                        <div key={i} className="grid grid-cols-3 sm:grid-cols-7 gap-2 mb-2 relative">
                                            {form.fares.length > 1 && <button onClick={() => removeItem("fares", i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"><FiX size={10} /></button>}
                                            <InputField label="Type" value={f.type} onChange={(e) => updateItem("fares", i, "type", e.target.value)} placeholder="ADT" />
                                            <InputField label="Base Fare" value={f.baseFare} onChange={(e) => updateItem("fares", i, "baseFare", e.target.value)} placeholder="1,23,093" />
                                            <InputField label="Tax" value={f.tax} onChange={(e) => updateItem("fares", i, "tax", e.target.value)} placeholder="26,106" />
                                            <InputField label="AIT" value={f.ait} onChange={(e) => updateItem("fares", i, "ait", e.target.value)} placeholder="23" />
                                            <InputField label="Gross Fare" value={f.grossFare} onChange={(e) => updateItem("fares", i, "grossFare", e.target.value)} placeholder="1,49,222" />
                                            <InputField label="PAX" value={f.pax} onChange={(e) => updateItem("fares", i, "pax", e.target.value)} placeholder="1" />
                                            <InputField label="Total (BDT)" value={f.total} onChange={(e) => updateItem("fares", i, "total", e.target.value)} placeholder="2,98,444" />
                                        </div>
                                    ))}
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <InputField label="Grand Total (BDT)" name="grandTotal" value={form.grandTotal} onChange={handleChange} placeholder="4,10,367" className="max-w-xs" />
                                    </div>
                                </div>
                            </div>

                            {/* Right side */}
                            <div className="space-y-4">
                                {(imagePreview || fileType === 'pdf') && (
                                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                                        <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><FiEye size={10} /> Source File</h3>
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Source" className="w-full rounded-lg border" />
                                        ) : (
                                            <div className="bg-red-50 rounded-lg p-4 flex flex-col items-center gap-2">
                                                <LuFileText size={32} className="text-red-400" />
                                                <p className="text-[10px] font-semibold text-gray-600 text-center break-all">{uploadedFile?.name}</p>
                                                <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[9px] font-bold">PDF</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                                    <h3 className="text-[10px] font-bold text-amber-700 uppercase mb-1.5">💡 Tips</h3>
                                    <ul className="text-[10px] text-amber-700 space-y-1">
                                        <li>• OCR 100% সঠিক নাও হতে পারে</li>
                                        <li>• একাধিক passenger ও flight যোগ করুন</li>
                                        <li>• Grand Total সঠিকভাবে দিন</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">← Back</button>
                            <button onClick={() => { if (!form.passengers[0]?.name?.trim()) { toast.error("Passenger name required"); return; } setStep(3); }}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#021E14] text-white rounded-lg text-sm font-semibold hover:bg-[#0a3a2a] transition-all">
                                <FiEye size={14} /> Preview & Generate
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ========== STEP 3: Preview & Download ========== */}
                {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-w-3xl mx-auto">
                            {/* Header */}
                            <div className="bg-[#021E14] text-white px-5 py-3 flex justify-between items-center">
                                <div><span className="text-lg font-bold text-[#EF8C2C]">VISAPRO</span><span className="text-[9px] text-gray-400 ml-2">Consultancy & Migration</span></div>
                                <div className="text-right text-[9px] text-gray-400"><p>{form.agencyPhone}</p><p>{form.agencyEmail}</p></div>
                            </div>
                            <div className="h-1 bg-[#EF8C2C]" />
                            <div className="p-5 space-y-4">
                                <h3 className="text-center text-sm font-bold text-gray-700 bg-gray-50 py-2 rounded">e-Ticket Itinerary</h3>
                                {/* Booking bar */}
                                <div className="grid grid-cols-4 gap-0 bg-[#3590CF] text-white rounded-lg overflow-hidden">
                                    {[["Booking Ref", form.bookingRef], ["Airline PNR", form.airlinePnr], ["Date of Issue", form.dateOfIssue], ["Status", form.status]].map(([l, v]) => (
                                        <div key={l} className="px-3 py-2 border-r border-white/10 last:border-0">
                                            <p className="text-[8px] font-bold opacity-80">{l}</p>
                                            <p className="text-[11px] font-semibold">{v || "—"}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Passengers */}
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase mb-1.5">Passenger Information</p>
                                    <table className="w-full text-[10px]">
                                        <thead><tr className="bg-[#3590CF] text-white">{["Name", "Type", "Gender", "Passport", "Cabin", "Checked", "E-Ticket"].map(h => <th key={h} className="px-2 py-1.5 text-left font-semibold">{h}</th>)}</tr></thead>
                                        <tbody>{form.passengers.map((p, i) => (<tr key={i} className="border-b border-gray-100">{[p.name, p.type, p.gender, p.passportNo, p.cabin, p.checked, p.eTicket].map((v, j) => <td key={j} className="px-2 py-1.5 text-gray-700">{v || "—"}</td>)}</tr>))}</tbody>
                                    </table>
                                </div>
                                {/* Flights */}
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase mb-1.5">Itinerary</p>
                                    {form.flights.map((f, i) => (
                                        <div key={i} className="mb-2">
                                            <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                                                <div className="text-center"><p className="text-lg font-black text-gray-800">{f.from || "—"}</p><p className="text-[9px] text-gray-500">{f.departDate}</p><p className="text-sm font-bold text-[#021E14]">{f.departTime}</p></div>
                                                <div className="text-center"><div className="w-6 h-6 rounded-full bg-[#EF8C2C] flex items-center justify-center text-white text-xs">✈</div><p className="text-[8px] text-gray-400 mt-0.5">{f.airline} {f.flightNo}</p></div>
                                                <div className="text-center"><p className="text-lg font-black text-gray-800">{f.to || "—"}</p><p className="text-[9px] text-gray-500">{f.arriveDate}</p><p className="text-sm font-bold text-[#021E14]">{f.arriveTime}</p></div>
                                            </div>
                                            {f.transitInfo && <p className="text-center text-[9px] text-[#3590CF] font-semibold mt-1">{f.transitInfo}</p>}
                                        </div>
                                    ))}
                                </div>
                                {/* Grand Total */}
                                {form.grandTotal && (
                                    <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-600">Grand Total</span>
                                        <span className="text-base font-black text-[#EF8C2C]">৳ {form.grandTotal}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setStep(2)} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">← Edit</button>
                            <button onClick={handleGeneratePDF} disabled={isGenerating}
                                className="flex items-center gap-2 px-8 py-3 bg-[#EF8C2C] text-white rounded-lg text-sm font-bold hover:bg-[#d97b1f] disabled:opacity-60 transition-all shadow-lg shadow-[#EF8C2C]/20">
                                {isGenerating ? <><FiLoader size={14} className="animate-spin" /> Generating...</> : <><FiDownload size={14} /> Download PDF</>}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
