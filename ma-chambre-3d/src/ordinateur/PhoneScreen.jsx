import { Wifi, BatteryMedium, Signal } from 'lucide-react';
import AnimatedIcon from './AnimatedIcon';
import Meteo from './widget/Meteo';
import Bourse from './widget/Bourse';
import Calendrier from './widget/Calendrier';

import cameraIcon from "../assets/IconApp/camera.json";
import clockIcon from "../assets/IconApp/clock.json";
import mapsIcon from "../assets/IconApp/maps.json";
import photoIcon from "../assets/IconApp/photo.json";
import documentIcon from "../assets/IconApp/document.json";
import musicIcon from "../assets/IconApp/music.json";
import giftIcon from "../assets/IconApp/gift.json";
import settingsIcon from "../assets/IconApp/settings.json";
import internetIcon from "../assets/IconApp/internet.json";
import noteIcon from "../assets/IconApp/note.json";

import heartIcon from "../assets/IconApp/heart.json";
import contactIcon from "../assets/IconApp/contact.json";
import bankIcon from "../assets/IconApp/bank.json";
import discordIcon from "../assets/IconApp/discord.json";
import twitchIcon from "../assets/IconApp/twitch.json";
import folderIcon from "../assets/IconApp/folder.json";

export function PhoneScreen({ onClose }) {

    const hour = new Date().getHours();
    const minute = new Date().getMinutes();

    const listApp = [
        {widget : false, content : 
        [{name : "Camera", json: cameraIcon, color:"bg-gray-400"},
        {name : "Horloge", json: clockIcon, color:"bg-black"},
        {name : "Maps", json: mapsIcon, color:"bg-slate-200"},
        {name : "Galerie", json: photoIcon, color:"bg-blue-300"}]},

        {widget : true, type:"weather", name:"Nombre de Pas"},

        {widget : true, type:"calendar", name:"Nombre de Pas"},

        {widget : false, content : 
        [{name : "Document", json: documentIcon, color:"bg-orange-300"},
        {name : "Music", json: musicIcon, color:"bg-slate-100"},
        {name : "Cadeau", json: giftIcon, color:"bg-pink-600"},
        {name : "Paramètres", json: settingsIcon, color:"bg-gray-400"}]},

        {widget : false, content : 
        [{name : "Internet", json: internetIcon, color:"bg-blue-700"},
        {name : "Note", json: noteIcon, color:"bg-yellow-300"},
        {name : "Coeur", json: heartIcon, color:"bg-red-200"},
        {name : "Contact", json: contactIcon, color:"bg-gray-300"}]},

        {widget : true, type:"money", name:"Bourse"}
    ]

    const listShortcut = [{name:"Banque", json: bankIcon, color:"bg-yellow-500"},
                        {name:"Discord", json: discordIcon, color:"bg-purple-400"},
                        {name:"Twitch", json: twitchIcon, color:"bg-purple-500"},
                        {name:"Dossier", json: folderIcon, color:"bg-orange-500"}
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
      <div className="flex flex-col p-1 bg-gray-100 h-full"> 

        {/* heure, etc */}
            <div className="relative mb-5 flex flex-row justify-between items-center w-full"> 
    
                {/* 1. HEURE (À gauche) */}
                <h1 className="text-[10px] pl-3">{hour}:{minute < 10 ? "0" + minute : minute}</h1>

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
        <div className="grid gap-y-2 grid-cols-2">
            {listApp.map((app,index) => (
                app.widget===true ? (
                    <div className="ml-auto mr-auto  flex flex-col gap-y-[1px]  items-center">
                        {app.type === "weather" && <Meteo />}
                        {app.type === "money" && <Bourse />}
                        {app.type === "calendar" && <Calendrier />} 
                        
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
