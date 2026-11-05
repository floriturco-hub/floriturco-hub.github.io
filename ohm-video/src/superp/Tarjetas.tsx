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

  const t1 = sale(T.moleculas, T.engancha - 0.1);
  const t2 = sale(T.engancha, T.hospitales - 0.1);
  const t3 = sale(T.hospitales, T.activa - 0.1);

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
        <Tarjeta alto={340} titulo="en el bote" o={t1}>
          {fila(290, "cianoacrilato", "moléculas sueltas", C.orange, T.moleculas)}
          {fila(355, "un poco de ácido", "las mantiene quietas", C.red, T.acido)}
          {fila(430, "con humedad", "¡se disparan!", C.cyan, T.humedad)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={340} titulo="la reacción" o={t2}>
          {fila(290, "una se engancha a otra", "cadena larguísima", C.orange, T.engancha)}
          {fila(355, "resultado", "plástico sólido", C.white, T.plastico)}
          {fila(430, "tus dedos", "están húmedos", C.cyan, T.humedos)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="más" o={t3}>
          {fila(300, "hospitales", "cierra heridas", VERDE, T.hospitales)}
          {fila(380, "para despegar", "agua tibia o acetona", C.cyan, T.despegar)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
