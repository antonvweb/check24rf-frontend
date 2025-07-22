export async function checkAuth(): Promise<boolean> {
    try {
        const accessToken = localStorage.getItem("jwt");

        if (!accessToken) return await tryRefresh();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/validate`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.ok) return true;

        return await tryRefresh();

    } catch (error) {
        // Ошибка сети или другая непредвиденная ошибка
        console.error("checkAuth error:", error);
        return false;
    }
}

async function tryRefresh(): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include", // Отправка HttpOnly cookie с refresh token
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("jwt", data.token);
            return true;
        }

        return false;

    } catch (error) {
        console.error("tryRefresh error:", error);
        return false;
    }
}
