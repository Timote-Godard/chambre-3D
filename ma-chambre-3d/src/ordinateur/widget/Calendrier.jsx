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
    <div className='w-[74px] h-[74px] rounded-[12%] bg-white flex justify-center items-center' onMouseEnter={handleHover} onMouseLeave={handleMouseLeave}>
      <div className='p-2 '>
        <h1 className='text-[6px] font-bold text-red-500'>
          MARDI
        </h1>
        <h1 className='text-[14px]'>
          1
        </h1>
        <h2 className='text-[7px] mt-2 text-gray-500'>
          Autre autre évênement
        </h2>
      </div>
    </div>
  );
};

export default Meteo;