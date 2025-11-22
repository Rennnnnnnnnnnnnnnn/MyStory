import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../pages/auth/AuthProvider";

export default function CreateStoryModal() {
    const [story, setStory] = useState({
        heading: "",
        content: ""
    });
    const { user } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setStory(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async () => {
        try {
            const res = await axios.post("/api/story/createStory", {
                story,
                user
            })

            console.log("story uploaded")
        } catch (error) {

        }
    };

    const handleCancel = () => {
        setStory({ heading: "", content: "" });
        console.log("Cancelled");
    };

    return (
        <div className="max-w-md mx-auto mt-10 h-150 p-6 bg-green-200 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Story</h2>
            <input
                name="heading"
                type="text"
                value={story.heading}
                className="w-full p-3 mb-4 bg-blue-100 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Story heading"
                onChange={handleInputChange}
            />
            <textarea
                name="content"
                className="w-full h-110 p-3 mb-4 bg-blue-100 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                value={story.content}
                onChange={handleInputChange}
                placeholder="Write your story here..."
            />
            <div className="flex justify-end gap-3">
                <button
                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded hover:bg-gray-400 transition"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
