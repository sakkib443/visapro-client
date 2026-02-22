"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import {
    LuTicket,
    LuPlane,
    LuBed,
    LuMapPin,
    LuMoon,
    LuGraduationCap,
    LuArrowRight,
    LuArrowUpRight,
    LuSparkles,
    LuChevronLeft,
    LuChevronRight,
    LuGlobe
} from "react-icons/lu";

import "swiper/css";
import "swiper/css/navigation";

const services = [
    {
        title: "Visa Processing",
        subtitle: "WORLDWIDE",
        description: "Expert assistance for tourist, business, and study visas worldwide with a proven track record of success.",
        icon: <LuTicket />,
        image: "https://images.unsplash.com/photo-1544016768-982d1554f0b9?w=800&fit=crop",
        color: "#1D7EDD",
        stats: "50+ Countries"
    },
    {
        title: "Flight Booking",
        subtitle: "DOMESTIC & INT'L",
        description: "Best available fares for all major airlines. Instant booking and 24/7 support for seamless travel.",
        icon: <LuPlane />,
        image: "https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=800",
        color: "#EF8C2C",
        stats: "200+ Airlines"
    },
    {
        title: "Hotel Booking",
        subtitle: "WORLDWIDE STAY",
        description: "Curated selection of luxury to budget hotels globally. Transit stays also available.",
        icon: <LuBed />,
        image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800",
        color: "#10B981",
        stats: "5000+ Hotels"
    },
    {
        title: "Tour Packages",
        subtitle: "CUSTOM PLANNING",
        description: "Customized holiday packages tailored to your preferences, budget, and dreams.",
        icon: <LuMapPin />,
        image: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
        color: "#8B5CF6",
        stats: "100+ Packages"
    },
    {
        title: "Hajj & Umrah",
        subtitle: "SPIRITUAL JOURNEY",
        description: "Dedicated packages for Hajj & Umrah with convenient flights and close-to-haram stays.",
        icon: <LuMoon />,
        image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&fit=crop",
        color: "#F59E0B",
        stats: "Premium Packages"
    },
    {
        title: "Study Abroad",
        subtitle: "GLOBAL EDUCATION",
        description: "Complete guidance for university selection, admission, and student visa processing.",
        icon: <LuGraduationCap />,
        image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800",
        color: "#EC4899",
        stats: "30+ Universities"
    }
];

