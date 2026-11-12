import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el clip de nitinol que se arruga en frío y se desarruga en un vaso de agua caliente; en el
// centro, la red de átomos de níquel y titanio (orden rígido en caliente, capas en acordeón en frío); a la derecha, los
// usos (stent que se abre en la arteria, gafas que se doblan) y el origen del nombre (Ni + Ti + NOL).
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho (el clip arrugado cae al agua).
const ALAMBRE = "#C8CED8";
const NI = "#7AC8A0";
const TI = "#6A9AE8";
const AGUA = "#3A7AC8";
const CALOR = "#F8683A";

// Clip: segmentos (rectas y semicírculos) muestreados en N puntos por longitud
const N = 140;
const CLIP: [number, number][] = (() => {
  const pts: [number, number][] = [];
  const recta = (a: [number, number], b: [number, number], n: number) => {
    for (let i = 0; i < n; i++) {
      pts.push([a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]);
    }
  };
  const arco = (c: [number, number], r: number, a0: number, a1: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      pts.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]);
    }
  };
  recta([130, -13], [-180, -13], 16);
  arco([-180, 26], 39, -Math.PI / 2, -1.5 * Math.PI, 10);
  recta([-180, 65], [235, 65], 22);
  arco([235, 0], 65, Math.PI / 2, -Math.PI / 2, 14);
  recta([235, -65], [-235, -65], 26);
  arco([-235, 26], 91, -Math.PI / 2, -1.5 * Math.PI, 18);
  recta([-235, 117], [160, 117], 34);
  return pts.slice(0, N);
})();
const BOLA: [number, number][] = CLIP.map((_, k) => [70 * Math.sin(k * 0.37) + 35 * Math.sin(k * 0.91 + 1), 70 * Math.cos(k * 0.29) + 35 * Math.sin(k * 0.73 + 2)]);

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1180, 1.15],
  [T.final - 0.1, 550, 1180, 1.2],
  [T.final + 0.2, 550, 1050, 0.95],
  [T.mezcla - 0.1, 550, 1050, 0.98],
  [T.mezcla + 0.2, 550, 900, 1.5],
  [T.atomos - 0.1, 550, 900, 1.53],
  [T.atomos + 0.2, 1850, 1030, 1.0],
  [T.maneras - 0.1, 1850, 1030, 1.03],
  [T.maneras + 0.2, 1850, 1030, 1.2],
  [T.frio - 0.1, 1850, 1030, 1.23],
  [T.frio + 0.2, 550, 900, 1.4],
  [T.capas - 0.1, 550, 900, 1.45],
  [T.capas + 0.2, 1850, 1030, 1.0],
  [T.acordeon - 0.1, 1850, 1030, 1.03],
  [T.acordeon + 0.2, 1850, 1030, 1.3],
  [T.enlaces - 0.1, 1850, 1030, 1.33],
  [T.enlaces + 0.2, 1750, 960, 1.8],
  [T.calor - 0.1, 1750, 960, 1.83],
  [T.calor + 0.2, 550, 1100, 1.0],
  [T.vuelven - 0.1, 550, 1100, 1.05],
  [T.vuelven + 0.2, 1850, 1030, 1.0],
  [T.rigido - 0.1, 1850, 1030, 1.03],
  [T.rigido + 0.2, 1850, 1030, 1.3],
  [T.alambre - 0.1, 1850, 1030, 1.33],
  [T.alambre + 0.2, 550, 1250, 1.3],
  [T.fabrica - 0.1, 550, 1250, 1.33],
  [T.fabrica + 0.2, 550, 900, 1.35],
  [T.usa - 0.1, 550, 900, 1.38],
  [T.usa + 0.2, 3100, 1030, 1.0],
  [T.abren - 0.1, 3100, 1030, 1.03],
  [T.abren + 0.2, 3100, 1030, 1.3],
  [T.gafas - 0.1, 3100, 1030, 1.33],
  [T.gafas + 0.2, 3100, 1030, 1.05],
  [T.nombre - 0.1, 3100, 1030, 1.08],
  [T.nombre + 0.2, 4350, 1030, 1.0],
  [T.laboratorio - 0.1, 4350, 1030, 1.03],
  [T.laboratorio + 0.2, 4560, 1060, 1.35],
  [T.metal - 0.1, 4560, 1060, 1.38],
  [T.metal + 0.25, 550, 1180, 1.15],
  [T.fin + 0.3, 550, 1180, 1.2],
];

