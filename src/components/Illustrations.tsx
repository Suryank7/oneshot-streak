import React from 'react';

// Retro Collage Art Illustration (Welcome Screen - Image 1 Center)
export function WelcomeCollageIllustration() {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background colorful tape pieces */}
      <rect x="30" y="20" width="16" height="45" rx="3" transform="rotate(-15 30 20)" fill="#ff523b" />
      <rect x="70" y="10" width="14" height="50" rx="3" transform="rotate(25 70 10)" fill="#2fa48e" />
      <rect x="250" y="30" width="18" height="55" rx="3" transform="rotate(-30 250 30)" fill="#ffb800" />
      <rect x="280" y="80" width="14" height="40" rx="3" transform="rotate(15 280 80)" fill="#ff523b" />
      
      {/* Code Snippet Tag Labels */}
      <rect x="45" y="45" width="40" height="12" rx="4" transform="rotate(40 45 45)" fill="#222" />
      <text x="50" y="54" fill="#fff" fontSize="7" fontWeight="bold" fontFamily="monospace" transform="rotate(40 45 45)">class</text>

      <rect x="240" y="55" width="45" height="14" rx="4" transform="rotate(-20 240 55)" fill="#222" />
      <text x="245" y="65" fill="#ff523b" fontSize="8" fontWeight="bold" fontFamily="monospace" transform="rotate(-20 240 55)">&lt;href&gt;</text>

      {/* Main Orange & Black Base Platform */}
      <rect x="40" y="200" width="240" height="40" rx="8" fill="#ff523b" />
      <rect x="110" y="180" width="170" height="45" rx="6" fill="#0d0d0d" />
      
      <text x="145" y="205" fill="#ff523b" fontSize="9" fontWeight="bold" fontFamily="monospace">001000 000111</text>

      {/* Center Figure Group (Abstract B&W Cutout People) */}
      <g transform="translate(45, 30)">
        {/* Top excited person */}
        <circle cx="115" cy="55" r="28" fill="#e2e8f0" stroke="#0d0d0d" strokeWidth="3" />
        <path d="M98 75 C105 60 125 60 132 75" fill="none" stroke="#0d0d0d" strokeWidth="4" />
        <ellipse cx="107" cy="50" rx="3" ry="5" fill="#0d0d0d" />
        <ellipse cx="123" cy="50" rx="3" ry="5" fill="#0d0d0d" />
        <path d="M110 60 Q115 67 120 60 Z" fill="#0d0d0d" />
        <path d="M90 95 L140 95 L135 150 L95 150 Z" fill="#334155" />
      </g>

      <g transform="translate(15, 60)">
        {/* Left sitting person */}
        <circle cx="75" cy="65" r="22" fill="#cbd5e1" stroke="#0d0d0d" strokeWidth="3" />
        <path d="M55 100 Q75 140 95 100" fill="#1e293b" />
      </g>

      {/* Right Box with X Icon */}
      <rect x="235" y="145" width="45" height="45" rx="8" fill="#0d0d0d" stroke="#fff" strokeWidth="2" />
      <path d="M247 157 L268 178 M268 157 L247 178" stroke="#ff523b" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// Retro Computer / Technology Illustration (Card 1 - Image 1 Left)
export function TechCardIllustration() {
  return (
    <svg viewBox="0 0 200 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Old computer monitor */}
      <rect x="10" y="20" width="70" height="60" rx="8" fill="#e2e8f0" stroke="#0d0d0d" strokeWidth="2" />
      <rect x="18" y="28" width="54" height="44" rx="4" fill="#0f172a" />
      <path d="M25 45 L40 45 M25 53 L55 53" stroke="#2fa48e" strokeWidth="3" strokeLinecap="round" />
      
      {/* Vintage Person with Retro Glasses */}
      <circle cx="140" cy="45" r="22" fill="#f87171" />
      <rect x="122" y="40" width="36" height="12" rx="4" fill="#0d0d0d" />
      <path d="M125 L165 85" stroke="#fff" strokeWidth="2" />

      {/* Code streamers */}
      <rect x="90" y="10" width="10" height="35" fill="#ffb800" transform="rotate(20 90 10)" />
      <rect x="110" y="70" width="8" height="30" fill="#2fa48e" transform="rotate(-30 110 70)" />
    </svg>
  );
}

