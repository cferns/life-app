import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Vector3, Euler } from 'three';

type Pin = { id: string; label: string; color?: string; kind: string; xPct: number; yPct: number; status?: 'red'|'yellow'|'green' };

type Props = {
  pins: Pin[];
  layerRadii: number[];
  layerNames: string[];
  kindColors: Record<string, string>;
  statusColors: Record<string, string>;
  defaultGrey: string;
  ringRotations?: Array<[number, number, number]>; // radians per ring (x,y,z)
  kindToLayerIndex?: Record<string, number | null>;
  isFullscreen?: boolean;
};

const Ring: React.FC<{ radius: number; rotation?: [number, number, number] }> = ({ radius, rotation }) => {
  const r = radius / 10;
  return (
    <mesh rotation={rotation as any}>
      <torusGeometry args={[r, 0.01, 8, 96]} />
      <meshBasicMaterial color="#e5e7eb" wireframe />
    </mesh>
  );
};

const PinSphere: React.FC<{ x: number; y: number; z?: number; color: string; label: string }> = ({ x, y, z = 0, color, label }) => {
  return (
    <group position={[x, y, z]}>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html position={[0, 0.5, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          color: '#334155',
          fontSize: 12,
          padding: '2px 6px',
          borderRadius: 6,
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
        }}>{label}</div>
      </Html>
    </group>
  );
};

const ThreeSolarView: React.FC<Props> = ({ pins, layerRadii, statusColors, defaultGrey, ringRotations = [], kindToLayerIndex = {}, isFullscreen }) => {
  return (
    <div className="w-full" style={{ height: isFullscreen ? '100vh' : '20rem' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={0.6} />
        <Suspense fallback={null}>
          {/* Sun */}
          <mesh>
            <sphereGeometry args={[0.4, 24, 24]} />
            <meshStandardMaterial emissive="#FDB813" color="#FDB813" emissiveIntensity={0.7} />
          </mesh>
          {/* Rings */}
          {layerRadii.map((r, i) => (
            <Ring key={i} radius={r} rotation={ringRotations[i]} />
          ))}
          {/* Pins: place on their ring plane if mapped to a ring */}
          {pins.map((p) => {
            const col = (p.status && statusColors[p.status]) || defaultGrey;
            const idx = kindToLayerIndex[p.kind] ?? null;
            if (idx === null || idx < 0) {
              const wx = (p.xPct - 50) / 10;
              const wy = (p.yPct - 50) / 10;
              return <PinSphere key={p.id} x={wx} y={wy} color={col} label={p.label} />;
            }
            const r = layerRadii[idx] / 10;
            const angle = Math.atan2(p.yPct - 50, p.xPct - 50);
            const v = new Vector3(Math.cos(angle) * r, Math.sin(angle) * r, 0);
            const rot = ringRotations[idx] || [0, 0, 0];
            v.applyEuler(new Euler(rot[0], rot[1], rot[2]));
            return <PinSphere key={p.id} x={v.x} y={v.y} z={v.z} color={col} label={p.label} />;
          })}
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
};

export default ThreeSolarView;

