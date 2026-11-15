import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la caja de zapatos con la bolsita «NO COMER» que suelta sus bolitas; en el centro, una bolita
// por dentro (túneles donde se queda pegada la humedad); a la derecha, 1 gramo frente a una cancha de baloncesto; al
// fondo, por qué no se come (atragantamiento, no alimenta, colorante).
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const BOLITA = "#E8F0F8";
const AGUA = "#4AA8F8";
const CAJA = "#B88A50";
const POROS = new Array(40).fill(0).map((_, i) => ({ a: random(`pa${i}`) * Math.PI * 2, r: Math.sqrt(random(`pr${i}`)) * 300, s: 14 + random(`ps${i}`) * 26 }));
const GOTAS = new Array(24).fill(0).map((_, i) => ({ f: random(`gf${i}`), k: Math.floor(random(`gk${i}`) * 40) }));
const CAEN = new Array(14).fill(0).map((_, i) => ({ x: (random(`cx${i}`) - 0.5) * 200, f: random(`cf${i}`) }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 620, 1000, 1.5],
  [T.final - 0.1, 620, 1000, 1.55],
  [T.final + 0.2, 550, 1080, 1.0],
  [T.son - 0.1, 550, 1080, 1.03],
  [T.son + 0.2, 640, 1080, 1.45],
  [T.dioxido - 0.1, 640, 1080, 1.48],
  [T.dioxido + 0.2, 1850, 1030, 1.0],
  [T.poros - 0.1, 1850, 1030, 1.03],
  [T.poros + 0.2, 1850, 1030, 1.2],
  [T.cada - 0.1, 1850, 1030, 1.23],
  [T.cada + 0.2, 1850, 1030, 1.0],
  [T.tuneles - 0.1, 1850, 1030, 1.03],
  [T.tuneles + 0.2, 1850, 1030, 1.5],
  [T.gramo - 0.1, 1850, 1030, 1.53],
  [T.gramo + 0.2, 3100, 1030, 1.0],
  [T.setecientos - 0.1, 3100, 1030, 1.03],
  [T.setecientos + 0.2, 3100, 1030, 1.15],
  [T.cancha - 0.1, 3100, 1030, 1.18],
  [T.cancha + 0.2, 3100, 1030, 0.95],
  [T.humedad - 0.1, 3100, 1030, 0.98],
  [T.humedad + 0.2, 1850, 1030, 1.7],
  [T.atrapada - 0.1, 1850, 1030, 1.73],
  [T.atrapada + 0.2, 1850, 1030, 1.3],
  [T.zapatos - 0.1, 1850, 1030, 1.33],
  [T.zapatos + 0.2, 450, 1220, 1.35],
  [T.noes - 0.1, 450, 1220, 1.38],
  [T.noes + 0.2, 4350, 1030, 1.0],
  [T.entonces - 0.1, 4350, 1030, 1.03],
  [T.entonces + 0.2, 4350, 860, 1.4],
  [T.alimenta - 0.1, 4350, 860, 1.43],
  [T.alimenta + 0.2, 4350, 1060, 1.4],
  [T.colorante - 0.1, 4350, 1060, 1.43],
  [T.colorante + 0.2, 4350, 1260, 1.4],
  [T.ahora - 0.1, 4350, 1260, 1.43],
  [T.ahora + 0.25, 620, 1000, 1.5],
  [T.fin + 0.3, 620, 1000, 1.55],
];

