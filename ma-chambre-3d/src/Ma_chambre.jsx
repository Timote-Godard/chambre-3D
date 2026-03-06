import React, { useState } from 'react'
import { useGLTF, useTexture, Edges } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

export function Model({ props}) {
  const { nodes } = useGLTF('/test1.glb');
  const [stat, setStat] = useState("global");
  const [ hovered, setHover] = useState(false);
  const [lookTarget] = useState(() => new THREE.Vector3(-0.63, 4.13, -1.49));

  // 1. Chargement des textures de hachures
  const textures = useTexture([
    '/textures/hatch_0.png',
    '/textures/hatch_1.png',
    '/textures/hatch_2.png',
    '/textures/hatch_3.png',
    '/textures/hatch_4.png',
  ])

  textures.forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; // Le raccord est maintenant parfait !
    tex.anisotropy = 16;
    tex.needsUpdate = true;
  })

  useFrame((state) => {
    if (stat === 'computer') {
      const ecranPos = new THREE.Vector3().copy(nodes.Ecran.position);
      const offset = new THREE.Vector3(3, 0, 0);
      const offsetHeight = new THREE.Vector3(0, 0.5, 0);

      const cameraTargetPosition = new THREE.Vector3().copy(ecranPos).add(offset).add(offsetHeight);
      const cameraLookAt = new THREE.Vector3().copy(ecranPos).add(offsetHeight);

      const vitesse = 0.030;

      state.camera.position.lerp(cameraTargetPosition, vitesse); // Le corps se déplace
      lookTarget.lerp(cameraLookAt, vitesse);

      state.camera.lookAt(lookTarget);
      state.camera.updateProjectionMatrix();
    }
  });

  return (
    <group {...props} dispose={null}>
      
      {/* 🧱 LE DÉCOR (Murs, Table, Sol) */}
      <mesh geometry={nodes.Decor_Fixe.geometry}
        // 👇 On redonne à l'objet sa place exacte dans le monde !
        position={nodes.Decor_Fixe.position}
        rotation={nodes.Decor_Fixe.rotation}
        scale={nodes.Decor_Fixe.scale}>
        <hatchMaterial 
          uHatch0={textures[0]}
          uHatch1={textures[1]}
          uHatch2={textures[2]}
          uHatch3={textures[3]}
          uHatch4={textures[4]}
          uLightPosition={[0, 3, 0]} // Centre de ta pièce (X, Y, Z). Modifie ces chiffres pour bouger l'ampoule !
          uRepeat={6.0} 
        />
        <Edges 
          threshold={30} // 👈 Augmente ce chiffre (essaie 15, 20 ou même 30)
          color="black" 
        />
      </mesh>

      {/* 🖥️ L'ÉCRAN (Interactif) */}
      <mesh 
        geometry={nodes.Ecran.geometry}
        // 👇 On redonne à l'objet sa place exacte dans le monde !
        position={nodes.Ecran.position}
        rotation={nodes.Ecran.rotation}
        scale={nodes.Ecran.scale}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={() => setStat('computer')}
      >
        {/* On change la couleur si on survole l'écran */}
        <meshStandardMaterial 
          color={stat === 'computer' ? ("black") : (hovered ? "#ffeb3b" : "black")} 
          polygonOffset 
          polygonOffsetFactor={1} 
        />

        {stat === 'computer' && (
        <Html
        transform
        distanceFactor={1.5}
        position={[0, 0.803, 0]}
        rotation={[0, Math.PI / 2, 0]}
        // On force l'échelle à être neutre (1/scale.x, 1/scale.y, 1/scale.z)
        scale={[1 / nodes.Ecran.scale.x, 1 / nodes.Ecran.scale.y, 1 / nodes.Ecran.scale.z]}
      >
        <div className="screen-interface">
          <h1>Bonjour vous êtes bien sur windows</h1>
        </div>
      </Html>
)}

        <Edges 
          color="black" 
          renderOrder={1000} 
          material-depthTest={false} 
        />
      </mesh>

    </group>
  )
}