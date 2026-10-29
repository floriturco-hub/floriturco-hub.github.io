import { Easing, interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const AGUA = "#4AA8D8";

const Tarjeta: React.FC<{ readonly alto: number; readonly titulo: string; readonly o: number; readonly children: React.ReactNode }> = ({ alto, titulo, o, children }) => (
  <g opacity={o}>
    <rect x={60} y={150} width={960} height={alto} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
    <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>
      {titulo}
    </text>
    {children}
  </g>
);

// Ducha esquemática para contar "unas diez"
const Ducha: React.FC<{ readonly x: number; readonly y: number; readonly o: number }> = ({ x, y, o }) => (
  <g opacity={o} transform={`translate(${x} ${y})`}>
    <path d="M -14 -26 Q 0 -40 14 -26 Z" fill="#C8C4D8" />
    {[-8, 0, 8].map((dx) => (
      <line key={dx} x1={dx} y1={-20} x2={dx * 1.3} y2={10} stroke={AGUA} strokeWidth={3} strokeLinecap="round" />
    ))}
  </g>
);

// Tarjetas superiores (espacio de pantalla) que acompañan a la escena de la calle
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);
  const llena = (desde: number, dur = 0.8) => interpolate(t, [desde, desde + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // 1) Un metro cúbico
  const t1 = sale(T.metroCubico - 0.2, T.cadaTiempo);
  const litros = Math.round(1000 * llena(T.mil - 0.3, 0.9));
  const duchas = interpolate(t, [T.duchas, T.duchas + 1.0], [0, 10], clamp);
  // 2) Lecturas
  const t2 = sale(T.diferencia - 0.3, T.tramos);
  // 3) Precio por tramos (ejemplo)
  const t3 = sale(T.tramos - 0.2, T.suman);
  const consumo = interpolate(t, [T.primeros, T.extra + 0.8], [0, 18], clamp);
  // 4) La factura
  const t4 = sale(T.suman - 0.2, T.truco);

  const TRAMOS = [
    { hasta: 10, alto: 50, color: C.cyan, nombre: "0–10" },
    { hasta: 20, alto: 100, color: C.yellow, nombre: "11–20" },
    { hasta: 30, alto: 160, color: C.red, nombre: "+20" },
  ];

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={330} titulo="1 metro cúbico" o={t1}>
          <g transform="translate(200 350)">
            <path d="M -60 -30 L 0 -60 L 60 -30 L 0 0 Z" fill={AGUA} opacity={0.9} />
            <path d="M -60 -30 L 0 0 L 0 70 L -60 40 Z" fill="#2E7AA8" />
            <path d="M 60 -30 L 0 0 L 0 70 L 60 40 Z" fill="#3A8ABA" />
          </g>
          <text x={320} y={330} fill={C.cyan} fontFamily={mono} fontSize={76} fontWeight={700}>
            {String(litros).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} L
          </text>
          {new Array(10).fill(0).map((_, i) => (
            <Ducha key={i} x={340 + i * 64} y={420} o={i < duchas ? 1 : 0.15} />
          ))}
          <text x={340} y={462} fill={C.grey} fontFamily={mono} fontSize={24} opacity={sube(T.duchas + 0.6)}>
            ≈ 10 duchas de 10 minutos
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={330} titulo="lo que pagas" o={t2}>
          <text x={110} y={295} fill={C.grey} fontFamily={mono} fontSize={34}>
            lectura nueva
          </text>
          <text x={940} y={295} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={42} fontWeight={700}>
            1.252 m³
          </text>
          <text x={110} y={360} fill={C.grey} fontFamily={mono} fontSize={34} opacity={sube(T.anterior)}>
            − anterior
          </text>
          <text x={940} y={360} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={42} fontWeight={700} opacity={sube(T.anterior)}>
            1.234 m³
          </text>
          <line x1={110} y1={385} x2={940} y2={385} stroke={C.cardBorder} strokeWidth={3} opacity={sube(T.anterior + 0.4)} />
          <text x={110} y={440} fill={C.yellow} fontFamily={mono} fontSize={40} fontWeight={700} opacity={sube(T.anterior + 0.5)}>
            consumo
          </text>
          <text x={940} y={440} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={48} fontWeight={700} opacity={sube(T.anterior + 0.5)}>
            18 m³
          </text>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={400} titulo="precio por m³ según el tramo (ejemplo)" o={t3}>
          {TRAMOS.map((tr, i) => {
            const desde = i === 0 ? 0 : TRAMOS[i - 1].hasta;
            const lleno = Math.max(0, Math.min(1, (consumo - desde) / (tr.hasta - desde)));
            const x = 140 + i * 280;
            return (
              <g key={i} opacity={sube(i === 0 ? T.primeros : i === 1 ? T.mucho : T.extra)}>
                <rect x={x} y={470 - tr.alto} width={220} height={tr.alto} rx={8} fill="none" stroke={tr.color} strokeWidth={3} />
                <rect x={x} y={470 - tr.alto} width={220 * lleno} height={tr.alto} rx={8} fill={tr.color} opacity={0.75} />
                <text x={x + 110} y={300} textAnchor="middle" fill={tr.color} fontFamily={mono} fontSize={30} fontWeight={700}>
                  {tr.nombre} m³
                </text>
              </g>
            );
          })}
          <text x={110} y={530} fill={C.grey} fontFamily={mono} fontSize={24}>
            más alto = cada m³ cuesta más
          </text>
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={400} titulo="tu factura" o={t4}>
          {[
            { y: 290, texto: "consumo (m³ × precio)", color: C.cyan, desde: T.suman - 0.2 },
            { y: 350, texto: "cargo fijo", color: C.white, desde: T.cargo },
            { y: 410, texto: "alcantarillado", color: "#C89A6A", desde: T.alcantarillado },
            { y: 470, texto: "impuestos", color: C.grey, desde: T.impuestos },
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
