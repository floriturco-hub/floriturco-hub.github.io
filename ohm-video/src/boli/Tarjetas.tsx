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

  const t1 = sale(T.punta, T.tinta - 0.1);
  const t2 = sale(T.escribir, T.agujerito - 0.1);
  const t3 = sale(T.agujerito, T.final - 0.1);

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
        <Tarjeta alto={290} titulo="la punta" o={t1}>
          {fila(300, "bola de metal", "< 1 mm", C.white, T.punta)}
          {fila(380, "hace de", "tapón", C.yellow, T.tapon)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={340} titulo="al escribir" o={t2}>
          {fila(290, "la bola rueda", "se moja arriba", C.cyan, T.rueda)}
          {fila(355, "gira y", "deja la tinta abajo", C.yellow, T.gira)}
          {fila(430, "sin rodar", "no sale tinta", C.red, T.noRueda)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="el resto" o={t3}>
          {fila(300, "agujerito", "entra aire, no hay vacío", C.cyan, T.aire)}
          {fila(380, "László Bíró", "1938", C.yellow, T.anio)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
