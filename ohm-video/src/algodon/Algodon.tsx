import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la máquina de feria (olla, cabeza caliente que gira y la nube en el palito); en el centro, la
// cabeza vista desde arriba (azúcar que se derrite y chorros que salen por los agujeros); a la derecha, por qué queda
// como vidrio (cristal ordenado frente a vidrio desordenado, caramelo duro); al fondo, la nube frente a una lata.
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho (los hilos de vidrio de cerca).
const ROSA = "#F8A8C8";
const HILO = "#FFE0F0";
const CALIENTE = "#F8883A";
const AMBAR = "#E8A040";
const NUBE = new Array(26).fill(0).map((_, i) => ({ a: random(`na${i}`) * Math.PI * 2, r: Math.sqrt(random(`nr${i}`)), s: 0.5 + random(`ns${i}`) * 0.5 }));
const HEBRAS = new Array(50).fill(0).map((_, i) => ({
  x0: (random(`hx${i}`) - 0.5) * 1.8,
  y0: (random(`hy${i}`) - 0.5) * 1.6,
  dx: (random(`hd${i}`) - 0.5) * 1.4,
  dy: (random(`he${i}`) - 0.5) * 0.9,
  c: (random(`hc${i}`) - 0.5) * 1.2,
}));
const GRANOS = new Array(14).fill(0).map((_, i) => ({ x: (random(`gx${i}`) - 0.5) * 180, y: (random(`gy${i}`) - 0.5) * 180, d: random(`gd${i}`) * 0.6 }));
const DESORDEN = new Array(25).fill(0).map((_, i) => ({ x: 3180 + random(`vx${i}`) * 300, y: 860 + random(`vy${i}`) * 320 }));
const HC = { x: 1850, y: 1030 };

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 780, 1.7],
  [T.final - 0.4, 550, 780, 1.78],
  [T.final - 0.1, 550, 950, 0.95],
  [T.centro - 0.1, 550, 950, 0.98],
  [T.centro + 0.2, 550, 1100, 1.5],
  [T.miles - 0.1, 550, 1100, 1.55],
  [T.miles + 0.2, HC.x, HC.y, 1.0],
  [T.cae - 0.1, HC.x, HC.y, 1.03],
  [T.cae + 0.2, HC.x, HC.y, 1.45],
  [T.derrite - 0.1, HC.x, HC.y, 1.5],
  [T.derrite + 0.2, HC.x, HC.y, 1.25],
  [T.girar - 0.1, HC.x, HC.y, 1.28],
  [T.girar + 0.2, HC.x, HC.y, 1.05],
  [T.lanza - 0.1, HC.x, HC.y, 1.08],
  [T.lanza + 0.6, HC.x, HC.y, 0.95],
  [T.hilos - 0.1, HC.x, HC.y, 0.97],
  [T.hilos + 0.2, 2080, 1030, 2.0],
  [T.aire - 0.1, 2080, 1030, 2.05],
  [T.aire + 0.2, 3100, 1030, 1.05],
  [T.cristales - 0.1, 3100, 1030, 1.08],
  [T.cristales + 0.2, 3100, 1030, 1.0],
  [T.vidrio - 0.1, 3100, 1030, 1.02],
  [T.vidrio + 0.2, 3330, 1030, 1.5],
  [T.caramelo - 0.1, 3330, 1030, 1.52],
  [T.caramelo + 0.2, 3100, 1030, 1.0],
  [T.enredan - 0.1, 3100, 1030, 1.03],
  [T.enredan + 0.2, 550, 950, 0.95],
  [T.casi - 0.1, 550, 950, 0.98],
  [T.casi + 0.2, 550, 780, 1.6],
  [T.nube - 0.1, 550, 780, 1.63],
  [T.nube + 0.2, 4350, 1030, 1.0],
  [T.lata - 0.1, 4350, 1030, 1.03],
  [T.lata + 0.2, 4600, 1030, 1.35],
  [T.parece - 0.1, 4600, 1030, 1.38],
  [T.parece + 0.2, 4350, 1030, 1.0],
  [T.nada - 0.1, 4350, 1030, 1.03],
  [T.nada + 0.2, 4150, 1180, 1.6],
  [T.es - 0.1, 4150, 1180, 1.63],
  [T.es + 0.25, 550, 780, 1.7],
  [T.fin + 0.3, 550, 780, 1.75],
];

