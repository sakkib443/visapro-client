"use client";

import { useState, useEffect } from "react";
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
    FiPhone,
    FiMail,
    FiMapPin,
    FiClock,
} from "react-icons/fi";
import {
    selectCurrentUser,
    selectIsAuthenticated,
    logout,
} from "@/redux/features/authSlice";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mounted, setMounted] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
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

    const navLinks = [
        { name: "Home", href: "/" },
        {
            name: "Visa",
            href: "/visa",
            hasDropdown: true,
            dropdownItems: [
                { name: "Tourist Visa", href: "/visa?category=Tourist", icon: "🌴" },
                { name: "Working Visa", href: "/visa?category=Working", icon: "💼" },
                { name: "Student Visa", href: "/visa?category=Student", icon: "🎓" },
                { name: "Business Visa", href: "/visa?category=Business", icon: "📊" },
                { name: "Medical Visa", href: "/visa?category=Medical", icon: "🏥" },
                { name: "Transit Visa", href: "/visa?category=Transit", icon: "✈️" },
            ],
        },
        { name: "Tour", href: "/tour" },
        { name: "Hajj & Umrah", href: "/hajj-umrah" },
        { name: "Study Abroad", href: "/study-abroad" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
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
                        <a href="tel:+8801712114770" className="flex items-center gap-1.5 hover:text-[#EF8C2C] transition-colors">
                            <FiPhone className="w-3 h-3" />
                            <span style={{ fontFamily: 'Poppins, sans-serif' }}>017 1211 4770</span>
                        </a>
                        <a href="mailto:support@visapro.com.bd" className="flex items-center gap-1.5 hover:text-[#EF8C2C] transition-colors">
                            <FiMail className="w-3 h-3" />
                            <span style={{ fontFamily: 'Poppins, sans-serif' }}>support@visapro.com.bd</span>
                        </a>
                        <span className="flex items-center gap-1.5">
                            <FiMapPin className="w-3 h-3" />
                            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Panthpath, Dhaka</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <FiClock className="w-3 h-3" />
                            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Sat - Thu: 9:30 AM - 8:30 PM</span>
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
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    Consultancy & Migration
                                </span>
                            </div>
                        </Link>

                        {/* Center Navigation - Desktop */}
                        <div className="hidden lg:flex items-center gap-0.5">
                            {navLinks.map((link) => (
                                <div
                                    key={link.name}
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
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
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
                                                                    style={{ fontFamily: 'Poppins, sans-serif' }}
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
                            {/* Hotline Button */}
                            <a
                                href="tel:+8801712114770"
                                className="hidden xl:flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#3590CF]/20 hover:border-[#3590CF]/40 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#3590CF]/10 flex items-center justify-center">
                                    <FiPhone className="w-3.5 h-3.5 text-[#3590CF]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        Hotline
                                    </span>
                                    <span className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        017 1211 4770
                                    </span>
                                </div>
                            </a>

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
                                                        label="Dashboard"
                                                    />
                                                    <DropdownLink
                                                        href="/dashboard/admin/profile"
                                                        icon={FiSettings}
                                                        label="Account Settings"
                                                    />
                                                </div>

                                                <div className="pt-1 border-t border-gray-100">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                                                    >
                                                        <FiLogOut className="w-4 h-4" />
                                                        Sign Out
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
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:-translate-y-0.5"
                                        style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#EF8C2C' }}
                                    >
                                        Get Started
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
                                            key={link.name}
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
                                                            style={{ fontFamily: 'Poppins, sans-serif' }}
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
                                                                            style={{ fontFamily: 'Poppins, sans-serif' }}
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
                                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                                    onClick={() => setIsMobileOpen(false)}
                                                >
                                                    {link.name}
                                                </Link>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Mobile Contact */}
                                <div className="p-4 bg-gray-50 rounded-xl mb-4">
                                    <a href="tel:+8801712114770" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                        <FiPhone className="text-[#3590CF]" />
                                        <span style={{ fontFamily: 'Poppins, sans-serif' }}>017 1211 4770</span>
                                    </a>
                                </div>

                                {/* Mobile Auth */}
                                {!isAuthenticated && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/login"
                                            className="py-3 text-center bg-gray-100 text-gray-800 font-semibold rounded-lg"
                                            style={{ fontFamily: 'Poppins, sans-serif' }}
                                            onClick={() => setIsMobileOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="py-3 text-center text-white font-semibold rounded-lg"
                                            style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#EF8C2C' }}
                                            onClick={() => setIsMobileOpen(false)}
                                        >
                                            Register
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

function DropdownLink({ href, icon: Icon, label }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#3590CF] transition-all"
            style={{ fontFamily: 'Poppins, sans-serif' }}
        >
            <Icon className="w-4 h-4" />
            {label}
        </Link>
    );
}