export const SilicaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Caja, bolsita y bolitas
  const sacude = t < T.final || t > T.ahora ? Math.sin(t * 16) * 5 : 0;
  const abre = ventana(T.son, T.dioxido + 0.2);
  const moho = ventana(T.moho - 0.2, T.noes + 0.2);

  // Bolita por dentro
  const verBolita = Math.max(ventana(T.dioxido - 0.1, T.gramo + 0.2), ventana(T.humedad - 0.1, T.zapatos + 0.2));
  const comparacion = ventana(T.dioxido, T.poros + 0.3);
  const atrapa = interpolate(t, [T.humedad, T.atrapada + 0.5], [0, 1], clamp);

  // Cancha
  const verCancha = ventana(T.gramo - 0.1, T.humedad + 0.2);
  const crece = interpolate(t, [T.setecientos, T.cancha + 0.4], [0, 1], clamp);

  // Por qué no se come
  const verAviso = ventana(T.noes - 0.1, T.ahora + 0.2);
  const fila = (a: number) => interpolate(t, [a, a + 0.4], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const zapato = (x: number, y: number, c: string) => (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -150 40 L -150 -20 Q -150 -60 -100 -60 L -20 -60 Q 20 -20 120 -10 Q 170 0 170 40 Z" fill={c} />
      <rect x={-150} y={30} width={320} height={22} rx={10} fill="#F8F4F0" />
      {[-60, -30, 0].map((d) => (
        <line key={d} x1={d} y1={-50} x2={d + 20} y2={-30} stroke="#F8F4F0" strokeWidth={6} />
      ))}
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={5400} height={2400} fill="#1A1C28" />

        {/* Caja de zapatos */}
        <path d="M 150 1130 L 260 860 L 980 860 L 940 1130 Z" fill="#9A6A38" />
        <rect x={130} y={1130} width={840} height={330} rx={10} fill={CAJA} />
        {zapato(330, 1190, "#3A6AC8")}
        {zapato(700, 1220, "#C83A3A")}
        {moho > 0
          ? [0, 1, 2].map((k) => (
              <g key={k} opacity={moho}>
                <circle cx={300 + k * 200} cy={1300} r={36} fill="#7A9A5A" opacity={0.7} />
                <line x1={260 + k * 200} y1={1260} x2={340 + k * 200} y2={1340} stroke={C.red} strokeWidth={10} />
              </g>
            ))
          : null}
        {/* Bolsita */}
        <g transform={`translate(${620 + sacude} 1000) rotate(${-8 + sacude})`}>
          <rect x={-150} y={-100} width={300} height={200} rx={14} fill="#F8F4F0" stroke="#C8CED8" strokeWidth={6} />
          <text y={-30} textAnchor="middle" fill="#3A3F4C" fontFamily={mono} fontSize={38} fontWeight={700}>
            SILICA GEL
          </text>
          <text y={40} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={44} fontWeight={700}>
            NO COMER
          </text>
          <line x1={-130} y1={66} x2={130} y2={66} stroke={C.red} strokeWidth={4} />
        </g>
        {abre > 0
          ? CAEN.map((b, i) => {
              const q = (t * 0.9 + b.f) % 1;
              return <circle key={i} cx={640 + b.x * (0.4 + q)} cy={1100 + q * 260} r={14} fill={BOLITA} stroke="#A8B8C8" strokeWidth={3} opacity={abre} />;
            })
          : null}
        <Pildora x={550} y={760} texto="¿por qué «no comer»?" color={C.white} o={ventana(T.final + 0.2, T.son)} tam={40} />

        {/* Bolita por dentro */}
        <g opacity={verBolita}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <g opacity={1 - comparacion * 0.85}>
            <circle cx={1850} cy={1030} r={330} fill={BOLITA} opacity={0.9} />
            {POROS.map((p, i) => (
              <circle key={i} cx={1850 + Math.cos(p.a) * p.r} cy={1030 + Math.sin(p.a) * p.r} r={p.s} fill="#2A3040" />
            ))}
            {atrapa > 0
              ? GOTAS.map((g, i) => {
                  const p = POROS[g.k];
                  const q = Math.min(1, atrapa * 1.5 - g.f * 0.5);
                  const x0 = 1850 + Math.cos(p.a) * 520;
                  const y0 = 1030 + Math.sin(p.a) * 520;
                  const x1 = 1850 + Math.cos(p.a) * p.r + p.s * 0.6;
                  const y1 = 1030 + Math.sin(p.a) * p.r;
                  return q > 0 ? <circle key={i} cx={x0 + (x1 - x0) * q} cy={y0 + (y1 - y0) * q} r={9} fill={AGUA} /> : null;
                })
              : null}
          </g>
          <g opacity={comparacion}>
            <circle cx={1550} cy={1050} r={70} fill={BOLITA} />
            <path d="M 1760 1120 Q 1850 940 1940 1120 Z" fill="#E8C888" />
            <path d="M 2150 900 L 2220 1000 L 2190 1140 L 2110 1140 L 2080 1000 Z" fill="#D8E8F8" opacity={0.8} />
            <text x={1850} y={1260} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={44} fontWeight={700}>
              SiO2
            </text>
            <text x={1550} y={1180} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28}>
              gel
            </text>
            <text x={1850} y={1170} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28}>
              arena
            </text>
            <text x={2150} y={1190} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28}>
              cuarzo
            </text>
          </g>
        </g>
        <Pildora x={1850} y={690} texto="atrapa la humedad" color={AGUA} o={ventana(T.pega, T.zapatos)} tam={42} />

        {/* 1 gramo frente a una cancha */}
        <g opacity={verCancha}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <g transform={`translate(3100 1050) scale(${0.08 + 0.92 * crece})`}>
            <rect x={-420} y={-230} width={840} height={460} fill="#C8783A" stroke="#FFFFFF" strokeWidth={8} />
            <line x1={0} y1={-230} x2={0} y2={230} stroke="#FFFFFF" strokeWidth={6} />
            <circle r={70} fill="none" stroke="#FFFFFF" strokeWidth={6} />
            <path d="M -420 -120 A 160 120 0 0 1 -420 120 M 420 -120 A 160 120 0 0 0 420 120" fill="none" stroke="#FFFFFF" strokeWidth={6} />
          </g>
          <circle cx={3100} cy={1050} r={18 * (1 - crece)} fill={BOLITA} />
          <text x={3100} y={760} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700} opacity={1 - crece}>
            1 gramo
          </text>
        </g>
        <Pildora x={3100} y={1400} texto="≈ 700 m² por dentro" color={C.yellow} o={ventana(T.setecientos, T.humedad)} tam={44} />

        {/* Por qué no se come */}
        <g opacity={verAviso}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} />
          <g opacity={ventana(T.noes, T.entonces)}>
            <circle cx={4350} cy={1030} r={150} fill="#2A8A4A" />
            <path d="M 4280 1030 l 50 56 l 100 -120" fill="none" stroke="#FFFFFF" strokeWidth={24} strokeLinecap="round" />
          </g>
          <g opacity={fila(T.atraganta)}>
            <circle cx={4100} cy={860} r={34} fill={BOLITA} />
            <text x={4170} y={874} fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
              atragantamiento
            </text>
          </g>
          <g opacity={fila(T.alimenta)}>
            <circle cx={4100} cy={1060} r={40} fill="none" stroke={C.white} strokeWidth={6} />
            <line x1={4070} y1={1030} x2={4130} y2={1090} stroke={C.red} strokeWidth={8} />
            <text x={4170} y={1074} fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
              no alimenta
            </text>
          </g>
          <g opacity={fila(T.colorante)}>
            {[0, 1, 2].map((k) => (
              <circle key={k} cx={4060 + k * 34} cy={1260} r={16} fill={k === 1 ? "#E8703C" : "#3A5AE8"} />
            ))}
            <text x={4170} y={1274} fill={C.red} fontFamily={mono} fontSize={40} fontWeight={700}>
              colorante tóxico
            </text>
          </g>
        </g>
        <Pildora x={4350} y={1400} texto="casi no reacciona" color="#48C878" o={ventana(T.nada, T.entonces)} tam={44} />
      </g>

      {[T.son, T.cada, T.gramo, T.noes].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(1850 + Math.cos(POROS[3].a) * POROS[3].r)} y={sy(1030 + Math.sin(POROS[3].a) * POROS[3].r)} dx={80} dy={-220} texto="túnel" color={C.white} o={ventana(T.tuneles + 0.2, T.gramo)} />
      <Tag x={sx(640)} y={sy(1200)} dx={150} dy={-220} texto="bolitas de sílice" color={BOLITA} o={ventana(T.son + 0.4, T.dioxido)} />
    </svg>
  );
};
