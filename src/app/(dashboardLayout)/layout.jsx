"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiHome,
    FiUsers,
    FiBook,
    FiSettings,
    FiMenu,
    FiX,
    FiChevronDown,
    FiLogOut,
    FiBell,
    FiSearch,
    FiArrowLeft,
    FiPlus,
    FiPackage,
    FiGlobe,
    FiMapPin,
    FiFileText,
    FiMail,
    FiCalendar,
    FiDollarSign,
    FiBarChart2,
    FiImage,
    FiStar,
    FiMessageSquare,
    FiClipboard,
    FiBookOpen,
} from "react-icons/fi";
import { LuPlane, LuGraduationCap, LuHotel, LuShieldCheck } from "react-icons/lu";
import { FaKaaba } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated, selectToken, logout } from "@/redux/features/authSlice";

const menuItems = [
    {
        name: "Dashboard",
        href: "/dashboard/admin",
        icon: FiHome,
    },
    {
        section: "VISA & IMMIGRATION",
    },
    {
        name: "Visa Applications",
        icon: FiFileText,
        children: [
            { name: "All Applications", href: "/dashboard/admin/visa-applications", icon: FiFileText },
            { name: "New Application", href: "/dashboard/admin/visa-applications/create", icon: FiPlus },
            { name: "Processing", href: "/dashboard/admin/visa-applications?status=processing", icon: FiClipboard },
        ],
    },
    {
        name: "Visa Categories",
        icon: FiGlobe,
        children: [
            { name: "All Categories", href: "/dashboard/admin/visa-categories", icon: FiGlobe },
            { name: "Add Category", href: "/dashboard/admin/visa-categories/create", icon: FiPlus },
        ],
    },
    {
        name: "Countries",
        icon: FiGlobe,
        children: [
            { name: "All Countries", href: "/dashboard/admin/countries", icon: FiGlobe },
            { name: "Add Country", href: "/dashboard/admin/countries/create", icon: FiPlus },
        ],
    },
    {
        section: "TRAVEL & TOURS",
    },
    {
        name: "Tour Packages",
        icon: FiMapPin,
        children: [
            { name: "All Packages", href: "/dashboard/admin/tours", icon: FiMapPin },
            { name: "Create Package", href: "/dashboard/admin/tours/create", icon: FiPlus },
        ],
    },
    {
        name: "Hajj & Umrah",
        icon: FaKaaba,
        children: [
            { name: "All Packages", href: "/dashboard/admin/hajj-umrah", icon: FaKaaba },
            { name: "Create Package", href: "/dashboard/admin/hajj-umrah/create", icon: FiPlus },
        ],
    },
    {
        name: "Study Abroad",
        icon: LuGraduationCap,
        children: [
            { name: "All Programs", href: "/dashboard/admin/study-abroad", icon: LuGraduationCap },
            { name: "Add Program", href: "/dashboard/admin/study-abroad/create", icon: FiPlus },
        ],
    },
    {
        section: "MANAGEMENT",
    },
    {
        name: "Clients",
        icon: FiUsers,
        children: [
            { name: "All Clients", href: "/dashboard/admin/users", icon: FiUsers },
            { name: "Add Client", href: "/dashboard/admin/users/create", icon: FiPlus },
        ],
    },
    {
        name: "Bookings",
        href: "/dashboard/admin/bookings",
        icon: FiCalendar,
    },
    {
        name: "Payments",
        href: "/dashboard/admin/payments",
        icon: FiDollarSign,
    },
    {
        section: "CONTENT",
    },
    {
        name: "Blog",
        icon: FiBook,
        children: [
            { name: "All Posts", href: "/dashboard/admin/blog", icon: FiBook },
            { name: "Write Post", href: "/dashboard/admin/blog/create", icon: FiPlus },
        ],
    },
    {
        name: "Gallery",
        href: "/dashboard/admin/gallery",
        icon: FiImage,
    },
    {
        name: "Reviews",
        href: "/dashboard/admin/reviews",
        icon: FiStar,
    },
    {
        section: "COMMUNICATION",
    },
    {
        name: "Messages",
        href: "/dashboard/admin/messages",
        icon: FiMessageSquare,
    },
    {
        name: "Notifications",
        href: "/dashboard/admin/notifications",
        icon: FiBell,
    },
    {
        section: "SETTINGS",
    },
    {
        name: "Reports",
        href: "/dashboard/admin/reports",
        icon: FiBarChart2,
    },
    {
        name: "Settings",
        href: "/dashboard/admin/settings",
        icon: FiSettings,
    },
    {
        name: "Profile",
        href: "/dashboard/admin/profile",
        icon: FiUsers,
    },
];

