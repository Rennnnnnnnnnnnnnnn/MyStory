import { useState, useEffect } from "react";
// Auth & API
import { useAuth } from "./auth/AuthProvider";
import axiosInstance from "./auth/axiosInstance";
// Components
import CreateStoryModal from "../components/modals/CreateStoryModal";
import EditStoryModal from "../components/modals/EditStoryModal";
import StoryCard from "../components/profile-components/StoryCard";
import Spinner from "../components/others/Spinner";

function Profile() {
    // Modals
    const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
    const [isEditStoryModalOpen, setIsEditStoryModalOpen] = useState(false);
    // Story Data
    const [stories, setStories] = useState([]);
    const [storyToEdit, setStoryToEdit] = useState(null);
    // Auth
    const { user: { user_id } } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

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

            {isLoading ?
                <div className="mt-25">
                    <Spinner />
                </div>

                :
                <StoryCard
                    stories={stories}
                    isPrivate={true}
                    handleEditClick={handleEditStory}
                    getPrivateStories={getPrivateStories}
                />
            }



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