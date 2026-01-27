
import React, { useEffect, useRef, useState } from 'react';

const CursorFollower: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'INPUT' || 
        target.closest('.pl-grid-item') !== null ||
        target.closest('[role="button"]') !== null;
      
      setIsHovering(isInteractive);
    };

    const onMouseOut = () => setIsHovering(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    let animationFrameId: number;
    const render = () => {
      const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.15);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div id="custom-cursor">
      <div ref={dotRef} className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#00FF9D] rounded-full -mt-0.75 -ml-0.75" />
      <div 
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-[#00FF9D] transition-all duration-300 ease-out -mt-6 -ml-6 pointer-events-none flex items-center justify-center ${
          isHovering ? 'w-16 h-16 -mt-8 -ml-8 opacity-100 bg-[#00FF9D]/10' : 'w-12 h-12 opacity-30'
        }`}
      >
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-[#00FF9D] transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-[#00FF9D] transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </div>
  );
};

export default CursorFollower;
