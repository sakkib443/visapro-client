"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    FiUpload, FiLoader, FiX, FiDownload, FiRefreshCw, FiSave,
    FiCheck, FiEye, FiPrinter, FiList, FiMaximize, FiMinimize, FiPlus, FiTrash2,
} from "react-icons/fi";
import { LuScanLine, LuBuilding } from "react-icons/lu";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ─── Default State ─────────────────────────────────────────── */
const emptyPassenger = { name: "", type: "ADT", gender: "MALE", passportNo: "", cabin: "7 KG", checked: "1PC (23KG)", eTicket: "" };
const emptySegment = { airline: "", flightNo: "", fromCode: "", fromAirport: "", toCode: "", toAirport: "", departDate: "", departTime: "", arriveDate: "", arriveTime: "", classInfo: "", refund: "", route: "", duration: "", personalItem: "", selfTransfer: "No", terminalChange: "No", codeshare: "No", ssrRemarks: "No" };
const emptyFare = { type: "ADT", baseFare: "", tax: "", ait: "", grossFare: "", pax: "1", total: "" };

const INIT = {
    // Booking
    bookingRef: "", airlinePnr: "", issueDate: "", status: "Confirmed",
    // Passengers
    passengers: [{ ...emptyPassenger }],
    // Segments
    segments: [{ ...emptySegment }],
    transitInfo: "",
    // Fare
    fares: [{ ...emptyFare }],
    grandTotal: "",
    // Travel Notes
    travelNotes: "Report at the check-in counter at least 1 hour before domestic flights and 3 hours before international flights.\nLate reporting may lead to denied boarding.\nCarry a valid photo ID and all required travel documents.\nEnsure your baggage meets airline rules for weight, size, and restricted items.",
    // Agency
    agencyName: "VisaPro Consultancy & Migration",
    agencyTagline: "Your Trusted Travel Partner",
    agencyPhone: "+880 1712-114770",
    agencyPhone2: "",
    agencyEmail: "info@visaprocm.com",
    agencyWebsite: "www.visaprocm.com",
    agencyOffice: "Dhaka, Bangladesh",
};

