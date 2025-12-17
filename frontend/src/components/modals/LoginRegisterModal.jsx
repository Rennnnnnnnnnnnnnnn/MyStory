import { useState, useEffect } from "react";
import { useAuth } from "../../pages/auth/AuthProvider";
import axiosInstance from "../../pages/auth/axiosInstance";

export default function LoginModal({ onSuccess, onCancel }) {
    const { login } = useAuth();
    const [info, setInfo] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (isLoginMode) {
            try {
                const res = await axiosInstance.post("/api/auth/login", info);
                login(res.data.userData);
                onSuccess();
                setError("");
            } catch (err) {
                setError(err.response?.data?.error || "Login failed. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        if (!isLoginMode) {
            try {
                const res = await axiosInstance.post("/api/auth/register", info);
                setSuccessMessage(res.data?.message || "Registration successful! Account has been created.");
                setError("");
            } catch (err) {
                setError(err.response?.data?.error || "Registration failed. Try again.");
                setSuccessMessage("");
                console.error(err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        setError("");
        setSuccessMessage("");
        setInfo({ email: "", password: "" })
    }, [isLoginMode]);

    return (
        <div className="fixed inset-0 bg-gray-800 flex justify-center items-center z-50">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-lg relative">
                <button
                    onClick={onCancel}
                    aria-label="Close modal"
                    className="absolute top-2 right-4 text-2xl font-bold text-gray-800 cursor-pointer"
                >
                    ×
                </button>

                {isLoginMode ? (
                    <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
                        Sign in to your account to view your stories
                    </h2>
                ) : <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
                    Create an account
                </h2>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={info.email}
                            onChange={handleOnChange}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-cyan-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={info.password}
                            onChange={handleOnChange}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-cyan-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-blue-500 border-blue-200 text-white hover:bg-blue-600 font-medium transition"
                    >
                        {isLoginMode
                            ? (loading ? "Signing in..." : "Sign In")
                            : (loading ? "Creating account..." : "Create Account")
                        }

                    </button>
                </form>

                {isLoginMode ? (
                    <div className="flex items-center w-full m-1">
                        {/* Left spacer */}
                        <div className="flex-1"></div>

                        {/* Centered text */}
                        <p className="text-center">
                            Don't have an account?
                        </p>

                        {/* Right-aligned text */}
                        <p
                            className="flex-1 text-right text-blue-600 font-medium cursor-pointer hover:underline"
                            onClick={() => setIsLoginMode(false)}
                        >
                            REGISTER
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center w-full m-1">
                        {/* Left spacer */}
                        <div className="flex-1"></div>

                        {/* Centered text */}
                        <p className="text-center">
                            Already have an account?
                        </p>

                        {/* Right-aligned text */}
                        <p
                            className="flex-1 text-right text-blue-600 font-medium cursor-pointer hover:underline"
                            onClick={() => setIsLoginMode(true)}
                        >
                            LOGIN
                        </p>
                    </div>
                )}
                {error
                    ? <p className="text-red-600 mt-4 text-center text-sm">{error}</p>
                    : <p className="text-green-600 mt-4 text-center text-sm">{successMessage}</p>
                }
            </div>
        </div >
    );
}
