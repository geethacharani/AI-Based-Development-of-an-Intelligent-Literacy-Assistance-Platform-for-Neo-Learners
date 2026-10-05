import { StorageService } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export const apiClient = {
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = StorageService.getAuthToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type') || '';
                if (response.status === 405 || response.status === 404 || response.status === 502 || response.status === 503 || contentType.includes('text/html')) {
                    throw new Error('BACKEND_OFFLINE');
                }
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = errorData.detail || errorData.message;
                if (!errorMessage && typeof errorData === 'object' && Object.keys(errorData).length > 0) {
                    errorMessage = Object.entries(errorData)
                        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : JSON.stringify(val)}`)
                        .join(' | ');
                }
                throw new Error(errorMessage || `API Error: ${response.status}`);
            }

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('text/html')) {
                throw new Error('BACKEND_OFFLINE');
            }

            return await response.json();
        } catch (err: any) {
            // Return custom flag if backend is unreachable so service layer can use fallback mock store smoothly
            if (
                err.name === 'TypeError' ||
                err.message?.includes('Failed to fetch') ||
                err.message === 'BACKEND_OFFLINE' ||
                err.message?.includes('405') ||
                err.message?.includes('404')
            ) {
                throw new Error('BACKEND_OFFLINE');
            }
            throw err;
        }
    },

    get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    },

    post<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    put<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        });
    },
};

export const api = apiClient;

