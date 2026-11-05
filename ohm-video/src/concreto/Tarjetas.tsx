import { interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const VERDE = "#48C878";


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

  const t1 = sale(T.cubito, T.porQue - 0.1);
  const t2 = sale(T.viga, T.uno - 0.1);

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
        <Tarjeta alto={290} titulo="el concreto" o={t1}>
          {fila(300, "aplastado", "muy fuerte", VERDE, T.cubito)}
          {fila(380, "estirado", "≈ 10 veces más débil", C.red, T.diez)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={400} titulo="una viga cargada" o={t2}>
          {fila(290, "arriba", "se aplasta: concreto", C.cyan, T.viga)}
          {fila(355, "abajo", "se estira: acero", C.yellow, T.acero)}
          {fila(420, "con el calor", "se dilatan igual", C.white, T.dilatan)}
          {fila(485, "el concreto", "protege al acero", VERDE, T.oxido)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
