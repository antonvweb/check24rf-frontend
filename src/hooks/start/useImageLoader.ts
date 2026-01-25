import {useEffect, useState} from "react";

export const useImageLoader = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => setIsLoading(false);

        if (document.readyState === "complete") {
            handleLoad();
            return;
        }

        const images = Array.from(document.images);
        if (images.length === 0) {
            setIsLoading(false);
            return;
        }

        let loadedCount = 0;
        const onImageLoad = () => {
            loadedCount++;
            if (loadedCount === images.length) {
                setIsLoading(false);
            }
        };

        images.forEach(img => {
            if (img.complete) {
                loadedCount++;
            } else {
                img.addEventListener("load", onImageLoad);
                img.addEventListener("error", onImageLoad);
            }
        });

        if (loadedCount === images.length) {
            setIsLoading(false);
        }

        window.addEventListener("load", handleLoad);

        return () => {
            window.removeEventListener("load", handleLoad);
            images.forEach(img => {
                img.removeEventListener("load", onImageLoad);
                img.removeEventListener("error", onImageLoad);
            });
        };
    }, []);

    return isLoading;
};