import { interpolate } from "remotion";
import { Cara } from "../components/Cara";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una persona dormida con el despertador y la nube del sueño (vuela, un perro le habla); en el
// centro, el hipnograma de la noche con fases REM cada vez más largas hasta la alarma; a la derecha, el cerebro con las
// zonas de emociones e imágenes encendidas y la corteza prefrontal apagada.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const REM = "#E8414F";
const NIVEL = [780, 880, 980, 1080, 1200]; // despierto, REM, N1, N2, N3
const X0 = 1420;
const X1 = 2300;

// Hipnograma: 5 ciclos de ~90 min, con REM cada vez más largo y sueño profundo cada vez más corto
const HIPNO: { x: number; y: number; rem: boolean }[] = (() => {
  const pts: { x: number; y: number; rem: boolean }[] = [{ x: X0, y: NIVEL[0], rem: false }];
  const ancho = (X1 - X0) / 5;
  const remW = [12, 28, 45, 62, 80];
  const fondo = [4, 4, 3, 3, 3];
  for (let i = 0; i < 5; i++) {
    const a = X0 + i * ancho;
    const r = remW[i];
    const resto = ancho - r;
    pts.push({ x: a + resto * 0.15, y: NIVEL[2], rem: false });
    pts.push({ x: a + resto * 0.3, y: NIVEL[3], rem: false });
    pts.push({ x: a + resto * 0.45, y: NIVEL[fondo[i]], rem: false });
    pts.push({ x: a + resto * 0.7, y: NIVEL[fondo[i]], rem: false });
    pts.push({ x: a + resto * 0.85, y: NIVEL[2], rem: false });
    pts.push({ x: a + resto, y: NIVEL[1], rem: true });
    pts.push({ x: a + ancho, y: NIVEL[1], rem: false });
  }
  pts.push({ x: X1, y: NIVEL[0], rem: false });
  return pts;
})();

const camaraKeys = (): ClaveCamara[] => [
  [0, 520, 1000, 0.95],
  [T.final - 0.1, 520, 1000, 0.98],
  [T.final + 0.2, 620, 820, 1.4],
  [T.sueno - 0.1, 620, 820, 1.43],
  [T.sueno + 0.2, 1850, 1030, 1.0],
  [T.noventa - 0.1, 1850, 1030, 1.03],
  [T.noventa + 0.2, 1560, 1030, 1.5],
  [T.fase - 0.1, 1560, 1030, 1.53],
  [T.fase + 0.2, 1850, 1030, 1.0],
  [T.rem - 0.1, 1850, 1030, 1.03],
  [T.rem + 0.2, 1850, 920, 1.35],
  [T.alarga - 0.1, 1850, 920, 1.38],
  [T.alarga + 0.2, 1850, 1030, 1.0],
  [T.principio - 0.1, 1850, 1030, 1.03],
  [T.principio + 0.2, 1560, 920, 1.7],
  [T.manana - 0.1, 1560, 920, 1.73],
  [T.manana + 0.2, 2180, 920, 1.6],
  [T.poreso - 0.1, 2180, 920, 1.63],
  [T.poreso + 0.2, 520, 1000, 0.95],
  [T.alarma - 0.1, 520, 1000, 0.98],
  [T.alarma + 0.2, 120, 1050, 1.7],
  [T.cortarte - 0.1, 120, 1050, 1.73],
  [T.cortarte + 0.2, 620, 840, 1.3],
  [T.recuerdas - 0.1, 620, 840, 1.33],
  [T.recuerdas + 0.2, 360, 1060, 1.6],
  [T.enrem - 0.1, 360, 1060, 1.63],
  [T.enrem + 0.2, 3100, 1030, 1.0],
  [T.emociones - 0.1, 3100, 1030, 1.03],
  [T.emociones + 0.2, 3080, 1080, 1.5],
  [T.imagenes - 0.1, 3080, 1080, 1.53],
  [T.imagenes + 0.2, 2860, 1000, 1.5],
  [T.activas - 0.1, 2860, 1000, 1.53],
  [T.activas + 0.2, 3100, 1030, 1.0],
  [T.pero - 0.1, 3100, 1030, 1.03],
  [T.pero + 0.2, 3360, 950, 1.6],
  [T.apaga - 0.1, 3360, 950, 1.63],
  [T.apaga + 0.2, 3100, 1030, 1.05],
  [T.volar - 0.1, 3100, 1030, 1.08],
  [T.volar + 0.2, 620, 820, 1.4],
  [T.perro - 0.1, 620, 820, 1.43],
  [T.perro + 0.2, 700, 860, 1.6],
  [T.normal - 0.1, 700, 860, 1.63],
  [T.normal + 0.2, 620, 860, 1.3],
  [T.cuando - 0.1, 620, 860, 1.33],
  [T.cuando + 0.25, 520, 1000, 0.95],
  [T.fin + 0.3, 520, 1000, 0.98],
];

