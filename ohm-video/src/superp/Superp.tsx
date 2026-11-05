import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el bote en corte (moléculas sueltas y ácido) y una gota que cae sobre una superficie húmeda;
// en el centro, la reacción en cadena con el agua y el plástico que rellena las grietas; a la derecha, hospital y cómo despegarlo.
const MONO = "#F8A040";
const AGUA = "#5AB8F8";
const ACIDO = "#E8414F";
const MOLS = new Array(22).fill(0).map((_, i) => ({ fx: random(`mx${i}`), fy: random(`my${i}`), vx: 0.3 + random(`vx${i}`) * 0.4, vy: 0.3 + random(`vy${i}`) * 0.4 }));
const tri = (u: number) => {
  const f = ((u % 1) + 1) % 1;
  return f < 0.5 ? f * 2 : 2 - f * 2;
};

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1150, 1.2],
  [T.cianoacrilato - 0.4, 550, 1150, 1.24],
  [T.cianoacrilato + 0.4, 550, 740, 1.25],
  [T.humedad - 0.3, 550, 740, 1.28],
  [T.humedad + 0.5, 550, 1150, 1.2],
  [T.engancha - 0.3, 550, 1150, 1.24],
  [T.engancha + 0.5, 1850, 1030, 1.0],
  [T.hospitales - 0.3, 1850, 1030, 1.02],
  [T.hospitales + 0.5, 3100, 1030, 1.0],
  [T.activa - 0.3, 3100, 1030, 1.02],
  [T.activa + 0.5, 550, 1150, 1.2],
  [T.fin + 2, 550, 1150, 1.26],
];

