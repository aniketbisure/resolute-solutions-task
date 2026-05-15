'use client';
import React from 'react';

interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  speed?: string;
}

const StarBorder: React.FC<StarBorderProps> = ({ 
  children, 
  className = '', 
  color = '#EAB308', 
  speed = '4s' 
}) => {
  return (
    <div className={`relative p-[1px] overflow-hidden rounded-2xl ${className}`}>
      {/* Animated Border Gradient */}
      <div 
        className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite]"
        style={{
          animationDuration: speed,
          background: `conic-gradient(from 90deg at 50% 50%, transparent 0deg, ${color} 180deg, transparent 360deg)`
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 bg-background rounded-[15px] h-full w-full">
        {children}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StarBorder;
