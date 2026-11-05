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

  const t1 = sale(T.noPintas, T.antes - 0.1);
  const t2 = sale(T.antes, T.boli - 0.1);
  const t3 = sale(T.boli, T.borrar - 0.1);

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
        <Tarjeta alto={340} titulo="el lápiz" o={t1}>
          {fila(290, "grafito", "escamas sobre las fibras", C.white, T.escamas)}
          {fila(355, "la goma", "pegajosa: el grafito se le pega", "#F088A0", T.pegaMas)}
          {fila(430, "las virutas", "se lo llevan", C.white, T.virutas)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="antes de la goma" o={t2}>
          {fila(300, "miga de pan húmeda", "blanda y pegajosa", C.yellow, T.pan)}
          {fila(380, "1770", "caucho por error", C.orange, T.anio)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="¿y el bolígrafo?" o={t3}>
          {fila(300, "su tinta", "se mete en las fibras", C.purpleLight, T.fibras)}
          {fila(380, "la goma", "no tiene qué levantar", C.red, T.polvoNo)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
