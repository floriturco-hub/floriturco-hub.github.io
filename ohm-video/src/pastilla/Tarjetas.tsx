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

  const t1 = sale(T.donde, T.fabricarlas - 0.1);
  const t2 = sale(T.fabricarlas, T.resto - 0.1);
  const t3 = sale(T.resto, T.noApunta - 0.1);

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
        <Tarjeta alto={290} titulo="donde algo se irrita" o={t1}>
          {fila(300, "prostaglandinas", "se fabrican", C.orange, T.prosta)}
          {fila(380, "nervios del dolor", "gritan más", C.yellow, T.griten)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="el bloqueo" o={t2}>
          {fila(300, "enzima COX", "fabrica prostaglandinas", C.purpleLight, T.cox)}
          {fila(380, "ibuprofeno", "la tapa", C.cyan, T.bloquea)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="¿dónde se nota?" o={t3}>
          {fila(300, "resto del cuerpo", "nada que tapar", C.grey, T.resto)}
          {fila(380, "donde duele", "se baja el volumen", VERDE, T.volumen)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