// Nube de algodón (centro, escala) con hebras brillantes de vidrio
const Nube: React.FC<{ x: number; y: number; e: number; t: number; brillo: number }> = ({ x, y, e, t, brillo }) =>
  e > 0.01 ? (
    <g transform={`translate(${x} ${y}) scale(${e})`}>
      {NUBE.map((b, i) => (
        <circle key={i} cx={Math.cos(b.a) * b.r * 190} cy={Math.sin(b.a) * b.r * 150} r={95 * b.s} fill={ROSA} opacity={0.75} />
      ))}
      {HEBRAS.map((h, i) => {
        const x0 = h.x0 * 140;
        const y0 = h.y0 * 120;
        return (
          <path
            key={i}
            d={`M ${x0} ${y0} q ${h.c * 120} ${-h.c * 80} ${h.dx * 160} ${h.dy * 160}`}
            fill="none"
            stroke={HILO}
            strokeWidth={2.5}
            opacity={0.55 + 0.45 * brillo * Math.max(0, Math.sin(t * 6 + i))}
          />
        );
      })}
      {brillo > 0
        ? new Array(10).fill(0).map((_, i) => {
            const p = Math.max(0, Math.sin(t * 5 + i * 1.7));
            return <circle key={i} cx={HEBRAS[i].x0 * 160} cy={HEBRAS[i].y0 * 130} r={6 + 6 * p} fill="#FFFFFF" opacity={brillo * p} />;
          })
        : null}
    </g>
  ) : null;

