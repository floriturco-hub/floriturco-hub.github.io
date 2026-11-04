import { interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const VERDE = "#48C878";
const COBRE = "#E8A040";

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

  const t1 = sale(T.resistencia - 0.2, T.corriente - 0.1);
  const t2 = sale(T.corriente, T.atraviesa - 0.1);
  const t3 = sale(T.calor, T.ollas - 0.1);
  const t4 = sale(T.ollas, T.final - 0.1);

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
        <Tarjeta alto={290} titulo="bajo el vidrio hay…" o={t1}>
          {fila(300, "resistencia al rojo", "✗ no", C.red, T.resistencia)}
          {fila(380, "bobina de cobre", "✓ sí", COBRE, T.bobina)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="corriente alterna" o={t2}>
          {fila(300, "cambia de sentido", "→ ← → ←", C.yellow, T.cambia)}
          {fila(380, "veces por segundo", "decenas de miles", C.cyan, T.decenas)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={340} titulo="¿quién se calienta?" o={t3}>
          {fila(290, "sartén", "se calienta sola", "#E8603A", T.misma)}
          {fila(355, "vidrio", "solo tibio", C.cyan, T.vidrioNo)}
          {fila(430, "recién apagada", "✗ no tocar", C.yellow, T.noToques)}
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={290} titulo="¿sirve tu olla?" o={t4}>
          {fila(300, "hierro / acero", "✓ sirve", VERDE, T.ollas)}
          {fila(380, "aluminio / vidrio", "✗ no calienta", C.red, T.iman + 0.6)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
