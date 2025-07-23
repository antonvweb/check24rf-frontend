import api from "@/lib/axios";

export async function checkAuth(): Promise<boolean> {
    try {
        const response = await api.get("/auth/validate");
        return response.status === 200;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        return false;
    }
}

export async function tryRefresh(): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });

        if (response.ok) {
            const data = await response.json(); // { token: "..." }
            localStorage.setItem("jwt", data.token);
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
}

