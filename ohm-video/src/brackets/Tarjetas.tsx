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

  const t1 = sale(T.noPegados, T.brackets - 0.1);
  const t2 = sale(T.unLado, T.avanza - 0.1);
  const t3 = sale(T.avanza, T.fin + 0.4);

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
        <Tarjeta alto={340} titulo="no está pegado" o={t1}>
          {fila(290, "el diente", "cuelga en su hueco", C.white, T.cuelga)}
          {fila(355, "ligamento", "miles de fibras", C.red, T.fibras)}
          {fila(430, "como", "una hamaca", C.yellow, T.hamaca)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="el hueso se rehace" o={t2}>
          {fila(300, "lado que aprieta", "osteoclastos: disuelven", C.purpleLight, T.osteoclastos)}
          {fila(380, "lado que estira", "osteoblastos: construyen", C.cyan, T.osteoblastos)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="el viaje del diente" o={t3}>
          {fila(300, "velocidad", "≈ 1 mm al mes", C.yellow, T.milimetro)}
          {fila(380, "después", "retenedor", C.cyan, T.retenedor)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
