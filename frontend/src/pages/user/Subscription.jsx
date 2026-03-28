import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  CreditCard, 
  ShieldCheck, 
  Heart, 
  CheckCircle2, 
  Loader2, 
  Zap,
  ArrowRight
} from 'lucide-react';

const Subscription = () => {
  const { user, login } = useAuth();
  const [plan, setPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('selection'); // 'selection' | 'processing' | 'success'
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setIsProcessing(true);
    setStep('processing');

    try {
      // Step 1: Initialize Checkout (Mock)
      await api.post('/subscriptions/checkout', { plan });
      
      // Step 2: Simulate Payment Delay (UX)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Finalize Status
      const response = await api.patch('/subscriptions/status', { status: 'active' });
      
      // Update local context
      const updatedUser = { ...user, subscriptionStatus: 'active' };
      login(updatedUser, localStorage.getItem('token'));
      
      setStep('success');
    } catch (err) {
      console.error('Checkout failed', err);
      setStep('selection');
      setIsProcessing(false);
    }
  };

  if (step === 'processing') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-6 text-center">
        <div className="relative mb-8 h-24 w-24">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20"></div>
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-neutral-900 border border-emerald-500/50">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">Securing Your Entry...</h2>
        <p className="mt-2 text-neutral-500">Processing your secure payment via encrypted gateway.</p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-6 text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight">Welcome to the Inner Circle</h2>
        <p className="mt-4 max-w-md text-neutral-400">
          Your subscription is active. 10% of your contribution is now supporting <span className="text-emerald-500 font-bold">{user?.charity?.name}</span>.
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-10 flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 font-bold text-white transition-all hover:bg-emerald-500"
        >
          Go to Dashboard
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          Fuel Your Impact. <br />
          <span className="text-emerald-500">Secure Your Legacy.</span>
        </h1>
        <p className="mt-6 text-lg text-neutral-500 max-w-xl mx-auto">
          One simple subscription. Unlimited competitive draws. Guaranteed charity contribution.
        </p>

        {/* Pricing Selection */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 text-left">
          
          {/* Monthly Plan */}
          <div 
            onClick={() => setPlan('monthly')}
            className={`cursor-pointer rounded-3xl border p-8 transition-all ${
              plan === 'monthly' ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500' : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="rounded-xl bg-neutral-950 p-3 text-neutral-400">
                <Zap className="h-6 w-6" />
              </div>
              {plan === 'monthly' && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
            </div>
            <h3 className="text-xl font-bold text-white">Standard Entry</h3>
            <p className="mt-2 text-sm text-neutral-500">Perfect for consistent weekly participation.</p>
            <div className="mt-8">
              <span className="text-4xl font-black text-white">£15.00</span>
              <span className="text-neutral-500 ml-2">/ month</span>
            </div>
          </div>

          {/* Yearly Plan */}
          <div 
            onClick={() => setPlan('yearly')}
            className={`relative cursor-pointer rounded-3xl border p-8 transition-all ${
              plan === 'yearly' ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500' : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
            }`}
          >
            <div className="absolute -top-4 right-8 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
              Save 20%
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="rounded-xl bg-neutral-950 p-3 text-emerald-500">
                <Trophy className="h-6 w-6" />
              </div>
              {plan === 'yearly' && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
            </div>
            <h3 className="text-xl font-bold text-white">Legacy Founder</h3>
            <p className="mt-2 text-sm text-neutral-500">Annual commitment with maximum impact.</p>
            <div className="mt-8">
              <span className="text-4xl font-black text-white">£144.00</span>
              <span className="text-neutral-500 ml-2">/ year</span>
            </div>
          </div>

        </div>

        {/* Impact Summary */}
        <div className="mt-12 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Heart className="h-5 w-5" />
             </div>
             <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-600">Your Impact Partner</p>
                <p className="font-bold text-white">{user?.charity?.name || 'Loading Charity...'}</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold uppercase tracking-widest text-neutral-600">Contribution</p>
             <p className="font-bold text-emerald-500">10% Fixed</p>
          </div>
        </div>

        <button 
          onClick={handleCheckout}
          className="mt-12 w-full max-w-sm rounded-full bg-white px-8 py-5 text-xl font-black text-black transition-all hover:bg-neutral-200 active:scale-95 flex items-center justify-center gap-3"
        >
          <CreditCard className="h-6 w-6" />
          Complete Checkout
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-600 font-medium">
          <ShieldCheck className="h-4 w-4" />
          Secure 256-bit Encrypted Transaction
        </div>
      </div>
    </div>
  );
};

// Mock Trophy Icon
const Trophy = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export default Subscription;
