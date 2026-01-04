// React
import { useState, useRef, useEffect } from "react";
// Assets
import BookmarkIcon from "../../assets/Bookmark_Icon.png";
import DeleteIcon from "../../assets/Delete_Icon.png";
import EditIcon from "../../assets/Edit_Icon.png";
import HeartOn from "../../assets/Heart_On.png";
import HeartOff from "../../assets/Heart_Off.png";
// Context / Hooks
import { useConfirmationModal } from "../modals/modalContext.jsx";
// Utils / API
import axiosInstance from "../../pages/auth/axiosInstance";
import RevealStory from "../profile-components/RevealStory.jsx";
import { useAuth } from "../../pages/auth/AuthProvider.jsx";
import LoginRegisterModal from "../modals/LoginRegisterModal.jsx";
import HeartNotificationToast from "../others/HeartNotificationToast.jsx";
import StoryTracker from "../others/StoryTracker.jsx";
import CheckStoryOverflow from "./CheckStoryOverflow.jsx";


function StoryCard({ stories, isPrivate, handleEditClick, getPrivateStories }) {
    const [expandedStories, setExpandedStories] = useState({});
    const [showLoginRegisterModal, setShowLoginRegisterModal] = useState(false);
    const [showHeartToast, setShowHeartToast] = useState(false);
    const { openConfirmationModal } = useConfirmationModal();
    const { user, isAuthenticated } = useAuth();
    const [likes, setLikes] = useState(
        stories.reduce((acc, story) => ({ ...acc, [story.post_id]: story.isLiked }), {})
    );

    const lastScrollY = useRef(0);
    const [scrollDir, setScrollDir] = useState("down");

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollDir(currentScrollY > lastScrollY.current ? "down" : "up");
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const toggleExpanded = (postId) => {
        setExpandedStories((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const handleDeleteClick = (post_id) => {
        openConfirmationModal({
            title: "Delete story",
            message: "Are you sure you want to delete this story? This cannot be undone!",
            onConfirm: async () => {
                try {
                    await axiosInstance.delete(`/api/story/deleteStory/${post_id}`);
                    getPrivateStories();
                } catch (error) {
                    console.error("Error:", error);
                }
            },
        });
    };

    const handleToggleLike = async (post_id) => {

        if (isAuthenticated) {
            const user_id = user.user_id;
            const isCurrentlyLiked = likes[post_id];

            // Optimistic UI update
            setLikes(prev => ({
                ...prev,
                [post_id]: !prev[post_id],
            }));

            if (!isCurrentlyLiked) {
                setShowHeartToast(true);
            }

            try {
                if (!isCurrentlyLiked) {
                    // Add like
                    await axiosInstance.post('/api/story/addlike', { user_id, post_id });
                } else {
                    // Remove like
                    await axiosInstance.delete('/api/story/deleteLike', { params: { user_id, post_id } });
                }
            } catch (error) {
                console.error("Error toggling like:", error);
                // Rollback optimistic update if API fails
                setLikes(prev => ({
                    ...prev,
                    [post_id]: isCurrentlyLiked,
                }));
            }
        } else {
            setShowLoginRegisterModal(true);
        }
    };

    return (
        <>
            <div className="p-5 lg:mx-80 lg:p-10 min-h-screen">
                {stories.map((story, index) => {
                    const isExpanded = expandedStories[story.post_id] || false;

                    return (
                        <RevealStory key={story.post_id} delay={index * 10}>
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
                                            isExpanded={expandedStories[story.post_id]}
                                            toggleExpanded={() => toggleExpanded(story.post_id)}
                                        />
                                    </StoryTracker>

                                    <div className="flex flex-row items-center justify-between">
                                        {!isPrivate ? (
                                            <div>
                                                <button
                                                    className="mt-4 cursor-pointer h-10 w-10"
                                                    onClick={() => handleToggleLike(story.post_id)}
                                                >
                                                    <img
                                                        src={likes[story.post_id] ? HeartOn : HeartOff}
                                                        alt={likes[story.post_id] ? 'Liked' : 'Not Liked'}
                                                    />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="mt-4 flex items-center">
                                                <span className="text-xl font-light">{story.total_likes}</span>
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
                    );
                })}
            </div>

            {showLoginRegisterModal &&
                <LoginRegisterModal
                    onSuccess={() => {
                        setShowLoginRegisterModal(false);
                        navigate("/feed");

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

export default StoryCard;
