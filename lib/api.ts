const API_URL = 'https://unforgeable-unforcibly-roxane.ngrok-free.dev'; // Java backend URL

interface FetchOptions extends RequestInit {
    token?: string;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
    const { token, body, ...rest } = options;

    console.log(body)

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        method: body ? "POST" : "GET", // auto POST si hay body
        headers,
        body: body ? body : undefined,
        ...rest,
    });

    console.log(res)

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "API request failed");
    }

    return res.json();
}
