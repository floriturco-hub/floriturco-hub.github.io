import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, un camión levantado con un gato pequeño y una mano en la palanca; en el centro, el gato en corte
// (pistón delgado, pistón grueso, aceite, presión igual en todo y la palanca); a la derecha, las áreas vistas desde arriba.
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho (la mano que levanta el camión).
const ACEITE = "#E8A040";
const ACERO = "#8A90A0";
const PIEL = "#E8B090";
const S = { x0: 1440, x1: 1520 };
const G = { x0: 1760, x1: 2280 };

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1060, 1.0],
  [T.final - 0.1, 550, 1060, 1.04],
  [T.final + 0.2, 550, 1000, 0.92],
  [T.gato - 0.1, 550, 1000, 0.95],
  [T.gato + 0.2, 1860, 1050, 1.0],
  [T.delgado - 0.1, 1860, 1050, 1.03],
  [T.delgado + 0.2, 1500, 1000, 1.6],
  [T.grueso - 0.1, 1500, 1000, 1.63],
  [T.grueso + 0.2, 2020, 1000, 1.3],
  [T.aceite - 0.1, 2020, 1000, 1.33],
  [T.aceite + 0.2, 1860, 1220, 1.45],
  [T.presion - 0.1, 1860, 1220, 1.48],
  [T.presion + 0.2, 1860, 1060, 1.0],
  [T.pascal - 0.1, 1860, 1060, 1.03],
  [T.pascal + 0.2, 1860, 1060, 1.15],
  [T.formula - 0.1, 1860, 1060, 1.18],
  [T.formula + 0.2, 3100, 1030, 1.0],
  [T.cien - 0.1, 3100, 1030, 1.03],
  [T.cien + 0.2, 3150, 1030, 1.25],
  [T.recibe - 0.1, 3150, 1030, 1.28],
  [T.recibe + 0.2, 2020, 980, 1.25],
  [T.palanca - 0.1, 2020, 980, 1.28],
  [T.palanca + 0.2, 1620, 880, 1.2],
  [T.delgado2 - 0.1, 1620, 880, 1.23],
  [T.delgado2 + 0.2, 1500, 900, 1.6],
  [T.grueso2 - 0.1, 1500, 900, 1.63],
  [T.grueso2 + 0.2, 2020, 900, 1.35],
  [T.precio - 0.1, 2020, 900, 1.38],
  [T.precio + 0.2, 1860, 1050, 1.0],
  [T.subir - 0.1, 1860, 1050, 1.03],
  [T.subir + 0.2, 2020, 960, 1.6],
  [T.bajar - 0.1, 2020, 960, 1.63],
  [T.bajar + 0.2, 1500, 1020, 1.5],
  [T.asi - 0.1, 1500, 1020, 1.53],
  [T.asi + 0.25, 550, 1060, 1.0],
  [T.fin + 0.3, 550, 1060, 1.04],
];

