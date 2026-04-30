"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Default fallback so components never get undefined values during initial render
const DEFAULTS = {
    contactPhone: "+8801712114770",
    contactPhoneAlt: "",
    contactEmail: "support@visapro.com.bd",
    whatsappNumber: "8801712114770",
    address: "25/4, 4th Floor, Panthpath, Dhaka",
    addressBn: "২৫/৪, ৪র্থ তলা, পান্থপথ, ঢাকা",

    // Working Hours
    workingDays: "Sat - Thu: Open",
    workingDaysBn: "শনি - বৃহঃ: খোলা",
    workingHours: "9:30 AM - 8:30 PM",
    workingHoursBn: "সকাল ৯:৩০ - রাত ৮:৩০",

    // Map
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902633038936!2d90.38531!3d23.7508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b0acc6aed9%3A0xc3f8e58f00d3d540!2sPanthapath%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1704000000000!5m2!1sen!2sbd",
    mapLabel: "PANTHPATH, DHAKA",
    mapLabelBn: "পান্থপথ, ঢাকা",

    // Stats
    visaSuccessRate: "98%",
    countriesCount: "50+",
    happyClientsCount: "10K+",

    social: {
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
        linkedin: "",
        tiktok: "",
    },
};

const SiteSettingsContext = createContext({
    settings: DEFAULTS,
    loading: true,
    refetch: () => {},
});

export function SiteSettingsProvider({ children }) {
    const [settings, setSettings] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/settings`);
            const data = await res.json();
            if (data.success && data.data) {
                setSettings({
                    ...DEFAULTS,
                    ...data.data,
                    social: { ...DEFAULTS.social, ...(data.data.social || {}) },
                });
            }
        } catch (err) {
            console.error("Failed to fetch site settings:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, refetch: fetchSettings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}

// Helpers
export function buildWhatsAppUrl(number, message = "") {
    const digits = (number || "").replace(/\D/g, "");
    const text = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${digits}${text}`;
}

export function buildTelUrl(phone) {
    return `tel:${(phone || "").replace(/[^\d+]/g, "")}`;
}

export function buildMailUrl(email) {
    return `mailto:${email || ""}`;
}
