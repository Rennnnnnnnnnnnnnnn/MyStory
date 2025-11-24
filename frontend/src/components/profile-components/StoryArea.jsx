import { useState, useEffect } from "react"
import { useAuth } from "../../pages/auth/AuthProvider";

export default function StoryArea() {
    const [stories, setStories] = useState(null);

    const { user: { user_id } } = useAuth();

    console.log("ayd ", user_id);

    // const {user} = useAuth();
    // console.log(user);

    const getPrivateStories = async () => {
        try {
            const res = await axios.get('/api/story/getPrivateStories', {
                params: { user_id }
            })

            console.log("tinamaan")
        } catch (error) {

        }
    }

    useEffect(() => {
        if (user_id) getPrivateStories();
    }, [user_id]);

    return (
        <div className="bg-green-200">
            asdasd
        </div>
    )
}