function SidebarItem({ item, isCollapsed }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const isActive = item.href
        ? pathname === item.href
        : item.children?.some((child) => pathname === child.href);

    useEffect(() => {
        if (item.children && item.children.some(child => pathname === child.href)) {
            setIsOpen(true);
        }
    }, [pathname, item.children]);

    if (item.children) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-[13px] ${isActive
                        ? "bg-[#EF8C2C]/10 text-[#EF8C2C]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <item.icon className={`w-[16px] h-[16px] ${isActive ? "text-[#EF8C2C]" : ""}`} />
                        {!isCollapsed && <span className="font-medium">{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                        <FiChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                    )}
                </button>
                <AnimatePresence>
                    {isOpen && !isCollapsed && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-4 mt-0.5 space-y-0.5 overflow-hidden border-l border-gray-100 dark:border-gray-700/50 pl-3"
                        >
                            {item.children.map((child) => (
                                <Link
                                    key={child.name}
                                    href={child.href}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] transition-colors ${pathname === child.href
                                        ? "bg-[#021E14] text-white font-semibold"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/50"
                                        }`}
                                >
                                    {child.icon && <child.icon className="w-3.5 h-3.5" />}
                                    <span>{child.name}</span>
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <Link
            href={item.href}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[13px] ${isActive
                ? "bg-[#EF8C2C]/10 text-[#EF8C2C]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200"
                }`}
        >
            <item.icon className={`w-[16px] h-[16px] ${isActive ? "text-[#EF8C2C]" : ""}`} />
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
        </Link>
    );
}

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!token || !isAuthenticated) {
            router.replace("/login");
        } else {
            setIsLoading(false);
        }
    }, [token, isAuthenticated, router]);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    if (isLoading && (!token || !isAuthenticated)) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-3 border-[#021E14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">Authenticating...</p>
                </div>
            </div>
        );
    }

    const renderSidebarContent = (isCollapsedMode = false) => (
        <>
            {menuItems.map((item, index) => {
                if (item.section) {
                    if (isCollapsedMode) return <div key={index} className="my-3 border-t border-gray-100 dark:border-gray-700/50" />;
                    return (
                        <p key={index} className="px-3 pt-5 pb-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400/70">
                            {item.section}
                        </p>
                    );
                }
                return <SidebarItem key={item.name} item={item} isCollapsed={isCollapsedMode} />;
            })}
        </>
    );

    return (
        <div className="min-h-screen bg-[#F5F6FA] dark:bg-gray-900">
            {/* Desktop Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${isSidebarOpen ? "w-[260px]" : "w-[70px]"
                    } bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700/50 hidden lg:flex flex-col`}
            >
                {/* Logo */}
                <div className="h-[60px] flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700/50 flex-shrink-0">
                    <Link href="/" className="flex items-center gap-2.5">
                        <img src="/images/logo.png" alt="VisaPro" className={`transition-all duration-300 ${isSidebarOpen ? "w-[110px]" : "w-[40px]"} h-auto object-contain`} />
                    </Link>
                </div>

                {/* Back to Website */}
                <div className="px-3 py-2 border-b border-gray-50 dark:border-gray-700/30 flex-shrink-0">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group text-[12px]"
                    >
                        <FiArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        {isSidebarOpen && <span className="font-medium">Back to Website</span>}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    {renderSidebarContent(!isSidebarOpen)}
                </nav>

                {/* User & Logout */}
                <div className="p-3 border-t border-gray-100 dark:border-gray-700/50 flex-shrink-0">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg bg-[#F8FAFC] dark:bg-gray-700/30">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white" style={{ backgroundColor: '#021E14' }}>
                                {user?.firstName?.[0] || "A"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-semibold text-gray-800 dark:text-white truncate">
                                    {user?.firstName || "Admin"} {user?.lastName || ""}
                                </p>
                                <p className="text-[10px] text-gray-400 capitalize">{user?.role || "admin"}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-[12px] font-medium"
                    >
                        <FiLogOut size={14} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="fixed top-0 left-0 z-50 w-[260px] h-screen bg-white dark:bg-gray-800 lg:hidden flex flex-col"
                        >
                            <div className="h-[60px] flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700/50">
                                <Link href="/" className="flex items-center gap-2.5">
                                    <img src="/images/logo.png" alt="VisaPro" className="w-[110px] h-auto object-contain" />
                                </Link>
                                <button onClick={() => setIsMobileOpen(false)} className="p-1.5 rounded-md hover:bg-gray-100">
                                    <FiX className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                                {renderSidebarContent(false)}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`${isSidebarOpen ? "lg:ml-[260px]" : "lg:ml-[70px]"} transition-all duration-300`}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 h-[60px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-700/50 px-4 lg:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FiMenu className="w-5 h-5 text-gray-500" />
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FiMenu className="w-4.5 h-4.5 text-gray-400" />
                        </button>
                        <div className="relative hidden md:block">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-64 pl-10 pr-4 py-2 rounded-lg bg-[#F5F6FA] dark:bg-gray-700 border border-gray-100 dark:border-gray-600 focus:border-[#021E14] focus:ring-1 focus:ring-[#021E14]/10 text-[13px] text-gray-600 placeholder-gray-400 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <button className="relative p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <FiBell className="w-[18px] h-[18px] text-gray-400" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#EF8C2C] rounded-full" />
                        </button>

                        {/* Visit Site */}
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-100 text-[11px] font-semibold text-gray-500 hover:bg-gray-50 transition-all"
                        >
                            <FiGlobe size={12} />
                            Visit Site
                        </Link>

                        {/* User */}
                        <div className="flex items-center gap-2.5 pl-2 ml-1 border-l border-gray-100 dark:border-gray-700">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: '#021E14' }}>
                                {user?.firstName?.[0] || "A"}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-[12px] font-semibold text-gray-700 dark:text-white">
                                    {user?.firstName || "Admin"}
                                </p>
                                <p className="text-[10px] text-gray-400 capitalize">{user?.role || "admin"}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="min-h-[calc(100vh-60px)]">{children}</main>
            </div>
        </div>
    );
}
