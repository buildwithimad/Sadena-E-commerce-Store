import { memo } from 'react';

const PatternBackground = memo(() => {
  return (
    <div 
      // Adjusted opacity to a subtle 8% to feel premium and avoid clashing with foreground elements
      className="fixed inset-0 z-0 pointer-events-none opacity-[0.08] flex justify-center items-center overflow-hidden"
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern 
            id="sadena-organic-pattern" 
            x="0" 
            y="0" 
            width="260" 
            height="260" 
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(20)"
          >
            {/* Premium Organic Petal Geometry 
              Using exactly 4 overlapping circles: 1 center + 3 offset in a perfect triad.
              This guarantees a flowing, breathable design with natural intersections.
            */}
            
            {/* Center Main Circle */}
            <circle cx="130" cy="130" r="85" fill="none" stroke="#009345" strokeWidth="2.5" />
            
            {/* Offset Circle 1 (Top) */}
            <circle cx="130" cy="85" r="85" fill="none" stroke="#009345" strokeWidth="2.5" />
            
            {/* Offset Circle 2 (Bottom Right) */}
            <circle cx="169" cy="152.5" r="85" fill="none" stroke="#009345" strokeWidth="2.5" />
            
            {/* Offset Circle 3 (Bottom Left) */}
            <circle cx="91" cy="152.5" r="85" fill="none" stroke="#009345" strokeWidth="2.5" />
            
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sadena-organic-pattern)" />
      </svg>
    </div>
  );
});

PatternBackground.displayName = 'PatternBackground';
export default PatternBackground;