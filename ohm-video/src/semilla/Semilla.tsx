import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una semilla en la tierra oscura que saca raíz y tallo (y que se gira); en el centro, las células
// de la punta de la raíz con sus estatolitos que caen; a la derecha, la auxina en una raíz y un tallo acostados; al fondo,
// plántulas en la estación espacial.
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho (la semilla que brota).
const TIERRA = "#5A3E28";
const RAIZ = "#F0E8D8";
const TALLO = "#5AC85A";
const ALMIDON = "#F8F4E8";
const AUXINA = "#F8883A";
const GRANOS = new Array(6 * 5).fill(0).map((_, i) => ({ x: (random(`gx${i}`) - 0.5) * 120, y: (random(`gy${i}`) - 0.5) * 120, b: ((i % 5) - 2) * 26 }));
const CELDAS = new Array(6).fill(0).map((_, i) => ({ x: (i % 3) - 1, y: Math.floor(i / 3) - 0.5 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1000, 1.05],
  [T.final - 0.1, 550, 1000, 1.1],
  [T.final + 0.2, 550, 980, 0.95],
  [T.punta - 0.1, 550, 980, 0.98],
  [T.punta + 0.2, 550, 1300, 1.8],
  [T.granitos - 0.1, 550, 1300, 1.83],
  [T.granitos + 0.2, 1850, 1030, 1.0],
  [T.estatolitos - 0.1, 1850, 1030, 1.03],
  [T.estatolitos + 0.2, 1850, 1030, 1.35],
  [T.piedras - 0.1, 1850, 1030, 1.38],
  [T.piedras + 0.2, 1850, 1030, 1.0],
  [T.presionan - 0.1, 1850, 1030, 1.03],
  [T.presionan + 0.2, 1850, 1100, 1.4],
  [T.sabe - 0.1, 1850, 1100, 1.43],
  [T.sabe + 0.2, 1850, 1030, 1.0],
  [T.giras - 0.1, 1850, 1030, 1.03],
  [T.giras + 0.2, 550, 1000, 1.05],
  [19.1, 550, 1000, 1.08],
  [19.4, 1850, 1030, 1.0],
  [T.curva - 0.1, 1850, 1030, 1.03],
  [T.curva + 0.2, 600, 1080, 1.3],
  [T.curvarse - 0.1, 600, 1080, 1.33],
  [T.curvarse + 0.2, 3100, 1030, 1.0],
  [T.auxina - 0.1, 3100, 1030, 1.03],
  [T.auxina + 0.2, 3100, 1030, 1.15],
  [T.raiz - 0.1, 3100, 1030, 1.18],
  [T.raiz + 0.2, 3150, 1200, 1.5],
  [T.tallo - 0.1, 3150, 1200, 1.53],
  [T.tallo + 0.2, 3150, 860, 1.5],
  [T.asi - 0.1, 3150, 860, 1.53],
  [T.asi + 0.2, 3100, 1030, 1.0],
  [T.espacio - 0.1, 3100, 1030, 1.03],
  [T.espacio + 0.2, 4350, 1030, 1.0],
  [T.sin - 0.1, 4350, 1030, 1.03],
  [T.sin + 0.2, 4350, 1030, 1.3],
  [T.porque - 0.1, 4350, 1030, 1.33],
  [T.porque + 0.25, 550, 1000, 1.05],
  [T.fin + 0.3, 550, 1000, 1.1],
];

// Órgano que crece desde (x, y) con dirección inicial a0 (grados) y punta que se curva hacia «meta»
const organo = (x: number, y: number, a0: number, meta: number, largo: number, recto: number, curva: number) => {
  const pts: [number, number][] = [[x, y]];
  let px = x;
  let py = y;
  const n = 40;
  for (let i = 1; i <= n; i++) {
    const s = (i / n) * largo;
    const f = Math.max(0, Math.min(1, (s - recto) / Math.max(1, largo - recto))) * curva;
    const a = ((a0 + (meta - a0) * f) * Math.PI) / 180;
    px += (largo / n) * Math.cos(a);
    py += (largo / n) * Math.sin(a);
    pts.push([px, py]);
  }
  return pts;
};
const linea = (p: [number, number][]) => `M ${p.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L ")}`;

export const SemillaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Semilla: brota en el gancho; se gira 90° y la raíz y el tallo se curvan
  const giro = t > T.giras && t < T.porque ? interpolate(t, [T.giras + 0.2, T.giras + 1.0], [0, 1], clamp) : 0;
  const curva = t > T.giras && t < T.porque ? interpolate(t, [T.curva - 0.4, T.curva + 1.2], [0, 1], clamp) : 0;
  const lr = t < T.final ? interpolate(t, [0, 1.6], [150, 320], clamp) : t > T.porque ? interpolate(t, [T.porque, T.fin], [150, 260], clamp) : 320;
  const lt = t < T.final ? interpolate(t, [0, 1.6], [110, 230], clamp) : t > T.porque ? interpolate(t, [T.porque, T.fin], [110, 190], clamp) : 230;
  const aR = 90 - 90 * giro;
  const aT = -90 - 90 * giro;
  const rad = (a: number) => (a * Math.PI) / 180;
  const raiz = organo(550 + 40 * Math.cos(rad(aR)), 1000 + 40 * Math.sin(rad(aR)), aR, 90, lr, lr * 0.5, curva);
  const tallo = organo(550 + 40 * Math.cos(rad(aT)), 1000 + 40 * Math.sin(rad(aT)), aT, -90, lt, lt * 0.4, curva);

  // Células de la punta de la raíz
  const verCel = Math.max(ventana(T.granitos - 0.1, T.giras + 0.2), ventana(19.3, T.curva + 0.2));
  const asienta = interpolate(t, [T.piedras, T.caen + 0.6], [0, 1], clamp);
  const rot = t > 19 ? interpolate(t, [19.4, 19.8], [0, 90], clamp) : 0;
  const recae = interpolate(t, [19.8, 20.4], [0, 1], clamp);
  const presion = Math.max(ventana(T.presionan, T.giras), ventana(20.0, T.curva + 0.2, 0.2, 0.2));
  const cr = (rot * Math.PI) / 180;
  const R = (x: number, y: number): [number, number] => [x * Math.cos(cr) - y * Math.sin(cr), x * Math.sin(cr) + y * Math.cos(cr)];

  // Auxina
  const verAux = ventana(T.curvarse - 0.1, T.espacio + 0.2);
  const aux = interpolate(t, [T.auxina, T.auxina + 1.2], [0, 1], clamp);
  const dobla = interpolate(t, [T.asi, T.asi + 1.4], [0, 1], clamp);
  const horizontal = (y: number, signo: number) =>
    new Array(30).fill(0).map((_, i) => {
      const u = i / 29;
      return [2720 + u * 760, y + signo * 160 * dobla * Math.max(0, u - 0.4) ** 2 * 2.8] as [number, number];
    });
  const brote = horizontal(860, -1);
  const raizH = horizontal(1200, 1);

  // Espacio
  const verEsp = ventana(T.espacio - 0.1, T.porque + 0.2);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={5400} height={2400} fill="#141622" />

        {/* Tierra y semilla */}
        <rect x={80} y={760} width={940} height={800} rx={20} fill={TIERRA} />
        {new Array(30).fill(0).map((_, k) => (
          <circle key={k} cx={120 + random(`tx${k}`) * 860} cy={800 + random(`ty${k}`) * 720} r={6 + random(`tr${k}`) * 10} fill="#4A3220" />
        ))}
        <path d={linea(raiz)} fill="none" stroke={RAIZ} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        <path d={linea(tallo)} fill="none" stroke={TALLO} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
        <g transform={`rotate(${90 * giro} 550 1000)`}>
          <ellipse cx={550} cy={1000} rx={70} ry={48} fill="#C8A060" />
          <path d="M 500 990 Q 550 1020 600 990" fill="none" stroke="#8A6A3A" strokeWidth={5} />
        </g>
        <circle cx={raiz[raiz.length - 1][0]} cy={raiz[raiz.length - 1][1]} r={22} fill="none" stroke={C.yellow} strokeWidth={5} opacity={ventana(T.punta, T.granitos + 0.2)} />
        <g opacity={Math.max(ventana(-1, T.final), ventana(T.porque, T.fin + 2))}>
          <path d="M 880 860 L 880 1100 M 852 1070 L 880 1100 L 908 1070" fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <text x={880} y={830} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={34} fontWeight={700}>
            gravedad
          </text>
        </g>
        <Pildora x={550} y={640} texto="¿y en el espacio?" color={C.white} o={ventana(T.final + 0.3, T.punta)} tam={42} />
        <Pildora x={550} y={640} texto="la giras…" color={C.orange} o={ventana(T.giras + 0.2, 19.2)} tam={44} />

        {/* Células con estatolitos */}
        <g opacity={verCel}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {CELDAS.map((c, i) => {
            const [ox, oy] = R(c.x * 230, c.y * 230);
            const x = 1850 + ox;
            const y = 1030 + oy;
            return (
              <g key={i}>
                <rect x={x - 100} y={y - 100} width={200} height={200} rx={30} fill="#2A3A2A" stroke={TALLO} strokeWidth={6} />
                <line x1={x - 80} y1={y + 100} x2={x + 80} y2={y + 100} stroke={C.yellow} strokeWidth={12} strokeLinecap="round" opacity={presion} />
                {new Array(5).fill(0).map((_, k) => {
                  const g = GRANOS[i * 5 + k];
                  const lx = g.x + (g.b - g.x) * asienta;
                  const ly = g.y + (68 - g.y) * asienta;
                  const [rx, ry] = R(lx, ly);
                  const px = x + rx + (g.b - rx) * recae;
                  const py = y + ry + (68 - ry) * recae;
                  return <circle key={k} cx={px} cy={py} r={18} fill={ALMIDON} stroke="#C8B890" strokeWidth={3} />;
                })}
              </g>
            );
          })}
        </g>
        <Pildora x={1850} y={1420} texto="¡abajo!" color={C.yellow} o={ventana(T.sabe, T.giras)} tam={50} />

        {/* Auxina en raíz y tallo acostados */}
        <g opacity={verAux}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <path d={linea(brote)} fill="none" stroke={TALLO} strokeWidth={70} strokeLinecap="round" />
          <path d={linea(raizH)} fill="none" stroke={RAIZ} strokeWidth={60} strokeLinecap="round" />
          {new Array(10).fill(0).map((_, k) => {
            const i = 3 + k * 2.5;
            const p1 = brote[Math.round(i)];
            const p2 = raizH[Math.round(i)];
            return (
              <g key={k}>
                <circle cx={p1[0]} cy={p1[1] - 20 + 40 * aux} r={9} fill={AUXINA} />
                <circle cx={p2[0]} cy={p2[1] - 18 + 36 * aux} r={9} fill={AUXINA} />
              </g>
            );
          })}
          <text x={2720} y={760} fill={TALLO} fontFamily={mono} fontSize={36} fontWeight={700}>
            tallo
          </text>
          <text x={2720} y={1320} fill={RAIZ} fontFamily={mono} fontSize={36} fontWeight={700}>
            raíz
          </text>
        </g>
        <Pildora x={3150} y={1400} texto="frena ↓" color={C.red} o={ventana(T.raiz + 0.3, T.tallo)} tam={46} />
        <Pildora x={3150} y={700} texto="acelera ↑" color="#48C878" o={ventana(T.tallo + 0.2, T.asi + 0.4)} tam={46} />

        {/* Estación espacial */}
        <g opacity={verEsp}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} fill="#0A0A18" />
          <clipPath id="ventanaEsp">
            <rect x={3850} y={600} width={1000} height={860} rx={40} />
          </clipPath>
          <circle cx={4850} cy={1460} r={300} fill="#2A6AC8" opacity={0.6} clipPath="url(#ventanaEsp)" />
          {(
            [
              [4150, 850, 20],
              [4450, 1150, 150],
              [4600, 820, 260],
            ] as const
          ).map(([x, y, a0], k) => {
            const r = organo(x, y, a0, a0 + 140 * Math.sin(t * 0.7 + k), 200, 40, 1);
            const tl = organo(x, y, a0 + 180, a0 + 180 + 60, 120, 40, 1);
            return (
              <g key={k} transform={`translate(${Math.sin(t + k) * 14} ${Math.cos(t * 0.8 + k) * 14})`}>
                <path d={linea(r)} fill="none" stroke={RAIZ} strokeWidth={12} strokeLinecap="round" />
                <path d={linea(tl)} fill="none" stroke={TALLO} strokeWidth={14} strokeLinecap="round" />
                <ellipse cx={x} cy={y} rx={40} ry={28} fill="#C8A060" transform={`rotate(${a0} ${x} ${y})`} />
              </g>
            );
          })}
        </g>
        <Pildora x={4350} y={1400} texto="sin gravedad" color={C.cyan} o={ventana(T.sin, T.porque)} tam={46} />
      </g>

      {[T.granitos, 19.4, T.curvarse, T.espacio].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(1850 - 230 + GRANOS[0].b)} y={sy(1030 - 115 + 68)} dx={60} dy={-200} texto="estatolitos" color={ALMIDON} o={ventana(T.estatolitos, T.piedras + 0.6)} />
      <Tag x={sx(raiz[raiz.length - 1][0])} y={sy(raiz[raiz.length - 1][1])} dx={-150} dy={-160} texto="punta de la raíz" color={C.yellow} o={ventana(T.punta + 0.2, T.granitos)} />
      <Tag x={sx(brote[12][0])} y={sy(brote[12][1] + 20)} dx={-60} dy={190} texto="auxina" color={AUXINA} o={ventana(T.auxina + 0.6, T.raiz)} />
    </svg>
  );
};
