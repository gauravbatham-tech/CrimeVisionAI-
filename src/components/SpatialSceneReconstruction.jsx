import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Eye,
  Radio,
  Crosshair,
  Footprints,
  Info
} from 'lucide-react';

export default function SpatialSceneReconstruction({ spatialData }) {
  const [selectedNode, setSelectedNode] = useState(spatialData?.nodes?.[0] || null);

  if (!spatialData || !spatialData.nodes) {
    return (
      <div className="tactical-card p-6 text-center text-slate-500 font-mono text-xs">
        No spatial reconstruction map available for this case.
      </div>
    );
  }

  const getNodeColor = (type) => {
    switch (type) {
      case 'CAMERA':
        return '#06b6d4'; // Cyan
      case 'BREACH_POINT':
        return '#f59e0b'; // Amber
      case 'PRIMARY_TARGET':
        return '#8b5cf6'; // Purple
      case 'WEAPON_RECOVERY':
        return '#ef4444'; // Red
      case 'WITNESS_LOCATION':
        return '#10b981'; // Green
      default:
        return '#64748b';
    }
  };

  return (
    <div className="tactical-card p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e293b] pb-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h3 className="font-tactical font-bold text-xs uppercase text-white tracking-wider">
            SPATIAL CRIME SCENE RECONSTRUCTION & MOVEMENT VECTORS
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          LAYOUT: {spatialData.sceneLayout}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Tactical Map SVG (8 cols) */}
        <div className="lg:col-span-8 bg-[#070c14] border border-[#1e293b] rounded relative overflow-hidden min-h-[340px] flex items-center justify-center p-2">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full max-h-[360px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="tacticalGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#132338" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#tacticalGrid)" />

            {/* Perimeter Building Walls */}
            <rect x="15" y="15" width="70" height="70" fill="none" stroke="#1e293b" strokeWidth="1.5" />
            {/* Interior Vault Chamber */}
            <rect x="55" y="45" width="28" height="38" fill="#0d182b" stroke="#334155" strokeWidth="1" strokeDasharray="1,1" />
            <text x="57" y="50" fill="#64748b" fontSize="2.5" fontFamily="monospace">VAULT COMPARTMENT</text>

            {/* Ingress / Egress Alley */}
            <line x1="10" y1="30" x2="45" y2="30" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2,1" />

            {/* Suspect Vector Trajectory Line */}
            <polyline
              points="15,30 45,30 75,65 60,50 15,30"
              fill="none"
              stroke="#ef4444"
              strokeWidth="0.8"
              strokeDasharray="1.5,1.5"
              opacity="0.8"
            />

            {/* Directional Arrow Annotations */}
            <text x="26" y="27" fill="#38bdf8" fontSize="2.5" fontFamily="monospace">▶ 21:12 INGRESS</text>
            <text x="52" y="38" fill="#f59e0b" fontSize="2.5" fontFamily="monospace">▶ 21:14 BREACH</text>
            <text x="68" y="77" fill="#cbd5e1" fontSize="2.5" fontFamily="monospace">▶ 21:18 CUT</text>
            <text x="35" y="53" fill="#ef4444" fontSize="2.5" fontFamily="monospace">◀ 21:20 FLEE</text>

            {/* Interactive Nodes */}
            {spatialData.nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const color = getNodeColor(node.type);

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {/* Outer pulse circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 4.5 : 3}
                    fill={color}
                    opacity={isSelected ? 0.4 : 0.2}
                  />
                  {/* Inner node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 2.5 : 1.8}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 0.6 : 0.3}
                  />
                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y - 3.5}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : color}
                    fontSize="2.4"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Compass Rose Widget in top right */}
          <div className="absolute top-2 right-2 p-1 bg-black/60 border border-slate-800 rounded font-mono text-[9px] text-cyan-400 flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>NORTH ↑</span>
          </div>
        </div>

        {/* Selected Node Details Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-[#090f1a] border border-[#1e293b] rounded p-3 space-y-3">
          <div className="text-xs font-tactical font-bold text-white flex items-center justify-between border-b border-[#1e293b] pb-2">
            <span>LOCATION TELEMETRY</span>
            {selectedNode && (
              <span
                className="badge text-[9px]"
                style={{
                  backgroundColor: `${getNodeColor(selectedNode.type)}22`,
                  color: getNodeColor(selectedNode.type),
                  borderColor: `${getNodeColor(selectedNode.type)}55`
                }}
              >
                {selectedNode.type}
              </span>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-cyan-300 font-mono">
                  {selectedNode.label}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Coordinates: X: {selectedNode.x}m | Y: {selectedNode.y}m
                </p>
              </div>

              <div className="bg-[#0b1424] p-2.5 rounded border border-[#1e293b] text-xs text-slate-300 space-y-1 font-sans">
                <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                  TACTICAL VECTOR IMPORTANCE:
                </span>
                <p>
                  {selectedNode.type === 'CAMERA' && 'Provides high-angle optical surveillance of service alley ingress and egress.'}
                  {selectedNode.type === 'BREACH_POINT' && 'Primary point of forced entry; heavy mechanical pry bar striations lifted from strike plate.'}
                  {selectedNode.type === 'PRIMARY_TARGET' && 'Secondary security envelope; thermal cutting saw applied to high-tensile locking bolts.'}
                  {selectedNode.type === 'WEAPON_RECOVERY' && 'Glock 19 suppressed firearm dropped during rapid tactical withdrawal.'}
                  {selectedNode.type === 'WITNESS_LOCATION' && 'Store manager desk location during emergency 911 dispatch communication.'}
                </p>
              </div>

              <div className="text-[10px] font-mono text-slate-500 pt-1">
                Tip: Click any node on the diagram to inspect its tactical coordinates.
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-xs font-mono py-8 text-center">
              Click a node on the scene map to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
