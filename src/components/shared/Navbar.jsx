"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
    FiMenu,
    FiX,
    FiChevronDown,
    FiLogOut,
    FiSettings,
    FiGrid,
    FiMail,
    FiMapPin,
    FiClock,
    FiGlobe,
} from "react-icons/fi";
import {
    selectCurrentUser,
    selectIsAuthenticated,
    logout,
} from "@/redux/features/authSlice";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langRef = useRef(null);
    const { language, setLanguage, t } = useLanguage();

    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const pathname = usePathname();

    const bnFont = language === 'bn' ? 'Hind Siliguri, sans-serif' : 'Poppins, sans-serif';
    const headingFont = language === 'bn' ? 'Hind Siliguri, sans-serif' : 'Teko, sans-serif';

    // Dynamic visa categories from database
    const [visaCategories, setVisaCategories] = useState([]);

    useEffect(() => {
        setMounted(true);

        // Fetch active visa categories from API
        const fetchCategories = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const res = await fetch(`${API_BASE}/api/visa-categories/active`);
                const data = await res.json();
                if (data.success && data.data) {
                    setVisaCategories(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch visa categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Close language dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Default icon map for categories
    const defaultIcons = {
        'tourist': '🌴', 'working': '💼', 'student': '🎓',
        'business': '📊', 'medical': '🏥', 'transit': '✈️',
        'family': '👨‍👩‍👧‍👦', 'immigration': '🏠', 'pilgrimage': '🕌',
    };

    const getCategoryIcon = (cat) => {
        if (cat.icon) return cat.icon;
        const slug = (cat.slug || cat.name || '').toLowerCase();
        for (const [key, icon] of Object.entries(defaultIcons)) {
            if (slug.includes(key)) return icon;
        }
        return '📋';
    };

    const navLinks = [
        { name: t('home'), href: "/" },
        {
            name: t('visa'),
            href: "/visa",
            hasDropdown: true,
            dropdownItems: visaCategories.map(cat => ({
                name: language === 'bn' && cat.nameBn ? cat.nameBn : cat.name,
                href: `/visa?category=${encodeURIComponent(cat.name)}`,
                icon: getCategoryIcon(cat),
            })),
        },
        { name: t('tour'), href: "/tour" },
        { name: t('hajjUmrah'), href: "/hajj-umrah" },
        { name: t('studyAbroad'), href: "/study-abroad" },
        { name: t('blog'), href: "/blog" },
        { name: t('contact'), href: "/contact" },
    ];

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileOpen(false);
    };

    const isActive = (href) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Top Info Bar */}
            <div className="hidden lg:block bg-[#1a1a2e] text-white/80 text-xs">
                <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-10">
                    <div className="flex items-center gap-6">
                        <a href="mailto:support@visapro.com.bd" className="flex items-center gap-1.5 hover:text-[#EF8C2C] transition-colors">
                            <FiMail className="w-3 h-3" />
                            <span style={{ fontFamily: 'Poppins, sans-serif' }}>{t('topEmail')}</span>
                        </a>
                        <span className="flex items-center gap-1.5">
                            <FiMapPin className="w-3 h-3" />
                            <span style={{ fontFamily: bnFont }}>{t('topAddress')}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <FiClock className="w-3 h-3" />
                            <span style={{ fontFamily: bnFont }}>{t('topHours')}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav
                className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                    ? "py-1 bg-white/98 backdrop-blur-xl shadow-lg shadow-black/5"
                    : "py-2 bg-white"
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16 lg:h-[72px]">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
                                style={{ background: "linear-gradient(135deg, #3590CF 0%, #2A74A8 100%)" }}
                            >
                                <span className="text-white font-bold text-xl" style={{ fontFamily: 'Teko, sans-serif' }}>VP</span>
                            </div>
                            <div className="flex flex-col">
                                <span
                                    className="text-2xl font-bold leading-none tracking-wide"
                                    style={{ fontFamily: 'Teko, sans-serif', color: '#3590CF' }}
                                >
                                    VISA<span style={{ color: '#EF8C2C' }}>PRO</span>
                                </span>
                                <span
                                    className="text-[8px] font-medium text-gray-400 tracking-[0.2em] uppercase"
                                    style={{ fontFamily: bnFont }}
                                >
                                    {t('consultancyMigration')}
                                </span>
                            </div>
                        </Link>

                        {/* Center Navigation - Desktop */}
                        <div className="hidden lg:flex items-center gap-0.5">
                            {navLinks.map((link) => (
                                <div
                                    key={link.href}
                                    className="relative"
                                    onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={link.href}
                                        className={`relative flex items-center gap-1 px-3 xl:px-4 py-2 text-[13px] font-semibold tracking-wide transition-colors ${isActive(link.href)
                                            ? "text-[#EF8C2C]"
                                            : "text-gray-700 hover:text-[#3590CF]"
                                            }`}
                                        style={{ fontFamily: bnFont }}
                                    >
                                        {link.name}
                                        {link.hasDropdown && (
                                            <FiChevronDown
                                                className={`w-3.5 h-3.5 transition-transform ${activeDropdown === link.name ? "rotate-180 text-[#EF8C2C]" : "text-gray-400"
                                                    }`}
                                            />
                                        )}
                                        {/* Active Indicator */}
                                        {isActive(link.href) && (
                                            <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#EF8C2C] rounded-full" />
                                        )}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {link.hasDropdown && (
                                        <AnimatePresence>
                                            {activeDropdown === link.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 8 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-0 pt-2 z-50"
                                                >
                                                    <div className="bg-white rounded-xl shadow-2xl shadow-black/10 border border-gray-100 p-2 min-w-[240px]">
                                                        {link.dropdownItems?.map((item) => (
                                                            <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                                            >
                                                                <span className="text-lg">{item.icon}</span>
                                                                <span
                                                                    className="font-medium text-gray-700 text-sm group-hover:text-[#3590CF] transition-colors"
                                                                    style={{ fontFamily: bnFont }}
                                                                >
                                                                    {item.name}
                                                                </span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            {/* Language Switcher */}
                            <div className="relative" ref={langRef}>
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#3590CF]/40 hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700"
                                    style={{ fontFamily: bnFont }}
                                >
                                    <FiGlobe className="w-4 h-4 text-[#3590CF]" />
                                    <span className="hidden sm:inline">{language === 'bn' ? 'বাংলা' : 'EN'}</span>
                                    <FiChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isLangOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl shadow-black/10 border border-gray-100 py-1.5 min-w-[160px] z-[60]"
                                        >
                                            <button
                                                onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${language === 'en' ? 'text-[#3590CF] bg-[#3590CF]/5' : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                style={{ fontFamily: 'Poppins, sans-serif' }}
                                            >
                                                <span className="text-lg">🇬🇧</span>
                                                English
                                                {language === 'en' && <span className="ml-auto text-[#3590CF]">✓</span>}
                                            </button>
                                            <button
                                                onClick={() => { setLanguage('bn'); setIsLangOpen(false); }}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${language === 'bn' ? 'text-[#3590CF] bg-[#3590CF]/5' : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                            >
                                                <span className="text-lg">🇧🇩</span>
                                                বাংলা
                                                {language === 'bn' && <span className="ml-auto text-[#3590CF]">✓</span>}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Auth / Profile */}
                            {mounted && (isAuthenticated && user ? (
                                <div className="relative">
                                    <motion.button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 p-1.5 pr-3 rounded-lg transition-all"
                                        style={{ backgroundColor: '#3590CF' }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                                            {user.avatar ? (
                                                <img src={user.avatar} className="w-full h-full rounded-md object-cover" alt="" />
                                            ) : (
                                                user.firstName?.[0] || "U"
                                            )}
                                        </div>
                                        <span className="hidden md:block text-sm font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            {user.firstName}
                                        </span>
                                        <FiChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </motion.button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                className="absolute right-0 top-full mt-2 w-64 bg-white backdrop-blur-xl rounded-xl shadow-2xl shadow-black/10 border border-gray-100 py-2 overflow-hidden z-[60]"
                                            >
                                                {/* User Info */}
                                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                                    <p className="font-semibold text-gray-900 text-sm">{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                                                </div>

                                                <div className="py-1">
                                                    <DropdownLink
                                                        href="/dashboard/admin"
                                                        icon={FiGrid}
                                                        label={t('dashboard')}
                                                        fontFamily={bnFont}
                                                    />
                                                    <DropdownLink
                                                        href="/dashboard/admin/profile"
                                                        icon={FiSettings}
                                                        label={t('accountSettings')}
                                                        fontFamily={bnFont}
                                                    />
                                                </div>

                                                <div className="pt-1 border-t border-gray-100">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                                                        style={{ fontFamily: bnFont }}
                                                    >
                                                        <FiLogOut className="w-4 h-4" />
                                                        {t('signOut')}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link
                                        href="/login"
                                        className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                        style={{ fontFamily: bnFont }}
                                    >
                                        {t('login')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:-translate-y-0.5"
                                        style={{ fontFamily: bnFont, backgroundColor: '#EF8C2C' }}
                                    >
                                        {t('getStarted')}
                                    </Link>
                                </div>
                            ))}

                            {/* Mobile Menu Toggle */}
                            <motion.button
                                onClick={() => setIsMobileOpen(!isMobileOpen)}
                                className="lg:hidden p-2.5 rounded-lg bg-gray-100 text-gray-700"
                                whileTap={{ scale: 0.95 }}
                            >
                                {isMobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl overflow-hidden"
                        >
                            <div className="px-4 py-6 max-h-[80vh] overflow-y-auto">
                                {/* Nav Links */}
                                <div className="space-y-1 mb-6">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            {link.hasDropdown ? (
                                                <>
                                                    <div className="flex items-center">
                                                        <Link
                                                            href={link.href}
                                                            className={`flex-1 px-4 py-3 text-base font-semibold rounded-l-lg transition-colors ${isActive(link.href)
                                                                ? "text-[#EF8C2C] bg-[#EF8C2C]/5"
                                                                : "text-gray-700 hover:bg-gray-50"
                                                                }`}
                                                            style={{ fontFamily: bnFont }}
                                                            onClick={() => setIsMobileOpen(false)}
                                                        >
                                                            {link.name}
                                                        </Link>
                                                        <button
                                                            onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                                                            className={`px-4 py-3 rounded-r-lg transition-colors ${activeDropdown === link.name
                                                                ? "text-[#EF8C2C] bg-[#EF8C2C]/5"
                                                                : "text-gray-400 hover:bg-gray-50"
                                                                }`}
                                                        >
                                                            <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""}`} />
                                                        </button>
                                                    </div>
                                                    <AnimatePresence>
                                                        {activeDropdown === link.name && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-1 mt-1 mb-2">
                                                                    {link.dropdownItems?.map((item) => (
                                                                        <Link
                                                                            key={item.href}
                                                                            href={item.href}
                                                                            className="block px-3 py-2 text-sm text-gray-500 hover:text-[#3590CF] rounded-lg transition-colors"
                                                                            style={{ fontFamily: bnFont }}
                                                                            onClick={() => setIsMobileOpen(false)}
                                                                        >
                                                                            {item.icon} {item.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            ) : (
                                                <Link
                                                    href={link.href}
                                                    className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${isActive(link.href)
                                                        ? "text-[#EF8C2C] bg-[#EF8C2C]/5"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                    style={{ fontFamily: bnFont }}
                                                    onClick={() => setIsMobileOpen(false)}
                                                >
                                                    {link.name}
                                                </Link>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Mobile Language Switcher */}
                                <div className="p-4 bg-gray-50 rounded-xl mb-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2" style={{ fontFamily: bnFont }}>{t('languageLabel')}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setLanguage('en')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${language === 'en'
                                                ? 'bg-[#3590CF] text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200'
                                                }`}
                                            style={{ fontFamily: 'Poppins, sans-serif' }}
                                        >
                                            <span>🇬🇧</span> English
                                        </button>
                                        <button
                                            onClick={() => setLanguage('bn')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${language === 'bn'
                                                ? 'bg-[#3590CF] text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200'
                                                }`}
                                            style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                        >
                                            <span>🇧🇩</span> বাংলা
                                        </button>
                                    </div>
                                </div>

                                {/* Mobile Auth */}
                                {!isAuthenticated && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/login"
                                            className="py-3 text-center bg-gray-100 text-gray-800 font-semibold rounded-lg"
                                            style={{ fontFamily: bnFont }}
                                            onClick={() => setIsMobileOpen(false)}
                                        >
                                            {t('login')}
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="py-3 text-center text-white font-semibold rounded-lg"
                                            style={{ fontFamily: bnFont, backgroundColor: '#EF8C2C' }}
                                            onClick={() => setIsMobileOpen(false)}
                                        >
                                            {t('register')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}

function DropdownLink({ href, icon: Icon, label, fontFamily }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#3590CF] transition-all"
            style={{ fontFamily: fontFamily || 'Poppins, sans-serif' }}
        >
            <Icon className="w-4 h-4" />
            {label}
        </Link>
    );
}
