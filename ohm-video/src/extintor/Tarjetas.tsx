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

  const t1 = sale(T.extintor, T.sarten - 0.1);
  const t2 = sale(T.sarten, T.bola - 0.6);
  const t3 = sale(T.queHacer, T.fin + 0.4);

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
        <Tarjeta alto={340} titulo="el extintor" o={t1}>
          {fila(290, "polvo químico", "cubre el fuego", C.white, T.polvo)}
          {fila(355, "gas a presión", "empuja el polvo", C.cyan, T.gas)}
          {fila(430, "resultado", "sin oxígeno, se apaga", VERDE, T.corta)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={340} titulo="agua + aceite ardiendo" o={t2}>
          {fila(290, "aceite", "más de 300 °C", C.red, T.aceite)}
          {fila(355, "agua", "se hunde y hierve", C.cyan, T.hierve)}
          {fila(430, "vapor", "≈ 1.700 veces más", C.white, T.crece)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={340} titulo="qué hacer" o={t3}>
          {fila(290, "apaga la estufa", "✓", VERDE, T.apaga)}
          {fila(355, "tapa la sartén", "✓", VERDE, T.tapa)}
          {fila(430, "agua", "✗ nunca", C.red, T.sinOxigeno)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
