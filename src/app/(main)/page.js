"use client";

import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LuMousePointerClick,
  LuTag,
  LuAccessibility,
  LuArrowRight,
  LuGlobe,
  LuShieldCheck,
  LuCompass,
  LuPlane,
  LuMap,
  LuRocket,
  LuTarget,
  LuAward
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const [currentImg, setCurrentImg] = useState(0);
  const { t, language } = useLanguage();
  const bnFont = language === 'bn' ? 'Hind Siliguri, sans-serif' : undefined;
  const headingFont = language === 'bn' ? 'Hind Siliguri, sans-serif' : 'Teko, sans-serif';

  const consultingImages = [
    "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % consultingImages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Why Choose Us cards
  const whyChooseCards = [
    { title: t('expertGuidance'), desc: t('expertGuidanceDesc'), icon: "🎯", color: "#1D7EDD" },
    { title: t('fastProcessing'), desc: t('fastProcessingDesc'), icon: "⚡", color: "#EF8C2C" },
    { title: t('support247'), desc: t('support247Desc'), icon: "💬", color: "#10B981" },
    { title: t('affordablePrices'), desc: t('affordablePricesDesc'), icon: "💰", color: "#8B5CF6" },
    { title: t('fiftyCountries'), desc: t('fiftyCountriesDesc'), icon: "🌏", color: "#3590CF" },
    { title: t('successRate'), desc: t('successRateDesc'), icon: "✅", color: "#EF4444" },
  ];

  // Stats
  const stats = [
    { num: "10+", label: t('yearsExperience'), color: "#1D7EDD" },
    { num: "10K+", label: t('visasProcessed'), color: "#EF8C2C" },
    { num: "98%", label: t('statSuccessRate'), color: "#10B981" },
    { num: "50+", label: t('countriesCovered'), color: "#8B5CF6" },
    { num: "24/7", label: t('customerSupport'), color: "#3590CF" },
  ];

  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Services />

      {/* --- TRUSTED PARTNERS CAROUSEL --- */}
      <section className="py-12 bg-white overflow-hidden border-b border-gray-100">
        <div className="relative flex overflow-x-hidden">
          <motion.div
            className="flex gap-12 items-center whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-12">
                {/* Logo 1 */}
                <div className="flex items-center gap-3 transition-all cursor-default group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LuPlane className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 uppercase" style={{ fontFamily: 'Teko, sans-serif' }}>G-FLY GLOBAL</span>
                </div>
                {/* Logo 2 */}
                <div className="flex items-center gap-3 transition-all cursor-default group">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LuCompass className="w-6 h-6 text-secondary" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 uppercase" style={{ fontFamily: 'Teko, sans-serif' }}>TRAVERSE</span>
                </div>
                {/* Logo 3 */}
                <div className="flex items-center gap-3 transition-all cursor-default group">
                  <div className="w-10 h-10 bg-[#3590CF]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LuGlobe className="w-6 h-6 text-[#3590CF]" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 uppercase" style={{ fontFamily: 'Teko, sans-serif' }}>TRIPZONE</span>
                </div>
                {/* Logo 4 */}
                <div className="flex items-center gap-3 transition-all cursor-default group">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LuMap className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 uppercase" style={{ fontFamily: 'Teko, sans-serif' }}>BORCELLE</span>
                </div>
                {/* Logo 5 */}
                <div className="flex items-center gap-3 transition-all cursor-default group">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LuShieldCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 uppercase" style={{ fontFamily: 'Teko, sans-serif' }}>TRAVEL TRUST</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- BENEFITS & FEATURES CARDS --- */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#EF8C2C]" />
              <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#EF8C2C]/15 bg-[#EF8C2C]/[0.05]">
                <span className="text-[#EF8C2C] text-xs font-semibold tracking-[0.25em] uppercase" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>{t('whyUs')}</span>
              </div>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#EF8C2C]" />
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-[#0F172A] uppercase tracking-tight leading-[0.85]" style={{ fontFamily: headingFont }}>
              {t('ourBenefits')} <span className="text-[#1D7EDD]">{t('benefitsHighlight')}</span>
            </h2>
            <p className="text-gray-400 text-sm mt-3 max-w-md mx-auto" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>
              {t('benefitsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* One Click Booking */}
            <motion.div
              whileHover={{ y: -10 }}
              className="p-10 rounded-xl bg-[#E8F5E9] border border-green-100 flex flex-col relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-green-200/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 z-10">
                <LuMousePointerClick className="w-8 h-8 text-[#00E676] animate-bounce" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 z-10" style={{ fontFamily: headingFont }}>{t('oneClickBooking')}</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed mb-6 z-10" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>
                {t('oneClickBookingDesc')}
              </p>
              <Link href="/tour" className="mt-auto flex items-center gap-2 text-[#00E676] group/link cursor-pointer">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: bnFont }}>{t('learnMore')}</span>
                <LuArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Discount & Offer */}
            <motion.div
              whileHover={{ y: -10 }}
              className="p-10 rounded-xl bg-[#E3F2FD] border border-blue-100 flex flex-col relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-200/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 z-10">
                <LuTag className="w-8 h-8 text-[#2196F3] rotate-12 group-hover:rotate-0 transition-transform" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 z-10" style={{ fontFamily: headingFont }}>{t('discountOffer')}</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed mb-6 z-10" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>
                {t('discountOfferDesc')}
              </p>
              <Link href="/contact" className="mt-auto flex items-center gap-2 text-[#2196F3] group/link cursor-pointer">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: bnFont }}>{t('viewOffers')}</span>
                <LuArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Local Expertise */}
            <motion.div
              whileHover={{ y: -10 }}
              className="p-10 rounded-xl bg-[#FFF9C4] border border-yellow-100 flex flex-col relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-yellow-200/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 z-10">
                <LuAccessibility className="w-8 h-8 text-[#FBC02D] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 z-10" style={{ fontFamily: headingFont }}>{t('localExpertise')}</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed mb-6 z-10" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>
                {t('localExpertiseDesc')}
              </p>
              <Link href="/about" className="mt-auto flex items-center gap-2 text-[#FBC02D] group/link cursor-pointer">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: bnFont }}>{t('meetExperts')}</span>
                <LuArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white/50 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-2 rounded-2xl sm:rounded-full border border-gray-100 shadow-sm">
              <span className="text-[11px] text-gray-500 font-medium text-center sm:text-left" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>{t('customizeNote')}</span>
              <Link href="/contact" className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-md whitespace-nowrap" style={{ fontFamily: bnFont }}>
                {t('customizePackage')} <LuArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONSULTATION BANNER --- */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-[55%] text-center lg:text-left"
            >
              {/* Badge */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="h-[1px] w-8 lg:w-10 bg-gradient-to-r from-transparent to-[#EF8C2C]" />
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EF8C2C]/15 bg-[#EF8C2C]/[0.05]">
                  <span className="text-[#EF8C2C] text-[9px] lg:text-[10px] font-semibold tracking-[0.2em] lg:tracking-[0.25em] uppercase" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>{t('consultTag')}</span>
                </div>
                <div className="h-[1px] w-8 lg:w-10 bg-gradient-to-l from-transparent to-[#EF8C2C]" />
              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0F172A] leading-[1] mb-6 tracking-tight" style={{ fontFamily: headingFont }}>
                {t('consultTitle')}<br />
                <span className="text-[#1D7EDD]">{t('consultTitleHighlight')}</span> {t('consultTitleEnd')}
              </h2>

              <p className="text-gray-400 text-sm mb-8 mx-auto lg:mx-0 max-w-lg leading-relaxed" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>
                {t('consultDesc')}
              </p>

              {/* Experience Block */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-5 mb-10 p-5 rounded-2xl bg-[#F8F9FA] border border-gray-100">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop"
                    alt="Experience"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-black text-[#0F172A] mb-1 text-center lg:text-left" style={{ fontFamily: headingFont }}>
                    {t('experienceTitle')}
                  </h4>
                  <p className="text-gray-400 text-[12px] leading-relaxed text-center lg:text-left" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>
                    {t('experienceDesc')}
                  </p>
                </div>
              </div>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-5">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 bg-[#1D7EDD] text-white px-7 py-3.5 rounded-full font-bold transition-all group hover:shadow-[0_8px_30px_rgba(29,126,221,0.25)]"
                  >
                    <span className="text-xs uppercase tracking-[0.1em]" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>{t('exploreMore')}</span>
                    <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>

                {/* Agent Avatars */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    {['#1D7EDD', '#EF8C2C', '#10B981', '#8B5CF6'].map((color, i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                        style={{ backgroundColor: color }}
                      >
                        {['S', 'A', 'R', 'K'][i]}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-[#0F172A]" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>200+ <span className="text-gray-400 font-normal">{t('realAgents')}</span></span>
                </div>
              </div>
            </motion.div>

            {/* Right - Two Overlapping Images */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-[45%] relative mt-8 lg:mt-0"
            >
              <div className="relative min-h-[350px] sm:min-h-[420px] lg:min-h-[460px]">
                {/* Image 2 - Person (Left, full height) */}
                <div className="absolute top-0 left-0 w-[45%] sm:w-[35%] h-[350px] sm:h-[450px] overflow-visible z-20">
                  <img
                    src="/images/img02.png"
                    alt="Immigration Services"
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Image 1 - Passport (Right, shorter) */}
                <div className="absolute top-[30px] lg:top-[30px] right-0 w-[75%] sm:w-[85%] h-[280px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden shadow-xl z-10">
                  <img
                    src="/images/img01.png"
                    alt="Visa Consultation"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 px-4 bg-[#F8FAFC] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-30 blur-[120px]" style={{ background: 'radial-gradient(circle, #1D7EDD15, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-20 blur-[100px]" style={{ background: 'radial-gradient(circle, #EF8C2C15, transparent)' }} />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Centered Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#EF8C2C]" />
              <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#EF8C2C]/15 bg-[#EF8C2C]/[0.05]">
                <span className="text-[#EF8C2C] text-xs font-semibold tracking-[0.25em] uppercase" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>{t('whyVisaPro')}</span>
              </div>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#EF8C2C]" />
            </div>
            <h2
              className="text-3xl md:text-6xl font-bold mb-4"
              style={{ fontFamily: headingFont, color: '#111827', textTransform: 'uppercase' }}
            >
              {t('whyChoose')} <span style={{ color: '#EF8C2C' }}>{t('us')}</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>
              {t('whyChooseDesc')}
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseCards.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl cursor-default"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}10` }}
                >
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-[#0F172A] mb-2" style={{ fontFamily: headingFont, textTransform: 'uppercase' }}>
                  {item.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Bottom Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap items-center justify-center lg:justify-between gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3 lg:gap-4">
                  <div className="w-1 h-8 lg:h-10 rounded-full" style={{ backgroundColor: stat.color }} />
                  <div>
                    <div className="text-xl lg:text-2xl font-black text-[#0F172A]" style={{ fontFamily: 'Teko, sans-serif' }}>{stat.num}</div>
                    <div className="text-[9px] lg:text-[10px] text-gray-400 font-medium uppercase tracking-wider" style={{ fontFamily: bnFont || 'Poppins, sans-serif' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

    </div>
  );
}
