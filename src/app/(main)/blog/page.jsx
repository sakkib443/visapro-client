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
    LuEye
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

// Blog Categories
const categories = [
    { name: "All", nameBn: "সব" },
    { name: "Visa Guides", nameBn: "ভিসা গাইড" },
    { name: "Travel Tips", nameBn: "ভ্রমণ টিপস" },
    { name: "Immigration", nameBn: "ইমিগ্রেশন" },
    { name: "Study Abroad", nameBn: "বিদেশে পড়াশোনা" },
    { name: "Success Stories", nameBn: "সাফল্যের গল্প" },
];

// Mock blog data — visa/travel themed
const mockBlogs = [
    {
        _id: "1",
        title: "Complete Guide to UK Tourist Visa Application 2026",
        titleBn: "যুক্তরাজ্যের ট্যুরিস্ট ভিসা আবেদনের সম্পূর্ণ গাইড ২০২৬",
        slug: "uk-tourist-visa-guide-2026",
        excerpt: "Step-by-step guide to applying for a UK tourist visa from Bangladesh. Requirements, documents, fees, and tips to increase your approval chances.",
        thumbnail: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
        category: "Visa Guides",
        author: { name: "VisaPro Team" },
        createdAt: "2026-02-20",
        readTime: "8 min",
        views: 4520
    },
    {
        _id: "2",
        title: "Top 10 Scholarships for Bangladeshi Students in Canada",
        titleBn: "কানাডায় বাংলাদেশি শিক্ষার্থীদের জন্য সেরা ১০টি বৃত্তি",
        slug: "scholarships-bangladeshi-students-canada",
        excerpt: "Explore the best scholarship opportunities for Bangladeshi students looking to study in Canada. Full funding, partial scholarships, and more.",
        thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
        category: "Study Abroad",
        author: { name: "VisaPro Team" },
        createdAt: "2026-02-18",
        readTime: "10 min",
        views: 3890
    },
    {
        _id: "3",
        title: "How We Helped 500+ Families Get Their Schengen Visa",
        titleBn: "কীভাবে আমরা ৫০০+ পরিবারকে শেনজেন ভিসা পেতে সাহায্য করেছি",
        slug: "500-families-schengen-visa-success",
        excerpt: "Real success stories of families who trusted VisaPro for their European travel dreams. Read about their journeys and our approach.",
        thumbnail: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800",
        category: "Success Stories",
        author: { name: "VisaPro Team" },
        createdAt: "2026-02-15",
        readTime: "6 min",
        views: 2760
    },
    {
        _id: "4",
        title: "Australia PR Visa: Points Calculator & Eligibility Guide",
        titleBn: "অস্ট্রেলিয়া পিআর ভিসা: পয়েন্ট ক্যালকুলেটর ও যোগ্যতা গাইড",
        slug: "australia-pr-visa-points-guide",
        excerpt: "Everything you need to know about the Australian Permanent Residency visa, including the points system, eligibility, and processing times.",
        thumbnail: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800",
        category: "Immigration",
        author: { name: "VisaPro Team" },
        createdAt: "2026-02-12",
        readTime: "12 min",
        views: 5120
    },
    {
        _id: "5",
        title: "Essential Packing Tips for Hajj & Umrah Pilgrims",
        titleBn: "হজ্জ ও উমরাহ যাত্রীদের জন্য প্রয়োজনীয় প্যাকিং টিপস",
        slug: "packing-tips-hajj-umrah",
        excerpt: "A comprehensive packing checklist and travel tips for first-time Hajj and Umrah pilgrims from Bangladesh.",
        thumbnail: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800",
        category: "Travel Tips",
        author: { name: "VisaPro Team" },
        createdAt: "2026-02-10",
        readTime: "7 min",
        views: 3340
    },
    {
        _id: "6",
        title: "Malaysia Work Visa: Requirements & Application Process",
        titleBn: "মালয়েশিয়া ওয়ার্ক ভিসা: প্রয়োজনীয়তা ও আবেদন প্রক্রিয়া",
        slug: "malaysia-work-visa-requirements",
        excerpt: "Complete guide to getting a work visa for Malaysia. Learn about different work permit categories, required documents, and processing timeline.",
        thumbnail: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
        category: "Visa Guides",
        author: { name: "VisaPro Team" },
        createdAt: "2026-02-08",
        readTime: "9 min",
        views: 2180
    },
];

export default function BlogPage() {
    const { language } = useLanguage();
    const [blogs, setBlogs] = useState(mockBlogs);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredBlogs = blogs
        .filter(blog => {
            if (selectedCategory !== "All" && blog.category !== selectedCategory) return false;
            if (search && !blog.title?.toLowerCase().includes(search.toLowerCase()) && !blog.titleBn?.includes(search)) return false;
            return true;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

                        {/* Search & Filters */}
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

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${selectedCategory === cat.name
                                            ? 'bg-[#EF8C2C] text-white shadow-md'
                                            : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                            }`}
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                    >
                                        {isBn ? cat.nameBn : cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FEATURED POST --- */}
            {featuredPost && (
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
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#3590CF] mb-3 block" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {featuredPost.category}
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight uppercase group-hover:text-[#EF8C2C] transition-colors" style={{ fontFamily: 'Teko, sans-serif' }}>
                                        {isBn ? featuredPost.titleBn : featuredPost.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        <span className="flex items-center gap-1.5"><LuCalendar className="w-3.5 h-3.5" />{featuredPost.createdAt}</span>
                                        <span className="flex items-center gap-1.5"><LuClock className="w-3.5 h-3.5" />{featuredPost.readTime}</span>
                                        <span className="flex items-center gap-1.5"><LuEye className="w-3.5 h-3.5" />{featuredPost.views?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </section>
            )}

            {/* --- BLOG GRID --- */}
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

                    {filteredBlogs.length > 6 && (
                        <div className="text-center mt-14">
                            <button className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 hover:bg-[#EF8C2C] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {isBn ? 'আরো দেখুন' : 'LOAD MORE'} <LuArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

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
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-gray-900 text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {blog.category}
                    </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <span className="flex items-center gap-1.5"><LuCalendar className="w-3 h-3" />{blog.createdAt}</span>
                    <span className="flex items-center gap-1.5"><LuClock className="w-3 h-3" />{blog.readTime}</span>
                </div>
                <Link href={`/blog/${blog.slug}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight uppercase group-hover:text-[#EF8C2C] transition-colors" style={{ fontFamily: 'Teko, sans-serif' }}>
                        {isBn ? blog.titleBn : blog.title}
                    </h3>
                </Link>
                <p className="text-gray-500 text-[13px] leading-relaxed mb-5 line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {blog.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {blog.author?.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <LuEye className="w-3.5 h-3.5" />{blog.views?.toLocaleString()}
                    </span>
                </div>
            </div>
        </motion.article>
    );
}
