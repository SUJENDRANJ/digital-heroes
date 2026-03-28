import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Users,
  Heart,
  Dice5,
  Settings,
  Plus,
  Search,
  Play,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("charities");
  const [charities, setCharities] = useState([]);
  const [users, setUsers] = useState([]); // Mock data for now
  const [simulation, setSimulation] = useState(null);
  const [newCharity, setNewCharity] = useState({
    name: "",
    description: "",
    logoUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "charities") {
        const res = await api.get("/charities");
        setCharities(res.data);
      } else if (activeTab === "users") {
        // Mocked as requested
        setUsers([
          {
            _id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "user",
            subscriptionStatus: "active",
          },
          {
            _id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "admin",
            subscriptionStatus: "active",
          },
          {
            _id: "3",
            name: "Bob Wilson",
            email: "bob@example.com",
            role: "user",
            subscriptionStatus: "inactive",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCharity = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post("/charities", newCharity);
      setCharities([...charities, res.data]);
      setNewCharity({ name: "", description: "", logoUrl: "" });
      setStatus({ type: "success", text: "Charity added successfully!" });
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.message || "Failed to add charity",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const runSimulation = async (mode) => {
    setIsSubmitting(true);
    try {
      const res = await api.post("/draws/simulate", { mode });
      setSimulation(res.data);
      setStatus({ type: "success", text: "Simulation completed." });
    } catch (err) {
      setStatus({ type: "error", text: "Simulation failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const publishDraw = async () => {
    if (
      !window.confirm(
        "Are you sure you want to publish this draw? This will notify all winners.",
      )
    )
      return;
    setIsSubmitting(true);
    try {
      await api.post("/draws/publish");
      setStatus({ type: "success", text: "Official draw published!" });
      setSimulation(null);
    } catch (err) {
      setStatus({ type: "error", text: "Publication failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const SidebarLink = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all ${
        activeTab === id
          ? "bg-emerald-600/10 text-emerald-500 shadow-sm border-r-4 border-emerald-500"
          : "text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-neutral-900 bg-neutral-900/50 p-6">
        <div className="mb-12 flex items-center gap-3 px-2">
          <div className="rounded-lg bg-emerald-500 p-2 shadow-lg shadow-emerald-500/20">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">
            Admin Panel
          </span>
        </div>
        <nav className="space-y-2">
          <SidebarLink id="charities" icon={Heart} label="Charities" />
          <SidebarLink id="draws" icon={Dice5} label="Draw Control" />
          <SidebarLink id="users" icon={Users} label="Users" />
          <SidebarLink id="settings" icon={Settings} label="System Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white capitalize">
                {activeTab}
              </h1>
              <p className="mt-2 text-neutral-500">
                Manage your system-wide {activeTab} operations.
              </p>
            </div>
            {status.text && (
              <div
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm border ${
                  status.type === "success"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {status.text}
              </div>
            )}
          </header>

          {activeTab === "charities" && (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Add Charity Form */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                  <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                    <Plus className="h-5 w-5 text-emerald-500" />
                    New Charity
                  </h3>
                  <form onSubmit={handleAddCharity} className="space-y-4">
                    <input
                      placeholder="Charity Name"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm outline-none focus:border-emerald-500"
                      value={newCharity.name}
                      onChange={(e) =>
                        setNewCharity({ ...newCharity, name: e.target.value })
                      }
                      required
                    />
                    <textarea
                      placeholder="Short Description"
                      className="w-full h-32 rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm outline-none focus:border-emerald-500"
                      value={newCharity.description}
                      onChange={(e) =>
                        setNewCharity({
                          ...newCharity,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-emerald-600 p-4 font-bold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                      ) : (
                        "Register Charity"
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Charity List */}
              <div className="lg:col-span-2">
                <div className="grid gap-4 md:grid-cols-2">
                  {charities.length &&
                    charities.map((charity) => (
                      <div
                        key={charity._id}
                        className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-neutral-700"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                            <Heart className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">
                              {charity.name}
                            </h4>
                            <p className="text-xs text-neutral-500 line-clamp-2">
                              {charity.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "draws" && (
            <div className="space-y-8">
              {/* Controls */}
              <div className="flex gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <button
                  onClick={() => runSimulation("algorithmic")}
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 p-4 font-bold transition-all hover:bg-indigo-500"
                >
                  <Play className="h-5 w-5" />
                  Run Algorithmic Simulation
                </button>
                <button
                  onClick={() => runSimulation("random")}
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-800 p-4 font-bold transition-all hover:bg-neutral-700"
                >
                  <Dice5 className="h-5 w-5" />
                  Random Draw (Manual)
                </button>
              </div>

              {/* Results */}
              {simulation && (
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
                      <h3 className="text-xl font-bold mb-6">
                        Winning Numbers
                      </h3>
                      <div className="flex gap-3">
                        {simulation.numbers.map((num, i) => (
                          <div
                            key={i}
                            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-black text-white shadow-xl shadow-emerald-500/20"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
                      <h3 className="text-xl font-bold mb-6 text-white">
                        Tier Breakdown
                      </h3>
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-neutral-800 text-xs uppercase tracking-widest text-neutral-500">
                            <th className="pb-4 font-medium">Match Tier</th>
                            <th className="pb-4 font-medium">
                              Potential Winners
                            </th>
                            <th className="pb-4 font-medium">
                              Payout / Person
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                          {simulation.tiers.map((tier) => (
                            <tr key={tier.matchCount}>
                              <td className="py-4 font-semibold">
                                {tier.matchCount} Matches
                              </td>
                              <td className="py-4 text-emerald-500 font-bold">
                                {tier.winnerCount}
                              </td>
                              <td className="py-4 font-mono">
                                £{tier.payout.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-8">
                      <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">
                        Total Prize Pool
                      </p>
                      <h2 className="text-5xl font-black text-white">
                        £{simulation.prizePool.toFixed(2)}
                      </h2>
                      <p className="mt-4 text-sm text-indigo-300">
                        Total participants: {simulation.totalPlayers}
                      </p>
                    </div>
                    <button
                      onClick={publishDraw}
                      disabled={isSubmitting}
                      className="w-full rounded-2xl bg-white p-6 text-xl font-black text-black transition-all hover:bg-neutral-200 active:scale-95 flex items-center justify-center gap-3"
                    >
                      <Send className="h-6 w-6" />
                      Publish Official Draw
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-neutral-950 border-b border-neutral-800">
                  <tr className="text-xs uppercase tracking-widest text-neutral-500">
                    <th className="px-8 py-6 font-medium">User</th>
                    <th className="px-8 py-6 font-medium">Status</th>
                    <th className="px-8 py-6 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-neutral-800/30 transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="font-bold">{user.name}</div>
                        <div className="text-sm text-neutral-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-tighter ${
                            user.subscriptionStatus === "active"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {user.subscriptionStatus}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm text-neutral-300 capitalize">
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
