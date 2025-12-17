import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./auth/axiosInstance";

function RegisterAccount() {
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
      const res = await axiosInstance.post("/api/auth/register", info);
      setSuccessMessage(res.data.message || "Registration successful!");
      setError("");
      console.log(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
      setSuccessMessage("");
      console.error(err.response?.data || err.message);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    {/* Optional subtle background pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_1px,transparent_0),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_0)] bg-[size:50px_50px] pointer-events-none"></div>

    <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-lg relative">
      
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
        Create Your Account
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Fill in your details to get started
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Email */}
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
            className="
              w-full px-4 py-3 rounded-lg
              bg-gray-50 text-gray-900
              border border-gray-300
              placeholder-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-cyan-500
              focus:border-cyan-500
              transition
            "
          />
        </div>

        {/* Password */}
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
            className="
              w-full px-4 py-3 rounded-lg
              bg-gray-50 text-gray-900
              border border-gray-300
              placeholder-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-cyan-500
              focus:border-cyan-500
              transition
            "
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="
            w-full py-3 rounded-lg
            bg-cyan-600 hover:bg-cyan-500
            text-white font-medium
            transition
          "
        >
          Register
        </button>
      </form>

      {/* Messages */}
      {successMessage && (
        <p className="text-green-600 mt-4 text-center text-sm">
          {successMessage}
        </p>
      )}
      {error && (
        <p className="text-red-600 mt-4 text-center text-sm">
          {error}
        </p>
      )}

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-cyan-600 hover:text-cyan-500 cursor-pointer underline underline-offset-2 transition"
        >
          Login
        </span>
      </p>
    </div>
  </div>
);

}

export default RegisterAccount;
