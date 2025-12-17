// React
import { useState } from "react";
// Assets
import BookmarkIcon from "../../assets/Bookmark_Icon.png";
import DeleteIcon from "../../assets/Delete_Icon.png";
import EditIcon from "../../assets/Edit_Icon.png";
// Context / Hooks
import { useConfirmationModal } from "../modals/modalContext.jsx";
// Utils / API
import axiosInstance from "../../pages/auth/axiosInstance";
import RevealStory from "../profile-components/RevealStory.jsx";

import { useAuth } from "../../pages/auth/AuthProvider.jsx";

function StoryCard({ stories, isPrivate, handleEditClick, getPrivateStories }) {
    const [expandedStories, setExpandedStories] = useState({});
    const { openConfirmationModal } = useConfirmationModal();

    const { isAuthenticated } = useAuth();


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

    return (
        <div className="p-5 lg:mx-40 lg:p-10">
            {stories.length === 0 ? (
                <div className="flex justify-center m-5 font-semibold text-xl">
                    No uploaded Stories
                </div>
            ) : (
                stories.map((story, index) => {
                    const isExpanded = expandedStories[story.post_id] || false;

                    return (
                        <RevealStory key={story.post_id} delay={index * 10}>
                            {(visible) => (
                                  <div
                                    className={`bg-blue-200 p-6 mb-4 rounded-lg border border-blue-600
                                                transition-all duration-600 ease-out hover:bg-blue-300
                                        ${visible
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-5"
                                        }`}
                                    onDoubleClick={() => toggleExpanded(story.post_id)}
                                >
                                    {/* HEADER */}
                                    <div className="flex flex-row justify-between">
                                        <div className="flex flex-col">
                                            <small>
                                                {new Date(story.create_date).toLocaleDateString(
                                                    "en-US",
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

                                        {isPrivate ? (
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
                                        ) : isAuthenticated ? (
                                            <button
                                                className="px-3 py-1 border border-blue-500 rounded-xl md:border-0 hover:bg-blue-400 transition-colors duration-300 ease-in-out"
                                            >
                                                <img src={BookmarkIcon} alt="Bookmark" className="h-4 w-4" />
                                            </button>
                                        ) : null}
                                    </div>
                                    {/* CONTENT */}
                                    <h1 className="font-semibold mb-6 mt-3 text-xl">
                                        {story.heading || ""}
                                    </h1>

                                    <p className={`text-justify whitespace-pre-line ${isExpanded ? "" : "line-clamp-5"}`}>
                                        {story.content}
                                    </p>

                                    <button
                                        onClick={() => toggleExpanded(story.post_id)}
                                        className="text-blue-600 font-medium hover:underline mt-2"
                                    >
                                        {isExpanded ? "See Less" : "See More"}
                                    </button>
                                </div>
                            )}
                        </RevealStory>
                    );
                })
            )}
        </div >
    );
}

export default StoryCard;