export const SuenosMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Dormitorio
  const suena = t < T.final - 0.3 || t > T.cuando || (t > T.alarma && t < T.recuerdas + 0.5) ? 1 : 0;
  const tiembla = suena ? Math.sin(t * 50) * 6 : 0;
  const despierta = t > T.recuerdas && t < T.enrem ? 1 : 0;
  const nube = Math.max(ventana(-1, T.sueno + 0.2), ventana(T.volar - 0.2, T.fin + 2), t > T.cortarte - 0.2 && t < T.cortarte + 0.6 ? interpolate(t, [T.cortarte, T.cortarte + 0.5], [1, 0], clamp) : 0);
  const pop = interpolate(t, [T.cortarte, T.cortarte + 0.5], [1, 1.5], clamp);
  const vuela = Math.sin(t * 2) * 30;
  const habla = ventana(T.perro, T.cuando + 0.2);

  // Hipnograma
  const verHipno = ventana(T.sueno - 0.1, T.poreso + 0.2);
  const revela = interpolate(t, [T.ciclos, T.manana + 0.4], [0.2, 1], clamp);
  const xRevela = X0 + (X1 - X0) * revela;

  // Cerebro
  const verCerebro = ventana(T.enrem - 0.1, T.volar + 0.2);
  const emo = interpolate(t, [T.emociones - 0.2, T.emociones + 0.4], [0.2, 1], clamp);
  const ima = interpolate(t, [T.imagenes - 0.2, T.imagenes + 0.4], [0.2, 1], clamp);
  const pre = interpolate(t, [T.prefrontal, T.apaga + 0.3], [1, 0.12], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <clipPath id="revela">
          <rect x={X0 - 10} y={700} width={xRevela - X0 + 10} height={600} />
        </clipPath>
      </defs>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#12142A" />

        {/* Dormitorio */}
        <rect x={-100} y={480} width={1200} height={1100} rx={20} fill="#1A1E3A" />
        <rect x={0} y={1110} width={150} height={260} rx={10} fill="#5A4030" />
        <g transform={`translate(${75 + tiembla} 1060)`}>
          <circle r={56} fill="#E8E6F0" stroke="#C83A3A" strokeWidth={10} />
          <line x1={0} y1={0} x2={0} y2={-34} stroke="#1A1A1A" strokeWidth={6} />
          <line x1={0} y1={0} x2={24} y2={10} stroke="#1A1A1A" strokeWidth={6} />
          <circle cx={-40} cy={-56} r={18} fill="#C83A3A" />
          <circle cx={40} cy={-56} r={18} fill="#C83A3A" />
        </g>
        {suena ? (
          <text x={110} y={940} fill={C.yellow} fontFamily={mono} fontSize={52} fontWeight={700} transform={`rotate(-10 110 940)`}>
            ¡RIIING!
          </text>
        ) : null}
        <rect x={170} y={980} width={40} height={330} rx={10} fill="#7A5A40" />
        <rect x={190} y={1170} width={780} height={130} rx={20} fill="#E8E6F0" />
        <ellipse cx={290} cy={1150} rx={90} ry={40} fill="#F8F4F0" />
        <rect x={400} y={1100} width={560} height={110} rx={50} fill="#3A5A9A" />
        <path d="M 420 1130 Q 600 1110 940 1140" fill="none" stroke="#2A4A8A" strokeWidth={6} />
        <Cara x={320} y={1095} escala={1.4} giro={-90} ojos={despierta} miedo={despierta * 0.4} />
        {/* Nube del sueño */}
        {nube > 0 ? (
          <g opacity={nube} transform={`translate(640 800) scale(${t > T.cortarte && t < T.cortarte + 0.6 ? pop : 1}) translate(-640 -800)`}>
            <circle cx={420} cy={1010} r={18} fill="#E8E6F0" />
            <circle cx={470} cy={950} r={28} fill="#E8E6F0" />
            <ellipse cx={660} cy={790} rx={300} ry={200} fill="#E8E6F0" />
            {[-200, -80, 60, 190].map((dx) => (
              <circle key={dx} cx={660 + dx} cy={630 + Math.abs(dx) * 0.2} r={90} fill="#E8E6F0" />
            ))}
            {/* Persona que vuela */}
            <g transform={`translate(560 ${780 + vuela * 0.5})`}>
              <path d="M -10 0 L -120 30 L -10 40 Z" fill={REM} />
              <circle cx={40} cy={10} r={24} fill="#C98A64" />
              <rect x={-60} y={0} width={90} height={30} rx={14} fill="#3A6AC8" />
            </g>
            {/* Perro que habla */}
            <g transform="translate(790 860)">
              <ellipse cx={0} cy={0} rx={70} ry={40} fill="#C8925A" />
              <circle cx={70} cy={-30} r={32} fill="#C8925A" />
              <ellipse cx={60} cy={-58} rx={12} ry={22} fill="#8A5A2A" />
              <circle cx={82} cy={-36} r={5} fill="#1A1A1A" />
              {[-50, -10, 30].map((dx) => (
                <rect key={dx} x={dx} y={30} width={14} height={40} fill="#C8925A" />
              ))}
            </g>
            {habla > 0 ? (
              <g opacity={habla}>
                <rect x={810} y={660} width={180} height={80} rx={20} fill={C.white} stroke="#1A1A2A" strokeWidth={4} />
                <text x={900} y={712} textAnchor="middle" fill="#1A1A2A" fontFamily={mono} fontSize={38} fontWeight={700}>
                  ¡hola!
                </text>
              </g>
            ) : null}
          </g>
        ) : null}
        <Pildora x={620} y={1060} texto="¿absurdo?" color={C.white} o={ventana(T.final + 0.2, T.sueno)} tam={44} />
        <Pildora x={620} y={1060} texto="¡normal!" color={C.yellow} o={ventana(T.normal, T.cuando)} tam={48} />

        {/* Hipnograma */}
        <g opacity={verHipno}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {["despierto", "REM", "ligero", "medio", "profundo"].map((n, k) => (
            <g key={n}>
              <line x1={X0} y1={NIVEL[k]} x2={X1} y2={NIVEL[k]} stroke="#3A3360" strokeWidth={2} />
              <text x={X0 + 4} y={NIVEL[k] - 10} fill={k === 1 ? REM : C.grey} fontFamily={mono} fontSize={24} fontWeight={700}>
                {n}
              </text>
            </g>
          ))}
          <g clipPath="url(#revela)">
            <path d={`M ${HIPNO.map((p) => `${p.x} ${p.y}`).join(" L ")}`} fill="none" stroke={C.cyan} strokeWidth={6} strokeLinejoin="round" />
            {HIPNO.map((p, i) => (p.rem ? <line key={i} x1={p.x} y1={p.y} x2={HIPNO[i + 1].x} y2={p.y} stroke={REM} strokeWidth={18} strokeLinecap="round" /> : null))}
          </g>
          <text x={X0} y={1360} fill={C.grey} fontFamily={mono} fontSize={30} fontWeight={700}>
            23:00
          </text>
          <text x={X1} y={1360} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={30} fontWeight={700}>
            7:00
          </text>
          <g opacity={ventana(T.manana, T.poreso + 0.2)}>
            <line x1={X1 - 30} y1={740} x2={X1 - 30} y2={1300} stroke={C.yellow} strokeWidth={6} strokeDasharray="14 10" />
          </g>
        </g>
        <Pildora x={1560} y={1400} texto="90 min" color={C.cyan} o={ventana(T.noventa, T.fase)} tam={46} />
        <Pildora x={2180} y={720} texto="≈ 1 hora de REM" color={REM} o={ventana(T.manana, T.poreso)} tam={40} />

        {/* Cerebro */}
        <g opacity={verCerebro}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={3040} y={1180} width={70} height={190} rx={30} fill="#3A3355" stroke="#8A7AB8" strokeWidth={6} transform="rotate(-12 3075 1180)" />
          <path d="M 2700 1060 C 2680 860, 2860 720, 3080 720 C 3330 720, 3500 860, 3500 1030 C 3500 1160, 3420 1240, 3300 1250 C 3000 1260, 2800 1260, 2700 1060 Z" fill="#3A3355" stroke="#8A7AB8" strokeWidth={6} />
          {["M 2800 900 Q 2900 860 2960 930 Q 3020 1000 3100 950", "M 3150 820 Q 3240 870 3200 960 Q 3170 1040 3260 1080", "M 2760 1080 Q 2860 1040 2940 1120 Q 3000 1180 3120 1150", "M 3300 1150 Q 3380 1080 3460 1120"].map((d) => (
            <path key={d} d={d} fill="none" stroke="#5A4A80" strokeWidth={8} strokeLinecap="round" />
          ))}
          <circle cx={3360} cy={950} r={110} fill="#6AB8F8" opacity={0.15 + 0.6 * pre * ventana(T.pero - 0.3, T.volar + 0.2)} />
          <circle cx={2850} cy={1000} r={100} fill={C.orange} opacity={0.6 * ima * ventana(T.imagenes - 0.3, T.volar + 0.2)} />
          <circle cx={3080} cy={1090} r={80} fill={REM} opacity={0.7 * emo * ventana(T.emociones - 0.3, T.volar + 0.2)} />
          {pre < 0.5 ? (
            <text x={3400} y={860} fill="#C8CED8" fontFamily={mono} fontSize={44} fontWeight={700} opacity={1 - pre * 2}>
              zzz
            </text>
          ) : null}
        </g>
        <Pildora x={3100} y={1400} texto="emociones e imágenes: ON" color={C.orange} o={ventana(T.activas, T.pero)} tam={36} />
        <Pildora x={3100} y={1400} texto="lógica: casi OFF" color={C.cyan} o={ventana(T.prefrontal + 1.2, T.volar)} tam={42} />
      </g>

      {[T.rem, T.alarma, T.enrem, T.apaga].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(3080)} y={sy(1090)} dx={-140} dy={210} texto="emociones" color={REM} o={ventana(T.emociones + 0.3, T.imagenes)} />
      <Tag x={sx(2850)} y={sy(1000)} dx={60} dy={-220} texto="imágenes" color={C.orange} o={ventana(T.imagenes + 0.3, T.activas + 0.4)} />
      <Tag x={sx(3360)} y={sy(950)} dx={-140} dy={-200} texto="corteza prefrontal" color="#6AB8F8" o={ventana(T.prefrontal + 0.2, T.apaga)} />
    </svg>
  );
};
