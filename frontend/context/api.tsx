import { getCookie } from "@/lib/csrf"

const BASEURL = process.env.NEXT_PUBLIC_API_URL

export async function apiPost(endpoint: string, body?: object) {
    return fetch(`${BASEURL}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') || '',
        },
        body: body ? JSON.stringify(body) : undefined,
    })
}

export async function apiGet(endpoint: string) {
    return fetch(`${BASEURL}${endpoint}`, {
        credentials: 'include',
    })
}

export async function apiDelete(endpoint: string) {
    return fetch(`${BASEURL}${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') || '',
        },
    })
}