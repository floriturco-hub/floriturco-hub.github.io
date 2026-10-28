import { Easing, interpolate } from "remotion";
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

// Tarjetas superiores (espacio de pantalla) que acompañan a la escena de la persona
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);
  const llena = (desde: number) => interpolate(t, [desde, desde + 0.8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // 1) Cuántas cosquillas: tu mano frente a otra
  const t1 = sale(T.dedo - 0.2, T.decides);
  // 2) El experimento del robot: más retraso, más cosquillas
  const t2 = sale(T.experimento - 0.2, T.mismoTruco);
  const pasos = [
    { r: "0,0 s", v: 0.25, desde: T.retraso + 0.4 },
    { r: "0,1 s", v: 0.5, desde: T.retraso + 1.2 },
    { r: "0,2 s", v: 0.75, desde: T.retraso + 2.0 },
    { r: "0,3 s", v: 0.9, desde: T.retraso + 2.8 },
  ];
  // 3) El mismo truco en otros sentidos
  const t3 = sale(T.mismoTruco - 0.2, T.alguien);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={300} titulo="cosquillas que sientes" o={t1}>
          <text x={110} y={300} fill={C.cyan} fontFamily={mono} fontSize={36} fontWeight={700}>
            tu mano
          </text>
          <rect x={380} y={270} width={560 * 0.2 * llena(T.dedo)} height={40} rx={20} fill={C.cyan} />
          <text x={110} y={380} fill={C.orange} fontFamily={mono} fontSize={36} fontWeight={700} opacity={sube(T.otra)}>
            otra mano
          </text>
          <rect x={380} y={350} width={560 * llena(T.otra)} height={40} rx={20} fill={C.orange} />
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={420} titulo="experimento: un robot en medio" o={t2}>
          {/* mano → robot → piel */}
          <g opacity={sube(T.robot)}>
            <circle cx={150} cy={290} r={22} fill="#C98A64" />
            <line x1={175} y1={290} x2={245} y2={290} stroke={C.yellow} strokeWidth={4} strokeDasharray="8 6" />
            <rect x={250} y={262} width={90} height={56} rx={10} fill="#8C88A8" />
            <circle cx={275} cy={286} r={6} fill={C.cyan} />
            <circle cx={315} cy={286} r={6} fill={C.cyan} />
            <line x1={345} y1={290} x2={420} y2={290} stroke={C.orange} strokeWidth={4} strokeDasharray="8 6" />
            <rect x={425} y={266} width={60} height={48} rx={10} fill="#C98A64" />
            <text x={455} y={350} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={22}>
              piel
            </text>
          </g>
          <text x={560} y={268} fill={C.grey} fontFamily={mono} fontSize={26} opacity={sube(T.retraso)}>
            retraso → cosquillas
          </text>
          {pasos.map((p, i) => (
            <g key={i} opacity={t >= p.desde ? 1 : 0.2}>
              <text x={560} y={318 + i * 56} fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>
                {p.r}
              </text>
              <rect x={680} y={294 + i * 56} width={300 * p.v * llena(p.desde)} height={30} rx={15} fill={C.orange} />
            </g>
          ))}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={300} titulo="el mismo truco" o={t3}>
          <g opacity={sube(T.voz)}>
            <text x={110} y={300} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
              tu propia voz
            </text>
            <text x={560} y={300} fill={C.cyan} fontFamily={mono} fontSize={32}>
              no te sobresalta
            </text>
          </g>
          <g opacity={sube(T.ojos)}>
            <text x={110} y={380} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
              mover los ojos
            </text>
            <text x={560} y={380} fill={C.cyan} fontFamily={mono} fontSize={32}>
              el mundo no salta
            </text>
          </g>
        </Tarjeta>
      ) : null}
    </svg>
  );
};
