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

// Tarjetas superiores (espacio de pantalla) con los datos de la racha y la probabilidad
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);

  // 1) Seis negros y el total perdido
  const t1 = sale(T.perdidos - 0.6, T.siguiente);
  // 2) Casi 2 de cada 100: 100 puntos, 2 en rojo
  const t2 = sale(T.dosDeCada100 - 0.4, T.cero);
  // 3) El cero: 2,7 % de la apuesta
  const t3 = sale(T.dosSieteSeis - 0.4, T.tope);
  const llenado = interpolate(t, [T.cero, T.cero + 0.9], [0, 1], clamp);
  // 4) Tope de mesa
  const t4 = sale(T.tope - 0.4, T.regla);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={330} titulo="seis negros seguidos" o={t1}>
          <text x={110} y={330} fill={C.red} fontFamily={mono} fontSize={96} fontWeight={700}>
            630 € perdidos
          </text>
          <text x={110} y={405} fill={C.grey} fontFamily={mono} fontSize={32}>
            7.ª apuesta: 640 € · te quedan 370 €
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={380} titulo="probabilidad de 6 negros seguidos" o={t2}>
          {new Array(100).fill(0).map((_, i) => {
            const col = i % 10;
            const fila = Math.floor(i / 10);
            const x = 130 + col * 80;
            const y = 262 + fila * 22;
            const en = i < 2;
            return <circle key={i} cx={x} cy={y} r={14} fill={en ? C.red : "#3A3360"} opacity={en ? sube(T.dosDeCada100 + 0.2) : 1} />;
          })}
          <text x={110} y={512} fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
            casi 2 de cada 100 series
          </text>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={330} titulo="la ruleta europea: un cero" o={t3}>
          <rect x={110} y={270} width={900} height={50} rx={25} fill={C.cardBorder} />
          <rect x={110} y={270} width={900 * 0.027 * llenado} height={50} rx={25} fill={C.red} />
          <text x={110} y={370} fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
            pierde un 2,7 % de media
          </text>
          <text x={110} y={425} fill={C.grey} fontFamily={mono} fontSize={28} opacity={sube(T.dosSieteSeis)}>
            la martingala no cambia eso
          </text>
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={330} titulo="tope de la mesa" o={t4}>
          <text x={110} y={330} fill={C.yellow} fontFamily={mono} fontSize={96} fontWeight={700}>
            500 €
          </text>
          <text x={110} y={405} fill={C.grey} fontFamily={mono} fontSize={32}>
            la apuesta de 640 € no cabe
          </text>
        </Tarjeta>
      ) : null}
    </svg>
  );
};
