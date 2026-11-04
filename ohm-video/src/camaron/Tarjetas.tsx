import { interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";


const Tarjeta: React.FC<{ readonly alto: number; readonly titulo: string; readonly o: number; readonly children: React.ReactNode }> = ({ alto, titulo, o, children }) => (
  <g opacity={o}>
    <rect x={60} y={150} width={960} height={alto} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
    <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>
      {titulo}
    </text>
    {children}
  </g>
);

// Tarjetas superiores (espacio de pantalla)
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);

  const t1 = sale(T.golpe, T.como - 0.1);
  const t2 = sale(T.musculos, T.mazo - 0.1);
  const t3 = sale(T.hierve, T.dos - 0.1);

  const fila = (y: number, izq: string, der: string, color: string, desde: number) => (
    <g opacity={sube(desde)}>
      <text x={110} y={y} fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
        {izq}
      </text>
      <text x={970} y={y} textAnchor="end" fill={color} fontFamily={mono} fontSize={34} fontWeight={700}>
        {der}
      </text>
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={340} titulo="su golpe" o={t1}>
          {fila(290, "acelera como", "una bala", C.yellow, T.bala)}
          {fila(355, "velocidad", "80 km/h", C.red, T.ochenta)}
          {fila(430, "dura", "< 0,003 s", C.cyan, T.menos)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={340} titulo="el truco: una catapulta" o={t2}>
          {fila(290, "músculos", "lentos", C.red, T.musculos)}
          {fila(355, "resorte", "silla de montar", C.yellow, T.silla)}
          {fila(430, "pestillo", "lo suelta de golpe", C.cyan, T.pestillo)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="cavitación" o={t3}>
          {fila(300, "presión muy baja", "el agua hierve", C.cyan, T.hierve)}
          {fila(380, "la burbuja revienta", "luz + miles de °C", C.red, T.revienta)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
