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

  const t1 = sale(T.dentro, T.columnas - 0.1);
  const t2 = sale(T.pasas, T.quitar - 0.1);
  const t3 = sale(T.aguja, T.robar - 0.1);

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
        <Tarjeta alto={340} titulo="dentro del broche" o={t1}>
          {fila(290, "bobina", "alambre enrollado", C.orange, T.bobina)}
          {fila(355, "condensador", "dos placas", C.white, T.condensador)}
          {fila(430, "pila", "✗ ninguna", C.red, T.noPila)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={340} titulo="cómo te descubre" o={t2}>
          {fila(290, "la puerta", "lanza ondas de radio", C.cyan, T.pasas)}
          {fila(355, "el broche", "resuena y responde", C.yellow, T.vibrar)}
          {fila(430, "las columnas", "oyen el eco: ¡alarma!", C.red, T.eco)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={340} titulo="por qué no se quita" o={t3}>
          {fila(290, "bolitas + resorte", "atrapan la aguja", C.white, T.bolitas)}
          {fila(355, "imán de la caja", "la libera", C.red, T.iman)}
          {fila(430, "si lo fuerzas", "tinta en la ropa", C.purpleLight, T.fuerzas)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
