import React, { useRef, useEffect } from 'react';
import { Player } from '@lordicon/react';
import meteoIcon from "../../assets/IconApp/meteo.json";

const Meteo = ({ size = 74 }) => {
  const playerRef = useRef(null);
  

  // Déclenche l'animation au survol
  const handleHover = () => {
    playerRef.current?.playFromBeginning();
  };

  const handleMouseLeave = () => {
    playerRef.current?.goToFrame(0);
    };

  return (
    <div className='w-[74px] h-[74px] rounded-[12%] bg-blue-500 flex justify-center items-center' onMouseEnter={handleHover} onMouseLeave={handleMouseLeave}>
        <div  style={{ width: size, height: size }}>
        <Player
            ref={playerRef}
            icon={meteoIcon}
            size={size}
        />
        </div>
    </div>
  );
};

export default Meteo;