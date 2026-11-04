import { interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const VERDE = "#48C878";
const MIEL = "#E8A830";

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
  const activa = (desde: number, hasta: number) => (t >= desde && t < hasta ? 1 : 0.45);

  const t1 = sale(T.tresDefensas - 0.1, T.cristaliza - 0.1);
  const t2 = sale(T.cristaliza, T.ojo - 0.1);
  const t3 = sale(T.ojo, T.final - 0.1);
  const agua = interpolate(t, [T.setenta, T.veinte + 0.6], [0.7, 0.17], { ...clamp });

  const fila = (y: number, izq: string, der: string, color: string, desde: number, o = 1) => (
    <g opacity={sube(desde) * o}>
      <text x={110} y={y} fill={C.white} fontFamily={mono} fontSize={33} fontWeight={700}>
        {izq}
      </text>
      <text x={970} y={y} textAnchor="end" fill={color} fontFamily={mono} fontSize={33} fontWeight={700}>
        {der}
      </text>
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={330} titulo="las 3 defensas de la miel" o={t1}>
          <g opacity={sube(T.primera) * activa(T.primera, T.segunda)}>
            <text x={110} y={290} fill={C.white} fontFamily={mono} fontSize={33} fontWeight={700}>
              1  casi sin agua
            </text>
            <rect x={560} y={262} width={300} height={36} rx={18} fill={C.cardBorder} />
            <rect x={560} y={262} width={300 * agua} height={36} rx={18} fill="#6AC8F8" />
            <text x={970} y={292} textAnchor="end" fill="#6AC8F8" fontFamily={mono} fontSize={30} fontWeight={700}>
              {Math.round(agua * 100)} %
            </text>
          </g>
          {fila(355, "2  ácida", "≈ zumo de naranja", C.red, T.segunda, activa(T.segunda, T.tercera))}
          {fila(420, "3  una enzima", "agua oxigenada", C.cyan, T.tercera, activa(T.tercera, T.cristaliza))}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="¿cristalizada = podrida?" o={t2}>
          {fila(300, "cristalizada", "✓ se puede comer", VERDE, T.noPudre)}
          {fila(380, "al baño María", "vuelve a líquida", MIEL, T.banoMaria)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="ojo" o={t3}>
          {fila(300, "abierta + humedad", "fermenta → ciérrala", C.yellow, T.ojo + 0.3)}
          {fila(380, "bebés < 1 año", "✗ nunca (botulismo)", C.red, T.bebes)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
