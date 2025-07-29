import {safeLocalStorage} from "@/utils/storage";

export const initializeTheme = () => {
    const theme = safeLocalStorage.getItem("theme");
    if (theme === "dark") {
        document.documentElement.removeAttribute('data-theme');
    }
};