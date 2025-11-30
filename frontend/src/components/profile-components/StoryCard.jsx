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

export default function StoryCard({ stories, isPrivate, handleEditClick, getPrivateStories }) {
    const [expandedStories, setExpandedStories] = useState({});
    const { openConfirmationModal } = useConfirmationModal();

    const toggleExpanded = (postId) => {
        setExpandedStories(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleDeleteClick = (post_id) => {
        openConfirmationModal({
            title: "Delete story",
            message: "Are you sure you want to delete this story? This cannot be undone!",
            onConfirm: async () => {
                try {
                    const res = await axiosInstance.delete(`/api/story/deleteStory/${post_id}`);
                    console.log("Deleted: ", res.data);
                    getPrivateStories();
                } catch (error) {
                    console.log("Error: ", error);
                }
            },

        })
    }

    return (
        <>
            <div className="p-5">
                {stories.map(story => {
                    const isExpanded = expandedStories[story.post_id] || false;
                    return (
                        <div
                            key={story.post_id}
                            className="bg-orange-200 p-6 mb-4 rounded-lg transition-transform duration-300 hover:scale-101"
                            onDoubleClick={() => toggleExpanded(story.post_id)}
                        >
                            <div className="flex flex-row justify-between">

                                <div className="flex flex-col">
                                    <small>
                                        {new Date(story.create_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </small>

                                    {isPrivate ? <small>Audience: <span className="font-semibold text-small">{story.audience}</span></small> : null}
                                </div>
                                {isPrivate ?
                                    <div className="flex flex-row gap-2">
                                        <button
                                            className="px-3 py-1 border border-gray-400 border-rounded rounded-xl cursor-pointer"
                                            onClick={() => handleEditClick(story)}
                                        >
                                            <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="px-3 py-1 border border-gray-400 border-rounded rounded-xl cursor-pointer"
                                            onClick={() => { handleDeleteClick(story.post_id) }}
                                        >
                                            <img
                                                src={DeleteIcon} alt="Delete" className="h-4 w-4" />
                                        </button>
                                    </div> :
                                    <button
                                        className="px-3 py-1 border border-gray-400 border-rounded rounded-xl cursor-pointer">
                                        <img src={BookmarkIcon} alt="Bookmark" className="h-4 w-4" />
                                    </button>
                                }
                            </div>
                            <h1 className="font-semibold mb-6 mt-3 text-xl">{story.heading || ""}</h1>
                            <p className={`text-justify whitespace-pre-line ${isExpanded ? "" : "line-clamp-5"}`}>
                                {story.content.replace(/\.\n/g, '.\n\n')}
                            </p>
                            <button
                                onClick={() => toggleExpanded(story.post_id)}
                                className="text-blue-600 font-medium hover:underline mt-2"
                            >
                                {isExpanded ? "See Less" : "See More"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
