import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./auth/axiosInstance.js";

function LoginAccount() {
    const { login } = useAuth();
    const [info, setInfo] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post("/api/auth/login", info);
            setSuccessMessage(res.data.message);
            login(res.data.userData);
            console.log("res" , res.data)
            navigate("/profile");
        } catch (error) {
            setError(error.response?.data?.error || "Login failed. Please try again.");
        
            setSuccessMessage("");
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            {/* Futuristic Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_1px,transparent_0),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[size:50px_50px] pointer-events-none"></div>
            <div className="w-full max-w-sm bg-zinc-900/80 backdrop-blur-xl p-8 rounded-xl border border-zinc-700/40 shadow-[0_0_25px_rgba(0,150,255,0.15)] relative">
                {/* Neon Accent Line */}
                <div className="absolute -top-[1px] left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-blue-600 rounded-t-xl">

                </div>
                <h2 className="text-3xl font-semibold text-white text-center mb-8 tracking-widest">
                    LOGIN
                </h2>
                <form onSubmit={handleSubmit}>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm text-gray-300 tracking-wide">
                            EMAIL
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={info.email}
                            onChange={handleOnChange}
                            required
                            className="
                                w-full px-4 py-3
                                bg-black/30 border border-zinc-700
                                rounded-lg text-gray-100
                                focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40
                                transition
                            "
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block mb-2 text-sm text-gray-300 tracking-wide">
                            PASSWORD
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={info.password}
                            onChange={handleOnChange}
                            required
                            className="
                                w-full px-4 py-3
                                bg-black/30 border border-zinc-700
                                rounded-lg text-gray-100
                                focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40
                                transition
                            "
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="
                            w-full py-3
                            bg-gradient-to-r from-cyan-500 to-blue-600
                            hover:from-cyan-400 hover:to-blue-500
                            text-white font-semibold rounded-lg
                            shadow-[0_0_20px_rgba(0,150,255,0.4)]
                            transition-all
                        "
                    >
                        Login
                    </button>
                </form>

                {successMessage && (
                    <p className="text-green-400 mt-4 text-center text-sm">{successMessage}</p>
                )}
                {error && (
                    <p className="text-red-400 mt-4 text-center text-sm">{error}</p>
                )}

                <p className="text-right mt-6">
                    <span
                        onClick={() => navigate("/register")}
                        className="
                                    text-cyan-400 
                                    cursor-pointer 
                                    hover:text-cyan-300
                                    transition
                                    "
                    >
                        REGISTER
                    </span>
                </p>

            </div>
        </div>
    );
}

export default LoginAccount;
