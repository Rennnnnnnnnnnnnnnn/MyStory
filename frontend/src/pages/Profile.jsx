import { useAuth } from "./auth/AuthProvider";

import CreateStoryModal from "../components/modals/CreateStoryModal";
import StoryArea from "../components/profile-components/StoryArea";

function Profile() {

    const { user, isAuthenticated, logout } = useAuth();

    console.log("qwezxc ", isAuthenticated)

    return (
        <>
            PROFILE PAGE

            <button className="bg-red-200">
                +
            </button>

            <CreateStoryModal />
            <div className="content-area">
                <StoryArea />
            </div>
        </>
    )
}

export default Profile;