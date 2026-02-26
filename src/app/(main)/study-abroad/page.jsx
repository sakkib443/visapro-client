"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuGraduationCap,
    LuGlobe,
    LuBookOpen,
    LuAward,
    LuBuilding,
    LuBriefcase,
    LuArrowRight,
    LuCheck,
    LuUsers,
    LuDollarSign,
    LuThumbsUp,
    LuShieldCheck,
    LuFileCheck,
    LuStar,
    LuCalendar,
    LuSearch,
    LuMessageSquare,
    LuTrendingUp
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import CountryFlag from "@/components/shared/CountryFlag";

const destinations = [
    {
        id: 1,
        country: "United Kingdom", countryBn: "যুক্তরাজ্য",
        flag: "🇬🇧",
        universities: "150+",
        tuition: "$15,000-$35,000/yr",
        highlights: ["Top-ranked universities", "Post-study work visa", "Scholarships available"],
        highlightsBn: ["শীর্ষ-র‍্যাংকিং বিশ্ববিদ্যালয়", "পোস্ট-স্টাডি ওয়ার্ক ভিসা", "স্কলারশিপ পাওয়া যায়"],
        description: "The UK is home to some of the world's oldest and most prestigious universities including Oxford, Cambridge, and Imperial College.",
        descriptionBn: "যুক্তরাজ্য অক্সফোর্ড, কেমব্রিজ এবং ইম্পেরিয়াল কলেজ সহ বিশ্বের সবচেয়ে পুরনো এবং সবচেয়ে মর্যাদাপূর্ণ কিছু বিশ্ববিদ্যালয়ের আবাসস্থল।",
        color: "#1D4ED8",
        popularPrograms: ["Business & Management", "Engineering", "Data Science", "Medicine"],
        popularProgramsBn: ["ব্যবসা ও ব্যবস্থাপনা", "ইঞ্জিনিয়ারিং", "ডেটা সায়েন্স", "মেডিসিন"],
    },
    {
        id: 2,
        country: "United States", countryBn: "যুক্তরাষ্ট্র",
        flag: "🇺🇸",
        universities: "500+",
        tuition: "$20,000-$50,000/yr",
        highlights: ["World-class research", "OPT work opportunities", "Diverse campus life"],
        highlightsBn: ["বিশ্বমানের গবেষণা", "ওপিটি কাজের সুযোগ", "বৈচিত্র্যময় ক্যাম্পাস জীবন"],
        description: "The US offers the most diverse higher education system in the world, with Ivy League schools and leading research universities.",
        descriptionBn: "যুক্তরাষ্ট্র আইভি লিগ স্কুল এবং শীর্ষস্থানীয় গবেষণা বিশ্ববিদ্যালয়গুলোর সাথে বিশ্বের সবচেয়ে বৈচিত্র্যময় উচ্চশিক্ষা ব্যবস্থা প্রদান করে।",
        color: "#DC2626",
        popularPrograms: ["Computer Science", "MBA", "Engineering", "Liberal Arts"],
        popularProgramsBn: ["কম্পিউটার সায়েন্স", "এমবিএ", "ইঞ্জিনিয়ারিং", "লিবারেল আর্টস"],
    },
    {
        id: 3,
        country: "Canada", countryBn: "কানাডা",
        flag: "🇨🇦",
        universities: "100+",
        tuition: "$12,000-$30,000/yr",
        highlights: ["Immigration pathways", "Affordable education", "Safe & multicultural"],
        highlightsBn: ["ইমিগ্রেশন পথ", "সাশ্রয়ী শিক্ষা", "নিরাপদ ও বহুসাংস্কৃতিক"],
        description: "Canada provides world-class education with pathways to permanent residency, making it a top choice for international students.",
        descriptionBn: "কানাডা স্থায়ী বাসিন্দার পথ সহ বিশ্বমানের শিক্ষা প্রদান করে, যা আন্তর্জাতিক শিক্ষার্থীদের শীর্ষ পছন্দ।",
        color: "#EF4444",
        popularPrograms: ["Healthcare", "IT", "Business", "Environmental Science"],
        popularProgramsBn: ["হেলথকেয়ার", "আইটি", "ব্যবসা", "পরিবেশ বিজ্ঞান"],
    },
    {
        id: 4,
        country: "Australia", countryBn: "অস্ট্রেলিয়া",
        flag: "🇦🇺",
        universities: "40+",
        tuition: "$15,000-$40,000/yr",
        highlights: ["High quality of life", "Post-study work visa", "Research excellence"],
        highlightsBn: ["উচ্চ জীবনযাত্রার মান", "পোস্ট-স্টাডি ওয়ার্ক ভিসা", "গবেষণা শ্রেষ্ঠত্ব"],
        description: "Australia's Group of Eight universities are among the best in the world, offering cutting-edge research and vibrant student life.",
        descriptionBn: "অস্ট্রেলিয়ার গ্রুপ অব এইট বিশ্ববিদ্যালয়গুলো বিশ্বের সেরাদের মধ্যে, অত্যাধুনিক গবেষণা এবং প্রাণবন্ত ছাত্রজীবন প্রদান করে।",
        color: "#2563EB",
        popularPrograms: ["Nursing", "Biotechnology", "Marine Science", "Accounting"],
        popularProgramsBn: ["নার্সিং", "বায়োটেকনোলজি", "মেরিন সায়েন্স", "অ্যাকাউন্টিং"],
    },
    {
        id: 5,
        country: "Germany", countryBn: "জার্মানি",
        flag: "🇩🇪",
        universities: "300+",
        tuition: "Mostly Free",
        highlights: ["Tuition-free education", "Strong engineering programs", "EU job market access"],
        highlightsBn: ["টিউশন-ফ্রি শিক্ষা", "শক্তিশালী ইঞ্জিনিয়ারিং প্রোগ্রাম", "ইইউ চাকরি বাজার অ্যাক্সেস"],
        description: "Germany offers tuition-free education at public universities with world-renowned engineering and technology programs.",
        descriptionBn: "জার্মানি বিশ্ববিখ্যাত ইঞ্জিনিয়ারিং এবং প্রযুক্তি প্রোগ্রাম সহ সরকারি বিশ্ববিদ্যালয়ে বিনামূল্যে শিক্ষা প্রদান করে।",
        color: "#FBBF24",
        popularPrograms: ["Mechanical Engineering", "Automotive", "Physics", "AI"],
        popularProgramsBn: ["মেকানিকাল ইঞ্জিনিয়ারিং", "অটোমোটিভ", "পদার্থবিদ্যা", "এআই"],
    },
];

