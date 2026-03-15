import { Wifi, BatteryMedium, Signal } from 'lucide-react';
import AnimatedIcon from './AnimatedIcon';
import cameraIcon from "../assets/IconApp/camera.json";
import clockIcon from "../assets/IconApp/clock.json";
import mapsIcon from "../assets/IconApp/maps.json";
import photoIcon from "../assets/IconApp/photo.json";
import documentIcon from "../assets/IconApp/document.json";

export function PhoneScreen({ onClose }) {

    const listApp = [
        {widget : false, content : 
        [{name : "Chrome", json: cameraIcon, color:"bg-blue-500"},
        {name : "Chrome", json: clockIcon, color:"bg-blue-500"},
        {name : "Chrome", json: mapsIcon, color:"bg-blue-500"},
        {name : "Chrome", json: photoIcon, color:"bg-blue-500"}]},

        {widget : true, name:"Nombre de Pas", src :"logo/chrome.png"},

        {widget : true, name:"Nombre de Pas", src :"logo/chrome.png"},

        {widget : false, content : 
        [{name : "Chrome", json: documentIcon, color:"bg-blue-500"},
        {name : "Chrome", json: cameraIcon, color:"bg-blue-500"},
        {name : "Chrome", json: cameraIcon, color:"bg-blue-500"},
        {name : "Chrome", json: cameraIcon, color:"bg-blue-500"}]},

        {widget : false, content : 
        [{name : "Chrome", json: cameraIcon, color:"bg-blue-500"},
        {name : "Chrome", json: cameraIcon, color:"bg-blue-500"},
        {name : "Chrome", json: cameraIcon, color:"bg-blue-500"},
        {name : "Chrome", json: cameraIcon, color:"bg-blue-500"}]},

        {widget : true, name:"Nombre de Pas", src :"logo/chrome.png"},
    ]

    const listShortcut = [{name:"Photo", json: cameraIcon, color:"bg-blue-500"},
                        {name:"Photo", json: cameraIcon, color:"bg-blue-500"},
                        {name:"Photo", json: cameraIcon, color:"bg-blue-500"},
                        {name:"Photo", json: cameraIcon, color:"bg-blue-500"}
    ]


    return (
        <div 
            className="bg-gray-700 pointer-events-auto shadow-inner"
            style={{
            // 2. DIMENSIONS FIXES (Ajuste pour que ça remplisse la largeur/hauteur de l'écran 3D)
            width: '180px',
            height: '380px',
            
            // 3. LA MAGIE DES ARRONDIS (Ajuste cette valeur pour coller aux courbes de ton 3D)
            clipPath: 'inset(0% round 20px)',
            
            // 4. LE SECRET ABSOLU : Empêche le contenu (images, textes, scroll) 
            // de dépasser des coins arrondis !
            overflow: 'hidden', 
        
            }}
        >
    {/* CONTENU DE TON ÉCRAN (ex: Iframe, Composants React, Menu...) */}
    <div className="w-full h-full overflow-y-auto bg-black">
      
      {/* Une fausse encoche/Dynamic Island si tu veux pousser le réalisme ! */}
      
      
      {/* contenu principal */}
      <div className="flex flex-col p-1 bg-white h-full"> 

        {/* heure, etc */}
            <div className="relative mb-5 flex flex-row justify-between items-center w-full"> 
    
                {/* 1. HEURE (À gauche) */}
                <h1 className="text-[10px] pl-3">12:12</h1>

                {/* 2. DYNAMIC ISLAND (Centrée de force) */}
                <div className="absolute left-1/2 -translate-x-1/2  w-16 h-5 bg-black rounded-full"></div>

                {/* 3. ICONES (À droite) */}
                <div className="flex flex-row pr-1 items-center gap-[1px]">
                    <Signal size={12} />
                    <Wifi size={12} />
                    <BatteryMedium size={14} />
                </div>

            </div>
 
        {/* app, icones */}
        <div className="grid gap-y-2 grid-cols-2 ">
            {listApp.map((app,index) => (
                app.widget===true ? (
                    <div className="flex flex-col gap-y-[1px]  items-center">
                    <img className="h-18 w-18 " src={app.src} draggable={false} /> 
                    <h1 className="text-[8px]">{app.name}</h1>
                    </div>
                )
                :
                (
                    <div className='grid grid-cols-2 gap-y-[1px] '> 
                        {app.content.map((uniqueApp, appIndex) => (

                            <div className="flex flex-col items-center">
                                <div className={`${uniqueApp.color} w-[30px] h-[30px] rounded-[22%] flex items-center justify-center shadow-sm`}>
                                    <AnimatedIcon icon={uniqueApp.json} size={25} />
                                </div>
                                <h1 className="text-[8px]">{uniqueApp.name}</h1>
                            </div>
                        
                        ))}
                        
                    
                    </div>
                )
            )) }
        </div>

        {/* raccourci en bas */}
        <div className="mt-auto bg-gray-300 py-[8px] rounded-xl grid grid-cols-4 ">
            {listShortcut.map((app,index) => (
                <div className="flex flex-col items-center">
                                <div className={`${app.color} w-[30px] h-[30px] rounded-[22%] flex items-center justify-center shadow-sm`}>
                                    <AnimatedIcon icon={app.json} size={25} />
                                </div>  
                            </div>
            )) }
        </div>
      </div>

    </div>
  </div>    
    )
}
