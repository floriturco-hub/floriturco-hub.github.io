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

// Tarjetas superiores (espacio de pantalla) que acompañan a la escena de la casa
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);

  // 1) El kilovatio hora
  const t1 = sale(T.unidad - 0.2, T.medidor);
  // 2) Medidor antiguo frente a digital
  const t2 = sale(T.antiguos - 0.2, T.igual);
  const disco = t * 260;
  const led = Math.max(0, 1 - ((t * 2.5) % 1) * 6);
  // 3) Lecturas y precio por horas
  const t3 = sale(T.diferencia - 0.3, T.cargo);
  const porHoras = sube(T.hora);
  const HORAS = new Array(24).fill(0).map((_, h) => (h < 8 ? { c: C.cyan, a: 40 } : h >= 18 && h < 22 ? { c: C.red, a: 110 } : { c: C.yellow, a: 70 }));
  // 4) La factura
  const t4 = sale(T.cargo - 0.2, T.truco);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={360} titulo="la unidad: kilovatio hora" o={t1}>
          <text x={110} y={310} fill={C.yellow} fontFamily={mono} fontSize={60} fontWeight={700}>
            1 kWh = 1.000 W × 1 h
          </text>
          <g opacity={sube(T.microondas)}>
            <text x={110} y={385} fill={C.white} fontFamily={mono} fontSize={34}>
              microondas
            </text>
            <text x={940} y={385} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={34} fontWeight={700}>
              1.000 W × 1 h
            </text>
          </g>
          <g opacity={sube(T.bombilla)}>
            <text x={110} y={445} fill={C.white} fontFamily={mono} fontSize={34}>
              bombilla LED
            </text>
            <text x={940} y={445} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={34} fontWeight={700}>
              10 W × 100 h
            </text>
          </g>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={360} titulo="medidores" o={t2}>
          <g opacity={sube(T.antiguos)}>
            <rect x={150} y={250} width={260} height={180} rx={14} fill="#1A1636" stroke="#8C88A8" strokeWidth={3} />
            <ellipse cx={280} cy={370} rx={100} ry={18} fill="#C8C4D8" />
            <rect x={280 + 90 * Math.cos((disco * Math.PI) / 180) - 6} y={355} width={12} height={30} fill={C.red} opacity={Math.sin((disco * Math.PI) / 180) > 0 ? 1 : 0.25} />
            <text x={280} y={300} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={28}>
              antiguo: disco
            </text>
          </g>
          <g opacity={sube(T.digitales)}>
            <rect x={620} y={250} width={260} height={180} rx={14} fill="#E8EEF4" stroke="#8C88A8" strokeWidth={3} />
            <rect x={650} y={272} width={200} height={50} rx={6} fill="#1A3A2A" />
            <text x={750} y={307} textAnchor="middle" fill="#7AF0A0" fontFamily={mono} fontSize={30} fontWeight={700}>
              04512
            </text>
            <circle cx={680} cy={380} r={14} fill="#5A1A1A" />
            <circle cx={680} cy={380} r={14} fill={C.red} opacity={led} />
            <text x={710} y={390} fill="#3A3360" fontFamily={mono} fontSize={24} fontWeight={700}>
              digital
            </text>
          </g>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={420} titulo="lo que pagas" o={t3}>
          <text x={110} y={290} fill={C.grey} fontFamily={mono} fontSize={32}>
            nueva − anterior
          </text>
          <text x={940} y={290} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
            4.512 − 4.312
          </text>
          <text x={110} y={350} fill={C.yellow} fontFamily={mono} fontSize={40} fontWeight={700} opacity={sube(T.precio)}>
            200 kWh × precio
          </text>
          <g opacity={porHoras}>
            {HORAS.map((h, i) => (
              <rect key={i} x={110 + i * 34} y={530 - h.a} width={26} height={h.a} rx={4} fill={h.c} opacity={0.85} />
            ))}
            <text x={110} y={555} fill={C.grey} fontFamily={mono} fontSize={22}>
              precio por hora del día (ejemplo)
            </text>
          </g>
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={340} titulo="tu factura" o={t4}>
          {[
            { y: 290, texto: "energía (kWh × precio)", color: C.yellow, desde: T.cargo - 0.2 },
            { y: 355, texto: "cargo fijo / potencia", color: C.white, desde: T.cargo },
            { y: 420, texto: "impuestos", color: C.grey, desde: T.impuestos },
          ].map((f, i) => (
            <g key={i} opacity={sube(f.desde)}>
              <rect x={110} y={f.y - 30} width={20} height={36} rx={4} fill={f.color} />
              <text x={150} y={f.y} fill={C.white} fontFamily={mono} fontSize={38} fontWeight={700}>
                {f.texto}
              </text>
            </g>
          ))}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
