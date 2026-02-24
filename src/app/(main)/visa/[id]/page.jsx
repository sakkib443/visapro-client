"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LuArrowLeft,
    LuClock,
    LuMapPin,
    LuShieldCheck,
    LuFileText,
    LuCalendarDays,
    LuPhone,
    LuMessageCircle,
    LuChevronRight,
    LuHeart,
    LuShare2,
    LuCircleCheck,
    LuCircleDot,
    LuUsers,
    LuBadgeCheck,
    LuPlane,
    LuDownload,
    LuStar
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

// Same mock data – in production this would come from an API
const visaData = [
    {
        id: 1,
        country: "Singapore", countryBn: "সিঙ্গাপুর",
        type: "Tourist Visa", typeBn: "ট্যুরিস্ট ভিসা",
        category: "Tourist Visa", categoryBn: "ট্যুরিস্ট ভিসা",
        region: "Asian",
        processingTime: "5-7 Days", processingTimeBn: "৫-৭ দিন",
        price: 4500,
        oldPrice: 5200,
        image: "https://images.unsplash.com/photo-1496939376851-89342e90adcd?q=80&w=1200&auto=format&fit=crop",
        description: "Official entry permit for tourism and visiting friends or family in Singapore.",
        descriptionBn: "সিঙ্গাপুরে পর্যটন এবং বন্ধু বা পরিবার পরিদর্শনের জন্য অফিসিয়াল এন্ট্রি পারমিট।",
        longDescription: "Singapore's Tourist Visa allows you to explore one of Asia's most vibrant cities. From the stunning Marina Bay Sands to the lush Gardens by the Bay, this visa grants you access to experience world-class dining, shopping, and cultural attractions. Our streamlined process ensures you receive your visa quickly and hassle-free.",
        longDescriptionBn: "সিঙ্গাপুরের ট্যুরিস্ট ভিসা আপনাকে এশিয়ার অন্যতম প্রাণবন্ত শহর অন্বেষণ করতে দেয়। চমৎকার মেরিনা বে স্যান্ডস থেকে সুন্দর গার্ডেনস বাই দ্য বে পর্যন্ত, এই ভিসা আপনাকে বিশ্বমানের খাবার, শপিং এবং সাংস্কৃতিক আকর্ষণ উপভোগ করতে দেয়।",
        featured: true,
        discount: "15% Off", discountBn: "১৫% ছাড়",
        validity: "30 Days", validityBn: "৩০ দিন",
        entries: "Single Entry", entriesBn: "একক এন্ট্রি",
        nextSteps: ["Document Collection", "Online Application", "Visa Issuance"],
        nextStepsBn: ["ডকুমেন্ট সংগ্রহ", "অনলাইন আবেদন", "ভিসা ইস্যু"],
        availability: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        documents: [
            { en: "Valid Passport (min 6 months validity)", bn: "বৈধ পাসপোর্ট (ন্যূনতম ৬ মাসের মেয়াদ)" },
            { en: "Recent passport-size photographs", bn: "সাম্প্রতিক পাসপোর্ট সাইজ ছবি" },
            { en: "Flight itinerary (round trip)", bn: "ফ্লাইট ইটিনারেরি (রাউন্ড ট্রিপ)" },
            { en: "Hotel booking confirmation", bn: "হোটেল বুকিং নিশ্চিতকরণ" },
            { en: "Bank statement (last 6 months)", bn: "ব্যাংক স্টেটমেন্ট (শেষ ৬ মাস)" },
            { en: "Cover letter", bn: "কভার লেটার" },
        ],
        faqs: [
            { q: "How long does processing take?", qBn: "প্রসেসিং কত সময় নেয়?", a: "Typically 5-7 business days from submission.", aBn: "সাধারণত জমা দেওয়ার পর ৫-৭ কার্যদিবস।" },
            { q: "Can I extend my visa?", qBn: "আমি কি ভিসা বাড়াতে পারি?", a: "Yes, extensions are possible through Singapore's ICA.", aBn: "হ্যাঁ, সিঙ্গাপুরের ICA এর মাধ্যমে এক্সটেনশন সম্ভব।" },
            { q: "Is travel insurance required?", qBn: "ট্রাভেল ইন্স্যুরেন্স কি আবশ্যক?", a: "Not mandatory but highly recommended.", aBn: "বাধ্যতামূলক নয়, তবে অত্যন্ত সুপারিশকৃত।" },
        ]
    },
    {
        id: 2,
        country: "Malaysia", countryBn: "মালয়েশিয়া",
        type: "Tourist (e-Visa)", typeBn: "ট্যুরিস্ট (ই-ভিসা)",
        category: "Tourist Visa", categoryBn: "ট্যুরিস্ট ভিসা",
        region: "Asian",
        processingTime: "3-5 Days", processingTimeBn: "৩-৫ দিন",
        price: 3800,
        oldPrice: 4200,
        image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop",
        description: "Electronic visa for tourism purposes, valid for a single entry stay of up to 30 days.",
        descriptionBn: "পর্যটনের উদ্দেশ্যে ইলেকট্রনিক ভিসা, সর্বোচ্চ ৩০ দিনের একক এন্ট্রির জন্য বৈধ।",
        longDescription: "Malaysia's e-Visa offers a convenient digital solution for travelers. Experience the breathtaking Petronas Towers, pristine beaches of Langkawi, and the rich cultural heritage of Malacca. Our online processing ensures a smooth and paperless application experience.",
        longDescriptionBn: "মালয়েশিয়ার ই-ভিসা ভ্রমণকারীদের জন্য সুবিধাজনক ডিজিটাল সমাধান প্রদান করে। পেট্রোনাস টাওয়ার, লাঙ্কাভির সৈকত এবং মালাক্কার সাংস্কৃতিক ঐতিহ্য উপভোগ করুন।",
        featured: false,
        discount: "10% Off", discountBn: "১০% ছাড়",
        validity: "30 Days", validityBn: "৩০ দিন",
        entries: "Single Entry", entriesBn: "একক এন্ট্রি",
        nextSteps: ["Data Entry", "Verification", "e-Visa Delivery"],
        nextStepsBn: ["ডাটা এন্ট্রি", "যাচাই", "ই-ভিসা ডেলিভারি"],
        availability: ["Jan", "Feb", "Mar", "Apr", "May", "Sep", "Oct", "Nov", "Dec"],
        documents: [
            { en: "Valid Passport (min 6 months validity)", bn: "বৈধ পাসপোর্ট (ন্যূনতম ৬ মাসের মেয়াদ)" },
            { en: "Digital passport-size photograph", bn: "ডিজিটাল পাসপোর্ট সাইজ ছবি" },
            { en: "Return flight ticket", bn: "রিটার্ন ফ্লাইট টিকিট" },
            { en: "Accommodation details", bn: "থাকার বিবরণ" },
            { en: "Bank statement (last 3 months)", bn: "ব্যাংক স্টেটমেন্ট (শেষ ৩ মাস)" },
        ],
        faqs: [
            { q: "Is it fully online?", qBn: "এটা কি সম্পূর্ণ অনলাইন?", a: "Yes, the entire process is digital.", aBn: "হ্যাঁ, সম্পূর্ণ প্রক্রিয়াটি ডিজিটাল।" },
            { q: "How do I receive my e-Visa?", qBn: "আমি কিভাবে ই-ভিসা পাবো?", a: "It will be emailed to you as a PDF.", aBn: "এটি পিডিএফ হিসেবে আপনার ইমেইলে পাঠানো হবে।" },
        ]
    },
    {
        id: 3,
        country: "USA", countryBn: "যুক্তরাষ্ট্র",
        type: "B1/B2 Visitor", typeBn: "B1/B2 ভিজিটর",
        category: "Business Visa", categoryBn: "বিজনেস ভিসা",
        region: "North American",
        processingTime: "Interview Based", processingTimeBn: "ইন্টারভিউ ভিত্তিক",
        price: 18500,
        oldPrice: 21000,
        image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1200&auto=format&fit=crop",
        description: "Non-immigrant visa for persons wanting to enter the US for business or tourism.",
        descriptionBn: "ব্যবসা বা পর্যটনের জন্য মার্কিন যুক্তরাষ্ট্রে প্রবেশের ননইমিগ্র্যান্ট ভিসা।",
        longDescription: "The B1/B2 Visitor Visa is one of the most sought-after US visas. B1 covers business activities such as conferences and meetings, while B2 is for tourism, medical treatment, and visiting friends or family. We guide you through the DS-160 form, interview preparation, and documentation to maximize your chances of approval.",
        longDescriptionBn: "B1/B2 ভিজিটর ভিসা মার্কিন যুক্তরাষ্ট্রের সবচেয়ে চাহিদাপূর্ণ ভিসাগুলোর একটি। B1 কনফারেন্স ও মিটিং এর মতো ব্যবসায়িক কার্যক্রম কভার করে, আর B2 পর্যটন, চিকিৎসা এবং পরিবার পরিদর্শনের জন্য।",
        featured: true,
        discount: "20% Off", discountBn: "২০% ছাড়",
        validity: "10 Years", validityBn: "১০ বছর",
        entries: "Multiple Entry", entriesBn: "মাল্টিপল এন্ট্রি",
        nextSteps: ["DS-160 Form", "Fee Payment", "Interview"],
        nextStepsBn: ["DS-160 ফর্ম", "ফি পেমেন্ট", "ইন্টারভিউ"],
        availability: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        documents: [
            { en: "Valid Passport (min 6 months validity)", bn: "বৈধ পাসপোর্ট (ন্যূনতম ৬ মাসের মেয়াদ)" },
            { en: "DS-160 Confirmation Page", bn: "DS-160 কনফার্মেশন পেজ" },
            { en: "Passport-size photographs (US spec)", bn: "পাসপোর্ট সাইজ ছবি (US স্পেক)" },
            { en: "Proof of financial stability", bn: "আর্থিক স্থিতিশীলতার প্রমাণ" },
            { en: "Employment / Business letter", bn: "চাকরি / ব্যবসার পত্র" },
            { en: "Previous travel history", bn: "পূর্ববর্তী ভ্রমণ ইতিহাস" },
            { en: "Interview appointment letter", bn: "ইন্টারভিউ অ্যাপয়েন্টমেন্ট লেটার" },
        ],
        faqs: [
            { q: "How long does the interview take?", qBn: "ইন্টারভিউ কত সময় নেয়?", a: "Usually 3-5 minutes at the US Embassy.", aBn: "সাধারণত US দূতাবাসে ৩-৫ মিনিট।" },
            { q: "Can I work with a B1/B2 visa?", qBn: "B1/B2 ভিসায় কি কাজ করা যায়?", a: "No, this is strictly a non-work visa.", aBn: "না, এটি কঠোরভাবে অ-কর্মসংস্থান ভিসা।" },
            { q: "What if my visa gets rejected?", qBn: "ভিসা প্রত্যাখ্যান হলে কি হবে?", a: "We offer a re-application service at discounted rates.", aBn: "আমরা ছাড়ের হারে পুনরায় আবেদন সেবা প্রদান করি।" },
        ]
    },
    {
        id: 4,
        country: "UK", countryBn: "যুক্তরাজ্য",
        type: "Standard Visitor", typeBn: "স্ট্যান্ডার্ড ভিজিটর",
        category: "Tourist Visa", categoryBn: "ট্যুরিস্ট ভিসা",
        region: "European",
        processingTime: "15-20 Days", processingTimeBn: "১৫-২০ দিন",
        price: 14200,
        oldPrice: 16000,
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop",
        description: "Standard visa for travel, business meetings, or visiting family in the United Kingdom.",
        descriptionBn: "যুক্তরাজ্যে ভ্রমণ, ব্যবসায়িক মিটিং বা পরিবার পরিদর্শনের জন্য স্ট্যান্ডার্ড ভিসা।",
        longDescription: "The UK Standard Visitor Visa allows you to visit England, Scotland, Wales, and Northern Ireland for tourism, business, medical treatment, or academic purposes for up to 6 months. Our team provides end-to-end support from appointment booking to biometrics.",
        longDescriptionBn: "UK স্ট্যান্ডার্ড ভিজিটর ভিসা আপনাকে সর্বোচ্চ ৬ মাসের জন্য ইংল্যান্ড, স্কটল্যান্ড, ওয়েলস এবং উত্তর আয়ারল্যান্ডে ভ্রমণের সুযোগ দেয়।",
        featured: true,
        discount: "12% Off", discountBn: "১২% ছাড়",
        validity: "6 Months", validityBn: "৬ মাস",
        entries: "Multiple Entry", entriesBn: "মাল্টিপল এন্ট্রি",
        nextSteps: ["Appt. Booking", "Biometrics", "Decision"],
        nextStepsBn: ["অ্যাপয়েন্টমেন্ট বুকিং", "বায়োমেট্রিক্স", "সিদ্ধান্ত"],
        availability: ["Jan", "Feb", "Mar", "Oct", "Nov", "Dec"],
        documents: [
            { en: "Valid Passport (min 6 months validity)", bn: "বৈধ পাসপোর্ট (ন্যূনতম ৬ মাসের মেয়াদ)" },
            { en: "Passport-size photographs", bn: "পাসপোর্ট সাইজ ছবি" },
            { en: "TB test certificate (if applicable)", bn: "টিবি টেস্ট সার্টিফিকেট (প্রযোজ্য হলে)" },
            { en: "Bank statement (last 6 months)", bn: "ব্যাংক স্টেটমেন্ট (শেষ ৬ মাস)" },
            { en: "Sponsor letter (if applicable)", bn: "স্পন্সর লেটার (প্রযোজ্য হলে)" },
        ],
        faqs: [
            { q: "Do I need to attend an interview?", qBn: "আমাকে কি ইন্টারভিউতে যেতে হবে?", a: "No interview; only biometrics at the visa center.", aBn: "ইন্টারভিউ নেই; শুধু ভিসা সেন্টারে বায়োমেট্রিক্স।" },
            { q: "Can I study with this visa?", qBn: "এই ভিসায় কি পড়াশোনা করা যায়?", a: "Short courses up to 30 days are allowed.", aBn: "৩০ দিন পর্যন্ত সংক্ষিপ্ত কোর্স অনুমোদিত।" },
        ]
    },
    {
        id: 5,
        country: "Italy", countryBn: "ইতালি",
        type: "Schengen Visa", typeBn: "শেনজেন ভিসা",
        category: "Tourist Visa", categoryBn: "ট্যুরিস্ট ভিসা",
        region: "European",
        processingTime: "15-20 Days", processingTimeBn: "১৫-২০ দিন",
        price: 12500,
        oldPrice: 14500,
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop",
        description: "Access 27 European countries with a single Schengen visa issued by Italy.",
        descriptionBn: "ইতালি কর্তৃক প্রদত্ত একটি শেনজেন ভিসায় ২৭টি ইউরোপীয় দেশে প্রবেশের সুযোগ।",
        longDescription: "The Italy Schengen Visa opens the door to 27 European countries. Visit Rome's Colosseum, Venice's canals, and Florence's art galleries – all with a single visa. We handle your VFS appointment and document preparation for maximum convenience.",
        longDescriptionBn: "ইতালি শেনজেন ভিসা ২৭টি ইউরোপীয় দেশের দ্বার খুলে দেয়। রোমের কলোসিয়াম, ভেনিসের খাল এবং ফ্লোরেন্সের আর্ট গ্যালারি – সবকিছু একটি ভিসায় পরিদর্শন করুন।",
        featured: false,
        discount: "Free Insurance", discountBn: "বিনামূল্যে বীমা",
        validity: "90 Days", validityBn: "৯০ দিন",
        entries: "Multiple Entry", entriesBn: "মাল্টিপল এন্ট্রি",
        nextSteps: ["Documents", "Appt. at VFS", "Processing"],
        nextStepsBn: ["ডকুমেন্ট", "VFS-এ অ্যাপয়েন্টমেন্ট", "প্রসেসিং"],
        availability: ["May", "Jun", "Jul", "Aug", "Sep"],
        documents: [
            { en: "Valid Passport (min 6 months validity)", bn: "বৈধ পাসপোর্ট (ন্যূনতম ৬ মাসের মেয়াদ)" },
            { en: "Schengen visa application form", bn: "শেনজেন ভিসা আবেদন ফর্ম" },
            { en: "Travel insurance (€30,000 min coverage)", bn: "ট্র্যাভেল ইন্স্যুরেন্স (€৩০,০০০ ন্যূনতম কভারেজ)" },
            { en: "Flight reservation", bn: "ফ্লাইট রিজার্ভেশন" },
            { en: "Accommodation proof", bn: "থাকার প্রমাণ" },
            { en: "Financial proof (bank statement)", bn: "আর্থিক প্রমাণ (ব্যাংক স্টেটমেন্ট)" },
        ],
        faqs: [
            { q: "Can I visit other Schengen countries?", qBn: "আমি কি অন্য শেনজেন দেশ পরিদর্শন করতে পারি?", a: "Yes, the visa allows travel across all 27 Schengen nations.", aBn: "হ্যাঁ, ভিসা সমস্ত ২৭টি শেনজেন দেশে ভ্রমণের সুযোগ দেয়।" },
        ]
    },
    {
        id: 6,
        country: "Australia", countryBn: "অস্ট্রেলিয়া",
        type: "Subclass 600", typeBn: "সাবক্লাস ৬০০",
        category: "Tourist Visa", categoryBn: "ট্যুরিস্ট ভিসা",
        region: "Oceania",
        processingTime: "25-30 Days", processingTimeBn: "২৫-৩০ দিন",
        price: 16800,
        oldPrice: 18500,
        image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1200&auto=format&fit=crop",
        description: "The Visitor visa allows you to visit Australia for a holiday or to visit friends and family.",
        descriptionBn: "ভিজিটর ভিসা আপনাকে ছুটি কাটাতে বা বন্ধু ও পরিবার পরিদর্শনে অস্ট্রেলিয়া ভ্রমণের সুযোগ দেয়।",
        longDescription: "Australia's Subclass 600 Visitor Visa lets you explore the Sydney Opera House, Great Barrier Reef, and the vast Outback. Whether you're visiting for a holiday or to catch up with loved ones, our expert team ensures a hassle-free application experience.",
        longDescriptionBn: "অস্ট্রেলিয়ার সাবক্লাস ৬০০ ভিজিটর ভিসা আপনাকে সিডনি অপেরা হাউস, গ্রেট ব্যারিয়ার রিফ এবং বিশাল আউটব্যাক অন্বেষণ করতে দেয়।",
        featured: false,
        discount: "Hot Deal", discountBn: "হট ডিল",
        validity: "90 Days", validityBn: "৯০ দিন",
        entries: "Single Entry", entriesBn: "একক এন্ট্রি",
        nextSteps: ["Online File", "Biometrics", "Grant"],
        nextStepsBn: ["অনলাইন ফাইল", "বায়োমেট্রিক্স", "গ্রান্ট"],
        availability: ["Sep", "Oct", "Nov", "Dec"],
        documents: [
            { en: "Valid Passport (min 6 months validity)", bn: "বৈধ পাসপোর্ট (ন্যূনতম ৬ মাসের মেয়াদ)" },
            { en: "Passport-size photos", bn: "পাসপোর্ট সাইজ ছবি" },
            { en: "Proof of funds", bn: "ফান্ডের প্রমাণ" },
            { en: "Travel itinerary", bn: "ভ্রমণ পরিকল্পনা" },
            { en: "Health insurance", bn: "স্বাস্থ্য বীমা" },
        ],
        faqs: [
            { q: "Do I need a health exam?", qBn: "আমার কি স্বাস্থ্য পরীক্ষা দরকার?", a: "It depends on your country of origin and stay duration.", aBn: "এটি আপনার দেশ এবং থাকার সময়কালের উপর নির্ভর করে।" },
        ]
    },
];

