"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    FiUsers,
    FiHeart,
    FiArrowRight,
    FiTarget,
    FiZap,
    FiShield,
} from "react-icons/fi";

import { useLanguage } from "@/context/LanguageContext";

const stats = [
    { value: "10K+", valueBn: "১০K+", label: "Visas Processed", labelBn: "ভিসা প্রসেস" },
    { value: "50+", valueBn: "৫০+", label: "Countries", labelBn: "দেশ" },
    { value: "10K+", valueBn: "১০K+", label: "Happy Clients", labelBn: "সন্তুষ্ট ক্লায়েন্ট" },
    { value: "98%", valueBn: "৯৮%", label: "Success Rate", labelBn: "সাফল্যের হার" },
];

const values = [
    {
        icon: FiTarget,
        title: "Expert Guidance",
        titleBn: "বিশেষজ্ঞ গাইডেন্স",
        desc: "Every application is handled by experienced consultants who guide you at every step.",
        descBn: "প্রতিটি আবেদন অভিজ্ঞ পরামর্শদাতাদের দ্বারা পরিচালিত হয় যারা প্রতিটি ধাপে আপনাকে গাইড করেন।",
    },
    {
        icon: FiZap,
        title: "Fast Processing",
        titleBn: "দ্রুত প্রসেসিং",
        desc: "We work to make visa, flight, and travel arrangements as smooth and quick as possible.",
        descBn: "ভিসা, ফ্লাইট এবং ভ্রমণ ব্যবস্থা যতটা সম্ভব সহজ ও দ্রুত করতে আমরা কাজ করি।",
    },
    {
        icon: FiShield,
        title: "Trust & Security",
        titleBn: "বিশ্বাস ও নিরাপত্তা",
        desc: "Your documents and personal information are handled with strict confidentiality.",
        descBn: "আপনার নথি এবং ব্যক্তিগত তথ্য কঠোর গোপনীয়তার সাথে পরিচালনা করা হয়।",
    },
    {
        icon: FiHeart,
        title: "Client Care",
        titleBn: "ক্লায়েন্ট কেয়ার",
        desc: "We're dedicated to giving every client honest advice and dependable support.",
        descBn: "আমরা প্রতিটি ক্লায়েন্টকে সৎ পরামর্শ এবং নির্ভরযোগ্য সহায়তা দিতে নিবেদিত।",
    },
];

const milestones = [
    { year: "2018", title: "Founded", titleBn: "প্রতিষ্ঠা", desc: "Started in Dhaka with a mission to make global travel accessible", descBn: "বিশ্বব্যাপী ভ্রমণ সহজলভ্য করার লক্ষ্যে ঢাকায় যাত্রা শুরু" },
    { year: "2019", title: "First 1K Clients", titleBn: "প্রথম ১K ক্লায়েন্ট", desc: "Reached our first major milestone of served clients", descBn: "সেবা প্রদানকৃত ক্লায়েন্টের প্রথম বড় মাইলফলক অর্জন" },
    { year: "2021", title: "10K+ Visas Processed", titleBn: "১০K+ ভিসা প্রসেস", desc: "Thousands of visa applications successfully handled", descBn: "হাজার হাজার ভিসা আবেদন সফলভাবে সম্পন্ন" },
    { year: "2024", title: "Global Reach", titleBn: "বিশ্বব্যাপী পৌঁছানো", desc: "Serving clients across 50+ countries", descBn: "৫০+ দেশে ক্লায়েন্টদের সেবা প্রদান" },
];

