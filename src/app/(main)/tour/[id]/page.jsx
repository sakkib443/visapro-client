"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LuArrowLeft,
    LuClock,
    LuMapPin,
    LuStar,
    LuCalendarDays,
    LuPhone,
    LuMessageCircle,
    LuChevronRight,
    LuHeart,
    LuShare2,
    LuCircleCheck,
    LuCircleDot,
    LuUsers,
    LuShieldCheck,
    LuPlane,
    LuCamera,
    LuUtensils,
    LuBed,
    LuArrowRight
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

// Tour data
const tourData = [
    {
        id: 1,
        title: "Majestic Switzerland: Alpine Adventure",
        titleBn: "মনোরম সুইজারল্যান্ড: আল্পাইন অ্যাডভেঞ্চার",
        location: "Switzerland", locationBn: "সুইজারল্যান্ড",
        category: "Adventure", categoryBn: "অ্যাডভেঞ্চার",
        tourType: "Solo Tour", tourTypeBn: "একক ট্যুর",
        duration: "07 Days", durationBn: "০৭ দিন",
        price: 1850.00,
        oldPrice: 2100.00,
        rating: 4.9,
        reviews: 124,
        image: "https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg?auto=compress&cs=tinysrgb&w=1200",
        description: "Experience the breathtaking beauty of the Swiss Alps, crystal clear lakes, and charming villages.",
        descriptionBn: "সুইস আল্পসের মনোমুগ্ধকর সৌন্দর্য, স্ফটিক স্বচ্ছ হ্রদ এবং মনোরম গ্রামগুলো উপভোগ করুন।",
        longDescription: "Embark on a 7-day Alpine adventure through Switzerland's most stunning landscapes. From the snow-capped peaks of Jungfrau to the serene shores of Lake Lucerne, this tour offers a perfect blend of adventure, culture, and relaxation. Enjoy scenic train rides, traditional Swiss cuisine, and world-class accommodations throughout your journey.",
        longDescriptionBn: "সুইজারল্যান্ডের সবচেয়ে সুন্দর ল্যান্ডস্কেপের মধ্য দিয়ে ৭ দিনের আল্পাইন অ্যাডভেঞ্চারে বের হন। জুংফ্রাউয়ের তুষারাবৃত চূড়া থেকে লেক লুসার্নের শান্ত তীর পর্যন্ত, এই ট্যুর অ্যাডভেঞ্চার, সংস্কৃতি এবং বিশ্রামের নিখুঁত মিশ্রণ প্রদান করে।",
        featured: true,
        tags: ["Alpine", "Nature", "Luxury"],
        groupSize: "Max 12", groupSizeBn: "সর্বোচ্চ ১২",
        included: [
            { en: "5-star hotel accommodation", bn: "৫-তারা হোটেল থাকা" },
            { en: "Daily breakfast & dinner", bn: "দৈনিক সকালের ও রাতের খাবার" },
            { en: "Airport transfers", bn: "বিমানবন্দর ট্রান্সফার" },
            { en: "Professional English guide", bn: "পেশাদার ইংরেজি গাইড" },
            { en: "All entrance fees", bn: "সকল প্রবেশ মূল্য" },
            { en: "Scenic train passes", bn: "সিনিক ট্রেন পাস" },
        ],
        itinerary: [
            { day: 1, title: "Arrival in Zurich", titleBn: "জুরিখে আগমন", desc: "Airport pickup, hotel check-in, evening city walk.", descBn: "বিমানবন্দর পিকআপ, হোটেল চেক-ইন, সন্ধ্যায় শহর ভ্রমণ।" },
            { day: 2, title: "Lucerne Day Trip", titleBn: "লুসার্ন দিবস ভ্রমণ", desc: "Visit Chapel Bridge, Lion Monument, and lake cruise.", descBn: "চ্যাপেল ব্রিজ, লায়ন মনুমেন্ট ভ্রমণ এবং লেক ক্রুজ।" },
            { day: 3, title: "Interlaken Adventure", titleBn: "ইন্টারলেকেন অ্যাডভেঞ্চার", desc: "Paragliding, kayaking, or canyoning options available.", descBn: "প্যারাগ্লাইডিং, কায়াকিং বা ক্যানিয়নিং অপশন উপলব্ধ।" },
            { day: 4, title: "Jungfraujoch Excursion", titleBn: "জুংফ্রাউয়খ ভ্রমণ", desc: "Top of Europe experience at 3,454m altitude.", descBn: "৩,৪৫৪ মিটার উচ্চতায় ইউরোপের শীর্ষ অভিজ্ঞতা।" },
            { day: 5, title: "Bern & Gruyères", titleBn: "বার্ন ও গ্রুয়ের", desc: "Capital city tour and cheese factory visit.", descBn: "রাজধানী শহর ভ্রমণ এবং পনির কারখানা পরিদর্শন।" },
            { day: 6, title: "Geneva & Mont Blanc", titleBn: "জেনেভা ও মন্ট ব্ল্যাঙ্ক", desc: "Jet d'Eau, UN headquarters, and Mont Blanc views.", descBn: "জেট দো, জাতিসংঘ সদর দপ্তর এবং মন্ট ব্ল্যাঙ্ক দর্শন।" },
            { day: 7, title: "Departure", titleBn: "প্রস্থান", desc: "Breakfast, hotel checkout, airport transfer.", descBn: "সকালের খাবার, হোটেল চেক-আউট, বিমানবন্দর ট্রান্সফার।" },
        ],
        faqs: [
            { q: "What is the best season?", qBn: "সেরা সময় কখন?", a: "June to September for summer; December to March for skiing.", aBn: "গ্রীষ্মের জন্য জুন-সেপ্টেম্বর; স্কিইংয়ের জন্য ডিসেম্বর-মার্চ।" },
            { q: "Is the tour suitable for children?", qBn: "ট্যুর কি শিশুদের জন্য উপযুক্ত?", a: "Yes, suitable for ages 8 and above.", aBn: "হ্যাঁ, ৮ বছর ও তার বেশি বয়সের জন্য উপযুক্ত।" },
            { q: "Can I customize the itinerary?", qBn: "আমি কি ভ্রমণসূচি পরিবর্তন করতে পারি?", a: "Absolutely! Contact us for custom arrangements.", aBn: "অবশ্যই! কাস্টম ব্যবস্থার জন্য আমাদের সাথে যোগাযোগ করুন।" },
        ]
    },
    {
        id: 2,
        title: "Dubai Skyline & Desert Safari",
        titleBn: "দুবাই স্কাইলাইন ও ডেজার্ট সাফারি",
        location: "Saudi Arabia", locationBn: "সৌদি আরব",
        category: "City Tour", categoryBn: "সিটি ট্যুর",
        tourType: "Group Tour", tourTypeBn: "গ্রুপ ট্যুর",
        duration: "05 Days", durationBn: "০৫ দিন",
        price: 850.00,
        oldPrice: 950.00,
        rating: 4.8,
        reviews: 210,
        image: "https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=1200",
        description: "From the world's tallest building to the golden sands of the Arabian desert, explore Dubai.",
        descriptionBn: "বিশ্বের সবচেয়ে উঁচু ভবন থেকে আরব মরুভূমির স্বর্ণালী বালু পর্যন্ত, দুবাই ঘুরে দেখুন।",
        longDescription: "Experience the glittering city of Dubai where modern marvels meet ancient traditions. Visit the iconic Burj Khalifa, explore the vibrant souks, and experience the thrill of a desert safari under the stars. This 5-day journey covers everything from luxury shopping at Dubai Mall to thrilling dune bashing adventures.",
        longDescriptionBn: "দুবাইয়ের ঝলমলে শহরের অভিজ্ঞতা নিন যেখানে আধুনিক বিস্ময় প্রাচীন ঐতিহ্যের সাথে মিলিত হয়। বুর্জ খলিফা পরিদর্শন করুন, প্রাণবন্ত সুক অন্বেষণ করুন এবং তারার নিচে ডেজার্ট সাফারির রোমাঞ্চ অনুভব করুন।",
        featured: false,
        tags: ["City", "Safari", "Shopping"],
        groupSize: "Max 20", groupSizeBn: "সর্বোচ্চ ২০",
        included: [
            { en: "4-star hotel accommodation", bn: "৪-তারা হোটেল থাকা" },
            { en: "Daily breakfast", bn: "দৈনিক সকালের খাবার" },
            { en: "Desert safari with BBQ dinner", bn: "বিবিকিউ ডিনার সহ ডেজার্ট সাফারি" },
            { en: "Dhow cruise dinner", bn: "ধাও ক্রুজ ডিনার" },
            { en: "All transfers", bn: "সকল ট্রান্সফার" },
        ],
        itinerary: [
            { day: 1, title: "Arrival & City Tour", titleBn: "আগমন ও সিটি ট্যুর", desc: "Airport pickup, Burj Khalifa visit, Dubai Mall.", descBn: "বিমানবন্দর পিকআপ, বুর্জ খলিফা পরিদর্শন, দুবাই মল।" },
            { day: 2, title: "Old Dubai & Souks", titleBn: "পুরাতন দুবাই ও সুক", desc: "Gold Souk, Spice Souk, Abra ride, Dubai Museum.", descBn: "গোল্ড সুক, স্পাইস সুক, আবরা রাইড, দুবাই মিউজিয়াম।" },
            { day: 3, title: "Desert Safari", titleBn: "ডেজার্ট সাফারি", desc: "Dune bashing, camel riding, BBQ dinner under stars.", descBn: "ডিউন ব্যাশিং, উট চড়া, তারার নিচে বিবিকিউ ডিনার।" },
            { day: 4, title: "Abu Dhabi Day Trip", titleBn: "আবুধাবি দিবস ভ্রমণ", desc: "Sheikh Zayed Mosque, Louvre Museum, Corniche.", descBn: "শেখ জায়েদ মসজিদ, লুভর মিউজিয়াম, কর্নিশ।" },
            { day: 5, title: "Departure", titleBn: "প্রস্থান", desc: "Free morning, airport transfer.", descBn: "বিনামূল্যে সকাল, বিমানবন্দর ট্রান্সফার।" },
        ],
        faqs: [
            { q: "What should I wear?", qBn: "কী পরব?", a: "Light, modest clothing is recommended.", aBn: "হালকা, শালীন পোশাক সুপারিশ করা হয়।" },
            { q: "Is alcohol included?", qBn: "অ্যালকোহল অন্তর্ভুক্ত?", a: "No, beverages are separate.", aBn: "না, পানীয় আলাদা।" },
        ]
    },
    {
        id: 3,
        title: "Culture & Cuisine Discovery",
        titleBn: "সংস্কৃতি ও রন্ধনশিল্প আবিষ্কার",
        location: "Saudi Arabia", locationBn: "সৌদি আরব",
        category: "Culture", categoryBn: "সংস্কৃতি",
        tourType: "Solo Tour", tourTypeBn: "একক ট্যুর",
        duration: "03 Days", durationBn: "০৩ দিন",
        price: 65.00,
        oldPrice: 85.00,
        rating: 4.9,
        reviews: 89,
        image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1200",
        description: "Walk through historic streets and enjoy the finest traditional cuisine.",
        descriptionBn: "ঐতিহাসিক রাস্তায় হেঁটে যান এবং সেরা ঐতিহ্যবাহী খাবার উপভোগ করুন।",
        longDescription: "Immerse yourself in the rich cultural heritage and culinary traditions. This intimate tour takes you through ancient markets, traditional cooking classes, and exclusive dining experiences with local families. A perfect journey for food lovers and culture enthusiasts.",
        longDescriptionBn: "সমৃদ্ধ সাংস্কৃতিক ঐতিহ্য এবং রান্নার ঐতিহ্যে নিজেকে নিমজ্জিত করুন। এই আন্তরিক ট্যুর আপনাকে প্রাচীন বাজার, ঐতিহ্যবাহী রান্নার ক্লাস এবং স্থানীয় পরিবারের সাথে একচেটিয়া ডাইনিং অভিজ্ঞতায় নিয়ে যায়।",
        featured: true,
        tags: ["Beach", "History", "Couple"],
        groupSize: "Max 8", groupSizeBn: "সর্বোচ্চ ৮",
        included: [
            { en: "Boutique hotel stay", bn: "বুটিক হোটেলে থাকা" },
            { en: "All meals included", bn: "সকল খাবার অন্তর্ভুক্ত" },
            { en: "Cooking class", bn: "রান্নার ক্লাস" },
            { en: "Market tour with guide", bn: "গাইড সহ বাজার ভ্রমণ" },
        ],
        itinerary: [
            { day: 1, title: "Arrival & Market Tour", titleBn: "আগমন ও বাজার ভ্রমণ", desc: "Welcome dinner, spice market exploration.", descBn: "স্বাগত ডিনার, মশলা বাজার অন্বেষণ।" },
            { day: 2, title: "Cooking & Culture", titleBn: "রান্না ও সংস্কৃতি", desc: "Hands-on cooking class, cultural heritage sites.", descBn: "হাতে-কলমে রান্নার ক্লাস, সাংস্কৃতিক ঐতিহ্য স্থান।" },
            { day: 3, title: "Farewell Feast", titleBn: "বিদায় ভোজ", desc: "Final feast with local family, departure.", descBn: "স্থানীয় পরিবারের সাথে চূড়ান্ত ভোজ, প্রস্থান।" },
        ],
        faqs: [
            { q: "Is it vegetarian-friendly?", qBn: "নিরামিষভোজীদের জন্য কি উপযুক্ত?", a: "Yes, vegetarian options are always available.", aBn: "হ্যাঁ, নিরামিষ অপশন সবসময় উপলব্ধ।" },
        ]
    },
    {
        id: 4,
        title: "Tropical Paradise: Bali Explorer",
        titleBn: "ক্রান্তীয় স্বর্গ: বালি এক্সপ্লোরার",
        location: "Indonesia", locationBn: "ইন্দোনেশিয়া",
        category: "Nature", categoryBn: "প্রকৃতি",
        tourType: "Family Tour", tourTypeBn: "ফ্যামিলি ট্যুর",
        duration: "08 Days", durationBn: "০৮ দিন",
        price: 650.00,
        oldPrice: 750.00,
        rating: 4.7,
        reviews: 156,
        image: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1200",
        description: "Discover the spiritual heart of Bali, lush rice terraces, and pristine beaches.",
        descriptionBn: "বালির আধ্যাত্মিক হৃদয়, সবুজ ধানের সিঁড়ি এবং অকলুষ সমুদ্র সৈকত আবিষ্কার করুন।",
        longDescription: "Bali Explorer is an 8-day immersive journey through Indonesia's Island of the Gods. Visit ancient temples, trek through emerald rice paddies in Ubud, surf the waves of Kuta, and snorkel in the crystal-clear waters of Nusa Penida. This family-friendly tour balances adventure with relaxation.",
        longDescriptionBn: "বালি এক্সপ্লোরার হল ইন্দোনেশিয়ার দেবতাদের দ্বীপের মধ্য দিয়ে ৮ দিনের নিমজ্জিত যাত্রা। প্রাচীন মন্দির পরিদর্শন করুন, উবুদের পান্না রঙের ধানক্ষেতে ট্রেক করুন, কুটার ঢেউয়ে সার্ফ করুন।",
        featured: false,
        tags: ["Spiritual", "Tropical", "Budget"],
        groupSize: "Max 15", groupSizeBn: "সর্বোচ্চ ১৫",
        included: [
            { en: "Resort accommodation", bn: "রিসোর্ট থাকা" },
            { en: "Daily breakfast & 3 dinners", bn: "দৈনিক সকালের খাবার ও ৩ ডিনার" },
            { en: "All temple entrance fees", bn: "সকল মন্দির প্রবেশ মূল্য" },
            { en: "Snorkeling gear", bn: "স্নোরকেলিং গিয়ার" },
            { en: "Private driver", bn: "প্রাইভেট ড্রাইভার" },
        ],
        itinerary: [
            { day: 1, title: "Arrival in Bali", titleBn: "বালিতে আগমন", desc: "Airport pickup, welcome drink, resort check-in.", descBn: "বিমানবন্দর পিকআপ, ওয়েলকাম ড্রিংক, রিসোর্ট চেক-ইন।" },
            { day: 2, title: "Ubud Cultural Day", titleBn: "উবুদ সাংস্কৃতিক দিন", desc: "Monkey Forest, rice terraces, art galleries.", descBn: "মাঙ্কি ফরেস্ট, ধানের সিঁড়ি, আর্ট গ্যালারি।" },
            { day: 3, title: "Temple Tour", titleBn: "মন্দির ভ্রমণ", desc: "Tanah Lot and Uluwatu temple visits.", descBn: "তানাহ লট ও উলুওয়াতু মন্দির পরিদর্শন।" },
            { day: 4, title: "Nusa Penida", titleBn: "নুসা পেনিদা", desc: "Snorkeling with manta rays, Kelingking Beach.", descBn: "মান্তা রে'র সাথে স্নোরকেলিং, কেলিংকিং বিচ।" },
            { day: 5, title: "Mt. Batur Sunrise", titleBn: "মাউন্ট বাতুর সানরাইজ", desc: "Early morning hike, hot springs.", descBn: "ভোরের হাইকিং, হট স্প্রিংস।" },
            { day: 6, title: "Beach & Surf", titleBn: "বিচ ও সার্ফ", desc: "Kuta beach, surfing lesson, spa time.", descBn: "কুটা বিচ, সার্ফিং পাঠ, স্পা সময়।" },
            { day: 7, title: "Free Day", titleBn: "ফ্রি দিন", desc: "Relax at resort or explore on your own.", descBn: "রিসোর্টে বিশ্রাম বা নিজে অন্বেষণ।" },
            { day: 8, title: "Departure", titleBn: "প্রস্থান", desc: "Breakfast, checkout, airport transfer.", descBn: "সকালের খাবার, চেক-আউট, বিমানবন্দর ট্রান্সফার।" },
        ],
        faqs: [
            { q: "Is Bali safe for families?", qBn: "বালি কি পরিবারের জন্য নিরাপদ?", a: "Yes, Bali is very family-friendly and safe for tourists.", aBn: "হ্যাঁ, বালি পরিবার-বান্ধব এবং পর্যটকদের জন্য নিরাপদ।" },
            { q: "Do I need a visa?", qBn: "আমার কি ভিসা দরকার?", a: "Most nationalities get visa on arrival for 30 days.", aBn: "বেশিরভাগ জাতীয়তা ৩০ দিনের জন্য আগমনে ভিসা পায়।" },
        ]
    },
];

