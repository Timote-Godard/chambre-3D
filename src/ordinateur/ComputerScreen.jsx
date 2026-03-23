import { useState, useEffect } from "react"
import { MOUSE } from "three";
import { div } from "three/src/nodes/math/OperatorNode.js";

const TaskBar = ({appOppened, openWindow}) => {
    return (
        <div className="flex flex-row gap-4  h-12 w-full bg-white items-center justify-center"> 
            {appOppened.map((app) => (
                <button onClick={() => openWindow()} className="h-10 w-10 p-1 hover:bg-gray-200 cursor-pointer">
                    <img src={app.content.src} alt={app.content.name} />

                </button>
            ))}
        </div>
    )

}

const AppWindow = ({closeWindow, app, index, premierPlan}) => {

    const [offset, setOffset] = useState({x : 0, y:0});
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState([340,201]);

    const deplacement = (e) => {

        setPosition([
            e.clientX - offset.x,
            e.clientY - offset.y
        ]);
        
    };

    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isDragging) {
                deplacement(e);
            }
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleGlobalMouseMove);
            window.addEventListener("mouseup", handleGlobalMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleGlobalMouseMove);
            window.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, [isDragging, offset]);

    return (

        <div onMouseDown={() => premierPlan(index)} style={{ left: `${position[0]}px`, top: `${position[1]}px` }} className="border-4 border-gray-800 absolute h-100 w-200"> 
            <div onMouseDown={(e) => {setIsDragging(true); setOffset({x:e.clientX - position[0], y:e.clientY - position[1]})}} className="active:cursor-grabbing flex bg-white h-5"> 
                <h1 className="text-black">{app.content.name}</h1>
                <button onClick={(e) => {e.stopPropagation(); closeWindow(index);}} className="cursor-pointer ml-auto bg-red-300 h-5 w-5">
                    
                </button>
            </div>
            <div className="w-full h-full bg-gray-400">

            </div>
        </div>
    );
};


// ComputerScreen.jsx
export function ComputerScreen({ onClose }) {
    const apps = [
        { id: 1, content: { name: "Chrome", src: "logo/chrome.png" } },
        { id: 2, content: { name: "Notes", src: "logo/note.png" } },
        { id: 3, content: { name: "Settings", src: "logo/settings.png" } },
        { id: 4, content: { name: "Retour", src: "logo/settings.png" } }
    ];

    const initialApps = Array.from({ length: 128 }, (_, i) => ({
        id: i,
        content: apps[i] ? apps[i].content : null
    }));

    const [tabApp, setTabApp] = useState(initialApps);
    const [appOppened, setAppOppened] = useState([]);

    const handleDragStart = (index,e) => {
        e.dataTransfer.setData("monIndex", index);
        
    };  

    const premierPlan = (index) => {
        if (index === appOppened.length - 1) return;

        const prev = [...appOppened];

        const elem = prev.splice(index, 1)[0];
       
        setAppOppened([...prev, elem]);

    };

    const handleDrop = (index,e) => {
        const indexDepart = e.dataTransfer.getData("monIndex");
        const newTab = [...tabApp];
        const temp = newTab[indexDepart].content;
        newTab[indexDepart].content = newTab[index].content;
        newTab[index].content = temp;

        setTabApp(newTab);
    };

    const openWindow = (app) => {
        if (app.content.name === "Retour") {
            onClose();
            return;
        }

        const indexExiste = appOppened.findIndex((ouverte) => ouverte.id === app.id);

        if (indexExiste !== -1) {
            premierPlan(indexExiste);
            return; 
        }

        setAppOppened([...appOppened,app]);
    };

    const closeWindow = (indexToRemove) => {
        setAppOppened((prev) => prev.filter((_, index) => index !== indexToRemove));
    };
    


  return (
    <div className="screen-interface    ">
      <div className="grid grid-cols-16 grid-rows-8 w-full h-full p-2" >
            {tabApp.map((app,i) => (
                <div draggable={app.content ? "true" : "    false"} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => handleDragStart(i,e)} onDrop={(e) => handleDrop(i,e)} key={i}>
                    {app.content ? 
                    <div>
                        <button onClick={() => openWindow(app)} className="flex flex-col justify-center items-center h-full w-full cursor-pointer">
                            <img className="h-16 w-16" src={app.content.src} draggable={false} /> 
                            <h1>{app.content.name}</h1>
                        </button>
                    </div>
                    :
                    ""
                    }
                </div>
            ))}

      </div>
        {appOppened.length > 0 && (
            appOppened.map((app,i) => (
                <AppWindow premierPlan={premierPlan} key={app.id} index={i} app={app} closeWindow={closeWindow}/>
            ))
        )}

        <TaskBar appOppened={appOppened} />

    </div>
  )
}