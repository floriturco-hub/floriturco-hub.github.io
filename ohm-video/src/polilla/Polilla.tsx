import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, un bosque de noche con una ventana que refleja la linterna y una polilla cuyos ojos no reflejan;
// luego, un borde aire-vidrio que refleja; el ojo de polilla al microscopio (bultitos, rampa suave); y paneles solares.
const LUZ = "#F8F0B0";
const POLILLA = { x: 700, y: 1040 };

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1000, 1.12],
  [T.luz - 0.3, 550, 1000, 1.16],
  [T.luz + 0.5, 1850, 1030, 1.0],
  [T.polillas - 0.3, 1850, 1030, 1.02],
  [T.polillas + 0.5, 650, 1020, 1.5],
  [T.microscopio - 0.3, 650, 1020, 1.55],
  [T.microscopio + 0.5, 3100, 1030, 1.0],
  [T.gana - 0.3, 3100, 1030, 1.02],
  [T.gana + 0.5, 600, 1000, 1.2],
  [T.hoy - 0.3, 600, 1000, 1.24],
  [T.hoy + 0.5, 4300, 1030, 1.0],
  [T.final - 0.3, 4300, 1030, 1.02],
  [T.final + 0.5, 650, 1020, 1.5],
  [T.fin + 2, 650, 1020, 1.56],
];

// Polilla vista desde arriba
const Polilla: React.FC<{ readonly t: number; readonly brillo: number }> = ({ t, brillo }) => (
  <g transform={`translate(${POLILLA.x} ${POLILLA.y})`}>
    {[-1, 1].map((l) => (
      <g key={l} transform={`scale(${l} 1) rotate(${Math.sin(t * 1.5) * 2})`}>
        <path d="M 10 -50 C 120 -150, 260 -110, 270 -50 C 240 10, 140 40, 20 20 Z" fill="#8A7058" />
        <path d="M 20 -30 C 110 -100, 200 -90, 240 -50" fill="none" stroke="#5A4434" strokeWidth={6} />
        <circle cx={150} cy={-50} r={22} fill="#5A4434" />
        <circle cx={150} cy={-50} r={10} fill="#C8A878" />
        <path d="M 14 20 C 120 30, 190 90, 150 150 C 100 160, 40 110, 10 60 Z" fill="#7A6048" />
        <path d="M 50 -110 C 30 -170, 60 -220, 90 -240" fill="none" stroke="#5A4434" strokeWidth={4} />
        {[0, 1, 2, 3, 4].map((k) => (
          <line key={k} x1={58 + k * 8} y1={-150 - k * 18} x2={72 + k * 8} y2={-146 - k * 18} stroke="#5A4434" strokeWidth={3} />
        ))}
      </g>
    ))}
    <ellipse cx={0} cy={10} rx={26} ry={100} fill="#6A5240" />
    <circle cx={0} cy={-96} r={30} fill="#6A5240" />
    {[-18, 18].map((x) => (
      <g key={x}>
        <circle cx={x} cy={-104} r={16} fill="#050308" />
        <circle cx={x - 4} cy={-108} r={4} fill="#FFFFFF" opacity={0.08 * brillo} />
      </g>
    ))}
  </g>
);

