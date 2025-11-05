import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const BodyPart = ({ name, position, scale, color, hoverColor, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <mesh
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(name)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? hoverColor : color} />
    </mesh>
  );
};

const ThreeDBody = ({ onSelectPart }) => {
  return (
    <div style={{ width: '100%', height: 600, background: '#0a0a0a', borderRadius: 8 }}>
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <OrbitControls enablePan enableZoom enableRotate />
        <group position={[0, -1.2, 0]}> 
          <BodyPart name="head" position={[0, 2.4, 0]} scale={[0.9, 1, 0.9]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="neck" position={[0, 1.7, 0]} scale={[0.4, 0.5, 0.4]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="chest" position={[0, 1.1, 0]} scale={[1.6, 1.2, 0.8]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="abdomen" position={[0, 0.2, 0]} scale={[1.3, 1, 0.7]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="pelvis" position={[0, -0.6, 0]} scale={[1.2, 0.7, 0.7]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="leftUpperArm" position={[-1.4, 1.1, 0]} scale={[0.5, 1, 0.5]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="rightUpperArm" position={[1.4, 1.1, 0]} scale={[0.5, 1, 0.5]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="leftForearm" position={[-1.4, 0.1, 0]} scale={[0.45, 1, 0.45]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="rightForearm" position={[1.4, 0.1, 0]} scale={[0.45, 1, 0.45]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="leftThigh" position={[-0.5, -1.6, 0]} scale={[0.7, 1.3, 0.7]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="rightThigh" position={[0.5, -1.6, 0]} scale={[0.7, 1.3, 0.7]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="leftShin" position={[-0.5, -2.7, 0]} scale={[0.6, 1.2, 0.6]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="rightShin" position={[0.5, -2.7, 0]} scale={[0.6, 1.2, 0.6]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="leftFoot" position={[-0.5, -3.4, 0.2]} scale={[0.8, 0.3, 1.2]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
          <BodyPart name="rightFoot" position={[0.5, -3.4, 0.2]} scale={[0.8, 0.3, 1.2]} color="#2a2a2a" hoverColor="#00bcd4" onSelect={onSelectPart} />
        </group>
      </Canvas>
    </div>
  );
};

export default ThreeDBody;