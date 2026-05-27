import { getCookie } from "@/lib/csrf"

const BASEURL = process.env.NEXT_PUBLIC_API_URL

export async function authapiPost(endpoint: string, body?: object) {
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

export async function authapiGet(endpoint: string) {
    return fetch(`${BASEURL}${endpoint}`, {
        credentials: 'include',
    })
}

export async function authapiDelete(endpoint: string, body?: object) {
    return fetch(`${BASEURL}${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') || '',
        },
        body: body ? JSON.stringify(body) : undefined,
    })
}

export async function apiGet(endpoint: string) {
    return fetch(`${BASEURL}${endpoint}`)
}

export async function authApiUpdate(endpoint: string, body?: object) {
    return fetch(`${BASEURL}${endpoint}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') || '',
        },
        body: body ? JSON.stringify(body) : undefined,
    })
}