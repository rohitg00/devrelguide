'use client'

import { useEffect, useState } from 'react'

export function AvocadoFallback() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [expression, setExpression] = useState<'happy' | 'surprised' | 'wink'>('happy');
  const [bobAnimation, setBobAnimation] = useState(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  
  // Add gentle bobbing animation
  useEffect(() => {
    const bobInterval = setInterval(() => {
      setBobAnimation(prev => (prev + 1) % 100);
    }, 50);
    
    return () => clearInterval(bobInterval);
  }, []);
  
  // Handle random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, Math.random() * 3000 + 2000);
    
    return () => clearInterval(blinkInterval);
  }, []);
  
  // Handle random expressions
  useEffect(() => {
    const expressionInterval = setInterval(() => {
      const expressions: Array<'happy' | 'surprised' | 'wink'> = ['happy', 'surprised', 'wink'];
      const newExpression = expressions[Math.floor(Math.random() * expressions.length)];
      setExpression(newExpression);
      
      // Return to happy after a moment
      setTimeout(() => setExpression('happy'), 1000);
    }, Math.random() * 8000 + 5000);
    
    return () => clearInterval(expressionInterval);
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate position within the container
      const container = document.getElementById('avocado-container');
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Allow more natural movement with wider boundaries
      const limitedX = Math.min(Math.max(x, 10), 90);
      const limitedY = Math.min(Math.max(y, 10), 90);
      
      // Calculate rotation based on mouse position to create a 3D effect
      const rotX = (y - 50) / 8; // tilt based on vertical position
      const rotY = (50 - x) / 8; // tilt based on horizontal position
      
      setRotation({ x: rotX, y: rotY });
      
      // Change expression based on cursor speed and position
      if (Math.abs(limitedX - position.x) > 20 || Math.abs(limitedY - position.y) > 20) {
        setExpression('surprised');
        setTimeout(() => setExpression('happy'), 500);
      }
      
      setPosition({ 
        x: limitedX, 
        y: limitedY 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [position]);

  // Calculate bobbing effect
  const bobOffset = Math.sin(bobAnimation / 15) * 3;

  return (
    <div id="avocado-container" className="w-full h-full relative overflow-visible flex items-center justify-center">
      <div className="absolute w-40 h-40 rounded-full bg-green-700/10 blur-xl animate-pulse" 
           style={{ 
             left: `${position.x}%`, 
             top: `${position.y}%`,
             transform: 'translate(-50%, -50%)'
           }}
      />
      
      <div 
        className="absolute transition-all duration-300 ease-out"
        style={{ 
          left: `${position.x}%`, 
          top: `calc(${position.y}% + ${bobOffset}px)`, 
          transform: `translate(-50%, -50%) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        {/* Avocado Body */}
        <div className="relative">
          {/* Shadow underneath */}
          <div className="absolute bottom-0 left-1/2 w-24 h-4 bg-black/20 rounded-full blur-md transform -translate-x-1/2 translate-y-4"></div>
          
          {/* Avocado Body - more 3D looking */}
          <div className="w-36 h-44 rounded-[70%] shadow-xl relative overflow-hidden bg-gradient-to-br from-green-400 via-green-500 to-green-700" 
               style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.2), inset 0 -8px 30px rgba(0,0,0,0.1), inset 0 8px 30px rgba(255,255,255,0.2)' }}>
            {/* Add more dimension with inner shadows */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-300/40 to-transparent rounded-[70%]"></div>
            <div className="absolute inset-0 shadow-[inset_-8px_-8px_20px_rgba(0,0,0,0.2)] rounded-[70%]"></div>
            
            {/* Avocado inner flesh - more centered and oval */}
            <div className="w-28 h-28 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full absolute top-8 left-4 overflow-hidden"
                 style={{ boxShadow: 'inset 2px 4px 8px rgba(255,255,255,0.4), inset -2px -2px 8px rgba(0,0,0,0.2)' }}>
              {/* Pit gradient - more realistic */}
              <div className="w-18 h-18 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full absolute top-5 left-5"
                   style={{ boxShadow: 'inset 2px 2px 8px rgba(0,0,0,0.5), 2px 2px 5px rgba(0,0,0,0.15)' }}>
                {/* Add texture to pit */}
                <div className="absolute w-2 h-2 bg-amber-600/30 rounded-full top-3 left-3"></div>
                <div className="absolute w-1.5 h-1.5 bg-amber-600/20 rounded-full top-8 left-9"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_60%)]"></div>
              </div>
            </div>
            
            {/* Avocado highlights for more dimension */}
            <div className="w-12 h-4 bg-white opacity-25 rounded-full absolute top-5 left-7 transform rotate-45 blur-[1px]"></div>
            <div className="w-8 h-8 bg-white opacity-15 rounded-full absolute top-20 left-24 blur-[2px]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.15),transparent_70%)]"></div>
          </div>
          
          {/* Cute face - positioned better */}
          <div className="absolute top-14 left-0 w-full flex justify-center">
            {/* Eyes - more expressive */}
            <div className="flex space-x-10 mb-2">
              {/* Left eye */}
              <div className="relative">
                {expression === 'surprised' ? (
                  <div className="w-4 h-4 border-2 border-black rounded-full bg-white" style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)' }}></div>
                ) : (
                  <div className={`w-4 h-${isBlinking ? '0.5' : '4'} rounded-full transition-all duration-100 bg-black overflow-hidden`} style={{ boxShadow: isBlinking ? 'none' : '0 1px 2px rgba(0,0,0,0.3)' }}>
                    {!isBlinking && <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 left-0.5"></div>}
                  </div>
                )}
              </div>
              
              {/* Right eye */}
              <div className="relative">
                {expression === 'surprised' ? (
                  <div className="w-4 h-4 border-2 border-black rounded-full bg-white" style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)' }}></div>
                ) : (
                  <div className={`w-4 h-${isBlinking || expression === 'wink' ? '0.5' : '4'} rounded-full transition-all duration-100 bg-black overflow-hidden`} style={{ boxShadow: (isBlinking || expression === 'wink') ? 'none' : '0 1px 2px rgba(0,0,0,0.3)' }}>
                    {!isBlinking && expression !== 'wink' && <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 left-0.5"></div>}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Smile - more expressive */}
          <div className="absolute top-22 left-0 w-full flex justify-center">
            {expression === 'happy' && (
              <div className="w-12 h-6 border-b-2 border-black rounded-b-full"></div>
            )}
            {expression === 'surprised' && (
              <div className="w-7 h-7 border-2 border-black rounded-full bg-white/30" style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}></div>
            )}
            {expression === 'wink' && (
              <div className="w-12 h-6 border-b-2 border-black rounded-b-full transform -translate-x-1.5"></div>
            )}
          </div>
          
          {/* Avocado "stems/leaves" at top */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-8 bg-gradient-to-t from-green-700 to-green-800 rounded-full transform rotate-3"
                 style={{ boxShadow: '0 -1px 3px rgba(0,0,0,0.3)' }}></div>
            <div className="absolute -right-4 top-1 w-6 h-3 bg-gradient-to-r from-green-700 to-green-800 rounded-full transform rotate-25"
                 style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></div>
            <div className="absolute -left-4 top-1 w-6 h-3 bg-gradient-to-l from-green-700 to-green-800 rounded-full transform -rotate-25"
                 style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></div>
          </div>
          
          {/* Simple arms - more natural curves */}
          <div className="absolute -left-9 top-16 w-12 h-4 bg-gradient-to-l from-green-500 to-green-600 rounded-full transform rotate-30"
               style={{ boxShadow: '0 2px 3px rgba(0,0,0,0.2)' }}></div>
          <div className="absolute -right-9 top-16 w-12 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full transform -rotate-30"
               style={{ boxShadow: '0 2px 3px rgba(0,0,0,0.2)' }}></div>
        </div>
      </div>
      
      {/* Subtle star decorations */}
      <div className="absolute w-6 h-6 text-yellow-300/40" style={{ left: '15%', top: '20%' }}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="animate-pulse opacity-50">
          <path d="M12 1L9 9H1L7 14L5 22L12 17L19 22L17 14L23 9H15L12 1Z" />
        </svg>
      </div>
      
      <div className="absolute w-5 h-5 text-yellow-300/40" style={{ right: '20%', top: '25%' }}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="animate-pulse opacity-50" style={{ animationDelay: '0.5s' }}>
          <path d="M12 1L9 9H1L7 14L5 22L12 17L19 22L17 14L23 9H15L12 1Z" />
        </svg>
      </div>
    </div>
  );
} 