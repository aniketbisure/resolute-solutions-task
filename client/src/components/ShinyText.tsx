'use client';
import { useTheme } from 'next-themes';
import React from 'react';

interface ShinyTextProps {
  text: string;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, className = '' }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themeColors = mounted ? (theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(15, 23, 42, 0.8)') : 'rgba(15, 23, 42, 0.8)';

  return (
    <span
      className={`relative inline-block font-bold ${className}`}
      style={{
        color: 'transparent',
        backgroundImage: `linear-gradient(120deg, 
          ${themeColors} 30%, 
          #EAB308 50%, 
          ${themeColors} 70%)`,
        backgroundSize: '200% 100%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        animation: 'shiny 8s infinite linear',
      }}
    >
      {text}
      <style jsx>{`
        @keyframes shiny {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }
      `}</style>
    </span>
  );
};

export default ShinyText;
