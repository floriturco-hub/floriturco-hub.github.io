import { interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const VERDE = "#48C878";
const ROSA = "#FF7AA8";

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
  const llena = (desde: number) => interpolate(t, [desde, desde + 0.9], [0, 1], clamp);

  const t1 = sale(T.intestino - 0.4, T.parece - 0.1);
  const t2 = sale(T.mayoria - 0.1, T.fabrican - 0.1);
  const t3 = sale(T.fabrican, T.ratones - 0.1);
  const t4 = sale(T.humanos, T.noControlan - 0.1);
  const t5 = sale(T.ayuda - 0.1, T.final - 0.1);

  const barra = (y: number, nombre: string, valor: number, color: string, desde: number, ancho = 560) => (
    <g opacity={sube(desde)}>
      <text x={110} y={y + 30} fill={color} fontFamily={mono} fontSize={32} fontWeight={700}>
        {nombre}
      </text>
      <rect x={ancho < 500 ? 380 : 400} y={y} width={ancho} height={40} rx={20} fill={C.cardBorder} />
      <rect x={ancho < 500 ? 380 : 400} y={y} width={ancho * valor * llena(desde)} height={40} rx={20} fill={color} />
    </g>
  );

  const fila = (y: number, izq: string, der: string, color: string, desde: number) => (
    <g opacity={sube(desde)}>
      <text x={110} y={y} fill={C.white} fontFamily={mono} fontSize={32} fontWeight={700}>
        {izq}
      </text>
      <text x={970} y={y} textAnchor="end" fill={color} fontFamily={mono} fontSize={32} fontWeight={700}>
        {der}
      </text>
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={290} titulo="¿dónde está tu serotonina?" o={t1}>
          {barra(260, "intestino", 0.9, ROSA, T.intestino - 0.2, 400)}
          {barra(340, "resto", 0.1, "#C8C4D8", T.intestino + 0.2, 400)}
          <text x={970} y={290} textAnchor="end" fill={ROSA} fontFamily={mono} fontSize={28} fontWeight={700} opacity={sube(T.intestino + 0.4)}>
            ≈ 90 %
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="fibras del nervio vago" o={t2}>
          {barra(260, "↑ suben", 0.8, C.yellow, T.mayoria + 0.2, 400)}
          {barra(340, "↓ bajan", 0.2, C.cyan, T.arriba, 400)}
          <text x={970} y={290} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={30} fontWeight={700} opacity={sube(T.arriba)}>
            ≈ 80 %
          </text>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={330} titulo="lo que fabrican tus bacterias" o={t3}>
          {fila(290, "ácidos grasos", "menos inflamación", C.yellow, T.acidos)}
          {fila(355, "GABA", "calma las neuronas", C.cyan, T.gaba)}
          {fila(420, "+ serotonina en la tripa", "no cruza", ROSA, T.serotonina2)}
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={340} titulo="en humanos: ciertas bacterias" o={t4}>
          {barra(260, "sin depresión", 0.8, VERDE, T.humanos + 0.6, 460)}
          {barra(330, "con depresión", 0.5, C.red, T.menos, 460)}
          <g opacity={sube(T.causa - 0.4)}>
            <text x={540} y={450} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={32} fontWeight={700}>
              ¿bacterias → ánimo? ¿ánimo → bacterias?
            </text>
          </g>
        </Tarjeta>
      ) : null}

      {t5 > 0 ? (
        <Tarjeta alto={340} titulo="lo que más ayuda" o={t5}>
          {fila(290, "✓ fibra", "", VERDE, T.fibra)}
          {fila(350, "✓ variedad de vegetales", "", VERDE, T.vegetales)}
          {fila(410, "✓ dormir bien", "", VERDE, T.dormir)}
          <text x={110} y={470} fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700} opacity={sube(T.profesional)}>
            ansiedad que no se va → profesional
          </text>
        </Tarjeta>
      ) : null}
    </svg>
  );
};
