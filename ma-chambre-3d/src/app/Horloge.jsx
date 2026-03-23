import ToggleSwitch from '../componentsApp/ToggleSwitch';
import React, { useState } from 'react';

export default function Horloge() {
    const [page, setPage] = useState("alarme");

    return (
        <div className="flex flex-col w-full h-full flex text-[14px] pt-8 bg-black text-white">
             {/* contenu */}
             <div className="px-2 w-full h-full"> 
                <h1 className="pb-6 text-slate-200">
                    Alarme
                </h1>

                <h1 className="px-2 pb-5 text-center w-full">
                    Alarme dans 3 jours 23 heures 17 minutes
                </h1>

                {/* liste des alarmes */}
                <div className="flex flex-row items-center justify-between bg-gray-300/20 rounded-lg w-full h-10 pl-2 pr-2">
                    <div className="flex flex-col justify-center h-full">
                        <h1 className="">
                            07:10
                        </h1>
                        <h2 className="text-[8px] ">
                            Une fois
                        </h2>
                    </div>
                    <ToggleSwitch />
                </div>
                
            </div>

            {/* nav */}
            <nav className='flex flex-row gap-2 justify-between'>
                <div onClick={()=>setPage("alarme")} className=''>
                    <img src="" alt="Alarme" />
                    <h1>
                        Alarme
                    </h1>
                </div>

                <div onClick={()=>setPage("chrono")}>
                    <img src="" alt="Chronomètre" />
                    <h1>
                        Chronomètre
                    </h1>
                </div>

                <div onClick={()=>setPage("minuteur")}>
                    <img src="" alt="Minuteur" />
                    <h1>
                        Minuteur
                    </h1>
                </div>
            </nav>
        </div>
    );
}
