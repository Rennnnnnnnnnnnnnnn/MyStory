// Context / Hooks
import { useConfirmationModal } from "../modals/modalContext.jsx";
// Utils / API
import axiosInstance from "../../pages/auth/axiosInstance";
import StoryItem from "./StoryItem.jsx";

function StoryCard({ stories, isPrivate, handleEditClick, getPrivateStories }) {
  
    const { openConfirmationModal } = useConfirmationModal();

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
        <>
            <div className="p-5 lg:mx-80 lg:p-10 min-h-screen">
                {stories.map((story, index) => {
                    return (
                        <StoryItem
                          key={story.post_id}
                            story={story}
                            index={index}
                            isPrivate={isPrivate}
                            handleEditClick={handleEditClick}
                            handleDeleteClick={handleDeleteClick}
                        />
                    )
                })}
            </div>
        </>
    );
}

export default StoryCard;
