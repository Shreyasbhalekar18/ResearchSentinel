// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'ResearchSentinel';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_URL}/api/auth/login`,
    REGISTER: `${API_URL}/api/auth/register`,

    // Submissions
    SUBMIT: `${API_URL}/api/submissions/submit`,
    MY_SUBMISSIONS: `${API_URL}/api/submissions/my-submissions`,
    SUBMISSION_DETAIL: (id: string) => `${API_URL}/api/submissions/${id}`,

    // Analytics
    DASHBOARD: `${API_URL}/api/analytics/dashboard`,

    // AI Features
    SUGGEST_CORRECTIONS: (id: string) => `${API_URL}/api/ai/suggest-corrections/${id}`,
    RECOMMEND_REFERENCES: (id: string) => `${API_URL}/api/ai/recommend-references/${id}`,
};

// Feature Flags
export const FEATURES = {
    AI_SUGGESTIONS: process.env.NEXT_PUBLIC_ENABLE_AI_SUGGESTIONS === 'true',
    REFERENCE_RECOMMENDATIONS: process.env.NEXT_PUBLIC_ENABLE_REFERENCE_RECOMMENDATIONS === 'true',
};

// Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
};
