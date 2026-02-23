"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    LuCalendar, LuClock, LuArrowLeft, LuArrowRight, LuEye, LuTag
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

// Mock blog data
const mockBlog = {
    _id: "1",
    title: "Complete Guide to UK Tourist Visa Application 2026",
    titleBn: "যুক্তরাজ্যের ট্যুরিস্ট ভিসা আবেদনের সম্পূর্ণ গাইড ২০২৬",
    slug: "uk-tourist-visa-guide-2026",
    excerpt: "Step-by-step guide to applying for a UK tourist visa from Bangladesh.",
    content: `
        <h2>Introduction</h2>
        <p>Applying for a UK tourist visa from Bangladesh can seem daunting, but with proper preparation and the right documentation, the process becomes straightforward. This comprehensive guide walks you through every step of the application process.</p>
        
        <h2>Basic Requirements</h2>
        <p>Before you start your application, make sure you have the following documents ready:</p>
        <ul>
            <li>Valid passport with at least 6 months validity</li>
            <li>Recent passport-sized photographs</li>
            <li>Bank statements for the last 6 months</li>
            <li>Employment letter or business documents</li>
            <li>Travel itinerary and hotel reservations</li>
            <li>Travel insurance coverage</li>
        </ul>
        
        <h2>Step 1: Online Application</h2>
        <p>Visit the official UK government visa application website and fill out the Standard Visitor Visa form. Be honest and thorough in your responses. Any inconsistencies between your application and supporting documents could lead to a rejection.</p>
        
        <h2>Step 2: Document Preparation</h2>
        <p>Organize your documents in a neat folder. All documents should be in English or have certified translations. Include cover letters explaining the purpose of your visit and your ties to Bangladesh that will ensure your return.</p>
        
        <h2>Step 3: Biometrics Appointment</h2>
        <p>After submitting your online application, book a biometrics appointment at the nearest Visa Application Centre (VAC). In Dhaka, the VAC is located at Gulshan. Arrive on time with all your original documents.</p>
        
        <h2>Step 4: Processing & Decision</h2>
        <p>Standard processing takes 15-20 working days. You can opt for priority processing (5-7 days) or super priority processing (24 hours) for additional fees. You'll be notified via email once a decision is made.</p>
        
        <h2>Common Mistakes to Avoid</h2>
        <p>Many applications are refused due to avoidable mistakes. Don't submit insufficient financial evidence, provide inconsistent information, or forget to demonstrate strong ties to your home country. Always provide a clear travel purpose with supporting evidence.</p>
        
        <h2>Visa Fees</h2>
        <p>The current fee for a Standard Visitor Visa (6 months) is £100. Longer-term visas are available for frequent travelers: 2-year visa at £376, 5-year visa at £670, and 10-year visa at £837.</p>
        
        <h2>How VisaPro Can Help</h2>
        <p>At VisaPro, we've helped thousands of applicants successfully obtain their UK visas. Our expert team reviews your documents, prepares your application, and guides you through every step. Contact us for a free consultation to discuss your visa requirements.</p>
    `,
    thumbnail: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
    category: "Visa Guides",
    tags: ["UK Visa", "Tourist Visa", "Travel", "Immigration"],
    author: {
        name: "VisaPro Team",
        bio: "Expert visa consultants with 10+ years of experience."
    },
    createdAt: "2026-02-20",
    readTime: "8 min",
    views: 4520
};

const relatedPosts = [
    {
        _id: "3",
        title: "How We Helped 500+ Families Get Their Schengen Visa",
        slug: "500-families-schengen-visa-success",
        thumbnail: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400",
        category: "Success Stories",
        readTime: "6 min"
    },
    {
        _id: "4",
        title: "Australia PR Visa: Points Calculator & Eligibility Guide",
        slug: "australia-pr-visa-points-guide",
        thumbnail: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400",
        category: "Immigration",
        readTime: "12 min"
    },
    {
        _id: "6",
        title: "Malaysia Work Visa: Requirements & Application Process",
        slug: "malaysia-work-visa-requirements",
        thumbnail: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400",
        category: "Visa Guides",
        readTime: "9 min"
    },
];

