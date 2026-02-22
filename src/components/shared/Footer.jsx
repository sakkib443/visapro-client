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

const footerLinks = {
    services: [
        { name: "Visa Processing", href: "/visa" },
        { name: "Flight Booking", href: "/flight" },
        { name: "Hotel Reservation", href: "/hotel" },
        { name: "Tour Packages", href: "/tour" },
        { name: "Hajj & Umrah", href: "/hajj-umrah" },
        { name: "Study Abroad", href: "/study-abroad" },
    ],
    visaTypes: [
        { name: "Tourist Visa", href: "/visa/tourist" },
        { name: "Working Visa", href: "/visa/working" },
        { name: "Student Visa", href: "/visa/student" },
        { name: "Business Visa", href: "/visa/business" },
        { name: "Medical Visa", href: "/visa/medical" },
        { name: "Transit Visa", href: "/visa/transit" },
    ],
    quickLinks: [
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "FAQ", href: "/faq" },
    ],
};

const socialLinks = [
    { icon: FaFacebookF, href: "https://facebook.com/visapro", label: "Facebook", color: "#1877F2" },
    { icon: FaTwitter, href: "#", label: "Twitter", color: "#1DA1F2" },
    { icon: FaYoutube, href: "#", label: "YouTube", color: "#FF0000" },
    { icon: FaWhatsapp, href: "https://wa.me/8801712114770", label: "WhatsApp", color: "#25D366" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

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
                            style={{ fontFamily: 'Teko, sans-serif', textTransform: 'uppercase', letterSpacing: '0.02em' }}
                        >
                            Ready to Start Your Journey?
                        </h3>
                        <p className="text-white/80 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Let our experts help you with visa processing, flight booking & more
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href="tel:+8801712114770"
                            className="px-6 py-3.5 bg-white text-[#3590CF] rounded-lg font-semibold text-sm hover:-translate-y-1 transition-all flex items-center gap-2"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            <FiPhone className="w-4 h-4" />
                            Call Now
                        </a>
                        <Link
                            href="/contact"
                            className="px-6 py-3.5 rounded-lg font-semibold text-sm hover:-translate-y-1 transition-all flex items-center gap-2 text-white border border-white/30 hover:bg-white/10"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            Free Consultation
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
                                <span className="text-[8px] font-medium text-white/40 tracking-[0.2em] uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Consultancy & Migration
                                </span>
                            </div>
                        </Link>

                        <p className="text-white/60 text-sm leading-relaxed max-w-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Your trusted partner for visa processing, flight booking, hotel reservation,
                            Hajj & Umrah packages, study abroad, and tour planning in Bangladesh.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <a href="tel:+8801712114770" className="flex items-center gap-3 text-white/70 hover:text-[#EF8C2C] transition-colors text-sm">
                                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <FiPhone className="w-4 h-4 text-[#EF8C2C]" />
                                </div>
                                <div style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <p className="font-semibold text-white/90">017 1211 4770</p>
                                    <p className="text-xs text-white/40">Hotline (9:30 AM - 8:30 PM)</p>
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
                                <span style={{ fontFamily: 'Poppins, sans-serif' }}>25/4, 4th Floor, Panthpath, Dhaka</span>
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
                            style={{ fontFamily: 'Teko, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                            Our Services
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-[#EF8C2C] transition-colors text-sm flex items-center gap-2 group"
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
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
                            style={{ fontFamily: 'Teko, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                            Visa Types
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.visaTypes.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-[#EF8C2C] transition-colors text-sm flex items-center gap-2 group"
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
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
                            style={{ fontFamily: 'Teko, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-[#EF8C2C] transition-colors text-sm flex items-center gap-2 group"
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                    >
                                        <span className="w-0 group-hover:w-2 h-[2px] bg-[#EF8C2C] transition-all overflow-hidden" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Newsletter Mini */}
                        <div className="mt-8">
                            <h5 className="text-sm font-semibold text-white/90 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Newsletter
                            </h5>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#3590CF] transition-colors"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
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
                        <span className="text-xs text-white/40 uppercase tracking-wider font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Accepted Payment Methods
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
                    <p className="text-xs text-white/40" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        © {currentYear} VisaPro Consultancy & Migration. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-white/40" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <Link href="/terms" className="hover:text-[#EF8C2C] transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-[#EF8C2C] transition-colors">Privacy</Link>
                        <Link href="/faq" className="hover:text-[#EF8C2C] transition-colors">FAQ</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
