import React, { useState } from 'react'
import { useGLTF, useTexture, Edges, PresentationControls, Float, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

import { ComputerScreen } from './ordinateur/ComputerScreen'



export function Model({ props}) {
  const { nodes } = useGLTF('/test1.glb');
  const [stat, setStat] = useState("global");
  const [ hovered, setHover] = useState("none");
  const [lookTarget] = useState(() => new THREE.Vector3(-0.63, 4.13, -1.49));
  const [hoveredGame, setHoveredGame] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const myGames = [
    { id: 1, name: "Projet Alpha", url: "https://alpha.monsite.fr", color: "red" },
    { id: 2, name: "Projet Beta", url: "https://beta.monsite.fr", color: "blue" },
    { id: 3, name: "Projet Gamma", url: "https://gamma.monsite.fr", color: "green" },
  ];

  const boxGeometry = nodes.Jackette.geometry;
  const boxMaterial = nodes.Jackette.material;

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
    const vitesse = 0.030;

    if (stat === 'computer') {
      const ecranPos = new THREE.Vector3().copy(nodes.Ecran.position);
      const offset = new THREE.Vector3(3, 0, 0);
      const offsetHeight = new THREE.Vector3(0, 0.5, 0);

      const cameraTargetPosition = new THREE.Vector3().copy(ecranPos).add(offset).add(offsetHeight);
      const cameraLookAt = new THREE.Vector3().copy(ecranPos).add(offsetHeight);

      // 1. La caméra glisse vers l'écran
      state.camera.position.lerp(cameraTargetPosition, vitesse);
      // 2. Le point cible glisse vers l'écran
      lookTarget.lerp(cameraLookAt, vitesse);
      // 3. La caméra regarde le point cible
      state.camera.lookAt(lookTarget);
      
      state.camera.updateProjectionMatrix();
    }
    
    if (stat === 'global') {
      const initialPosition = new THREE.Vector3(10.62, 8.36, 7.99);
      const initialLookAt = new THREE.Vector3(-0.63, 4.13, -1.49);

      // 1. La caméra glisse vers sa position de départ
      state.camera.position.lerp(initialPosition, vitesse);
      // 2. Le point cible glisse vers sa position de départ
      lookTarget.lerp(initialLookAt, vitesse);
      
      // 3. LA CORRECTION EST LÀ : on regarde lookTarget, pas initialLookAt !
      state.camera.lookAt(lookTarget);
      
      state.camera.updateProjectionMatrix();
    }

    if (stat === 'library') {
      const finalPosition = new THREE.Vector3(-3.28, 8.46, -0.77);
      const finalLookAt = new THREE.Vector3(-4.07, 8.43, -0.81);

      // 1. La caméra glisse vers sa position de départ
      state.camera.position.lerp(finalPosition, vitesse);
      // 2. Le point cible glisse vers sa position de départ
      lookTarget.lerp(finalLookAt, vitesse);
      
      // 3. LA CORRECTION EST LÀ : on regarde lookTarget, pas initialLookAt !
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
        onPointerOver={() => setHover("computer")}
        onPointerOut={() => setHover("none")}
        onClick={() => setStat('computer')}
      >
        {/* On change la couleur si on survole l'écran */}
        <meshStandardMaterial 
          color={stat === 'computer' ? ("black") : (hovered === "computer" ? "#ffeb3b" : "black")} 
          polygonOffset 
          polygonOffsetFactor={1} 
        />

        {stat === 'computer' && (
        <Html
        transform
        distanceFactor={0.75}
        position={[0, 0.803, 0]}
        rotation={[0, Math.PI / 2, 0]}
        
      >
        <ComputerScreen onClose={() => setStat("global")} />
      </Html>
)}

        <Edges 
          color="black" 
          renderOrder={1000} 
          material-depthTest={false} 
        />
      </mesh>

      <group position={nodes.Bibliotheque.position}>
        <mesh 
          geometry={nodes.Bibliotheque.geometry}
          // 👇 On redonne à l'objet sa place exacte dans le monde !
          rotation={nodes.Bibliotheque.rotation}
          scale={nodes.Bibliotheque.scale}
          onPointerOver={() => setHover("library")}
          onPointerOut={() => setHover("none")}
          onClick={() => setStat('library')}
        >
          {/* On change la couleur si on survole l'écran */}
          <meshStandardMaterial 
            color={stat === 'library' ? ("black") : (hovered === "library" ? "#ffeb3b" : "black")} 
            polygonOffset 
            polygonOffsetFactor={1} 
          />

        </mesh>

        {myGames.map((jeu,i) => {
          const isHovered = hoveredGame === jeu.id 
          const isSelected = selectedGame?.id === jeu.id;
          
          return (

          <mesh key={i} geometry={boxGeometry} position={[0,0,0.5*i]}
          onPointerOver={(e) => { e.stopPropagation(); stat === "library" ? setHoveredGame(jeu.id) : setHover('library') }}
          onPointerOut={() => setHoveredGame(null)}
          onClick={(e) => { e.stopPropagation(); setSelectedGame(jeu); }}>

            <meshStandardMaterial color={stat === 'library' ? (isHovered ? (selectedGame != null ? "black" : jeu.color) : "black") : (hovered === "library" ? "#ffeb3b" : "black")}  />

            <Edges 
              color="black" 
              renderOrder={1000} 
              material-depthTest={false} 
            />

          </mesh>
        )
        })}
      </group>

      {selectedGame && (
  <group position={[nodes.Bibliotheque.position.x + 1.4, nodes.Bibliotheque.position.y, nodes.Bibliotheque.position.z]}>
    
    {/* 1. LE MUR INVISIBLE (On le recule légèrement à x = -0.5 pour ne pas toucher le jeu) */}
    <mesh 
        position={[-0.5, 0, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        onPointerEnter={() => { document.body.style.cursor = 'alias'; }}
        onPointerLeave={() => { document.body.style.cursor = 'auto'; }}
        onClick={(e) => {
            e.stopPropagation();
            if (e.delta <= 2) {
              document.body.style.cursor = 'auto';
            setSelectedGame(null);
        }
        }}
    >
        <planeGeometry args={[70, 50]} />
        <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>

    <PresentationControls
      cursor={false}
      config={{ mass: 2, tension: 500 }}
      snap={true} 
      rotation={[0, 0.3, 0]}
      polar={[-Math.PI / 3, Math.PI / 3]} 
      azimuth={[-Math.PI / 1.4, Math.PI / 1.4]} 
    >
      <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh 
          geometry={boxGeometry} 
          scale={1.8} 
          onPointerEnter={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'grab';
          }}
          onPointerLeave={() => {
              document.body.style.cursor = 'auto';
          }}
          onPointerDown={() => {
              document.body.style.cursor = 'grabbing';
          }}
          onPointerUp={() => {
              document.body.style.cursor = 'grab';
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <meshStandardMaterial color={selectedGame.color} />
        </mesh>
      </Float>
    </PresentationControls>

    {/* Ton bouton HTML reste ici */}
    <Html position={[0, -1.5, 0]} center>
        <div className="relative bottom-0">
            <button 
                onMouseEnter={() => (document.body.style.cursor = 'pointer')}
                onMouseLeave={() => (document.body.style.cursor = 'auto')}
                onClick={() => window.open(selectedGame.url, '_blank')}
                className="bg-white w-60 text-black px-6 py-2 font-bold border-4 border-black hover:bg-yellow-400 transition-colors"
            >
                OUVRIR DANS UN NOUVEL ONGLET
            </button>
        </div>
    </Html>
  </group>
)}

    </group>
  )
}