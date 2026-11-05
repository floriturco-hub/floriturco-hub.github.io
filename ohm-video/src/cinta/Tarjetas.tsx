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

  const t1 = sale(T.pegamento, T.fuerzas - 0.1);
  const t2 = sale(T.fuerzas, T.rapido - 0.1);
  const t3 = sale(T.rapido, T.contacto - 0.1);

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
        <Tarjeta alto={340} titulo="el pegamento de la cinta" o={t1}>
          {fila(290, "no reacciona", "no se seca", C.white, T.noReacciona)}
          {fila(355, "sólido y líquido", "como miel espesa", C.yellow, T.medio)}
          {fila(430, "al apretar", "se mete en la rugosidad", C.cyan, T.aprietas)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={340} titulo="lo que lo sujeta" o={t2}>
          {fila(290, "Van der Waals", "atracción entre moléculas", C.cyan, T.vdw)}
          {fila(355, "cada una", "débil", C.white, T.debil)}
          {fila(430, "todas juntas", "miles de millones", C.yellow, T.millones)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={340} titulo="cómo despegar" o={t3}>
          {fila(290, "tirar rápido", "se comporta como sólido", C.red, T.solido)}
          {fila(355, "tirar despacio", "fluye y se suelta", VERDE, T.despacio)}
          {fila(430, "cinta americana", "tela + caucho grueso", C.white, T.malla)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
