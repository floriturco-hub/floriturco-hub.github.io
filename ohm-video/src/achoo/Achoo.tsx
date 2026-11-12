import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una cabeza de perfil que sale de lo oscuro, mira al sol y estornuda; luego 1 de cada 4 personas,
// el esquema de nervios (óptico y trigémino casi tocándose, la señal que se cruza), la herencia y las siglas ACHOO.
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho («¡Achú! Porque…» → «¡El sol te hace estornudar!»).
const PIEL = "#C98A64";
const SOL = "#F8D040";
const OPTICO = C.yellow;
const TRIGE = "#F8885A";
const OPT: [number, number][] = [
  [3460, 880],
  [3300, 930],
  [3150, 965],
  [3000, 950],
  [2900, 900],
];
const TRI: [number, number][] = [
  [3440, 1180],
  [3300, 1060],
  [3150, 990],
  [3000, 1040],
  [2880, 1120],
];
const enRuta = (r: [number, number][], p: number): [number, number] => {
  const f = Math.max(0, Math.min(0.999, p)) * (r.length - 1);
  const k = Math.floor(f);
  const u = f - k;
  return [r[k][0] + (r[k + 1][0] - r[k][0]) * u, r[k][1] + (r[k + 1][1] - r[k][1]) * u];
};
const ruta = (r: [number, number][]) => `M ${r.map((q) => `${q[0]} ${q[1]}`).join(" L ")}`;

const camaraKeys = (): ClaveCamara[] => [
  [0, 600, 980, 1.05],
  [T.final - 0.1, 600, 980, 1.1],
  [T.final + 0.2, 680, 900, 1.45],
  [T.pasa - 0.1, 680, 900, 1.48],
  [T.pasa + 0.2, 1850, 1030, 1.0],
  [T.cuatro - 0.1, 1850, 1030, 1.03],
  [T.cuatro + 0.2, 2050, 1030, 1.5],
  [T.salen - 0.1, 2050, 1030, 1.53],
  [T.salen + 0.2, 600, 980, 1.0],
  [T.sol - 0.1, 600, 980, 1.03],
  [T.sol + 0.2, 720, 860, 1.4],
  [T.estornudan - 0.1, 720, 860, 1.43],
  [T.estornudan + 0.2, 640, 980, 1.05],
  [T.explica - 0.1, 640, 980, 1.08],
  [T.explica + 0.2, 3100, 1030, 1.0],
  [T.nervio - 0.1, 3100, 1030, 1.03],
  [T.nervio + 0.2, 3250, 940, 1.35],
  [T.cerca - 0.1, 3250, 940, 1.38],
  [T.cerca + 0.2, 3150, 980, 2.0],
  [T.nariz - 0.1, 3150, 980, 2.03],
  [T.nariz + 0.2, 3200, 1060, 1.35],
  [T.destello - 0.1, 3200, 1060, 1.38],
  [T.destello + 0.2, 3100, 1030, 1.05],
  [T.cruza - 0.1, 3100, 1030, 1.08],
  [T.cruza + 0.2, 3150, 980, 2.0],
  [T.cerebro - 0.1, 3150, 980, 2.03],
  [T.cerebro + 0.2, 2950, 980, 1.25],
  [T.estornudas - 0.2, 2950, 980, 1.28],
  [T.estornudas + 0.1, 620, 980, 1.05],
  [T.hereda - 0.1, 620, 980, 1.08],
  [T.hereda + 0.2, 4350, 1030, 1.0],
  [T.nombre - 0.1, 4350, 1030, 1.03],
  [T.nombre + 0.2, 5600, 1030, 1.0],
  [T.elegidas - 0.1, 5600, 1030, 1.03],
  [T.elegidas + 0.2, 5500, 1030, 1.25],
  [T.achu - 0.1, 5500, 1030, 1.28],
  [T.achu + 0.2, 600, 980, 1.05],
  [T.fin + 0.3, 600, 980, 1.1],
];

