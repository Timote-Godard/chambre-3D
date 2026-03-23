import React, { useState } from 'react';
import { Wifi, BatteryMedium, Signal, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedIcon from './AnimatedIcon';
import Meteo from './widget/Meteo';
import Bourse from './widget/Bourse';
import Calendrier from './widget/Calendrier';
import fondEcran from '../assets/phoneWallpaper.png';

import cameraIcon from "../assets/IconApp/camera.json";
import clockIcon from "../assets/IconApp/clock2.json";
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

// Importations des composants apps
import Camera from '../app/Camera';
import Horloge from '../app/Horloge/Hub';
import Maps from '../app/Maps';
import Galerie from '../app/Galerie';
import Document from '../app/Document';
import Music from '../app/Music';
import Cadeau from '../app/Cadeau';
import Parametres from '../app/Parametres';
import Internet from '../app/Internet';
import Note from '../app/Note';
import Coeur from '../app/Coeur';
import Contact from '../app/Contact';
import Banque from '../app/Banque';
import Discord from '../app/Discord';
import Twitch from '../app/Twitch';
import Dossier from '../app/Dossier';

const appComponents = {
    "Camera": Camera,
    "Horloge": Horloge,
    "Maps": Maps,
    "Galerie": Galerie,
    "Document": Document,
    "Music": Music,
    "Cadeau": Cadeau,
    "Paramètres": Parametres,
    "Internet": Internet,
    "Note": Note,
    "Coeur": Coeur,
    "Contact": Contact,
    "Banque": Banque,
    "Discord": Discord,
    "Twitch": Twitch,
    "Dossier": Dossier
};

export function PhoneScreen({ onClose }) {
    const [selectedApp, setSelectedApp] = useState(null);

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

    const SelectedAppComponent = selectedApp ? appComponents[selectedApp] : null;

    return (
        <div 
            className="bg-gray-700 shadow-inner relative"
            style={{
                width: '180px',
                height: '380px',
                clipPath: 'inset(0% round 35px)',
                overflow: 'hidden', 
            }}
        >
            <div className="w-full h-full bg-black relative flex flex-col">
                {/* Barre d'état (toujours au-dessus) */}
                
                <div 
                        className=" absolute left-1/2 -translate-x-1/2 translate-y-1/16  w-16 h-5 bg-black rounded-full z-[100]"
                    ></div>

                <div 
    className="flex-1 relative overflow-hidden bg-cover bg-center"
    style={{ 
        // 👇 On utilise la variable importée !
        backgroundImage: `url(${fondEcran})` 
    }}
>
                    
                    <div className="relative pt-1 px-1 flex flex-row justify-between items-center w-full z-[10] pointer-events-none"> 
                    <h1 className="text-[10px] pl-3 text-white">{hour}:{minute < 10 ? "0" + minute : minute}</h1>
                    
                    <div className="flex flex-row pr-1 items-center gap-[1px] text-white">
                        <Signal size={12} />
                        <Wifi size={12} />
                        <BatteryMedium size={14} />
                    </div>
                </div>

                    <AnimatePresence>
                        {!selectedApp && (
                            <motion.div 
                                key="home-screen"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full h-full p-1 pt-4 flex flex-col"
                            >
                                <div className="grid gap-y-2 grid-cols-2">
                                    {listApp.map((app, index) => (
                                        app.widget === true ? (
                                            <div key={index} className="ml-auto mr-auto flex flex-col gap-y-[2px] items-center">
                                                {app.type === "weather" && <Meteo />}
                                                {app.type === "money" && <Bourse />}
                                                {app.type === "calendar" && <Calendrier />} 
                                                <h1 className="text-[8px]  text-white">{app.name}</h1>
                                            </div>
                                        ) : (
                                            <div key={index} className='grid grid-cols-2 gap-y-[2px]'> 
                                                {app.content.map((uniqueApp, appIndex) => (
                                                    <div 
                                                        key={appIndex} 
                                                        className="flex flex-col items-center cursor-pointer"
                                                        onClick={() => setSelectedApp(uniqueApp.name)}
                                                    >
                                                        <motion.div 
                                                            layoutId={`app-container-${uniqueApp.name}`}
                                                            style={{ borderRadius: 8 }}
                                                            className={`${uniqueApp.color} w-[30px] h-[30px] flex items-center justify-center shadow-sm overflow-hidden`}
                                                        >
                                                            <AnimatedIcon icon={uniqueApp.json} size={uniqueApp.name === "Horloge" ? 33 : 25} />
                                                        </motion.div>
                                                        <h1 className="text-[7px] mt-[1px]  text-white">{uniqueApp.name}</h1>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    ))}
                                </div>

                                <div className="absolute bottom-1 left-1 right-1 bg-gray-300/50 py-[8px] rounded-xl grid grid-cols-4">
                                    {listShortcut.map((app, index) => (
                                        <div 
                                            key={index} 
                                            className="flex flex-col items-center cursor-pointer"
                                            onClick={() => setSelectedApp(app.name)}
                                        >
                                            <motion.div 
                                                layoutId={`app-container-${app.name}`}
                                                style={{ borderRadius: 8 }}
                                                className={`${app.color} w-[30px] h-[30px] flex items-center justify-center shadow-sm overflow-hidden`}
                                            >
                                                <AnimatedIcon icon={app.json} size={25} />
                                            </motion.div>  
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {selectedApp && (
                            <motion.div 
                                key="app-screen"
                                layoutId={`app-container-${selectedApp}`}
                                className="absolute inset-0 z-50 bg-white overflow-hidden flex flex-col"
                                style={{ borderRadius: 0 }}
                            >
                                <motion.div 
                                    className="flex-1 relative"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <button 
                                        onClick={() => setSelectedApp(null)}
                                        className="absolute top-2 left-2 flex cursor-pointer items-center text-blue-500 text-[10px] z-[60]"
                                    >
                                        <ChevronLeft size={10} /> Retour
                                    </button>
                                    <SelectedAppComponent />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>    
    );
}
