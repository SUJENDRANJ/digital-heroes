import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { UserPlus, Loader2 } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    charityId: "",
  });
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await api.get("/charities");
        // Backend returns: { success: true, charities: [...] }
        const charityData = response.data.charities || [];
        setCharities(Array.isArray(charityData) ? charityData : []);
      } catch (err) {
        console.error("Failed to fetch charities", err);
        setCharities([]);
      }
    };
    fetchCharities();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/register", {
        ...formData,
        charityPercentage: 10, // Default fixed percentage
      });
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Join the Platform
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Set up your account to start contributing
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5 ml-1">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-600 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5 ml-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-600 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5 ml-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-600 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5 ml-1">
                Select Charity
              </label>
              <select
                name="charityId"
                required
                className="w-full appearance-none rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                value={formData.charityId}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Choose a cause...
                </option>
                {Array.isArray(charities) &&
                  charities.map((charity) => (
                    <option key={charity._id} value={charity._id}>
                      {charity.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
                Register
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-emerald-500 hover:text-emerald-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
