import React from 'react';
import './HeroMap.css';

const W = 1200;
const H = 560;

// Mercator projection
const proj = (lng, lat) => [
  (lng + 180) * (W / 360),
  (90 - lat) * (H / 180),
];

const HUBS = [
  { id: 'shanghai',  label: 'Shanghai',     lng: 121.4,  lat: 31.2  },
  { id: 'rotterdam', label: 'Rotterdam',    lng: 4.4,    lat: 51.9  },
  { id: 'singapore', label: 'Singapore',    lng: 103.8,  lat: 1.3   },
  { id: 'la',        label: 'Los Angeles',  lng: -118.2, lat: 34.0  },
  { id: 'dubai',     label: 'Dubai',        lng: 55.3,   lat: 25.2  },
  { id: 'newyork',   label: 'New York',     lng: -74.0,  lat: 40.7  },
  { id: 'tokyo',     label: 'Tokyo',        lng: 139.7,  lat: 35.7  },
  { id: 'mumbai',    label: 'Mumbai',       lng: 72.8,   lat: 19.1  },
  { id: 'hamburg',   label: 'Hamburg',      lng: 10.0,   lat: 53.6  },
  { id: 'sydney',    label: 'Sydney',       lng: 151.2,  lat: -33.9 },
];

const ROUTES = [
  { from: 'shanghai',  to: 'rotterdam', dur: 3.2, delay: 0.0  },
  { from: 'shanghai',  to: 'singapore', dur: 2.0, delay: 0.6  },
  { from: 'shanghai',  to: 'la',        dur: 4.2, delay: 1.2  },
  { from: 'shanghai',  to: 'tokyo',     dur: 1.8, delay: 0.3  },
  { from: 'singapore', to: 'dubai',     dur: 2.5, delay: 1.8  },
  { from: 'singapore', to: 'mumbai',    dur: 2.0, delay: 0.9  },
  { from: 'rotterdam', to: 'newyork',   dur: 3.0, delay: 2.1  },
  { from: 'rotterdam', to: 'hamburg',   dur: 1.5, delay: 0.4  },
  { from: 'dubai',     to: 'rotterdam', dur: 3.5, delay: 1.0  },
  { from: 'dubai',     to: 'mumbai',    dur: 1.8, delay: 0.7  },
  { from: 'la',        to: 'newyork',   dur: 2.5, delay: 0.2  },
  { from: 'tokyo',     to: 'la',        dur: 3.8, delay: 2.4  },
  { from: 'sydney',    to: 'singapore', dur: 3.5, delay: 1.5  },
];

