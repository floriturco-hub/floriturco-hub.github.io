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

// Tarjetas superiores (espacio de pantalla) que acompañan a la escena del maniquí
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);

  // 1) Muy común: parejas con pequeñas diferencias
  const t1 = sale(T.comun - 0.2, T.dentro);
  const PAREJAS = [0.92, 1, 0.88, 0.95, 1, 0.9, 0.97, 0.85];
  // 2) Cambia con el tiempo
  const t2 = sale(T.tiempo - 0.2, T.normal);
  const curva = new Array(29).fill(0).map((_, d) => {
    const x = 120 + d * 28;
    const y = 400 - (d > 20 ? (d - 20) * 9 : 0);
    return `${x},${y}`;
  });
  // 3) Cuándo consultar
  const t3 = sale(T.consultar - 0.2, T.cara);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={300} titulo="muy común: casi nadie es simétrica" o={t1}>
          {PAREJAS.map((f, i) => (
            <g key={i} opacity={interpolate(t, [T.comun + i * 0.12, T.comun + i * 0.12 + 0.3], [0, 1], clamp)}>
              <circle cx={140 + i * 110} cy={330} r={22 * f} fill="#C98A64" />
              <circle cx={140 + i * 110 + 44} cy={330} r={22} fill="#C98A64" />
            </g>
          ))}
          <text x={110} y={410} fill={C.grey} fontFamily={mono} fontSize={26}>
            pequeñas diferencias de tamaño o forma
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={360} titulo="cambia con el tiempo" o={t2}>
          <g opacity={sube(T.regla)}>
            <polyline points={curva.join(" ")} fill="none" stroke={C.yellow} strokeWidth={5} strokeLinejoin="round" />
            <text x={120} y={440} fill={C.grey} fontFamily={mono} fontSize={22}>
              día 1
            </text>
            <text x={900} y={440} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={22}>
              antes de la regla: se hinchan
            </text>
          </g>
          <g opacity={sube(T.mamar)}>
            <text x={110} y={490} fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>
              dar de mamar más de un lado
            </text>
          </g>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={360} titulo="consulta si hay un cambio repentino" o={t3}>
          {[
            { y: 300, texto: "un bulto", desde: T.bulto },
            { y: 370, texto: "la piel se arruga", desde: T.piel },
            { y: 440, texto: "el pezón cambia", desde: T.pezon },
          ].map((p, i) => (
            <g key={i} opacity={t >= p.desde ? 1 : 0.25}>
              <circle cx={130} cy={p.y - 12} r={22} fill="none" stroke={C.red} strokeWidth={3} />
              <text x={130} y={p.y - 1} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={26} fontWeight={700}>
                {i + 1}
              </text>
              <text x={180} y={p.y} fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
                {p.texto}
              </text>
            </g>
          ))}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