export const AchooMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Cabeza: oscuridad, sol y estornudo
  const oscuro = t > T.salen - 0.2 && t < T.sol + 0.5 ? interpolate(t, [T.salen - 0.2, T.salen + 0.2, T.sol - 0.2, T.sol + 0.3], [0, 0.75, 0.75, 0], clamp) : 0;
  const achu = Math.max(ventana(-1, T.final - 0.2, 0.2, 0.3), ventana(T.estornudan + 0.3, T.explica, 0.15, 0.3), ventana(T.estornudas, T.hereda, 0.15, 0.3), ventana(T.achu, T.fin + 2, 0.15, 0.3));
  const inicio = t < T.final ? 0 : t < T.explica ? T.estornudan + 0.3 : t < T.hereda ? T.estornudas : T.achu;
  const vuelo = Math.max(0, t - inicio);
  const sacude = achu > 0 ? -7 * Math.exp(-vuelo * 4) * achu : 0;
  const rayos = Math.max(t < T.final ? 1 : 0, ventana(T.sol, T.explica), ventana(T.estornudas - 0.3, T.hereda), ventana(T.achu - 0.4, T.fin + 2));
  const ojo = rayos > 0.5 ? 0.25 : 1;

  // Nervios
  const verNervios = ventana(T.explica - 0.1, T.estornudas + 0.1);
  const opt = Math.max(ventana(T.nervio, T.nariz), ventana(T.destello, T.estornudas));
  const tri = Math.max(ventana(T.nariz, T.destello), ventana(T.cruza, T.estornudas));
  const pulso = interpolate(t, [T.destello + 0.3, T.cruza], [0, 0.5], clamp);
  const salto = interpolate(t, [T.cruza, T.cruza + 0.8, T.cerebro, T.cerebro + 1.0], [0.5, 0.5, 0.5, 1], clamp);
  const chispa = ventana(T.cruza, T.cerebro + 0.3, 0.1, 0.3);
  const pica = ventana(T.cerebro + 0.5, T.estornudas);

  // Paneles
  const verGente = ventana(T.pasa - 0.1, T.salen + 0.2);
  const verFamilia = ventana(T.hereda - 0.1, T.nombre + 0.2);
  const verSiglas = ventana(T.nombre - 0.1, T.achu + 0.2);
  const linea = (k: number) => interpolate(t, [T.siglas + k * 0.35, T.siglas + k * 0.35 + 0.3], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={6600} height={2400} fill="#1A1C2E" />

        {/* Cielo con sol */}
        <rect x={60} y={420} width={1000} height={1140} rx={30} fill="#3A5A8A" />
        <circle cx={960} cy={540} r={90 + 8 * Math.sin(t * 4)} fill={SOL} />
        <circle cx={960} cy={540} r={150} fill={SOL} opacity={0.25} />
        {rayos > 0
          ? [0, 1, 2].map((k) => <line key={k} x1={900 - k * 20} y1={590 + k * 25} x2={715} y2={805 + k * 4} stroke={SOL} strokeWidth={10 - k * 2} opacity={0.6 * rayos} />)
          : null}
        {/* Cabeza de perfil */}
        <g transform={`rotate(${sacude} 500 1400)`}>
          <path
            d="M 330 1560 L 360 1240 C 260 1160, 240 980, 270 850 C 300 690, 430 600, 560 600 C 700 600, 780 700, 790 820 L 830 900 L 790 920 L 800 960 C 805 990, 790 1010, 770 1015 L 780 1050 C 770 1100, 720 1120, 660 1120 L 640 1240 L 680 1560 Z"
            fill={PIEL}
          />
          <path d="M 300 760 C 320 640, 450 590, 560 595 C 680 600, 760 660, 790 760 C 700 700, 500 690, 300 760 Z" fill="#3A2A20" />
          <ellipse cx={712} cy={810} rx={22} ry={22 * ojo} fill="#1A1414" />
          <path d={`M 685 ${800 - 4 * (1 - ojo)} Q 712 ${790 + 20 * (1 - ojo)} 740 ${800 - 4 * (1 - ojo)}`} fill="none" stroke="#7A4A34" strokeWidth={6} />
        </g>
        {/* ¡Achú! */}
        {achu > 0 ? (
          <g opacity={achu}>
            {new Array(14).fill(0).map((_, k) => {
              const a = -0.5 + (k / 13) * 1.0;
              const r = 30 + vuelo * (300 + (k % 4) * 60);
              return <circle key={k} cx={830 + r * Math.cos(a)} cy={960 + r * Math.sin(a) + vuelo * vuelo * 60} r={6 + (k % 3) * 3} fill="#C8E8F8" opacity={Math.max(0, 1 - vuelo * 0.8)} />;
            })}
            <text x={850} y={1260} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={110} fontWeight={700} transform={`rotate(-10 850 1260) scale(${1 + 0.1 * Math.exp(-vuelo * 5)})`} style={{ transformOrigin: "850px 1260px" }} stroke="#1A1C2E" strokeWidth={6} paintOrder="stroke">
              ¡ACHÚ!
            </text>
          </g>
        ) : null}
        <rect x={60} y={420} width={1000} height={1140} rx={30} fill="#000000" opacity={oscuro} />
        <Pildora x={600} y={1480} texto="oscuro → sol" color={C.white} o={ventana(T.salen + 0.3, T.sol + 0.4)} tam={44} />

        {/* 1 de cada 4 */}
        <g opacity={verGente}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {[0, 1, 2, 3].map((k) => {
            const x = 1550 + k * 200;
            const elegido = k === 2;
            const c = elegido && t > T.cuatro ? C.yellow : "#6A6A8A";
            return (
              <g key={k}>
                <circle cx={x} cy={900} r={55} fill={c} />
                <rect x={x - 70} y={975} width={140} height={230} rx={60} fill={c} />
                {elegido && t > T.cuatro ? (
                  <text x={x + 60} y={830} fill={C.white} fontFamily={mono} fontSize={44} fontWeight={700}>
                    ¡achú!
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
        <Pildora x={1850} y={1350} texto="1 de cada 4" color={C.yellow} o={ventana(T.cuatro, T.salen)} tam={52} />

        {/* Nervios: óptico y trigémino */}
        <g opacity={verNervios}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <ellipse cx={2860} cy={880} rx={200} ry={170} fill="#C87A9A" opacity={0.35 + 0.4 * pica * (0.5 + 0.5 * Math.sin(t * 10))} />
          <text x={2860} y={760} textAnchor="middle" fill="#F8C8D8" fontFamily={mono} fontSize={34} fontWeight={700}>
            cerebro
          </text>
          <circle cx={3480} cy={880} r={44} fill="#F8F4F0" />
          <circle cx={3470} cy={880} r={20} fill="#3A6AA8" />
          <path d="M 3460 1120 L 3540 1210 L 3450 1220 Z" fill={PIEL} />
          <text x={3480} y={1280} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={32} fontWeight={700}>
            nariz
          </text>
          <path d={ruta(OPT)} fill="none" stroke={OPTICO} strokeWidth={10 + 8 * opt} strokeLinecap="round" strokeLinejoin="round" opacity={0.35 + 0.65 * opt} />
          <path d={ruta(TRI)} fill="none" stroke={TRIGE} strokeWidth={10 + 8 * tri} strokeLinecap="round" strokeLinejoin="round" opacity={0.35 + 0.65 * tri} />
          {/* Señal de luz y salto al nervio vecino */}
          {pulso > 0 && t < T.estornudas ? (
            <circle cx={enRuta(OPT, pulso * 2 > 1 ? 1 : pulso * 2)[0]} cy={enRuta(OPT, pulso * 2 > 1 ? 1 : pulso * 2)[1]} r={22} fill="#FFFFFF" stroke={OPTICO} strokeWidth={6} />
          ) : null}
          {t > T.cruza && t < T.estornudas ? <circle cx={enRuta(TRI, salto)[0]} cy={enRuta(TRI, salto)[1]} r={20} fill="#FFFFFF" stroke={TRIGE} strokeWidth={6} /> : null}
          {chispa > 0
            ? new Array(8).fill(0).map((_, k) => {
                const a = (k / 8) * Math.PI * 2 + t * 3;
                return <line key={k} x1={3150 + 14 * Math.cos(a)} y1={978 + 14 * Math.sin(a)} x2={3150 + 46 * Math.cos(a)} y2={978 + 46 * Math.sin(a)} stroke={C.white} strokeWidth={5} opacity={chispa} />;
              })
            : null}
        </g>
        <Pildora x={2900} y={1380} texto="¡te pica la nariz!" color={TRIGE} o={pica} tam={42} />

        {/* Herencia */}
        <g opacity={verFamilia}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} />
          <path d="M 4350 920 L 4350 1000 M 4180 1000 L 4520 1000 M 4180 1000 L 4180 1060 M 4520 1000 L 4520 1060" fill="none" stroke="#6A6A8A" strokeWidth={8} />
          {(
            [
              [4350, 760, 1, 1.0],
              [4180, 1130, 1, 0.85],
              [4520, 1130, 0, 0.85],
            ] as const
          ).map(([x, y, s, e], k) => (
            <g key={k} transform={`translate(${x} ${y}) scale(${e})`}>
              <circle cy={-60} r={50} fill={s ? C.yellow : "#6A6A8A"} />
              <rect x={-60} y={0} width={120} height={150} rx={50} fill={s ? C.yellow : "#6A6A8A"} />
            </g>
          ))}
        </g>
        <Pildora x={4350} y={1380} texto="≈ 50 % por hijo" color={C.yellow} o={ventana(T.hereda + 0.3, T.nombre)} tam={44} />

        {/* Siglas ACHOO */}
        <g opacity={verSiglas}>
          <Panel x0={5100} y0={600} x1={6100} y1={1460} />
          <text x={5600} y={760} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={70} fontWeight={700} opacity={ventana(T.nombre, T.siglas + 0.2)}>
            ¿ACHOO?
          </text>
          {(
            [
              ["A", "utosomal (Dominant)"],
              ["C", "ompelling"],
              ["H", "elio-"],
              ["O", "phthalmic"],
              ["O", "utburst"],
            ] as const
          ).map(([l, resto], k) => (
            <text key={k} x={5180} y={880 + k * 110} fontFamily={mono} fontWeight={700} opacity={linea(k)}>
              <tspan fill={C.yellow} fontSize={84}>
                {l}
              </tspan>
              <tspan fill={C.white} fontSize={44}>
                {resto}
              </tspan>
            </text>
          ))}
        </g>
      </g>

      {[T.sol, T.destello, T.cruza, T.nombre].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={(q === T.sol || q === T.destello ? 0.45 : 0.2) * destello(q)} />
      ))}
      <Tag x={sx(3300)} y={sy(930)} dx={-40} dy={-200} texto="nervio óptico" color={OPTICO} o={ventana(T.nervio + 0.3, T.nariz)} />
      <Tag x={sx(3300)} y={sy(1060)} dx={-40} dy={200} texto="trigémino" color={TRIGE} o={ventana(T.nariz + 0.3, T.destello)} />
      <Tag x={sx(3150)} y={sy(978)} dx={-120} dy={-170} texto="muy cerca" color={C.white} o={ventana(T.cerca + 0.1, T.nariz + 0.2)} />
    </svg>
  );
};
