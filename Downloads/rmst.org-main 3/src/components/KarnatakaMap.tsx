import React, { useState } from 'react';

interface DistrictInfo {
  id: string;
  name: string;
  farmers: number;
  youth: number;
  shgs: number;
  programsActive: string[];
  status: string;
  path: string;
  labelCoords: { x: number; y: number };
}

const KARNATAKA_DISTRICTS: DistrictInfo[] = [
  {
    id: "dharwad",
    name: "Dharwad (Hubballi HQ)",
    farmers: 1250,
    youth: 850,
    shgs: 25,
    programsActive: ["Sustainable Agri", "AI & Digital Skills", "Health Camps", "Women SHGs"],
    status: "Central Hub",
    path: "M 130 180 L 170 170 L 195 200 L 175 225 L 135 215 Z",
    labelCoords: { x: 160, y: 195 }
  },
  {
    id: "belagavi",
    name: "Belagavi",
    farmers: 950,
    youth: 600,
    shgs: 18,
    programsActive: ["Sustainable Agri", "Climate Resilience", "Women SHGs"],
    status: "High Impact",
    path: "M 80 120 L 140 100 L 170 150 L 130 180 L 80 150 Z",
    labelCoords: { x: 120, y: 140 }
  },
  {
    id: "bagalkot",
    name: "Bagalkot",
    farmers: 800,
    youth: 450,
    shgs: 14,
    programsActive: ["Sustainable Agri", "Micro-Irrigation", "Rural Entrepreneurship"],
    status: "High Impact",
    path: "M 170 100 L 230 110 L 220 160 L 170 150 Z",
    labelCoords: { x: 195, y: 130 }
  },
  {
    id: "vijayapura",
    name: "Vijayapura",
    farmers: 380,
    youth: 210,
    shgs: 7,
    programsActive: ["Sustainable Agri", "Water Recharge"],
    status: "Active Zone",
    path: "M 170 50 L 240 50 L 230 110 L 170 100 Z",
    labelCoords: { x: 200, y: 75 }
  },
  {
    id: "gadag",
    name: "Gadag",
    farmers: 650,
    youth: 300,
    shgs: 12,
    programsActive: ["Soil Testing", "Tree Plantation"],
    status: "Active Zone",
    path: "M 170 170 L 210 165 L 220 215 L 195 200 Z",
    labelCoords: { x: 195, y: 185 }
  },
  {
    id: "haveri",
    name: "Haveri",
    farmers: 500,
    youth: 280,
    shgs: 10,
    programsActive: ["Sustainable Agri", "Health Camps"],
    status: "Active Zone",
    path: "M 135 215 L 175 225 L 180 270 L 140 260 Z",
    labelCoords: { x: 155, y: 240 }
  },
  {
    id: "koppal",
    name: "Koppal",
    farmers: 450,
    youth: 250,
    shgs: 8,
    programsActive: ["Soil Health", "AI Skills"],
    status: "Active Zone",
    path: "M 220 160 L 270 160 L 265 215 L 220 215 Z",
    labelCoords: { x: 245, y: 185 }
  },
  {
    id: "raichur",
    name: "Raichur",
    farmers: 400,
    youth: 220,
    shgs: 6,
    programsActive: ["Sustainable Agri", "Maternal Health"],
    status: "Active Zone",
    path: "M 270 130 L 340 120 L 330 180 L 270 160 Z",
    labelCoords: { x: 300, y: 150 }
  },
  {
    id: "bidar",
    name: "Bidar",
    farmers: 350,
    youth: 200,
    shgs: 5,
    programsActive: ["Sustainable Agri", "Women SHGs"],
    status: "Active Zone",
    path: "M 290 20 L 340 10 L 350 60 L 300 65 Z",
    labelCoords: { x: 320, y: 38 }
  },
  {
    id: "kalaburagi",
    name: "Kalaburagi",
    farmers: 320,
    youth: 180,
    shgs: 5,
    programsActive: ["Drought Mitigation", "Health Camps"],
    status: "Active Zone",
    path: "M 240 50 L 300 65 L 320 120 L 270 130 L 230 110 Z",
    labelCoords: { x: 270, y: 85 }
  },
  {
    id: "ballari",
    name: "Ballari",
    farmers: 310,
    youth: 190,
    shgs: 6,
    programsActive: ["Soil Conservation", "Women SHGs"],
    status: "Active Zone",
    path: "M 265 215 L 320 200 L 310 260 L 260 250 Z",
    labelCoords: { x: 288, y: 230 }
  }
];