export default function AboutPage() {
    const { language } = useLanguage();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">

            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                                <FiUsers className="w-4 h-4 text-primary" />
                                <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                    {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-heading uppercase leading-[0.9] mb-6">
                                {language === 'bn' ? 'ভিসা' : 'VISA'}
                                <br />
                                <span className="text-primary">{language === 'bn' ? 'প্রো।' : 'PRO.'}</span>
                            </h1>

                            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mb-8">
                                {language === 'bn'
                                    ? 'আমরা বাংলাদেশের একটি বিশ্বস্ত ভিসা ও মাইগ্রেশন কনসালটেন্সি। ভিসা প্রসেসিং, ফ্লাইট বুকিং, হোটেল রিজার্ভেশন, হজ ও উমরাহ এবং স্টাডি অ্যাব্রোড সেবা প্রদান করি।'
                                    : 'We are a trusted visa & migration consultancy in Bangladesh. Providing visa processing, flight booking, hotel reservation, Hajj & Umrah, and study abroad services.'}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
                                            {language === 'bn' ? stat.valueBn : stat.value}
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {language === 'bn' ? stat.labelBn : stat.label}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Image Grid */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="grid grid-cols-2 gap-3 md:gap-4"
                        >
                            <div className="space-y-4">
                                <div className="h-[140px] sm:h-[200px] rounded-2xl md:rounded-3xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                                        alt="Team"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="h-[180px] sm:h-[250px] rounded-2xl md:rounded-3xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800"
                                        alt="Office"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3 md:space-y-4 pt-4 md:pt-8">
                                <div className="h-[180px] sm:h-[250px] rounded-2xl md:rounded-3xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800"
                                        alt="Work"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="h-[140px] sm:h-[200px] rounded-2xl md:rounded-3xl overflow-hidden bg-primary flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-5xl font-bold text-black font-heading">6+</span>
                                        <p className="text-black font-bold uppercase">
                                            {language === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Years Experience'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading uppercase mb-6">
                                {language === 'bn' ? 'আমাদের মিশন' : 'OUR MISSION'}
                            </h2>
                            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                                {language === 'bn'
                                    ? 'আমাদের লক্ষ্য হলো প্রতিটি ক্লায়েন্টকে নির্ভরযোগ্য ভিসা ও ভ্রমণ সহায়তা প্রদান করা যা তাদের আন্তর্জাতিক যাত্রাকে সহজ করে তোলে। আমরা বিশ্বাস করি সঠিক গাইডেন্স সবার জন্য সহজলভ্য হওয়া উচিত।'
                                    : 'Our goal is to provide every client with reliable visa and travel support that makes their international journey simple. We believe the right guidance should be accessible to everyone.'}
                            </p>
                            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                                {language === 'bn'
                                    ? 'বাংলাদেশ থেকে শুরু করে, আমরা এখন বিশ্বের ৫০+ দেশে গ্রাহকদের সেবা দিচ্ছি, এবং আমাদের যাত্রা এখনও চলছে।'
                                    : 'Starting from Bangladesh, we now serve customers in 50+ countries worldwide, and our journey continues.'}
                            </p>
                        </motion.div>

                        {/* Values */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <value.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                        {language === 'bn' ? value.titleBn : value.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {language === 'bn' ? value.descBn : value.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading uppercase mb-4">
                            {language === 'bn' ? 'আমাদের যাত্রা' : 'OUR JOURNEY'}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="text-5xl font-bold text-primary/20 dark:text-primary/10 font-heading mb-2">
                                    {milestone.year}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {language === 'bn' ? milestone.titleBn : milestone.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {language === 'bn' ? milestone.descBn : milestone.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gray-900 dark:bg-black">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading uppercase mb-6">
                            {language === 'bn' ? 'আমাদের সাথে যোগ দিন!' : 'JOIN US TODAY!'}
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {language === 'bn'
                                ? 'হাজার হাজার সন্তুষ্ট ক্লায়েন্টের সাথে যোগ দিন এবং আজই আপনার ভ্রমণ যাত্রা শুরু করুন।'
                                : 'Join thousands of satisfied clients and start your travel journey today.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-black font-bold uppercase tracking-wider rounded-full hover:bg-primary/90 transition-all"
                            >
                                {language === 'bn' ? 'রেজিস্টার করুন' : 'Get Started'}
                                <FiArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider rounded-full hover:bg-white hover:text-black transition-all"
                            >
                                {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