export const PolillaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Linterna que barre la escena
  const objetivo = 150 + 650 * (0.5 + 0.5 * Math.sin(t * 1.6));
  const enVentana = Math.max(0, 1 - Math.abs(objetivo - 220) / 120);
  const reflejoCero = ventana(-1, T.luz) + ventana(T.casiNo, T.microscopio);
  const atrapa = ventana(T.atrapa, T.noBrillan + 0.3);
  const murcielago = interpolate(t, [T.noBrillan - 0.3, T.hoy], [0, 1], clamp);

  // Borde aire-vidrio
  const borde = ventana(T.luz - 0.3, T.polillas + 0.3, 0.6, 0.6);
  const entra = interpolate(t, [T.luz + 0.2, T.luz + 1.2], [0, 1], clamp);
  const rebota = interpolate(t, [T.rebota - 0.2, T.rebota + 0.5], [0, 1], clamp);

  // Microscopio
  const micro = ventana(T.microscopio - 0.3, T.gana + 0.3, 0.6, 0.6);
  const facetas = ventana(T.microscopio - 0.3, T.bultitos + 0.2);
  const perfil = interpolate(t, [T.bultitos - 0.1, T.bultitos + 0.5], [0, 1], clamp);
  const onda = interpolate(t, [T.pequenos - 0.2, T.pequenos + 0.4], [0, 1], clamp);
  const rampa = interpolate(t, [T.rampa - 0.2, T.rampa + 0.6], [0, 1], clamp);
  const sinBorde = interpolate(t, [T.sinBorde, T.sinBorde + 1.0], [0, 1], clamp);

  // Paneles solares
  const paneles = ventana(T.hoy - 0.3, T.final + 0.3, 0.6, 0.6);
  const absorben = interpolate(t, [T.absorban - 0.3, T.absorban + 0.6], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Bosque de noche */}
        <rect x={-300} y={-400} width={1500} height={2400} fill="#0A1018" />
        <rect x={480} y={300} width={460} height={1500} fill="#3A2A20" />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <path key={k} d={`M ${510 + k * 70} 300 q 20 400 -10 800 q -20 300 10 700`} fill="none" stroke="#2A1E16" strokeWidth={10} />
        ))}
        {/* Ventana */}
        <rect x={60} y={700} width={320} height={480} fill="#1A2A3A" stroke="#5A4A3A" strokeWidth={16} />
        <line x1={220} y1={700} x2={220} y2={1180} stroke="#5A4A3A" strokeWidth={10} />
        <path d="M 90 760 L 190 760 L 120 1000 Z" fill="#FFFFFF" opacity={0.06 + 0.8 * enVentana} />
        <circle cx={220} cy={940} r={90} fill={LUZ} opacity={0.6 * enVentana} />
        {/* Haz de la linterna */}
        <path d={`M -100 1700 L ${objetivo - 90} ${960} L ${objetivo + 90} ${1060} Z`} fill={LUZ} opacity={0.12} />
        <circle cx={objetivo} cy={1010} r={110} fill={LUZ} opacity={0.12} />
        <Polilla t={t} brillo={1} />
        {/* Más luz que entra en los ojos */}
        {atrapa > 0
          ? [-40, 0, 40].map((dx, k) => <line key={k} x1={POLILLA.x + dx * 3} y1={POLILLA.y - 300} x2={POLILLA.x + (k - 1) * 18} y2={POLILLA.y - 108} stroke={LUZ} strokeWidth={4} opacity={atrapa * 0.8} />)
          : null}
        {/* Murciélago que no la encuentra */}
        {murcielago > 0 && murcielago < 1 ? (
          <g transform={`translate(${-100 + 1200 * murcielago} ${700 + Math.sin(murcielago * 12) * 60})`}>
            <path d="M 0 0 C -40 -40, -80 -20, -110 -40 C -90 0, -60 10, -40 20 C -20 10, -10 10, 0 20 C 10 10, 20 10, 40 20 C 60 10, 90 0, 110 -40 C 80 -20, 40 -40, 0 0 Z" fill="#1A1420" stroke="#4A3A5A" strokeWidth={3} />
            <text x={0} y={-50} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
              ?
            </text>
          </g>
        ) : null}
        <Pildora x={700} y={760} texto="reflejo ≈ 0" color={LUZ} o={Math.min(1, reflejoCero)} tam={48} />

        {/* Borde aire-vidrio */}
        <g opacity={borde}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <rect x={1360} y={1030} width={980} height={410} fill="#3A7AB8" opacity={0.5} />
          <text x={1400} y={700} fill={C.grey} fontFamily={mono} fontSize={34}>
            aire
          </text>
          <text x={1400} y={1400} fill="#8AC8F8" fontFamily={mono} fontSize={34}>
            vidrio
          </text>
          <path d={`M 1500 680 L ${1500 + (1850 - 1500) * Math.min(1, entra * 1.4)} ${680 + (1030 - 680) * Math.min(1, entra * 1.4)}`} stroke={LUZ} strokeWidth={10} />
          {entra > 0.7 ? <path d="M 1850 1030 L 2050 1400" stroke={LUZ} strokeWidth={8} opacity={0.7} /> : null}
          {rebota > 0 ? <path d={`M 1850 1030 L ${1850 + 350 * rebota} ${1030 - 350 * rebota}`} stroke={C.red} strokeWidth={8} /> : null}
          {rebota > 0 ? <circle cx={1850} cy={1030} r={30} fill={LUZ} opacity={0.4} /> : null}
        </g>

        {/* Ojo de polilla al microscopio */}
        <g opacity={micro}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          {/* Facetas del ojo compuesto */}
          <g opacity={facetas}>
            {new Array(7).fill(0).map((_, f) =>
              new Array(8).fill(0).map((__, c) => {
                const x = 2720 + c * 110 + (f % 2) * 55;
                const y = 720 + f * 95;
                return <polygon key={`${f}-${c}`} points={new Array(6).fill(0).map((___, k) => `${x + Math.cos((k * Math.PI) / 3 + Math.PI / 6) * 58},${y + Math.sin((k * Math.PI) / 3 + Math.PI / 6) * 58}`).join(" ")} fill="#1A1420" stroke="#5A4A6A" strokeWidth={4} />;
              }),
            )}
          </g>
          {/* Perfil con bultitos */}
          <g opacity={perfil}>
            <rect x={2620} y={1140} width={960} height={300} fill="#3A2A4A" />
            <path d={`M 2620 1140 ${new Array(24).fill(0).map((_, k) => `Q ${2640 + k * 40} 1060 ${2660 + k * 40} 1140`).join(" ")}`} fill="#3A2A4A" />
            <text x={3560} y={1420} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={30}>
              bultitos ≈ 200 nm
            </text>
          </g>
          {onda > 0 ? <path d={`M 2620 750 ${new Array(48).fill(0).map((_, k) => `L ${2620 + k * 20} ${750 + Math.sin(k * 0.52 - t * 4) * 50}`).join(" ")}`} fill="none" stroke={LUZ} strokeWidth={6} opacity={onda} /> : null}
          {onda > 0 ? (
            <text x={2640} y={680} fill={LUZ} fontFamily={mono} fontSize={30} fontWeight={700} opacity={onda}>
              luz ≈ 500 nm
            </text>
          ) : null}
          {/* Rampa suave contra borde brusco */}
          <g opacity={rampa} transform="translate(0 -40)">
            <path d="M 2700 1010 L 2900 1010 L 2900 920 L 3060 920" fill="none" stroke={C.red} strokeWidth={8} />
            <text x={2880} y={890} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={28} fontWeight={700}>
              borde brusco
            </text>
            <path d="M 3160 1010 L 3260 1010 C 3320 1010, 3360 920, 3420 920 L 3520 920" fill="none" stroke={C.cyan} strokeWidth={8} />
            <text x={3340} y={890} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={28} fontWeight={700}>
              rampa suave
            </text>
          </g>
          {sinBorde > 0 ? <path d={`M 3300 640 L 3300 ${640 + 600 * sinBorde}`} stroke={LUZ} strokeWidth={10} opacity={0.8} /> : null}
        </g>

        {/* Paneles solares con «ojo de polilla» */}
        <g opacity={paneles}>
          <Panel x0={3800} y0={600} x1={4800} y1={1460} />
          {[0, 1].map((k) => {
            const x0 = 3860 + k * 480;
            return (
              <g key={k}>
                <text x={x0 + 200} y={690} textAnchor="middle" fill={k === 0 ? C.grey : C.cyan} fontFamily={mono} fontSize={34} fontWeight={700}>
                  {k === 0 ? "normal" : "ojo de polilla"}
                </text>
                <path d={`M ${x0} 1100 L ${x0 + 400} 1100 L ${x0 + 360} 900 L ${x0 + 40} 900 Z`} fill="#1A3A6A" stroke="#8A9AB8" strokeWidth={4} />
                {[1, 2, 3].map((c) => (
                  <line key={c} x1={x0 + 40 + c * 80} y1={900} x2={x0 + c * 100} y2={1100} stroke="#8A9AB8" strokeWidth={2} />
                ))}
                <path d={`M ${x0 + 120} 760 L ${x0 + 200} 980`} stroke={LUZ} strokeWidth={8} />
                {k === 0 ? <path d={`M ${x0 + 200} 980 L ${x0 + 300} 780`} stroke={C.red} strokeWidth={8} /> : null}
                <rect x={x0 + 60} y={1200} width={280} height={36} rx={10} fill="#2A2440" />
                <rect x={x0 + 60} y={1200} width={280 * (k === 0 ? 0.7 : 0.7 + 0.25 * absorben)} height={36} rx={10} fill={C.yellow} />
                <text x={x0 + 200} y={1290} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={26}>
                  energía
                </text>
              </g>
            );
          })}
        </g>
      </g>

      <Tag x={sx(2030)} y={sy(850)} dx={60} dy={-170} texto="reflejo" color={LUZ} o={ventana(T.ventanas, T.polillas + 0.4)} />
      <Tag x={sx(POLILLA.x - 18)} y={sy(POLILLA.y - 104)} dx={-160} dy={-200} texto="ojos sin reflejo" color={C.white} o={ventana(T.polillas + 0.3, T.microscopio)} />
      <Tag x={sx(2900)} y={sy(1100)} dx={-100} dy={-260} texto="bultitos" color="#B88AF8" o={ventana(T.bultitos + 0.3, T.paraLuz)} />
    </svg>
  );
};
