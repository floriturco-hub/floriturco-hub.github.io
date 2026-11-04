import { Easing, interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la piel vista desde arriba con el moretón y su calendario de colores; en el centro, la piel
// en corte (golpe, vasos rotos, sangre roja que se oscurece); a la derecha, un macrófago que desarma la sangre
// (hemo → biliverdina verde → bilirrubina amarilla; hierro → pigmento marrón).
const PIEL = "#E0B090";
const ETAPAS: { dia: number; color: string; nombre: string }[] = [
  { dia: 0, color: "#D8303A", nombre: "rojo" },
  { dia: 2, color: "#5A2A8A", nombre: "morado" },
  { dia: 6, color: "#6A9A3A", nombre: "verde" },
  { dia: 9, color: "#D8C040", nombre: "amarillo" },
  { dia: 12, color: "#8A6A3A", nombre: "marrón" },
  { dia: 14, color: PIEL, nombre: "" },
];
const hex = (s: string) => [0, 1, 2].map((i) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16));
const mezcla = (a: string, b: string, p: number) => {
  const A = hex(a);
  const B2 = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B2[i] - v) * p)).join(", ")})`;
};
const colorDia = (d: number) => {
  for (let i = 0; i < ETAPAS.length - 1; i++) {
    if (d <= ETAPAS[i + 1].dia) {
      return mezcla(ETAPAS[i].color, ETAPAS[i + 1].color, (d - ETAPAS[i].dia) / (ETAPAS[i + 1].dia - ETAPAS[i].dia));
    }
  }
  return PIEL;
};

const GLOBULOS = new Array(26).fill(0).map((_, i) => ({ a: random(`ga${i}`) * Math.PI * 2, r: 30 + random(`gr${i}`) * 230, f: random(`gf${i}`) }));
const MANCHA = new Array(24).fill(0).map((_, i) => 1 + (random(`m${i}`) - 0.5) * 0.25);

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1050, 1.15],
  [T.golpe - 0.3, 550, 1050, 1.18],
  [T.golpe + 0.4, 1850, 1030, 1.0],
  [T.macrofagos - 0.3, 1850, 1030, 1.02],
  [T.macrofagos + 0.5, 3100, 1030, 1.0],
  [T.cada - 0.3, 3100, 1030, 1.02],
  [T.cada + 0.5, 550, 1050, 1.15],
  [T.fin + 2, 550, 1050, 1.2],
];

export const MoretonMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Piel desde arriba: en el gancho recorre todos los colores; al final avanza por los días
  const dia = t < T.cada ? (t * 7) % 14 : interpolate(t, [T.cada + 0.3, T.dice + 1.6], [0, 13], clamp);
  const colorMancha = colorDia(dia);
  const mancha = `M ${MANCHA.map((k, i) => {
    const a = (i / MANCHA.length) * Math.PI * 2;
    return `${550 + Math.cos(a) * 230 * k} ${950 + Math.sin(a) * 180 * k}`;
  }).join(" L ")} Z`;

  // Corte de la piel
  const corte = ventana(T.golpe - 0.2, T.macrofagos + 0.3, 0.5, 0.6);
  const impacto = interpolate(t, [T.golpe, T.golpe + 0.25], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const rebota = interpolate(t, [T.golpe + 0.25, T.golpe + 0.8], [0, 1], clamp);
  const rotos = t > T.golpe + 0.25 ? 1 : 0;
  const fuga = interpolate(t, [T.vasos, T.roja], [0, 1], clamp);
  const oscuro = interpolate(t, [T.horas, T.oscurece + 0.8], [0, 1], clamp);
  const colorSangre = mezcla("#E8303A", "#4A1A5A", oscuro);
  const vistaArriba = mezcla("#D8303A", "#4A3A8A", interpolate(t, [T.horas, T.azul], [0, 1], clamp));

  // Macrófago y química
  const macro = ventana(T.macrofagos - 0.3, T.cada + 0.3, 0.6, 0.6);
  const come = interpolate(t, [T.comen - 0.4, T.paso + 0.2], [0, 1], clamp);
  const hemo = interpolate(t, [T.primero, T.primero + 0.4], [0, 1], clamp);
  const bili = interpolate(t, [T.biliverdina - 0.2, T.biliverdina + 0.3], [0, 1], clamp);
  const bilir = interpolate(t, [T.bilirrubina - 0.2, T.bilirrubina + 0.3], [0, 1], clamp);
  const hierro = interpolate(t, [T.hierro - 0.1, T.marron], [0, 1], clamp);
  const recicla = interpolate(t, [T.recicla, T.cada - 0.2], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  const molecula = (x: number, y: number, color: string, texto: string, o: number, anillo = true) =>
    o > 0 ? (
      <g opacity={o} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * o})`}>
        {anillo ? <polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill="none" stroke={color} strokeWidth={12} /> : <circle r={50} fill={color} />}
        <text y={110} textAnchor="middle" fill={color} fontFamily={mono} fontSize={30} fontWeight={700}>
          {texto}
        </text>
      </g>
    ) : null;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Piel desde arriba */}
        <rect x={-300} y={-400} width={1700} height={2400} fill="#1E1A3A" opacity={0.5} />
        <rect x={60} y={520} width={980} height={880} rx={60} fill={PIEL} />
        {new Array(40).fill(0).map((_, i) => (
          <circle key={i} cx={100 + random(`p${i}`) * 900} cy={560 + random(`q${i}`) * 800} r={3} fill="#C89878" opacity={0.6} />
        ))}
        <path d={mancha} fill={colorMancha} opacity={0.85} />
        <path d={mancha} fill={colorMancha} opacity={0.4} transform="translate(550 950) scale(1.18) translate(-550 -950)" />
        {/* Calendario de colores */}
        <g transform="translate(110 1470)">
          {ETAPAS.slice(0, 5).map((e, i) => (
            <g key={e.dia}>
              <rect x={i * 176} y={0} width={160} height={60} rx={14} fill={e.color} stroke={C.white} strokeWidth={dia >= e.dia && (i === 4 || dia < ETAPAS[i + 1].dia) ? 6 : 0} />
              <text x={i * 176 + 80} y={100} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={26}>
                {`día ${e.dia === 0 ? "0" : e.dia}`}
              </text>
            </g>
          ))}
        </g>
        <Pildora x={550} y={430} texto={`día ${Math.floor(dia)}`} color={C.white} o={1} tam={44} />

        {/* Piel en corte */}
        <g opacity={corte}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {/* Color visto desde arriba */}
          <rect x={1380} y={640} width={940} height={50} rx={14} fill={t > T.vasos ? vistaArriba : PIEL} opacity={0.9} />
          <text x={1850} y={676} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={26} fontWeight={700}>
            visto desde arriba
          </text>
          <rect x={1380} y={760} width={940} height={90} fill={PIEL} />
          <rect x={1380} y={850} width={940} height={570} fill="#D8A0A0" />
          {/* Capilares (uno se rompe) */}
          {[960, 1140, 1300].map((y, k) => (
            <g key={y}>
              <rect x={1380} y={y} width={k === 1 && rotos ? 400 : 940} height={30} rx={15} fill="#B8303A" />
              {k === 1 && rotos ? <rect x={1920} y={y} width={400} height={30} rx={15} fill="#B8303A" /> : null}
            </g>
          ))}
          {/* Sangre que se escapa */}
          {fuga > 0
            ? GLOBULOS.map((g, i) => (
                <ellipse key={i} cx={1850 + Math.cos(g.a) * g.r * fuga} cy={1155 + Math.sin(g.a) * g.r * 0.6 * fuga} rx={18} ry={11} fill={colorSangre} />
              ))
            : null}
          {/* Golpe */}
          {impacto > 0 && rebota < 1 ? (
            <g transform={`translate(1850 ${560 + 180 * impacto - 200 * rebota})`} opacity={1 - rebota}>
              <circle r={70} fill="#E8E6F0" />
              <path d="M -60 -120 l 0 -40 M 0 -130 l 0 -50 M 60 -120 l 0 -40" stroke="#E8E6F0" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
            </g>
          ) : null}
          {rotos && rebota < 1 ? <circle cx={1850} cy={1155} r={120 * rebota} fill="none" stroke={C.yellow} strokeWidth={8} opacity={1 - rebota} /> : null}
        </g>
        <Pildora x={1850} y={1360} texto="hemoglobina + O2" color={C.red} o={ventana(T.hemoglobina, T.horas)} tam={36} />
        <Pildora x={1850} y={1360} texto="sin oxígeno" color="#A87AE8" o={ventana(T.oscurece, T.macrofagos)} tam={36} />

        {/* Macrófago */}
        <g opacity={macro}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <path
            d={`M 2700 1030 C 2700 ${780 + Math.sin(t * 2) * 20}, 2950 700, 3150 720 C 3400 740, ${3520 + Math.sin(t * 2.4) * 20} 860, 3500 1040 C 3480 1240, 3300 1380, 3100 1370 C 2880 1360, 2700 1250, 2700 1030 Z`}
            fill="#3A2A5A"
            stroke="#8A6AC8"
            strokeWidth={8}
          />
          <circle cx={3320} cy={1220} r={60} fill="#5A4A8A" />
          {/* Glóbulos que entran y desaparecen */}
          {GLOBULOS.slice(0, 10).map((g, i) => {
            const p = Math.min(1, Math.max(0, come * 1.6 - g.f * 0.6));
            return p < 1 ? <ellipse key={i} cx={2640 + p * 340 + (i % 3) * 20} cy={860 + i * 40} rx={18} ry={11} fill="#4A1A5A" opacity={1 - p * 0.9} /> : null;
          })}
          {/* Cadena: hemo → biliverdina → bilirrubina; hierro → pigmento marrón */}
          {molecula(2880, 950, "#D8303A", "hemo", hemo * (1 - recicla))}
          {bili > 0 ? <path d="M 2950 950 L 3030 950 m -18 -14 l 18 14 l -18 14" fill="none" stroke={C.grey} strokeWidth={5} opacity={1 - recicla} /> : null}
          {molecula(3100, 950, "#6A9A3A", "biliverdina", bili * (1 - recicla))}
          {bilir > 0 ? <path d="M 3170 950 L 3250 950 m -18 -14 l 18 14 l -18 14" fill="none" stroke={C.grey} strokeWidth={5} opacity={1 - recicla} /> : null}
          {molecula(3320, 950, "#D8C040", "bilirrubina", bilir * (1 - recicla))}
          {molecula(2900, 1210, "#B08850", "hierro: marrón", hierro * (1 - recicla), false)}
          {hierro > 0 ? (
            <text x={2900} y={1222} textAnchor="middle" fill="#F8E8C8" fontFamily={mono} fontSize={36} fontWeight={700} opacity={1 - recicla}>
              Fe
            </text>
          ) : null}
          <text x={3100} y={1300} textAnchor="middle" fill="#48C878" fontFamily={mono} fontSize={44} fontWeight={700} opacity={recicla}>
            ✓ reciclado
          </text>
        </g>
      </g>

      <Tag x={sx(1850)} y={sy(1155)} dx={-200} dy={-260} texto="vaso roto" color="#E8414F" o={ventana(T.vasos, T.sangre + 0.6)} />
      <Tag x={sx(2780)} y={sy(1030)} dx={60} dy={-300} texto="macrófago" color="#A87AE8" o={ventana(T.macrofagos + 0.3, T.primero)} />
    </svg>
  );
};
