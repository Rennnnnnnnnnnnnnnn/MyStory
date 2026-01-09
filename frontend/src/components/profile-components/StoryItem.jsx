import { useState, useRef, useEffect } from "react";
import CheckStoryOverflow from "./CheckStoryOverflow";
import StoryTracker from "../others/StoryTracker.jsx";
import { useAuth } from "../../pages/auth/AuthProvider.jsx";
import LoginRegisterModal from "../modals/LoginRegisterModal.jsx";
import RevealStory from "../profile-components/RevealStory.jsx";
import BookmarkIcon from "../../assets/Bookmark_Icon.png";
import DeleteIcon from "../../assets/Delete_Icon.png";
import EditIcon from "../../assets/Edit_Icon.png";
import HeartOn from "../../assets/HeartOn_Icon.png";
import HeartOff from "../../assets/HeartOff_Icon.png";
import HeartNotificationToast from "../others/HeartNotificationToast.jsx";
import axiosInstance from "../../pages/auth/axiosInstance.js";

function StoryItem({ story, isPrivate, handleEditClick, handleDeleteClick, index }) {
    const [showLoginRegisterModal, setShowLoginRegisterModal] = useState(false);
    const [showHeartToast, setShowHeartToast] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(story.isLiked);
    const lastScrollY = useRef(0);
    const [scrollDir, setScrollDir] = useState("down");
    const [totalLikes, setTotalLikes] = useState(story.total_likes);
    const { user, isAuthenticated } = useAuth();

    const toggleExpanded = () => {
        setIsExpanded(prev => !prev);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollDir(currentScrollY > lastScrollY.current ? "down" : "up");
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleToggleLike = async (post_id) => {
        if (!isAuthenticated) {
            setShowLoginRegisterModal(true);
            return;
        }

        const user_id = user.user_id;
        const prevLiked = isLiked;
        const uploader_id = story.user_id

        // Optimistic UI
        setIsLiked(!prevLiked);
        setTotalLikes(prev => prevLiked ? prev - 1 : prev + 1);

        if (!prevLiked) setShowHeartToast(true);

        try {
            if (!prevLiked) {
                await axiosInstance.post('/api/story/addlike', { user_id, post_id, uploader_id });
            } else {
                await axiosInstance.delete('/api/story/deleteLike', {
                    data: {
                        user_id,
                        post_id,
                        uploader_id
                    }
                });
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            // Rollback on failure
            setIsLiked(prevLiked);
            setTotalLikes(prev => prevLiked ? prev + 1 : prev - 1);
        }
    };

    return (
        <>
            <RevealStory delay={index * 10}>
                {(visible) => (
                    <div
                        className={`bg-blue-200 p-6 mb-4 rounded-lg border-t-12 border-blue-700
                                transition-all duration-400 ease-out hover:bg-blue-300
                                ${visible
                                ? "opacity-100 translate-y-0"
                                : scrollDir === "down"
                                    ? "opacity-0 translate-y-5"    // slide from below
                                    : "opacity-0 -translate-y-5"   // slide from above
                            }`}
                        onDoubleClick={() => toggleExpanded(story.post_id)}
                    >
                        {/* HEADER */}
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col">
                                <small>
                                    {new Date(story.create_date).toLocaleDateString(
                                        "en-PH",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )}
                                </small>
                                {isPrivate && (
                                    <small>
                                        Audience:{" "}
                                        <span className="font-semibold">
                                            {story.audience}
                                        </span>
                                    </small>
                                )}
                            </div>
                            {isPrivate
                                ? (
                                    <div className="flex gap-2">
                                        <button
                                            className="px-3 py-1 border border-blue-500 rounded-xl md:border-0 hover:bg-blue-400 transition-colors duration-300 ease-in-out"
                                            onClick={() => handleEditClick(story)}
                                        >
                                            <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                        </button>

                                        <button
                                            className="px-3 py-1 border border-blue-500 rounded-xl md:border-0 hover:bg-blue-400 transition-colors duration-300 ease-in-out"
                                            onClick={() => handleDeleteClick(story.post_id)}
                                        >
                                            <img src={DeleteIcon} alt="Delete" className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="px-3 py-1 border border-blue-500 rounded-xl md:border-0 hover:bg-blue-400 transition-colors duration-300 ease-in-out"
                                    >
                                        <img src={BookmarkIcon} alt="Bookmark" className="h-4 w-4" />
                                    </button>
                                )}
                        </div>
                        {/* CONTENT */}
                        <h1 className="font-semibold mb-6 mt-3 text-xl">
                            {story.heading || ""}
                        </h1>
                        <StoryTracker story={story} isPrivate={isPrivate}>
                            <CheckStoryOverflow
                                story={story.content}
                                isExpanded={isExpanded}
                                toggleExpanded={() => toggleExpanded(story.post_id)}
                            />
                        </StoryTracker>

                        <div className="flex flex-row items-center justify-between">
                            {!isPrivate
                                ? (
                                    <div className="mt-4 flex items-center">
                                        <button
                                            className="cursor-pointer h-10 w-10"
                                            onClick={() => handleToggleLike(story.post_id)}
                                        >
                                            <img
                                                src={isLiked ? HeartOn : HeartOff}
                                                alt={isLiked ? 'Liked' : 'Not Liked'}
                                            />
                                        </button>
                                        <span className="text-xl font-light">{totalLikes}</span>

                                    </div>
                                ) : (
                                    <div className="mt-4 flex items-center">
                                        <span className="text-xl font-light">{totalLikes}</span>
                                        <img src={HeartOn} className="h-10 w-10 object-contain -ml-1" />
                                    </div>
                                )}
                            <div className="mt-4">
                                <small>
                                    {story.total_reads}
                                    {story.total_reads != 1 ? " READS" : " READ"}
                                </small>
                            </div>
                        </div>
                    </div>
                )}
            </RevealStory>

            {showLoginRegisterModal &&
                <LoginRegisterModal
                    onSuccess={() => {
                        setShowLoginRegisterModal(false);
                        // navigate("/feed");
                    }}
                    onCancel={() => setShowLoginRegisterModal(false)}
                    title="Sign in to heart stories"
                />
            }

            {showHeartToast && (
                <HeartNotificationToast
                    onClose={() => setShowHeartToast(false)}
                />
            )}
        </>
    );
}

export default StoryItem;
