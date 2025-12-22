import React, { useState, useEffect } from 'react';

const AnnouncementToast = () => {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [closedByButton, setClosedByButton] = useState(false);

    useEffect(() => {
        // Auto fade (no slide)
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 4000);

        const removeTimer = setTimeout(() => {
            setVisible(false);
        }, 6000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    const closeToast = () => {
        setClosedByButton(true);
        setFadeOut(true);
        setTimeout(() => setVisible(false), 1000); // match animation duration
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none flex justify-center items-start"
            onClick={closeToast}>
            <div
                className={`
                            relative bg-sky-200 rounded-lg p-6 shadow-lg w-full w-screen
                            pointer-events-auto
                            transition-all duration-1000 ease-in-out
                            ${fadeOut ? 'opacity-0' : 'opacity-100'}
                            ${fadeOut && closedByButton ? '-translate-x-32' : 'translate-x-0'}
                        `}
            >
                <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"    >
                    ✕
                </button>

                <div className="flex flex-col items-center text-center text-sm lg:text-xl">
                    <p>Stories can be double tapped to either expand or shorten</p>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementToast;
