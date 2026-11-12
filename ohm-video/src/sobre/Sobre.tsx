import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la botella en el congelador (termómetro, el dedo que golpea y el hielo que la cruza); en el
// centro, las moléculas de agua: sueltas y en desorden hasta que una semilla las ordena en la red hexagonal del hielo.
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho (la botella líquida bajo cero).
const AGUA = "#3A8AD8";
const HIELO = "#E8F4FF";
const OXI = "#4AA8F8";
const SEM = { x: 1850, y: 1040 };
const RED = new Array(9 * 11).fill(0).map((_, i) => {
  const f = Math.floor(i / 11);
  const c = i % 11;
  const x = 1430 + c * 82 + (f % 2) * 41;
  const y = 700 + f * 82;
  return { x, y, d: Math.hypot(x - SEM.x, y - SEM.y), fx: random(`fx${i}`) * 6, fy: random(`fy${i}`) * 6, r: random(`fr${i}`) * 360 };
});
const DENDRITAS = new Array(18).fill(0).map((_, i) => ({ x: 400 + random(`dx${i}`) * 300, y: 640 + random(`dy${i}`) * 780, a: random(`da${i}`) * 180 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 560, 1030, 1.0],
  [T.final - 0.1, 560, 1030, 1.04],
  [T.final + 0.2, 560, 960, 1.35],
  [T.para - 0.1, 560, 960, 1.38],
  [T.para + 0.2, SEM.x, SEM.y, 1.0],
  [T.moleculas - 0.1, SEM.x, SEM.y, 1.03],
  [T.moleculas + 0.2, SEM.x, SEM.y, 1.4],
  [T.punto - 0.1, SEM.x, SEM.y, 1.43],
  [T.punto + 0.2, SEM.x, SEM.y, 1.9],
  [T.ordenarse - 0.1, SEM.x, SEM.y, 1.95],
  [T.ordenarse + 0.2, SEM.x, SEM.y, 1.35],
  [T.purificada - 0.1, SEM.x, SEM.y, 1.38],
  [T.purificada + 0.2, 560, 1030, 1.0],
  [T.quieta - 0.1, 560, 1030, 1.03],
  [T.quieta + 0.2, 560, 1080, 1.25],
  [T.baja - 0.1, 560, 1080, 1.28],
  [T.baja + 0.2, 760, 860, 1.6],
  [T.sobre - 0.1, 760, 860, 1.63],
  [T.sobre + 0.2, 560, 1030, 1.0],
  [T.golpe - 0.1, 560, 1030, 1.03],
  [T.golpe + 0.2, 720, 760, 1.6],
  [T.burbujas - 0.1, 720, 760, 1.63],
  [T.burbujas + 0.2, SEM.x, SEM.y, 1.9],
  [T.semilla - 0.1, SEM.x, SEM.y, 1.95],
  [T.semilla + 0.2, SEM.x, SEM.y, 1.5],
  [T.cristal + 0.2, SEM.x, SEM.y, 1.3],
  [T.cadena + 0.2, SEM.x, SEM.y, 1.0],
  [T.cruza - 0.1, SEM.x, SEM.y, 1.0],
  [T.cruza + 0.2, 560, 1030, 1.0],
  [T.nadie - 0.1, 560, 1030, 1.04],
  [T.nadie + 0.2, SEM.x, SEM.y, 1.15],
  [T.poreso - 0.1, SEM.x, SEM.y, 1.18],
  [T.poreso + 0.2, 560, 1030, 1.0],
  [T.fin + 0.3, 560, 1030, 1.04],
];

export const SobreMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Botella: hielo que avanza desde el golpe y temperatura
  const congela = t > T.golpe && t < T.nadie;
  const frente = congela ? interpolate(t, [T.golpe + 0.3, T.cristal, T.cruza + 1.4], [620, 700, 1450], clamp) : 600;
  const temp = t < T.purificada ? -8 : t < T.cruza ? interpolate(t, [T.baja, T.liquida], [4, -8], clamp) : t < T.nadie ? interpolate(t, [T.cruza + 1.0, T.cruza + 1.8], [-8, 0], clamp) : -8;
  const verTemp = Math.max(ventana(-1, T.para), ventana(T.purificada + 0.4, T.nadie), ventana(T.poreso, T.fin + 2));
  const dedo = ventana(T.golpe - 0.2, T.burbujas + 0.2, 0.2, 0.3);
  const toque = interpolate(t, [T.golpe, T.golpe + 0.12, T.golpe + 0.3], [0, 1, 0], clamp);
  const ola = Math.sin(t * 3) * 6;

  // Moléculas: orden alrededor de la semilla
  const verMol = Math.max(ventana(T.para - 0.1, T.purificada + 0.2), ventana(T.burbujas - 0.1, T.cruza + 0.2), ventana(T.nadie - 0.1, T.poreso + 0.2));
  const R = t < T.purificada ? interpolate(t, [T.ordenarse, T.ordenarse + 1.0], [0, 230], clamp) : t < T.nadie ? interpolate(t, [T.cristal, T.cruza], [0, 1150], clamp) : 0;
  const semilla = Math.max(ventana(T.punto, T.purificada), ventana(T.semilla, T.cruza + 0.2));
  const icono = t < T.burbuja ? 0 : t < T.grieta ? 1 : 2;
  const burbujaGolpe = ventana(T.burbujas, T.semilla + 0.2, 0.2, 0.2);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <clipPath id="botella">
          <path d="M 480 520 L 620 520 L 620 600 Q 720 620 720 700 L 720 1400 Q 720 1440 680 1440 L 420 1440 Q 380 1440 380 1400 L 380 700 Q 380 620 480 600 Z" />
        </clipPath>
      </defs>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={3000} height={2400} fill="#16202E" />
        {/* Congelador */}
        <rect x={80} y={420} width={940} height={1140} rx={30} fill="#1E2C3E" stroke="#5A7A9A" strokeWidth={6} />
        {new Array(4).fill(0).map((_, k) => (
          <line key={k} x1={90} y1={540 + k * 300} x2={1010} y2={540 + k * 300} stroke="#3A5470" strokeWidth={4} />
        ))}
        {/* Botella */}
        <g clipPath="url(#botella)">
          <rect x={370} y={500} width={360} height={960} fill="#2A3A50" />
          <path d={`M 370 ${640 + ola} Q 550 ${640 - ola} 730 ${640 + ola} L 730 1460 L 370 1460 Z`} fill={AGUA} opacity={0.75} />
          {congela ? (
            <g>
              <rect x={370} y={600} width={360} height={frente - 600} fill={HIELO} opacity={0.85} />
              {DENDRITAS.map((d, i) =>
                d.y < frente ? (
                  <g key={i} transform={`translate(${d.x} ${d.y}) rotate(${d.a})`} stroke="#A8C8E8" strokeWidth={4}>
                    <line x1={-40} y1={0} x2={40} y2={0} />
                    <line x1={-20} y1={-34} x2={20} y2={34} />
                    <line x1={20} y1={-34} x2={-20} y2={34} />
                  </g>
                ) : null,
              )}
              <rect x={370} y={frente - 14} width={360} height={14} fill="#FFFFFF" opacity={t < T.cruza + 1.4 ? 0.9 : 0} />
            </g>
          ) : null}
        </g>
        <path d="M 480 520 L 620 520 L 620 600 Q 720 620 720 700 L 720 1400 Q 720 1440 680 1440 L 420 1440 Q 380 1440 380 1400 L 380 700 Q 380 620 480 600 Z" fill="none" stroke="#C8E0F8" strokeWidth={6} opacity={0.8} />
        <rect x={470} y={460} width={160} height={64} rx={10} fill="#2A6AC8" />
        <rect x={400} y={720} width={30} height={600} rx={15} fill="#FFFFFF" opacity={0.18} />
        {/* Dedo que golpea */}
        <g opacity={dedo} transform={`translate(${30 * (1 - toque)} 0)`}>
          <rect x={735} y={690} width={300} height={80} rx={40} fill="#E8B090" />
          <rect x={740} y={700} width={46} height={60} rx={18} fill="#F8D8C8" />
        </g>
        {toque > 0 ? <circle cx={720} cy={730} r={30 + 90 * toque} fill="none" stroke={C.yellow} strokeWidth={6} opacity={toque} /> : null}
        <Pildora x={850} y={830} texto={`${temp >= 0.5 ? Math.round(temp) : temp > -0.5 ? "0" : `−${Math.round(-temp)}`} °C`} color={temp > 0.5 ? C.white : C.cyan} o={verTemp} tam={52} />
        <Pildora x={550} y={1500} texto="¡líquida!" color={C.yellow} o={Math.max(ventana(-1, T.final), ventana(T.liquida, T.golpe), ventana(T.poreso, T.fin + 2))} tam={46} />

        {/* Moléculas de agua */}
        <g opacity={verMol}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {R > 0
            ? RED.map((m, i) => {
                const o = Math.max(0, Math.min(1, (R - m.d) / 70));
                if (o <= 0 || i % 11 === 10) {
                  return null;
                }
                const vecino = RED[i + 1];
                return <line key={`e${i}`} x1={m.x} y1={m.y} x2={vecino.x} y2={vecino.y} stroke={HIELO} strokeWidth={3} opacity={0.5 * o} />;
              })
            : null}
          {RED.map((m, i) => {
            const o = Math.max(0, Math.min(1, (R - m.d) / 70));
            const jx = (1 - o) * 26 * Math.sin(t * (2 + m.fx) + i);
            const jy = (1 - o) * 26 * Math.cos(t * (2 + m.fy) + i * 1.3);
            const rot = (1 - o) * (m.r + t * 90 * (m.fx - 3));
            return (
              <g key={i} transform={`translate(${m.x + jx} ${m.y + jy}) rotate(${rot})`}>
                <circle r={16} fill={o > 0.5 ? HIELO : OXI} />
                <circle cx={-15} cy={13} r={9} fill="#FFFFFF" />
                <circle cx={15} cy={13} r={9} fill="#FFFFFF" />
              </g>
            );
          })}
          {/* Semilla: impureza, burbuja o grieta */}
          <g opacity={semilla} transform={`translate(${SEM.x} ${SEM.y})`}>
            {t < T.purificada ? (
              icono === 0 ? (
                <path d="M -26 -10 L -8 -28 L 18 -20 L 28 6 L 10 26 L -18 20 Z" fill="#8A6A3A" stroke={C.yellow} strokeWidth={5} />
              ) : icono === 1 ? (
                <circle r={30} fill="none" stroke={C.yellow} strokeWidth={6} />
              ) : (
                <path d="M -60 -40 L -20 -10 L -30 10 L 20 30 L 60 50" fill="none" stroke={C.yellow} strokeWidth={8} strokeLinejoin="round" />
              )
            ) : (
              <path d="M 0 -34 L 10 -10 L 34 0 L 10 10 L 0 34 L -10 10 L -34 0 L -10 -10 Z" fill={C.yellow} />
            )}
          </g>
          {burbujaGolpe > 0
            ? [0, 1, 2, 3].map((k) => {
                const p = (t * 1.8 + k / 4) % 1;
                return <circle key={k} cx={SEM.x + (k - 1.5) * 50} cy={SEM.y + 40 - p * 80} r={10 + 22 * p} fill="none" stroke={C.white} strokeWidth={4} opacity={burbujaGolpe * (1 - p)} />;
              })
            : null}
        </g>
        <Pildora x={SEM.x} y={1390} texto="esperando una semilla…" color={C.white} o={ventana(T.nadie + 0.3, T.poreso)} tam={38} />
      </g>

      {[T.golpe, T.cristal, T.cruza].map((d) => (
        <rect key={d} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(d)} />
      ))}
      <Tag x={sx(SEM.x)} y={sy(SEM.y)} dx={-60} dy={-210} texto={["impureza", "burbuja", "grieta"][icono]} color={C.yellow} o={ventana(T.impureza, T.ordenarse)} />
      <Tag x={sx(SEM.x)} y={sy(SEM.y)} dx={60} dy={-210} texto="semilla" color={C.yellow} o={ventana(T.semilla, T.cristal)} />
      <Tag x={sx(1430 + 82 * 2)} y={sy(700 + 82 * 2)} dx={40} dy={-170} texto="molécula de agua" color={OXI} o={ventana(T.moleculas + 0.2, T.punto)} />
    </svg>
  );
};
