"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LuSearch,
    LuCalendar,
    LuClock,
    LuUser,
    LuArrowRight,
    LuTag,
    LuEye,
    LuHeart,
    LuMessageCircle,
    LuChevronDown,
    LuGlobe,
    LuBookOpen,
    LuPenTool,
    LuMap,
    LuCompass,
    LuPlane
} from "react-icons/lu";

import { useLanguage } from "@/context/LanguageContext";

// Blog Categories
const categories = [
    { name: "All", nameBn: "সব" },
    { name: "Visa Guides", nameBn: "ভিসা গাইড" },
    { name: "Updates", nameBn: "আপডেট" },
    { name: "Success Stories", nameBn: "সাফল্যের গল্প" },
    { name: "Travel Tips", nameBn: "ভ্রমণ টিপস" },
    { name: "Immigration", nameBn: "ইমিগ্রেশন" },
];

// Mock blog data
const mockBlogs = [
    {
        _id: "1",
        title: "10 Essential UI/UX Design Principles Every Designer Should Know",
        titleBn: "প্রতিটি ডিজাইনারের জানা উচিত এমন ১০টি অপরিহার্য UI/UX ডিজাইন নীতি",
        slug: "essential-ui-ux-design-principles",
        excerpt: "Learn the fundamental principles that will help you create better user experiences and interfaces.",
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
        category: "Design",
        author: { name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
        createdAt: "2024-01-15",
        readTime: "8 min",
        views: 2340,
        likes: 189,
        comments: 45
    },
    {
        _id: "2",
        title: "Getting Started with React Native in 2024",
        titleBn: "২০২৪ সালে React Native দিয়ে শুরু করা",
        slug: "getting-started-react-native-2024",
        excerpt: "A comprehensive guide to building mobile applications with React Native.",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        category: "Development",
        author: { name: "Mike Chen", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
        createdAt: "2024-01-12",
        readTime: "12 min",
        views: 3456,
        likes: 267,
        comments: 78
    },
    {
        _id: "3",
        title: "How to Build a Successful Online Course Business",
        titleBn: "কীভাবে একটি সফল অনলাইন কোর্স ব্যবসা তৈরি করবেন",
        slug: "build-successful-online-course-business",
        excerpt: "Tips and strategies for creating, marketing, and selling online courses.",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        category: "Business",
        author: { name: "Emily Brown", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
        createdAt: "2024-01-10",
        readTime: "10 min",
        views: 1890,
        likes: 145,
        comments: 32
    },
    {
        _id: "4",
        title: "The Complete Guide to Figma Auto Layout",
        titleBn: "Figma Auto Layout এর সম্পূর্ণ গাইড",
        slug: "complete-guide-figma-auto-layout",
        excerpt: "Master auto layout in Figma to create responsive and flexible designs.",
        thumbnail: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800",
        category: "Tutorials",
        author: { name: "Alex Kim", avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
        createdAt: "2024-01-08",
        readTime: "15 min",
        views: 4567,
        likes: 389,
        comments: 92
    },
];

export default function BlogPage() {
    const { language } = useLanguage();
    const [blogs, setBlogs] = useState(mockBlogs);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    // Filter and sort
    const filteredBlogs = blogs
        .filter(blog => {
            if (selectedCategory !== "All" && blog.category !== selectedCategory) return false;
            if (search && !blog.title?.toLowerCase().includes(search.toLowerCase()) && !blog.titleBn?.includes(search)) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "popular") return (b.views || 0) - (a.views || 0);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    const isBn = language === 'bn';
    const featuredPost = filteredBlogs[0];
    const otherPosts = filteredBlogs.slice(1);

    return (
        <div className="min-h-screen bg-white selection:bg-primary/20">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-20 pb-12 overflow-hidden bg-gray-50/50">
                {/* Immersive Background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-48 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] -ml-64 -mb-48" />
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                    {/* Animated Background Icons */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute top-[10%] right-[10%] opacity-[0.04] text-secondary">
                            <LuGlobe size={150} />
                        </motion.div>
                        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[20%] left-[5%] opacity-[0.05] text-primary">
                            <LuBookOpen size={100} />
                        </motion.div>
                        <motion.div animate={{ rotate: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[30%] left-[15%] opacity-[0.03] text-gray-800">
                            <LuPenTool size={80} />
                        </motion.div>
                    </div>
                </div>

                <div className="container px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm mb-4"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {isBn ? 'ইনসাইটস এবং নলেজ' : 'INSIGHTS & KNOWLEDGE'}
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-6xl font-bold text-gray-900 leading-[0.9] mb-8 uppercase"
                            style={{ fontFamily: 'Teko, sans-serif' }}
                        >
                            {isBn ? 'সর্বশেষ' : 'EXPLORE OUR'} <br />
                            <span className="text-secondary">{isBn ? 'আর্টিকেল এবং আপডেট' : 'LATEST UPDATES'}</span>
                        </motion.h2>

                        {/* Tightly Integrated Search & Filters */}
                        <div className="flex flex-col items-center gap-6 w-full max-w-xl">
                            <div className="relative w-full">
                                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={isBn ? 'আর্টিকেল খুঁজুন...' : 'SEARCH ARTICLES...'}
                                    className="w-full pl-11 pr-6 py-3 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/20 focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-all text-[10px] font-bold uppercase tracking-widest outline-none"
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat.name ? 'bg-secondary text-white shadow-md' : 'bg-white border border-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        {isBn ? cat.nameBn : cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- BLOG GRID --- */}
            <section className="pt-16 pb-12 bg-white">
                <div className="container px-6 lg:px-12 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBlogs.map((blog, index) => (
                            <BlogCard key={blog._id} blog={blog} index={index} isBn={isBn} />
                        ))}
                    </div>

                    {filteredBlogs.length > 0 && (
                        <div className="text-center mt-16">
                            <button className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 hover:bg-secondary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]">
                                {isBn ? 'আরো আর্টিকেল দেখুন' : 'LOAD MORE ARTICLES'} <LuArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="py-12 bg-gray-50/50 border-t border-gray-100">
                <div className="container px-6 lg:px-12 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 uppercase mb-2" style={{ fontFamily: 'Teko, sans-serif' }}>
                                {isBn ? 'ভিসা সংক্রান্ত সহযোগিতা প্রয়োজন?' : 'NEED EXPERT VISA ADVICE?'}
                            </h3>
                            <p className="text-gray-500 text-[13px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {isBn
                                    ? 'আমাদের বিশেষজ্ঞ টিমের সাথে আজই একটি ফ্রি কনসাল্টেশন বুক করুন।'
                                    : 'Schedule a discovery call with our destination experts today.'}
                            </p>
                        </div>
                        <Link href="/contact">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-3 px-10 py-4 bg-primary text-white font-bold text-[9px] uppercase tracking-[0.2em] rounded-full shadow-lg"
                            >
                                <span>{isBn ? 'অ্যাসেসমেন্ট শুরু করুন' : 'START ASSESSMENT'}</span>
                                <LuArrowRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </section>


        </div>
    );
}

function BlogCard({ blog, index, isBn }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white rounded-xl overflow-hidden border border-gray-100/50 hover:border-secondary/20 transition-all duration-500 hover:shadow-xl flex flex-col h-full"
        >
            <Link href={`/blog/${blog.slug}`} className="block relative aspect-video overflow-hidden">
                <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-gray-900 text-[8px] font-bold uppercase tracking-widest rounded-lg shadow-sm">{blog.category}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1.5"><LuCalendar className="w-3.5 h-3.5" />{blog.createdAt}</span>
                    <span className="flex items-center gap-1.5"><LuClock className="w-3.5 h-3.5" />{blog.readTime || '5 MIN'}</span>
                </div>
                <Link href={`/blog/${blog.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight uppercase group-hover:text-secondary transition-colors" style={{ fontFamily: 'Teko, sans-serif' }}>
                        {isBn ? blog.titleBn : blog.title}
                    </h3>
                </Link>
                <p className="text-gray-500 text-[13px] leading-relaxed mb-6 line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {blog.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <img src={blog.author?.avatar} alt="" className="w-8 h-8 rounded-full ring-1 ring-gray-100 shadow-sm" />
                        <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest leading-none">{blog.author?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                        <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest"><LuEye className="w-3.5 h-3.5" />{blog.views}</span>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