const services = [
    {
        icon: <LuBookOpen size={22} />,
        title: "University Selection", titleBn: "বিশ্ববিদ্যালয় নির্বাচন",
        desc: "Expert guidance to find the perfect university matching your profile and goals.",
        descBn: "আপনার প্রোফাইল এবং লক্ষ্যের সাথে মানানসই নিখুঁত বিশ্ববিদ্যালয় খুঁজে পেতে বিশেষজ্ঞ নির্দেশনা।",
    },
    {
        icon: <LuFileCheck size={22} />,
        title: "Application Support", titleBn: "আবেদন সহায়তা",
        desc: "Complete support with university applications, SOP writing, and document preparation.",
        descBn: "বিশ্ববিদ্যালয়ের আবেদন, এসওপি লেখা এবং ডকুমেন্ট প্রস্তুতিতে সম্পূর্ণ সহায়তা।",
    },
    {
        icon: <LuShieldCheck size={22} />,
        title: "Visa Assistance", titleBn: "ভিসা সহায়তা",
        desc: "Professional visa application processing with high success rates across all countries.",
        descBn: "সকল দেশে উচ্চ সাফল্যের হার সহ পেশাদার ভিসা আবেদন প্রক্রিয়াকরণ।",
    },
    {
        icon: <LuDollarSign size={22} />,
        title: "Scholarship Guidance", titleBn: "স্কলারশিপ গাইডেন্স",
        desc: "Help identifying and applying for scholarships, grants, and financial aid opportunities.",
        descBn: "স্কলারশিপ, অনুদান এবং আর্থিক সহায়তার সুযোগ চিহ্নিতকরণ ও আবেদনে সহায়তা।",
    },
    {
        icon: <LuBriefcase size={22} />,
        title: "Pre-Departure Prep", titleBn: "প্রস্থান-পূর্ব প্রস্তুতি",
        desc: "Comprehensive guidance for accommodation, banking, health insurance, and travel arrangements.",
        descBn: "আবাসন, ব্যাংকিং, স্বাস্থ্য বীমা এবং ভ্রমণ ব্যবস্থার জন্য ব্যাপক নির্দেশনা।",
    },
    {
        icon: <LuMessageSquare size={22} />,
        title: "IELTS/TOEFL Prep", titleBn: "আইইএলটিএস/টোফেল প্রস্তুতি",
        desc: "Professional coaching and mock tests for English proficiency exams required by universities.",
        descBn: "বিশ্ববিদ্যালয়ের জন্য প্রয়োজনীয় ইংরেজি দক্ষতা পরীক্ষার জন্য পেশাদার কোচিং এবং মক টেস্ট।",
    },
];

