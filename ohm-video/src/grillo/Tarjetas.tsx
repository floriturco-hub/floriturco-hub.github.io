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

  const t1 = sale(T.noFabrica - 0.1, T.cantar - 0.1);
  const t2 = sale(T.dolbear + 0.3, T.celsius - 0.1);
  const t3 = sale(T.celsius, T.final - 0.1);

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
        <Tarjeta alto={290} titulo="sin calor propio" o={t1}>
          {fila(300, "su calor", "✗ no lo fabrica", C.red, T.noFabrica)}
          {fila(380, "su cuerpo", "= temperatura del aire", C.cyan, T.cuerpo)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="ley de Dolbear · 1897" o={t2}>
          {fila(300, "°F", "cantos en 14 s + 40", C.yellow, T.dolbear + 0.3)}
          {fila(380, "mejor con", "grillo arborícola nevado", VERDE, T.nevado)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="¿y en Celsius?" o={t3}>
          {fila(300, "cantos en 25 s", "45", C.yellow, T.veinticinco)}
          {fila(380, "÷ 3 + 4", "= 19 °C", C.cyan, T.divide)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
