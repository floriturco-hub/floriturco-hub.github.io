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

  const t1 = sale(T.noPresion - 0.2, T.rejilla - 0.1);
  const t2 = sale(T.dedo, T.salchicha2 - 0.1);
  const t3 = sale(T.salchicha2, T.puntaLapiz - 0.1);
  const t4 = sale(T.porEso - 0.1, T.final - 0.1);

  const fila = (y: number, izq: string, der: string, color: string, desde: number) => (
    <g opacity={sube(desde)}>
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
        <Tarjeta alto={290} titulo="¿qué detecta la pantalla?" o={t1}>
          {fila(300, "presión", "✗ no", C.red, T.noPresion)}
          {fila(380, "electricidad", "✓ sí", VERDE, T.electricidad)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="tu dedo" o={t2}>
          {fila(300, "agua con sal", "conduce ✓", VERDE, T.sal)}
          {fila(380, "se lleva parte del campo", "cruce detectado", C.yellow, T.acercarlo)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="la salchicha" o={t3}>
          {fila(300, "agua con sal", "conduce ✓", VERDE, T.salchicha2 + 0.6)}
          {fila(380, "Corea, en invierno", "móvil con guantes", C.cyan, T.corea)}
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={290} titulo="la solución" o={t4}>
          {fila(300, "guante táctil", "hilos conductores", VERDE, T.hilos)}
          {fila(380, "lápiz táctil", "punta de goma conductora", VERDE, T.goma)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
