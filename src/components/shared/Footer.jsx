"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FiPhone,
    FiMail,
    FiMapPin,
    FiArrowRight,
    FiSend,
} from "react-icons/fi";
import {
    FaFacebookF,
    FaWhatsapp,
    FaInstagram,
    FaTwitter,
    FaYoutube,
    FaLinkedin,
    FaTiktok,
} from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import {
    useSiteSettings,
    buildWhatsAppUrl,
    buildTelUrl,
    buildMailUrl,
} from "@/context/SiteSettingsContext";

const SOCIAL_META = {
    facebook: { icon: FaFacebookF, label: "Facebook", color: "#1877F2" },
    instagram: { icon: FaInstagram, label: "Instagram", color: "#E4405F" },
    twitter: { icon: FaTwitter, label: "Twitter", color: "#1DA1F2" },
    youtube: { icon: FaYoutube, label: "YouTube", color: "#FF0000" },
    linkedin: { icon: FaLinkedin, label: "LinkedIn", color: "#0A66C2" },
    tiktok: { icon: FaTiktok, label: "TikTok", color: "#000000" },
};

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { t, language } = useLanguage();
    const { settings } = useSiteSettings();
    const bnFont = language === 'bn' ? 'Hind Siliguri, sans-serif' : 'Poppins, sans-serif';
    const headingFont = language === 'bn' ? 'Hind Siliguri, sans-serif' : 'Teko, sans-serif';

    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);

    // Build active social links from settings (only those with a URL set)
    const activeSocial = Object.entries(settings.social || {})
        .filter(([, url]) => url && url.trim())
        .map(([key, url]) => {
            const meta = SOCIAL_META[key];
            if (!meta) return null;
            return { key, url, ...meta };
        })
        .filter(Boolean);

    // Always include WhatsApp at the end if a number is set
    if (settings.whatsappNumber) {
        activeSocial.push({
            key: "whatsapp",
            url: buildWhatsAppUrl(settings.whatsappNumber),
            icon: FaWhatsapp,
            label: "WhatsApp",
            color: "#25D366",
        });
    }

    const handleNewsletter = (e) => {
        e.preventDefault();
        const email = newsletterEmail.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error(language === 'bn' ? 'সঠিক ইমেইল লিখুন' : 'Please enter a valid email');
            return;
        }
        setSubscribing(true);
        // No backend endpoint yet — simulate success for now
        setTimeout(() => {
            toast.success(
                language === 'bn'
                    ? 'ধন্যবাদ! আপনি subscribe করেছেন।'
                    : 'Thank you for subscribing!'
            );
            setNewsletterEmail("");
            setSubscribing(false);
        }, 600);
    };

    const footerLinks = {
        services: [
            { name: t('footerVisaProcessing'), href: "/visa" },
            { name: t('footerHotelReservation'), href: "/hotel" },
            { name: t('footerTourPackages'), href: "/tour" },
            { name: t('footerHajjUmrah'), href: "/hajj-umrah" },
            { name: t('footerStudyAbroad'), href: "/study-abroad" },
        ],
        visaTypes: [
            { name: t('footerTouristVisa'), href: "/visa?category=tourist-visa" },
            { name: t('footerWorkingVisa'), href: "/visa?category=working-visa" },
            { name: t('footerStudentVisa'), href: "/visa?category=student-visa" },
            { name: t('footerBusinessVisa'), href: "/visa?category=business-visa" },
            { name: t('footerMedicalVisa'), href: "/visa?category=medical-visa" },
            { name: t('footerTransitVisa'), href: "/visa?category=transit-visa" },
        ],
        quickLinks: [
            { name: t('aboutUs'), href: "/about" },
            { name: t('footerBlog'), href: "/blog" },
            { name: t('contactUs'), href: "/contact" },
        ],
    };

    return (
        <footer className="bg-[#0f1b2d] text-white overflow-hidden">
            {/* CTA Section */}
            <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3590CF 0%, #2A74A8 100%)" }}>
                <div className="absolute inset-0">
                    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #EF8C2C, transparent 70%)" }} />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #ffffff, transparent 70%)" }} />
                </div>
                <div className="relative max-w-[1400px] mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3
                            className="text-3xl md:text-4xl font-bold text-white mb-2"
                            style={{ fontFamily: headingFont, textTransform: 'uppercase', letterSpacing: '0.02em' }}
                        >
                            {t('readyToStart')}
                        </h3>
                        <p className="text-white/80 text-sm" style={{ fontFamily: bnFont }}>
                            {t('footerCTADesc')}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={buildTelUrl(settings.contactPhone)}
                            className="px-6 py-3.5 bg-white text-[#3590CF] rounded-lg font-semibold text-sm hover:-translate-y-1 transition-all flex items-center gap-2"
                            style={{ fontFamily: bnFont }}
                        >
                            <FiPhone className="w-4 h-4" />
                            {t('callNow')}
                        </a>
                        <Link
                            href="/contact"
                            className="px-6 py-3.5 rounded-lg font-semibold text-sm hover:-translate-y-1 transition-all flex items-center gap-2 text-white border border-white/30 hover:bg-white/10"
                            style={{ fontFamily: bnFont }}
                        >
                            {t('freeConsultation')}
                            <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand & Contact */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center group">
                            <img src="/images/logo.png" alt="VisaPro" className="w-[120px] h-auto object-contain" />
                        </Link>

                        <p className="text-white/60 text-sm leading-relaxed max-w-sm" style={{ fontFamily: bnFont }}>
                            {t('footerBrandDesc')}
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <a href={buildTelUrl(settings.contactPhone)} className="flex items-center gap-3 text-white/70 hover:text-[#EF8C2C] transition-colors text-sm">
                                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <FiPhone className="w-4 h-4 text-[#EF8C2C]" />
                                </div>
                                <div style={{ fontFamily: bnFont }}>
                                    <p className="font-semibold text-white/90">{settings.contactPhone}</p>
                                    <p className="text-xs text-white/40">{t('hotlineTime')}</p>
                                </div>
                            </a>
                            <a href={buildMailUrl(settings.contactEmail)} className="flex items-center gap-3 text-white/70 hover:text-[#EF8C2C] transition-colors text-sm">
                                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <FiMail className="w-4 h-4 text-[#3590CF]" />
                                </div>
                                <span style={{ fontFamily: 'Poppins, sans-serif' }}>{settings.contactEmail}</span>
                            </a>
                            {(settings.address || settings.addressBn) && (
                                <div className="flex items-center gap-3 text-white/70 text-sm">
                                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <FiMapPin className="w-4 h-4 text-[#3590CF]" />
                                    </div>
                                    <span style={{ fontFamily: bnFont }}>
                                        {language === 'bn' && settings.addressBn ? settings.addressBn : settings.address}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Social Links */}
                        {activeSocial.length > 0 && (
                            <div className="flex flex-wrap gap-3 pt-2">
                                {activeSocial.map((social) => (
                                    <a
                                        key={social.key}
                                        href={social.url}
                                        aria-label={social.label}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all hover:-translate-y-1"
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = social.color; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                                    >
                                        <social.icon size={16} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Services */}
                    <div>
                        <h4
                            className="text-lg font-bold mb-6 text-white"
                            style={{ fontFamily: headingFont, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                            {t('ourServices')}
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-[#EF8C2C] transition-colors text-sm flex items-center gap-2 group"
                                        style={{ fontFamily: bnFont }}
                                    >
                                        <span className="w-0 group-hover:w-2 h-[2px] bg-[#EF8C2C] transition-all overflow-hidden" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Visa Types */}
                    <div>
                        <h4
                            className="text-lg font-bold mb-6 text-white"
                            style={{ fontFamily: headingFont, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                            {t('visaTypes')}
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.visaTypes.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-[#EF8C2C] transition-colors text-sm flex items-center gap-2 group"
                                        style={{ fontFamily: bnFont }}
                                    >
                                        <span className="w-0 group-hover:w-2 h-[2px] bg-[#EF8C2C] transition-all overflow-hidden" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4
                            className="text-lg font-bold mb-6 text-white"
                            style={{ fontFamily: headingFont, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                            {t('quickLinks')}
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-[#EF8C2C] transition-colors text-sm flex items-center gap-2 group"
                                        style={{ fontFamily: bnFont }}
                                    >
                                        <span className="w-0 group-hover:w-2 h-[2px] bg-[#EF8C2C] transition-all overflow-hidden" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Newsletter Mini */}
                        <div className="mt-8">
                            <h5 className="text-sm font-semibold text-white/90 mb-3" style={{ fontFamily: bnFont }}>
                                {t('newsletter')}
                            </h5>
                            <form onSubmit={handleNewsletter} className="flex gap-2">
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder={t('yourEmail')}
                                    required
                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#3590CF] transition-colors"
                                    style={{ fontFamily: bnFont }}
                                />
                                <button
                                    type="submit"
                                    disabled={subscribing}
                                    className="px-3 py-2 rounded-lg text-white transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
                                    style={{ backgroundColor: '#EF8C2C' }}
                                    aria-label="Subscribe"
                                >
                                    <FiSend className={`w-4 h-4 ${subscribing ? 'animate-pulse' : ''}`} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="py-6 border-t border-white/10 mb-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-xs text-white/40 uppercase tracking-wider font-semibold" style={{ fontFamily: bnFont }}>
                            {t('acceptedPayment')}
                        </span>
                        <div className="flex items-center gap-4">
                            {["bKash", "Nagad", "Rocket", "Visa", "MasterCard", "Bank Transfer"].map((method) => (
                                <span
                                    key={method}
                                    className="px-3 py-1.5 bg-white/5 rounded text-[10px] font-semibold text-white/50 border border-white/5"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    {method}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/40" style={{ fontFamily: bnFont }}>
                        © {currentYear} VisaPro Consultancy & Migration. {t('allRightsReserved')}
                    </p>
                    <div className="flex items-center gap-6 text-xs text-white/40" style={{ fontFamily: bnFont }}>
                        <Link href="/about" className="hover:text-[#EF8C2C] transition-colors">{t('aboutUs')}</Link>
                        <Link href="/contact" className="hover:text-[#EF8C2C] transition-colors">{t('contactUs')}</Link>
                        <Link href="/blog" className="hover:text-[#EF8C2C] transition-colors">{t('footerBlog')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
