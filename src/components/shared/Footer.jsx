"use client";

import Link from "next/link";
import {
    FiPhone,
    FiMail,
    FiMapPin,
    FiClock,
    FiArrowRight,
    FiSend,
} from "react-icons/fi";
import {
    FaFacebookF,
    FaTwitter,
    FaYoutube,
    FaWhatsapp,
} from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

const socialLinks = [
    { icon: FaFacebookF, href: "https://facebook.com/visapro", label: "Facebook", color: "#1877F2" },
    { icon: FaTwitter, href: "#", label: "Twitter", color: "#1DA1F2" },
    { icon: FaYoutube, href: "#", label: "YouTube", color: "#FF0000" },
    { icon: FaWhatsapp, href: "https://wa.me/8801712114770", label: "WhatsApp", color: "#25D366" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { t, language } = useLanguage();
    const bnFont = language === 'bn' ? 'Hind Siliguri, sans-serif' : 'Poppins, sans-serif';
    const headingFont = language === 'bn' ? 'Hind Siliguri, sans-serif' : 'Teko, sans-serif';

    const footerLinks = {
        services: [
            { name: t('footerVisaProcessing'), href: "/visa" },
            { name: t('footerFlightBooking'), href: "/flight" },
            { name: t('footerHotelReservation'), href: "/hotel" },
            { name: t('footerTourPackages'), href: "/tour" },
            { name: t('footerHajjUmrah'), href: "/hajj-umrah" },
            { name: t('footerStudyAbroad'), href: "/study-abroad" },
        ],
        visaTypes: [
            { name: t('footerTouristVisa'), href: "/visa/tourist" },
            { name: t('footerWorkingVisa'), href: "/visa/working" },
            { name: t('footerStudentVisa'), href: "/visa/student" },
            { name: t('footerBusinessVisa'), href: "/visa/business" },
            { name: t('footerMedicalVisa'), href: "/visa/medical" },
            { name: t('footerTransitVisa'), href: "/visa/transit" },
        ],
        quickLinks: [
            { name: t('aboutUs'), href: "/about" },
            { name: t('footerBlog'), href: "/blog" },
            { name: t('contactUs'), href: "/contact" },
            { name: t('privacyPolicy'), href: "/privacy" },
            { name: t('termsOfService'), href: "/terms" },
            { name: t('faq'), href: "/faq" },
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
                            href="tel:+8801712114770"
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
                        <Link href="/" className="flex items-center gap-3 group">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #3590CF 0%, #2A74A8 100%)" }}
                            >
                                <span className="text-white font-bold text-xl" style={{ fontFamily: 'Teko, sans-serif' }}>VP</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold leading-none tracking-wide" style={{ fontFamily: 'Teko, sans-serif' }}>
                                    VISA<span style={{ color: '#EF8C2C' }}>PRO</span>
                                </span>
                                <span className="text-[8px] font-medium text-white/40 tracking-[0.2em] uppercase" style={{ fontFamily: bnFont }}>
                                    {t('consultancyMigration')}
                                </span>
                            </div>
                        </Link>

                        <p className="text-white/60 text-sm leading-relaxed max-w-sm" style={{ fontFamily: bnFont }}>
                            {t('footerBrandDesc')}
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <a href="tel:+8801712114770" className="flex items-center gap-3 text-white/70 hover:text-[#EF8C2C] transition-colors text-sm">
                                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <FiPhone className="w-4 h-4 text-[#EF8C2C]" />
                                </div>
                                <div style={{ fontFamily: bnFont }}>
                                    <p className="font-semibold text-white/90">017 1211 4770</p>
                                    <p className="text-xs text-white/40">{t('hotlineTime')}</p>
                                </div>
                            </a>
                            <a href="mailto:support@visapro.com.bd" className="flex items-center gap-3 text-white/70 hover:text-[#EF8C2C] transition-colors text-sm">
                                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <FiMail className="w-4 h-4 text-[#3590CF]" />
                                </div>
                                <span style={{ fontFamily: 'Poppins, sans-serif' }}>support@visapro.com.bd</span>
                            </a>
                            <div className="flex items-center gap-3 text-white/70 text-sm">
                                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <FiMapPin className="w-4 h-4 text-[#3590CF]" />
                                </div>
                                <span style={{ fontFamily: bnFont }}>
                                    {language === 'bn' ? '২৫/৪, ৪র্থ তলা, পান্থপথ, ঢাকা' : '25/4, 4th Floor, Panthpath, Dhaka'}
                                </span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 pt-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all hover:-translate-y-1"
                                    style={{ '--hover-bg': social.color }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = social.color; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                                >
                                    <social.icon size={16} />
                                </a>
                            ))}
                        </div>
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
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder={t('yourEmail')}
                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#3590CF] transition-colors"
                                    style={{ fontFamily: bnFont }}
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-2 rounded-lg text-white transition-all hover:opacity-90"
                                    style={{ backgroundColor: '#EF8C2C' }}
                                >
                                    <FiSend className="w-4 h-4" />
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
                        <Link href="/terms" className="hover:text-[#EF8C2C] transition-colors">{t('terms')}</Link>
                        <Link href="/privacy" className="hover:text-[#EF8C2C] transition-colors">{t('privacy')}</Link>
                        <Link href="/faq" className="hover:text-[#EF8C2C] transition-colors">{t('faq')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
