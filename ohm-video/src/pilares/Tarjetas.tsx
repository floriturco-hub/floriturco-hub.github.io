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

  const t1 = sale(T.clavan, T.bombean - 0.1);
  const t2 = sale(T.profunda, T.concreto - 0.1);
  const t3 = sale(T.concreto, T.terminar - 0.1);

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
        <Tarjeta alto={290} titulo="la ataguía" o={t1}>
          {fila(300, "láminas de acero", "encajan entre sí", C.white, T.laminas)}
          {fila(380, "muro cerrado", "rodea el pilar", C.yellow, T.muro)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="el cajón neumático" o={t2}>
          {fila(300, "cajón sin fondo", "se hunde", C.white, T.cajon)}
          {fila(380, "aire a presión", "saca el agua", C.cyan, T.aire)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="concreto bajo el agua" o={t3}>
          {fila(300, "por un tubo", "hasta el fondo", C.white, T.tubo)}
          {fila(380, "más pesado", "empuja el agua arriba", C.cyan, T.pesado)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
