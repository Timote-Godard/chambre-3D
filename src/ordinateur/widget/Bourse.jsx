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
    <div className='w-[74px] h-[74px] rounded-[12%] bg-black flex flex-col  items-center' onMouseEnter={handleHover} onMouseLeave={handleMouseLeave}>
      <div className='flex flex-row w-full justify-between p-1'>
        <div>
        <h1 className='text-[10px] text-white'>
          AAPL
        </h1>
        <h1 className='text-[6px] text-gray-300'>
          Apple Inc.
        </h1>
        </div>
        <h1 className='text-[8px] text-green-500'>
          +1.89
        </h1>
      </div>
        
        <h1 className='mt-auto text-[20px] text-white'>
          309.54
        </h1>
    </div>
  );
};

export default Meteo;