export default function TourDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const isBn = language === 'bn';
    const fontFamily = isBn ? 'Hind Siliguri, sans-serif' : 'Poppins, sans-serif';
    const headingFont = isBn ? 'Hind Siliguri, sans-serif' : 'Teko, sans-serif';

    const tour = tourData.find(t => t.id === parseInt(id));
    const relatedTours = tourData.filter(t => t.id !== parseInt(id)).slice(0, 3);

    if (!tour) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-gray-300 uppercase" style={{ fontFamily: headingFont }}>
                        {isBn ? 'ট্যুর পাওয়া যায়নি' : 'Tour Not Found'}
                    </h1>
                    <Link href="/tour" className="mt-4 inline-block text-sm font-bold text-[#EF8C2C] hover:underline" style={{ fontFamily }}>
                        {isBn ? 'ট্যুর পেজে ফিরুন' : 'Back to Tours'}
                    </Link>
                </div>
            </div>
        );
    }

    const savings = tour.oldPrice - tour.price;

    return (
        <div className="bg-[#F9FAFB] min-h-screen">
            <div className="h-16" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-20">

                {/* Breadcrumb */}
                <motion.nav
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-[12px] text-gray-400 mb-6"
                    style={{ fontFamily }}
                >
                    <Link href="/" className="hover:text-gray-700 transition-colors">{isBn ? 'হোম' : 'Home'}</Link>
                    <LuChevronRight size={12} />
                    <Link href="/tour" className="hover:text-gray-700 transition-colors">{isBn ? 'ট্যুর' : 'Tour'}</Link>
                    <LuChevronRight size={12} />
                    <span className="text-gray-700 font-semibold">{isBn ? tour.titleBn : tour.title}</span>
                </motion.nav>

                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden mb-10"
                >
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-grow p-6 md:p-10 flex flex-col justify-center">
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
                                {tour.featured && (
                                    <span className="px-2.5 py-1 bg-[#EF8C2C] text-white text-[8px] font-bold uppercase tracking-widest rounded-md">
                                        {isBn ? 'ফিচার্ড' : 'Featured'}
                                    </span>
                                )}
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[8px] font-bold uppercase tracking-widest rounded-md">
                                    {isBn ? tour.categoryBn : tour.category}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <LuMapPin size={14} className="text-[#EF8C2C]" />
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily }}>
                                    {isBn ? tour.locationBn : tour.location}
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight leading-none mb-3" style={{ fontFamily: headingFont }}>
                                {isBn ? tour.titleBn : tour.title}
                            </h1>

                            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-lg" style={{ fontFamily }}>
                                {isBn ? tour.descriptionBn : tour.description}
                            </p>

                            {/* Rating + Price */}
                            <div className="flex items-center gap-6 flex-wrap">
                                <div className="flex items-center gap-1.5">
                                    <LuStar size={16} className="text-[#EF8C2C] fill-[#EF8C2C]" />
                                    <span className="text-sm font-bold text-gray-800">{tour.rating}</span>
                                    <span className="text-[11px] text-gray-400">({tour.reviews} {isBn ? 'রিভিউ' : 'reviews'})</span>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black" style={{ color: '#3590CF', fontFamily: headingFont }}>
                                            ${tour.price.toFixed(2)}
                                        </span>
                                        <span className="text-base text-gray-300 line-through">${tour.oldPrice.toFixed(2)}</span>
                                    </div>
                                    <p className="text-[11px] text-green-600 font-bold mt-0.5" style={{ fontFamily }}>
                                        {isBn ? `আপনি $${savings.toFixed(2)} সাশ্রয় করছেন` : `You save $${savings.toFixed(2)}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="w-9 h-9 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                        <LuHeart size={15} />
                                    </button>
                                    <button className="w-9 h-9 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#3590CF] hover:bg-blue-50 transition-all">
                                        <LuShare2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-[420px] flex-shrink-0 flex items-center justify-center p-5">
                            <div className="w-full h-full min-h-[240px] relative overflow-hidden rounded-md">
                                <img
                                    src={tour.image}
                                    alt={isBn ? tour.titleBn : tour.title}
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-grow min-w-0 space-y-8">

                        {/* Quick Stats */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: LuClock, label: isBn ? 'সময়কাল' : 'Duration', value: isBn ? tour.durationBn : tour.duration },
                                { icon: LuUsers, label: isBn ? 'গ্রুপ সাইজ' : 'Group Size', value: isBn ? tour.groupSizeBn : tour.groupSize },
                                { icon: LuPlane, label: isBn ? 'ট্যুর টাইপ' : 'Tour Type', value: isBn ? tour.tourTypeBn : tour.tourType },
                                { icon: LuStar, label: isBn ? 'রেটিং' : 'Rating', value: `${tour.rating} ★` },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-md border border-gray-100 p-4 text-center shadow-sm">
                                    <item.icon size={20} className="mx-auto mb-2 text-[#EF8C2C]" />
                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1" style={{ fontFamily }}>{item.label}</p>
                                    <p className="text-sm font-bold text-gray-800" style={{ fontFamily }}>{item.value}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* About */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-md border border-gray-100 p-6 md:p-8 shadow-sm">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4 leading-none" style={{ fontFamily: headingFont }}>
                                {isBn ? 'বিস্তারিত তথ্য' : 'About This Tour'}
                            </h2>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4" style={{ fontFamily }}>
                                {isBn ? tour.longDescriptionBn : tour.longDescription}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {tour.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-bold text-gray-500 uppercase tracking-wider">{tag}</span>
                                ))}
                            </div>
                        </motion.section>

                        {/* Itinerary */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-md border border-gray-100 p-6 md:p-8 shadow-sm">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6 leading-none" style={{ fontFamily: headingFont }}>
                                {isBn ? 'ভ্রমণসূচি' : 'Itinerary'}
                            </h2>
                            <div className="space-y-0">
                                {tour.itinerary.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#EF8C2C' }}>
                                                {item.day}
                                            </div>
                                            {idx < tour.itinerary.length - 1 && (
                                                <div className="w-px h-10 bg-gray-100" />
                                            )}
                                        </div>
                                        <div className="pt-1 pb-5">
                                            <p className="text-sm font-bold text-gray-800 mb-1" style={{ fontFamily }}>{isBn ? item.titleBn : item.title}</p>
                                            <p className="text-[12px] text-gray-400" style={{ fontFamily }}>{isBn ? item.descBn : item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* What's Included */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-md border border-gray-100 p-6 md:p-8 shadow-sm">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6 leading-none" style={{ fontFamily: headingFont }}>
                                {isBn ? 'কী কী অন্তর্ভুক্ত' : "What's Included"}
                            </h2>
                            <div className="space-y-3">
                                {tour.included.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 py-2.5 px-4 bg-gray-50 rounded-md">
                                        <LuCircleCheck size={16} className="text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 font-medium" style={{ fontFamily }}>
                                            {isBn ? item.bn : item.en}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* FAQs */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-md border border-gray-100 p-6 md:p-8 shadow-sm">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6 leading-none" style={{ fontFamily: headingFont }}>
                                {isBn ? 'সাধারণ জিজ্ঞাসা' : 'Frequently Asked Questions'}
                            </h2>
                            <div className="space-y-4">
                                {tour.faqs.map((faq, idx) => (
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

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-[360px] flex-shrink-0">
                        <div className="lg:sticky lg:top-32 space-y-5">

                            {/* Booking Card */}
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-md border border-gray-100 p-6 shadow-sm">
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-4xl font-black" style={{ color: '#3590CF', fontFamily: headingFont }}>
                                        ${tour.price.toFixed(2)}
                                    </span>
                                    <span className="text-lg text-gray-300 line-through font-medium">${tour.oldPrice.toFixed(2)}</span>
                                </div>
                                <p className="text-[11px] text-green-600 font-bold mb-6" style={{ fontFamily }}>
                                    {isBn ? `৳${savings.toFixed(2)} সাশ্রয়` : `Save $${savings.toFixed(2)}`} · {isBn ? 'প্রতি জন' : 'per person'}
                                </p>

                                <div className="space-y-3 mb-6">
                                    {[
                                        { label: isBn ? 'সময়কাল' : 'Duration', value: isBn ? tour.durationBn : tour.duration },
                                        { label: isBn ? 'ট্যুর টাইপ' : 'Type', value: isBn ? tour.tourTypeBn : tour.tourType },
                                        { label: isBn ? 'গ্রুপ সাইজ' : 'Group Size', value: isBn ? tour.groupSizeBn : tour.groupSize },
                                        { label: isBn ? 'রেটিং' : 'Rating', value: `${tour.rating} (${tour.reviews})` },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                            <span className="text-[12px] text-gray-400 font-medium" style={{ fontFamily }}>{item.label}</span>
                                            <span className="text-[12px] text-gray-800 font-bold" style={{ fontFamily }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-3.5 rounded-md text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:shadow-lg hover:shadow-[#EF8C2C]/20" style={{ backgroundColor: '#EF8C2C', fontFamily }}>
                                    {isBn ? 'এখনই বুক করুন' : 'Book Now'}
                                </button>
                                <button className="w-full mt-3 py-3.5 rounded-md text-[11px] font-bold uppercase tracking-widest border-2 transition-all hover:bg-gray-50" style={{ borderColor: '#3590CF', color: '#3590CF', fontFamily }}>
                                    {isBn ? 'কাস্টম প্ল্যান' : 'Custom Plan'}
                                </button>
                            </motion.div>

                            {/* Why Choose Us */}
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-md border border-gray-100 p-6 shadow-sm">
                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-4 leading-none" style={{ fontFamily: headingFont }}>
                                    {isBn ? 'কেন আমাদের বেছে নেবেন' : 'Why Choose Us'}
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { icon: LuShieldCheck, text: isBn ? 'সম্পূর্ণ নিরাপদ ভ্রমণ' : '100% Safe Travel' },
                                        { icon: LuUsers, text: isBn ? '১০,০০০+ খুশি ভ্রমণকারী' : '10,000+ Happy Travelers' },
                                        { icon: LuCamera, text: isBn ? 'পেশাদার গাইড' : 'Professional Guides' },
                                        { icon: LuStar, text: isBn ? '৫-তারা অভিজ্ঞতা' : '5-Star Experiences' },
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

                            {/* Contact */}
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-md p-6 relative overflow-hidden" style={{ backgroundColor: '#021E14' }}>
                                <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(239,140,44,0.15)' }} />
                                <div className="relative z-10">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#EF8C2C' }}>
                                        {isBn ? 'সাহায্য দরকার?' : 'Need Help?'}
                                    </p>
                                    <p className="text-sm font-bold text-white mb-1" style={{ fontFamily }}>
                                        {isBn ? 'ট্যুর বিশেষজ্ঞের সাথে কথা বলুন' : 'Talk to a Tour Expert'}
                                    </p>
                                    <p className="text-[11px] text-white/40 leading-relaxed mb-5" style={{ fontFamily }}>
                                        {isBn ? 'কাস্টম ট্যুর প্ল্যান করতে আমাদের সাথে যোগাযোগ করুন।' : 'Contact us to customize your perfect tour package.'}
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

                {/* Related Tours */}
                <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-8 leading-none" style={{ fontFamily: headingFont }}>
                        {isBn ? 'আরো ট্যুর ' : 'More Tour '}<span style={{ color: '#EF8C2C' }}>{isBn ? 'দেখুন' : 'Options'}</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {relatedTours.map((rt, idx) => (
                            <Link href={`/tour/${rt.id}`} key={rt.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.08 }}
                                    className="group bg-white rounded-md overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={rt.image}
                                            alt={isBn ? rt.titleBn : rt.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                            <LuMapPin size={11} className="text-[#EF8C2C]" />
                                            <span className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow" style={{ fontFamily }}>
                                                {isBn ? rt.locationBn : rt.location}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#3590CF] transition-colors mb-1 line-clamp-1" style={{ fontFamily }}>
                                            {isBn ? rt.titleBn : rt.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-black" style={{ color: '#3590CF', fontFamily: headingFont }}>${rt.price.toFixed(2)}</span>
                                                <span className="text-[10px] text-gray-300 line-through">${rt.oldPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <LuStar size={12} className="text-[#EF8C2C] fill-[#EF8C2C]" />
                                                <span className="text-[11px] font-bold text-gray-700">{rt.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.section>
            </div>

            {/* Bottom CTA */}
            <section className="bg-white border-t border-gray-100 py-12 md:py-20">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-5 leading-none" style={{ fontFamily: headingFont }}>
                        {isBn ? 'অ্যাডভেঞ্চার শুরু করুন' : 'Start Your Adventure'}
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed" style={{ fontFamily }}>
                        {isBn ? 'আজই আপনার স্বপ্নের ট্যুর বুক করুন। আমাদের বিশেষজ্ঞ দল সবকিছু সাজিয়ে দেবে।' : 'Book your dream tour today. Our expert team will arrange everything for you.'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-10 py-4 rounded-md text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:shadow-lg hover:shadow-[#EF8C2C]/20 hover:-translate-y-0.5" style={{ backgroundColor: '#EF8C2C', fontFamily }}>
                            {isBn ? 'এখনই বুক করুন' : 'Book Now'}
                        </button>
                        <button className="px-10 py-4 rounded-md text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: '#021E14', fontFamily }}>
                            {isBn ? 'যোগাযোগ করুন' : 'Contact Us'}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
