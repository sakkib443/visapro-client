// ===================================================================
// VisaPro - API Service Layer
// সব API calls এখান থেকে হবে
// ===================================================================

// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Get auth token
const getToken = () => {
    if (typeof window !== "undefined") {
        const auth = localStorage.getItem("visapro-auth");
        if (auth) {
            try {
                return JSON.parse(auth).token;
            } catch {
                return null;
            }
        }
    }
    return null;
};

// Fetch wrapper with auth
export const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        // Auto-logout on 401 (token expired or invalid)
        if (response.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("visapro-auth");
            window.location.href = "/login";
            return;
        }
        const error = new Error(data.message || "Something went wrong");
        error.errorSources = data.errorSources;
        error.data = data;
        throw error;
    }

    return data;
};

// ==================== AUTH SERVICE ====================
export const authService = {
    login: (credentials) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

    register: (userData) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

    getMe: () => apiFetch('/api/users/me'),

    updateProfile: (data) => apiFetch('/api/users/me', { method: 'PATCH', body: JSON.stringify(data) }),

    changePassword: (data) => apiFetch('/api/users/change-password', { method: 'PATCH', body: JSON.stringify(data) }),
};

// ==================== USER SERVICE (Admin) ====================
export const userService = {
    getAll: (params = "") => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/users/admin/all${queryString}`);
    },

    getById: (id) => apiFetch(`/api/users/admin/${id}`),

    create: (data) => apiFetch('/api/users/admin/create', { method: 'POST', body: JSON.stringify(data) }),

    update: (id, data) => apiFetch(`/api/users/admin/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id) => apiFetch(`/api/users/admin/${id}`, { method: 'DELETE' }),

    getStats: () => apiFetch('/api/users/admin/stats'),
};

// ==================== BLOG SERVICE ====================
export const blogService = {
    getAll: (params = "") => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/blogs${queryString}`);
    },

    getById: (id) => apiFetch(`/api/blogs/${id}`),

    getBySlug: (slug) => apiFetch(`/api/blogs/slug/${slug}`),

    create: (data) => apiFetch("/api/blogs", { method: "POST", body: JSON.stringify(data) }),

    update: (id, data) => apiFetch(`/api/blogs/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (id) => apiFetch(`/api/blogs/${id}`, { method: "DELETE" }),
};

// ==================== UPLOAD SERVICE ====================
export const uploadService = {
    uploadImage: async (file) => {
        const token = getToken();
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_BASE}/api/upload/image`, {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Upload failed');
        return data;
    },
};

// ==================== VISA CATEGORY SERVICE ====================
export const visaCategoryService = {
    getAll: (params = "") => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/visa-categories${queryString}`);
    },

    getActive: () => apiFetch('/api/visa-categories/active'),

    getById: (id) => apiFetch(`/api/visa-categories/${id}`),

    getBySlug: (slug) => apiFetch(`/api/visa-categories/slug/${slug}`),

    create: (data) => apiFetch('/api/visa-categories', { method: 'POST', body: JSON.stringify(data) }),

    update: (id, data) => apiFetch(`/api/visa-categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id) => apiFetch(`/api/visa-categories/${id}`, { method: 'DELETE' }),
};

// ==================== COUNTRY SERVICE ====================
export const countryService = {
    getAll: (params = "") => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/countries${queryString}`);
    },

    getActive: () => apiFetch('/api/countries/active'),

    getFeatured: () => apiFetch('/api/countries/featured'),

    getById: (id) => apiFetch(`/api/countries/${id}`),

    getBySlug: (slug) => apiFetch(`/api/countries/slug/${slug}`),

    create: (data) => apiFetch('/api/countries', { method: 'POST', body: JSON.stringify(data) }),

    update: (id, data) => apiFetch(`/api/countries/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id) => apiFetch(`/api/countries/${id}`, { method: 'DELETE' }),
};

// ==================== HOTEL SERVICE ====================
export const hotelService = {
    getAll: (params = "") => {
        const queryString = typeof params === 'object'
            ? '?' + new URLSearchParams(params).toString()
            : params;
        return apiFetch(`/api/hotels${queryString}`);
    },

    getActive: () => apiFetch('/api/hotels/active'),

    getFeatured: () => apiFetch('/api/hotels/featured'),

    getById: (id) => apiFetch(`/api/hotels/${id}`),

    getBySlug: (slug) => apiFetch(`/api/hotels/slug/${slug}`),

    create: (data) => apiFetch('/api/hotels', { method: 'POST', body: JSON.stringify(data) }),

    update: (id, data) => apiFetch(`/api/hotels/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id) => apiFetch(`/api/hotels/${id}`, { method: 'DELETE' }),
};

// ==================== VISA DOCUMENT SERVICE ====================
export const visaDocumentService = {
    // Admin: get all documents
    getAll: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return apiFetch(`/api/visa-documents${q ? '?' + q : ''}`);
    },
    // Admin: create document
    create: (data) => apiFetch('/api/visa-documents', { method: 'POST', body: JSON.stringify(data) }),
    // Admin: update document
    update: (id, data) => apiFetch(`/api/visa-documents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    // Admin: delete document
    delete: (id) => apiFetch(`/api/visa-documents/${id}`, { method: 'DELETE' }),
    // Admin/User: get by id
    getById: (id) => apiFetch(`/api/visa-documents/${id}`),
    // User: get own documents
    getMy: () => apiFetch('/api/visa-documents/my'),
};

// ==================== ANALYTICS SERVICE ====================
export const analyticsService = {
    getDashboard: () => apiFetch('/api/analytics/dashboard'),
};

// ==================== HOME CONTENT SERVICE ====================
export const homeContentService = {
    getAll: () => apiFetch('/api/home-content'),
    getSection: (section) => apiFetch(`/api/home-content/${section}`),
    updateSection: (section, data) => apiFetch(`/api/home-content/${section}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    seed: () => apiFetch('/api/home-content/seed', { method: 'POST' }),
};

// ==================== LEGACY STUBS (fonts pages) ====================
export const fontService = {
    getAll: () => Promise.resolve({ success: false, data: [] }),
    getBySlug: () => Promise.resolve({ success: false, data: null }),
};
export const cartService = {
    getCart: () => Promise.resolve({ success: false, data: [] }),
    addToCart: () => Promise.resolve({ success: false }),
};
export const downloadService = {
    download: () => Promise.resolve({ success: false }),
};
