import { useState, useRef, useEffect } from "react";

function CheckStoryOverflow({ story, isExpanded, toggleExpanded }) {
    const [overflowing, setOverflowing] = useState(false);
    const textRef = useRef(null);

    const checkOverflow = () => {
        const el = textRef.current;
        if (el) setOverflowing(el.scrollHeight > el.clientHeight + 1);
    };

    useEffect(() => {
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [story]);

    return (
        <div>
            <p
                ref={textRef}
                className={`text-justify whitespace-pre-line ${!isExpanded ? `line-clamp-4` : ""}`}
            >
                {story}
            </p>

     {(overflowing || isExpanded) && (
                <button
                    onClick={toggleExpanded} // uses parent toggle
                    className="text-blue-600 font-medium hover:underline mt-2 cursor-pointer"
                >
                    {isExpanded ? "Show Less" : "Read More"}
                </button>
            )}
        </div>
    );
}


export default CheckStoryOverflow;
