import { useMemo } from 'react';
import type { MindMapNode, MindMapEdge } from '../types/narrative';

interface MindMapViewerProps {
  titulo: string;
  descripcion: string;
  nodos: MindMapNode[];
  aristas: MindMapEdge[];
}

const CENTER_X = 400;
const CENTER_Y = 300;
const RADIUS = 220;

function layoutNodes(nodos: MindMapNode[]): MindMapNode[] {
  return nodos.map((n, i) => {
    if (n.x !== undefined && n.y !== undefined) return n;
    const angle = (2 * Math.PI * i) / nodos.length - Math.PI / 2;
    return {
      ...n,
      x: 0.5 + (RADIUS * Math.cos(angle)) / (CENTER_X * 2),
      y: 0.5 + (RADIUS * Math.sin(angle)) / (CENTER_Y * 2),
    };
  });
}

const NODE_COLORS = ['#66FCF1', '#4CAF50', '#FFE66D', '#FF2E9A', '#FF8C42', '#A78BFA', '#F472B6', '#34D399'];

export default function MindMapViewer({ titulo, descripcion, nodos, aristas }: MindMapViewerProps) {
  const laid = useMemo(() => layoutNodes(nodos), [nodos]);
  const svgW = 800;
  const svgH = 600;

  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="font-display text-lg text-[#66FCF1] mb-1 text-center">{titulo}</h3>
      <p className="text-[#8A95A5] text-sm font-body mb-4 text-center max-w-xl">{descripcion}</p>
      <div className="w-full max-w-[800px] bg-[#0B0C10] border border-[#1F2833] rounded-lg overflow-hidden">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" role="img" aria-label="Mapa mental">
          <defs>
            <filter id="nodeGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2A3645" />
            </marker>
          </defs>
          <rect width={svgW} height={svgH} fill="#0B0C10" />

          {/* Edges */}
          {aristas.map((e, i) => {
            const from = laid.find((n) => n.id === e.from);
            const to = laid.find((n) => n.id === e.to);
            if (!from || !to) return null;
            const x1 = (from.x ?? 0.5) * svgW;
            const y1 = (from.y ?? 0.5) * svgH;
            const x2 = (to.x ?? 0.5) * svgW;
            const y2 = (to.y ?? 0.5) * svgH;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2 - 20;
            return (
              <g key={`edge-${i}`}>
                <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke="#2A3645" strokeWidth="2" markerEnd="url(#arrow)" />
                {e.label && (
                  <text x={mx} y={my - 8} textAnchor="middle" fill="#8A95A5" fontSize="10" fontFamily="Inter, sans-serif">
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {laid.map((n, i) => {
            const cx = (n.x ?? 0.5) * svgW;
            const cy = (n.y ?? 0.5) * svgH;
            const color = n.color ?? NODE_COLORS[i % NODE_COLORS.length];
            return (
              <g key={n.id} filter="url(#nodeGlow)">
                <circle cx={cx} cy={cy} r={32} fill={color} opacity={0.15} />
                <circle cx={cx} cy={cy} r={26} fill={color} opacity={0.3} stroke={color} strokeWidth="2" />
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#F5F5F5" fontSize="11" fontWeight="bold" fontFamily="Inter, sans-serif">
                  {n.label.split(' ')[0]}
                </text>
                {n.label.includes(' ') && (
                  <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="central" fill="#F5F5F5" fontSize="9" fontFamily="Inter, sans-serif">
                    {n.label.split(' ').slice(1).join(' ')}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
