"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    LuMail,
    LuPhone,
    LuMapPin,
    LuClock,
    LuSend,
    LuMessageCircle,
    LuGlobe,
    LuFacebook,
    LuFileCheck,
    LuUsers,
    LuArrowRight,
    LuPlane,
    LuCompass,
    LuLuggage,
    LuMap
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";

import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings, buildWhatsAppUrl } from "@/context/SiteSettingsContext";
import toast from "react-hot-toast";

const contactInfo = [
    {
        icon: LuMail,
        title: "Email Assistance",
        titleBn: "ইমেইল সহায়তা",
        value: "{{contactEmail}}",
        link: "mailto:{{contactEmail}}",
        color: "#3590CF",
        tag: "Inquiry",
        tagBn: "জিজ্ঞাসা"
    },
    {
        icon: LuPhone,
        title: "Hotline Support",
        titleBn: "হটলাইন সাপোর্ট",
        value: "{{contactPhone}}",
        link: "tel:{{contactPhoneTel}}",
        color: "#EF8C2C",
        tag: "{{workingHours}}",
        tagBn: "{{workingHoursBn}}"
    },
    {
        icon: LuMapPin,
        title: "Headquarters",
        titleBn: "প্রধান কার্যালয়",
        value: "{{address}}",
        valueBn: "{{addressBn}}",
        color: "#3590CF",
        tag: "Location",
        tagBn: "অবস্থান"
    },
    {
        icon: LuClock,
        title: "Working Hours",
        titleBn: "সার্ভিস সময়",
        value: "{{workingDays}}",
        valueBn: "{{workingDaysBn}}",
        color: "#EF8C2C",
        tag: "{{workingHours}}",
        tagBn: "{{workingHoursBn}}"
    },
];

