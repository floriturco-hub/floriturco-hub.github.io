import { Easing, interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const SANGRE = "#D8283C";

const Gota: React.FC<{ readonly x: number; readonly y: number; readonly color: string; readonly o: number }> = ({ x, y, color, o }) => (
  <path d={`M ${x} ${y - 30} C ${x + 6} ${y - 18}, ${x + 20} ${y - 4}, ${x + 20} ${y + 8} C ${x + 20} ${y + 20}, ${x + 11} ${y + 28}, ${x} ${y + 28} C ${x - 11} ${y + 28}, ${x - 20} ${y + 20}, ${x - 20} ${y + 8} C ${x - 20} ${y - 4}, ${x - 6} ${y - 18}, ${x} ${y - 30} Z`} fill={color} opacity={o} />
);

const Tarjeta: React.FC<{ readonly alto: number; readonly titulo: string; readonly o: number; readonly children: React.ReactNode }> = ({ alto, titulo, o, children }) => (
  <g opacity={o}>
    <rect x={60} y={150} width={960} height={alto} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
    <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>
      {titulo}
    </text>
    {children}
  </g>
);

// Tarjetas superiores (espacio de pantalla) que acompañan a la escena de la cabeza
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);

  // 1) Nueve de cada diez: las gotas se encienden una a una
  const t1 = sale(T.nueve - 0.2, T.seco);
  const encendidas = interpolate(t, [T.nueve, T.nueve + 1.6], [0, 9], clamp);
  // 2) Diez minutos apretando
  const t2 = sale(T.diezMin - 0.2, T.atras);
  const resto = interpolate(t, [T.diezMin, T.atras - 0.3], [1, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const min = Math.ceil(10 * resto - 0.001);
  // 3) Cuándo ir al médico: lista que se ilumina paso a paso
  const t3 = sale(T.veinte - 0.2, T.noEs);
  const paso1 = t >= T.veinte ? 1 : 0.25;
  const paso2 = t >= T.golpe ? 1 : 0.25;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={330} titulo="dónde empiezan los sangrados" o={t1}>
          {new Array(10).fill(0).map((_, i) => (
            <Gota key={i} x={140 + i * 84} y={300} color={i < encendidas ? SANGRE : C.grey} o={i < encendidas ? 1 : 0.35} />
          ))}
          <text x={110} y={405} fill={C.yellow} fontFamily={mono} fontSize={52} fontWeight={700}>
            9 de cada 10
          </text>
          <text x={540} y={402} fill={C.white} fontFamily={mono} fontSize={30}>
            en esta red
          </text>
          <text x={110} y={450} fill={C.grey} fontFamily={mono} fontSize={22}>
            zona de Kiesselbach, parte delantera del tabique
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={330} titulo="aprieta sin soltar" o={t2}>
          <circle cx={240} cy={340} r={90} fill="none" stroke={C.cardBorder} strokeWidth={14} />
          <circle
            cx={240}
            cy={340}
            r={90}
            fill="none"
            stroke={C.yellow}
            strokeWidth={14}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${resto} 1`}
            transform="rotate(-90 240 340)"
          />
          <text x={240} y={358} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={52} fontWeight={700}>
            {min}
          </text>
          <text x={380} y={330} fill={C.yellow} fontFamily={mono} fontSize={64} fontWeight={700}>
            10 minutos
          </text>
          <text x={380} y={390} fill={C.grey} fontFamily={mono} fontSize={30}>
            inclinado hacia delante
          </text>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={300} titulo="ve al médico si" o={t3}>
          {[
            { y: 300, texto: "no para en 20 minutos", o: paso1 },
            { y: 380, texto: "fue tras un golpe fuerte", o: paso2 },
          ].map((p, i) => (
            <g key={i} opacity={p.o}>
              <circle cx={130} cy={p.y - 14} r={26} fill="none" stroke={C.red} strokeWidth={3} />
              <text x={130} y={p.y - 2} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700}>
                {i + 1}
              </text>
              <text x={185} y={p.y} fill={C.white} fontFamily={mono} fontSize={42} fontWeight={700}>
                {p.texto}
              </text>
            </g>
          ))}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
