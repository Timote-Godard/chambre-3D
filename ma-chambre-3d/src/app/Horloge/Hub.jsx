import Alarme from './Alarme'
import Minuteur from './Minuteur'
import Chronometre from './Chronometre'
import React, { useState, useEffect , useRef} from 'react';
import { AlarmClock, Timer, Hourglass } from "lucide-react";

export default function Horloge() {
    const [page, setPage] = useState("alarme");
    const [timeChrono, setTimeChrono] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const start = useRef(0);
    const intervalRef = useRef(null);

    function handleToggle() {
        if (!isActive) {
            setIsActive(true);
            start.current = Date.now() - timeChrono; 
            
            intervalRef.current = setInterval(() => {
                setTimeChrono(Date.now() - start.current);
            }, 10); 
        } else {
            setIsActive(false);
            clearInterval(intervalRef.current);
        }
    }

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div className="flex flex-col w-full h-full flex text-[14px] pt-8 bg-black text-white">
             {/* contenu */}
             {page === "alarme" && (
                <Alarme />
             )}

             {page === "chrono" && (
                <Chronometre timeChrono={timeChrono} activeChrono={handleToggle} setIsActive={setIsActive} isActive={isActive}/>
             )}

             {page === "minuteur" && (
                <Minuteur />
             )}
             

            {/* nav */}
            <nav className='flex flex-row gap-2 justify-between px-4 py-2 border-t-1 border-white/20'>
                <div onClick={()=>setPage("alarme")} className="flex flex-col items-center cursor-pointer">
                    <AlarmClock size={17}/>
                    <h1 className='text-[8px]'>
                        Alarme
                    </h1>
                </div>

                <div onClick={()=>setPage("chrono")} className="flex flex-col items-center cursor-pointer">
                    <Timer size={17}/>
                    <h1 className='text-[8px]'>
                        Chronomètre
                    </h1>
                </div>

                <div onClick={()=>setPage("minuteur")} className="flex flex-col items-center cursor-pointer">
                    <Hourglass size={17}/>
                    <h1 className='text-[8px]'>
                        Minuteur
                    </h1>
                </div>
            </nav>

        </div>
    );
}
