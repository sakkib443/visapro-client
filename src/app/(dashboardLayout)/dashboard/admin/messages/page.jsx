"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";
import {
    FiMessageCircle, FiSearch, FiLoader, FiUser, FiClock,
    FiCheck, FiCheckCircle, FiInbox
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState("all");
    const token = useSelector(selectToken);

    // Fetch messages (admin only) on mount, newest first from the backend.
    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/api/messages`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const data = await res.json();
                if (res.ok && data.success && Array.isArray(data.data)) {
                    setMessages(data.data);
                } else {
                    setMessages([]);
                }
            } catch {
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [token]);

    const markAsRead = (id) => {
        // Optimistic local update
        setMessages(prev => prev.map(m => m._id === id ? { ...m, status: "read" } : m));
        // Persist to backend (admin only)
        fetch(`${API_BASE}/api/messages/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ status: "read" }),
        }).catch(() => { });
    };

    const filtered = messages.filter(m => {
        if (filter === "all") return true;
        return m.status === filter;
    });

    const unreadCount = messages.filter(m => m.status === "unread").length;

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="p-6 lg:p-8 h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg relative">
                        <FiMessageCircle className="text-white text-xl" />
                        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
                        <p className="text-sm text-gray-500">{unreadCount} unread</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* List */}
                <div className="w-full md:w-1/3 flex flex-col">
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {["all", "unread", "read", "replied"].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${filter === f ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{f}</button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2">
                        {loading ? (
                            <div className="flex justify-center py-10"><FiLoader className="animate-spin text-primary" size={24} /></div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <FiInbox size={40} className="mx-auto mb-2 opacity-50" />
                                <p>No messages</p>
                            </div>
                        ) : (
                            filtered.map((msg) => (
                                <button
                                    key={msg._id}
                                    onClick={() => { setSelected(msg); markAsRead(msg._id); }}
                                    className={`w-full text-left p-4 rounded-xl transition-all ${selected?._id === msg._id ? "bg-primary-10 border-primary" : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"} border ${msg.status === "unread" ? "border-primary/30" : "border-gray-100 dark:border-gray-700"}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                                                {msg.from?.firstName?.[0]}{msg.from?.lastName?.[0]}
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white text-sm">{msg.from?.firstName}</span>
                                        </div>
                                        {msg.status === "unread" && <span className="w-2 h-2 bg-primary rounded-full" />}
                                        {msg.status === "replied" && <FiCheckCircle className="text-emerald-500" size={14} />}
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate mb-1">{msg.subject}</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500 truncate flex-1">{msg.message}</p>
                                        <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{timeAgo(msg.createdAt)}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Detail */}
                <div className="hidden md:flex flex-1 flex-col card overflow-hidden">
                    {selected ? (
                        <>
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                        {selected.from?.firstName?.[0]}{selected.from?.lastName?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{selected.from?.firstName} {selected.from?.lastName}</p>
                                        <p className="text-sm text-gray-500">{selected.from?.email}</p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selected.subject}</h3>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto">
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{selected.message}</p>
                            </div>
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-center text-xs text-gray-400">Replying is not available yet.</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <FiMessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Select a message to view</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
