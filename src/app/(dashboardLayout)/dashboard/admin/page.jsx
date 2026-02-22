"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    FiUsers,
    FiDollarSign,
    FiTrendingUp,
    FiTrendingDown,
    FiArrowRight,
    FiRefreshCw,
    FiCheckCircle,
    FiClock,
    FiFileText,
    FiMapPin,
    FiCalendar,
    FiGlobe,
    FiPlus,
    FiEye,
} from "react-icons/fi";
import { LuPlane, LuGraduationCap, LuHotel } from "react-icons/lu";
import { FaKaaba } from "react-icons/fa6";
import { analyticsService } from "@/services/api";

// ==================== ANIMATED COUNTER ====================
const AnimatedCounter = ({ value, duration = 2000, prefix = "", suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const numValue = typeof value === "number" ? value : parseInt(String(value).replace(/[^0-9]/g, "")) || 0;
        const increment = numValue / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numValue) {
                setCount(numValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// ==================== MINI CHART ====================
const MiniChart = ({ data, color = "#EF8C2C" }) => {
    const max = Math.max(...data, 1);
    const points = data.map((v, i) => ({
        x: (i / (data.length - 1)) * 100,
        y: 100 - (v / max) * 80,
    }));

    let path = `M ${points[0]?.x || 0} ${points[0]?.y || 50}`;
    for (let i = 0; i < points.length - 1; i++) {
        const cp1x = points[i].x + (points[i + 1].x - points[i].x) * 0.4;
        const cp2x = points[i + 1].x - (points[i + 1].x - points[i].x) * 0.4;
        path += ` C ${cp1x} ${points[i].y}, ${cp2x} ${points[i + 1].y}, ${points[i + 1].x} ${points[i + 1].y}`;
    }

    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
                <linearGradient id={`chartFill-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`${path} L 100 100 L 0 100 Z`} fill={`url(#chartFill-${color.replace('#', '')})`} />
            <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
};

// ==================== MAIN DASHBOARD ====================
export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [stats, setStats] = useState({
        totalClients: 1250,
        totalApplications: 856,
        totalRevenue: 2450000,
        pendingApplications: 42,
        approvedVisas: 720,
        rejectedVisas: 35,
        tourBookings: 234,
        hajjBookings: 89,
        studyAbroadApps: 156,
        airTickets: 432,
        hotelBookings: 198,
        monthlyRevenue: 345000,
    });

    const [recentApplications, setRecentApplications] = useState([
        { id: "VA-2024-001", name: "Mohammad Sakib", type: "Tourist Visa", country: "🇬🇧 UK", status: "processing", date: "Feb 20, 2025" },
        { id: "VA-2024-002", name: "Fatima Rahman", type: "Student Visa", country: "🇨🇦 Canada", status: "approved", date: "Feb 19, 2025" },
        { id: "VA-2024-003", name: "Ahmed Hasan", type: "Work Visa", country: "🇦🇺 Australia", status: "pending", date: "Feb 18, 2025" },
        { id: "VA-2024-004", name: "Nusrat Jahan", type: "Visit Visa", country: "🇺🇸 USA", status: "approved", date: "Feb 17, 2025" },
        { id: "VA-2024-005", name: "Kamal Uddin", type: "Tourist Visa", country: "🇲🇾 Malaysia", status: "rejected", date: "Feb 16, 2025" },
        { id: "VA-2024-006", name: "Rina Akter", type: "Student Visa", country: "🇩🇪 Germany", status: "processing", date: "Feb 15, 2025" },
    ]);

    const [upcomingTours, setUpcomingTours] = useState([
        { name: "Cox's Bazar Premium", date: "Mar 5, 2025", travelers: 24, revenue: 120000 },
        { name: "Sundarban Adventure", date: "Mar 12, 2025", travelers: 16, revenue: 96000 },
        { name: "Umrah March Group", date: "Mar 20, 2025", travelers: 40, revenue: 2000000 },
        { name: "Thailand Package", date: "Apr 1, 2025", travelers: 12, revenue: 360000 },
    ]);

    const fetchDashboardData = async () => {
        setRefreshing(true);
        try {
            const response = await analyticsService.getDashboard();
            if (response.success && response.data) {
                setStats(prev => ({ ...prev, ...response.data }));
            }
        } catch (error) {
            console.log("Using demo data");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const mainCards = [
        {
            title: "Total Clients",
            value: stats.totalClients,
            change: "+12.5%",
            trend: "up",
            icon: FiUsers,
            color: "#021E14",
            chartData: [30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 85],
        },
        {
            title: "Visa Applications",
            value: stats.totalApplications,
            change: "+8.3%",
            trend: "up",
            icon: FiFileText,
            color: "#EF8C2C",
            chartData: [20, 35, 25, 45, 30, 50, 55, 60, 45, 65, 70, 80],
        },
        {
            title: "Total Revenue",
            value: stats.totalRevenue,
            change: "+24.1%",
            trend: "up",
            icon: FiDollarSign,
            color: "#10B981",
            prefix: "৳",
            chartData: [40, 55, 45, 65, 50, 70, 60, 75, 85, 80, 90, 95],
        },
        {
            title: "Pending Cases",
            value: stats.pendingApplications,
            change: "-5.2%",
            trend: "down",
            icon: FiClock,
            color: "#F59E0B",
            chartData: [60, 55, 50, 45, 50, 40, 45, 38, 42, 35, 40, 30],
        },
    ];

    const serviceCards = [
        { name: "Tour Packages", value: stats.tourBookings, icon: FiMapPin, color: "#3B82F6", href: "/dashboard/admin/tours" },
        { name: "Hajj & Umrah", value: stats.hajjBookings, icon: FaKaaba, color: "#8B5CF6", href: "/dashboard/admin/hajj-umrah" },
        { name: "Study Abroad", value: stats.studyAbroadApps, icon: LuGraduationCap, color: "#EC4899", href: "/dashboard/admin/study-abroad" },
        { name: "Air Tickets", value: stats.airTickets, icon: LuPlane, color: "#14B8A6", href: "/dashboard/admin/air-tickets" },
        { name: "Hotel Bookings", value: stats.hotelBookings, icon: LuHotel, color: "#F97316", href: "/dashboard/admin/hotel-bookings" },
        { name: "Approved Visas", value: stats.approvedVisas, icon: FiCheckCircle, color: "#10B981", href: "/dashboard/admin/visa-applications?status=approved" },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "approved": return "bg-emerald-50 text-emerald-600 border border-emerald-100";
            case "processing": return "bg-blue-50 text-blue-600 border border-blue-100";
            case "pending": return "bg-amber-50 text-amber-600 border border-amber-100";
            case "rejected": return "bg-red-50 text-red-500 border border-red-100";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    const quickActions = [
        { name: "New Visa Application", href: "/dashboard/admin/visa-applications/create", icon: FiPlus, color: "#021E14" },
        { name: "Create Tour Package", href: "/dashboard/admin/tours/create", icon: FiMapPin, color: "#3B82F6" },
        { name: "Add Hajj Package", href: "/dashboard/admin/hajj-umrah/create", icon: FaKaaba, color: "#8B5CF6" },
        { name: "New Client", href: "/dashboard/admin/users/create", icon: FiUsers, color: "#EF8C2C" },
    ];

    return (
        <div className="p-4 lg:p-6 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: 'Teko, sans-serif', color: '#021E14' }}>
                        Dashboard Overview
                    </h1>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchDashboardData}
                        disabled={refreshing}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50 transition-all"
                    >
                        <FiRefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
                        {refreshing ? "Syncing..." : "Refresh"}
                    </button>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mainCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{card.title}</p>
                                <p className="text-2xl font-semibold text-gray-800 dark:text-white mt-1">
                                    {loading ? (
                                        <span className="inline-block w-20 h-7 bg-gray-100 rounded animate-pulse" />
                                    ) : (
                                        <AnimatedCounter value={card.value} prefix={card.prefix || ""} />
                                    )}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}10` }}>
                                <card.icon size={18} style={{ color: card.color }} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className={`flex items-center gap-1 text-[11px] font-semibold ${card.trend === "up" ? "text-emerald-500" : "text-amber-500"}`}>
                                {card.trend === "up" ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                                {card.change}
                                <span className="text-gray-400 font-normal ml-1">vs last month</span>
                            </div>
                        </div>
                        <div className="h-10 mt-2">
                            <MiniChart data={card.chartData} color={card.color} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Service Stats */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
            >
                {serviceCards.map((card) => (
                    <Link
                        key={card.name}
                        href={card.href}
                        className="group bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all text-center"
                    >
                        <div
                            className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: `${card.color}10` }}
                        >
                            <card.icon size={18} style={{ color: card.color }} />
                        </div>
                        <p className="text-xl font-semibold text-gray-800 dark:text-white">
                            {loading ? "..." : card.value}
                        </p>
                        <p className="text-[10px] font-medium text-gray-400 mt-0.5">{card.name}</p>
                    </Link>
                ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
                {quickActions.map((action) => (
                    <Link
                        key={action.name}
                        href={action.href}
                        className="group flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-3.5 border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all"
                    >
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: `${action.color}10` }}
                        >
                            <action.icon size={15} style={{ color: action.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-200 truncate">{action.name}</p>
                            <p className="text-[10px] text-gray-400">Quick action</p>
                        </div>
                        <FiArrowRight size={13} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                ))}
            </motion.div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Recent Applications */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50"
                >
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700/50">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Recent Applications</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5">Latest visa processing updates</p>
                        </div>
                        <Link href="/dashboard/admin/visa-applications" className="text-[11px] font-semibold flex items-center gap-1 hover:underline" style={{ color: '#EF8C2C' }}>
                            View All <FiArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50 dark:border-gray-700/50">
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">ID</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Applicant</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Type</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Country</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentApplications.map((app) => (
                                    <tr key={app.id} className="border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                                        <td className="px-4 py-3 text-[11px] font-mono font-semibold text-gray-500">{app.id}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-200">{app.name}</p>
                                            <p className="text-[10px] text-gray-400">{app.date}</p>
                                        </td>
                                        <td className="px-4 py-3 text-[11px] text-gray-500">{app.type}</td>
                                        <td className="px-4 py-3 text-[12px]">{app.country}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors">
                                                <FiEye size={13} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Upcoming Tours */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50"
                >
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700/50">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Upcoming Tours</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5">Scheduled departures</p>
                        </div>
                        <Link href="/dashboard/admin/tours" className="text-[11px] font-semibold flex items-center gap-1 hover:underline" style={{ color: '#EF8C2C' }}>
                            All Tours <FiArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="p-4 space-y-3">
                        {upcomingTours.map((tour, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] dark:bg-gray-700/30 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#021E1408' }}>
                                    <FiMapPin size={16} className="text-[#021E14]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-200 truncate">{tour.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                            <FiCalendar size={9} /> {tour.date}
                                        </span>
                                        <span className="text-[10px] text-gray-400">•</span>
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                            <FiUsers size={9} /> {tour.travelers}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[11px] font-semibold text-emerald-500">৳{(tour.revenue / 1000).toFixed(0)}K</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
