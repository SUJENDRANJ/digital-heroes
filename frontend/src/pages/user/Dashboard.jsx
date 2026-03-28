import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Trophy, 
  CreditCard, 
  Heart, 
  PlusCircle, 
  History, 
  Loader2, 
  CheckCircle2,
  AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const isActive = user?.subscriptionStatus === 'active';

  const fetchScores = async () => {
    try {
      const response = await api.get('/scores');
      // Backend returns: { success: true, scores: [...] }
      const scoreData = response.data.scores || [];
      setScores(Array.isArray(scoreData) ? scoreData : []);
    } catch (err) {
      console.error('Failed to fetch scores', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    const scoreVal = parseInt(newScore);

    // Frontend Validation
    if (isNaN(scoreVal) || scoreVal < 1 || scoreVal > 45) {
      setMessage({ type: 'error', text: 'Score must be between 1 and 45 (Stableford).' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Backend expects 'value', not 'points'
      await api.post('/scores', { value: scoreVal });
      setMessage({ type: 'success', text: 'Score submitted successfully!' });
      setNewScore('');
      fetchScores(); // Refresh the rolling 5 list
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit score.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-neutral-400">Welcome back, {user?.name}. Here's your performance summary.</p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-2">
            <div className={`h-2 w-2 rounded-full ${user?.subscriptionStatus === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-sm font-medium text-neutral-300 uppercase tracking-wider">
              {user?.subscriptionStatus || 'Inactive'} Membership
            </span>
          </div>
        </header>

        {/* Subscription Paywall Banner */}
        {!isActive && (
          <div className="relative overflow-hidden rounded-2xl bg-emerald-600 p-8 shadow-xl">
            <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-black text-white tracking-tight">Activate Your Entry</h2>
                <p className="mt-1 text-emerald-100 font-medium">Your subscription is currently inactive. Complete setup to enter the weekly draw.</p>
              </div>
              <button 
                onClick={() => window.location.href = '/subscribe'}
                className="rounded-full bg-white px-8 py-3 font-bold text-emerald-600 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                Upgrade Now
              </button>
            </div>
            {/* Abstract Background Shape */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500 opacity-20 blur-3xl"></div>
          </div>
        )}

        {/* Top Grid: Stats & Summary */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Charity Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Selected Charity</p>
                <h3 className="text-lg font-semibold text-white">{user?.charity?.name || 'Supporting a Cause'}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-4">
              <span className="text-sm text-neutral-400">Contribution</span>
              <span className="text-lg font-bold text-emerald-500">{user?.charityPercentage || 10}%</span>
            </div>
          </div>

          {/* Subscription Status Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Payments</p>
                <h3 className="text-lg font-semibold text-white">£15.00 / Month</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-4">
              <span className="text-sm text-neutral-400">Next billing</span>
              <span className="text-sm font-medium text-white">April 15, 2026</span>
            </div>
          </div>

          {/* Mock Winnings Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Total Winnings</p>
                <h3 className="text-lg font-semibold text-white">£245.00</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-4">
              <span className="text-sm text-neutral-400">Lifetime draws won</span>
              <span className="text-sm font-medium text-white">3</span>
            </div>
          </div>
        </div>

        {/* Main Section: Scores */}
        <div className="grid gap-8 lg:grid-cols-5">
          
          {/* Submit Score Module */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <PlusCircle className="h-5 w-5 text-emerald-500" />
                <h2 className="text-xl font-bold text-white">Submit New Score</h2>
              </div>

              <form onSubmit={handleScoreSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
                    Stableford Points (1-45)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    required
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-2xl font-bold text-emerald-500 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="00"
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                  />
                </div>

                {message.text && (
                  <div className={`flex items-center gap-2 rounded-lg p-3 text-sm border ${
                    message.type === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center rounded-xl bg-emerald-600 p-4 font-bold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Log Score'}
                </button>
              </form>
            </div>
          </div>

          {/* Rolling Scores List */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl h-full">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <History className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-xl font-bold text-white">Rolling Performance</h2>
                </div>
                <span className="text-xs font-medium text-neutral-500 bg-neutral-950 px-2 py-1 rounded border border-neutral-800 uppercase tracking-tighter">
                  Latest 5
                </span>
              </div>

              {isLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-neutral-700" />
                </div>
              ) : scores.length > 0 ? (
                <div className="space-y-4">
                  {scores.map((score, index) => (
                    <div 
                      key={score._id} 
                      className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition-all hover:border-neutral-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-neutral-400">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                            {new Date(score.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-sm font-semibold text-white">Stableford Round</p>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-emerald-500">
                        {score.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-48 flex-col items-center justify-center text-center">
                  <p className="text-neutral-500">No scores logged yet.</p>
                  <p className="text-sm text-neutral-600">Submit your first round to start tracking.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
