import { type RequestParams } from './types';

export const API_BASE_URL = '/api';

export async function fetchJson<T>(
    url: string,
    options: RequestInit & {
        params?: RequestParams;
    } = {}
): Promise<T> {
    const { params, ...fetchOptions } = options;

    const response = await fetch(enrichUrlWithParams(`${API_BASE_URL}${url}`, params), {
        headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
        },
        ...fetchOptions,
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

function enrichUrlWithParams(url: string, params?: RequestParams): string {
    if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== null) {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        if (queryString) {
            return url + (url.includes('?') ? '&' : '?') + queryString;
        }
    }

    return url;
}