// Girl with Lollipop Illustration (Friendship Card - Image 2 Left)
export function FriendshipCardIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="70" cy="70" r="60" fill="rgba(255,255,255,0.15)" />
      
      {/* Girl Head */}
      <path d="M35 80 C35 45 105 45 105 80 C105 105 35 105 35 80 Z" fill="#3b0764" />
      <circle cx="70" cy="75" r="26" fill="#fbcfe8" />
      {/* Hair bang */}
      <path d="M48 65 Q70 50 92 65 Q70 60 48 65 Z" fill="#3b0764" />
      {/* Eyes and cheeks */}
      <circle cx="60" cy="74" r="3" fill="#0d0d0d" />
      <circle cx="80" cy="74" r="3" fill="#0d0d0d" />
      <circle cx="55" cy="80" r="4" fill="#f43f5e" opacity="0.5" />
      <circle cx="85" cy="80" r="4" fill="#f43f5e" opacity="0.5" />
      {/* Smile */}
      <path d="M66 83 Q70 88 74 83" fill="none" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" />

      {/* Lollipop */}
      <circle cx="95" cy="90" r="10" fill="#ff523b" stroke="#fff" strokeWidth="2" />
      <line x1="95" y1="100" x2="95" y2="120" stroke="#fff" strokeWidth="3" strokeLinecap="round" />

      {/* Sparkles */}
      <path d="M25 40 L28 45 L33 48 L28 51 L25 56 L22 51 L17 48 L22 45 Z" fill="#fff" />
      <path d="M115 30 L117 34 L121 36 L117 38 L115 42 L113 38 L109 36 L113 34 Z" fill="#fff" />
    </svg>
  );
}

// Checklist & Thumbs Up Illustration (Congrats Screen - Image 2 Right)
export function CongratsIllustration() {
  return (
    <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Sunburst Star Sparkles */}
      <path d="M30 40 L34 46 L40 50 L34 54 L30 60 L26 54 L20 50 L26 46 Z" fill="#fff" />
      <path d="M180 30 L183 35 L188 38 L183 41 L180 46 L177 41 L172 38 L177 35 Z" fill="#fff" />
      <path d="M190 140 L193 144 L198 147 L193 150 L190 155 L187 150 L182 147 L187 144 Z" fill="#fff" />
      
      {/* Pink Clipboard Checklist */}
      <rect x="45" y="45" width="110" height="140" rx="16" fill="#f472b6" stroke="#fff" strokeWidth="3" />
      {/* Gold Clip */}
      <rect x="80" y="36" width="40" height="16" rx="6" fill="#fbbf24" stroke="#fff" strokeWidth="2" />
      <circle cx="100" cy="44" r="3" fill="#fff" />

      {/* Checkbox Rows */}
      <rect x="60" y="70" width="16" height="16" rx="4" fill="#fff" />
      <path d="M63 78 L68 83 L74 74" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="84" y="74" width="55" height="8" rx="4" fill="#fce7f3" />

      <rect x="60" y="100" width="16" height="16" rx="4" fill="#fff" />
      <path d="M63 108 L68 113 L74 104" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="84" y="104" width="45" height="8" rx="4" fill="#fce7f3" />

      <rect x="60" y="130" width="16" height="16" rx="4" fill="#fff" />
      <path d="M63 138 L68 143 L74 134" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="84" y="134" width="50" height="8" rx="4" fill="#fce7f3" />

      {/* Floating Thumbs Up Hand */}
      <g transform="translate(115, 85)">
        <rect x="15" y="30" width="18" height="35" rx="6" fill="#0d9488" stroke="#fff" strokeWidth="2" />
        <path d="M33 35 C33 20 48 20 48 32 C48 38 42 42 48 42 C54 42 54 48 48 50 C54 50 54 56 48 58 C54 58 52 65 42 65 L33 65 Z" fill="#0d9488" stroke="#fff" strokeWidth="2" />
      </g>

      {/* Floating Heart */}
      <path d="M75 30 C75 22 65 20 60 27 C55 20 45 22 45 30 C45 42 60 50 60 50 C60 50 75 42 75 30 Z" fill="#f43f5e" stroke="#fff" strokeWidth="2" />

      {/* Floating Question Block */}
      <rect x="15" y="115" width="30" height="30" rx="8" fill="#fff" transform="rotate(-15 15 115)" />
      <text x="22" y="137" fill="#0d0d0d" fontSize="18" fontWeight="bold" fontFamily="sans-serif" transform="rotate(-15 15 115)">?</text>
    </svg>
  );
}

// User Avatars for Leaderboard
export function UserAvatar({ seed, className = "w-10 h-10" }: { seed: number; className?: string }) {
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const bg = colors[seed % colors.length];
  const hats = ['🧢', '🤠', '🎓', '👑', '🎩', '🪖'];
  const hat = hats[seed % hats.length];

  return (
    <div 
      className={`rounded-full flex items-center justify-center font-bold text-white shadow-sm overflow-hidden ${className}`}
      style={{ backgroundColor: bg }}
    >
      <span style={{ fontSize: '1.2rem' }}>{hat}</span>
    </div>
  );
}
