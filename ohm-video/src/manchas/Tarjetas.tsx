import { interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const VERDE = "#48C878";

const Tarjeta: React.FC<{ readonly alto: number; readonly titulo: string; readonly o: number; readonly borde?: string; readonly children: React.ReactNode }> = ({ alto, titulo, o, borde, children }) => (
  <g opacity={o}>
    <rect x={60} y={150} width={960} height={alto} rx={24} fill={C.card} stroke={borde ?? C.cardBorder} strokeWidth={borde ? 4 : 2} />
    <text x={110} y={215} fill={borde ?? C.grey} fontFamily={mono} fontSize={30}>
      {titulo}
    </text>
    {children}
  </g>
);

// Muestra pequeña: una mancha sobre un fondo liso (se ve) o sobre un fondo con dibujo (se esconde)
const Muestra: React.FC<{ readonly x: number; readonly liso: boolean; readonly t: number }> = ({ x, liso, t }) => (
  <g>
    <defs>
      <clipPath id={`muestra-${liso ? "a" : "b"}`}>
        <rect x={x} y={250} width={400} height={160} rx={16} />
      </clipPath>
    </defs>
    <g clipPath={`url(#muestra-${liso ? "a" : "b"})`}>
      <rect x={x} y={250} width={400} height={160} fill={liso ? "#6AAEE6" : "#6A5A48"} />
      {liso
        ? null
        : new Array(14).fill(0).map((_, i) => (
            <rect key={i} x={x + (i % 7) * 60 - 10} y={250 + Math.floor(i / 7) * 80 + (i % 2) * 20} width={44} height={50} rx={6} fill={i % 3 === 0 ? "#8A7050" : i % 3 === 1 ? "#4A3A2A" : "#A88A60"} />
          ))}
      <path
        d={`M ${x + 120} ${330 + Math.sin(t) * 6} C ${x + 160} ${290}, ${x + 200} ${370}, ${x + 240} ${320} S ${x + 290} ${300}, ${x + 300} ${330}`}
        fill="none"
        stroke="rgba(30,40,60,0.38)"
        strokeWidth={12}
        strokeLinecap="round"
      />
    </g>
    <text x={x + 200} y={450} textAnchor="middle" fill={liso ? VERDE : C.grey} fontFamily={mono} fontSize={30} fontWeight={700}>
      {liso ? "se notan" : "se esconden"}
    </text>
  </g>
);

// Tarjetas superiores (espacio de pantalla)
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);
  const llena = (desde: number) => interpolate(t, [desde, desde + 1.0], [0, 1], clamp);

  const t1 = sale(T.agua - 0.1, T.anos - 0.1);
  const t2 = sale(T.anos, T.noVes - 0.1);
  const t3 = sale(T.porEso + 0.2, T.porQue - 0.1);
  const t4 = sale(T.llaman - 0.1, T.pero - 0.2);
  const t5 = sale(T.pero - 0.1, T.final - 0.1);

  const fila = (y: number, izq: string, der: string, color: string, desde: number, colorIzq: string = C.white) => (
    <g opacity={sube(desde)}>
      <text x={110} y={y} fill={colorIzq} fontFamily={mono} fontSize={36} fontWeight={700}>
        {izq}
      </text>
      <text x={970} y={y} textAnchor="end" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {der}
      </text>
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={290} titulo="humor vítreo" o={t1}>
          <g opacity={sube(T.agua)}>
            <text x={110} y={300} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
              agua
            </text>
            <rect x={330} y={272} width={480} height={36} rx={18} fill={C.cardBorder} />
            <rect x={330} y={272} width={480 * 0.99 * llena(T.agua)} height={36} rx={18} fill={C.cyan} />
            <text x={970} y={300} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={40} fontWeight={700}>
              ≈ 99 %
            </text>
          </g>
          {fila(385, "fibras de colágeno", "la red", C.cyan, T.fibras)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="con los años" o={t2}>
          {fila(300, "el gel", "se licúa", C.yellow, T.licuando)}
          {fila(385, "las fibras", "grumos y hebras", C.yellow, T.grumos)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={340} titulo="¿cuándo se notan más?" o={t3}>
          <g opacity={sube(T.porEso + 0.2)}>
            <Muestra x={100} liso t={t} />
          </g>
          <g opacity={sube(T.pared)}>
            <Muestra x={580} liso={false} t={t} />
          </g>
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={330} titulo="se llaman" o={t4}>
          <text x={110} y={310} fill={C.yellow} fontFamily={mono} fontSize={64} fontWeight={700}>
            miodesopsias
          </text>
          <text x={110} y={375} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700} opacity={sube(T.moscas)}>
            o «moscas volantes»
          </text>
          <text x={110} y={440} fill={VERDE} fontFamily={mono} fontSize={36} fontWeight={700} opacity={sube(T.todos)}>
            casi todos las tienen ✓
          </text>
        </Tarjeta>
      ) : null}

      {t5 > 0 ? (
        <Tarjeta alto={420} titulo="señales de alarma" o={t5} borde={C.red}>
          {fila(290, "muchas de golpe", "!", C.red, T.golpe)}
          {fila(350, "destellos de luz", "!", C.red, T.destellos)}
          {fila(410, "cortina oscura", "!", C.red, T.cortina)}
          <text x={110} y={480} fill={C.yellow} fontFamily={mono} fontSize={36} fontWeight={700} opacity={sube(T.oftalmo)}>
            → oftalmólogo el mismo día
          </text>
          <text x={110} y={540} fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700} opacity={sube(T.desgarro)}>
            puede ser un desgarro de retina
          </text>
        </Tarjeta>
      ) : null}
    </svg>
  );
};
