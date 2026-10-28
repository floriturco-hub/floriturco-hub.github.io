import { montserrat } from "../theme";

// Frasco de Palmolive Smoothie (berries, banana y yogur) en vectorial plano, a partir de la foto de referencia
// guion/smoothie/producto_referencia.jpg. Origen: centro de la base; mide ~330 px de alto con escala 1.
const MORADO = "#7A5AB8";
const MORADO_OSCURO = "#5A3E94";
const VERDE = "#1E6A3A";
const MORA = "#2A1E3A";
const BANANA = "#F2DC8A";

export const Botella: React.FC<{ readonly x: number; readonly y: number; readonly escala?: number; readonly giro?: number }> = ({ x, y, escala = 1, giro = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${giro}) scale(${escala})`}>
    {/* Tapa verde */}
    <path d="M -48 -300 C -48 -326, -30 -334, 0 -334 C 34 -334, 50 -324, 50 -300 L 50 -270 L -48 -270 Z" fill={VERDE} />
    <rect x={-50} y={-274} width={100} height={10} rx={4} fill="#14502A" />
    {/* Cuerpo */}
    <path d="M -54 -266 C -60 -230, -66 -180, -66 -120 C -66 -60, -62 -20, -54 -6 C -50 0, 50 0, 54 -6 C 62 -20, 66 -60, 66 -120 C 66 -180, 60 -230, 54 -266 Z" fill={MORADO} />
    <path d="M -54 -266 C -60 -230, -66 -180, -66 -120 C -66 -60, -62 -20, -54 -6 C -44 -2, -36 -2, -30 -4 C -40 -40, -42 -200, -36 -266 Z" fill={MORADO_OSCURO} opacity={0.5} />
    {/* Frutas: moras y rodajas de banana */}
    {[
      [-26, -236],
      [24, -220],
      [-6, -200],
      [30, -150],
    ].map(([fx, fy], i) => (
      <g key={i}>
        <circle cx={fx} cy={fy} r={12} fill={MORA} />
        <circle cx={fx - 4} cy={fy - 4} r={3} fill="#5A4A7A" />
        <circle cx={fx + 4} cy={fy + 3} r={3} fill="#5A4A7A" />
      </g>
    ))}
    {[
      [2, -242],
      [-30, -170],
      [10, -172],
    ].map(([fx, fy], i) => (
      <g key={i}>
        <ellipse cx={fx} cy={fy} rx={13} ry={9} fill={BANANA} />
        <ellipse cx={fx} cy={fy} rx={5} ry={3} fill="#E6C866" />
      </g>
    ))}
    {/* Marca y variante */}
    <rect x={-58} y={-138} width={116} height={26} rx={4} fill={VERDE} />
    <text x={0} y={-119} textAnchor="middle" fill="#FFFFFF" fontFamily={montserrat} fontWeight={400} fontSize={17} letterSpacing={1}>
      PALMOLIVE
    </text>
    <text x={0} y={-80} textAnchor="middle" fill="#FFFFFF" fontFamily={montserrat} fontSize={30} fontStyle="italic">
      Smoothie
    </text>
    <text x={0} y={-58} textAnchor="middle" fill="#E8E0F4" fontFamily={montserrat} fontSize={9}>
      BERRIES, BANANA &amp; YOGHURT
    </text>
    <text x={0} y={-24} textAnchor="middle" fill="#FFFFFF" fontFamily={montserrat} fontSize={20}>
      390mL
    </text>
  </g>
);