export const NitinolMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Clip: arrugado (p = 1) o en su forma (p = 0), y dónde está
  const p =
    t < T.frio
      ? interpolate(t, [0.2, 1.6], [1, 0], clamp)
      : t < T.calor
        ? interpolate(t, [T.frio + 0.5, T.frio + 2.5], [0, 1], clamp)
        : t < T.metal
          ? interpolate(t, [T.alambre - 0.2, T.alambre + 1.2], [1, 0], clamp)
          : 1;
  const yClip =
    t < T.final
      ? 1330
      : t < T.calor
        ? interpolate(t, [T.final, T.final + 0.6], [1330, 900], clamp)
        : t < T.fabrica
          ? interpolate(t, [T.agua - 0.4, T.agua + 0.3], [900, 1330], clamp)
          : t < T.metal
            ? interpolate(t, [T.fabrica - 0.2, T.fabrica + 0.4], [1330, 900], clamp)
            : interpolate(t, [T.metal + 0.3, T.fin + 0.3], [900, 1300], clamp);
  const brasa = ventana(T.fabrica, T.usa + 0.2);
  const enAgua = yClip > 1180;
  const pts = CLIP.map((c, k) => [550 + (c[0] + (BOLA[k][0] - c[0]) * p) * 0.95, yClip + (c[1] - 26 + (BOLA[k][1] - c[1] + 26) * p) * 0.95]);
  const d = `M ${pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L ")}`;
  const flechas = ventana(T.frio + 0.3, T.capas);

  // Red de átomos
  const verRed = Math.max(ventana(T.atomos - 0.1, T.frio + 0.2), ventana(T.capas - 0.1, T.calor + 0.2), ventana(T.vuelven - 0.1, T.alambre + 0.2));
  const aus = t < T.capas ? (t < T.maneras ? 1 : interpolate(t, [T.maneras, T.maneras + 0.6], [1, 0], clamp)) : interpolate(t, [T.vuelven + 0.1, T.vuelven + 1.2], [0, 1], clamp);
  const def = t < T.calor ? interpolate(t, [T.capas + 0.3, T.acordeon + 0.3], [0, 1], clamp) : interpolate(t, [T.vuelven + 0.1, T.vuelven + 1.2], [1, 0], clamp);
  const zz = [0, 1, 2, 1, 0, 1, 2, 1];
  const atomo = (i: number, j: number) => {
    const o = (1 - aus) * ((1 - def) * zz[j] + def * j * 0.5) * 48;
    return [1850 - 4.5 * 92 + i * 92 + o - 24 * (1 - aus) * (1 - def), 1030 - 3.5 * (92 - 8 * (1 - aus)) + j * (92 - 8 * (1 - aus))];
  };
  const brillo = ventana(T.enlaces, T.calor);

  // Usos y nombre
  const verUsos = ventana(T.usa - 0.1, T.nombre + 0.2);
  const stent = ventana(T.usa - 0.1, T.gafas, 0.3, 0.3);
  const abre = interpolate(t, [T.abren - 0.3, T.abren + 0.6], [0, 1], clamp);
  const gafas = ventana(T.gafas, T.nombre + 0.2, 0.3, 0.3);
  const dobla = interpolate(t, [T.gafas + 0.5, T.gafas + 1.0, T.gafas + 1.8, T.gafas + 2.2], [0, 1, 1, 0], clamp);
  const verNombre = ventana(T.nombre - 0.1, T.metal + 0.2);
  const letra = (a: number) => interpolate(t, [a, a + 0.3], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={5400} height={2400} fill="#1A1C28" />

        {/* Vaso de agua caliente */}
        <path d="M 260 1150 L 840 1150 L 800 1520 L 300 1520 Z" fill="#2A3040" stroke="#C8E0F8" strokeWidth={6} opacity={0.9} />
        <path d={`M 268 ${1200 + Math.sin(t * 3) * 5} Q 550 ${1200 - Math.sin(t * 3) * 5} 832 ${1200 + Math.sin(t * 3) * 5} L 800 1516 L 300 1516 Z`} fill={AGUA} opacity={0.7} />
        {[0, 1, 2].map((k) => {
          const q = (t * 0.6 + k / 3) % 1;
          return <path key={k} d={`M ${400 + k * 150} ${1130 - q * 160} q 20 -30 0 -60 q -20 -30 0 -60`} fill="none" stroke="#C8D8E8" strokeWidth={6} strokeLinecap="round" opacity={0.5 * (1 - q)} />;
        })}
        {/* Clip de nitinol */}
        <path d={d} fill="none" stroke={brasa > 0 ? CALOR : ALAMBRE} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" opacity={enAgua ? 0.95 : 1} />
        {brasa > 0 ? <path d={d} fill="none" stroke="#FFC060" strokeWidth={30} strokeLinecap="round" opacity={0.3 * brasa} /> : null}
        {flechas > 0
          ? [-1, 1].map((l) => (
              <path key={l} d={`M ${550 + l * 330} 900 l ${-l * 90} 0 m ${l * 26} -26 l ${-l * 26} 26 l ${l * 26} 26`} fill="none" stroke={C.cyan} strokeWidth={9} strokeLinecap="round" opacity={flechas} />
            ))
          : null}
        <Pildora x={550} y={1600} texto="agua caliente" color={CALOR} o={Math.max(ventana(-1, T.final), ventana(T.agua, T.fabrica), ventana(T.metal + 0.3, T.fin + 2))} tam={44} />
        <Pildora x={550} y={700} texto="Ni + Ti" color={C.white} o={ventana(T.mezcla + 0.3, T.atomos)} tam={56} />
        <Pildora x={550} y={700} texto="frío: se dobla" color={C.cyan} o={ventana(T.frio + 0.4, T.capas)} tam={44} />
        <Pildora x={550} y={700} texto="≈ 500 °C" color={CALOR} o={ventana(T.grados, T.usa)} tam={52} />

        {/* Red de átomos */}
        <g opacity={verRed}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          {new Array(8).fill(0).map((_, j) =>
            new Array(10).fill(0).map((__, i) => {
              const [x, y] = atomo(i, j);
              return (
                <g key={`${i}-${j}`}>
                  {i < 9 ? <line x1={x} y1={y} x2={atomo(i + 1, j)[0]} y2={atomo(i + 1, j)[1]} stroke={brillo > 0 ? C.yellow : "#5A5F7C"} strokeWidth={4 + 3 * brillo} /> : null}
                  {j < 7 ? <line x1={x} y1={y} x2={atomo(i, j + 1)[0]} y2={atomo(i, j + 1)[1]} stroke={brillo > 0 ? C.yellow : "#5A5F7C"} strokeWidth={4 + 3 * brillo} /> : null}
                </g>
              );
            }),
          )}
          {new Array(8).fill(0).map((_, j) =>
            new Array(10).fill(0).map((__, i) => {
              const [x, y] = atomo(i, j);
              return <circle key={`a${i}-${j}`} cx={x} cy={y} r={20} fill={(i + j) % 2 ? NI : TI} />;
            }),
          )}
        </g>
        <Pildora x={1850} y={1390} texto={aus > 0.5 ? "caliente: rígido" : "frío: blando"} color={aus > 0.5 ? CALOR : C.cyan} o={Math.max(ventana(T.atomos + 0.2, T.frio), ventana(T.vuelven + 0.6, T.alambre))} tam={44} />
        <Pildora x={1850} y={700} texto="sin romper enlaces" color={C.yellow} o={ventana(T.enlaces + 0.2, T.calor)} tam={44} />

        {/* Usos: stent y gafas */}
        <g opacity={verUsos}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <g opacity={stent}>
            <rect x={2660} y={830} width={880} height={50} fill="#C83A4A" />
            <rect x={2660} y={1180} width={880} height={50} fill="#C83A4A" />
            <path d={`M 2900 ${880} q 100 ${110 * (1 - abre) + 20} 200 0 q 100 ${110 * (1 - abre) + 20} 200 0`} fill="#F8D860" />
            <rect x={2660} y={880} width={880} height={300} fill="#5A1A2A" opacity={0.6} />
            <line x1={2660} y1={1030} x2={2900} y2={1030} stroke="#8A90A0" strokeWidth={12} opacity={1 - abre} />
            {(() => {
              const h = 50 + 230 * abre;
              const filas = 4;
              return new Array(filas).fill(0).map((_, k) => {
                const y0 = 1030 - h / 2 + (k * h) / filas;
                const y1 = y0 + h / filas;
                return (
                  <path
                    key={k}
                    d={`M 2880 ${y0} ${new Array(10).fill(0).map((__, i) => `L ${2905 + i * 50} ${i % 2 ? y0 : y1}`).join(" ")}`}
                    fill="none"
                    stroke={ALAMBRE}
                    strokeWidth={6}
                  />
                );
              });
            })()}
          </g>
          <g opacity={gafas} transform="translate(3100 1030)">
            <g transform={`rotate(${-25 * dobla} 0 0)`}>
              <circle cx={-170} cy={0} r={120} fill="#9AD8F8" fillOpacity={0.15} stroke={ALAMBRE} strokeWidth={12} />
              <path d="M -50 -20 Q 0 -50 50 -20" fill="none" stroke={ALAMBRE} strokeWidth={12} />
            </g>
            <g transform={`rotate(${40 * dobla} 50 -20)`}>
              <circle cx={170} cy={0} r={120} fill="#9AD8F8" fillOpacity={0.15} stroke={ALAMBRE} strokeWidth={12} />
            </g>
          </g>
        </g>
        <Pildora x={3100} y={1360} texto="se abre sola" color={C.yellow} o={ventana(T.abren + 0.3, T.gafas)} tam={44} />
        <Pildora x={3100} y={1360} texto="vuelve a su forma" color={C.yellow} o={ventana(T.gafas + 1.9, T.nombre + 0.2)} tam={44} />

        {/* Nombre */}
        <g opacity={verNombre}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} />
          {(
            [
              ["Ni", 4060, NI, "níquel", T.niquel],
              ["Ti", 4300, TI, "titanio", T.titanio],
              ["NOL", 4600, C.yellow, "Naval Ordnance Lab.", T.laboratorio],
            ] as const
          ).map(([l, x, c, sub, a]) => (
            <g key={l} opacity={letra(a)}>
              <text x={x} y={1060} textAnchor="middle" fill={c} fontFamily={mono} fontSize={130} fontWeight={700}>
                {l}
              </text>
              <text x={x} y={1130} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={l === "NOL" ? 26 : 32} fontWeight={700}>
                {sub}
              </text>
            </g>
          ))}
          <text x={4350} y={820} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={40} fontWeight={700} opacity={ventana(T.nombre, T.niquel)}>
            ¿NITINOL?
          </text>
          <text x={4350} y={1300} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={34} fontWeight={700} opacity={letra(T.laboratorio + 0.4)}>
            EE. UU., años 60
          </text>
        </g>
      </g>

      {[T.atomos, T.vuelven, T.alambre, T.nombre].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(atomo(2, 3)[0])} y={sy(atomo(2, 3)[1])} dx={60} dy={-200} texto="titanio" color={TI} o={ventana(T.atomos + 0.2, T.maneras)} />
      <Tag x={sx(atomo(5, 4)[0])} y={sy(atomo(5, 4)[1])} dx={60} dy={180} texto="níquel" color={NI} o={ventana(T.atomos + 0.2, T.maneras)} />
      <Tag x={sx(2900)} y={sy(1030)} dx={-60} dy={-280} texto="stent" color={ALAMBRE} o={ventana(T.usa + 0.4, T.abren)} />
    </svg>
  );
};