export const SuperpMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Gota que cae sobre la superficie húmeda y se vuelve plástico (gancho y luego con la explicación)
  const cae = t < T.cianoacrilato ? interpolate(t, [0, 0.5], [0, 1], clamp) : interpolate(t, [T.humedad, T.aire + 0.4], [0, 1], clamp);
  const cuaja = t < T.cianoacrilato ? interpolate(t, [0.5, 1.6], [0, 1], clamp) : interpolate(t, [T.dispara, T.engancha + 0.2], [0, 1], clamp);
  const final = t > T.activa ? 1 : 0;
  const reloj = t < T.cianoacrilato ? Math.min(3, (t / 1.6) * 3) : 3;
  const acido = ventana(T.acido, T.humedad + 0.6);
  const agitar = t < T.humedad ? 1 : 0.4;

  // Reacción en cadena
  const cadena = ventana(T.engancha - 0.3, T.hospitales + 0.3, 0.6, 0.6);
  const n = Math.floor(interpolate(t, [T.engancha, T.cadena + 0.8], [1, 14], clamp));
  const grietas = interpolate(t, [T.plastico, T.grieta + 0.8], [0, 1], clamp);
  const piel = ventana(T.dedos, T.hospitales + 0.3);

  // Hospital y despegar
  const otros = ventana(T.hospitales - 0.3, T.activa + 0.3, 0.6, 0.6);
  const herida = interpolate(t, [T.hospitales, T.hospitales + 1.2], [0, 1], clamp);
  const despega = interpolate(t, [T.despegar, T.acetona + 1.2], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const gotaY = 820 + (1380 - 820) * cae;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={1500} height={2400} fill="#1E1A2E" />
        {/* Bote en corte */}
        <path d="M 400 400 L 700 400 L 700 760 L 600 800 L 580 860 L 520 860 L 500 800 L 400 760 Z" fill="#E8E6F0" opacity={0.25} stroke="#E8E6F0" strokeWidth={6} />
        <rect x={410} y={430} width={280} height={320} rx={10} fill="#F8E8A8" opacity={0.25} />
        {MOLS.map((m, i) => (
          <circle key={i} cx={430 + tri(m.fx + t * m.vx * 0.3 * agitar) * 240} cy={450 + tri(m.fy + t * m.vy * 0.3 * agitar) * 280} r={11} fill={MONO} />
        ))}
        {acido > 0
          ? [0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={440 + tri(0.17 * k + t * 0.25) * 220} cy={470 + tri(0.29 * k + t * 0.2) * 260} r={7} fill={ACIDO} opacity={acido} />)
          : null}
        {/* Superficie húmeda */}
        <rect x={-300} y={1400} width={1500} height={600} fill="#8A7A6A" />
        {new Array(16).fill(0).map((_, k) => (
          <ellipse key={k} cx={-200 + k * 90} cy={1398} rx={14} ry={7} fill={AGUA} opacity={0.8} />
        ))}
        {/* Gota y plástico que se forma */}
        {cae > 0 && cae < 1 ? <ellipse cx={550} cy={gotaY} rx={26} ry={34} fill="#F8E8A8" opacity={0.9} /> : null}
        {cae >= 1 || final ? (
          <g>
            <ellipse cx={550} cy={1392} rx={150} ry={22} fill={cuaja > 0.6 || final ? "#C8B878" : "#F8E8A8"} opacity={0.95} />
            {new Array(9).fill(0).map((_, k) => {
              const x = 430 + k * 30;
              return k / 9 < cuaja || final ? <line key={k} x1={x} y1={1392} x2={x + 30} y2={1392} stroke={MONO} strokeWidth={8} strokeLinecap="round" /> : <circle key={k} cx={x} cy={1392} r={8} fill={MONO} />;
            })}
          </g>
        ) : null}
        <Pildora x={550} y={1220} texto={`${reloj.toFixed(1).replace(".", ",")} s`} color={C.yellow} o={ventana(-1, T.cianoacrilato) + ventana(T.dispara, T.engancha)} tam={60} />

        {/* Reacción en cadena */}
        <g opacity={cadena}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <g transform="translate(1440 860)">
            <circle r={26} fill={AGUA} />
            <text y={10} textAnchor="middle" fill="#0A1A2A" fontFamily={mono} fontSize={24} fontWeight={700}>
              H2O
            </text>
          </g>
          {new Array(14).fill(0).map((_, k) => {
            const x = 1520 + k * 58;
            const y = 860 + Math.sin(k * 0.9) * 30;
            const unida = k < n;
            return (
              <g key={k}>
                {unida && k > 0 ? <line x1={x - 58} y1={860 + Math.sin((k - 1) * 0.9) * 30} x2={x} y2={y} stroke={MONO} strokeWidth={10} /> : null}
                <circle cx={unida ? x : x + Math.sin(t * 3 + k) * 20} cy={unida ? y : y + 120 + Math.cos(t * 2 + k) * 30} r={18} fill={MONO} opacity={unida ? 1 : 0.6} />
              </g>
            );
          })}
          {/* Grietas que se rellenan */}
          <path d="M 1380 1300 L 1500 1300 L 1530 1220 L 1560 1300 L 1700 1300 L 1740 1180 L 1780 1300 L 1960 1300 L 1990 1240 L 2020 1300 L 2320 1300 L 2320 1440 L 1380 1440 Z" fill="#8A7A6A" />
          <path d="M 1500 1300 L 1530 1220 L 1560 1300 Z M 1700 1300 L 1740 1180 L 1780 1300 Z M 1960 1300 L 1990 1240 L 2020 1300 Z" fill={MONO} opacity={grietas} />
          <rect x={1380} y={1280} width={940} height={20} fill={MONO} opacity={grietas} />
          {piel > 0 ? (
            <text x={1850} y={1130} textAnchor="middle" fill={AGUA} fontFamily={mono} fontSize={36} fontWeight={700} opacity={piel}>
              piel = superficie húmeda
            </text>
          ) : null}
        </g>

        {/* Hospital y despegar */}
        <g opacity={otros}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={2680} y={700} width={840} height={320} rx={30} fill="#E8B898" />
          <path d="M 2800 860 L 3400 860" stroke="#B8484A" strokeWidth={10} strokeDasharray={`${600 * (1 - herida * 0.9)} 600`} />
          <path d="M 2800 860 L 3400 860" stroke={MONO} strokeWidth={22} strokeLinecap="round" opacity={herida * 0.7} />
          <text x={3100} y={960} textAnchor="middle" fill="#5A2A2A" fontFamily={mono} fontSize={34} fontWeight={700} opacity={herida}>
            herida cerrada sin puntos
          </text>
          <g opacity={despega}>
            <rect x={2760} y={1120} width={180} height={240} rx={20} fill="#E8E6F0" opacity={0.35} stroke="#E8E6F0" strokeWidth={4} />
            <text x={2850} y={1260} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={26} fontWeight={700}>
              acetona
            </text>
            <rect x={3160} y={1180} width={300} height={180} rx={20} fill={AGUA} opacity={0.6} />
            {[0, 1, 2, 3].map((k) => (
              <circle key={k} cx={3200 + k * 70} cy={1170 - ((t * 0.6 + k / 4) % 1) * 80} r={18} fill="none" stroke="#FFFFFF" strokeWidth={3} />
            ))}
            <text x={3310} y={1410} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={26} fontWeight={700}>
              agua tibia + jabón
            </text>
          </g>
        </g>
      </g>

      <Tag x={sx(550)} y={sy(600)} dx={-80} dy={-260} texto="moléculas sueltas" color={MONO} o={ventana(T.moleculas, T.bote)} />
      <Tag x={sx(470)} y={sy(500)} dx={-60} dy={-200} texto="ácido" color={ACIDO} o={ventana(T.acido, T.humedad)} />
      <Tag x={sx(400)} y={sy(1398)} dx={-40} dy={-220} texto="humedad" color={AGUA} o={ventana(T.humedad + 0.3, T.engancha)} />
    </svg>
  );
};
