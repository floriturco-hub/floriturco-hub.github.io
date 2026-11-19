import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";

// Tarjeta con la curva de descarga de una celda de ion-litio
const CARD = { x: 60, y: 430, w: 960, h: 1000 };
const OX = CARD.x + 150;
const OY = CARD.y + CARD.h - 130;
const ANCHO = CARD.w - 210;
const ALTO = CARD.h - 260;
const V_MIN = 2.4;
const V_MAX = 4.35;
const FIN_TELEFONO = 0.82; // fracción del eje donde el celular marca 0 % y se apaga

// c = carga que ve el celular (1 → 0). Meseta larga y caída final
const voltaje = (c: number) => {
  if (c > 0.9) {
    return 3.95 + ((c - 0.9) / 0.1) * 0.25;
  }
  if (c > 0.12) {
    return 3.62 + ((c - 0.12) / 0.78) * 0.33;
  }
  return 3.0 + 0.62 * Math.sqrt(Math.max(0, c) / 0.12);
};
// Más allá del apagado: la química seguiría bajando hasta dañarse
const voltajeExtra = (u: number) => 3.0 - 0.55 * Math.sqrt(u);

const X = (c: number) => OX + (1 - c) * ANCHO * FIN_TELEFONO;
const XExtra = (u: number) => OX + ANCHO * (FIN_TELEFONO + (1 - FIN_TELEFONO) * u);
const Y = (v: number) => OY - ((v - V_MIN) / (V_MAX - V_MIN)) * ALTO;

type Props = {
  readonly t0: number;
  readonly fase: "descarga" | "apagado";
};

export const Curva: React.FC<Props> = ({ t0, fase }) => {
  const t = useT(t0);
  const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const descarga = fase === "descarga";

  // Carga del punto, sincronizada con "Llena 4,2… cerca de 3,7… y al final cae en picado"
  const c = descarga
    ? interpolate(t, [34.6, 36.84, 39.4, 40.9], [1, 0.9, 0.12, 0], suave)
    : interpolate(t, [48.42, 49.4], [0.12, 0.01], suave);

  const puntos: string[] = [];
  const cTrazo = descarga ? c : 0;
  for (let k = 1; k >= cTrazo - 1e-6; k -= 0.005) {
    puntos.push(`${X(k).toFixed(1)},${Y(voltaje(k)).toFixed(1)}`);
  }
  const extra = descarga ? 0 : interpolate(t, [53.78, 54.9], [0, 1], suave);
  const puntosExtra: string[] = [];
  for (let u = 0; u <= extra + 1e-6; u += 0.02) {
    puntosExtra.push(`${XExtra(u).toFixed(1)},${Y(voltajeExtra(u)).toFixed(1)}`);
  }
  const corte = descarga ? 0 : interpolate(t, [50.74, 51.4], [0, 1], suave);

  // Cámara: en "apagado" se acerca al final de la curva
  const zoom = descarga ? interpolate(t, [34.4, 41.4], [1, 1.04]) : interpolate(t, [48.3, 49.3], [1, 1.35], suave);
  const foco = descarga ? 0 : interpolate(t, [48.3, 49.3], [0, 1], suave);
  const cx = 540 + (X(0) - 60 - 540) * foco;
  const cy = 960 + (Y(3.1) - 960) * foco;

  const vPunto = voltaje(c);
  const marcas = [
    { v: 4.2, desde: 35.26 },
    { v: 3.7, desde: 38.76 },
    { v: 3.0, desde: descarga ? 40.3 : 0 },
  ];

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <line x1={OX} y1={OY} x2={OX + ANCHO} y2={OY} stroke={C.grey} strokeWidth={3} opacity={0.6} />
        <line x1={OX} y1={OY} x2={OX} y2={OY - ALTO - 20} stroke={C.grey} strokeWidth={3} opacity={0.6} />
        <text x={OX - 20} y={CARD.y + 80} fill={C.yellow} fontFamily={mono} fontSize={34} fontWeight={700}>voltaje</text>
        <text x={OX} y={OY + 60} fill={C.grey} fontFamily={mono} fontSize={30}>100 %</text>
        <text x={X(0)} y={OY + 60} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>0 %</text>
        <text x={OX + ANCHO / 2} y={OY + 105} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28}>carga que marca el celular</text>
        {marcas.map((m) => {
          const o = interpolate(t, [m.desde, m.desde + 0.4], [0, 1], clamp);
          return (
            <g key={m.v} opacity={o}>
              <line x1={OX} y1={Y(m.v)} x2={OX + ANCHO} y2={Y(m.v)} stroke={C.grey} strokeWidth={2} strokeDasharray="8 10" opacity={0.4} />
              <text x={OX - 16} y={Y(m.v) + 11} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>
                {m.v.toFixed(1).replace(".", ",")}
              </text>
            </g>
          );
        })}
        {/* Zona protegida tras el apagado */}
        {extra > 0 ? (
          <g>
            <rect x={X(0)} y={Y(3.0)} width={ANCHO * (1 - FIN_TELEFONO)} height={OY - Y(3.0)} fill={C.red} opacity={0.12 * extra} />
            <polyline points={puntosExtra.join(" ")} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="14 10" opacity={0.8} />
            <text x={XExtra(0.5)} y={OY - 30} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={26} fontWeight={700} opacity={extra}>
              daño
            </text>
          </g>
        ) : null}
        {corte > 0 ? (
          <g opacity={corte}>
            <line x1={OX} y1={Y(3.0)} x2={OX + (ANCHO + 10) * corte} y2={Y(3.0)} stroke={C.red} strokeWidth={6} />
            <text x={X(0) - 20} y={Y(3.0) + 50} textAnchor="end" fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700}>
              apagado
            </text>
          </g>
        ) : null}
        <polyline points={puntos.join(" ")} fill="none" stroke={C.yellow} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={X(c)} cy={Y(vPunto)} r={18} fill={c < 0.12 ? C.red : C.white} />
        <text x={X(c) + (descarga ? -28 : -30)} y={Y(vPunto) - 34} textAnchor={descarga ? "middle" : "end"} fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
          {descarga ? `${vPunto.toFixed(1).replace(".", ",")} V` : "1 %"}
        </text>
      </g>
    </svg>
  );
};
