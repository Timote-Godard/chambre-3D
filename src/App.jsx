import React, { useState, useEffect, Suspense, useRef  } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Model } from './Ma_chambre' 
import { ComputerScreen } from './ordinateur/ComputerScreen'
import { PhoneScreen } from './ordinateur/PhoneScreen'

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

function DynamicLighting({time}) {
  // new Date().getHours() + new Date().getMinutes() / 60

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const now = new Date();
  //     setTime(now.getHours() + now.getMinutes() / 60);
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, []);

  // --- MATHÉMATIQUES DU SOLEIL ---
  const isDay = time >= 6 && time < 20;
  const daylightRatio = isDay ? (time - 6) / 14 : 0;

  
  
  const sunY = isDay ? Math.sin(daylightRatio * Math.PI) * 15 : -5;
  const sunZ = isDay ? Math.cos(daylightRatio * Math.PI) * 5 : 10;
  // --- VARIABLES DE LUMIÈRE ---

  const PAPER = "#d9d5c1"; // Ton beige parchemin
  const INK = "#1a2639";   // Ton bleu encre
  let bgColor = isDay ? PAPER : "#0a0b10" ;
  let ambientIntensity = 0.2;
  let sunIntensity = 0;
  let sunColor = "#ffffff";
  
  // 💡 NOUVEAU : Notre ampoule de chambre !
  let roomLightIntensity = 0; 
  let roomLightColor = "#e0f7fa"; // Une lumière chaude (tungstène)

  if (time >= 6 && time < 9) {
    // Matin (Lavis froid et doux)
    bgColor = "#d2d6d9"; // Un gris-bleu très papier
    ambientIntensity = 0.5;
    sunIntensity = 1.2;
    sunColor = "#e2e8f0";
    roomLightIntensity = 0; 
  } else if (time >= 9 && time < 18) {
    // Journée (Beige papier lumineux)
    bgColor = "#e8e4d9"; 
    ambientIntensity = 0.7;
    sunIntensity = 2.5;
    sunColor = "#ffffff";
    roomLightIntensity = 0; 
  } else if (time >= 18 && time < 20) {
    // Soir (Sépia / Golden Hour)
    bgColor = "#cda788"; // Un beige cuivré doux au lieu du rouge vif
    ambientIntensity = 0.4;
    sunIntensity = 1.5;
    sunColor = "#ffcc80";
    roomLightIntensity = 2; // Le spot s'allume doucement
  } else {
    // Nuit (Encre abyssale)
    bgColor = "#0a0b10"; 
    ambientIntensity = 0.05; // Très faible pour des ombres noires
    sunIntensity = 0.2; // Juste un filet de lune depuis la fenêtre
    sunColor = "#7aa1d2"; 
    roomLightIntensity = 3; // L'écran devient la star
  }
  

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={ambientIntensity} color={sunColor} />
      
      {/* LE SOLEIL / LA LUNE */}
      <directionalLight 
        castShadow 
        position={[5, sunY, sunZ]} 
        intensity={sunIntensity} 
        color={PAPER}
        shadow-mapSize={[2048, 2048]} 
        shadow-bias={-0.0005} 
        shadow-normalBias={0.08}
      >
        <orthographicCamera attach="shadow-camera" args={[-15, 15, 15, -15, 0.1, 50]} />
      </directionalLight>

      {/* 💡 L'AMPOULE DE LA CHAMBRE */}
      <pointLight 
        position={[-8, 5, 1.2]} // 👈 J'ai avancé un peu le Z (1.2 au lieu de 0.84) pour le décoller de l'écran
        intensity={roomLightIntensity} 
        color={roomLightColor}
        distance={20} // L'écran n'éclaire pas très loin
        decay={3}
        castShadow
      />
    </>
  )
}


export default function App() {
  const controlsRef = useRef()
  const modeDesign = true;
  const [time, setTime] = useState(14);

  if (modeDesign) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#222' }}>
         <PhoneScreen onClose={() => console.log("Retour cliqué !")} />
      </div>
    )
  }

  return (
    // On met un background noir au div parent (le Canvas s'occupera de la couleur du ciel)
    <div style={{ width: '100vw', height: '100vh', background: '#000', touchAction: 'none' }}>
      
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 9999, // Pour passer au-dessus de la 3D
        background: 'magenta', // Couleur qui pique les yeux
        border: '5px dashed yellow',
        padding: '15px',
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'monospace'
      }}>
        <label>🛠️ HEURE : {time.toFixed(1)}h</label>
        <br />
        <input 
          type="range" 
          min="0" 
          max="23" 
          step="1" 
          value={time} 
          onChange={(e) => setTime(parseFloat(e.target.value))} 
          style={{ width: '200px', marginTop: '10px' }}
        />
      </div>

      <Canvas shadows camera={{ position: [10.62, 8.36, 7.99], fov: 50 }} dpr={[1, 1.5]}>
        
        {/* 👇 On remplace les anciennes lumières par notre composant magique ! 👇 */}
        <DynamicLighting time={time} />
        
        <CameraLogger controlsRef={controlsRef}/>
        {/* <OrbitControls ref={controlsRef} /> */}

        <Suspense fallback={null}>
          <Model position={[0, 0, 0]} scale={1}/>
        </Suspense>
        
      </Canvas>
    </div>
  )
}