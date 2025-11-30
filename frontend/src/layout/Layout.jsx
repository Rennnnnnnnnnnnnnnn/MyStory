import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="min-h-screen">
            <div className="mb-25">
                <Navbar />
            </div>

            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}