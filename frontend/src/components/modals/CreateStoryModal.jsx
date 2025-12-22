import { useState } from "react";
import { useAuth } from "../../pages/auth/AuthProvider";
import axiosInstance from "../../pages/auth/axiosInstance";

function CreateStoryModal({ isOpen, onClose, getPrivateStories }) {

    const { user } = useAuth();
    const [story, setStory] = useState({
        heading: "",
        content: "",
        audience: "Only Me"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setStory(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const performCreateStory = async () => {
        try {
            const res = await axiosInstance.post("/api/story/createStory", {
                story,
                user
            });
            setStory({
                heading: "",
                content: "",
                audience: "Only Me"
            }),
                getPrivateStories();
            onClose();
        } catch (error) {
            console.error("Error submitting story:", error);
        }
    };

    const handleCancel = () => {
        onClose();
        setStory({ heading: "", content: "" });
    };

    const handleEnterPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // prevent the default single newline

            const { selectionStart, selectionEnd } = e.target;

            // Insert double newline at the cursor position
            const newValue =
                story.content.substring(0, selectionStart) +
                "\n\n" +
                story.content.substring(selectionEnd);

            setStory(prev => ({
                ...prev,
                content: newValue
            }));

            // Move cursor after the double newline
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = selectionStart + 2;
            }, 0);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="p-4 w-150 p-8 bg-white rounded-2xl shadow-lg border border-gray-400">
                <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">Create Story</h2>
                <div className="flex flex-col gap-5">
                    <input
                        name="heading"
                        type="text"
                        value={story.heading}
                        onChange={handleInputChange}
                        placeholder="Story heading...  (Optional)"
                        className="p-3 bg-sky-100 border border-blue-300 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-blue-400 
                           transition"
                    />
                    <textarea
                        name="content"
                        value={story.content}
                        onChange={handleInputChange}
                        onKeyDown={handleEnterPress}
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
                            value={story.audience}
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
                        onClick={performCreateStory}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl border border-blue-200
                           hover:bg-blue-800 transition hover:-translate-y-1"
                    >
                        Submit
                    </button>

                    <button
                        onClick={handleCancel}
                        className="px-5 py-2.5 bg-blue-100 text-blue-800 rounded-xl border border-blue-200
                           hover:bg-blue-200 transition hover:-translate-y-1"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateStoryModal;