import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { LogIn, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-neutral-400">Log in to manage your scores and subscriptions</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-600 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-600 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-emerald-500 hover:text-emerald-400">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
