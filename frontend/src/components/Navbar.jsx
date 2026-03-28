import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  LogOut, 
  ChevronRight, 
  TrendingUp 
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLinks = () => (
    <>
      {user ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <Link 
            to={user.role === 'admin' ? '/admin' : '/dashboard'} 
            className="flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-emerald-500 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-red-500 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
          <Link to="/login" className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Join the Movement
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500 p-2 shadow-lg shadow-emerald-500/20">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              Legacy <span className="text-emerald-500">Draw</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <NavLinks />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="border-t border-neutral-900 py-6 md:hidden">
            <NavLinks />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
