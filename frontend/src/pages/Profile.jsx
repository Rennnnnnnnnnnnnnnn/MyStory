import { useState, useEffect } from "react";
import CreateStoryModal from "../components/modals/CreateStoryModal";
import StoryCard from "../components/profile-components/StoryCard";
import { useAuth } from "./auth/AuthProvider";
import axiosInstance from "./auth/axiosInstance";
import EditStoryModal from "../components/modals/EditStoryModal";

function Profile() {
    const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
    const [isEditStoryModalOpen, setIsEditStoryModalOpen] = useState(false);
    const [stories, setStories] = useState([]);
    const { user: { user_id } } = useAuth();
    const [storyToEdit, setStoryToEdit] = useState(null);

    const handleEditStory = (story) => {
        setStoryToEdit(story);
        setIsEditStoryModalOpen(true);
    }


    const getPrivateStories = async () => {
        try {
            const res = await axiosInstance.get(`/api/story/getPrivateStories/${user_id}`, {
            })
            setStories(res.data);
        } catch (error) {
            console.error("Error fetching private stories: ", error);
        }
    }

    useEffect(() => {
        getPrivateStories();
    }, [])

    return (
        <>
            <h1 className="text-3xl text-blue-600 text-center font-semibold mb-2">Your Stories</h1>
            <div className="flex justify-center items-center">
                <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition transform"
                    onClick={() => setIsCreateStoryModalOpen(true)}>
                    CREATE STORY
                </button>
            </div>

            <StoryCard
                stories={stories}
                isPrivate={true}
                handleEditClick={handleEditStory}
                getPrivateStories={getPrivateStories}
            />
            <CreateStoryModal
                isOpen={isCreateStoryModalOpen}
                onClose={() => { setIsCreateStoryModalOpen(false) }}
                getPrivateStories={getPrivateStories}
            />
            <EditStoryModal
                isOpen={isEditStoryModalOpen}
                onClose={() => {
                    setIsEditStoryModalOpen(false)
                }}
                storyToEdit={storyToEdit}
                getPrivateStories={getPrivateStories}
            />
        </>
    )
}

export default Profile;