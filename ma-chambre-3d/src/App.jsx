import React, { Suspense, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { Model } from './Ma_chambre' // Vérifie le chemin du fichier
// On importera ton shader et ton modèle ici plus tard

import { ComputerScreen } from './ordinateur/ComputerScreen'


import * as THREE from 'three'
import { Edges, shaderMaterial, useTexture } from '@react-three/drei'
import { extend } from '@react-three/fiber'

function CameraLogger({ controlsRef }) {
  const { camera } = useThree()
  
  // Dans ton composant CameraLogger
window.printCam = () => {
  const { x, y, z } = camera.position
    const { x: rx, y: ry, z: rz } = camera.rotation
  // On récupère la cible actuelle d'OrbitControls
  const target = controlsRef.current.target 
  console.log("--- CONFIG CAMÉRA ---")
    console.log(`Position: [${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}]`)
    console.log(`Rotation: [${rx.toFixed(2)}, ${ry.toFixed(2)}, ${rz.toFixed(2)}]`)
    console.log(`target: [${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`)
    console.log("---------------------")
}

  return null
}

const HatchMaterial = shaderMaterial(
  
  {
    uHatch0: null, uHatch1: null, uHatch2: null, uHatch3: null, uHatch4: null,
    uLightPosition: new THREE.Vector3(0, 3, 0), // 💡 Une ampoule au milieu de la pièce !
    uRepeat: 2.0,
  },
  // --- Vertex Shader (On calcule la vraie position dans l'espace) ---
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vLocalNormal;
  varying vec3 vWorldPosition; // Nouveau !

  void main() {
    vUv = uv;
    vLocalNormal = normal;
    vNormal = normalize(normalMatrix * normal);
    
    // On repère où se trouve ce bout de mur dans le monde réel
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
  `,
  // --- Fragment Shader (Le look final avec le dégradé) ---
  `
  uniform sampler2D uHatch0, uHatch1, uHatch2, uHatch3, uHatch4;
  uniform vec3 uLightPosition;
  uniform float uRepeat;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vLocalNormal;
  varying vec3 vWorldPosition; // Nouveau !

  vec2 rotate(vec2 uv, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c) * (uv - 0.5) + 0.5;
  }

  void main() {
    // 1. GESTION DE LA LUMIÈRE "AMPOULE" 💡
    vec3 lightVector = uLightPosition - vWorldPosition;
    float distance = length(lightVector);
    vec3 lightDir = normalize(lightVector);
    
    // Angle de la lumière
    float v = dot(vNormal, lightDir);
    
    // Atténuation : plus le coin de la pièce est loin, plus il fait sombre (8.0 est le rayon)
    float attenuation = smoothstep(15.0, 0.0, distance); 
    
    // On mixe, et on garde un peu de lumière ambiante (+ 0.1) pour pas que ça soit noir
    v = max(0.0, v) * attenuation + 0.1;
    v = clamp(v, 0.0, 1.0);

    // 2. ROTATION DES HACHURES (Version ultra-stable 🛡️)
    vec3 roundedNormal = floor(vLocalNormal + 0.5); // On arrondit proprement à 0 ou 1
    float angle = fract(sin(dot(roundedNormal, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    angle *= 3.14159 * 2.0;
    

    vec2 rotatedUv = rotate(vUv * uRepeat, angle);
    
    // 3. RÉCUPÉRATION DES TEXTURES
    float h0 = texture2D(uHatch0, rotatedUv).r;
    float h1 = texture2D(uHatch1, rotatedUv).r;
    float h2 = texture2D(uHatch2, rotatedUv).r;
    float h3 = texture2D(uHatch3, rotatedUv).r;
    float h4 = texture2D(uHatch4, rotatedUv).r;

    // 4. MIXAGE FIN (Plus doux)
    float finalHatch = 1.0;
    finalHatch = mix(h0, 1.0, smoothstep(0.7, 0.9, v));
    finalHatch = min(finalHatch, mix(h1, 1.0, smoothstep(0.5, 0.7, v)));
    finalHatch = min(finalHatch, mix(h2, 1.0, smoothstep(0.3, 0.5, v)));
    finalHatch = min(finalHatch, mix(h4, 1.0, smoothstep(0.0, 0.3, v)));

    gl_FragColor = vec4(vec3(finalHatch), 1.0);
  }
  `
)

extend({ HatchMaterial })


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
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>

      <Canvas camera={{ position: [10.62, 8.36, 7.99], fov: 50, rotation: [-0.42, 0.83, 0.32], target: [-0.63, 4.13, -1.49] }} dpr={[1, 1.5]}>
        

    <ambientLight intensity={1} />
    <directionalLight position={[10, 10, 10]} intensity={10} /> 
    <CameraLogger controlsRef={controlsRef}/>

    <Suspense fallback={null}>

      <Model position={[0, 0, 0]} scale={1}/>
    </Suspense>

    
  </Canvas>
    </div>
  )
}