export const GatoMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Camión
  const lift = t < T.final ? interpolate(t, [0, 1.7], [0, 40], clamp) : t < T.asi ? 40 : interpolate(t, [T.asi, T.fin + 0.3], [0, 20], clamp);
  const bombeo = (Math.sin(t * 7) + 1) / 2;

  // Gato en corte: el pistón delgado baja al bombear, el grueso sube poco a poco
  const verCorte = Math.max(ventana(T.gato - 0.1, T.formula + 0.2), ventana(T.recibe - 0.1, T.asi + 0.2));
  const bombeando = (t > T.delgado && t < T.aceite) || (t > T.palanca && t < T.precio) || t > T.subir;
  const carrera = t > T.subir ? interpolate(t, [T.bajar - 0.3, T.bajar + 1.0], [0, 1], clamp) : bombeando ? bombeo : 0;
  const ds = 260 * carrera;
  const db = t > T.subir ? 2.6 * carrera : 0;
  const yS = 820 + ds;
  const yG = 980 - db;
  const presion = ventana(T.presion, T.formula + 0.2);
  const palanca = ventana(T.palanca - 0.2, T.precio + 0.2);
  const ang = -10 + 22 * carrera;

  // Áreas
  const verAreas = ventana(T.formula - 0.1, T.recibe + 0.2);
  const grande = interpolate(t, [T.cien, T.cien + 0.8], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#1A1C28" />

        {/* Camión y gato */}
        <rect x={40} y={1400} width={1040} height={200} fill="#3A3A44" />
        <g transform={`translate(0 ${-lift})`}>
          <rect x={120} y={880} width={580} height={380} rx={14} fill="#5A7A9A" />
          <text x={410} y={1100} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={110} fontWeight={700}>
            10 t
          </text>
          <path d="M 710 1260 L 710 1000 L 860 1000 L 960 1120 L 960 1260 Z" fill="#C83A3A" />
          <path d="M 735 1020 L 850 1020 L 925 1110 L 735 1110 Z" fill="#9AD8F8" opacity={0.8} />
          <rect x={110} y={1260} width={860} height={30} fill="#2A2A30" />
          {[240, 560, 860].map((x) => (
            <g key={x}>
              <circle cx={x} cy={1340} r={62} fill="#1A1A1E" />
              <circle cx={x} cy={1340} r={26} fill="#8A90A0" />
            </g>
          ))}
        </g>
        <rect x={470} y={1360} width={150} height={40} rx={6} fill="#C83A3A" />
        <rect x={505} y={1290 - lift} width={80} height={70 + lift} fill="#C83A3A" />
        <rect x={525} y={1270 - lift} width={40} height={30} fill="#C8CED8" />
        <g transform={`rotate(${-8 + 16 * bombeo} 600 1340)`}>
          <line x1={600} y1={1340} x2={880} y2={1300} stroke="#C8CED8" strokeWidth={14} strokeLinecap="round" />
          <ellipse cx={890} cy={1290} rx={50} ry={34} fill={PIEL} />
        </g>
        <Pildora x={560} y={640} texto="¿cuál es el precio?" color={C.white} o={ventana(T.final + 0.3, T.gato)} tam={42} />

        {/* Gato en corte */}
        <g opacity={verCorte}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {/* Paredes */}
          <rect x={S.x0 - 14} y={760} width={S.x1 - S.x0 + 28} height={580} fill={ACERO} />
          <rect x={G.x0 - 14} y={880} width={G.x1 - G.x0 + 28} height={460} fill={ACERO} />
          <rect x={S.x0 - 14} y={1250} width={G.x1 - S.x0 + 28} height={100} fill={ACERO} />
          {/* Aceite */}
          <rect x={S.x0} y={yS + 40} width={S.x1 - S.x0} height={1250 - yS - 40} fill={ACEITE} />
          <rect x={G.x0} y={yG + 40} width={G.x1 - G.x0} height={1250 - yG - 40} fill={ACEITE} />
          <rect x={S.x0} y={1250} width={G.x1 - S.x0} height={80} fill={ACEITE} />
          {/* Pistones */}
          <rect x={S.x0 + 4} y={yS} width={S.x1 - S.x0 - 8} height={40} fill="#5A5F6C" />
          <rect x={S.x0 + 30} y={yS - 60} width={20} height={60} fill="#5A5F6C" />
          <rect x={G.x0 + 4} y={yG} width={G.x1 - G.x0 - 8} height={40} fill="#5A5F6C" />
          {/* Mini camión sobre el pistón grueso */}
          <g transform={`translate(2020 ${yG - 4})`}>
            <rect x={-200} y={-120} width={260} height={96} rx={8} fill="#5A7A9A" />
            <path d="M 64 -24 L 64 -100 L 130 -100 L 170 -60 L 170 -24 Z" fill="#C83A3A" />
            <circle cx={-150} cy={-20} r={20} fill="#1A1A1E" />
            <circle cx={120} cy={-20} r={20} fill="#1A1A1E" />
          </g>
          {/* Presión igual en todo */}
          {presion > 0
            ? [
                [S.x0, 1000, -1, 0],
                [S.x1, 1100, 1, 0],
                [G.x0, 1100, -1, 0],
                [G.x1, 1100, 1, 0],
                [1600, 1330, 0, 1],
                [1900, 1330, 0, 1],
                [2150, 1330, 0, 1],
                [2020, yG + 40, 0, -1],
                [1480, yS + 40, 0, -1],
              ].map(([x, y, dx, dy], k) => {
                const l = 46 + 8 * Math.sin(t * 6);
                return (
                  <path
                    key={k}
                    d={`M ${x - dx * 50 - dy * 0} ${y - dy * 50} L ${x + dx * (l - 50)} ${y + dy * (l - 50)}`}
                    stroke={C.yellow}
                    strokeWidth={8}
                    strokeLinecap="round"
                    opacity={presion}
                    transform={`translate(${dx * 10} ${dy * 10})`}
                  />
                );
              })
            : null}
          {/* Empuje en el pistón delgado y fuerza en el grueso */}
          <g opacity={Math.max(ventana(T.delgado, T.aceite), ventana(T.presion, T.pascal))}>
            <path d={`M 1480 ${yS - 200} L 1480 ${yS - 80} M 1458 ${yS - 104} L 1480 ${yS - 80} L 1502 ${yS - 104}`} fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g opacity={ventana(T.recibe, T.palanca)}>
            {[1860, 2020, 2180].map((x) => (
              <path key={x} d={`M ${x} 1180 L ${x} 1020 M ${x - 26} 1050 L ${x} 1020 L ${x + 26} 1050`} fill="none" stroke={C.yellow} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </g>
          {/* Palanca */}
          <g opacity={palanca}>
            <circle cx={1390} cy={yS - 60} r={14} fill="#C8CED8" />
            <g transform={`rotate(${ang} 1390 ${yS - 60})`}>
              <line x1={1390} y1={yS - 60} x2={1730} y2={yS - 60} stroke="#C8CED8" strokeWidth={16} strokeLinecap="round" />
              <ellipse cx={1730} cy={yS - 92} rx={44} ry={30} fill={PIEL} />
            </g>
          </g>
        </g>
        <Pildora x={1860} y={1420} texto="P igual en todo" color={C.yellow} o={ventana(T.pascal, T.formula)} tam={42} />
        <Pildora x={1730} y={680} texto="20 kg" color={C.white} o={ventana(T.palanca + 0.6, T.precio)} tam={44} />
        <Pildora x={1480} y={680} texto="100 kg" color={C.white} o={ventana(T.delgado2 + 0.3, T.precio)} tam={44} />
        <Pildora x={2020} y={760} texto="10 t" color={C.yellow} o={ventana(T.grueso2 + 0.3, T.precio)} tam={56} />
        <Pildora x={2020} y={760} texto="sube 1 cm" color={C.cyan} o={ventana(T.subir + 0.4, T.bajar)} tam={44} />
        <Pildora x={1480} y={1420} texto="baja 100 cm" color={C.red} o={ventana(T.bajar + 0.3, T.asi)} tam={44} />

        {/* Áreas vistas desde arriba */}
        <g opacity={verAreas}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <text x={3100} y={780} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={72} fontWeight={700}>
            P = F ÷ A
          </text>
          <circle cx={2780} cy={1080} r={24} fill={ACEITE} stroke={C.white} strokeWidth={4} />
          <text x={2780} y={1180} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={38} fontWeight={700}>
            1
          </text>
          <circle cx={3250} cy={1080} r={24 + 216 * grande} fill={ACEITE} opacity={0.85} stroke={C.white} strokeWidth={4} />
          <text x={3250} y={1100} textAnchor="middle" fill="#3A2A10" fontFamily={mono} fontSize={56} fontWeight={700} opacity={grande}>
            × 100
          </text>
        </g>
        <Pildora x={3100} y={1390} texto="× 100 fuerza" color={C.yellow} o={ventana(T.recibe - 0.6, T.recibe + 0.2, 0.2, 0.2)} tam={46} />
      </g>

      {[T.gato, T.pascal, T.grueso2, T.precio].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(1480)} y={sy(yS + 20)} dx={180} dy={-160} texto="pistón delgado" color={C.white} o={ventana(T.delgado + 0.3, T.grueso)} />
      <Tag x={sx(2100)} y={sy(yG + 20)} dx={60} dy={-260} texto="pistón grueso" color={C.white} o={ventana(T.grueso + 0.3, T.aceite)} />
      <Tag x={sx(1900)} y={sy(1290)} dx={60} dy={-200} texto="aceite" color={ACEITE} o={ventana(T.aceite + 0.3, T.presion)} />
    </svg>
  );
};
