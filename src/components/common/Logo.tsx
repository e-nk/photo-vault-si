import React from 'react';

export const Logo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="120" height="30">
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8ba3e8" />
          <stop offset="100%" stopColor="#e8a5c9" />
        </linearGradient>
        <linearGradient id="cameraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Camera Body with Glow */}
      <g filter="url(#glow)">
        <rect x="15" y="18" width="40" height="30" rx="3" ry="3" fill="url(#cameraGradient)" />
        <rect x="35" y="13" width="15" height="5" rx="2" ry="2" fill="url(#cameraGradient)" />
        
        {/* Camera Lens */}
        <circle cx="35" cy="33" r="12" fill="#1a1a1a" stroke="#a390f4" strokeWidth="1.5" />
        <circle cx="35" cy="33" r="8" fill="#121212" stroke="#a390f4" strokeWidth="0.8" />
        <circle cx="35" cy="33" r="4" fill="#0a0a0a" />
        <circle cx="32" cy="30" r="1.5" fill="white" fillOpacity="0.6" />
        
        {/* Camera Flash */}
        <rect x="50" y="22" width="4" height="4" rx="1" ry="1" fill="#f5f5f5" />
      </g>
      
      {/* Lock Shape for Vault Theme */}
      <g transform="translate(60, 28) scale(0.9)" filter="url(#glow)">
        <path d="M10,0 H30 A10,10 0 0 1 40,10 V30 A10,10 0 0 1 30,40 H10 A10,10 0 0 1 0,30 V10 A10,10 0 0 1 10,0 Z" fill="#2d2d2d" />
        <rect x="10" y="16" width="20" height="20" rx="3" ry="3" fill="#1a1a1a" stroke="#f43f5e" strokeWidth="1.5" />
        <rect x="15" y="5" width="10" height="15" rx="5" ry="5" fill="none" stroke="#f43f5e" strokeWidth="3" />
        <circle cx="20" cy="26" r="3" fill="#f43f5e" />
        <rect x="19" y="26" width="2" height="5" fill="#f43f5e" />
      </g>
      
      {/* Text: "PhotoVault" */}
      <text x="110" y="40" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="url(#textGradient)">PhotoVault</text>
      
      {/* Connecting Element */}
      <path d="M102,35 C95,35 90,30 85,30" stroke="#a390f4" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
    </svg>
  );
};