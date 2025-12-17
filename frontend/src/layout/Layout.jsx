import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="min-h-screen">
            <div className="">
                <Navbar />
            </div>

            <main className="">
                <Outlet />
            </main>
        </div>
    )
}