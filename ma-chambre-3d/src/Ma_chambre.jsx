import React, { useState, useEffect } from 'react'
import { useGLTF, PresentationControls, Float, Html, useTexture, Outlines, Box } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'


import { ComputerScreen } from './ordinateur/ComputerScreen'

const STYLE = {
  paper: "#d9d5c1",
  ink: "#1a2639"
};

export function Model({ props }) {
  const { nodes } = useGLTF('/test1.glb');
  const [stat, setStat] = useState("global");
  const [hovered, setHover] = useState("none");
  const [lookTarget] = useState(() => new THREE.Vector3(-0.63, 4.13, -1.49));
  const [hoveredGame, setHoveredGame] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  

  const myGames = [
    { id: 1, name: "Projet Alpha", url: "https://alpha.monsite.fr", texture: "/textures/jackets/jacket_1.png" },
    { id: 2, name: "Projet Beta", url: "https://beta.monsite.fr", texture: "/textures/jackets/jacket_1.png" },
    { id: 3, name: "Projet Gamma", url: "https://gamma.monsite.fr", texture: "/textures/jackets/jacket_1.png"  },
  ];

  const boxGeometry = nodes.Jackette.geometry;

  const texturesJacket = useTexture(myGames.map(game => game.texture));
  texturesJacket.forEach(t => {
    t.flipY = false; // Souvent nécessaire pour que l'image ne soit pas à l'envers
    t.colorSpace = THREE.SRGBColorSpace;
  });
  

  // 🧹 Plus besoin de charger les textures ici !

  useFrame((state) => {
    const vitesse = 0.030;
    
    if (stat === 'computer') {
      const ecranPos = new THREE.Vector3().copy(nodes.Ecran.position);
      state.camera.position.lerp(new THREE.Vector3().copy(ecranPos).add(new THREE.Vector3(3, 0.5, 0)), vitesse);
      lookTarget.lerp(new THREE.Vector3().copy(ecranPos).add(new THREE.Vector3(0, 0.5, 0)), vitesse);
      state.camera.lookAt(lookTarget);
    }
    if (stat === 'global') {
      state.camera.position.lerp(new THREE.Vector3(10.62, 8.36, 7.99), vitesse);
      lookTarget.lerp(new THREE.Vector3(-0.63, 4.13, -1.49), vitesse);
      state.camera.lookAt(lookTarget);
    }
    if (stat === 'library') {
      state.camera.position.lerp(new THREE.Vector3(-3.28, 8.46, -0.77), vitesse);
      lookTarget.lerp(new THREE.Vector3(-4.07, 8.43, -0.81), vitesse);
      state.camera.lookAt(lookTarget);
    }
  });

  return (
    <group {...props} dispose={null}>
      
      {/* 🧱 LE DÉCOR : Matériau standard simple */}
      <mesh 
        receiveShadow // 👈 Reçoit les ombres des autres objets
        castShadow    // 👈 Projette sa propre ombre (si tu as des étagères au mur)
        geometry={nodes.Decor_Fixe.geometry}
        position={nodes.Decor_Fixe.position}
        rotation={nodes.Decor_Fixe.rotation}
        scale={nodes.Decor_Fixe.scale}
      >
        <meshStandardMaterial color={STYLE.paper} roughness={1} polygonOffset 
  polygonOffsetFactor={-1}/>
        <Outlines thickness={2} color={STYLE.ink} angle={0} depthTest={true}/>
      </mesh>

      <mesh 
        receiveShadow // 👈 Reçoit les ombres des autres objets
        castShadow    // 👈 Projette sa propre ombre (si tu as des étagères au mur)
        geometry={nodes.Drap.geometry}
        position={nodes.Drap.position}
        rotation={nodes.Drap.rotation}
        scale={nodes.Drap.scale}
      >
        <meshStandardMaterial color={STYLE.paper} roughness={1} polygonOffset 
        polygonOffsetFactor={-30}/>
        <Outlines thickness={2} color={STYLE.ink} angle={0} depthTest={true}/>
      </mesh>


      {/* 🖥️ L'ÉCRAN */}
      <mesh 
        castShadow    // 👈 Projette une ombre
        receiveShadow // 👈 Reçoit l'ombre
        geometry={nodes.Ecran.geometry}
        position={nodes.Ecran.position}
        rotation={nodes.Ecran.rotation}
        scale={nodes.Ecran.scale}
        onPointerOver={() => setHover("computer")}
        onPointerOut={() => setHover("none")}
        onClick={() => setStat('computer')}
      >
        <meshStandardMaterial color={hovered === "computer" || stat === "computer" ? STYLE.ink : STYLE.paper} />
        <Outlines thickness={hovered === "computer" ? 4 : 2} color={STYLE.ink} />
        <Html 
          pointerEvents={stat === "computer" ? "auto" : "none"}  
          transform 
          distanceFactor={0.75} 
          position={[0, 0.803, 0]} 
          rotation={[0, Math.PI / 2, 0]}
        >
          {/* On ajoute une div autour de ton écran pour gérer l'animation */}
          <div 
            style={{ 
              opacity: (hovered === "computer" || stat === "computer") ? 1 : 0,
              // Sécurité supplémentaire : on désactive les clics si c'est juste survolé ou caché
              pointerEvents: stat === "computer" ? "auto" : "none" 
            }}
          >
            <ComputerScreen onClose={() => setStat("global")} />
          </div>
        </Html>
      </mesh>

      {/* 📚 LA BIBLIOTHEQUE */}
      <group position={nodes.Bibliotheque.position}>
        <Box
          scale={[0.9, 1.8, 4.33]} 
          position={[0.5, 0, 0.25]} // On le centre un peu
          onPointerOver={() => setHover("library")}
          onPointerOut={() => setHover("none")}
          onClick={() => setStat('library')}
        >
          <meshBasicMaterial transparent opacity={0} />
        </Box>

        <mesh 
          castShadow
          receiveShadow
          geometry={nodes.Bibliotheque.geometry}
          rotation={nodes.Bibliotheque.rotation}
          scale={nodes.Bibliotheque.scale}
        >
          {/* On lui donne une couleur "bois" de base */}
          <meshStandardMaterial color={hovered === "library" || stat === 'library' ? "#8B4513" : STYLE.paper} />
          <Outlines thickness={2} color={STYLE.ink} />  
        </mesh>

        {myGames.map((jeu, i) => {
          const isHovered = hoveredGame === jeu.id;
          const isSelected = selectedGame?.id === jeu.id;
          
          return (
            // 👇 1. LE GROUPE gère la position et les interactions
            <group 
              key={i}
              position={[0, 0, 0.5 * i]}
              visible={!isSelected}
              onPointerOver={(e) => { e.stopPropagation(); setHoveredGame(jeu.id) }}
              onPointerOut={() => setHoveredGame(null)}
              onClick={(e) => { 
                e.stopPropagation(); 
                if (stat === "library") setSelectedGame(jeu); 
              }}
            >
              {/* 📦 2. LE PAPIER (Base) */}
              <mesh geometry={boxGeometry}>
                <Outlines thickness={2} color={STYLE.ink} />
                <meshStandardMaterial color={STYLE.paper} roughness={1} />
              </mesh>

              {/* 🎨 3. LA TEXTURE (Surcouche) */}
              <mesh 
                geometry={boxGeometry}
                visible={hovered === "library" || stat === "library"}
                scale={1.01} // J'ai mis 1.01 pour être sûr à 100% que ça passe devant
              >
                <meshStandardMaterial 
                  map={texturesJacket[i]} 
                  color="#ffffff" 
                  roughness={1} 
                />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* 🔍 INSPECTEUR DE JEU */}
      {selectedGame && (
        <group position={[nodes.Bibliotheque.position.x + 1.4, nodes.Bibliotheque.position.y, nodes.Bibliotheque.position.z]}>
          
          {/* Le mur de verre pour fermer */}
          <mesh position={[-0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} 
            onPointerEnter={() => { document.body.style.cursor = 'alias'; }}
            onPointerLeave={() => { document.body.style.cursor = 'auto'; }}
            onClick={(e) => { e.stopPropagation(); if (e.delta <= 2) setSelectedGame(null); }}
          >
            <planeGeometry args={[70, 50]} />
            <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
          </mesh>

          {/* Le contrôleur de rotation */}
          <PresentationControls cursor={false} config={{ mass: 2, tension: 500 }} snap rotation={[0, 0.3, 0]}>
            <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
              <mesh geometry={boxGeometry} scale={1.8} 
                onPointerEnter={(e) => { e.stopPropagation(); document.body.style.cursor = 'grab'; }}
                onPointerLeave={() => { document.body.style.cursor = 'auto'; }}
                onPointerDown={() => { document.body.style.cursor = 'grabbing'; }}
                onPointerUp={() => { document.body.style.cursor = 'grab'; }}
                onClick={(e) => e.stopPropagation()}
              >
                <Outlines thickness={2} color={STYLE.ink} />
                <meshStandardMaterial 
           map={texturesJacket[myGames.findIndex(g => g.id === selectedGame.id)]} 
           color={STYLE.paper} // Teinte la texture en beige parchemin
            roughness={1} 
          />
              </mesh>
            </Float>
          </PresentationControls>

          <Html position={[0, -1.5, 0]} center>
            <button 
              onClick={() => window.open(selectedGame.url, '_blank')}
              className="bg-white w-60 text-black px-6 py-2 font-bold border-4 border-black hover:bg-yellow-400 transition-colors"
            >
              OUVRIR LE PROJET
            </button>
          </Html>
        </group>
      )}
    </group>
  )
}