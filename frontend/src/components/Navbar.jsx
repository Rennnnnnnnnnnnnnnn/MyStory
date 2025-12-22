import { useNavigate } from "react-router-dom"
import LogoSana from "../assets/logoSana.jpg";
import ProfileLogo from "../assets/profileLogo.png";

function Navbar() {
    const navigate = useNavigate();

    return (
        <div className="fixed z-50 top-0 left-0 w-full bg-gradient-to-l from-blue-200 to-blue-900 p-4 border-b-5 border-gray-900">
            <div className="flex justify-between items-center">
                <div className="flex flex-row gap-3 justify-center items-center">
                    <img
                        className="h-10 w-10"
                        src={LogoSana}
                    />
                    <span className="text-white text-2xl">MyStory</span>
                </div>

                <div className="flex flex-row gap-4 justify-center items-center">
                    <div
                        className="hover:cursor-pointer text-semibold text-2xl text-blue-800"
                        onClick={() => {
                            navigate("/feed")
                        }}>
                        Feed
                    </div>
                    <div className="hover:cursor-pointer text-semibold text-2xl text-blue-800"
                        onClick={() => {
                            navigate("/profile")
                        }}>
                        {/* <img
                            className="h-8 w-8"
                            src={ProfileLogo}
                        /> */}
                        Profile
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;