/* ─── E-Ticket Preview — pixel-exact match ──────────────── */
function ETicketPreview({ data: p }) {
    // Colors matching the reference image exactly
    const TEAL = "#2a9d8f";     // header/footer bg
    const DARK_TEAL = "#1a7a6e"; // darker footer row
    const TEAL_LIGHT = "#e6f5f3"; // light teal background
    const BORDER = "#c8c8c8";    // table borders
    const HEADER_BG = "#e8ecef"; // table header gray

    return (
        <div id="doc-preview" style={{ fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif", background: "#fff", width: 760, color: "#222" }}>

            {/* ════ HEADER ════ */}
            <div style={{ background: TEAL, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 50, height: 50, background: "rgba(255,255,255,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 26, color: "#fff" }}>✈</span>
                    </div>
                    <div>
                        <div style={{ color: "#fff", fontWeight: 900, fontSize: 14, letterSpacing: 0.5 }}>{p.agencyWebsite?.toUpperCase() || "VISAPROCM.COM"}</div>
                        <div style={{ color: "#d1fae5", fontSize: 9 }}>{p.agencyTagline || ""}</div>
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#fff", fontWeight: 900, fontSize: 20, letterSpacing: 1 }}>{p.agencyName?.toUpperCase() || "VISAPRO"}</div>
                    <div style={{ color: "#d1fae5", fontSize: 9 }}>{p.agencyTagline || ""}</div>
                </div>
            </div>

            {/* ════ TITLE: e-Ticket Itinerary ════ */}
            <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ border: `2px solid ${TEAL}`, borderRadius: 20, padding: "4px 18px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 15, fontStyle: "italic", fontWeight: 600, color: "#333" }}>e-Ticket Itinerary</span>
                    <span style={{ fontSize: 14 }}>✈</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#444", letterSpacing: 2 }}>{p.bookingRef || ""}</div>
            </div>

            {/* ════ BOOKING INFO TABLE ════ */}
            <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${BORDER}` }}>
                <thead>
                    <tr style={{ background: TEAL }}>
                        <th style={{ padding: "7px 12px", color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "left", border: `1px solid ${TEAL}` }}>Booking Reference</th>
                        <th style={{ padding: "7px 12px", color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "left", border: `1px solid ${TEAL}` }}>Airline PNR</th>
                        <th style={{ padding: "7px 12px", color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "left", border: `1px solid ${TEAL}` }}>Date of Issue</th>
                        <th style={{ padding: "7px 12px", color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "left", border: `1px solid ${TEAL}` }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ background: TEAL_LIGHT }}>
                        <td style={{ padding: "7px 12px", fontSize: 11, fontWeight: 600, border: `1px solid ${BORDER}` }}>{p.bookingRef || ""}</td>
                        <td style={{ padding: "7px 12px", fontSize: 11, fontWeight: 600, border: `1px solid ${BORDER}` }}>{p.airlinePnr || ""}</td>
                        <td style={{ padding: "7px 12px", fontSize: 11, fontWeight: 600, border: `1px solid ${BORDER}` }}>{p.issueDate || ""}</td>
                        <td style={{ padding: "7px 12px", fontSize: 11, border: `1px solid ${BORDER}` }}>
                            <span style={{ background: TEAL, color: "#fff", padding: "2px 12px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>{p.status || "Confirmed"}</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div style={{ padding: "0 20px" }}>

                {/* ════ PASSENGER INFORMATION ════ */}
                <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#222", marginBottom: 8 }}>Passenger Information</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${BORDER}` }}>
                        <thead>
                            <tr style={{ background: HEADER_BG }}>
                                {["Passenger Name", "Type", "Gender", "Passport Number", "Cabin", "Checked", "E-Ticket"].map(h => (
                                    <th key={h} style={{ padding: "6px 8px", fontSize: 9, fontWeight: 700, textAlign: "left", border: `1px solid ${BORDER}`, color: "#333" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(p.passengers || [{ ...emptyPassenger }]).map((px, i) => (
                                <tr key={i}>
                                    <td style={{ padding: "6px 8px", fontSize: 10, fontWeight: 600, border: `1px solid ${BORDER}` }}>{px.name || ""}</td>
                                    <td style={{ padding: "6px 8px", fontSize: 10, textAlign: "center", border: `1px solid ${BORDER}` }}>{px.type || ""}</td>
                                    <td style={{ padding: "6px 8px", fontSize: 10, textAlign: "center", fontWeight: 700, border: `1px solid ${BORDER}`, color: px.gender === "FEMALE" ? "#d6336c" : "#1971c2" }}>{px.gender || ""}</td>
                                    <td style={{ padding: "6px 8px", fontSize: 10, border: `1px solid ${BORDER}` }}>{px.passportNo || ""}</td>
                                    <td style={{ padding: "6px 8px", fontSize: 10, textAlign: "center", border: `1px solid ${BORDER}` }}>{px.cabin || ""}</td>
                                    <td style={{ padding: "6px 8px", fontSize: 10, textAlign: "center", border: `1px solid ${BORDER}` }}>{px.checked || ""}</td>
                                    <td style={{ padding: "6px 8px", fontSize: 10, border: `1px solid ${BORDER}` }}>{px.eTicket || ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ════ ITINERARY INFORMATION ════ */}
                <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#222", marginBottom: 8 }}>Itinerary Information</div>

                    {(p.segments || [{ ...emptySegment }]).map((seg, i) => (
                        <div key={i} style={{ marginBottom: 6 }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${BORDER}` }}>
                                <thead>
                                    <tr style={{ background: HEADER_BG }}>
                                        {["Airline", "From", "To", "Depart", "Arrive", "Info"].map(h => (
                                            <th key={h} style={{ padding: "6px 8px", fontSize: 9, fontWeight: 700, textAlign: "left", border: `1px solid ${BORDER}`, color: "#333" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {/* Airline */}
                                        <td style={{ padding: "8px", border: `1px solid ${BORDER}`, verticalAlign: "top", width: 85 }}>
                                            <div style={{ width: 40, height: 24, background: "#f1f5f9", borderRadius: 4, marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#94a3b8" }}>✈</div>
                                            <div style={{ fontSize: 10, color: "#555" }}>{seg.airline || ""}</div>
                                            <div style={{ fontSize: 11, fontWeight: 800, color: "#111" }}>{seg.flightNo || ""}</div>
                                        </td>
                                        {/* From */}
                                        <td style={{ padding: "8px", border: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                                            <div style={{ fontWeight: 900, fontSize: 22, color: "#111", lineHeight: 1 }}>{seg.fromCode || ""}</div>
                                            <div style={{ fontSize: 8, color: "#666", marginTop: 2, lineHeight: 1.3 }}>{seg.fromAirport || ""}</div>
                                        </td>
                                        {/* To */}
                                        <td style={{ padding: "8px", border: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                                            <div style={{ fontWeight: 900, fontSize: 22, color: "#111", lineHeight: 1 }}>{seg.toCode || ""}</div>
                                            <div style={{ fontSize: 8, color: "#666", marginTop: 2, lineHeight: 1.3 }}>{seg.toAirport || ""}</div>
                                        </td>
                                        {/* Depart */}
                                        <td style={{ padding: "8px", border: `1px solid ${BORDER}`, verticalAlign: "top", textAlign: "center" }}>
                                            <div style={{ fontSize: 9, color: "#666", fontWeight: 600 }}>{seg.departDate || ""}</div>
                                            <div style={{ fontWeight: 900, fontSize: 22, color: "#111", lineHeight: 1.2 }}>{seg.departTime || ""}</div>
                                        </td>
                                        {/* Arrive */}
                                        <td style={{ padding: "8px", border: `1px solid ${BORDER}`, verticalAlign: "top", textAlign: "center" }}>
                                            <div style={{ fontSize: 9, color: "#666", fontWeight: 600 }}>{seg.arriveDate || ""}</div>
                                            <div style={{ fontWeight: 900, fontSize: 22, color: "#111", lineHeight: 1.2 }}>{seg.arriveTime || ""}</div>
                                        </td>
                                        {/* Info */}
                                        <td style={{ padding: "8px", border: `1px solid ${BORDER}`, verticalAlign: "top", fontSize: 9, color: "#444", lineHeight: 1.6 }}>
                                            {seg.classInfo && <div>Class: <b>{seg.classInfo}</b></div>}
                                            {seg.refund && <div>Refund: <b>{seg.refund}</b></div>}
                                            {seg.route && <div>Route: <b>{seg.route}</b></div>}
                                            {seg.duration && <div>Duration: <b>{seg.duration}</b></div>}
                                            {seg.personalItem && <div>Personal Item: <b>{seg.personalItem}</b></div>}
                                            {seg.selfTransfer && seg.selfTransfer !== "No" && <div>Self-Transfer: <b>{seg.selfTransfer}</b></div>}
                                            {seg.terminalChange && seg.terminalChange !== "No" && <div>Terminal Change: <b>{seg.terminalChange}</b></div>}
                                            {seg.codeshare && seg.codeshare !== "No" && <div>Codeshare: <b>{seg.codeshare}</b></div>}
                                            {seg.ssrRemarks && seg.ssrRemarks !== "No" && <div>SSR: <b>{seg.ssrRemarks}</b></div>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}

                    {/* Transit Bar */}
                    {p.transitInfo && (
                        <div style={{ background: "#cce5ff", border: `1px solid #99caff`, borderRadius: 4, padding: "5px 0", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#004085", marginBottom: 8 }}>
                            Transit in {p.transitInfo}
                        </div>
                    )}
                </div>

                {/* ════ FARE DETAILS ════ */}
                <div style={{ marginTop: 14 }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#222", marginBottom: 8 }}>Fare Details</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${BORDER}` }}>
                        <thead>
                            <tr style={{ background: TEAL }}>
                                {["Type", "Base Fare", "Tax", "AIT", "Gross Fare", "No of PAX", "Total (BDT)"].map(h => (
                                    <th key={h} style={{ padding: "6px 8px", color: "#fff", fontSize: 10, fontWeight: 700, textAlign: h === "Type" ? "left" : "right", border: `1px solid ${TEAL}` }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(p.fares || [{ ...emptyFare }]).map((fr, i) => (
                                <tr key={i}>
                                    <td style={{ padding: "6px 8px", fontSize: 10, fontWeight: 600, border: `1px solid ${BORDER}` }}>{fr.type || ""}</td>
                                    <td style={{ padding: "6px 8px", fontSize: 10, textAlign: "right", border: `1px solid ${BORDER}` }}>{fr.baseFare || ""}</td>
                                    <td style={{ padding: "6px 8px", fontSize: 10, textAlign: "right", border: `1px solid ${BORDER}` }}>{fr.tax || ""}</td>
                                    <td style={{ padding: "6px 8px", fontSize: 10, textAlign: "right", border: `1px solid ${BORDER}` }}>{fr.ait || ""}</td>
                                    <td style={{ padding: "6px 8px", fontSize: 10, textAlign: "right", border: `1px solid ${BORDER}` }}>{fr.grossFare || ""}</td>
                                    <td style={{ padding: "6px 8px", fontSize: 10, textAlign: "center", border: `1px solid ${BORDER}` }}>{fr.pax || ""}</td>
                                    <td style={{ padding: "6px 8px", fontSize: 11, textAlign: "right", fontWeight: 700, border: `1px solid ${BORDER}` }}>{fr.total || ""}</td>
                                </tr>
                            ))}
                            {/* Grand Total Row */}
                            <tr style={{ background: TEAL_LIGHT }}>
                                <td colSpan={6} style={{ padding: "7px 8px", textAlign: "right", fontWeight: 800, fontSize: 11, border: `1px solid ${BORDER}`, color: "#065f46" }}>Grand Total</td>
                                <td style={{ padding: "7px 8px", textAlign: "right", fontWeight: 900, fontSize: 13, border: `1px solid ${BORDER}`, color: "#065f46" }}>{p.grandTotal || ""}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ════ TRAVEL NOTES ════ */}
                <div style={{ marginTop: 16, marginBottom: 16, border: "2px solid #e6a817", borderRadius: 6, padding: "10px 14px" }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#7c4a03", marginBottom: 6 }}>TRAVEL NOTES</div>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 10, color: "#5a3600", lineHeight: 1.8 }}>
                        {(p.travelNotes || "").split("\n").filter(Boolean).map((n, i) => <li key={i}>{n}</li>)}
                    </ul>
                </div>
            </div>

            {/* ════ FOOTER (Green bar with 3 columns) ════ */}
            <div style={{ background: TEAL, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>✈</span>
                    <span style={{ color: "#fff", fontWeight: 800, fontSize: 11, letterSpacing: 0.5 }}>{p.agencyWebsite?.toUpperCase() || ""}</span>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#fbbf24", fontSize: 10, fontWeight: 700 }}>CUSTOMER SERVICE</div>
                    <div style={{ color: "#fff", fontSize: 9 }}>{p.agencyEmail || ""}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#fbbf24", fontSize: 10, fontWeight: 700 }}>HELPLINE</div>
                    <div style={{ color: "#fff", fontSize: 9 }}>☎ {p.agencyPhone || ""}</div>
                    {p.agencyPhone2 && <div style={{ color: "#fff", fontSize: 9 }}>☎ {p.agencyPhone2}</div>}
                </div>
            </div>
            {/* Dark footer bottom */}
            <div style={{ background: DARK_TEAL, padding: "6px 20px", textAlign: "center", color: "#d1fae5", fontSize: 9, fontWeight: 600 }}>
                Office: {p.agencyOffice || ""}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function VisaDocumentCreatePage() {
    const [file, setFile] = useState(null);
    const [imgPrev, setImgPrev] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [data, setData] = useState(JSON.parse(JSON.stringify(INIT)));
    const [scanning, setScanning] = useState(false);
    const [scanPct, setScanPct] = useState(0);
    const [scanDone, setScanDone] = useState(false);
    const [filledKeys, setFilledKeys] = useState([]);
    const [view, setView] = useState("edit");
    const [fullscreen, setFullscreen] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editId, setEditId] = useState(null);
    const fRef = useRef(null);

    const upd = (k) => (e) => setData(p => ({ ...p, [k]: e.target.value }));

    /* Load existing */
    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("id");
        if (id) {
            setEditId(id);
            fetch(`${API}/api/doc-entries/${id}`).then(r => r.json()).then(j => {
                if (j.success && j.data) { setData({ ...JSON.parse(JSON.stringify(INIT)), ...j.data }); setScanDone(true); toast.success("Loaded!"); }
            }).catch(() => toast.error("Load failed"));
        }
    }, []);

    /* File */
    const pickFile = useCallback((f) => {
        if (!f) return;
        if (!f.type.startsWith("image/") && f.type !== "application/pdf") { toast.error("PDF/Image দিন"); return; }
        setFile(f);
        if (f.type.startsWith("image/")) { const r = new FileReader(); r.onload = e => { setImgPrev(e.target.result); setPdfUrl(null); }; r.readAsDataURL(f); }
        else { setImgPrev(null); setPdfUrl(URL.createObjectURL(f)); }
    }, []);

    /* AI Scan */
    const doScan = async () => {
        if (!file) return toast.error("ফাইল দিন");
        setScanning(true); setScanPct(0); setFilledKeys([]); setScanDone(false);
        const iv = setInterval(() => setScanPct(p => { if (p >= 88) { clearInterval(iv); return 88; } return p + 3; }), 130);
        try {
            const fd = new FormData(); fd.append("pdf", file);
            const res = await fetch(`${API}/api/pdf-extract`, { method: "POST", body: fd });
            const j = await res.json(); clearInterval(iv); setScanPct(100);
            if (!j.success) throw new Error(j.message);
            const d = j.data;

            // Map AI response to our format
            const mapped = { ...JSON.parse(JSON.stringify(INIT)) };
            mapped.bookingRef = d.bookingRef || d.documentNumber || "";
            mapped.airlinePnr = d.airlinePnr || d.pnrCode || "";
            mapped.issueDate = d.issueDate || "";
            mapped.status = d.status || "Confirmed";
            mapped.transitInfo = d.transitInfo || "";
            mapped.grandTotal = d.grandTotal || d.ticketPrice || "";
            if (d.travelNotes) mapped.travelNotes = d.travelNotes;

            // Passengers
            if (d.passengers && Array.isArray(d.passengers)) {
                mapped.passengers = d.passengers.map(px => ({
                    name: px.name || px.passengerName || "", type: px.type || "ADT",
                    gender: px.gender || "MALE", passportNo: px.passportNo || px.passportNumber || "",
                    cabin: px.cabin || px.cabinBag || "7 KG", checked: px.checked || px.checkedBag || "1PC (23KG)",
                    eTicket: px.eTicket || px.eTicketNo || "",
                }));
            } else if (d.fullNameEn || d.applicantName || d.passengerName) {
                mapped.passengers = [{ name: d.fullNameEn || d.applicantName || d.passengerName || "", type: "ADT", gender: d.gender || "MALE", passportNo: d.passportNo || "", cabin: "7 KG", checked: "1PC (23KG)", eTicket: d.eTicketNo || "" }];
            }

            // Segments
            if (d.segments && Array.isArray(d.segments)) {
                mapped.segments = d.segments.map(sg => ({
                    airline: sg.airline || sg.airlineName || "", flightNo: sg.flightNo || sg.flightNumber || "",
                    fromCode: sg.fromCode || sg.fromCity || "", fromAirport: sg.fromAirport || "",
                    toCode: sg.toCode || sg.toCity || "", toAirport: sg.toAirport || "",
                    departDate: sg.departDate || sg.departureDate || "", departTime: sg.departTime || sg.departureTime || "",
                    arriveDate: sg.arriveDate || sg.arrivalDate || "", arriveTime: sg.arriveTime || sg.arrivalTime || "",
                    classInfo: sg.classInfo || sg.seatClass || "", refund: sg.refund || "",
                    route: sg.route || "", duration: sg.duration || "",
                    personalItem: sg.personalItem || "", selfTransfer: sg.selfTransfer || "No",
                    terminalChange: sg.terminalChange || "No", codeshare: sg.codeshare || "No", ssrRemarks: sg.ssrRemarks || "No",
                }));
            } else if (d.airlineName || d.flightNumber || d.fromCity) {
                mapped.segments = [{ airline: d.airlineName || "", flightNo: d.flightNumber || "", fromCode: d.fromCity || d.fromCode || "", fromAirport: "", toCode: d.toCity || d.toCode || "", toAirport: "", departDate: d.departureDate || d.departDate || "", departTime: d.departureTime || "", arriveDate: d.arrivalDate || d.arriveDate || "", arriveTime: d.arrivalTime || "", classInfo: d.seatClass || d.classInfo || "", refund: "", route: "", duration: "", personalItem: "", selfTransfer: "No", terminalChange: "No", codeshare: "No", ssrRemarks: "No" }];
            }

            // Fares
            if (d.fares && Array.isArray(d.fares)) {
                mapped.fares = d.fares.map(fr => ({
                    type: fr.type || "ADT", baseFare: fr.baseFare || "", tax: fr.tax || "",
                    ait: fr.ait || "", grossFare: fr.grossFare || "", pax: fr.pax || "1", total: fr.total || "",
                }));
            }

            // Animate
            const keys = ["bookingRef", "airlinePnr", "issueDate", "status", "passengers", "segments", "transitInfo", "fares", "grandTotal"];
            const activeKeys = keys.filter(k => {
                const v = mapped[k];
                if (Array.isArray(v)) return v.length > 0 && v.some(item => Object.values(item).some(x => x));
                return v;
            });
            let dl = 0;
            for (const k of activeKeys) {
                dl += 150;
                setTimeout(() => { setData(p => ({ ...p, [k]: mapped[k] })); setFilledKeys(p => [...p, k]); }, dl);
            }
            setTimeout(() => { setScanDone(true); setScanning(false); toast.success(`✅ Data extracted!`); }, dl + 400);
        } catch { clearInterval(iv); setScanning(false); toast.error("Extract failed"); }
    };

    /* Save */
    const save = async () => {
        setSaving(true);
        try {
            const u = editId ? `${API}/api/doc-entries/${editId}` : `${API}/api/doc-entries`;
            const r = await fetch(u, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
            const j = await r.json(); if (!j.success) throw 0;
            if (!editId && j.data?._id) setEditId(j.data._id);
            toast.success(editId ? "Updated!" : "Saved!");
        } catch { toast.error("Failed"); } finally { setSaving(false); }
    };

    /* Download */
    const dlPdf = async () => { setGenerating(true); try { const [{ default: h2c }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]); const el = document.getElementById("doc-preview"); const c = await h2c(el, { scale: 2, useCORS: true, backgroundColor: "#fff" }); const pdf = new jsPDF("p", "px", [c.width / 2, c.height / 2]); pdf.addImage(c.toDataURL("image/png"), "PNG", 0, 0, c.width / 2, c.height / 2); pdf.save(`eTicket_${(data.passengers?.[0]?.name || "doc").replace(/\s+/g, "_")}.pdf`); } catch { toast.error("Failed"); } finally { setGenerating(false); } };
    const dlImg = async () => { setGenerating(true); try { const { default: h2c } = await import("html2canvas"); const c = await h2c(document.getElementById("doc-preview"), { scale: 2, useCORS: true, backgroundColor: "#fff" }); const a = document.createElement("a"); a.download = `eTicket_${(data.passengers?.[0]?.name || "doc").replace(/\s+/g, "_")}.png`; a.href = c.toDataURL("image/png"); a.click(); } catch { toast.error("Failed"); } finally { setGenerating(false); } };

    const reset = () => { setFile(null); setImgPrev(null); setPdfUrl(null); setData(JSON.parse(JSON.stringify(INIT))); setEditId(null); setFilledKeys([]); setScanDone(false); setScanPct(0); setScanning(false); setView("edit"); setFullscreen(false); window.history.replaceState({}, "", window.location.pathname); };
    useEffect(() => { import("html2canvas").catch(() => { }); import("jspdf").catch(() => { }); }, []);

    // Helpers for array fields
    const updPassenger = (i, k, v) => setData(p => { const arr = [...p.passengers]; arr[i] = { ...arr[i], [k]: v }; return { ...p, passengers: arr }; });
    const addPassenger = () => setData(p => ({ ...p, passengers: [...p.passengers, { ...emptyPassenger }] }));
    const delPassenger = (i) => setData(p => ({ ...p, passengers: p.passengers.filter((_, j) => j !== i) }));
    const updSegment = (i, k, v) => setData(p => { const arr = [...p.segments]; arr[i] = { ...arr[i], [k]: v }; return { ...p, segments: arr }; });
    const addSegment = () => setData(p => ({ ...p, segments: [...p.segments, { ...emptySegment }] }));
    const delSegment = (i) => setData(p => ({ ...p, segments: p.segments.filter((_, j) => j !== i) }));
    const updFare = (i, k, v) => setData(p => { const arr = [...p.fares]; arr[i] = { ...arr[i], [k]: v }; return { ...p, fares: arr }; });
    const addFare = () => setData(p => ({ ...p, fares: [...p.fares, { ...emptyFare }] }));
    const delFare = (i) => setData(p => ({ ...p, fares: p.fares.filter((_, j) => j !== i) }));

    const inp = "w-full px-1.5 py-[5px] border border-slate-200 rounded text-[10px] outline-none focus:border-blue-400";
    const lbl = "text-[8px] font-semibold text-slate-400 uppercase";
    const secHead = (title, color = "#059669") => (
        <div className="flex items-center gap-1.5 px-2 py-[5px] border-b" style={{ backgroundColor: `${color}10`, borderColor: `${color}30` }}>
            <span className="text-[9px] font-black uppercase tracking-wider" style={{ color }}>{title}</span>
        </div>
    );

    /* ═══ PREVIEW ═══ */
    if (view === "preview") {
        return (
            <div className={fullscreen ? "fixed inset-0 z-50 bg-slate-900 flex flex-col" : "min-h-screen bg-slate-100 flex flex-col"}>
                <div className={`flex items-center gap-1.5 px-3 py-2 shrink-0 ${fullscreen ? "bg-slate-900 border-b border-slate-700" : "bg-white border-b border-slate-200"}`}>
                    <button onClick={() => setView("edit")} className="px-3 py-1.5 rounded-lg border border-slate-300 text-[11px] font-bold text-slate-600 hover:bg-slate-50">← Back</button>
                    <button onClick={save} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-bold disabled:opacity-50"><FiSave size={11} /> {editId ? "Update" : "Save"}</button>
                    <button onClick={dlPdf} disabled={generating} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[11px] font-bold disabled:opacity-50"><FiDownload size={11} /> PDF</button>
                    <button onClick={dlImg} disabled={generating} className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-[11px] font-bold disabled:opacity-50"><FiDownload size={11} /> Image</button>
                    <button onClick={() => window.print()} className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded-lg text-[11px] font-bold hover:bg-slate-50"><FiPrinter size={11} /> Print</button>
                    <div className="flex-1" />
                    <button onClick={() => setFullscreen(v => !v)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold ${fullscreen ? "bg-amber-400 text-black" : "bg-slate-800 text-white"}`}>
                        {fullscreen ? <><FiMinimize size={11} /> Exit</> : <><FiMaximize size={11} /> Full</>}
                    </button>
                </div>
                <div className="flex-1 overflow-auto flex justify-center p-4">
                    <div className="shadow-2xl rounded-lg overflow-hidden h-fit"><ETicketPreview data={data} /></div>
                </div>
            </div>
        );
    }

    /* ═══ EDIT (Split) ═══ */
    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center"><LuScanLine size={14} className="text-white" /></div>
                    <div><h1 className="text-[13px] font-black text-slate-800">E-Ticket Scanner</h1><p className="text-[9px] text-slate-400">Upload → Scan → Auto-fill → Download</p></div>
                </div>
                <div className="flex items-center gap-1.5">
                    {scanDone && <button onClick={() => setView("preview")} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700"><FiEye size={10} /> Preview</button>}
                    <button onClick={save} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold disabled:opacity-50">
                        {saving ? <FiLoader size={10} className="animate-spin" /> : <FiSave size={10} />} {editId ? "Update" : "Save"}
                    </button>
                    <Link href="/dashboard/admin/all-documents" className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-slate-50">All</Link>
                    <button onClick={reset} className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-slate-50">Reset</button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* ▌LEFT — Form ▌ */}
                <div className="w-[48%] overflow-y-auto bg-white border-r border-slate-100" style={{ scrollbarWidth: "thin" }}>
                    <div className="p-2 space-y-1.5">

                        {/* Booking */}
                        <div className="rounded-lg border border-slate-100 overflow-hidden">
                            {secHead("Booking Info")}
                            <div className="p-1.5 grid grid-cols-4 gap-1">
                                <div><label className={lbl}>Booking Ref</label><input value={data.bookingRef} onChange={upd("bookingRef")} className={inp} /></div>
                                <div><label className={lbl}>Airline PNR</label><input value={data.airlinePnr} onChange={upd("airlinePnr")} className={inp} /></div>
                                <div><label className={lbl}>Issue Date</label><input value={data.issueDate} onChange={upd("issueDate")} className={inp} /></div>
                                <div><label className={lbl}>Status</label><select value={data.status} onChange={upd("status")} className={inp}><option>Confirmed</option><option>Pending</option><option>Cancelled</option></select></div>
                            </div>
                        </div>

                        {/* Passengers */}
                        <div className="rounded-lg border border-slate-100 overflow-hidden">
                            <div className="flex items-center justify-between px-2 py-[5px] border-b" style={{ backgroundColor: "#2563eb10", borderColor: "#2563eb30" }}>
                                <span className="text-[9px] font-black uppercase tracking-wider text-blue-700">Passengers ({data.passengers.length})</span>
                                <button onClick={addPassenger} className="text-blue-600 hover:text-blue-800"><FiPlus size={12} /></button>
                            </div>
                            <div className="p-1.5 space-y-1.5">
                                {data.passengers.map((px, i) => (
                                    <div key={i} className="bg-slate-50 rounded p-1.5 border border-slate-100 relative">
                                        {data.passengers.length > 1 && <button onClick={() => delPassenger(i)} className="absolute top-1 right-1 text-red-400 hover:text-red-600"><FiTrash2 size={10} /></button>}
                                        <div className="grid grid-cols-3 gap-1">
                                            <div className="col-span-2"><label className={lbl}>Name</label><input value={px.name} onChange={e => updPassenger(i, "name", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Type</label><select value={px.type} onChange={e => updPassenger(i, "type", e.target.value)} className={inp}><option>ADT</option><option>CHD</option><option>INF</option></select></div>
                                            <div><label className={lbl}>Gender</label><select value={px.gender} onChange={e => updPassenger(i, "gender", e.target.value)} className={inp}><option>MALE</option><option>FEMALE</option></select></div>
                                            <div><label className={lbl}>Passport</label><input value={px.passportNo} onChange={e => updPassenger(i, "passportNo", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>E-Ticket</label><input value={px.eTicket} onChange={e => updPassenger(i, "eTicket", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Cabin</label><input value={px.cabin} onChange={e => updPassenger(i, "cabin", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Checked</label><input value={px.checked} onChange={e => updPassenger(i, "checked", e.target.value)} className={inp} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Segments */}
                        <div className="rounded-lg border border-slate-100 overflow-hidden">
                            <div className="flex items-center justify-between px-2 py-[5px] border-b" style={{ backgroundColor: "#ea580c10", borderColor: "#ea580c30" }}>
                                <span className="text-[9px] font-black uppercase tracking-wider text-orange-700">Flight Segments ({data.segments.length})</span>
                                <button onClick={addSegment} className="text-orange-600 hover:text-orange-800"><FiPlus size={12} /></button>
                            </div>
                            <div className="p-1.5 space-y-1.5">
                                {data.segments.map((sg, i) => (
                                    <div key={i} className="bg-orange-50/50 rounded p-1.5 border border-orange-100 relative">
                                        {data.segments.length > 1 && <button onClick={() => delSegment(i)} className="absolute top-1 right-1 text-red-400 hover:text-red-600"><FiTrash2 size={10} /></button>}
                                        <div className="grid grid-cols-4 gap-1">
                                            <div><label className={lbl}>Airline</label><input value={sg.airline} onChange={e => updSegment(i, "airline", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Flight No</label><input value={sg.flightNo} onChange={e => updSegment(i, "flightNo", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>From Code</label><input value={sg.fromCode} onChange={e => updSegment(i, "fromCode", e.target.value)} className={inp} placeholder="DAC" /></div>
                                            <div><label className={lbl}>To Code</label><input value={sg.toCode} onChange={e => updSegment(i, "toCode", e.target.value)} className={inp} placeholder="DXB" /></div>
                                            <div className="col-span-2"><label className={lbl}>From Airport</label><input value={sg.fromAirport} onChange={e => updSegment(i, "fromAirport", e.target.value)} className={inp} /></div>
                                            <div className="col-span-2"><label className={lbl}>To Airport</label><input value={sg.toAirport} onChange={e => updSegment(i, "toAirport", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Depart Date</label><input value={sg.departDate} onChange={e => updSegment(i, "departDate", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Depart Time</label><input value={sg.departTime} onChange={e => updSegment(i, "departTime", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Arrive Date</label><input value={sg.arriveDate} onChange={e => updSegment(i, "arriveDate", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Arrive Time</label><input value={sg.arriveTime} onChange={e => updSegment(i, "arriveTime", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Class</label><input value={sg.classInfo} onChange={e => updSegment(i, "classInfo", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Duration</label><input value={sg.duration} onChange={e => updSegment(i, "duration", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Refund</label><input value={sg.refund} onChange={e => updSegment(i, "refund", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Route</label><input value={sg.route} onChange={e => updSegment(i, "route", e.target.value)} className={inp} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Transit */}
                            <div className="p-1.5 border-t border-slate-100">
                                <label className={lbl}>Transit Info</label>
                                <input value={data.transitInfo} onChange={upd("transitInfo")} className={inp} placeholder="e.g. Transit in Dubai (DXB) 4h 15m" />
                            </div>
                        </div>

                        {/* Fares */}
                        <div className="rounded-lg border border-slate-100 overflow-hidden">
                            <div className="flex items-center justify-between px-2 py-[5px] border-b" style={{ backgroundColor: "#059669" + "10", borderColor: "#059669" + "30" }}>
                                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700">Fare Details</span>
                                <button onClick={addFare} className="text-emerald-600 hover:text-emerald-800"><FiPlus size={12} /></button>
                            </div>
                            <div className="p-1.5 space-y-1">
                                {data.fares.map((fr, i) => (
                                    <div key={i} className="bg-emerald-50/50 rounded p-1.5 border border-emerald-100 relative">
                                        {data.fares.length > 1 && <button onClick={() => delFare(i)} className="absolute top-1 right-1 text-red-400 hover:text-red-600"><FiTrash2 size={10} /></button>}
                                        <div className="grid grid-cols-7 gap-1">
                                            <div><label className={lbl}>Type</label><select value={fr.type} onChange={e => updFare(i, "type", e.target.value)} className={inp}><option>ADT</option><option>CHD</option><option>INF</option></select></div>
                                            <div><label className={lbl}>Base</label><input value={fr.baseFare} onChange={e => updFare(i, "baseFare", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Tax</label><input value={fr.tax} onChange={e => updFare(i, "tax", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>AIT</label><input value={fr.ait} onChange={e => updFare(i, "ait", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Gross</label><input value={fr.grossFare} onChange={e => updFare(i, "grossFare", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>PAX</label><input value={fr.pax} onChange={e => updFare(i, "pax", e.target.value)} className={inp} /></div>
                                            <div><label className={lbl}>Total</label><input value={fr.total} onChange={e => updFare(i, "total", e.target.value)} className={inp} /></div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center gap-1 pt-1">
                                    <label className={lbl}>Grand Total</label>
                                    <input value={data.grandTotal} onChange={upd("grandTotal")} className={inp + " flex-1 font-bold"} />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="rounded-lg border border-slate-100 overflow-hidden">
                            {secHead("Travel Notes", "#d97706")}
                            <div className="p-1.5">
                                <textarea value={data.travelNotes} onChange={upd("travelNotes")} rows={3} className={inp + " resize-none"} />
                            </div>
                        </div>

                        {/* Agency */}
                        <div className="rounded-lg border border-slate-100 overflow-hidden">
                            {secHead("Agency", "#6b7280")}
                            <div className="p-1.5 grid grid-cols-2 gap-1">
                                <div className="col-span-2"><label className={lbl}>Name</label><input value={data.agencyName} onChange={upd("agencyName")} className={inp} /></div>
                                <div className="col-span-2"><label className={lbl}>Tagline</label><input value={data.agencyTagline} onChange={upd("agencyTagline")} className={inp} /></div>
                                <div><label className={lbl}>Phone</label><input value={data.agencyPhone} onChange={upd("agencyPhone")} className={inp} /></div>
                                <div><label className={lbl}>Phone 2</label><input value={data.agencyPhone2} onChange={upd("agencyPhone2")} className={inp} /></div>
                                <div><label className={lbl}>Email</label><input value={data.agencyEmail} onChange={upd("agencyEmail")} className={inp} /></div>
                                <div><label className={lbl}>Website</label><input value={data.agencyWebsite} onChange={upd("agencyWebsite")} className={inp} /></div>
                                <div className="col-span-2"><label className={lbl}>Office</label><input value={data.agencyOffice} onChange={upd("agencyOffice")} className={inp} /></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ▌RIGHT — Upload / PDF ▌ */}
                <div className="w-[52%] flex flex-col bg-slate-100">
                    <div className="flex-1 relative overflow-hidden">
                        {!file ? (
                            <div className="h-full flex items-center justify-center p-8" onDrop={e => { e.preventDefault(); pickFile(e.dataTransfer.files?.[0]); }} onDragOver={e => e.preventDefault()}>
                                <div onClick={() => fRef.current?.click()} className="w-full max-w-sm bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:shadow-lg p-10 text-center cursor-pointer transition-all">
                                    <FiUpload size={44} className="mx-auto text-slate-300 mb-3" />
                                    <p className="text-sm font-bold text-slate-600">Click or Drag & Drop</p>
                                    <p className="text-[11px] text-slate-400 mt-1">PDF, JPG, PNG</p>
                                    <input ref={fRef} type="file" accept="image/*,.pdf" onChange={e => pickFile(e.target.files?.[0])} className="hidden" />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-start justify-center p-3 overflow-auto">
                                {imgPrev ? <img src={imgPrev} className="max-w-full rounded-lg shadow-lg" alt="doc" style={{ maxHeight: "calc(100vh - 160px)" }} />
                                    : pdfUrl ? <iframe src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`} className="w-full rounded-lg shadow-lg bg-white" style={{ height: "calc(100vh - 160px)" }} /> : null}
                            </div>
                        )}
                        {/* Scan overlay */}
                        {scanning && file && (
                            <div className="absolute inset-0 pointer-events-none z-10">
                                <div className="absolute inset-0 bg-emerald-500/5" />
                                <div className="absolute left-0 right-0" style={{ height: 3, animation: "scanBeam 2.5s ease-in-out infinite" }}>
                                    <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent" style={{ boxShadow: "0 0 24px 8px rgba(16,185,129,0.25)" }} />
                                </div>
                                <div className="absolute bottom-4 inset-x-0 flex justify-center">
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-black/70 text-white rounded-full text-[11px] font-bold backdrop-blur">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> AI Scanning · {scanPct}%
                                    </div>
                                </div>
                            </div>
                        )}
                        {scanDone && file && !scanning && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-bold shadow-lg">
                                <FiCheck size={12} /> Scan Done
                            </motion.div>
                        )}
                    </div>
                    {/* Bottom */}
                    <div className="bg-white border-t border-slate-200 px-3 py-2 flex items-center gap-2 shrink-0">
                        {file ? (
                            <>
                                <FiCheck size={12} className="text-emerald-500" />
                                <span className="text-[11px] font-semibold text-slate-600 truncate flex-1">{file.name}</span>
                                <button onClick={() => { setFile(null); setImgPrev(null); setPdfUrl(null); }} className="text-slate-400 hover:text-red-500"><FiX size={13} /></button>
                                {!scanning && !scanDone && <button onClick={doScan} className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg text-[11px] font-bold shadow-md"><LuScanLine size={13} /> AI Scan</button>}
                                {scanning && <div className="flex items-center gap-2 text-[11px] text-slate-500"><FiLoader size={12} className="animate-spin" /><div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${scanPct}%` }} /></div></div>}
                                {scanDone && !scanning && <button onClick={() => setView("preview")} className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[11px] font-bold shadow-md"><FiEye size={12} /> Preview</button>}
                                <button onClick={() => fRef.current?.click()} className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-500">Change</button>
                                <input ref={fRef} type="file" accept="image/*,.pdf" onChange={e => pickFile(e.target.files?.[0])} className="hidden" />
                            </>
                        ) : (
                            <p className="flex-1 text-center text-[11px] text-slate-400">← Form পূরণ করুন | Document upload করুন →</p>
                        )}
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `@keyframes scanBeam{0%{top:0}50%{top:calc(100% - 4px)}100%{top:0}}` }} />
        </div>
    );
}
