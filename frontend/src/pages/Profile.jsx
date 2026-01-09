import { useState, useEffect } from "react";
// Auth & API
import { useAuth } from "./auth/AuthProvider";
import axiosInstance from "./auth/axiosInstance";
// Components
import CreateStoryModal from "../components/modals/CreateStoryModal";
import EditStoryModal from "../components/modals/EditStoryModal";
import StoryCard from "../components/profile-components/StoryCard";
import Spinner from "../components/others/Spinner";
import { useLocation } from "react-router-dom";


function Profile() {
    // Modals
    const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
    const [isEditStoryModalOpen, setIsEditStoryModalOpen] = useState(false);
    // Story Data
    const [stories, setStories] = useState([]);
    const [storyToEdit, setStoryToEdit] = useState(null);
    // Auth
    const { user: { user_id } } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const handleEditStory = (story) => {
        setStoryToEdit(story);
        setIsEditStoryModalOpen(true);
    }

    const getPrivateStories = async () => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.get(`/api/story/getPrivateStories/${user_id}`)
            setStories(res.data);

        } catch (error) {
            console.error("Error fetching private stories: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (user_id) {
            getPrivateStories();
        }
    }, [user_id]);

    if (isLoading) {
        return (
            <div className="mt-40 flex justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <div className="pt-25 bg-gray-800">
                <h1 className="text-3xl text-white text-center font-semibold mb-2">Your Stories</h1>
                <div className="flex justify-center items-center">
                    <button className="mt-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition transform"
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
            </div>
        </>
    )
}

export default Profile;