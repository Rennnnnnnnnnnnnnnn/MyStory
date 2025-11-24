import { useAuth } from "./auth/AuthProvider";

import CreateStoryModal from "../components/modals/createStoryModal";
import StoryArea from "../components/profile-components/StoryArea";

function Profile() {

    const { user, isAuthenticated, logout } = useAuth();

    return (
        <>
            PROFILE PAGE
            <p>{user.email}</p>
            <button className="bg-red-200">
                +
            </button>

            <CreateStoryModal /> 
            {/* <div className="content-area">
                <StoryArea />
            </div> */}
        </>
    )
}

export default Profile;