import { interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const VERDE = "#48C878";
const PELO = "#F0E0A0";

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

  const t1 = sale(T.noCerebro - 0.1, T.dobla - 0.1);
  const t2 = sale(T.dobla, T.unSolo - 0.1);
  const t3 = sale(T.sinMusculos, T.insecto - 0.1);
  const t4 = sale(T.insecto, T.noPiensa - 0.1);

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
        <Tarjeta alto={290} titulo="sin cerebro ni músculos" o={t1}>
          {fila(300, "cerebro, nervios", "✗ no tiene", C.red, T.noCerebro)}
          {fila(380, "pelos sensores", "3 por lóbulo", PELO, T.tres)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="el pelo se dobla" o={t2}>
          {fila(300, "señal eléctrica", "recorre la hoja", C.yellow, T.senal)}
          {fila(380, "igual que en", "tus nervios", C.cyan, T.nervios)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={340} titulo="¿y sin músculos?" o={t3}>
          {fila(290, "hojas curvadas", "tensas", C.yellow, T.curvadas)}
          {fila(355, "el agua se mueve", "la curva se invierte", "#6AC8F8", T.agua)}
          {fila(430, "cierre", "0,1 s", C.red, T.salta)}
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={290} titulo="sigue contando" o={t4}>
          {fila(300, "2 toques", "se cierra", VERDE, T.insecto)}
          {fila(380, "5 toques", "empieza a digerir", "#C8E848", T.cinco)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