export default function ContactPage() {
    const { language } = useLanguage();
    const { settings } = useSiteSettings();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
        visaType: "Tourist Visa"
    });
    const [loading, setLoading] = useState(false);

    // Interpolate contact info placeholders with live settings
    const phoneTel = (settings.contactPhone || "").replace(/[^\d+]/g, "");

    const templateMap = {
        "{{contactEmail}}": settings.contactEmail,
        "{{contactPhone}}": settings.contactPhone,
        "{{address}}": settings.address,
        "{{addressBn}}": settings.addressBn,
        "{{workingDays}}": settings.workingDays,
        "{{workingDaysBn}}": settings.workingDaysBn,
        "{{workingHours}}": settings.workingHours,
        "{{workingHoursBn}}": settings.workingHoursBn,
    };

    const resolve = (val) => templateMap[val] ?? val;

    const interpolated = contactInfo.map((info) => ({
        ...info,
        value: resolve(info.value),
        valueBn: resolve(info.valueBn),
        tag: resolve(info.tag),
        tagBn: resolve(info.tagBn),
        link: info.link === "mailto:{{contactEmail}}" ? `mailto:${settings.contactEmail || ""}`
            : info.link === "tel:{{contactPhoneTel}}" ? `tel:${phoneTel}`
            : info.link,
    }));

    // Dynamic stats from settings
    const stats = [
        { label: "Visa Success", labelBn: "ভিসা সাফল্য", value: settings.visaSuccessRate, icon: LuFileCheck },
        { label: "Countries", labelBn: "দেশসমূহ", value: settings.countriesCount, icon: LuGlobe },
        { label: "Happy Clients", labelBn: "সন্তুষ্ট ক্লায়েন্ট", value: settings.happyClientsCount, icon: LuUsers },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success(language === 'bn' ? 'আবেদনটি জমা হয়েছে!' : 'Visa inquiry submitted successfully!');
        setFormData({ name: "", email: "", subject: "", message: "", visaType: "Tourist Visa" });
        setLoading(false);
    };

    const isBn = language === 'bn';

    return (
        <div className="min-h-screen bg-white selection:bg-primary/20">

            {/* --- TOP SECTION: HEADING & CONTACT CARDS --- */}
            <section className="relative pt-20 pb-12 overflow-hidden bg-gray-50/50">
                {/* Enhanced Backdrop with Animated Travel Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Primary Blurs */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-48 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] -ml-64 -mb-48" />

                    {/* Dot Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                    {/* Floating Travel Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Plane 1 */}
                        <motion.div
                            animate={{
                                x: [0, 40, 0],
                                y: [0, -30, 0],
                                rotate: [0, 5, 0]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[15%] left-[10%] opacity-[0.05] text-gray-900"
                        >
                            <LuPlane size={120} />
                        </motion.div>

                        {/* Globe */}
                        <motion.div
                            animate={{
                                rotate: 360
                            }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            className="absolute top-[40%] right-[15%] opacity-[0.03] text-secondary"
                        >
                            <LuGlobe size={200} />
                        </motion.div>

                        {/* Compass */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, -10, 0]
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[20%] left-[20%] opacity-[0.04] text-primary"
                        >
                            <LuCompass size={100} />
                        </motion.div>

                        {/* Luggage */}
                        <motion.div
                            animate={{
                                y: [0, 20, 0],
                                rotate: [0, 8, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[20%] right-[30%] opacity-[0.03] text-gray-800"
                        >
                            <LuLuggage size={80} />
                        </motion.div>

                        {/* Map */}
                        <motion.div
                            animate={{
                                rotate: [0, 3, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[10%] right-[5%] opacity-[0.04] text-secondary"
                        >
                            <LuMap size={150} />
                        </motion.div>

                        {/* Subtle World Route Lines (Simulated with curved borders) */}
                        <div className="absolute top-[30%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200/20 to-transparent -rotate-12" />
                        <div className="absolute top-[60%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200/10 to-transparent rotate-6" />
                    </div>
                </div>

                <div className="container px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm mb-4"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {isBn ? 'আমরা সাহায্যের জন্য এখানে আছি' : 'WE ARE HERE TO HELP'}
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl md:text-6xl font-bold text-gray-900 leading-[0.9] mb-8 uppercase"
                            style={{ fontFamily: 'Teko, sans-serif' }}
                        >
                            {isBn ? 'আপনার প্রোফাইল' : 'GET YOUR PROFILE'} <br />
                            <span className="text-secondary">{isBn ? 'অ্যাসেসমেন্ট করুন' : 'ASSESSED BY EXPERTS'}</span>
                        </motion.h2>
                    </div>

                    {/* CONTACT CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {interpolated.map((info, index) => (
                            <motion.a
                                key={index}
                                href={info.link || "#"}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 + 0.2 }}
                                className="group p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-secondary/20 transition-all duration-500"
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundColor: `${info.color}10` }}
                                >
                                    <info.icon className="w-5 h-5" style={{ color: info.color }} />
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">{isBn ? info.tagBn : info.tag}</span>
                                    <h3 className="text-xl font-bold text-gray-900 uppercase leading-tight" style={{ fontFamily: 'Teko, sans-serif' }}>
                                        {isBn ? info.titleBn : info.title}
                                    </h3>
                                    <p className="text-[13px] text-gray-600 font-medium group-hover:text-secondary transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {isBn && info.valueBn ? info.valueBn : info.value}
                                    </p>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- MAIN FORM SECTION --- */}
            <section className="py-12 bg-white">
                <div className="container px-6 lg:px-12 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                        {/* THE FORM */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 md:p-10 rounded-xl border border-gray-100 shadow-xl"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 uppercase leading-none mb-3" style={{ fontFamily: 'Teko, sans-serif' }}>
                                    {isBn ? 'ভিসা ইনকোয়ারি' : 'VISA'} <span className="text-secondary">{isBn ? 'ফরম' : 'INQUIRY FORM'}</span>
                                </h2>
                                <p className="text-gray-500 text-[13px] leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    {isBn
                                        ? 'আপনার ভিসা সংক্রান্ত সকল প্রশ্নের উত্তর পেতে ফরমটি পূরণ করুন। আমাদের বিশেষজ্ঞরা প্রোফাইল বিশ্লেষণ করে আপনার সাথে যোগাযোগ করবেন।'
                                        : 'Submit your preliminary details below, and a destination specialist will contact you for a technical assessment of your visa probability.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">{isBn ? 'আপনার নাম' : 'Full Name'}</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-secondary/20 focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-semibold text-gray-900 outline-none"
                                            placeholder={isBn ? "আপনার নাম লিখুন" : "EX: JOHN DOE"}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">{isBn ? 'ইমেইল এড্রেস' : 'Email Address'}</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-secondary/20 focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-semibold text-gray-900 outline-none"
                                            placeholder="MAIL@DOMAIN.COM"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">{isBn ? 'ভিসার ধরণ' : 'Visa Type'}</label>
                                        <select
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-secondary/20 focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-semibold text-gray-900 outline-none appearance-none"
                                            value={formData.visaType}
                                            onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                                        >
                                            <option>{isBn ? 'ট্যুরিস্ট ভিসা' : 'Tourist Visa'}</option>
                                            <option>{isBn ? 'বিজনেস ভিসা' : 'Business Visa'}</option>
                                            <option>{isBn ? 'স্টুডেন্ট ভিসা' : 'Student Visa'}</option>
                                            <option>{isBn ? 'ওয়ার্ক পারমিট' : 'Work Permit'}</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">{isBn ? 'বিষয়' : 'Subject'}</label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-secondary/20 focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-semibold text-gray-900 outline-none"
                                            placeholder={isBn ? "বিষয় লিখুন" : "QUERY SUBJECT"}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">{isBn ? 'বার্তা' : 'Message'}</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-secondary/20 focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-semibold text-gray-900 outline-none resize-none"
                                        placeholder={isBn ? "আপনার বার্তা লিখুন..." : "WRITE YOUR MESSAGE..."}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 hover:bg-secondary text-white rounded-lg font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-md active:scale-[0.98] disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>{isBn ? 'জমা হচ্ছে...' : 'SUBMITTING...'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{isBn ? 'আবেদন পাঠান' : 'SEND INQUIRY'}</span>
                                            <LuSend className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>

                        {/* RIGHT SIDE: INFO & MAP */}
                        <div className="space-y-8">
                            {/* Simple Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold text-gray-900 uppercase" style={{ fontFamily: 'Teko, sans-serif' }}>
                                        {isBn ? 'সরাসরি যোগাযোগ' : 'DIRECT CONNECT'}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {isBn
                                            ? 'যেকোনো জরুরি প্রয়োজনে নীচের হোয়াটসঅ্যাপ অথবা সরাসরি আমাদের অফিসে চলে আসুন।'
                                            : 'For immediate assistance, reach out via WhatsApp or visit our headquarters in Panthpath.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <a href={buildWhatsAppUrl(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 bg-green-50 rounded-2xl border border-green-100/50 hover:bg-green-100 transition-all group">
                                        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-200">
                                            <FaWhatsapp size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest leading-none mb-1">WhatsApp</span>
                                            <span className="text-sm font-bold text-gray-900">{settings.whatsappNumber || settings.contactPhone}</span>
                                        </div>
                                    </a>

                                    <div className="flex items-center gap-4 p-5 bg-secondary/5 rounded-2xl border border-secondary/10 group">
                                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                                            <LuMessageCircle size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest leading-none mb-1">Live Chat</span>
                                            <span className="text-sm font-bold text-gray-900">24/7 Priority</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Map */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative h-[350px] rounded-xl overflow-hidden border border-gray-100 shadow-xl"
                            >
                                <iframe
                                    src={settings.mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    className="grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block leading-tight">{isBn ? 'অফিস লোকেশন' : 'VISIT OFFICE'}</span>
                                    <span className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Teko, sans-serif' }}>{isBn ? settings.mapLabelBn : settings.mapLabel}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="py-10 bg-white border-t border-gray-100">
                <div className="container px-6 lg:px-12 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase mb-1" style={{ fontFamily: 'Teko, sans-serif' }}>
                                {isBn ? 'আপনার গ্লোবাল যাত্রা শুরু করুন' : 'START YOUR GLOBAL JOURNEY'}
                            </h3>
                            <p className="text-gray-500 text-[13px] font-medium">
                                {isBn
                                    ? 'সঠিক গাইডলাইন এবং প্রফেশনাল সাপোর্টের জন্য আমাদের বিশেষজ্ঞরা প্রস্তুত।'
                                    : 'Our destination experts are ready to provide technical guidance.'}
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold text-[9px] uppercase tracking-[0.2em] rounded-full shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                        >
                            <span>{isBn ? 'ফ্রি কনসাল্টেশন বুক করুন' : 'BOOK FREE CONSULTATION'}</span>
                            <LuArrowRight className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    );
}
