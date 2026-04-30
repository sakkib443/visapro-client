"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LuSearch,
    LuCalendar,
    LuClock,
    LuArrowRight,
    LuGlobe,
    LuBookOpen,
    LuPlane,
    LuEye,
    LuLoader
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogPage() {
    const { language } = useLanguage();
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/api/blogs?status=published&limit=50`);
                const data = await res.json();
                if (data.success && data.data) {
                    setBlogs(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch blogs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const filteredBlogs = blogs
        .filter(blog => {
            if (search && !blog.title?.toLowerCase().includes(search.toLowerCase()) && !blog.titleBn?.includes(search)) return false;
            return true;
        })
        .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));

    const isBn = language === 'bn';
    const featuredPost = filteredBlogs[0];
    const otherPosts = filteredBlogs.slice(1);

    return (
        <div className="min-h-screen bg-white">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-8 pb-10 overflow-hidden bg-[#f8fafb]">
                {/* Background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3590CF]/5 rounded-full blur-[120px] -mr-64 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#EF8C2C]/5 rounded-full blur-[100px] -ml-48 -mb-32" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm mb-5"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF8C2C] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF8C2C]"></span>
                            </span>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {isBn ? 'ভিসা ও ইমিগ্রেশন ব্লগ' : 'VISA & IMMIGRATION BLOG'}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-6xl font-bold text-gray-900 leading-[0.9] mb-8 uppercase"
                            style={{ fontFamily: 'Teko, sans-serif' }}
                        >
                            {isBn ? 'গাইড, টিপস এবং' : 'GUIDES, TIPS &'} <br />
                            <span style={{ color: '#EF8C2C' }}>{isBn ? 'সর্বশেষ আপডেট' : 'LATEST UPDATES'}</span>
                        </motion.h1>

                        {/* Search */}
                        <div className="flex flex-col items-center gap-5 w-full max-w-xl">
                            <div className="relative w-full">
                                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={isBn ? 'আর্টিকেল খুঁজুন...' : 'Search articles...'}
                                    className="w-full pl-11 pr-6 py-3.5 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/20 focus:outline-none focus:ring-2 focus:ring-[#EF8C2C]/20 focus:border-[#EF8C2C]/30 transition-all text-sm text-gray-700 outline-none"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-20">
                    <LuLoader className="w-8 h-8 text-[#EF8C2C] animate-spin" />
                </div>
            )}

            {/* --- FEATURED POST --- */}
            {!loading && featuredPost && (
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <Link href={`/blog/${featuredPost.slug}`} className="group block">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#f8fafb] rounded-2xl overflow-hidden border border-gray-100 hover:border-[#EF8C2C]/20 hover:shadow-xl transition-all duration-500"
                            >
                                <div className="aspect-[16/10] lg:aspect-auto lg:h-full overflow-hidden">
                                    <img
                                        src={featuredPost.thumbnail}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-8 lg:p-12">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF8C2C]/10 text-[#EF8C2C] mb-4">
                                        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            {isBn ? 'ফিচার্ড' : 'FEATURED'}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight uppercase group-hover:text-[#EF8C2C] transition-colors" style={{ fontFamily: 'Teko, sans-serif' }}>
                                        {isBn ? featuredPost.titleBn || featuredPost.title : featuredPost.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {isBn ? featuredPost.excerptBn || featuredPost.excerpt : featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        <span className="flex items-center gap-1.5"><LuCalendar className="w-3.5 h-3.5" />{new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1.5"><LuClock className="w-3.5 h-3.5" />{featuredPost.readingTime || 5} min</span>
                                        <span className="flex items-center gap-1.5"><LuEye className="w-3.5 h-3.5" />{featuredPost.totalViews?.toLocaleString() || 0}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </section>
            )}

            {/* --- BLOG GRID --- */}
            {!loading && (
                <section className="pb-16 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        {otherPosts.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {otherPosts.map((blog, index) => (
                                    <BlogCard key={blog._id} blog={blog} index={index} isBn={isBn} />
                                ))}
                            </div>
                        )}

                        {filteredBlogs.length === 0 && (
                            <div className="text-center py-20">
                                <LuSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400 uppercase" style={{ fontFamily: 'Teko, sans-serif' }}>
                                    {isBn ? 'কোনো আর্টিকেল পাওয়া যায়নি' : 'NO ARTICLES FOUND'}
                                </h3>
                                <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    {isBn ? 'অন্যভাবে খোঁজার চেষ্টা করুন' : 'Try adjusting your search or filters'}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* --- CTA SECTION --- */}
            <section className="py-14 border-t border-gray-100" style={{ background: 'linear-gradient(135deg, #f8fafb 0%, #f0f5fa 100%)' }}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase mb-2" style={{ fontFamily: 'Teko, sans-serif' }}>
                                {isBn ? 'ভিসা সংক্রান্ত সহযোগিতা প্রয়োজন?' : 'NEED VISA ASSISTANCE?'}
                            </h3>
                            <p className="text-gray-500 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {isBn ? 'আমাদের বিশেষজ্ঞদের সাথে ফ্রি কনসাল্টেশন বুক করুন' : 'Book a free consultation with our immigration experts today'}
                            </p>
                        </div>
                        <Link href="/contact">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-3 px-8 py-4 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all"
                                style={{ fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(135deg, #3590CF 0%, #2A74A8 100%)' }}
                            >
                                {isBn ? 'যোগাযোগ করুন' : 'CONTACT US'} <LuArrowRight className="w-4 h-4" />
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
            className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#EF8C2C]/20 transition-all duration-500 hover:shadow-xl flex flex-col h-full"
        >
            <Link href={`/blog/${blog.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <span className="flex items-center gap-1.5"><LuCalendar className="w-3 h-3" />{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><LuClock className="w-3 h-3" />{blog.readingTime || 5} min</span>
                </div>
                <Link href={`/blog/${blog.slug}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight uppercase group-hover:text-[#EF8C2C] transition-colors" style={{ fontFamily: 'Teko, sans-serif' }}>
                        {isBn ? blog.titleBn || blog.title : blog.title}
                    </h3>
                </Link>
                <p className="text-gray-500 text-[13px] leading-relaxed mb-5 line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {isBn ? blog.excerptBn || blog.excerpt : blog.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {blog.author?.firstName ? `${blog.author.firstName} ${blog.author.lastName || ''}` : 'VisaPro Team'}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <LuEye className="w-3.5 h-3.5" />{blog.totalViews?.toLocaleString() || 0}
                    </span>
                </div>
            </div>
        </motion.article>
    );
}
