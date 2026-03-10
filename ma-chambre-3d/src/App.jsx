import React, { useState, useEffect, Suspense, useRef  } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Model } from './Ma_chambre' 
import { ComputerScreen } from './ordinateur/ComputerScreen'

function CameraLogger({ controlsRef }) {
  const { camera } = useThree()
  
  window.printCam = () => {
    if (!controlsRef.current) return;
    const { x, y, z } = camera.position
    const { x: rx, y: ry, z: rz } = camera.rotation
    const target = controlsRef.current.target 
    console.log("--- CONFIG CAMÉRA ---")
    console.log(`Position: [${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}]`)
    console.log(`Rotation: [${rx.toFixed(2)}, ${ry.toFixed(2)}, ${rz.toFixed(2)}]`)
    if(target) console.log(`target: [${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`)
    console.log("---------------------")
  }
  return null
}

function DynamicLighting() {
  // new Date().getHours() + new Date().getMinutes() / 60
  const [time, setTime] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.getHours() + now.getMinutes() / 60);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- MATHÉMATIQUES DU SOLEIL ---
  const isDay = time >= 6 && time <= 20;
  const theta = isDay ? ((time - 6) / 14) * Math.PI : 0;
  
  const radius = 20;
  const sunX = isDay ? Math.cos(theta) * radius : 10;
  const sunY = isDay ? Math.sin(theta) * radius : 15;
  const sunZ = 10;

  // --- VARIABLES DE LUMIÈRE ---
  let bgColor = "#111111";
  let ambientIntensity = 0.2;
  let sunIntensity = 0;
  let sunColor = "#ffffff";
  
  // 💡 NOUVEAU : Notre ampoule de chambre !
  let roomLightIntensity = 0; 
  let roomLightColor = "#ffeeb1"; // Une lumière chaude (tungstène)

  if (time >= 6 && time < 9) {
    // Matin
    bgColor = "#ffb347"; 
    ambientIntensity = 0.4;
    sunIntensity = 1.5;
    sunColor = "#ffcc80";
    roomLightIntensity = 0; // Éteinte
  } else if (time >= 9 && time < 18) {
    // Journée
    bgColor = "#87CEEB"; 
    ambientIntensity = 0.7;
    sunIntensity = 2.5;
    sunColor = "#ffffff";
    roomLightIntensity = 0; // Éteinte
  } else if (time >= 18 && time < 20) {
    // Soir (Crépuscule)
    bgColor = "#fd5e53"; 
    ambientIntensity = 0.4;
    sunIntensity = 1.5;
    sunColor = "#ff9e80";
    roomLightIntensity = 1; // On commence à allumer la lumière !
  } else {
    // Nuit
    bgColor = "#0B0C10"; 
    ambientIntensity = 0.1;
    sunIntensity = 0.1; // La lune
    sunColor = "#7aa1d2"; 
    roomLightIntensity = 50; // Pleine puissance la nuit !
  }

  // 🛠️ ASTUCE DE TEST :
  // Décommente cette ligne et change l'heure (ex: 14, 19, 22) pour voir la lumière s'allumer !
  

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={ambientIntensity} color={sunColor} />
      
      {/* LE SOLEIL / LA LUNE */}
      <directionalLight 
        castShadow 
        position={[sunX, sunY, sunZ]} 
        intensity={sunIntensity} 
        color={sunColor}
        shadow-mapSize={[2048, 2048]} 
        shadow-bias={-0.0001} 
        shadow-normalBias={0.04} 
      >
        <orthographicCamera attach="shadow-camera" args={[-15, 15, 15, -15, 0.1, 50]} />
      </directionalLight>

      {/* 💡 L'AMPOULE DE LA CHAMBRE */}
      <pointLight 
        position={[-2, 7, 0]} // Placée en hauteur au centre de la pièce
        intensity={roomLightIntensity} 
        color={roomLightColor}
        distance={15} // La lumière s'arrête doucement après 15 mètres
        decay={2} // Atténuation réaliste de la lumière
      />
    </>
  )
}


export default function App() {
  const controlsRef = useRef()
  const modeDesign = false;

  if (modeDesign) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#222' }}>
         <ComputerScreen onClose={() => console.log("Retour cliqué !")} />
      </div>
    )
  }

  return (
    // On met un background noir au div parent (le Canvas s'occupera de la couleur du ciel)
    <div style={{ width: '100vw', height: '100vh', background: '#000', touchAction: 'none' }}>
      
      <Canvas shadows camera={{ position: [10.62, 8.36, 7.99], fov: 50 }} dpr={[1, 1.5]}>
        
        {/* 👇 On remplace les anciennes lumières par notre composant magique ! 👇 */}
        <DynamicLighting />
        
        <CameraLogger controlsRef={controlsRef}/>
        <OrbitControls ref={controlsRef} />

        <Suspense fallback={null}>
          <Model position={[0, 0, 0]} scale={1}/>
        </Suspense>
        
      </Canvas>
    </div>
  )
}