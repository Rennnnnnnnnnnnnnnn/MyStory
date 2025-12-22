import { useEffect, useState } from "react";
import { useConfirmationModal } from "./modalContext";
import axiosInstance from "../../pages/auth/axiosInstance";

function EditStoryModal({ isOpen, onClose, storyToEdit, getPrivateStories }) {

    const [updatedStory, setUpdatedStory] = useState({
        heading: "",
        content: "",
        audience: "",
    });

    const { openConfirmationModal } = useConfirmationModal();

    useEffect(() => {
        if (storyToEdit) {
            setUpdatedStory({
                heading: storyToEdit.heading,
                content: storyToEdit.content,
                audience: storyToEdit.audience
            });
        }
    }, [storyToEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUpdatedStory(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = () => {
        openConfirmationModal({
            title: "Confirm Changes",
            message: "Are you sure you want to save the changes to this story? Changes cannot be undone.",
            onConfirm: async () => {
                try {
                    const res = await axiosInstance.put(`/api/story/updateStory/${storyToEdit.post_id}`, {
                        heading: updatedStory.heading,
                        content: updatedStory.content,
                        audience: updatedStory.audience
                    })

                    if (res.status === 200) {
                        getPrivateStories();
                        onClose();
                    }
                } catch (error) {
                    console.log("Error updating story: ", error)
                }
            }
        })
    }

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="p-4 w-150 p-8 bg-white rounded-2xl shadow-lg border border-gray-400">
                <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">Edit Story</h2>
                <div className="flex flex-col gap-5">
                    <input
                        name="heading"
                        type="text"
                        value={updatedStory.heading}
                        onChange={handleInputChange}
                        placeholder="Story heading...  (Optional)"
                        className="p-3 bg-sky-100 border border-blue-300 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-blue-400 
                           transition"
                    />
                    <textarea
                        name="content"
                        value={updatedStory.content}
                        onChange={handleInputChange}
                        placeholder="Write your story..."
                        className="text-justify h-90 p-3 bg-sky-100 border border-blue-300 rounded-xl
                           resize-none focus:outline-none focus:ring-2 
                           focus:ring-blue-400 transition"
                    />
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Audience:
                        </label>
                        <select
                            name="audience"
                            value={updatedStory.audience}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-sky-100 border border-blue-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-blue-400 
                               transition"
                        >
                            <option value="Only Me">Only Me</option>
                            <option value="Public">Public</option>
                        </select>
                    </div>
                </div>
                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-7">
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl border border-blue-200
                           hover:bg-blue-800 transition hover:-translate-y-1"
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-blue-100 text-blue-800 rounded-xl border border-blue-200
                           hover:bg-blue-200 transition hover:-translate-y-1"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditStoryModal;