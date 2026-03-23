import React, { useRef, useEffect } from 'react';
import { Player } from '@lordicon/react';

const AnimatedIcon = ({ icon, size = 32 }) => {
  const playerRef = useRef(null);

  // Déclenche l'animation au survol
  const handleHover = () => {
    playerRef.current?.playFromBeginning();
  };

  const handleMouseLeave = () => {
    playerRef.current?.goToFrame(0);
    };

  return (
    <div onMouseEnter={handleHover} onMouseLeave={handleMouseLeave} style={{ width: size, height: size }}>
      <Player
        ref={playerRef}
        icon={icon}
        size={size}
      />
    </div>
  );
};

export default AnimatedIcon;