export default function Services() {
    return (
        <section className="relative py-28 overflow-hidden bg-[#F8FAFC]">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.4]" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)',
                backgroundSize: '40px 40px'
            }} />

            {/* Soft Decorative Orbs */}
            <div className="absolute top-0 right-[5%] w-[500px] h-[500px] rounded-full opacity-40 blur-[120px]" style={{ background: 'radial-gradient(circle, #1D7EDD20, transparent)' }} />
            <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] rounded-full opacity-30 blur-[120px]" style={{ background: 'radial-gradient(circle, #EF8C2C20, transparent)' }} />

            {/* Floating Particles */}
            <motion.div
                animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] right-[15%] w-3 h-3 rounded-full bg-blue-300/20"
            />
            <motion.div
                animate={{ y: [15, -15, 15], rotate: [360, 180, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[25%] left-[20%] w-2 h-2 rounded-full bg-orange-300/20"
            />

            <div className="max-w-[1440px] mx-auto px-4 md:px-10 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-3 mb-5"
                    >
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#EF8C2C]" />
                        <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#EF8C2C]/15 bg-[#EF8C2C]/[0.05]">
                            <LuSparkles className="text-[#EF8C2C] text-sm" />
                            <span className="text-[#EF8C2C] text-xs font-semibold tracking-[0.25em] uppercase" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                Premium Solutions
                            </span>
                        </div>
                        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#EF8C2C]" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-6xl font-black text-[#0F172A] uppercase tracking-tight leading-[0.85]"
                        style={{ fontFamily: '"Teko", sans-serif' }}
                    >
                        Our <span className="text-[#1D7EDD]">Services</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-sm max-w-lg mx-auto mt-5 leading-relaxed"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                        End-to-end travel and immigration solutions crafted with expertise.
                    </motion.p>

                </div>

                {/* Carousel */}
                <Swiper
                    modules={[Autoplay, Navigation]}
                    spaceBetween={24}
                    slidesPerView={1}
                    loop={true}
                    speed={800}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    navigation={{
                        prevEl: ".services-prev",
                        nextEl: ".services-next",
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1400: { slidesPerView: 4 },
                    }}
                >
                    {services.map((service, index) => (
                        <SwiperSlide key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08, duration: 0.5 }}
                                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100/80 hover:border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-700 h-full flex flex-col"
                            >
                                {/* Image Section */}
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                    {/* Colored accent strip at top */}
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }}
                                    />

                                    {/* Icon Badge */}
                                    <div className="absolute top-4 left-4">
                                        <div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                                            style={{ background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)` }}
                                        >
                                            {service.icon}
                                        </div>
                                    </div>

                                    {/* Stats Pill */}
                                    <div className="absolute top-4 right-4">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white">
                                            <span className="text-[10px] font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                                {service.stats}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Subtitle on image bottom */}
                                    <div className="absolute bottom-4 left-4">
                                        <span className="text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                            {service.subtitle}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-5 flex-grow flex flex-col">
                                    <h3
                                        className="text-2xl font-black text-[#0F172A] uppercase tracking-tight leading-none mb-2 group-hover:translate-x-1 transition-transform duration-500"
                                        style={{ fontFamily: '"Teko", sans-serif' }}
                                    >
                                        {service.title}
                                    </h3>

                                    <p className="text-gray-400 text-[12px] leading-relaxed mb-4 flex-grow line-clamp-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                        {service.description}
                                    </p>

                                    {/* Divider */}
                                    <div className="h-[1px] bg-gray-100 mb-3 relative overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 w-0 group-hover:w-full transition-all duration-1000 ease-out"
                                            style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }}
                                        />
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center justify-between">
                                        <button
                                            className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider transition-all duration-300 group-hover:gap-3"
                                            style={{ color: service.color, fontFamily: '"Poppins", sans-serif' }}
                                        >
                                            Learn More
                                            <div
                                                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                                                style={{ backgroundColor: `${service.color}12` }}
                                            >
                                                <LuArrowUpRight className="text-sm" style={{ color: service.color }} />
                                            </div>
                                        </button>

                                        {/* Service Number */}
                                        <span className="text-gray-200 text-3xl font-black select-none" style={{ fontFamily: '"Teko", sans-serif' }}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation Arrows - Below Carousel */}
                <div className="flex items-center justify-center gap-3 mt-10">
                    <button className="services-prev w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1D7EDD] hover:text-[#1D7EDD] hover:bg-[#1D7EDD]/5 transition-all duration-300">
                        <LuChevronLeft className="text-xl" />
                    </button>
                    <button className="services-next w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1D7EDD] hover:text-[#1D7EDD] hover:bg-[#1D7EDD]/5 transition-all duration-300">
                        <LuChevronRight className="text-xl" />
                    </button>
                </div>

                {/* Bottom CTA Row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {['#1D7EDD', '#EF8C2C', '#10B981', '#8B5CF6'].map((color, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-[#F8FAFC] flex items-center justify-center shadow-sm"
                                    style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                                >
                                    <LuGlobe className="text-white text-xs" />
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-400 text-xs" style={{ fontFamily: '"Poppins", sans-serif' }}>
                            <span className="text-gray-700 font-semibold">10,000+</span> happy customers worldwide
                        </p>
                    </div>

                    <button className="group/cta flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#1D7EDD] to-[#3BAAFF] text-white text-xs font-bold uppercase tracking-[0.15em] hover:shadow-[0_8px_32px_rgba(29,126,221,0.3)] transition-all duration-500 hover:-translate-y-0.5" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        View All Services
                        <LuArrowRight className="text-sm group-hover/cta:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