export const KarnatakaMap: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(KARNATAKA_DISTRICTS[0]);

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/40 shadow-xl">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Interactive SVG */}
        <div className="w-full md:w-1/2 relative flex justify-center">
          <div className="relative w-full max-w-sm aspect-square bg-emerald-50/50 dark:bg-slate-800/40 rounded-2xl p-4 flex items-center justify-center border border-emerald-100/60 dark:border-slate-800">
            <svg viewBox="0 0 400 320" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0B5D3B" />
                  <stop offset="100%" stopColor="#053B25" />
                </linearGradient>
                <linearGradient id="impactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* District Paths */}
              {KARNATAKA_DISTRICTS.map((d) => {
                const isSelected = selectedDistrict.id === d.id;
                let fill = "url(#activeGrad)";
                if (d.id === 'dharwad') fill = "url(#hubGrad)";
                else if (d.status === 'High Impact') fill = "url(#impactGrad)";

                return (
                  <g key={d.id} className="cursor-pointer group" onClick={() => setSelectedDistrict(d)}>
                    <path
                      d={d.path}
                      fill={fill}
                      stroke={isSelected ? "#C99A32" : "#FFFFFF"}
                      strokeWidth={isSelected ? "3" : "1.5"}
                      className="transition-all duration-300 hover:opacity-90 hover:scale-[1.01]"
                    />
                    {/* District Label */}
                    <text
                      x={d.labelCoords.x}
                      y={d.labelCoords.y}
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="pointer-events-none drop-shadow"
                    >
                      {d.id.toUpperCase()}
                    </text>
                  </g>
                );
              })}

              {/* Hub Indicator Pin at Hubballi */}
              <circle cx="160" cy="195" r="5" fill="#C99A32" className="animate-ping opacity-75" />
              <circle cx="160" cy="195" r="4" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-emerald-900 dark:text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B5D3B] inline-block"></span> HQ Hubballi
              </span>
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> High Impact
              </span>
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span> Active
              </span>
            </div>
          </div>
        </div>

        {/* Selected District Detail Card */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 w-max mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {selectedDistrict.status}
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-serif mb-2">
            {selectedDistrict.name} District
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Grassroot interventions in organic farming, water conservation, women self-help group capacity, and youth digital bootcamps.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-emerald-50/80 dark:bg-slate-800/80 p-3 rounded-xl border border-emerald-100 dark:border-slate-700 text-center">
              <span className="text-xl font-extrabold text-emerald-800 dark:text-emerald-400 block">
                {selectedDistrict.farmers}+
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Farmers</span>
            </div>
            <div className="bg-amber-50/80 dark:bg-slate-800/80 p-3 rounded-xl border border-amber-100 dark:border-slate-700 text-center">
              <span className="text-xl font-extrabold text-amber-700 dark:text-amber-400 block">
                {selectedDistrict.youth}+
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Youth Trained</span>
            </div>
            <div className="bg-blue-50/80 dark:bg-slate-800/80 p-3 rounded-xl border border-blue-100 dark:border-slate-700 text-center">
              <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400 block">
                {selectedDistrict.shgs}+
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Women SHGs</span>
            </div>
          </div>

          {/* Active programs tags */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Active Interventions
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedDistrict.programsActive.map((p, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  ✓ {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
