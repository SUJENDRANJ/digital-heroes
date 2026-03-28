import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Trophy, 
  Heart, 
  Users, 
  ChevronRight, 
  Loader2, 
  CheckCircle,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const [latestDraw, setLatestDraw] = useState(null);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [drawRes, charityRes] = await Promise.all([
          api.get('/draws/latest'),
          api.get('/charities')
        ]);
        setLatestDraw(drawRes.data);
        
        // Backend returns: { success: true, charities: [...] }
        const charityData = charityRes.data.charities || [];
        setCharities(Array.isArray(charityData) ? charityData.slice(0, 3) : []); 
      } catch (err) {
        console.error('Failed to fetch home data', err);
        setCharities([]); // Fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  return (
    <div className="bg-neutral-950 text-white selection:bg-emerald-500 selection:text-black">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24 pb-32 lg:px-8 lg:pt-32">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-500 to-[#10b981] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <span className="rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
              The Future of Competitive Impact
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl leading-[1.1]">
            Play for Purpose. <br /> 
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Legacy in Every Stroke.
            </span>
          </h1>
          <p className="mt-8 text-lg leading-8 text-neutral-400 max-w-2xl mx-auto">
            A subscription platform where your precision on the green fuels real-world change. Support your chosen charity while competing in weekly high-stakes draws.
          </p>
          <div className="mt-12 flex items-center justify-center gap-x-6">
            <Link 
              to="/register" 
              className="rounded-full bg-emerald-600 px-10 py-4 text-lg font-black text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              Join the Movement
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Draw Section */}
      <section className="py-24 bg-neutral-900/50 border-y border-neutral-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center gap-3 mb-12">
             <Trophy className="h-10 w-10 text-emerald-500" />
             <h2 className="text-3xl font-bold tracking-tight">Latest Draw Results</h2>
             <p className="text-neutral-500 uppercase tracking-widest text-xs font-bold">Updated Weekly</p>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-neutral-800" />
            </div>
          ) : (latestDraw && Array.isArray(latestDraw.numbers)) ? (
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {latestDraw.numbers.map((num, i) => (
                  <div key={i} className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-950 border border-neutral-800 text-3xl font-black text-emerald-500 shadow-2xl">
                    {num}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/50">
                   <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Total Pot</p>
                   <p className="text-xl font-bold">£{latestDraw.prizePool?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/50">
                   <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Participants</p>
                   <p className="text-xl font-bold">{latestDraw.totalPlayers || 0}</p>
                </div>
                <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/50">
                   <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Charity 10%</p>
                   <p className="text-xl font-bold text-emerald-500">£{(latestDraw.prizePool ? (latestDraw.prizePool * 0.1) : 0).toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/50">
                   <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Winners</p>
                   <p className="text-xl font-bold">{latestDraw.winners?.length || 0}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-800 p-12 bg-neutral-950/30">
              <p className="text-neutral-500 italic">The first season's draw is launching soon. Secure your entry now.</p>
            </div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black tracking-tight mb-4">How it Works</h2>
            <div className="h-1 w-24 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: Zap, 
                title: 'Subscribe', 
                desc: 'A £15 monthly contribution enters you into every weekly draw and fuels high-impact charity projects.' 
              },
              { 
                icon: Target, 
                title: 'Log Your Rounds', 
                desc: 'Upload your Stableford scores. Your performance determines your entry accuracy in our weekly algorithm.' 
              },
              { 
                icon: Heart, 
                title: 'Drive Change', 
                desc: '10% of every entry goes directly to your selected charity. Win big while doing good.' 
              }
            ].map((step, i) => (
              <div key={i} className="group relative text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-900 border border-neutral-800 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5 transition-all">
                  <step.icon className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-sm">{step.desc}</p>
                <div className="absolute top-10 left-full w-full hidden md:block">
                   {i < 2 && <div className="h-[2px] w-full bg-neutral-900 translate-x-10"></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charity Spotlight Section */}
      <section className="py-24 bg-neutral-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <h2 className="text-4xl font-black tracking-tight mb-2">Impact Partners</h2>
                <p className="text-neutral-500">The causes you empower with every entry.</p>
              </div>
              <Link to="/register" className="text-emerald-500 font-bold flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest text-xs">
                View all partners <ChevronRight className="h-4 w-4" />
              </Link>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
             {charities.map((charity) => (
               <div key={charity._id} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 hover:border-emerald-500/30 transition-all">
                 <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                   <Heart className="h-6 w-6" />
                 </div>
                 <h4 className="text-xl font-bold mb-3">{charity.name}</h4>
                 <p className="text-sm text-neutral-500 leading-relaxed mb-6">{charity.description}</p>
                 <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 uppercase tracking-widest">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    Verified Partner
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 lg:px-8 text-center bg-emerald-600">
        <h2 className="text-4xl font-black text-white tracking-tighter sm:text-6xl mb-8">
          Ready to play for more?
        </h2>
        <p className="text-emerald-100 text-lg max-w-xl mx-auto mb-12 font-medium">
          Join thousands of players transforming their rounds into life-changing contributions.
        </p>
        <Link 
          to="/register" 
          className="inline-block rounded-full bg-white px-12 py-5 text-xl font-black text-emerald-600 shadow-2xl transition-all hover:bg-neutral-100 active:scale-95"
        >
          Get Started Now
        </Link>
      </section>

    </div>
  );
};

export default Home;
