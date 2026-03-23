import {Play, Pause} from "lucide-react";
import React, { useEffect, useState, useRef } from 'react';

export default function Chronometre({timeChrono, activeChrono, setIsActive, isActive}) {

        
    const secondsElapsed = (timeChrono / 1000).toFixed(2);

    return (
        <div className="px-2 w-full h-full"> 
            <h1 className="pb-6 text-slate-200">
                Chronomètre
            </h1>
            <div className="pt-12 flex flex-col items-center">
                <h1 className="pb-6 text-3xl text-slate-200">
                    {secondsElapsed}
                </h1>
                <button onClick={() => {setIsActive(!isActive); activeChrono()}} className="bg-gray-300/30 flex justify-center items-center rounded-xl text-white mt-25 cursor-pointer h-8 w-15">
                    {isActive ? <Pause size={18}/> : <Play size={18}/>}
                </button>
            </div>
        </div>
    );
}
