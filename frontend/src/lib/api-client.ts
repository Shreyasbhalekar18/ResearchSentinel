import axios, { AxiosError } from 'axios';
import { API_URL, STORAGE_KEYS } from './config';

// Create axios instance with default config
export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            // Handle specific error codes
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem(STORAGE_KEYS.TOKEN);
                        localStorage.removeItem(STORAGE_KEYS.USER);
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    console.error('Access forbidden');
                    break;
                case 404:
                    console.error('Resource not found');
                    break;
                case 500:
                    console.error('Server error');
                    break;
                case 502:
                    console.error('Bad gateway');
                    break;
                case 503:
                    console.error('Service unavailable');
                    break;
                case 504:
                    console.error('Gateway timeout');
                    break;
            }
        } else if (error.request) {
            // Request made but no response
            console.error('No response from server');
        } else {
            // Error in request setup
            console.error('Request error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Error handler utility
export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            // Server responded with error
            const message = error.response.data?.detail || error.response.data?.message || 'An error occurred';
            return message;
        } else if (error.request) {
            // Request made but no response
            return 'Unable to connect to server. Please check your internet connection.';
        }
    }
    return 'An unexpected error occurred. Please try again.';
};

// Safe API call wrapper
export async function safeApiCall<T>(
    apiCall: () => Promise<T>,
    errorMessage?: string
): Promise<{ data: T | null; error: string | null }> {
    try {
        const data = await apiCall();
        return { data, error: null };
    } catch (error) {
        const message = errorMessage || handleApiError(error);
        console.error('API Error:', message);
        return { data: null, error: message };
    }
}
