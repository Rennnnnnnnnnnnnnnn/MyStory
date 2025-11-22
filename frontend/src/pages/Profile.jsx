import { useAuth } from "./auth/AuthProvider";

import CreateStoryModal from "../components/modals/createStoryModal";

function Profile() {

    const { user, isAuthenticated, logout } = useAuth();

    console.log("userz", user)

    return (
        <>
            PROFILE PAGE
            <p>{user.email}</p>
            <button className="bg-red-200">
                +
            </button>

            <CreateStoryModal />

        </>
    )
}

export default Profile;