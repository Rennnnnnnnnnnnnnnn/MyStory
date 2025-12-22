import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="min-h-screen">
            <div className="mb-1">
                <Navbar />
            </div>

            <main>
                <Outlet />
            </main>
        </div>
    )
}


