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

// Tarjetas superiores (espacio de pantalla) que acompañan al diagrama
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);
  const llena = (desde: number) => interpolate(t, [desde, desde + 0.8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // 1) De qué está hecho
  const t1 = sale(T.vesiculas - 0.2, T.azucar);
  // 2) Sabor habitual
  const t2 = sale(T.sabor - 0.1, T.compuestos);
  // 3) Estudios
  const t3 = sale(T.estudios - 0.2, T.agua);
  // 4) Lo que sí influye
  const t4 = sale(T.agua - 0.2, T.magico);

  const barra = (y: number, nombre: string, valor: number, color: string, desde: number) => (
    <g opacity={sube(desde)}>
      <text x={110} y={y + 28} fill={C.white} fontFamily={mono} fontSize={32} fontWeight={700}>
        {nombre}
      </text>
      <rect x={400} y={y} width={540} height={36} rx={18} fill={C.cardBorder} />
      <rect x={400} y={y} width={540 * valor * llena(desde)} height={36} rx={18} fill={color} />
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={360} titulo="de qué está hecho (aprox.)" o={t1}>
          {barra(260, "vesículas", 0.68, "#C8D8E8", T.vesiculas)}
          {barra(330, "próstata", 0.28, "#E8E0C8", T.prostata)}
          {barra(400, "espermatoz.", 0.04, C.cyan, T.esperma)}
          <text x={940} y={460} textAnchor="end" fill={C.cyan} fontFamily={mono} fontSize={26} opacity={sube(T.cinco)}>
            menos del 5 %
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={330} titulo="sabor habitual" o={t2}>
          {barra(260, "salado", 0.7, C.cyan, T.salado)}
          {barra(330, "amargo", 0.5, C.orange, T.amargo)}
          {barra(400, "dulce", 0.15, C.yellow, T.apenasDulce)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={300} titulo="piña y sabor: lo que dice la ciencia" o={t3}>
          <text x={110} y={340} fill={C.red} fontFamily={mono} fontSize={64} fontWeight={700}>
            sin estudios serios
          </text>
          <text x={110} y={410} fill={C.grey} fontFamily={mono} fontSize={30} opacity={sube(T.anecdotas)}>
            solo anécdotas
          </text>
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={340} titulo="lo que más influye" o={t4}>
          {[
            { y: 290, texto: "beber agua", color: C.cyan, desde: T.agua },
            { y: 355, texto: "no fumar", color: C.cyan, desde: T.fumar },
            { y: 420, texto: "olor raro + molestias: médico", color: C.red, desde: T.olor },
          ].map((p, i) => (
            <g key={i} opacity={t >= p.desde ? 1 : 0.25}>
              <circle cx={130} cy={p.y - 12} r={22} fill="none" stroke={p.color} strokeWidth={3} />
              <text x={130} y={p.y - 1} textAnchor="middle" fill={p.color} fontFamily={mono} fontSize={26} fontWeight={700}>
                {i + 1}
              </text>
              <text x={180} y={p.y} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
                {p.texto}
              </text>
            </g>
          ))}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
