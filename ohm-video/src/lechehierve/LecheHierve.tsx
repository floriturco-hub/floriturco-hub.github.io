import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, la olla de leche en la estufa (nata, espuma que crece y se desborda; fuego medio y cuchara); en
// el centro, la leche al microscopio (proteínas que forman la piel y burbujas atrapadas); a la derecha, la olla de agua
// donde las burbujas revientan y el vapor escapa.
// Retención (estilo §10): el gancho plantea la pregunta y el final vuelve a ella para el bucle.
const LECHE = "#F4F0E4";
const NATA = "#F8E8B8";
const AGUA = "#4A9AD8";
const BURB = new Array(14).fill(0).map((_, i) => ({ x: 1420 + random(`bx${i}`) * 860, f: random(`bf${i}`), v: 0.4 + random(`bv${i}`) * 0.4 }));
const PROT = new Array(16).fill(0).map((_, i) => ({ x: 1420 + random(`px${i}`) * 840, y: 960 + random(`py${i}`) * 400, a: random(`pa${i}`) * 180 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1100, 1.1],
  [T.final - 0.1, 550, 1100, 1.14],
  [T.final + 0.2, 550, 1100, 1.0],
  [T.leche - 0.1, 550, 1100, 1.03],
  [T.leche + 0.2, 1850, 1100, 1.0],
  [T.proteinas - 0.1, 1850, 1100, 1.03],
  [T.proteinas + 0.2, 1850, 1150, 1.4],
  [T.calentarse - 0.1, 1850, 1150, 1.43],
  [T.calentarse + 0.2, 1850, 1100, 1.0],
  [T.capa - 0.1, 1850, 1100, 1.03],
  [T.capa + 0.2, 1850, 940, 1.6],
  [T.nata - 0.1, 1850, 940, 1.63],
  [T.nata + 0.2, 550, 1050, 1.6],
  [T.abajo - 0.1, 550, 1050, 1.63],
  [T.abajo + 0.2, 1850, 1150, 1.0],
  [T.burbujas - 0.1, 1850, 1150, 1.03],
  [T.burbujas + 0.2, 1850, 1200, 1.3],
  [T.atrapa - 0.1, 1850, 1200, 1.33],
  [T.atrapa + 0.2, 1850, 960, 1.5],
  [T.resistentes - 0.1, 1850, 960, 1.53],
  [T.resistentes + 0.2, 1850, 980, 1.9],
  [T.espuma - 0.1, 1850, 980, 1.93],
  [T.espuma + 0.2, 1850, 1000, 1.1],
  [T.crece - 0.1, 1850, 1000, 1.13],
  [T.crece + 0.2, 550, 1050, 1.1],
  [T.empuja - 0.1, 550, 1050, 1.13],
  [T.empuja + 0.2, 550, 980, 1.35],
  [T.sale - 0.1, 550, 980, 1.38],
  [T.sale + 0.2, 550, 1100, 1.0],
  [T.agua - 0.1, 550, 1100, 1.03],
  [T.agua + 0.2, 3100, 1100, 1.0],
  [T.revientan - 0.1, 3100, 1100, 1.03],
  [T.revientan + 0.2, 3100, 1040, 1.6],
  [T.escapa - 0.1, 3100, 1040, 1.63],
  [T.escapa + 0.2, 3100, 950, 1.1],
  [T.evitar - 0.1, 3100, 950, 1.13],
  [T.evitar + 0.2, 550, 1100, 1.0],
  [T.fuego - 0.1, 550, 1100, 1.03],
  [T.fuego + 0.2, 550, 1320, 1.6],
  [T.remover - 0.1, 550, 1320, 1.6],
  [T.remover + 0.2, 550, 1060, 1.3],
  [T.sino - 0.1, 550, 1060, 1.33],
  [T.sino + 0.25, 550, 1100, 1.1],
  [T.fin + 0.3, 550, 1100, 1.14],
];

// Olla de perfil centrada en x, con líquido hasta «nivel»
const Olla: React.FC<{ x: number; color: string; children?: React.ReactNode }> = ({ x, color, children }) => (
  <g>
    <rect x={x - 220} y={980} width={440} height={320} rx={30} fill="#5A5F6C" />
    <clipPath id={`olla${x}`}>
      <rect x={x - 205} y={900} width={410} height={385} rx={22} />
    </clipPath>
    <g clipPath={`url(#olla${x})`}>
      <rect x={x - 205} y={1060} width={410} height={240} fill={color} />
      {children}
    </g>
    <rect x={x - 235} y={968} width={470} height={18} rx={9} fill="#8A90A0" />
    <rect x={x + 220} y={1010} width={150} height={26} rx={12} fill="#3A3F4C" />
  </g>
);

export const LecheHierveMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Olla de leche: espuma que crece y se desborda
  const espuma =
    t < T.final
      ? interpolate(t, [0, 1.5], [90, 170], clamp)
      : t > T.sino
        ? interpolate(t, [T.sino, T.fin + 0.3], [20, 90], clamp)
        : t < T.crece
          ? 0
          : t < T.evitar
            ? interpolate(t, [T.crece, T.empuja, T.sale + 0.5], [0, 60, 170], clamp)
            : interpolate(t, [T.evitar, T.evitar + 0.6], [170, 0], clamp);
  const derrame = Math.max(0, Math.min(1, (espuma - 95) / 60));
  const nata = Math.max(ventana(T.nata - 0.2, T.abajo + 0.2), espuma > 0 ? 1 : 0);
  const llama = t > T.fuego && t < T.sino ? 0.45 : 1;
  const cuchara = ventana(T.remover, T.sino + 0.2);

  // Microscopio
  const verMicro = Math.max(ventana(T.leche - 0.1, T.nata + 0.2), ventana(T.abajo - 0.1, T.crece + 0.2));
  const piel = interpolate(t, [T.capa - 0.3, T.nata], [0, 1], clamp);
  const atrapa = t > T.atrapa;
  const recubre = interpolate(t, [T.resistentes, T.resistentes + 0.6], [0, 1], clamp);
  const sube = interpolate(t, [T.espuma, T.crece + 0.2], [0, 1], clamp);
  const ySup = 900 - 80 * sube;

  // Agua
  const verAgua = ventana(T.agua - 0.1, T.evitar + 0.2);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const fuego = (x: number, e: number) =>
    new Array(7).fill(0).map((_, k) => {
      const h = (40 + 20 * Math.sin(t * 12 + k * 1.7)) * e;
      return <path key={k} d={`M ${x - 180 + k * 60 - 18} 1325 Q ${x - 180 + k * 60} ${1325 - h * 2} ${x - 180 + k * 60 + 18} 1325 Z`} fill="#4A8AF8" opacity={0.85} />;
    });

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={4200} height={2400} fill="#1A1C28" />

        {/* Estufa y olla de leche */}
        <rect x={120} y={1330} width={860} height={60} rx={10} fill="#3A3F4C" />
        <rect x={120} y={1390} width={860} height={200} fill="#2A2E38" />
        {fuego(550, llama)}
        <Olla x={550} color={LECHE}>
          {nata > 0 ? <rect x={345} y={1052} width={410} height={14} fill={NATA} opacity={nata} /> : null}
          {espuma > 0
            ? new Array(18).fill(0).map((_, k) => (
                <circle key={k} cx={360 + (k % 9) * 48} cy={1060 - (espuma * (0.4 + (Math.floor(k / 9) * 0.5))) + Math.sin(t * 5 + k) * 6} r={34} fill="#FFFFFF" />
              ))
            : null}
          {espuma > 0 ? <rect x={345} y={1060 - espuma * 0.9} width={410} height={espuma * 0.9} fill="#FFFFFF" opacity={0.95} /> : null}
        </Olla>
        {/* Espuma que rebosa y chorrea */}
        {espuma > 80 ? (
          <g>
            {new Array(9).fill(0).map((_, k) => (
              <circle key={k} cx={345 + k * 51} cy={985 - (espuma - 80) * 0.6 + Math.sin(t * 6 + k) * 5} r={36} fill="#FFFFFF" />
            ))}
          </g>
        ) : null}
        {derrame > 0
          ? [-1, 1].map((l) => (
              <path key={l} d={`M ${550 + l * 230} 980 Q ${550 + l * 260} 1100 ${550 + l * 250} ${980 + 350 * derrame}`} stroke="#FFFFFF" strokeWidth={34} fill="none" strokeLinecap="round" />
            ))
          : null}
        {derrame > 0.8 ? <ellipse cx={550} cy={1340} rx={340 * derrame} ry={18} fill="#FFFFFF" opacity={0.9} /> : null}
        {/* Cuchara que remueve */}
        {cuchara > 0 ? (
          <g opacity={cuchara} transform={`rotate(${Math.sin(t * 6) * 18} 550 760)`}>
            <line x1={550} y1={760} x2={550} y2={1120} stroke="#C8A070" strokeWidth={22} strokeLinecap="round" />
          </g>
        ) : null}
        <Pildora x={550} y={780} texto="¿cómo evitarlo?" color={C.white} o={ventana(T.final + 0.2, T.leche)} tam={44} />
        <Pildora x={550} y={1500} texto="fuego medio" color={C.cyan} o={ventana(T.fuego, T.sino)} tam={46} />

        {/* Leche al microscopio */}
        <g opacity={verMicro}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <rect x={1380} y={ySup} width={940} height={1420 - ySup} fill={LECHE} opacity={0.18} />
          {/* Gotitas de grasa */}
          {new Array(8).fill(0).map((_, k) => (
            <circle key={k} cx={1460 + k * 110} cy={1200 + (k % 3) * 60} r={16} fill="#F8D860" opacity={0.7} />
          ))}
          {/* Proteínas: sueltas y luego en la piel */}
          {PROT.map((p, i) => {
            const y = p.y + (ySup + 6 - p.y) * piel;
            const x = p.x;
            const a = p.a * (1 - piel);
            return <path key={i} d="M -40 0 q 10 -16 20 0 t 20 0 t 20 0 t 20 0" transform={`translate(${x} ${y}) rotate(${a})`} fill="none" stroke={NATA} strokeWidth={6} strokeLinecap="round" />;
          })}
          <rect x={1380} y={ySup - 4} width={940} height={16} fill={NATA} opacity={piel} />
          {/* Burbujas de vapor: suben; con la piel se quedan atrapadas */}
          {t > T.abajo - 0.3
            ? BURB.map((b, i) => {
                const q = (t * b.v + b.f) % 1;
                let y = 1400 - q * 520;
                if (atrapa) {
                  y = Math.max(y, ySup + 40 + (i % 4) * 52 * (1 + sube));
                }
                return <circle key={i} cx={b.x} cy={y} r={24 + 6 * sube} fill="none" stroke={recubre > 0 ? C.yellow : "#FFFFFF"} strokeWidth={4 + 4 * recubre} />;
              })
            : null}
        </g>
        <Pildora x={1850} y={1390} texto="como espuma de jabón" color={C.white} o={ventana(T.espuma, T.crece)} tam={42} />

        {/* Olla de agua */}
        <g opacity={verAgua}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <rect x={2700} y={1330} width={800} height={50} rx={10} fill="#3A3F4C" />
          {fuego(3100, 1)}
          <Olla x={3100} color={AGUA}>
            {BURB.map((b, i) => {
              const q = (t * b.v * 1.4 + b.f) % 1;
              return <circle key={i} cx={2920 + (i % 7) * 60} cy={1280 - q * 220} r={10 + q * 10} fill="none" stroke="#FFFFFF" strokeWidth={4} />;
            })}
          </Olla>
          {BURB.slice(0, 6).map((b, i) => {
            const q = (t * 1.1 + b.f) % 1;
            return <circle key={i} cx={2960 + i * 55} cy={1056} r={8 + q * 40} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={1 - q} />;
          })}
          {[0, 1, 2].map((k) => {
            const q = (t * 0.6 + k / 3) % 1;
            return <path key={k} d={`M ${2980 + k * 120} ${960 - q * 220} q 24 -36 0 -72 q -24 -36 0 -72`} fill="none" stroke="#C8D8E8" strokeWidth={8} strokeLinecap="round" opacity={0.7 * (1 - q)} />;
          })}
        </g>
        <Pildora x={3100} y={700} texto="sin piel: el vapor sale" color={C.cyan} o={ventana(T.escapa, T.evitar)} tam={40} />
      </g>

      {[T.capa, T.atrapa, T.sale, T.agua].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(PROT[4].x)} y={sy(PROT[4].y)} dx={60} dy={-200} texto="proteína" color={NATA} o={ventana(T.proteinas + 0.2, T.calentarse)} />
      <Tag x={sx(1460)} y={sy(1200)} dx={80} dy={180} texto="grasa" color="#F8D860" o={ventana(T.proteinas + 0.2, T.calentarse)} />
      <Tag x={sx(600)} y={sy(1058)} dx={120} dy={-160} texto="nata" color={NATA} o={ventana(T.nata + 0.2, T.abajo)} />
      <Tag x={sx(BURB[3].x)} y={sy(ySup + 60)} dx={80} dy={200} texto="burbuja atrapada" color={C.yellow} o={ventana(T.resistentes + 0.3, T.espuma)} />
    </svg>
  );
};
