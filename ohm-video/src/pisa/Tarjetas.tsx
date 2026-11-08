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

  const t1 = sale(T.anio, T.vuelca - 0.1);
  const t2 = sale(T.vuelca, T.anio1990 - 0.1);
  const t3 = sale(T.anio1990, T.final - 0.1);

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
        <Tarjeta alto={340} titulo="su historia" o={t1}>
          {fila(290, "1178", "empieza a inclinarse", C.white, T.anio)}
          {fila(355, "≈ 100 años de pausa", "el suelo se afirma", C.cyan, T.pausa)}
          {fila(430, "pisos de arriba", "corregidos: curva", C.yellow, T.torcidos)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="por qué no se cae" o={t2}>
          {fila(300, "centro de gravedad", "cae dentro de la base", VERDE, T.base)}
          {fila(380, "si sale de la base", "se vuelca", C.red, T.saliera)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={340} titulo="el rescate" o={t3}>
          {fila(290, "1990", "≈ 5,5° · al límite", C.red, T.anio1990)}
          {fila(355, "sacan tierra del norte", "se endereza ≈ 40 cm", C.yellow, T.enderezo)}
          {fila(430, "hoy", "≈ 4° · estable", VERDE, T.hoy)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