export default function BlogPostPage() {
    const params = useParams();
    const { language } = useLanguage();
    const blog = mockBlog;
    const isBn = language === 'bn';

    return (
        <div className="min-h-screen bg-white">

            {/* Hero / Header */}
            <section className="relative pt-6">
                <div className="absolute inset-0 h-[320px] md:h-[400px] overflow-hidden">
                    <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
                </div>
                <div className="max-w-[850px] mx-auto px-6 relative z-10 pt-[200px] md:pt-[250px]">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3590CF] transition-colors text-sm font-medium mb-6"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            <LuArrowLeft className="w-4 h-4" />
                            {isBn ? 'ব্লগে ফিরুন' : 'Back to Blog'}
                        </Link>

                        <div className="flex items-center gap-3 mb-4">
                            <span
                                className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white"
                                style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#3590CF' }}
                            >
                                {blog.category}
                            </span>
                        </div>

                        <h1
                            className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight uppercase"
                            style={{ fontFamily: 'Teko, sans-serif' }}
                        >
                            {isBn ? blog.titleBn : blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-5 text-gray-400 mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#3590CF]/10 flex items-center justify-center text-[#3590CF] text-xs font-bold">
                                    VP
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{blog.author?.name}</span>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs font-medium"><LuCalendar className="w-3.5 h-3.5" />{blog.createdAt}</span>
                            <span className="flex items-center gap-1.5 text-xs font-medium"><LuClock className="w-3.5 h-3.5" />{blog.readTime}</span>
                            <span className="flex items-center gap-1.5 text-xs font-medium"><LuEye className="w-3.5 h-3.5" />{blog.views?.toLocaleString()} {isBn ? 'ভিউ' : 'views'}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-10">
                <div className="max-w-[850px] mx-auto px-6">
                    <article
                        className="prose prose-lg max-w-none 
                            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:uppercase
                            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
                            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-[15px]
                            prose-li:text-gray-600 prose-li:text-[15px]
                            prose-a:text-[#3590CF] prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-gray-800"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Tags */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                            <LuTag className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {isBn ? 'ট্যাগ' : 'Tags'}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {blog.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-semibold text-gray-500"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* CTA Box */}
                    <div className="mt-12 p-8 rounded-2xl border border-gray-100" style={{ background: 'linear-gradient(135deg, #f8fafb 0%, #f0f5fa 100%)' }}>
                        <h3 className="text-xl font-bold text-gray-900 uppercase mb-2" style={{ fontFamily: 'Teko, sans-serif' }}>
                            {isBn ? 'ভিসা সহায়তা প্রয়োজন?' : 'NEED VISA ASSISTANCE?'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {isBn
                                ? 'আমাদের বিশেষজ্ঞ টিম আপনাকে সব ধরনের ভিসা প্রসেসিংয়ে সাহায্য করবে।'
                                : 'Our expert team is here to help you with all types of visa processing and documentation.'}
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:-translate-y-0.5"
                            style={{ fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(135deg, #3590CF 0%, #2A74A8 100%)' }}
                        >
                            {isBn ? 'ফ্রি কনসাল্টেশন' : 'FREE CONSULTATION'} <LuArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            <section className="py-16 border-t border-gray-100" style={{ background: '#f8fafb' }}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 uppercase" style={{ fontFamily: 'Teko, sans-serif' }}>
                        {isBn ? 'আরো পড়ুন' : 'MORE ARTICLES'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((post) => (
                            <Link
                                key={post._id}
                                href={`/blog/${post.slug}`}
                                className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#EF8C2C]/20 hover:shadow-lg transition-all duration-500"
                            >
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-5">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#3590CF]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {post.category}
                                    </span>
                                    <h3 className="font-bold text-gray-900 mt-2 line-clamp-2 uppercase group-hover:text-[#EF8C2C] transition-colors" style={{ fontFamily: 'Teko, sans-serif' }}>
                                        {post.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-2 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {post.readTime} read
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