export const AlgodonMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Máquina: nube que crece al enredar y brillo de vidrio de cerca
  const tamNube = t < T.enredan ? (t < T.centro ? 1 : 0) : interpolate(t, [T.enredan, T.casi], [0.25, 1], clamp);
  const brillo = Math.max(ventana(-1, T.final - 0.2), ventana(T.casi, T.nube), ventana(T.es, T.fin + 2));
  const corriendo = t > T.centro - 0.3 ? 1 : 0;

  // Cabeza vista desde arriba
  const rot = t * 3;
  const caen = interpolate(t, [T.cae, T.cae + 0.8], [0, 1], clamp);
  const funde = interpolate(t, [T.derrite, T.derrite + 0.9], [0, 1], clamp);
  const pared = interpolate(t, [T.girar, T.girar + 0.8], [0, 1], clamp);
  const chorro = interpolate(t, [T.lanza, T.lanza + 0.9], [0, 1], clamp);
  const verMedio = ventana(T.miles - 0.1, T.aire + 0.2);

  // Vidrio
  const verVidrio = ventana(T.aire - 0.1, T.enredan + 0.2);
  const enfria = interpolate(t, [T.aire + 0.3, T.aire + 1.8], [0, 1], clamp);
  const hiloCaliente = ventana(T.aire - 0.1, T.cristales, 0.3, 0.3);
  const cristal = ventana(T.cristales, T.caramelo, 0.3, 0.3);
  const vidrio = ventana(T.cristales + 0.3, T.enredan + 0.2, 0.3, 0.3);
  const caramelo = ventana(T.caramelo, T.enredan + 0.2, 0.3, 0.3);

  // Nube frente a lata
  const ver4 = ventana(T.nube - 0.1, T.es + 0.2);
  const comprime = interpolate(t, [T.parece + 0.3, T.nada], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const mezcla = (a: string, b: string, p: number) => {
    const h = (s: string, k: number) => parseInt(s.slice(1 + 2 * k, 3 + 2 * k), 16);
    return `rgb(${[0, 1, 2].map((k) => Math.round(h(a, k) + (h(b, k) - h(a, k)) * p)).join(",")})`;
  };

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={5400} height={2400} fill="#1E1A2A" />

        {/* Máquina de feria */}
        <rect x={230} y={1250} width={640} height={300} rx={20} fill="#C83A5A" />
        {new Array(6).fill(0).map((_, k) => (
          <rect key={k} x={260 + k * 105} y={1250} width={50} height={300} fill="#F8E8F0" opacity={0.25} />
        ))}
        <path d="M 120 990 L 980 990 L 900 1260 L 200 1260 Z" fill="#B8C0CC" />
        <path d="M 160 1000 L 940 1000 L 880 1240 L 220 1240 Z" fill="#5A606C" />
        {corriendo
          ? new Array(16).fill(0).map((_, k) => {
              const lado = k % 2 ? 1 : -1;
              const p = (t * 2.2 + k / 16) % 1;
              return <path key={k} d={`M ${550 + lado * 70} ${1075 + (k % 4) * 6} Q ${550 + lado * 220} ${1050 - p * 40} ${550 + lado * (120 + 280 * p)} ${1090 + (k % 3) * 20}`} fill="none" stroke={HILO} strokeWidth={2.5} opacity={0.7 * (1 - p * 0.5)} />;
            })
          : null}
        <rect x={480} y={1040} width={140} height={70} rx={12} fill="#8A90A0" />
        <rect x={470} y={1100} width={160} height={20} fill="#6A707C" />
        <ellipse cx={550} cy={1075} rx={80} ry={40} fill={C.red} opacity={corriendo * (0.25 + 0.15 * Math.sin(t * 9))} />
        {corriendo ? (
          <g opacity={ventana(T.centro, T.miles + 0.2)}>
            <path d="M 450 1010 A 110 40 0 0 1 650 1010" fill="none" stroke={C.yellow} strokeWidth={6} />
            <path d="M 638 994 l 14 16 l -20 6" fill="none" stroke={C.yellow} strokeWidth={6} />
          </g>
        ) : null}
        {/* Palito y nube */}
        <line x1={550} y1={760} x2={610} y2={1050} stroke="#F0E0C0" strokeWidth={12} strokeLinecap="round" opacity={t > T.centro && t < T.enredan ? 0 : 1} />
        <Nube x={550} y={780} e={t > T.centro && t < T.enredan ? 0 : tamNube} t={t} brillo={brillo} />
        <Pildora x={550} y={1400} texto="¿cuánto azúcar?" color={C.white} o={ventana(T.final, T.centro)} tam={46} />
        <Pildora x={550} y={590} texto="≈ 97 % aire" color={C.white} o={ventana(T.casi + 0.2, T.nube)} tam={44} />

        {/* Cabeza desde arriba */}
        <g opacity={verMedio}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <circle cx={HC.x} cy={HC.y} r={400} fill="#2A2E38" stroke="#B8C0CC" strokeWidth={10} />
          {/* Chorros que salen y se vuelven hilos */}
          {chorro > 0
            ? new Array(12).fill(0).map((_, k) => {
                const a0 = rot + (k * Math.PI) / 6;
                const pts = new Array(14).fill(0).map((__, i) => {
                  const s = (i / 13) * chorro;
                  const r = 150 + 240 * s;
                  const a = a0 - 0.7 * s;
                  return `${HC.x + r * Math.cos(a)} ${HC.y + r * Math.sin(a)}`;
                });
                return <path key={k} d={`M ${pts.join(" L ")}`} fill="none" stroke={ROSA} strokeWidth={5} strokeLinecap="round" />;
              })
            : null}
          <circle cx={HC.x} cy={HC.y} r={150} fill="#8A90A0" />
          <circle cx={HC.x} cy={HC.y} r={130} fill="#3A3F4C" />
          <circle cx={HC.x} cy={HC.y} r={130} fill="none" stroke={C.red} strokeWidth={14} opacity={0.5 + 0.3 * Math.sin(t * 9)} />
          {/* Jarabe: disco que se pega a la pared al girar */}
          {funde > 0 ? <circle cx={HC.x} cy={HC.y} r={100 + 18 * pared} fill="none" stroke={ROSA} strokeWidth={(100 - 80 * pared) * funde * 2} opacity={0.85} /> : null}
          {/* Granos de azúcar que caen y se derriten */}
          {caen > 0 && funde < 1
            ? GRANOS.map((g, i) => {
                const p = Math.max(0, Math.min(1, (caen - g.d * 0.5) / 0.6));
                const e = (1.8 - 0.8 * p) * (1 - funde);
                return <rect key={i} x={HC.x + g.x - 12 * e} y={HC.y + g.y - 12 * e} width={24 * e} height={24 * e} fill={funde > 0.3 ? ROSA : "#FFFFFF"} opacity={p} transform={`rotate(${i * 25} ${HC.x + g.x} ${HC.y + g.y})`} />;
              })
            : null}
          {new Array(12).fill(0).map((_, k) => {
            const a = rot + (k * Math.PI) / 6;
            return <circle key={k} cx={HC.x + 150 * Math.cos(a)} cy={HC.y + 150 * Math.sin(a)} r={9} fill="#14161C" />;
          })}
          {/* Cabello frente a hilo */}
          <g opacity={ventana(T.hilos, T.aire + 0.2)}>
            <path d="M 2140 640 C 2180 900, 2060 1150, 2180 1440" fill="none" stroke="#6A4A2A" strokeWidth={46} strokeLinecap="round" />
          </g>
        </g>
        <Pildora x={HC.x} y={700} texto="≈ 3000 vueltas/min" color={C.yellow} o={ventana(T.miles + 0.2, T.cae)} tam={42} />
        <Pildora x={HC.x} y={1360} texto="¡jarabe!" color={ROSA} o={ventana(T.derrite + 0.5, T.girar)} tam={46} />

        {/* Por qué es vidrio */}
        <g opacity={verVidrio}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <g opacity={hiloCaliente}>
            <path d={`M 2680 1030 ${new Array(16).fill(0).map((_, i) => `Q ${2705 + i * 52} ${1030 + (i % 2 ? 30 : -30)} ${2730 + i * 52} 1030`).join(" ")}`} fill="none" stroke={mezcla(CALIENTE, ROSA, enfria)} strokeWidth={12} />
            {[0, 1, 2, 3, 4].map((k) => {
              const p = (t * 1.6 + k / 5) % 1;
              return <path key={k} d={`M ${2760 + k * 170} ${780 + p * 140} l 0 60 m -14 -18 l 14 18 l 14 -18`} fill="none" stroke={C.cyan} strokeWidth={6} strokeLinecap="round" opacity={1 - p} />;
            })}
            <text x={3100} y={1250} textAnchor="middle" fill={enfria < 0.5 ? CALIENTE : C.cyan} fontFamily={mono} fontSize={52} fontWeight={700}>
              {enfria < 0.5 ? "≈ 170 °C" : "¡frío al instante!"}
            </text>
          </g>
          {/* Cristal ordenado (no da tiempo) */}
          <g opacity={cristal}>
            {new Array(25).fill(0).map((_, i) => (
              <circle key={i} cx={2730 + (i % 5) * 70} cy={880 + Math.floor(i / 5) * 70} r={20} fill="#F8F4FF" />
            ))}
            <text x={2870} y={1290} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
              cristal
            </text>
            <line x1={2690} y1={850} x2={3050} y2={1210} stroke={C.red} strokeWidth={14} strokeLinecap="round" opacity={interpolate(t, [T.cristales + 0.4, T.cristales + 0.6], [0, 1], clamp)} />
          </g>
          {/* Vidrio desordenado */}
          <g opacity={vidrio}>
            {DESORDEN.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={20} fill={ROSA} />
            ))}
            <text x={3330} y={1290} textAnchor="middle" fill={ROSA} fontFamily={mono} fontSize={40} fontWeight={700}>
              vidrio
            </text>
          </g>
          {/* Caramelo duro */}
          <g opacity={caramelo} transform="translate(2870 1000)">
            <line x1={0} y1={60} x2={0} y2={260} stroke="#F0E0C0" strokeWidth={14} strokeLinecap="round" />
            <circle r={130} fill={AMBAR} opacity={0.9} />
            <path d="M -70 -70 A 100 100 0 0 1 40 -100" fill="none" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" opacity={0.6} />
          </g>
        </g>

        {/* Nube frente a lata */}
        <g opacity={ver4}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} />
          <line x1={4130} y1={950} x2={4150} y2={1290} stroke="#F0E0C0" strokeWidth={12} strokeLinecap="round" opacity={1 - comprime} />
          <Nube x={4130 + 20 * comprime} y={900 + 360 * comprime} e={0.95 * (1 - comprime)} t={t} brillo={0} />
          <path d={`M ${4150 - 110 * comprime} 1290 Q 4150 ${1290 - 120 * comprime} ${4150 + 110 * comprime} 1290 Z`} fill="#FFFFFF" opacity={comprime} />
          <g transform="translate(4600 1060)">
            <rect x={-90} y={-170} width={180} height={340} rx={24} fill="#D83A3A" />
            <ellipse cx={0} cy={-170} rx={90} ry={22} fill="#C8CED8" />
            <rect x={-90} y={-60} width={180} height={70} fill="#F8E8E8" opacity={0.85} />
            <text y={-12} textAnchor="middle" fill="#D83A3A" fontFamily={mono} fontSize={34} fontWeight={700}>
              REFRESCO
            </text>
          </g>
        </g>
        <Pildora x={4130} y={1390} texto="≈ 30 g" color={ROSA} o={ventana(T.nube + 0.5, T.parece)} tam={46} />
        <Pildora x={4600} y={1390} texto="≈ 35 g" color={C.red} o={ventana(T.lata, T.parece)} tam={46} />
        <Pildora x={4150} y={1390} texto="≈ 7 cucharaditas" color={C.white} o={ventana(T.nada, T.es + 0.2)} tam={40} />
      </g>

      {[T.miles, T.lanza, T.vidrio, T.nube, T.es].map((d) => (
        <rect key={d} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(d)} />
      ))}
      <Tag x={sx(550)} y={sy(1075)} dx={-200} dy={-200} texto="cabeza caliente" color={CALIENTE} o={ventana(T.centro + 0.3, T.miles)} />
      <Tag x={sx(HC.x + 300)} y={sy(HC.y + 120)} dx={-60} dy={230} texto="agujeritos" color={C.white} o={ventana(T.lanza + 0.6, T.hilos)} />
      <Tag x={sx(2150)} y={sy(800)} dx={150} dy={-130} texto="cabello" color="#C8A070" o={ventana(T.hilos + 0.3, T.aire)} />
      <Tag x={sx(HC.x + 150 + 200 * Math.cos(rot - 0.5))} y={sy(HC.y + 350 * Math.sin(rot - 0.6))} dx={-180} dy={160} texto="hilo de azúcar" color={ROSA} o={0} />
      <Tag x={sx(2870)} y={sy(870)} dx={140} dy={-170} texto="caramelo duro" color={AMBAR} o={ventana(T.caramelo + 0.3, T.enredan)} />
    </svg>
  );
};
