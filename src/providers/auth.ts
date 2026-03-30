import { AuthProvider } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";

const AUTH_URL = `${BACKEND_BASE_URL}auth`;

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        const response = await fetch(`${AUTH_URL}/sign-in/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        if (response.ok) {
            return {
                success: true,
                redirectTo: "/",
            };
        }

        const data = await response.json();
        return {
            success: false,
            error: {
                name: "Login Error",
                message: data.message || "Invalid credentials",
            },
        };
    },
    register: async ({ email, password, name, role }) => {
        const response = await fetch(`${AUTH_URL}/sign-up/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, name, role }),
            credentials: "include",
        });

        if (response.ok) {
            return {
                success: true,
                redirectTo: "/",
            };
        }

        const data = await response.json();
        return {
            success: false,
            error: {
                name: "Registration Error",
                message: data.message || "Could not register",
            },
        };
    },
    logout: async () => {
        await fetch(`${AUTH_URL}/sign-out`, {
            method: "POST",
            credentials: "include",
        });
        return {
            success: true,
            redirectTo: "/login",
        };
    },
    check: async () => {
        try {
            const response = await fetch(`${AUTH_URL}/get-session`, {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                if (data.session) {
                    return {
                        authenticated: true,
                    };
                }
            }
        } catch (error) {
            // Ignore
        }

        return {
            authenticated: false,
            logout: true,
            redirectTo: "/login",
        };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
        try {
            const response = await fetch(`${AUTH_URL}/get-session`, {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                return data.user;
            }
        } catch (error) {
            // Ignore
        }
        return null;
    },
    onError: async (error) => {
        if (error.status === 401 || error.status === 403) {
            return {
                logout: true,
                redirectTo: "/login",
            };
        }
        return { error };
    },
};
