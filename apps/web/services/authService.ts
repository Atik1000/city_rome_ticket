// Relative in the browser (same-origin route handlers); absolute on the
// server because Node fetch rejects relative URLs.
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (typeof window === "undefined"
        ? `http://127.0.0.1:${process.env.PORT || 5000}/api/v1`
        : "/api/v1");

export async function registerUser(data: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Registration failed";
        if (errorData.detail) {
            errorMessage = errorData.detail;
        } else if (errorData.email && Array.isArray(errorData.email)) {
            errorMessage = errorData.email[0];
        } else if (typeof errorData === 'object') {
            const firstKey = Object.keys(errorData)[0];
            if (firstKey && Array.isArray(errorData[firstKey])) {
                errorMessage = errorData[firstKey][0];
            } else {
                errorMessage = errorData.message || errorMessage;
            }
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function loginUser(data: any) {
    const response = await fetch(`${API_BASE_URL}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Login failed";
        if (errorData.detail) {
            errorMessage = errorData.detail;
        } else if (errorData.email && Array.isArray(errorData.email)) {
            errorMessage = errorData.email[0];
        } else if (typeof errorData === 'object') {
            const firstKey = Object.keys(errorData)[0];
            if (firstKey && Array.isArray(errorData[firstKey])) {
                errorMessage = errorData[firstKey][0];
            } else {
                errorMessage = errorData.message || errorMessage;
            }
        }
        throw new Error(errorMessage);
    }


    return response.json();
}

export function setTokens(data: { access: string; refresh: string }) {
    if (typeof document !== 'undefined') {
        document.cookie = `access_token=${data.access}; path=/; max-age=86400; SameSite=Strict; Secure`;
        document.cookie = `refresh_token=${data.refresh}; path=/; max-age=604800; SameSite=Strict; Secure`;
    }
}

export function removeTokens() {
    if (typeof document !== 'undefined') {
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

export function isLoggedIn() {
    if (typeof document !== 'undefined') {
        return document.cookie.split(';').some((item) => item.trim().startsWith('access_token='));
    }
    return false;
}
export function getAccessToken() {
    if (typeof document !== 'undefined') {
        const cookie = document.cookie.split(';').find((item) => item.trim().startsWith('access_token='));
        return cookie ? cookie.split('=')[1] : null;
    }
    return null;
}

export async function getUserProfile() {
    const token = getAccessToken();
    if (!token) throw new Error("No access token found");

    const response = await fetch(`${API_BASE_URL}/me/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch user profile");
    }

    return response.json();
}

export async function updateUserProfile(data: any) {
    const token = getAccessToken();
    if (!token) throw new Error("No access token found");

    const response = await fetch(`${API_BASE_URL}/me/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update user profile");
    }

    return response.json();
}

export async function deleteUserAccount() {
    const token = getAccessToken();
    if (!token) throw new Error("No access token found");

    const response = await fetch(`${API_BASE_URL}/me/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete user account");
    }
}
