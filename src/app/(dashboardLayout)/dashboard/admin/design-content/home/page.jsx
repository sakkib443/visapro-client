"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiSave, FiLoader, FiRefreshCw, FiPlus, FiTrash2, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SECTIONS = ["hero", "services", "partners", "consultation", "whyChooseUs"];
const TAB_LABELS = { hero: "Hero", services: "Services", partners: "Partners", consultation: "Consultation", whyChooseUs: "Why Choose Us" };

// ─── Reusable Field Components ───────────────────────────────────────
function Field({ label, value, onChange, placeholder, wide, textarea, help }) {
    const Tag = textarea ? "textarea" : "input";
    return (
        <div className={wide ? "md:col-span-2" : ""}>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
            <Tag
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={textarea ? 3 : undefined}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1D7EDD] focus:ring-2 focus:ring-[#1D7EDD]/10 bg-transparent text-gray-800 placeholder-gray-400 resize-none"
            />
            {help && <p className="text-[10px] text-gray-400 mt-1">{help}</p>}
        </div>
    );
}

function BilingualField({ label, data, onChange, placeholder, textarea }) {
    const d = data || { en: "", bn: "" };
    return (
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label={`${label} (English)`} value={d.en} onChange={(v) => onChange({ ...d, en: v })} placeholder={placeholder} textarea={textarea} />
            <Field label={`${label} (বাংলা)`} value={d.bn} onChange={(v) => onChange({ ...d, bn: v })} placeholder={placeholder} textarea={textarea} />
        </div>
    );
}

