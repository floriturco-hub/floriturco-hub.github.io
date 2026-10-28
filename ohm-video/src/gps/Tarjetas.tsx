import { Easing, interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const Tarjeta: React.FC<{ readonly alto: number; readonly titulo: string; readonly o: number; readonly borde?: string; readonly children: React.ReactNode }> = ({
  alto,
  titulo,
  o,
  borde = C.cardBorder,
  children,
}) => (
  <g opacity={o}>
    <rect x={60} y={150} width={960} height={alto} rx={24} fill={C.card} stroke={borde} strokeWidth={2} />
    <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>
      {titulo}
    </text>
    {children}
  </g>
);

const Fila: React.FC<{ readonly y: number; readonly clave: string; readonly valor: string; readonly color: string; readonly o: number }> = ({ y, clave, valor, color, o }) => (
  <g opacity={o}>
    <text x={110} y={y} fill={C.grey} fontFamily={mono} fontSize={34}>
      {clave}
    </text>
    <text x={380} y={y} fill={color} fontFamily={mono} fontSize={38} fontWeight={700}>
      {valor}
    </text>
  </g>
);

const coma = (v: number, decimales: number) => v.toFixed(decimales).replace(".", ",");
const miles = (v: number) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Tarjetas superiores (espacio de pantalla) que acompañan a la escena orbital
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const fila = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);
  const cuenta = (desde: number, hasta: number) => interpolate(t, [desde, hasta], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // 1) El mensaje que repite cada satélite
  const t1 = sale(T.repite - 0.2, T.senal + 0.2);
  // 2) Cronómetro del retraso y la distancia
  const t2 = sale(T.senal + 0.5, T.esfera);
  const retraso = 0.067 * interpolate(t, [T.senal + 0.6, T.centesimas + 0.8], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const distancia = cuenta(T.retraso + 0.2, T.retraso + 2.4);
  // 3) Una millonésima de segundo
  const t3 = sale(T.millonesima - 0.2, T.einstein);
  const metros = 300 * cuenta(T.millonesima + 0.2, T.trescientos + 0.4);
  // 4) Relatividad
  const t4 = sale(T.adelantan - 0.2, T.tunel);
  const km = 10 * cuenta(T.sinCorregir, T.diezKm + 0.4);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={330} titulo="mensaje del satélite (sin parar)" o={t1}>
          <Fila y={290} clave="soy" valor="GPS 14" color={C.white} o={fila(T.quien)} />
          <Fila y={360} clave="estoy en" valor="x, y, z (órbita)" color={C.white} o={fila(T.donde)} />
          <Fila y={430} clave="hora envío" valor="17:42:08,000000000" color={C.yellow} o={fila(T.hora)} />
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={330} titulo="retraso de la señal" o={t2}>
          <text x={110} y={350} fill={C.cyan} fontFamily={mono} fontSize={100} fontWeight={700}>
            {coma(retraso, 3)} s
          </text>
          <g opacity={distancia > 0 ? 1 : 0}>
            <text x={110} y={435} fill={C.grey} fontFamily={mono} fontSize={30}>
              × 300.000 km/s =
            </text>
            <text x={470} y={437} fill={C.yellow} fontFamily={mono} fontSize={42} fontWeight={700}>
              {miles(20100 * distancia)} km
            </text>
          </g>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={330} titulo="error de 1 millonésima de segundo" o={t3}>
          <text x={110} y={355} fill={C.red} fontFamily={mono} fontSize={110} fontWeight={700}>
            {Math.round(metros)} m
          </text>
          <text x={110} y={440} fill={C.grey} fontFamily={mono} fontSize={26}>
            300.000 km/s × 0,000 001 s
          </text>
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={330} titulo="relojes en órbita (relatividad)" o={t4}>
          <text x={110} y={330} fill={C.yellow} fontFamily={mono} fontSize={70} fontWeight={700}>
            +38 µs / día
          </text>
          <g opacity={interpolate(t, [T.sinCorregir - 0.1, T.sinCorregir + 0.3], [0, 1], clamp)}>
            <text x={110} y={430} fill={C.grey} fontFamily={mono} fontSize={30}>
              sin corregir:
            </text>
            <text x={380} y={432} fill={C.red} fontFamily={mono} fontSize={48} fontWeight={700}>
              {coma(km, 1)} km / día
            </text>
          </g>
        </Tarjeta>
      ) : null}
    </svg>
  );
};
