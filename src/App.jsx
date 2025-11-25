import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Users, Baby, Skull, TrendingUp, Activity, Globe, Info, Calendar, ChevronDown, Cpu, Zap, PersonStanding } from 'lucide-react';

/**
 * CONSTANTS & RATES
 * Based on 2024-2025 Global Estimates (UN/Worldometer)
 */
const ANCHOR_DATE = new Date('2025-06-30T00:00:00Z').getTime();
const ANCHOR_POPULATION = 8231613070;

// Rates per second
const BIRTH_RATE_PER_SEC = 4.3; 
const DEATH_RATE_PER_SEC = 2.0; 
const GROWTH_RATE_PER_SEC = BIRTH_RATE_PER_SEC - DEATH_RATE_PER_SEC;

// Demographics Distribution (Approximate Global Averages)
const GENDER_RATIO = { MALE: 0.504, FEMALE: 0.496 };
const AGE_DISTRIBUTION = {
  "0-25": 0.41,     // ~41%
  "26-50": 0.34,    // ~34%
  "51-75": 0.20,    // ~20%
  "76-100": 0.0499, // ~4.99%
  "100+": 0.0001    // ~0.01%
};

const App = () => {
  const [population, setPopulation] = useState(0);
  const [stats, setStats] = useState({
    birthsToday: 0,
    deathsToday: 0,
    growthToday: 0
  });
  const [demographics, setDemographics] = useState({
    male: { total: 0, groups: {} },
    female: { total: 0, groups: {} }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Animation ref
  const requestRef = useRef();
  
  // Initialize data
  useEffect(() => {
    // defer mounted flip to avoid synchronous setState within effect
    const mountRaf = requestAnimationFrame(() => setMounted(true));
    
    // Inject Font for Dot Matrix
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DotGothic16&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const updateCounts = () => {
      const now = Date.now();
      const nowObj = new Date();
      
      // 1. Calculate Total Population
      const secondsDiff = (now - ANCHOR_DATE) / 1000;
      const currentPop = ANCHOR_POPULATION + (secondsDiff * GROWTH_RATE_PER_SEC);
      
      // 2. Calculate "Today" Stats
      const startOfDay = new Date(nowObj.getFullYear(), nowObj.getMonth(), nowObj.getDate()).getTime();
      const secondsSinceMidnight = (now - startOfDay) / 1000;
      
      setPopulation(Math.floor(currentPop));
      
      setStats({
        birthsToday: Math.floor(secondsSinceMidnight * BIRTH_RATE_PER_SEC),
        deathsToday: Math.floor(secondsSinceMidnight * DEATH_RATE_PER_SEC),
        growthToday: Math.floor(secondsSinceMidnight * GROWTH_RATE_PER_SEC)
      });

      // 3. Calculate Demographics
      const maleTotal = Math.floor(currentPop * GENDER_RATIO.MALE);
      const femaleTotal = Math.floor(currentPop * GENDER_RATIO.FEMALE);

      setDemographics({
        male: {
          total: maleTotal,
          groups: {
            "0-25 Years": Math.floor(maleTotal * AGE_DISTRIBUTION["0-25"]),
            "26-50 Years": Math.floor(maleTotal * AGE_DISTRIBUTION["26-50"]),
            "51-75 Years": Math.floor(maleTotal * AGE_DISTRIBUTION["51-75"]),
            "76-100 Years": Math.floor(maleTotal * AGE_DISTRIBUTION["76-100"]),
            "100+ Years": Math.floor(maleTotal * AGE_DISTRIBUTION["100+"]),
          }
        },
        female: {
          total: femaleTotal,
          groups: {
            "0-25 Years": Math.floor(femaleTotal * AGE_DISTRIBUTION["0-25"]),
            "26-50 Years": Math.floor(femaleTotal * AGE_DISTRIBUTION["26-50"]),
            "51-75 Years": Math.floor(femaleTotal * AGE_DISTRIBUTION["51-75"]),
            "76-100 Years": Math.floor(femaleTotal * AGE_DISTRIBUTION["76-100"]),
            "100+ Years": Math.floor(femaleTotal * AGE_DISTRIBUTION["100+"]),
          }
        }
      });

      requestRef.current = requestAnimationFrame(updateCounts);
    };

    requestRef.current = requestAnimationFrame(updateCounts);

    return () => {
      cancelAnimationFrame(mountRaf);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Generate last 15 days history
  const historyData = useMemo(() => {
    const data = [];
    const now = new Date();
    const baseBirths = 86400 * BIRTH_RATE_PER_SEC;
    const baseDeaths = 86400 * DEATH_RATE_PER_SEC;

    for (let i = 1; i <= 15; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const varianceSeed = d.getDate() * d.getMonth(); 
      const variance = Math.sin(varianceSeed) * 0.015;

      data.push({
        date: dateStr,
        births: Math.floor(baseBirths * (1 + variance)),
        deaths: Math.floor(baseDeaths * (1 + variance)),
      });
    }
    return data;
  }, []);

  const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-red-900 selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-[#0f0f0f]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-red-600 animate-pulse" />
              <span className="font-bold text-xl tracking-tight">World<span className="text-red-600">Live</span></span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-medium text-red-500 uppercase tracking-wider">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* AI Prediction Sub-Navbar (Ticker) */}
      <PredictionTicker currentPopulation={population} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        
        {/* Hero Section: Main Counter */}
        <div className="flex flex-col items-center justify-center text-center mb-20">
          <h2 className="text-gray-400 font-medium text-lg sm:text-xl mb-6 flex items-center gap-2">
            <Users className="w-5 h-5" />
            CURRENT WORLD POPULATION
          </h2>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-red-500/5 blur-3xl rounded-full pointer-events-none"></div>
            <h1 className="relative text-6xl sm:text-8xl md:text-9xl font-black tabular-nums tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
              {formatNumber(population)}
            </h1>
          </div>
          
          <p className="mt-8 text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Estimated simulation based on United Nations and Worldometer data algorithms. 
            Updates in real-time reflecting global birth and death rates.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <StatsCard 
            icon={<Baby className="w-6 h-6 text-green-400" />}
            title="Births Today"
            count={stats.birthsToday}
            color="green"
            rate="~4.3 per sec"
          />
          <StatsCard 
            icon={<Skull className="w-6 h-6 text-gray-400" />}
            title="Deaths Today"
            count={stats.deathsToday}
            color="gray"
            rate="~2.0 per sec"
          />
          <StatsCard 
            icon={<TrendingUp className="w-6 h-6 text-blue-400" />}
            title="Population Growth Today"
            count={stats.growthToday}
            color="blue"
            rate="~2.3 per sec"
          />
        </div>

        {/* Demographics Section */}
        <div className="border-t border-gray-800 pt-12">
           <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Users className="w-6 h-6 text-red-500" />
              Real-Time Demographics
              <span className="text-xs font-normal text-gray-500 bg-gray-800 px-2 py-1 rounded ml-2">ESTIMATED DISTRIBUTION</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Male Column */}
              <DemographicColumn 
                gender="Male"
                total={demographics.male.total}
                groups={demographics.male.groups}
                color="blue"
              />
              
              {/* Female Column */}
              <DemographicColumn 
                gender="Female"
                total={demographics.female.total}
                groups={demographics.female.groups}
                color="pink"
              />
            </div>
        </div>

        {/* Historical Data Dropdown */}
        <div className="mt-20 flex flex-col items-center justify-center relative z-10">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 border border-gray-700 hover:border-red-500/50 hover:bg-gray-800 transition-all text-white font-medium group mb-4"
          >
            <Calendar className="w-5 h-5 text-red-500" />
            View Last 15 Days History
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`} />
          </button>

          <div className={`
             w-full max-w-3xl overflow-hidden transition-all duration-500 ease-in-out
             ${showHistory ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
          `}>
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-800 text-sm font-bold text-gray-400 uppercase tracking-wider">
                <div>Date</div>
                <div className="text-right text-green-500">Est. Births</div>
                <div className="text-right text-gray-400">Est. Deaths</div>
              </div>
              <div className="space-y-3">
                {historyData.map((day, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 text-sm hover:bg-white/5 p-2 rounded-lg transition-colors">
                    <div className="font-mono text-gray-300">{day.date}</div>
                    <div className="text-right tabular-nums text-green-400 font-medium">+{formatNumber(day.births)}</div>
                    <div className="text-right tabular-nums text-gray-500 font-medium">-{formatNumber(day.deaths)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div className="mt-12 border-t border-gray-800 pt-12 grid md:grid-cols-2 gap-12 text-gray-400">
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              How is this calculated?
            </h3>
            <p className="mb-4 leading-relaxed">
              This live counter uses a probabilistic algorithm rooted in demographic data.
              Starting from a verified anchor point in mid-2025, we apply the current global growth rate coefficient.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                Approx. 250 babies born per minute
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                Approx. 120 deaths per minute
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Net increase of ~130 people per minute
              </li>
            </ul>
          </div>

          <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-800 rounded-xl">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Did you know?</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  The human population reached 8 billion on November 15, 2022. It is expected to peak at around 10.4 billion people during the 2080s and remain at that level until 2100.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      <footer className="border-t border-gray-800 py-8 mt-12 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} WorldLive Analytics. Simulation for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
};

// --- Prediction Ticker Component ---

const PredictionTicker = ({ currentPopulation }) => {
  // Calculated stats for the ticker
  // Returns array of objects { label, value, suffix } to allow coloring
  const predictions = useMemo(() => {
    // 24hr Population Growth
    const dailyGrowth = Math.floor(GROWTH_RATE_PER_SEC * 86400);
    const popForecast = currentPopulation + dailyGrowth;
    
    // Global Wealth (Estimated ~$454 Trillion base growing approx $200M/hr - stylized)
    // We simulate a live flux
    const wealthBase = 454.3; // Trillions
    const wealthGrowth24h = 0.012; // +$12 Billion/day estimate

    // Internet Users (Approx 67% of world)
    const internetUsers = Math.floor(currentPopulation * 0.67);
    const internetGrowth24h = Math.floor(dailyGrowth * 0.75); // New users

    return [
      { 
        label: "FORECAST (24H): GLOBAL POPULATION REACHING", 
        value: `${new Intl.NumberFormat('en-US').format(popForecast)}`,
        suffix: `(+${new Intl.NumberFormat('en-US').format(dailyGrowth)})`
      },
      { 
        label: "GLOBAL WEALTH PROJECTION:", 
        value: `$${(wealthBase + wealthGrowth24h).toFixed(3)} TRILLION`,
        suffix: "(TRENDING UP)"
      },
      { 
        label: "ACTIVE INTERNET USERS:", 
        value: `${new Intl.NumberFormat('en-US').format(internetUsers + internetGrowth24h)}`,
        suffix: `(EST. +${new Intl.NumberFormat('en-US').format(internetGrowth24h)} NEW USERS)`
      },
      { 
        label: "EST. CO2 EMISSIONS (24H):", 
        value: "104,320,000 TONS", 
        suffix: "[HIGH ALERT]"
      },
      { 
        label: "DATA GENERATED (24H):", 
        value: "328 EXABYTES", 
        suffix: "[EXPONENTIAL GROWTH DETECTED]"
      }
    ];
  }, [currentPopulation]);

  return (
    <div className="relative w-full h-12 bg-black border-b border-gray-800 overflow-hidden flex items-center">
      
      {/* Scrolling Text */}
      <div className="flex whitespace-nowrap animate-marquee">
        {/* We duplicate the content to ensure smooth infinite scroll */}
        {[...predictions, ...predictions, ...predictions].map((item, i) => (
          <div key={i} className="flex items-center mx-10">
            <span 
              className="text-white text-base tracking-widest flex items-center gap-2"
              style={{ fontFamily: '"DotGothic16", monospace' }}
            >
              <span className="opacity-80">{item.label}</span>
              <span className="text-green-500 font-bold">{item.value}</span>
              {item.suffix && <span className="opacity-80">{item.suffix}</span>}
            </span>
            {/* Simple white dot separator */}
            <div className="w-1.5 h-1.5 bg-white rounded-full ml-10 opacity-50"></div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

// --- Stats Card Component ---

const StatsCard = ({ icon, title, count, color, rate }) => {
  const colorClasses = {
    green: "text-green-400 group-hover:text-green-300 bg-green-500/10 border-green-500/20",
    gray: "text-gray-400 group-hover:text-gray-300 bg-gray-500/10 border-gray-500/20",
    blue: "text-blue-400 group-hover:text-blue-300 bg-blue-500/10 border-blue-500/20",
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl p-6 border border-gray-800 bg-gray-900/20 hover:bg-gray-900/40 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color].split(' ').slice(2).join(' ')}`}>
          {icon}
        </div>
        <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded-md">
          {rate}
        </span>
      </div>
      
      <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">{title}</h3>
      <p className={`text-3xl sm:text-4xl font-bold tabular-nums ${colorClasses[color].split(' ')[0]}`}>
        {new Intl.NumberFormat('en-US').format(count)}
      </p>
      
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-${color}-500/10 blur-3xl rounded-full group-hover:bg-${color}-500/20 transition-all`}></div>
    </div>
  );
};

// Demographic Column Component
const DemographicColumn = ({ gender, total, groups, color }) => {
  const isBlue = color === 'blue';
  const headerColor = isBlue ? 'text-blue-400' : 'text-pink-400';
  const barColor = isBlue ? 'bg-blue-500' : 'bg-pink-500';
  const bgColor = isBlue ? 'bg-blue-500/5' : 'bg-pink-500/5';
  const borderColor = isBlue ? 'border-blue-500/20' : 'border-pink-500/20';

  return (
    <div className={`rounded-2xl border ${borderColor} ${bgColor} p-6 sm:p-8`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800/50">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <PersonStanding className={`w-6 h-6 ${headerColor}`} />
            <h3 className={`text-xl font-bold ${headerColor} uppercase tracking-wider`}>{gender}s</h3>
          </div>
          <p className="text-sm text-gray-500">Total Estimated Count</p>
        </div>
        <div className={`text-2xl sm:text-4xl font-bold tabular-nums text-white`}>
          {new Intl.NumberFormat('en-US').format(total)}
        </div>
      </div>

      {/* Age Groups List */}
      <div className="space-y-6">
        {Object.entries(groups).map(([label, count]) => (
          <div key={label} className="relative">
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm font-medium text-gray-400">{label}</span>
              <span className="text-lg sm:text-xl font-bold tabular-nums text-gray-200">
                {new Intl.NumberFormat('en-US').format(count)}
              </span>
            </div>
            {/* Simple progress bar visualizer relative to total */}
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${barColor} opacity-60`} 
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
