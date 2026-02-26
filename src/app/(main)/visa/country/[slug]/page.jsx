"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuClock,
    LuMapPin,
    LuShieldCheck,
    LuFileText,
    LuPhone,
    LuMessageCircle,
    LuChevronRight,
    LuChevronDown,
    LuUsers,
    LuBadgeCheck,
    LuStar,
    LuGlobe,
    LuBuilding,
    LuMail,
    LuExternalLink,
    LuDollarSign,
    LuLoader,
    LuArrowRight,
    LuCircleCheck,
    LuCalendar,
    LuInfo,
    LuCircleDot
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import CountryFlag from "@/components/shared/CountryFlag";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CountryDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const isBn = language === 'bn';
    const fontFamily = isBn ? 'Hind Siliguri, sans-serif' : "'Poppins', sans-serif";

    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("info");
    const [openDocIndex, setOpenDocIndex] = useState(null);
    const [expandAll, setExpandAll] = useState(false);
    const [selectedVisaType, setSelectedVisaType] = useState(null);
    const [travelDate, setTravelDate] = useState('');

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/countries/slug/${slug}`);
                const data = await res.json();
                if (data.success && data.data) {
                    setCountry(data.data);
                    if (data.data.visaTypes?.length > 0) {
                        setSelectedVisaType(data.data.visaTypes[0]);
                    }
                } else {
                    setError("Country not found");
                }
            } catch (err) {
                setError("Failed to load country data");
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchCountry();
    }, [slug]);

    // Toggle document expand
    const toggleDoc = (idx) => {
        if (expandAll) {
            setExpandAll(false);
            setOpenDocIndex(idx);
        } else {
            setOpenDocIndex(openDocIndex === idx ? null : idx);
        }
    };

    const toggleExpandAll = () => {
        if (expandAll) {
            setExpandAll(false);
            setOpenDocIndex(null);
        } else {
            setExpandAll(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#1a2e5a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-400 font-medium" style={{ fontFamily }}>
                        {isBn ? 'লোড হচ্ছে...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    if (error || !country) {
        return (
            <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
                <div className="text-center">
                    <LuGlobe size={48} className="text-gray-200 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-300 mb-2" style={{ fontFamily }}>
                        {isBn ? 'দেশটি পাওয়া যায়নি' : 'Country Not Found'}
                    </h1>
                    <Link href="/visa" className="text-sm font-medium text-[#1a2e5a] hover:underline" style={{ fontFamily }}>
                        {isBn ? 'ভিসা পেজে ফিরুন' : '← Back to Visa Page'}
                    </Link>
                </div>
            </div>
        );
    }

    const serviceFee = selectedVisaType?.fee || country.startingPrice || 0;
    const govFee = selectedVisaType?.governmentFee || 0;
    const totalFee = serviceFee + govFee;
    const visaTypeName = selectedVisaType
        ? (isBn && selectedVisaType.nameBn ? selectedVisaType.nameBn : selectedVisaType.name)
        : '';
    const countryName = isBn && country.nameBn ? country.nameBn : country.name;

    return (
        <div className="bg-[#f0f2f5] min-h-screen" style={{ fontFamily }}>

            {/* ===================== HERO SECTION ===================== */}
            <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0c1a3a 0%, #162d5a 50%, #1e3f75 100%)', paddingTop: '40px' }}>
                {/* Decorative wave/circles on right */}
                <svg className="absolute right-0 top-0 h-full w-[50%] opacity-[0.06]" viewBox="0 0 600 400" preserveAspectRatio="none" fill="none">
                    <circle cx="450" cy="200" r="300" stroke="white" strokeWidth="0.8" />
                    <circle cx="450" cy="200" r="220" stroke="white" strokeWidth="0.5" />
                    <circle cx="450" cy="200" r="140" stroke="white" strokeWidth="0.3" />
                    <circle cx="450" cy="200" r="60" stroke="white" strokeWidth="0.3" />
                    <path d="M0 350 Q200 280 400 320 T800 200" stroke="white" strokeWidth="0.5" fill="none" />
                    <path d="M0 380 Q250 300 500 350 T800 220" stroke="white" strokeWidth="0.3" fill="none" />
                </svg>
                {/* Small dots pattern */}
                <div className="absolute right-10 top-10 grid grid-cols-5 gap-2 opacity-[0.08]">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-white rounded-full" />
                    ))}
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-3 pb-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ fontFamily }}>
                        <Link href="/" className="text-white/50 hover:text-white/80 transition-colors">🏠</Link>
                        <LuChevronRight size={10} className="text-white/25" />
                        <Link href="/visa" className="text-white/60 hover:text-white/80 transition-colors font-medium">
                            {isBn ? 'বাংলাদেশ' : 'Bangladesh'}
                        </Link>
                        <LuChevronRight size={10} className="text-white/25" />
                        <span className="text-white/70 font-medium">{countryName}</span>
                        <LuChevronRight size={10} className="text-white/25" />
                        <span className="text-[#f0a030] font-semibold">{isBn ? 'আবেদন' : 'Apply'}</span>
                    </nav>

                    {/* Title */}
                    <h1 className="text-[22px] sm:text-[26px] md:text-[30px] font-bold leading-tight max-w-3xl" style={{ fontFamily, color: '#ffffff' }}>
                        {isBn
                            ? `বাংলাদেশ থেকে ${countryName} ${visaTypeName} ভিসার জন্য অনলাইনে আবেদন করুন`
                            : `Apply online for ${country.name} ${visaTypeName} visa from Bangladesh`
                        }
                    </h1>

                    {/* Tabs */}
                    <div className="flex flex-wrap items-center gap-2.5 mt-6 mb-1">
                        {[
                            { id: "info", icon: LuInfo, label: isBn ? "মৌলিক তথ্য" : "Basic Information", variant: "white" },
                            { id: "embassy", icon: LuBuilding, label: isBn ? "দূতাবাস" : "Embassy Details", variant: "outline" },
                            { id: "appointment", icon: LuCalendar, label: isBn ? "অ্যাপয়েন্টমেন্ট" : "Book an Appointment", variant: "filled" },
                        ].map(tab => {
                            const isActive = activeTab === tab.id;
                            let cls = '';
                            if (isActive) {
                                cls = 'bg-white text-[#1a2e5a] shadow-lg shadow-black/10';
                            } else if (tab.variant === 'filled') {
                                cls = 'bg-[#1a2e5a]/80 text-white border border-white/10 hover:bg-[#1a2e5a]';
                            } else {
                                cls = 'bg-transparent text-white/80 border border-white/15 hover:bg-white/10';
                            }

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-[12px] font-semibold transition-all ${cls}`}
                                    style={{ fontFamily }}
                                >
                                    <tab.icon size={14} className={isActive ? 'text-[#1a2e5a]' : (tab.variant === 'outline' ? 'text-green-400' : '')} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ===================== FILTER BAR ===================== */}
            <div className="bg-[#f0f2f5]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-5 relative z-20">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 px-2 py-2 flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0">
                        {/* Citizen Of */}
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#f8f9fb] border border-gray-100 sm:flex-1">
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-sm shadow-sm">🇧🇩</div>
                            <div className="min-w-0">
                                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-1" style={{ fontFamily }}>
                                    {isBn ? 'নাগরিকত্ব' : 'Citizen Of'}
                                </p>
                                <p className="text-[13px] font-bold text-gray-800 leading-none" style={{ fontFamily }}>
                                    {isBn ? 'বাংলাদেশ' : 'Bangladesh'}
                                </p>
                            </div>
                            <LuChevronDown size={14} className="text-gray-300 ml-auto" />
                        </div>

                        {/* Dashed Connector */}
                        <div className="hidden sm:flex items-center px-2">
                            <div className="w-12 border-t-2 border-dashed border-[#1a2e5a]/20" />
                        </div>

                        {/* Traveling To */}
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#f8f9fb] border border-gray-100 sm:flex-1">
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                                <CountryFlag name={country.name} flag={country.flag} size={24} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-1" style={{ fontFamily }}>
                                    {isBn ? 'গন্তব্য' : 'Traveling To'}
                                </p>
                                <p className="text-[13px] font-bold text-gray-800 leading-none" style={{ fontFamily }}>
                                    {countryName}
                                </p>
                            </div>
                            <LuChevronDown size={14} className="text-gray-300 ml-auto" />
                        </div>

                        {/* Dashed Connector */}
                        <div className="hidden sm:flex items-center px-2">
                            <div className="w-12 border-t-2 border-dashed border-[#1a2e5a]/20" />
                        </div>

                        {/* Visa Category */}
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#f8f9fb] border border-gray-100 sm:flex-1">
                            <div className="w-8 h-8 rounded-full bg-[#1a2e5a]/10 border border-[#1a2e5a]/10 flex items-center justify-center flex-shrink-0">
                                <LuGlobe size={14} className="text-[#1a2e5a]" />
                            </div>
                            <div className="min-w-0 flex-grow">
                                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-1" style={{ fontFamily }}>
                                    {isBn ? 'ভিসার ক্যাটাগরি' : 'Visa Category'}
                                </p>
                                <select
                                    className="w-full text-[13px] font-bold text-gray-800 bg-transparent outline-none cursor-pointer appearance-none leading-none"
                                    style={{ fontFamily }}
                                    value={selectedVisaType?.name || ''}
                                    onChange={(e) => {
                                        const found = country.visaTypes?.find(v => v.name === e.target.value);
                                        if (found) setSelectedVisaType(found);
                                    }}
                                >
                                    {country.visaTypes?.map((vt, i) => (
                                        <option key={i} value={vt.name}>
                                            {isBn && vt.nameBn ? vt.nameBn : vt.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <LuChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===================== MAIN CONTENT ===================== */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-7">

                    {/* ===== LEFT COLUMN ===== */}
                    <div className="flex-grow min-w-0">
                        <AnimatePresence mode="wait">

                            {/* ---- BASIC INFO TAB ---- */}
                            {activeTab === "info" && (
                                <motion.div
                                    key="info"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* Document Requirements Card */}
                                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                        <div className="p-6 pb-4">
                                            {/* Header */}
                                            <h2 className="text-[20px] font-bold text-gray-900 mb-1.5" style={{ fontFamily }}>
                                                {isBn ? 'ডকুমেন্ট ' : 'Document '}
                                                <span className="text-[#1D7EDD]">{isBn ? 'প্রয়োজনীয়তা' : 'Requirement'}</span>
                                            </h2>
                                            <p className="text-[13px] text-gray-400 leading-relaxed max-w-xl" style={{ fontFamily }}>
                                                {isBn
                                                    ? `${countryName} অনলাইন ভিসা আবেদনের সাধারণ রূপরেখা নিচে দেওয়া হলো।`
                                                    : `${country.name} is offering an online application process for ${country.name}. Here is the general outline for the ${country.name} online visa application process.`}
                                            </p>
                                        </div>

                                        {/* Documents List */}
                                        <div className="px-6 pb-4">
                                            {country.documentRequirements?.length > 0 ? (
                                                <>
                                                    {/* Collapse/Expand All */}
                                                    <div className="flex justify-end mb-2">
                                                        <button
                                                            onClick={toggleExpandAll}
                                                            className="text-[12px] font-semibold text-[#1D7EDD] hover:text-[#155faa] transition-colors"
                                                            style={{ fontFamily }}
                                                        >
                                                            {expandAll ? (isBn ? 'সব বন্ধ করুন' : 'Collapse All') : (isBn ? 'সব খুলুন' : 'Expand All')}
                                                        </button>
                                                    </div>

                                                    <div className="space-y-0 border-t border-gray-100">
                                                        {country.documentRequirements.map((doc, idx) => {
                                                            const isOpen = expandAll || openDocIndex === idx;
                                                            return (
                                                                <div key={idx} className="border-b border-gray-50">
                                                                    <button
                                                                        onClick={() => toggleDoc(idx)}
                                                                        className="w-full flex items-center gap-4 py-4 text-left group"
                                                                    >
                                                                        {/* Number Badge */}
                                                                        <div className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400 flex items-center justify-center flex-shrink-0 text-[12px] font-bold group-hover:border-[#1D7EDD] group-hover:text-[#1D7EDD] transition-colors">
                                                                            {idx + 1}
                                                                        </div>
                                                                        {/* Title */}
                                                                        <span className="flex-grow text-[14px] font-semibold text-gray-800 group-hover:text-[#1D7EDD] transition-colors" style={{ fontFamily }}>
                                                                            {isBn && doc.titleBn ? doc.titleBn : doc.title}
                                                                        </span>
                                                                        {/* Arrow */}
                                                                        <LuChevronDown
                                                                            size={18}
                                                                            className={`text-gray-300 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1D7EDD]' : ''}`}
                                                                        />
                                                                    </button>

                                                                    {/* Expanded Content */}
                                                                    <AnimatePresence>
                                                                        {isOpen && doc.description && (
                                                                            <motion.div
                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                                exit={{ height: 0, opacity: 0 }}
                                                                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                                                                className="overflow-hidden"
                                                                            >
                                                                                <div className="pl-12 pb-4 pr-4">
                                                                                    <p className="text-[13px] text-gray-500 leading-relaxed" style={{ fontFamily }}>
                                                                                        {isBn && doc.descriptionBn ? doc.descriptionBn : doc.description}
                                                                                    </p>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <LuFileText size={40} className="text-gray-200 mx-auto mb-3" />
                                                    <p className="text-sm text-gray-400" style={{ fontFamily }}>
                                                        {isBn ? 'ডকুমেন্ট প্রয়োজনীয়তা শীঘ্রই যোগ করা হবে।' : 'Document requirements will be added soon.'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Visa Types */}
                                    {country.visaTypes?.length > 0 && (
                                        <div className="bg-white rounded-xl shadow-sm p-6">
                                            <h2 className="text-[18px] font-bold text-gray-900 mb-4" style={{ fontFamily }}>
                                                {isBn ? 'উপলব্ধ ভিসার ধরন' : 'Available Visa Types'}
                                            </h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {country.visaTypes.map((vt, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setSelectedVisaType(vt)}
                                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedVisaType?.name === vt.name
                                                            ? 'border-[#1a2e5a] bg-[#1a2e5a]/[0.02] shadow-sm'
                                                            : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between mb-2.5">
                                                            <h3 className="text-[13px] font-bold text-gray-800" style={{ fontFamily }}>
                                                                {isBn && vt.nameBn ? vt.nameBn : vt.name}
                                                            </h3>
                                                            {selectedVisaType?.name === vt.name && (
                                                                <LuCircleCheck size={16} className="text-[#1a2e5a] flex-shrink-0 mt-0.5" />
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-[11px]" style={{ fontFamily }}>
                                                            {vt.processingTime && (
                                                                <div>
                                                                    <span className="text-gray-400 block text-[10px]">{isBn ? 'সময়' : 'Processing'}</span>
                                                                    <span className="text-gray-700 font-semibold">{isBn && vt.processingTimeBn ? vt.processingTimeBn : vt.processingTime}</span>
                                                                </div>
                                                            )}
                                                            {vt.duration && (
                                                                <div>
                                                                    <span className="text-gray-400 block text-[10px]">{isBn ? 'মেয়াদ' : 'Duration'}</span>
                                                                    <span className="text-gray-700 font-semibold">{isBn && vt.durationBn ? vt.durationBn : vt.duration}</span>
                                                                </div>
                                                            )}
                                                            {vt.fee > 0 && (
                                                                <div>
                                                                    <span className="text-gray-400 block text-[10px]">{isBn ? 'ফি' : 'Fee'}</span>
                                                                    <span className="text-[#1D7EDD] font-bold">৳{vt.fee?.toLocaleString()}</span>
                                                                </div>
                                                            )}
                                                            {vt.entryType && (
                                                                <div>
                                                                    <span className="text-gray-400 block text-[10px]">{isBn ? 'এন্ট্রি' : 'Entry'}</span>
                                                                    <span className="text-gray-700 font-semibold capitalize">{vt.entryType}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Overview */}
                                    {country.description && (
                                        <div className="bg-white rounded-xl shadow-sm p-6">
                                            <h2 className="text-[18px] font-bold text-gray-900 mb-3" style={{ fontFamily }}>
                                                {isBn ? 'সংক্ষিপ্ত বিবরণ' : 'Overview'}
                                            </h2>
                                            <p className="text-[13px] text-gray-500 leading-[1.8]" style={{ fontFamily }}>
                                                {isBn && country.descriptionBn ? country.descriptionBn : country.description}
                                            </p>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                                                {[
                                                    { label: isBn ? 'রাজধানী' : 'Capital', value: isBn && country.capitalBn ? country.capitalBn : country.capital, icon: '🏛️' },
                                                    { label: isBn ? 'মুদ্রা' : 'Currency', value: country.currency, icon: '💰' },
                                                    { label: isBn ? 'সময়' : 'Timezone', value: country.timezone, icon: '🕐' },
                                                    { label: isBn ? 'আবেদনের ধরন' : 'Submission', value: country.submissionType === 'e-visa' ? 'E-Visa' : country.submissionType === 'in-person' ? 'In-Person' : country.submissionType, icon: '📋' },
                                                ].filter(i => i.value).map((item, i) => (
                                                    <div key={i} className="bg-[#f8f9fb] border border-gray-100 rounded-lg p-3 text-center">
                                                        <span className="text-lg">{item.icon}</span>
                                                        <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wide" style={{ fontFamily }}>{item.label}</p>
                                                        <p className="text-[12px] font-semibold text-gray-700 mt-0.5" style={{ fontFamily }}>{item.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* ---- EMBASSY TAB ---- */}
                            {activeTab === "embassy" && (
                                <motion.div
                                    key="embassy"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h2 className="text-[20px] font-bold text-gray-900 mb-1" style={{ fontFamily }}>
                                            {isBn ? 'দূতাবাসের ' : 'Embassy '}
                                            <span className="text-[#1D7EDD]">{isBn ? 'তথ্য' : 'Details'}</span>
                                        </h2>
                                        <p className="text-[13px] text-gray-400 mb-6" style={{ fontFamily }}>
                                            {isBn
                                                ? `ঢাকায় ${countryName} দূতাবাসের যোগাযোগ তথ্য`
                                                : `Contact information for ${country.name} embassy in Dhaka`}
                                        </p>

                                        {country.embassyInfo ? (
                                            <div className="space-y-3">
                                                {[
                                                    { icon: '🏢', label: isBn ? 'নাম' : 'Embassy Name', value: isBn && country.embassyInfo.nameBn ? country.embassyInfo.nameBn : country.embassyInfo.name },
                                                    { icon: '📍', label: isBn ? 'ঠিকানা' : 'Address', value: isBn && country.embassyInfo.addressBn ? country.embassyInfo.addressBn : country.embassyInfo.address },
                                                    { icon: '📞', label: isBn ? 'ফোন' : 'Phone', value: country.embassyInfo.phone, href: `tel:${country.embassyInfo.phone}` },
                                                    { icon: '📧', label: isBn ? 'ইমেইল' : 'Email', value: country.embassyInfo.email, href: `mailto:${country.embassyInfo.email}` },
                                                    { icon: '🕐', label: isBn ? 'কর্মঘণ্টা' : 'Working Hours', value: isBn && country.embassyInfo.workingHoursBn ? country.embassyInfo.workingHoursBn : country.embassyInfo.workingHours },
                                                    { icon: '🌐', label: isBn ? 'ওয়েবসাইট' : 'Website', value: country.embassyInfo.website, href: country.embassyInfo.website, external: true },
                                                ].filter(i => i.value).map((item, i) => (
                                                    <div key={i} className="flex items-start gap-3.5 p-4 rounded-lg bg-[#f8f9fb] border border-gray-50">
                                                        <span className="text-lg mt-0.5">{item.icon}</span>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5" style={{ fontFamily }}>{item.label}</p>
                                                            {item.href ? (
                                                                <a
                                                                    href={item.href}
                                                                    target={item.external ? "_blank" : undefined}
                                                                    rel={item.external ? "noopener noreferrer" : undefined}
                                                                    className="text-[13px] font-semibold text-[#1D7EDD] hover:underline break-all"
                                                                    style={{ fontFamily }}
                                                                >
                                                                    {item.value}
                                                                </a>
                                                            ) : (
                                                                <p className="text-[13px] font-semibold text-gray-700" style={{ fontFamily }}>{item.value}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}

                                                {country.embassyInfo.mapUrl && (
                                                    <a
                                                        href={country.embassyInfo.mapUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 mt-3 px-5 py-3 bg-[#1a2e5a] text-white rounded-lg text-[12px] font-semibold hover:bg-[#162650] transition-all"
                                                        style={{ fontFamily }}
                                                    >
                                                        <LuMapPin size={13} />
                                                        {isBn ? 'ম্যাপে দেখুন' : 'View on Google Map'}
                                                    </a>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <LuBuilding size={40} className="text-gray-200 mx-auto mb-3" />
                                                <p className="text-sm text-gray-400" style={{ fontFamily }}>
                                                    {isBn ? 'দূতাবাসের তথ্য শীঘ্রই যোগ করা হবে।' : 'Embassy details will be added soon.'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* ---- APPOINTMENT TAB ---- */}
                            {activeTab === "appointment" && (
                                <motion.div
                                    key="appointment"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h2 className="text-[20px] font-bold text-gray-900 mb-1" style={{ fontFamily }}>
                                            {isBn ? 'অ্যাপয়েন্টমেন্ট ' : 'Book an '}
                                            <span className="text-[#1D7EDD]">{isBn ? 'বুক করুন' : 'Appointment'}</span>
                                        </h2>
                                        <p className="text-[13px] text-gray-400 mb-6" style={{ fontFamily }}>
                                            {isBn
                                                ? `${countryName} ভিসার জন্য আমাদের অফিসে অ্যাপয়েন্টমেন্ট বুক করুন।`
                                                : `Schedule an appointment at our office for ${country.name} visa processing.`}
                                        </p>

                                        <div className="bg-gradient-to-br from-[#f8f9fb] to-[#eef1f6] border border-gray-100 rounded-xl p-8 text-center">
                                            <div className="w-16 h-16 rounded-full bg-[#1D7EDD]/10 flex items-center justify-center mx-auto mb-4">
                                                <LuCalendar size={28} className="text-[#1D7EDD]" />
                                            </div>
                                            <h3 className="text-[16px] font-bold text-gray-800 mb-2" style={{ fontFamily }}>
                                                {isBn ? 'অনলাইন বুকিং শীঘ্রই আসছে' : 'Online Booking Coming Soon'}
                                            </h3>
                                            <p className="text-[13px] text-gray-400 max-w-md mx-auto mb-5" style={{ fontFamily }}>
                                                {isBn
                                                    ? 'এই মুহূর্তে আমাদের সাথে ফোনে যোগাযোগ করে অ্যাপয়েন্টমেন্ট নিন।'
                                                    : 'For now, please contact us via phone to schedule your appointment.'}
                                            </p>
                                            <div className="flex flex-wrap justify-center gap-3">
                                                <a
                                                    href="tel:+8801712114770"
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a2e5a] text-white rounded-lg text-[12px] font-semibold hover:bg-[#162650] transition-all shadow-sm"
                                                    style={{ fontFamily }}
                                                >
                                                    <LuPhone size={13} />
                                                    {isBn ? 'কল করুন: 017 1211 4770' : 'Call: 017 1211 4770'}
                                                </a>
                                                <a
                                                    href="https://wa.me/8801712114770"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg text-[12px] font-semibold hover:bg-[#20b858] transition-all shadow-sm"
                                                    style={{ fontFamily }}
                                                >
                                                    <LuMessageCircle size={13} />
                                                    {isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ===== RIGHT SIDEBAR ===== */}
                    <div className="w-full lg:w-[350px] flex-shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-5">

                            {/* ---- PRICING CARD ---- */}
                            <div className="rounded-xl overflow-hidden shadow-lg">
                                {/* Orange Header */}
                                <div
                                    className="px-5 py-5 text-center"
                                    style={{ background: 'linear-gradient(135deg, #f5a623 0%, #e8912a 50%, #d97b1e 100%)' }}
                                >
                                    <p className="text-[12px] font-semibold text-white/90 mb-1" style={{ fontFamily }}>
                                        {visaTypeName || (isBn ? 'ভিসা সেবা' : 'Visa Service')}
                                    </p>
                                    <p className="text-[32px] font-bold text-white leading-none">
                                        ৳ {totalFee > 0 ? totalFee.toLocaleString() : '--'}
                                    </p>
                                </div>

                                {/* Card Body */}
                                <div className="bg-white p-5 space-y-4">
                                    {/* Services Field */}
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5" style={{ fontFamily }}>
                                            * {isBn ? 'সেবাসমূহ' : 'Services'}
                                        </label>
                                        <div className="relative">
                                            <select
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[12px] font-medium text-gray-600 outline-none focus:border-[#1a2e5a] transition-colors appearance-none bg-white pr-8 cursor-pointer"
                                                style={{ fontFamily }}
                                            >
                                                <option>{isBn ? 'ভিসা কনসালটেন্সি - VisaPro' : 'Visa Consultancy - VisaPro'}</option>
                                            </select>
                                            <LuChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Visa Type Field */}
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5" style={{ fontFamily }}>
                                            {isBn ? 'ভিসার ধরন' : 'Visa Type'}
                                        </label>
                                        <div className="relative">
                                            <select
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[12px] font-medium text-gray-700 outline-none focus:border-[#1a2e5a] transition-colors appearance-none bg-white pr-8 cursor-pointer"
                                                style={{ fontFamily }}
                                                value={selectedVisaType?.name || ''}
                                                onChange={(e) => {
                                                    const found = country.visaTypes?.find(v => v.name === e.target.value);
                                                    if (found) setSelectedVisaType(found);
                                                }}
                                            >
                                                <option value="" disabled>{isBn ? 'ভিসার ধরন নির্বাচন করুন' : 'Select Visa Type'}</option>
                                                {country.visaTypes?.map((vt, i) => (
                                                    <option key={i} value={vt.name}>{isBn && vt.nameBn ? vt.nameBn : vt.name}</option>
                                                ))}
                                            </select>
                                            <LuChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Travel Date Field */}
                                    <div>
                                        <label className="text-[10px] font-semibold text-red-400 uppercase tracking-wider block mb-1.5" style={{ fontFamily }}>
                                            * {isBn ? 'ভ্রমণের তারিখ' : 'Travel Date'}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={travelDate}
                                                onChange={(e) => setTravelDate(e.target.value)}
                                                className={`w-full rounded-lg px-3 py-2.5 text-[12px] font-medium text-gray-600 outline-none transition-colors bg-white ${travelDate ? 'border border-gray-200 focus:border-[#1a2e5a]' : 'border-2 border-red-200 focus:border-red-400'}`}
                                                style={{ fontFamily }}
                                                placeholder={isBn ? 'তারিখ নির্বাচন করুন' : 'Select Date'}
                                            />
                                        </div>
                                    </div>

                                    {/* Divider + Fee Breakdown */}
                                    <div className="border-t border-gray-100 pt-3 space-y-2.5">
                                        {serviceFee > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[12px] text-gray-400 flex items-center gap-1.5" style={{ fontFamily }}>
                                                    <span className="w-2 h-2 rounded-sm bg-[#1a2e5a]/70 inline-block" />
                                                    {isBn ? 'সার্ভিস ফি' : 'Service Fee'}
                                                    <LuChevronDown size={10} className="text-gray-300" />
                                                </span>
                                                <span className="text-[12px] font-semibold text-gray-700" style={{ fontFamily }}>
                                                    ৳{serviceFee.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                        {govFee > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[12px] text-gray-400 flex items-center gap-1.5" style={{ fontFamily }}>
                                                    <span className="w-2 h-2 rounded-sm bg-[#e8912a]/70 inline-block" />
                                                    {isBn ? 'এম্বাসি ফি' : 'Embassy Fee'}
                                                </span>
                                                <span className="text-[12px] font-semibold text-gray-700" style={{ fontFamily }}>
                                                    ৳{govFee.toLocaleString()}
                                                </span>
                                            </div>
                                        )}

                                        {/* Grand Total */}
                                        {totalFee > 0 && (
                                            <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                                                <span className="text-[13px] font-bold text-gray-600 flex items-center gap-1.5" style={{ fontFamily }}>
                                                    <span className="text-sm">💰</span>
                                                    {isBn ? 'মোট' : 'Grand Total'}
                                                </span>
                                                <span className="text-[16px] font-bold text-gray-900" style={{ fontFamily }}>
                                                    ৳ {totalFee.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        className="w-full py-3.5 rounded-lg text-[13px] font-bold text-white transition-all duration-200 hover:shadow-lg hover:shadow-[#1a2e5a]/20 active:scale-[0.98] mt-1"
                                        style={{ background: 'linear-gradient(135deg, #1a2e5a 0%, #0c1a3a 100%)', fontFamily }}
                                    >
                                        {isBn ? 'আবেদন শুরু করুন' : 'Start Application'}
                                    </button>
                                </div>
                            </div>

                            {/* ---- WHY CHOOSE US ---- */}
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <h3 className="text-[14px] font-bold text-gray-900 mb-4" style={{ fontFamily }}>
                                    {isBn ? 'কেন VisaPro?' : 'Why VisaPro?'}
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { emoji: '✅', text: isBn ? '98% সাফল্যের হার' : '98% Success Rate' },
                                        { emoji: '👥', text: isBn ? '১০,০০০+ সন্তুষ্ট ক্লায়েন্ট' : '10,000+ Happy Clients' },
                                        { emoji: '🛡️', text: isBn ? '100% তথ্য সুরক্ষিত' : '100% Data Secure' },
                                        { emoji: '⚡', text: isBn ? 'দ্রুত প্রসেসিং' : 'Fast Processing' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2.5">
                                            <span className="text-sm">{item.emoji}</span>
                                            <span className="text-[12px] font-medium text-gray-600" style={{ fontFamily }}>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ---- CONTACT CARD ---- */}
                            <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0c1a3a 0%, #1a2e5a 100%)' }}>
                                <div className="p-5 relative">
                                    {/* Decorative glow */}
                                    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#f5a623] opacity-10 blur-2xl" />

                                    <div className="relative z-10">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5a623] mb-2" style={{ fontFamily }}>
                                            {isBn ? 'সাহায্য দরকার?' : 'Need Help?'}
                                        </p>
                                        <p className="text-[13px] font-semibold text-white mb-1" style={{ fontFamily }}>
                                            {isBn ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get in Touch'}
                                        </p>
                                        <p className="text-[11px] text-white/40 leading-relaxed mb-4" style={{ fontFamily }}>
                                            {isBn ? 'আমাদের ভিসা বিশেষজ্ঞরা সবসময় আপনার পাশে।' : 'Our visa specialists are always here to help.'}
                                        </p>
                                        <div className="space-y-2">
                                            <a
                                                href="tel:+8801712114770"
                                                className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-[11px] font-semibold text-white transition-all hover:opacity-90"
                                                style={{ backgroundColor: '#f5a623', fontFamily }}
                                            >
                                                <LuPhone size={12} />
                                                {isBn ? 'কল করুন' : 'Call Now'}
                                            </a>
                                            <a
                                                href="https://wa.me/8801712114770"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-[11px] font-semibold text-white border border-white/15 transition-all hover:bg-white/5"
                                                style={{ fontFamily }}
                                            >
                                                <LuMessageCircle size={12} />
                                                {isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