const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function VisaDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const isBn = language === 'bn';
    const fontFamily = isBn ? 'Hind Siliguri, sans-serif' : 'Poppins, sans-serif';
    const headingFont = isBn ? 'Hind Siliguri, sans-serif' : 'Teko, sans-serif';

    const visa = visaData.find(v => v.id === parseInt(id));
    const relatedVisas = visaData.filter(v => v.id !== parseInt(id)).slice(0, 3);

    if (!visa) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-gray-300 uppercase" style={{ fontFamily: headingFont }}>
                        {isBn ? 'ভিসা পাওয়া যায়নি' : 'Visa Not Found'}
                    </h1>
                    <Link href="/visa" className="mt-4 inline-block text-sm font-bold text-[#EF8C2C] hover:underline" style={{ fontFamily }}>
                        {isBn ? 'ভিসা পেজে ফিরুন' : 'Back to Visa Page'}
                    </Link>
                </div>
            </div>
        );
    }

    const savings = visa.oldPrice - visa.price;

    return (
        <div className="bg-[#F9FAFB] min-h-screen">
            {/* Spacer */}
            <div className="h-16" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-20">

                {/* ── Breadcrumb ── */}
                <motion.nav
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-[12px] text-gray-400 mb-6"
                    style={{ fontFamily }}
                >
                    <Link href="/" className="hover:text-gray-700 transition-colors">{isBn ? 'হোম' : 'Home'}</Link>
                    <LuChevronRight size={12} />
                    <Link href="/visa" className="hover:text-gray-700 transition-colors">{isBn ? 'ভিসা' : 'Visa'}</Link>
                    <LuChevronRight size={12} />
                    <span className="text-gray-700 font-semibold">{isBn ? visa.typeBn : visa.type}</span>
                </motion.nav>

                {/* ── Header Section ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden mb-10"
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Left: Info */}
                        <div className="flex-grow p-6 md:p-10 flex flex-col justify-center">
                            {/* Back + Badges */}
                            <div className="flex items-center gap-3 mb-5">
                                <button
                                    onClick={() => router.back()}
                                    className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-700 transition-colors"
                                    style={{ fontFamily }}
                                >
                                    <LuArrowLeft size={14} />
                                    {isBn ? 'পিছনে' : 'Back'}
                                </button>
                                <div className="h-4 w-px bg-gray-200" />
                                {visa.featured && (
                                    <span className="px-2.5 py-1 bg-[#EF8C2C] text-white text-[8px] font-bold uppercase tracking-widest rounded-md">
                                        {isBn ? 'ফিচার্ড' : 'Featured'}
                                    </span>
                                )}
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[8px] font-bold uppercase tracking-widest rounded-md">
                                    {isBn ? visa.categoryBn : visa.category}
                                </span>
                            </div>

                            {/* Country */}
                            <div className="flex items-center gap-2 mb-2">
                                <LuMapPin size={14} className="text-[#EF8C2C]" />
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily }}>
                                    {isBn ? visa.countryBn : visa.country}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight leading-none mb-4" style={{ fontFamily: headingFont }}>
                                {isBn ? visa.typeBn : visa.type}
                            </h1>

                            {/* Short description */}
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-lg" style={{ fontFamily }}>
                                {isBn ? visa.descriptionBn : visa.description}
                            </p>

                            {/* Price + Actions */}
                            <div className="flex items-center gap-6 flex-wrap">
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black" style={{ color: '#3590CF', fontFamily: headingFont }}>
                                            ৳{visa.price.toLocaleString()}
                                        </span>
                                        <span className="text-base text-gray-300 line-through">
                                            ৳{visa.oldPrice.toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-green-600 font-bold mt-0.5" style={{ fontFamily }}>
                                        {isBn ? `আপনি ৳${savings.toLocaleString()} সাশ্রয় করছেন` : `You save ৳${savings.toLocaleString()}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="w-9 h-9 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all">
                                        <LuHeart size={15} />
                                    </button>
                                    <button className="w-9 h-9 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#3590CF] hover:bg-blue-50 hover:border-blue-100 transition-all">
                                        <LuShare2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: Image */}
                        <div className="md:w-[420px] flex-shrink-0 flex items-center justify-center p-5">
                            <div className="w-full h-full min-h-[240px] relative overflow-hidden rounded-md">
                                <img
                                    src={visa.image}
                                    alt={isBn ? visa.countryBn : visa.country}
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Main Content Grid ── */}
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Content */}
                    <div className="flex-grow min-w-0 space-y-8">

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {[
                                { icon: LuClock, label: isBn ? 'প্রসেসিং সময়' : 'Processing Time', value: isBn ? visa.processingTimeBn : visa.processingTime },
                                { icon: LuCalendarDays, label: isBn ? 'মেয়াদ' : 'Validity', value: isBn ? visa.validityBn : visa.validity },
                                { icon: LuPlane, label: isBn ? 'এন্ট্রি টাইপ' : 'Entry Type', value: isBn ? visa.entriesBn : visa.entries },
                                { icon: LuShieldCheck, label: isBn ? 'সাফল্যের হার' : 'Success Rate', value: '98%' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-md border border-gray-100 p-4 text-center shadow-sm">
                                    <item.icon size={20} className="mx-auto mb-2 text-[#EF8C2C]" />
                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1" style={{ fontFamily }}>{item.label}</p>
                                    <p className="text-sm font-bold text-gray-800" style={{ fontFamily }}>{item.value}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* About */}
                        <motion.section
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-md border border-gray-100 p-6 md:p-8 shadow-sm"
                        >
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4 leading-none" style={{ fontFamily: headingFont }}>
                                {isBn ? 'বিস্তারিত তথ্য' : 'About This Visa'}
                            </h2>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4" style={{ fontFamily }}>
                                {isBn ? visa.longDescriptionBn : visa.longDescription}
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily }}>
                                {isBn ? visa.descriptionBn : visa.description}
                            </p>
                        </motion.section>

                        {/* Processing Steps */}
                        <motion.section
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white rounded-md border border-gray-100 p-6 md:p-8 shadow-sm"
                        >
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6 leading-none" style={{ fontFamily: headingFont }}>
                                {isBn ? 'প্রসেসিং ধাপসমূহ' : 'Processing Steps'}
                            </h2>
                            <div className="space-y-0">
                                {(isBn ? visa.nextStepsBn : visa.nextSteps).map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#EF8C2C' }}>
                                                {idx + 1}
                                            </div>
                                            {idx < visa.nextSteps.length - 1 && (
                                                <div className="w-px h-8 bg-gray-100" />
                                            )}
                                        </div>
                                        <div className="pt-2 pb-4">
                                            <p className="text-sm font-bold text-gray-800" style={{ fontFamily }}>{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Required Documents */}
                        <motion.section
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-md border border-gray-100 p-6 md:p-8 shadow-sm"
                        >
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6 leading-none" style={{ fontFamily: headingFont }}>
                                {isBn ? 'প্রয়োজনীয় ডকুমেন্ট' : 'Required Documents'}
                            </h2>
                            <div className="space-y-3">
                                {visa.documents.map((doc, idx) => (
                                    <div key={idx} className="flex items-center gap-3 py-2.5 px-4 bg-gray-50 rounded-md">
                                        <LuCircleCheck size={16} className="text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 font-medium" style={{ fontFamily }}>
                                            {isBn ? doc.bn : doc.en}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider hover:underline transition-all" style={{ color: '#EF8C2C', fontFamily }}>
                                <LuDownload size={14} />
                                {isBn ? 'চেকলিস্ট ডাউনলোড করুন' : 'Download Checklist'}
                            </button>
                        </motion.section>

                        {/* Availability Calendar */}
                        <motion.section
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="bg-white rounded-md border border-gray-100 p-6 md:p-8 shadow-sm"
                        >
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6 leading-none" style={{ fontFamily: headingFont }}>
                                {isBn ? 'উপলব্ধতা' : 'Availability'}
                            </h2>
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
                                {allMonths.map(month => {
                                    const isAvailable = visa.availability.includes(month);
                                    return (
                                        <div
                                            key={month}
                                            className={`py-2.5 rounded-md text-center text-[11px] font-bold uppercase tracking-wider border transition-all ${isAvailable
                                                ? 'bg-[#EF8C2C]/10 border-[#EF8C2C]/20 text-[#EF8C2C]'
                                                : 'bg-gray-50 border-gray-100 text-gray-300'
                                                }`}
                                            style={{ fontFamily }}
                                        >
                                            {month}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm bg-[#EF8C2C]/20 border border-[#EF8C2C]/30" />
                                    <span className="text-[10px] text-gray-400 font-medium" style={{ fontFamily }}>{isBn ? 'উপলব্ধ' : 'Available'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm bg-gray-50 border border-gray-100" />
                                    <span className="text-[10px] text-gray-400 font-medium" style={{ fontFamily }}>{isBn ? 'অনুপলব্ধ' : 'Unavailable'}</span>
                                </div>
                            </div>
                        </motion.section>

                        {/* FAQs */}
                        <motion.section
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-md border border-gray-100 p-6 md:p-8 shadow-sm"
                        >
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6 leading-none" style={{ fontFamily: headingFont }}>
                                {isBn ? 'সাধারণ জিজ্ঞাসা' : 'Frequently Asked Questions'}
                            </h2>
                            <div className="space-y-4">
                                {visa.faqs.map((faq, idx) => (
                                    <div key={idx} className="border border-gray-100 rounded-md p-5">
                                        <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-start gap-2" style={{ fontFamily }}>
                                            <LuCircleDot size={14} className="text-[#EF8C2C] mt-0.5 flex-shrink-0" />
                                            {isBn ? faq.qBn : faq.q}
                                        </h3>
                                        <p className="text-[13px] text-gray-500 leading-relaxed pl-[22px]" style={{ fontFamily }}>
                                            {isBn ? faq.aBn : faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* ── Right Sidebar ── */}
                    <div className="w-full lg:w-[360px] flex-shrink-0">
                        <div className="lg:sticky lg:top-32 space-y-5">

                            {/* Pricing Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-md border border-gray-100 p-6 shadow-sm"
                            >
                                {visa.discount && (
                                    <span className="inline-block px-2.5 py-1 bg-[#EF8C2C]/10 text-[#EF8C2C] text-[9px] font-bold uppercase tracking-widest rounded-md mb-4" style={{ fontFamily }}>
                                        {isBn ? visa.discountBn : visa.discount}
                                    </span>
                                )}

                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-4xl font-black" style={{ color: '#3590CF', fontFamily: headingFont }}>
                                        ৳{visa.price.toLocaleString()}
                                    </span>
                                    <span className="text-lg text-gray-300 line-through font-medium">
                                        ৳{visa.oldPrice.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-[11px] text-green-600 font-bold mb-6" style={{ fontFamily }}>
                                    {isBn ? `আপনি ৳${savings.toLocaleString()} সাশ্রয় করছেন` : `You save ৳${savings.toLocaleString()}`}
                                </p>

                                <div className="space-y-3 mb-6">
                                    {[
                                        { label: isBn ? 'প্রসেসিং সময়' : 'Processing', value: isBn ? visa.processingTimeBn : visa.processingTime },
                                        { label: isBn ? 'মেয়াদ' : 'Validity', value: isBn ? visa.validityBn : visa.validity },
                                        { label: isBn ? 'এন্ট্রি' : 'Entry', value: isBn ? visa.entriesBn : visa.entries },
                                        { label: isBn ? 'ক্যাটেগরি' : 'Category', value: isBn ? visa.categoryBn : visa.category },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                            <span className="text-[12px] text-gray-400 font-medium" style={{ fontFamily }}>{item.label}</span>
                                            <span className="text-[12px] text-gray-800 font-bold" style={{ fontFamily }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-3.5 rounded-md text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:shadow-lg hover:shadow-[#EF8C2C]/20" style={{ backgroundColor: '#EF8C2C', fontFamily }}>
                                    {isBn ? 'এখনই আবেদন করুন' : 'Apply Now'}
                                </button>
                                <button className="w-full mt-3 py-3.5 rounded-md text-[11px] font-bold uppercase tracking-widest border-2 transition-all hover:bg-gray-50" style={{ borderColor: '#3590CF', color: '#3590CF', fontFamily }}>
                                    {isBn ? 'বিনামূল্যে পরামর্শ' : 'Free Consultation'}
                                </button>
                            </motion.div>

                            {/* Why Choose Us */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-md border border-gray-100 p-6 shadow-sm"
                            >
                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-4 leading-none" style={{ fontFamily: headingFont }}>
                                    {isBn ? 'কেন আমাদের বেছে নেবেন' : 'Why Choose Us'}
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { icon: LuBadgeCheck, text: isBn ? '98% সাফল্যের হার' : '98% Success Rate' },
                                        { icon: LuUsers, text: isBn ? '১০,০০০+ সন্তুষ্ট ক্লায়েন্ট' : '10,000+ Happy Clients' },
                                        { icon: LuShieldCheck, text: isBn ? '100% তথ্য সুরক্ষিত' : '100% Data Secure' },
                                        { icon: LuStar, text: isBn ? 'বিশেষজ্ঞ দল' : 'Expert Team' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md bg-[#EF8C2C]/10 flex items-center justify-center flex-shrink-0">
                                                <item.icon size={14} className="text-[#EF8C2C]" />
                                            </div>
                                            <span className="text-[13px] font-semibold text-gray-700" style={{ fontFamily }}>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Contact CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="rounded-md p-6 relative overflow-hidden"
                                style={{ backgroundColor: '#021E14' }}
                            >
                                <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(239,140,44,0.15)' }} />
                                <div className="relative z-10">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#EF8C2C' }}>
                                        {isBn ? 'সাহায্য দরকার?' : 'Need Help?'}
                                    </p>
                                    <p className="text-sm font-bold text-white mb-1" style={{ fontFamily }}>
                                        {isBn ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get in Touch'}
                                    </p>
                                    <p className="text-[11px] text-white/40 leading-relaxed mb-5" style={{ fontFamily }}>
                                        {isBn ? 'আমাদের ভিসা বিশেষজ্ঞরা সবসময় আপনার পাশে।' : 'Our visa specialists are always ready to assist you.'}
                                    </p>
                                    <div className="space-y-2">
                                        <button className="w-full py-3 rounded-md flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:opacity-90" style={{ backgroundColor: '#EF8C2C', fontFamily }}>
                                            <LuPhone size={13} />
                                            {isBn ? 'কল করুন' : 'Call Now'}
                                        </button>
                                        <button className="w-full py-3 rounded-md flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white border border-white/15 transition-all hover:bg-white/5" style={{ fontFamily }}>
                                            <LuMessageCircle size={13} />
                                            {isBn ? 'মেসেজ করুন' : 'Send Message'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* ── Related Visas ── */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16"
                >
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-8 leading-none" style={{ fontFamily: headingFont }}>
                        {isBn ? 'আরো ভিসা ' : 'More Visa '}<span style={{ color: '#EF8C2C' }}>{isBn ? 'দেখুন' : 'Options'}</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {relatedVisas.map((rv, idx) => (
                            <Link href={`/visa/${rv.id}`} key={rv.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.08 }}
                                    className="group bg-white rounded-md overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={rv.image}
                                            alt={isBn ? rv.countryBn : rv.country}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                            <LuMapPin size={11} className="text-[#EF8C2C]" />
                                            <span className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow" style={{ fontFamily }}>
                                                {isBn ? rv.countryBn : rv.country}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#3590CF] transition-colors mb-1" style={{ fontFamily }}>
                                            {isBn ? rv.typeBn : rv.type}
                                        </h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-black" style={{ color: '#3590CF', fontFamily: headingFont }}>৳{rv.price.toLocaleString()}</span>
                                            <span className="text-[10px] text-gray-300 line-through">৳{rv.oldPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.section>
            </div>

            {/* ── Bottom CTA ── */}
            <section className="bg-white border-t border-gray-100 py-12 md:py-20">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-5 leading-none" style={{ fontFamily: headingFont }}>
                        {isBn ? 'আবেদন করতে প্রস্তুত?' : 'Ready to Apply?'}
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed" style={{ fontFamily }}>
                        {isBn ? 'আজই আপনার ভিসা আবেদন শুরু করুন। আমাদের বিশেষজ্ঞ দল প্রতিটি ধাপে আপনাকে গাইড করবে।' : 'Start your visa application today. Our expert team will guide you through every step.'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-10 py-4 rounded-md text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:shadow-lg hover:shadow-[#EF8C2C]/20 hover:-translate-y-0.5" style={{ backgroundColor: '#EF8C2C', fontFamily }}>
                            {isBn ? 'এখনই আবেদন করুন' : 'Apply Now'}
                        </button>
                        <button className="px-10 py-4 rounded-md text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: '#021E14', fontFamily }}>
                            {isBn ? 'আমাদের সাথে যোগাযোগ' : 'Contact Us'}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