// Quadratic bezier arc — control point lifted above the chord
const arcPath = (x1, y1, x2, y2) => {
  const mx = (x1 + x2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const my = Math.min(y1, y2) - dist * 0.24;
  return `M ${x1.toFixed(1)},${y1.toFixed(1)} Q ${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
};

// Simplified continent outlines (Mercator, 1200×560)
const CONTINENTS = [
  // North America
  'M 120,88 L 205,52 L 375,45 L 448,102 L 438,152 L 400,200 L 348,253 L 305,272 L 247,255 L 205,228 L 192,204 L 168,207 L 148,222 L 148,252 L 178,268 L 140,255 L 105,215 L 92,162 L 105,118 Z',
  // South America
  'M 295,265 L 335,248 L 390,262 L 475,318 L 472,380 L 442,422 L 395,442 L 355,448 L 342,478 L 328,440 L 318,388 L 305,330 L 302,290 Z',
  // Europe (inc. Scandinavian peninsula)
  'M 542,98 L 572,78 L 598,72 L 635,74 L 672,78 L 715,92 L 732,120 L 706,142 L 662,138 L 618,128 L 582,135 L 550,122 Z',
  // Africa
  'M 542,172 L 625,152 L 715,165 L 752,205 L 758,268 L 742,342 L 708,410 L 658,432 L 606,416 L 562,372 L 544,310 L 542,248 L 542,200 Z',
  // Asia (main body)
  'M 718,84 L 808,65 L 925,56 L 1018,70 L 1092,92 L 1148,128 L 1182,155 L 1162,185 L 1098,200 L 1042,196 L 985,225 L 944,248 L 906,233 L 858,214 L 808,190 L 765,168 L 736,145 L 716,116 Z',
  // India peninsula
  'M 825,196 L 872,212 L 890,252 L 868,285 L 835,268 L 815,234 Z',
  // SE Asia peninsula
  'M 936,238 L 965,242 L 968,278 L 951,302 L 924,282 L 918,260 Z',
  // Australia
  'M 962,315 L 1036,302 L 1108,318 L 1146,358 L 1140,398 L 1100,418 L 1048,422 L 998,406 L 962,377 L 952,342 Z',
  // Greenland
  'M 355,36 L 425,30 L 462,48 L 452,74 L 412,84 L 364,74 L 344,52 Z',
  // Japan
  'M 1048,170 L 1075,160 L 1085,175 L 1065,188 L 1045,180 Z',
  // UK / Ireland (rough)
  'M 548,96 L 568,88 L 578,100 L 566,115 L 548,108 Z',
];

export default function HeroMap() {
  const coords = {};
  HUBS.forEach(h => { coords[h.id] = proj(h.lng, h.lat); });

  return (
    <svg
      className="hero-map-svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="hm-glow-sm" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="hm-glow-md" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="hm-glow-lg" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="hm-node-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb391" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f65a24" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Graticule lines every 30° */}
      <g stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" fill="none">
        {[-60, -30, 0, 30, 60].map(lat => {
          const y = (90 - lat) * (H / 180);
          return <line key={`lat-${lat}`} x1="0" y1={y} x2={W} y2={y} />;
        })}
        {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map(lng => {
          const x = (lng + 180) * (W / 360);
          return <line key={`lng-${lng}`} x1={x} y1="0" x2={x} y2={H} />;
        })}
      </g>

      {/* Continent fills */}
      <g
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(251, 138, 92,0.18)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      >
        {CONTINENTS.map((d, i) => <path key={i} d={d} />)}
      </g>

      {/* Route base arcs — always-on, very faint */}
      {ROUTES.map((r, i) => {
        const [x1, y1] = coords[r.from];
        const [x2, y2] = coords[r.to];
        return (
          <path
            key={`arc-base-${i}`}
            d={arcPath(x1, y1, x2, y2)}
            fill="none"
            stroke="rgba(251, 138, 92,0.16)"
            strokeWidth="1"
          />
        );
      })}

      {/* Traveling light particles */}
      {ROUTES.map((r, i) => {
        const [x1, y1] = coords[r.from];
        const [x2, y2] = coords[r.to];
        const path = arcPath(x1, y1, x2, y2);
        return (
          <g key={`particle-${i}`}>
            {/* Outer glow halo */}
            <circle r="7" fill="rgba(246, 90, 36,0.35)" filter="url(#hm-glow-lg)">
              <animateMotion
                dur={`${r.dur}s`}
                begin={`${r.delay}s`}
                repeatCount="indefinite"
                path={path}
              />
            </circle>
            {/* Mid glow */}
            <circle r="4" fill="rgba(251, 138, 92,0.55)" filter="url(#hm-glow-md)">
              <animateMotion
                dur={`${r.dur}s`}
                begin={`${r.delay}s`}
                repeatCount="indefinite"
                path={path}
              />
            </circle>
            {/* Bright core dot */}
            <circle r="2" fill="#ffffff" filter="url(#hm-glow-sm)">
              <animateMotion
                dur={`${r.dur}s`}
                begin={`${r.delay}s`}
                repeatCount="indefinite"
                path={path}
              />
            </circle>
          </g>
        );
      })}

      {/* Hub nodes */}
      {HUBS.map((hub, i) => {
        const [x, y] = coords[hub.id];
        return (
          <g key={hub.id}>
            {/* Outer pulse ring */}
            <circle
              cx={x} cy={y} r="10"
              fill="rgba(246, 90, 36,0.25)"
              className="hm-pulse"
              style={{ '--hm-pulse-delay': `${(i * 0.38).toFixed(2)}s` }}
            />
            {/* Static ring */}
            <circle
              cx={x} cy={y} r="4.5"
              fill="none"
              stroke="rgba(255, 179, 145,0.55)"
              strokeWidth="1"
            />
            {/* Core */}
            <circle
              cx={x} cy={y} r="2.5"
              fill="#ffffff"
              filter="url(#hm-glow-sm)"
            />
          </g>
        );
      })}

      {/* City labels for main hubs */}
      {HUBS
        .filter(h => ['shanghai', 'rotterdam', 'singapore', 'la', 'dubai', 'tokyo', 'newyork', 'sydney'].includes(h.id))
        .map(hub => {
          const [x, y] = coords[hub.id];
          const above = y > H * 0.72; // below the fold — put label above
          return (
            <text
              key={`lbl-${hub.id}`}
              x={x}
              y={above ? y - 12 : y - 11}
              textAnchor="middle"
              fill="rgba(255,255,255,0.55)"
              fontSize="8"
              fontFamily="Inter, -apple-system, sans-serif"
              fontWeight="500"
              letterSpacing="0.4"
            >
              {hub.label}
            </text>
          );
        })}
    </svg>
  );
}