export default function StudyAbroadPage() {
    const [selectedCountry, setSelectedCountry] = useState(0);
    const { language } = useLanguage();
    const isBn = language === 'bn';
    const fontFamily = isBn ? 'Hind Siliguri, sans-serif' : 'Poppins, sans-serif';
    const headingFont = isBn ? 'Hind Siliguri, sans-serif' : 'Teko, sans-serif';

    const activeDestination = destinations[selectedCountry];

    return (
        <div className="bg-[#F8FAFC] min-h-screen" style={{ fontFamily }}>

            {/* ═══════════════════════════════════════════════════
                1. HERO SECTION
            ═══════════════════════════════════════════════════ */}
            <section className="relative py-14 md:py-28 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(2,15,10,0.82)' }} />
                </div>

                <div className="relative z-10 max-w-4xl w-full px-4 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6"
                    >
                        <LuGraduationCap size={48} style={{ color: '#EF8C2C' }} />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4"
                        style={{ color: 'rgba(239,140,44,0.8)', fontFamily }}
                    >
                        {isBn ? 'আপনার গ্লোবাল ক্যারিয়ার শুরু করুন' : 'Launch Your Global Career'}
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-6xl font-bold text-gray-900 leading-[0.9] mb-8 uppercase"
                        style={{ fontFamily: headingFont, color: '#fff' }}
                    >
                        {isBn ? 'বিদেশে ' : 'Study '}<span style={{ color: '#EF8C2C' }}>{isBn ? 'পড়াশোনা' : 'Abroad'}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-sm font-normal mb-10 max-w-lg"
                        style={{ color: 'rgba(255,255,255,0.6)', fontFamily }}
                    >
                        {isBn
                            ? 'বিশ্বের সেরা বিশ্ববিদ্যালয়গুলোতে পড়ার স্বপ্ন পূরণ করুন। ভর্তি থেকে ভিসা পর্যন্ত সম্পূর্ণ সহায়তা।'
                            : 'Fulfill your dream of studying at the world\'s best universities. Complete support from admission to visa.'}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="flex flex-wrap gap-4 justify-center"
                    >
                        <a href="#destinations" className="px-8 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-90" style={{ backgroundColor: '#EF8C2C', color: '#fff', fontFamily }}>
                            {isBn ? 'গন্তব্য দেখুন' : 'Explore Destinations'}
                        </a>
                        <a href="#services" className="px-8 py-3 rounded-lg border text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', fontFamily }}>
                            {isBn ? 'বিনামূল্যে পরামর্শ' : 'Free Consultation'}
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                2. DESTINATIONS EXPLORER
            ═══════════════════════════════════════════════════ */}
            <section id="destinations" className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
                <div className="text-center mb-12">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#EF8C2C', fontFamily }}>{isBn ? 'জনপ্রিয় গন্তব্য' : 'Popular Destinations'}</p>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4" style={{ fontFamily: headingFont, color: '#021E14' }}>
                        {isBn ? 'আপনার গন্তব্য ' : 'Choose Your '}<span style={{ color: '#EF8C2C' }}>{isBn ? 'বেছে নিন' : 'Destination'}</span>
                    </h2>
                </div>

                {/* Country Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {destinations.map((dest, idx) => (
                        <button
                            key={dest.id}
                            onClick={() => setSelectedCountry(idx)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[12px] font-bold border transition-all ${selectedCountry === idx
                                ? "text-white shadow-sm border-transparent"
                                : "text-gray-600 border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                            style={selectedCountry === idx ? { backgroundColor: '#021E14', fontFamily } : { fontFamily }}
                        >
                            <CountryFlag name={dest.country} flag={dest.flag} size={20} />
                            {isBn ? dest.countryBn : dest.country}
                        </button>
                    ))}
                </div>

                {/* Active Destination Detail */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedCountry}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Info Panel */}
                            <div className="p-8 md:p-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <CountryFlag name={activeDestination.country} flag={activeDestination.flag} size={48} rounded={false} />
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-wider" style={{ fontFamily: headingFont, color: '#021E14' }}>
                                            {isBn ? activeDestination.countryBn : activeDestination.country}
                                        </h3>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider" style={{ fontFamily }}>
                                            {activeDestination.universities} {isBn ? 'বিশ্ববিদ্যালয়' : 'Universities'} • {activeDestination.tuition}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 font-normal leading-relaxed mb-6" style={{ fontFamily }}>
                                    {isBn ? activeDestination.descriptionBn : activeDestination.description}
                                </p>

                                <div className="mb-6">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3" style={{ fontFamily }}>{isBn ? 'মূল সুবিধা' : 'Key Highlights'}</h4>
                                    <div className="space-y-2">
                                        {(isBn ? activeDestination.highlightsBn : activeDestination.highlights).map((h, i) => (
                                            <div key={i} className="flex items-center gap-2.5">
                                                <LuCheck size={14} style={{ color: '#EF8C2C' }} />
                                                <span className="text-[12px] text-gray-600" style={{ fontFamily }}>{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="px-8 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:opacity-90 flex items-center gap-2" style={{ backgroundColor: '#EF8C2C', fontFamily }}>
                                    {isBn ? 'আবেদন করুন' : 'Apply Now'} <LuArrowRight size={14} />
                                </button>
                            </div>

                            {/* Programs Panel */}
                            <div className="p-8 md:p-12 border-t md:border-t-0 md:border-l border-gray-100" style={{ backgroundColor: '#FAFBFC' }}>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6" style={{ fontFamily }}>{isBn ? 'জনপ্রিয় প্রোগ্রাম' : 'Popular Programs'}</h4>
                                <div className="space-y-3">
                                    {(isBn ? activeDestination.popularProgramsBn : activeDestination.popularPrograms).map((prog, i) => (
                                        <div key={i} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: activeDestination.color }}>
                                                    {i + 1}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700" style={{ fontFamily }}>{prog}</span>
                                            </div>
                                            <LuArrowRight className="text-gray-300" size={14} />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 rounded-lg border border-dashed border-gray-200 text-center">
                                    <p className="text-[11px] text-gray-400 font-normal" style={{ fontFamily }}>
                                        {isBn ? 'আরো প্রোগ্রাম জানতে চান?' : 'Want to explore more programs?'}
                                    </p>
                                    <button className="mt-2 text-[10px] font-bold uppercase tracking-widest hover:underline" style={{ color: '#EF8C2C', fontFamily }}>
                                        {isBn ? 'সব প্রোগ্রাম দেখুন' : 'View All Programs'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* ═══════════════════════════════════════════════════
                3. SERVICES SECTION 
            ═══════════════════════════════════════════════════ */}
            <section id="services" className="py-20" style={{ backgroundColor: '#021E14' }}>
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#EF8C2C', fontFamily }}>{isBn ? 'আমরা কীভাবে সাহায্য করি' : 'How We Help'}</p>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4" style={{ fontFamily: headingFont, color: '#FFFFFF' }}>
                            {isBn ? 'আমাদের ' : 'Our '}<span style={{ color: '#EF8C2C' }}>{isBn ? 'সেবাসমূহ' : 'Services'}</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {services.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-6 rounded-xl border transition-all hover:border-[#EF8C2C]/30 group"
                                style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }}
                            >
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:scale-110" style={{ backgroundColor: 'rgba(239,140,44,0.1)', color: '#EF8C2C' }}>
                                    {item.icon}
                                </div>
                                <h4 className="text-sm font-bold mb-1 text-white" style={{ fontFamily }}>{isBn ? item.titleBn : item.title}</h4>
                                <p className="text-[10px] font-normal leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)', fontFamily }}>{isBn ? item.descBn : item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                4. CTA SECTION
            ═══════════════════════════════════════════════════ */}
            <section className="bg-white py-20 border-t border-gray-50">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <LuGlobe className="mx-auto mb-6" size={40} style={{ color: '#EF8C2C' }} />
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4" style={{ fontFamily: headingFont, color: '#021E14' }}>
                        {isBn ? 'শুরু করতে ' : 'Ready to '}<span style={{ color: '#EF8C2C' }}>{isBn ? 'প্রস্তুত?' : 'Get Started?'}</span>
                    </h2>
                    <p className="text-sm text-gray-500 font-normal max-w-md mx-auto mb-10" style={{ fontFamily }}>
                        {isBn
                            ? 'আজই আমাদের বিশেষজ্ঞদের সাথে কথা বলুন এবং আপনার বিদেশে পড়াশোনার যাত্রা শুরু করুন।'
                            : 'Talk to our experts today and start your journey to studying abroad at a top university.'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-10 py-4 rounded-lg text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:opacity-90 shadow-lg" style={{ backgroundColor: '#EF8C2C', fontFamily }}>
                            {isBn ? 'বিনামূল্যে পরামর্শ' : 'Free Consultation'}
                        </button>
                        <button className="px-10 py-4 rounded-lg border text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-gray-50" style={{ borderColor: '#021E14', color: '#021E14', fontFamily }}>
                            {isBn ? 'আমাদের কল করুন' : 'Call Us Now'}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
