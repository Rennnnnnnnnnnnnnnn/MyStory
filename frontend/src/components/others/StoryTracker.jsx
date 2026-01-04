import { useEffect, useRef, useState, useCallback } from "react";
import axiosInstance from "../../pages/auth/axiosInstance";

function StoryTracker({ story, children, isPrivate }) {
    const [hasSentRead, setHasSentRead] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const secondsViewed = useRef(0);
    const containerRef = useRef(null);


    // Function to mark story as read
    const markAsRead = useCallback(async () => {
        const storageKey = `read_${story.post_id}`;
        const lastRead = localStorage.getItem(storageKey);
        const READ_COOLDOWN = 5 * 60 * 1000; // 5 minutes

        if (lastRead) {
            const timeSinceLastRead = Date.now() - Number(lastRead);
            console.log(`Reader is still reading from last session.`);
            if (timeSinceLastRead < READ_COOLDOWN) return;
        }

        try {
            await axiosInstance.post(`/api/story/incrementReadCount/${story.post_id}`);
            localStorage.setItem(storageKey, Date.now().toString());
            setHasSentRead(true);
            console.log("READ COUNT UPDATED");
        } catch (err) {
            console.error("Read count error:", err);
        }
    }, [story.post_id]);

    // ----- VIEWPORT VISIBILITY LOGIC USING INTERSECTION OBSERVER -----
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // entry.intersectionRatio is fraction of container visible
                setIsVisible(entry.intersectionRatio >= 0.3);
            },
            { threshold: Array.from({ length: 101 }, (_, i) => i / 100) } // 0, 0.01, 0.02 ... 1
        );

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    // Reset timer when story leaves view
    useEffect(() => {
        if (!isVisible) {
            secondsViewed.current = 0;
            setHasSentRead(false); // allow re-count if cooldown passed
            console.log(`Story ${story.post_id} left view — timer reset`);
        }
    }, [isVisible, story.post_id]);

    // Increment timer while story is visible
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState === "visible" && isVisible && containerRef.current) {
                secondsViewed.current += 1;

                console.log(
                    `Story ${story.post_id} viewed for ${secondsViewed.current} seconds`
                );

                if (secondsViewed.current >= 30 && !hasSentRead) {
                    markAsRead();
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isVisible, hasSentRead, markAsRead, story.post_id]);

    if (isPrivate) {
        return <div>{children}</div>;
    }

    return <div ref={containerRef} className="relative">{children}</div>;
}

export default StoryTracker;