function SectionCard({ title, desc, children }) {
    return (
        <section className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
            <h2 className="text-lg font-bold text-gray-900 mb-0.5">{title}</h2>
            {desc && <p className="text-xs text-gray-500 mb-5">{desc}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
        </section>
    );
}

// ─── Hero Editor ─────────────────────────────────────────────────────
function HeroEditor({ data, setData }) {
    const d = data || {};
    const set = (k, v) => setData({ ...d, [k]: v });
    return (
        <>
            <SectionCard title="Hero Text" desc="Badge text and main heading">
                <BilingualField label="Badge Text" data={d.badgeText} onChange={(v) => set("badgeText", v)} placeholder="Open: Sat–Thu..." />
                <BilingualField label="Heading" data={d.heading} onChange={(v) => set("heading", v)} placeholder="YOUR JOURNEY STARTS..." />
            </SectionCard>
            <SectionCard title="CTA Buttons" desc="Call to action buttons on hero">
                <BilingualField label="Button 1 Text" data={d.ctaButton1Text} onChange={(v) => set("ctaButton1Text", v)} placeholder="Contact for booking" />
                <Field label="Button 1 Link" value={d.ctaButton1Link} onChange={(v) => set("ctaButton1Link", v)} placeholder="/contact" />
                <BilingualField label="Button 2 Text" data={d.ctaButton2Text} onChange={(v) => set("ctaButton2Text", v)} placeholder="Ask a question" />
                <Field label="Button 2 Link" value={d.ctaButton2Link} onChange={(v) => set("ctaButton2Link", v)} placeholder="whatsapp" help="Use 'whatsapp' for WhatsApp link or a URL path" />
            </SectionCard>
            <SectionCard title="Background Video" desc="Hero background video URL">
                <Field label="Video URL" value={d.videoUrl} onChange={(v) => set("videoUrl", v)} placeholder="https://res.cloudinary.com/..." wide />
            </SectionCard>
        </>
    );
}

// ─── Services Editor ─────────────────────────────────────────────────
function ServicesEditor({ data, setData }) {
    const d = data || {};
    const items = d.items || [];
    const set = (k, v) => setData({ ...d, [k]: v });
    const setItem = (idx, k, v) => {
        const copy = [...items];
        copy[idx] = { ...copy[idx], [k]: v };
        set("items", copy);
    };
    const addItem = () => {
        set("items", [...items, { title: { en: "", bn: "" }, subtitle: { en: "", bn: "" }, description: { en: "", bn: "" }, icon: "LuTicket", image: "", color: "#1D7EDD", stats: { en: "", bn: "" }, href: "/", order: items.length + 1, isActive: true }]);
    };
    const removeItem = (idx) => set("items", items.filter((_, i) => i !== idx));
    const moveItem = (idx, dir) => {
        const copy = [...items];
        const target = idx + dir;
        if (target < 0 || target >= copy.length) return;
        [copy[idx], copy[target]] = [copy[target], copy[idx]];
        set("items", copy);
    };

    return (
        <>
            <SectionCard title="Section Header" desc="Title and description of services section">
                <BilingualField label="Tag Text" data={d.tagText} onChange={(v) => set("tagText", v)} placeholder="OUR SERVICES" />
                <BilingualField label="Heading" data={d.heading} onChange={(v) => set("heading", v)} placeholder="WHAT WE" />
                <BilingualField label="Heading Highlight" data={d.headingHighlight} onChange={(v) => set("headingHighlight", v)} placeholder="OFFER" />
                <BilingualField label="Description" data={d.description} onChange={(v) => set("description", v)} placeholder="Comprehensive travel..." textarea />
            </SectionCard>

            <section className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Service Items</h2>
                        <p className="text-xs text-gray-500">{items.length} services configured</p>
                    </div>
                    <button type="button" onClick={addItem} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1D7EDD] bg-[#1D7EDD]/10 rounded-lg hover:bg-[#1D7EDD]/20 cursor-pointer">
                        <FiPlus size={14} /> Add Service
                    </button>
                </div>

                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-xl p-5 relative">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-gray-700">#{idx + 1} — {item.title?.en || "New Service"}</span>
                                <div className="flex items-center gap-1">
                                    <button type="button" onClick={() => moveItem(idx, -1)} className="p-1.5 hover:bg-gray-100 rounded cursor-pointer"><FiChevronUp size={14} /></button>
                                    <button type="button" onClick={() => moveItem(idx, 1)} className="p-1.5 hover:bg-gray-100 rounded cursor-pointer"><FiChevronDown size={14} /></button>
                                    <button type="button" onClick={() => removeItem(idx)} className="p-1.5 hover:bg-red-50 text-red-400 rounded cursor-pointer"><FiTrash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <BilingualField label="Title" data={item.title} onChange={(v) => setItem(idx, "title", v)} placeholder="Visa Processing" />
                                <BilingualField label="Subtitle" data={item.subtitle} onChange={(v) => setItem(idx, "subtitle", v)} placeholder="Immigration" />
                                <BilingualField label="Description" data={item.description} onChange={(v) => setItem(idx, "description", v)} textarea />
                                <BilingualField label="Stats Text" data={item.stats} onChange={(v) => setItem(idx, "stats", v)} placeholder="10K+ Processed" />
                                <Field label="Icon Name" value={item.icon} onChange={(v) => setItem(idx, "icon", v)} placeholder="LuTicket" help="React icon name: LuTicket, LuPlane, LuBed, LuMapPin, LuMoon, LuGraduationCap" />
                                <Field label="Color" value={item.color} onChange={(v) => setItem(idx, "color", v)} placeholder="#1D7EDD" />
                                <Field label="Image URL" value={item.image} onChange={(v) => setItem(idx, "image", v)} placeholder="https://..." wide />
                                <Field label="Link" value={item.href} onChange={(v) => setItem(idx, "href", v)} placeholder="/visa" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <SectionCard title="Bottom CTA" desc="Call to action below service cards">
                <BilingualField label="CTA Text" data={d.bottomCTAText} onChange={(v) => set("bottomCTAText", v)} placeholder="View All Services" />
                <Field label="CTA Link" value={d.bottomCTALink} onChange={(v) => set("bottomCTALink", v)} placeholder="/contact" />
            </SectionCard>
        </>
    );
}

// ─── Partners Editor ─────────────────────────────────────────────────
function PartnersEditor({ data, setData }) {
    const d = data || {};
    const items = d.items || [];
    const set = (k, v) => setData({ ...d, [k]: v });
    const setItem = (idx, k, v) => {
        const copy = [...items];
        copy[idx] = { ...copy[idx], [k]: v };
        set("items", copy);
    };
    const addItem = () => set("items", [...items, { name: "", icon: "LuPlane", color: "primary", order: items.length + 1 }]);
    const removeItem = (idx) => set("items", items.filter((_, i) => i !== idx));

    return (
        <section className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Partner Logos</h2>
                    <p className="text-xs text-gray-500">Scrolling partner carousel on homepage</p>
                </div>
                <button type="button" onClick={addItem} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1D7EDD] bg-[#1D7EDD]/10 rounded-lg hover:bg-[#1D7EDD]/20 cursor-pointer">
                    <FiPlus size={14} /> Add Partner
                </button>
            </div>
            <div className="space-y-3">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 border border-gray-100 rounded-lg p-3">
                        <span className="text-xs font-bold text-gray-400 w-6">#{idx + 1}</span>
                        <input value={item.name || ""} onChange={(e) => setItem(idx, "name", e.target.value)} placeholder="Partner Name" className="flex-1 text-sm px-2 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-[#1D7EDD]" />
                        <input value={item.icon || ""} onChange={(e) => setItem(idx, "icon", e.target.value)} placeholder="Icon" className="w-32 text-sm px-2 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-[#1D7EDD]" />
                        <input value={item.color || ""} onChange={(e) => setItem(idx, "color", e.target.value)} placeholder="Color" className="w-24 text-sm px-2 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-[#1D7EDD]" />
                        <button type="button" onClick={() => removeItem(idx)} className="p-1.5 hover:bg-red-50 text-red-400 rounded cursor-pointer"><FiTrash2 size={14} /></button>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ─── Consultation Editor ─────────────────────────────────────────────
function ConsultationEditor({ data, setData }) {
    const d = data || {};
    const set = (k, v) => setData({ ...d, [k]: v });
    return (
        <>
            <SectionCard title="Section Header" desc="Tag, heading, and description">
                <BilingualField label="Tag Text" data={d.tagText} onChange={(v) => set("tagText", v)} placeholder="IMMIGRATION CONSULTING" />
                <BilingualField label="Heading" data={d.heading} onChange={(v) => set("heading", v)} placeholder="EXPERT IMMIGRATION" />
                <BilingualField label="Heading Highlight" data={d.headingHighlight} onChange={(v) => set("headingHighlight", v)} placeholder="CONSULTING" />
                <BilingualField label="Heading End" data={d.headingEnd} onChange={(v) => set("headingEnd", v)} placeholder="SERVICE" />
                <BilingualField label="Description" data={d.description} onChange={(v) => set("description", v)} textarea />
            </SectionCard>
            <SectionCard title="Experience Block" desc="Experience highlight section">
                <BilingualField label="Title" data={d.experienceTitle} onChange={(v) => set("experienceTitle", v)} placeholder="10+ Years Of Experience" />
                <BilingualField label="Description" data={d.experienceDesc} onChange={(v) => set("experienceDesc", v)} textarea />
                <Field label="Experience Image URL" value={d.experienceImage} onChange={(v) => set("experienceImage", v)} placeholder="https://..." wide />
            </SectionCard>
            <SectionCard title="Images & CTA" desc="Main images and call to action">
                <Field label="Main Image 1 (Background)" value={d.mainImage1} onChange={(v) => set("mainImage1", v)} placeholder="/images/img01.png" />
                <Field label="Main Image 2 (Person)" value={d.mainImage2} onChange={(v) => set("mainImage2", v)} placeholder="/images/img02.png" />
                <BilingualField label="CTA Text" data={d.ctaText} onChange={(v) => set("ctaText", v)} placeholder="Explore More" />
                <Field label="CTA Link" value={d.ctaLink} onChange={(v) => set("ctaLink", v)} placeholder="/contact" />
                <Field label="Agent Count" value={d.agentCount} onChange={(v) => set("agentCount", v)} placeholder="200+" />
                <BilingualField label="Agent Label" data={d.agentLabel} onChange={(v) => set("agentLabel", v)} placeholder="Real Agents" />
            </SectionCard>
        </>
    );
}

// ─── Why Choose Us Editor ────────────────────────────────────────────
function WhyChooseEditor({ data, setData }) {
    const d = data || {};
    const cards = d.cards || [];
    const stats = d.stats || [];
    const set = (k, v) => setData({ ...d, [k]: v });
    const setCard = (idx, k, v) => { const c = [...cards]; c[idx] = { ...c[idx], [k]: v }; set("cards", c); };
    const setStat = (idx, k, v) => { const s = [...stats]; s[idx] = { ...s[idx], [k]: v }; set("stats", s); };
    const addCard = () => set("cards", [...cards, { title: { en: "", bn: "" }, description: { en: "", bn: "" }, icon: "🎯", color: "#1D7EDD", order: cards.length + 1 }]);
    const removeCard = (idx) => set("cards", cards.filter((_, i) => i !== idx));
    const addStat = () => set("stats", [...stats, { value: "", label: { en: "", bn: "" }, color: "#1D7EDD", order: stats.length + 1 }]);
    const removeStat = (idx) => set("stats", stats.filter((_, i) => i !== idx));

    return (
        <>
            <SectionCard title="Section Header" desc="Title and description">
                <BilingualField label="Tag Text" data={d.tagText} onChange={(v) => set("tagText", v)} placeholder="WHY VISAPRO" />
                <BilingualField label="Heading" data={d.heading} onChange={(v) => set("heading", v)} placeholder="WHY CHOOSE" />
                <BilingualField label="Heading Highlight" data={d.headingHighlight} onChange={(v) => set("headingHighlight", v)} placeholder="US" />
                <BilingualField label="Description" data={d.description} onChange={(v) => set("description", v)} textarea />
            </SectionCard>

            <section className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
                <div className="flex items-center justify-between mb-5">
                    <div><h2 className="text-lg font-bold text-gray-900">Feature Cards</h2><p className="text-xs text-gray-500">{cards.length} cards</p></div>
                    <button type="button" onClick={addCard} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1D7EDD] bg-[#1D7EDD]/10 rounded-lg hover:bg-[#1D7EDD]/20 cursor-pointer"><FiPlus size={14} /> Add Card</button>
                </div>
                <div className="space-y-4">
                    {cards.map((card, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-gray-700">#{idx + 1} — {card.title?.en || "New"}</span>
                                <button type="button" onClick={() => removeCard(idx)} className="p-1.5 hover:bg-red-50 text-red-400 rounded cursor-pointer"><FiTrash2 size={14} /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <BilingualField label="Title" data={card.title} onChange={(v) => setCard(idx, "title", v)} />
                                <BilingualField label="Description" data={card.description} onChange={(v) => setCard(idx, "description", v)} textarea />
                                <Field label="Icon (emoji)" value={card.icon} onChange={(v) => setCard(idx, "icon", v)} placeholder="🎯" />
                                <Field label="Color" value={card.color} onChange={(v) => setCard(idx, "color", v)} placeholder="#1D7EDD" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
                <div className="flex items-center justify-between mb-5">
                    <div><h2 className="text-lg font-bold text-gray-900">Stats Bar</h2><p className="text-xs text-gray-500">{stats.length} stats</p></div>
                    <button type="button" onClick={addStat} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1D7EDD] bg-[#1D7EDD]/10 rounded-lg hover:bg-[#1D7EDD]/20 cursor-pointer"><FiPlus size={14} /> Add Stat</button>
                </div>
                <div className="space-y-3">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-wrap items-end gap-3 border border-gray-100 rounded-lg p-3">
                            <Field label="Value" value={stat.value} onChange={(v) => setStat(idx, "value", v)} placeholder="10+" />
                            <BilingualField label="Label" data={stat.label} onChange={(v) => setStat(idx, "label", v)} placeholder="Years Experience" />
                            <Field label="Color" value={stat.color} onChange={(v) => setStat(idx, "color", v)} placeholder="#1D7EDD" />
                            <button type="button" onClick={() => removeStat(idx)} className="p-1.5 hover:bg-red-50 text-red-400 rounded cursor-pointer mb-1"><FiTrash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function HomeContentPage() {
    const token = useSelector(selectToken);
    const [activeTab, setActiveTab] = useState("hero");
    const [allData, setAllData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/home-content`);
            const json = await res.json();
            if (json.success && json.data) {
                const map = {};
                json.data.forEach((doc) => { map[doc.section] = doc.data; });
                setAllData(map);
            }
        } catch (err) { console.error("Fetch error:", err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const currentData = allData[activeTab] || {};
    const setCurrentData = (newData) => setAllData((prev) => ({ ...prev, [activeTab]: newData }));

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/home-content/${activeTab}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(currentData),
            });
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || "Save failed");
            toast.success(`${TAB_LABELS[activeTab]} saved successfully!`);
        } catch (err) { toast.error(err.message || "Save failed"); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="w-8 h-8 text-gray-300 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <span>Design & Content</span><span>/</span>
                        <span className="text-gray-600 font-medium">Home Page</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Home Page Content</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage all homepage sections from here</p>
                </div>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={fetchAll} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <FiRefreshCw /> Refresh
                    </button>
                    <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-[#1D7EDD] hover:bg-[#1565c0] disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors cursor-pointer text-sm">
                        {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
                        {saving ? "Saving..." : `Save ${TAB_LABELS[activeTab]}`}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
                {SECTIONS.map((s) => (
                    <button
                        key={s}
                        onClick={() => setActiveTab(s)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer transition-all ${activeTab === s ? "bg-[#1D7EDD] text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                    >
                        {TAB_LABELS[s]}
                    </button>
                ))}
            </div>

            {/* Editor */}
            {activeTab === "hero" && <HeroEditor data={currentData} setData={setCurrentData} />}
            {activeTab === "services" && <ServicesEditor data={currentData} setData={setCurrentData} />}
            {activeTab === "partners" && <PartnersEditor data={currentData} setData={setCurrentData} />}
            {activeTab === "consultation" && <ConsultationEditor data={currentData} setData={setCurrentData} />}
            {activeTab === "whyChooseUs" && <WhyChooseEditor data={currentData} setData={setCurrentData} />}

            {/* Bottom Save */}
            <div className="flex justify-end mt-6">
                <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-[#1D7EDD] hover:bg-[#1565c0] disabled:bg-gray-300 text-white font-semibold rounded-lg cursor-pointer">
                    {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
                    {saving ? "Saving..." : `Save ${TAB_LABELS[activeTab]}`}
                </button>
            </div>
        </div>
    );
}
