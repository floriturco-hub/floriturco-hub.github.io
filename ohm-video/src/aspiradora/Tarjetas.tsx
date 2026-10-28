import { Easing, interpolate, random } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Moléculas que rebotan dentro de la caja de la primera tarjeta
const CAJA = { x: 330, y: 250, w: 420, h: 190 };
const BOLAS = new Array(16).fill(0).map((_, i) => ({
  x0: random(`bx${i}`),
  y0: random(`by${i}`),
  vx: 0.15 + random(`bvx${i}`) * 0.25,
  vy: 0.15 + random(`bvy${i}`) * 0.25,
}));
// Rebote entre 0 y 1 (onda triangular)
const rebote = (v: number) => {
  const m = ((v % 2) + 2) % 2;
  return m < 1 ? m : 2 - m;
};

const Tarjeta: React.FC<{ readonly alto: number; readonly titulo: string; readonly o: number; readonly children: React.ReactNode }> = ({
  alto,
  titulo,
  o,
  children,
}) => (
  <g opacity={o}>
    <rect x={60} y={150} width={960} height={alto} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
    <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>
      {titulo}
    </text>
    {children}
  </g>
);

// Tarjetas superiores (espacio de pantalla) que acompañan a la escena de la habitación
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

  // 1) El aire solo empuja: moléculas chocando contra las paredes
  const t1 = interpolate(t, [T.noPuede - 0.3, T.noPuede + 0.2, T.columna - 0.4, T.columna], [0, 1, 1, 0], clamp);
  const flechas = interpolate(t, [T.soloEmpuja - 0.1, T.soloEmpuja + 0.4], [0, 1], clamp);

  // 2) Presión atmosférica: cuenta de 0 a 1 kg por cm²
  const t2 = interpolate(t, [T.pesa + 0.4, T.pesa + 0.8, T.ventilador - 0.4, T.ventilador], [0, 1, 1, 0], clamp);
  const kilo = interpolate(t, [T.pesa + 0.8, T.kilo + 0.2], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // 3) Medidor: dentro baja al 80 %
  const t3 = interpolate(t, [T.menosAire - 0.3, T.menosAire + 0.2, T.empujones - 0.3, T.empujones], [0, 1, 1, 0], clamp);
  const dentro = interpolate(t, [T.menosAire, T.veinte + 0.3], [100, 80], suave);

  // 4) Empuje sobre la boquilla tapada: cuenta de 0 a 2 kg
  const t4 = interpolate(t, [T.diezCm - 0.3, T.diezCm + 0.2, T.mano - 0.4, T.mano], [0, 1, 1, 0], clamp);
  const dos = interpolate(t, [T.diezCm, T.dosKilos + 0.3], [0, 2], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={340} titulo="el aire, de cerca" o={t1}>
          <rect x={CAJA.x} y={CAJA.y} width={CAJA.w} height={CAJA.h} rx={12} fill="none" stroke={C.white} strokeWidth={3} opacity={0.6} />
          {BOLAS.map((b, i) => (
            <circle
              key={i}
              cx={CAJA.x + 14 + rebote(b.x0 + t * b.vx * 3) * (CAJA.w - 28)}
              cy={CAJA.y + 14 + rebote(b.y0 + t * b.vy * 3) * (CAJA.h - 28)}
              r={9}
              fill={C.white}
            />
          ))}
          {/* Empujan hacia fuera en todas direcciones */}
          <g opacity={flechas} stroke={C.yellow} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d={`M ${CAJA.x - 20} 345 L ${CAJA.x - 80} 345 M ${CAJA.x - 60} 325 L ${CAJA.x - 82} 345 L ${CAJA.x - 60} 365`} />
            <path d={`M ${CAJA.x + CAJA.w + 20} 345 L ${CAJA.x + CAJA.w + 80} 345 M ${CAJA.x + CAJA.w + 60} 325 L ${CAJA.x + CAJA.w + 82} 345 L ${CAJA.x + CAJA.w + 60} 365`} />
          </g>
          <text x={540} y={470} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={30} fontWeight={700} opacity={flechas}>
            chocan y empujan
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={330} titulo="presión atmosférica" o={t2}>
          <text x={110} y={355} fill={C.yellow} fontFamily={mono} fontSize={110} fontWeight={700}>
            {kilo.toFixed(1).replace(".", ",")} kg
          </text>
          <text x={560} y={340} fill={C.white} fontFamily={mono} fontSize={38} fontWeight={700}>
            por cada cm²
          </text>
          <rect x={940} y={300} width={38} height={38} fill="none" stroke={C.white} strokeWidth={3} />
          <text x={110} y={440} fill={C.grey} fontFamily={mono} fontSize={24}>
            101 kPa al nivel del mar
          </text>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={420} titulo="presión del aire" o={t3}>
          {[
            { x: 300, nombre: "fuera", v: 100, color: C.yellow },
            { x: 700, nombre: "dentro", v: dentro, color: C.cyan },
          ].map((b) => (
            <g key={b.nombre}>
              <rect x={b.x - 40} y={250} width={80} height={200} rx={14} fill="none" stroke={C.cardBorder} strokeWidth={3} />
              <rect x={b.x - 40} y={250 + 200 * (1 - b.v / 100)} width={80} height={200 * (b.v / 100)} rx={14} fill={b.color} opacity={0.85} />
              <text x={b.x + 70} y={300} fill={b.color} fontFamily={mono} fontSize={48} fontWeight={700}>
                {Math.round(b.v)} %
              </text>
              <text x={b.x + 70} y={350} fill={C.grey} fontFamily={mono} fontSize={30}>
                {b.nombre}
              </text>
            </g>
          ))}
          <line x1={240} y1={250} x2={780} y2={250} stroke={C.white} strokeWidth={2} strokeDasharray="8 8" opacity={0.4} />
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={330} titulo="empuje sobre la boquilla" o={t4}>
          <text x={110} y={355} fill={C.yellow} fontFamily={mono} fontSize={110} fontWeight={700}>
            {dos.toFixed(1).replace(".", ",")} kg
          </text>
          <text x={110} y={440} fill={C.grey} fontFamily={mono} fontSize={24}>
            20 kPa de diferencia × 10 cm² ≈ 20 N
          </text>
        </Tarjeta>
      ) : null}
    </svg>
  );
};
