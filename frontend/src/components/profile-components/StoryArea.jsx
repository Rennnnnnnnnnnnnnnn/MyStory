import { useState, useEffect } from "react"
import { useAuth } from "../../pages/auth/AuthProvider";
import axiosInstance from "../../pages/auth/axiosInstance";

export default function StoryArea() {
    const [stories, setStories] = useState([]);
    const { user: { user_id } } = useAuth();


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
        console.log("stories updated: ", stories);
        console.log("asd", Array.isArray(stories))
    }, [stories]);

    useEffect(() => {
        if (user_id) getPrivateStories();
    }, [user_id]);

    return (
        <div className="bg-green-200 p-6 m-5">

            {stories.map(story => (
                <div key={story.post_id} className="bg-orange-200 p-6 m-5 rounded-lg">
                    <small>{new Date(story.create_date).toLocaleString()}</small>

                    <h1 className="font-semibold mb-2 text-2xl">{story.heading || ""}</h1>

                    <p style={{ textAlign: "justify"}}>
                        {story.content.split('\n').map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </p>




                </div>
            ))}
        </div>
    )
}