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

  const t1 = sale(T.llena - 0.2, T.porQue - 0.1);
  const t2 = sale(T.primera - 0.1, T.colorantes - 0.2);
  const t3 = sale(T.segunda - 0.1, T.truco - 0.1);
  const t4 = sale(T.color - 0.1, T.final - 0.1);

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

  // Agua que se derrama sola frente a la pasta que se queda quieta
  const derrame = ((t - T.solido) % 2.4) / 2.4;
  const remolino = (x: number, y: number) => (
    <path
      key={`${x}-${y}`}
      d={`M ${x} ${y} a 14 14 0 1 1 14 14 a 22 22 0 1 1 -22 -22`}
      fill="none"
      stroke={C.grey}
      strokeWidth={4}
      strokeLinecap="round"
      transform={`rotate(${t * 120} ${x} ${y})`}
    />
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={330} titulo="en la fábrica" o={t1}>
          {fila(290, "1  se llena por detrás", "", C.white, T.llena)}
          {fila(355, "2  tres pastas a la vez", "", C.yellow, T.inyecta)}
          {fila(420, "3  se sella el fondo", "", C.white, T.sella)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={340} titulo="razón 1: es muy espesa" o={t2}>
          <g opacity={sube(T.espesa)}>
            <ellipse cx={240} cy={330 + derrame * 6} rx={40 + derrame * 90} ry={14 + 8 * (1 - derrame)} fill="#6AAEE6" opacity={0.8} />
            <text x={240} y={410} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28} fontWeight={700}>
              agua: se derrama
            </text>
          </g>
          <g opacity={sube(T.solido)}>
            <rect x={640} y={296} width={200} height={44} rx={22} fill="#F4F2F8" />
            <rect x={640} y={296} width={200} height={12} rx={6} fill="#E8414F" />
            <rect x={640} y={330} width={200} height={10} rx={5} fill="#2E8AE8" />
            <text x={740} y={410} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={28} fontWeight={700}>
              pasta: quieta
            </text>
          </g>
          <text x={540} y={460} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={28} fontWeight={700} opacity={sube(T.fluye)}>
            solo fluye cuando la empujas
          </text>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={340} titulo="razón 2: flujo laminar" o={t3}>
          <g opacity={sube(T.laminar)}>
            {[0, 1, 2].map((k) => (
              <line key={k} x1={120} y1={290 + k * 30} x2={440} y2={290 + k * 30} stroke={k === 0 ? "#E8414F" : k === 1 ? "#F4F2F8" : "#2E8AE8"} strokeWidth={14} strokeLinecap="round" strokeDasharray="40 14" strokeDashoffset={-t * 80} />
            ))}
            <text x={280} y={410} textAnchor="middle" fill={VERDE} fontFamily={mono} fontSize={28} fontWeight={700}>
              ✓ capas
            </text>
          </g>
          <g opacity={sube(T.sinRemolinos)}>
            {remolino(660, 300)}
            {remolino(760, 330)}
            {remolino(860, 300)}
            <line x1={630} y1={270} x2={900} y2={370} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
            <text x={760} y={410} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={28} fontWeight={700}>
              ✗ remolinos
            </text>
          </g>
          <text x={540} y={460} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={30} fontWeight={700} opacity={sube(T.noMezcla)}>
            sin remolinos = sin mezcla
          </text>
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={290} titulo="¿y las rayas de color?" o={t4}>
          {fila(300, "a veces", "otro ingrediente", C.cyan, T.ingrediente)}
          {fila(380, "a veces", "solo marketing", C.yellow, T.marketing)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
