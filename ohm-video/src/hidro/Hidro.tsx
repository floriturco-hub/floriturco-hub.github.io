import { interpolate, random } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una camiseta donde rebota una gota de kétchup; en el centro, la superficie al microscopio
// (bultitos, pelusas, capa que repele, la gota sobre un colchón de aire y el desgaste); a la derecha, gota normal frente a
// esfera y la gota que rueda limpiando el polvo; al fondo, la flor de loto sobre el lodo.
// Retención (estilo §10): cambio de plano cada 2-3 s y final que empalma con el gancho (el kétchup que rebota).
const KETCHUP = "#C8201A";
const VINO = "#7A1A4A";
const AGUA = "#4AA8F8";
const CAPA = C.cyan;
const BASE = 1250;
const PILARES = new Array(9).fill(0).map((_, i) => 1420 + i * 110);
const POLVO = new Array(10).fill(0).map((_, i) => ({ u: 0.08 + i * 0.09, d: random(`pd${i}`) * 10 }));

const camaraKeys = (): ClaveCamara[] => [
  [0, 550, 1000, 1.05],
  [T.final - 0.1, 550, 1000, 1.1],
  [T.final + 0.2, 550, 940, 1.35],
  [T.superficie - 0.1, 550, 940, 1.38],
  [T.superficie + 0.2, 1850, 1060, 1.0],
  [T.bultitos - 0.1, 1850, 1060, 1.03],
  [T.bultitos + 0.2, 1850, 1150, 1.45],
  [T.pelusas - 0.1, 1850, 1150, 1.48],
  [T.pelusas + 0.2, 1860, 1120, 2.4],
  [T.capa - 0.1, 1860, 1120, 2.45],
  [T.capa + 0.2, 1850, 1120, 1.4],
  [T.gota - 0.1, 1850, 1120, 1.43],
  [T.gota + 0.2, 1850, 1000, 0.95],
  [T.apoya - 0.1, 1850, 1000, 0.98],
  [T.apoya + 0.2, 1850, 1120, 2.0],
  [T.colchon - 0.1, 1850, 1120, 2.03],
  [T.colchon + 0.2, 1850, 1150, 1.4],
  [T.contacto - 0.1, 1850, 1150, 1.43],
  [T.contacto + 0.2, 3100, 1030, 1.0],
  [T.esfera - 0.1, 3100, 1030, 1.03],
  [T.esfera + 0.2, 3330, 1080, 1.5],
  [T.rueda - 0.1, 3330, 1080, 1.53],
  [T.rueda + 0.2, 3100, 1100, 1.0],
  [T.polvo - 0.1, 3100, 1100, 1.03],
  [T.polvo + 0.2, 3200, 1150, 1.25],
  [T.ojo - 0.1, 3200, 1150, 1.28],
  [T.ojo + 0.2, 1850, 1060, 1.0],
  [T.desgastan - 0.1, 1850, 1060, 1.03],
  [T.desgastan + 0.2, 1850, 1150, 1.4],
  [T.planta - 0.1, 1850, 1150, 1.43],
  [T.planta + 0.2, 4350, 1030, 1.0],
  [T.loto - 0.1, 4350, 1030, 1.03],
  [T.loto + 0.2, 4350, 1000, 1.35],
  [T.limpia - 0.1, 4350, 1000, 1.38],
  [T.limpia + 0.2, 4350, 1080, 1.05],
  [T.poreso - 0.1, 4350, 1080, 1.08],
  [T.poreso + 0.25, 550, 1000, 1.05],
  [T.fin + 0.3, 550, 1000, 1.1],
];

// Gota que rebota sobre la camiseta (τ = tiempo desde que entra)
const rebote = (tau: number, x0: number) => {
  const ys = 1040;
  let x = x0 + 170 * tau;
  let y = ys - 440 * Math.exp(-tau * 1.3) * Math.abs(Math.cos((Math.PI * tau) / 0.9));
  if (x > 820) {
    const extra = (x - 820) / 170;
    y += 900 * extra * extra;
    x = 820 + (x - 820) * 0.6;
  }
  const cerca = Math.abs(Math.cos((Math.PI * tau) / 0.9));
  return { x, y, aplasta: x < 820 && cerca < 0.18 ? 0.7 : 1 };
};

export const HidroMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.3, sale = 0.3) => ventanaEn(t, a, b, entra, sale);
  const destello = (a: number) => interpolate(t, [a, a + 0.06, a + 0.4], [0, 1, 0], clamp);

  // Camiseta
  const tau = t < T.superficie ? t : t > T.poreso - 0.3 ? t - T.poreso + 0.3 : -1;
  const k1 = tau >= 0 ? rebote(tau, 380) : null;
  const k2 = t > T.final - 0.2 && t < T.superficie ? rebote(t - T.final + 0.2, 300) : null;

  // Superficie al microscopio
  const verMicro = Math.max(ventana(T.superficie - 0.1, T.contacto + 0.2), ventana(T.ojo - 0.1, T.planta + 0.2));
  const desgaste = interpolate(t, [T.ojo + 0.4, T.desgastan + 0.6], [0, 1], clamp);
  const H = 120 - 90 * desgaste;
  const pelusas = interpolate(t, [T.pelusas, T.pelusas + 0.4], [0, 1], clamp) * (1 - desgaste);
  const capa = interpolate(t, [T.capa, T.capa + 0.4], [0, 1], clamp) * (1 - desgaste);
  const R = 320;
  const cae = interpolate(t, [T.gota, T.gota + 0.5], [0, 1], clamp);
  const gotaY = interpolate(cae, [0, 1], [200, BASE - H - R + 6]);
  const verGota = t > T.gota && t < T.contacto + 0.2 ? 1 : 0;
  const aire = ventana(T.colchon, T.contacto);
  const puntas = ventana(T.apoya, T.colchon + 0.4);
  const cepillo = ventana(T.ojo + 0.2, T.desgastan + 0.8);
  const charco = interpolate(t, [T.desgastan + 0.9, T.desgastan + 1.5], [0, 1], clamp) * (t < T.planta + 0.2 ? 1 : 0);

  // Comparación y gota que rueda
  const verComp = ventana(T.contacto - 0.1, T.ojo + 0.2);
  const comp = ventana(T.contacto - 0.1, T.rueda, 0.3, 0.3);
  const rodar = ventana(T.rueda - 0.1, T.ojo + 0.2, 0.3, 0.3);
  const u = interpolate(t, [T.rueda + 0.2, T.ojo - 0.2], [0, 1], clamp);
  const pista = (v: number): [number, number] => [2700 + 820 * v, 1000 + 260 * v];
  const [gx, gy] = pista(u);

  // Loto
  const verLoto = ventana(T.planta - 0.1, T.poreso + 0.2);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const gotaRoja = (k: { x: number; y: number; aplasta: number } | null, color: string, r: number) =>
    k ? (
      <g transform={`translate(${k.x} ${k.y - r * k.aplasta}) scale(${1 + (1 - k.aplasta) * 0.6} ${k.aplasta})`}>
        <circle r={r} fill={color} />
        <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.25} fill="#FFFFFF" opacity={0.5} />
      </g>
    ) : null;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={5400} height={2400} fill="#1A1C2A" />

        {/* Camiseta */}
        <path d="M 250 700 L 430 640 Q 550 710 670 640 L 850 700 L 960 880 L 840 940 L 820 900 L 820 1450 L 280 1450 L 280 900 L 260 940 L 140 880 Z" fill="#F0F0F4" />
        <path d="M 430 640 Q 550 710 670 640" fill="none" stroke="#C8C8D0" strokeWidth={10} />
        {gotaRoja(k1, KETCHUP, 60)}
        {gotaRoja(k2, VINO, 48)}
        <Pildora x={550} y={1550} texto="¡sin mancha!" color={C.yellow} o={Math.max(ventana(0.8, T.final), ventana(T.poreso + 0.6, T.fin + 2))} tam={46} />
        <Pildora x={550} y={560} texto="¿qué planta?" color={C.white} o={ventana(T.final + 0.4, T.superficie)} tam={44} />

        {/* Superficie al microscopio */}
        <g opacity={verMicro}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <rect x={1360} y={BASE} width={980} height={190} fill="#8A90A8" />
          {aire > 0
            ? PILARES.slice(0, -1).map((x, i) => <rect key={i} x={x + 28} y={BASE - H} width={54} height={H} fill="#E8F4FF" opacity={0.45 * aire} />)
            : null}
          {PILARES.map((x, i) => (
            <g key={i}>
              <path d={`M ${x - 28} ${BASE} L ${x - 28} ${BASE - H + 28} A 28 28 0 0 1 ${x + 28} ${BASE - H + 28} L ${x + 28} ${BASE} Z`} fill="#8A90A8" stroke={CAPA} strokeWidth={5} strokeOpacity={capa} />
              {pelusas > 0
                ? [-18, -9, 0, 9, 18].map((d) => (
                    <line key={d} x1={x + d} y1={BASE - H + 6 + Math.abs(d) * 0.5} x2={x + d * 1.4} y2={BASE - H - 16 + Math.abs(d) * 0.5} stroke="#C8CEE0" strokeWidth={4} opacity={pelusas} />
                  ))
                : null}
              {puntas > 0 && Math.abs(x - 1850) < 180 ? <circle cx={x} cy={BASE - H - 4} r={12} fill={C.yellow} opacity={puntas} /> : null}
            </g>
          ))}
          {verGota ? (
            <g>
              <circle cx={1850} cy={gotaY} r={R} fill={AGUA} opacity={0.6} />
              <ellipse cx={1740} cy={gotaY - 140} rx={70} ry={40} fill="#FFFFFF" opacity={0.45} />
            </g>
          ) : null}
          {cepillo > 0 ? (
            <g opacity={cepillo} transform={`translate(${Math.sin(t * 9) * 220} 0)`}>
              <rect x={1700} y={BASE - H - 110} width={300} height={70} rx={14} fill="#5A5F6C" />
              {new Array(12).fill(0).map((_, k) => (
                <line key={k} x1={1710 + k * 25} y1={BASE - H - 40} x2={1710 + k * 25} y2={BASE - H - 4} stroke="#C8B080" strokeWidth={5} />
              ))}
            </g>
          ) : null}
          {charco > 0 ? <path d={`M ${1850 - 380 * charco} ${BASE - H} Q 1850 ${BASE - H - 130 * (2 - charco)} ${1850 + 380 * charco} ${BASE - H} Z`} fill={AGUA} opacity={0.65} /> : null}
        </g>
        <Pildora x={1850} y={1395} texto="se pierde" color={C.red} o={ventana(T.desgastan + 1.2, T.planta)} tam={44} />

        {/* Gota normal frente a esfera, y la gota que rueda */}
        <g opacity={verComp}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <g opacity={comp}>
            <line x1={2660} y1={1200} x2={3540} y2={1200} stroke="#8A90A8" strokeWidth={10} />
            <path d="M 2700 1200 Q 2870 1110 3040 1200 Z" fill={AGUA} opacity={0.7} />
            <text x={2870} y={1290} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
              normal: moja
            </text>
            <circle cx={3330} cy={1078} r={120} fill={AGUA} opacity={0.7} />
            <ellipse cx={3290} cy={1030} rx={30} ry={18} fill="#FFFFFF" opacity={0.5} />
            <path d="M 3430 1195 A 100 100 0 0 0 3300 1080" fill="none" stroke={C.yellow} strokeWidth={6} opacity={ventana(T.esfera, T.rueda)} />
            <text x={3330} y={1290} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={34} fontWeight={700}>
              esfera
            </text>
          </g>
          <g opacity={rodar}>
            <line x1={2680} y1={1062} x2={3540} y2={1335} stroke="#8A90A8" strokeWidth={10} />
            {POLVO.map((p, i) => {
              const [px, py] = pista(p.u);
              const recogido = u > p.u;
              return (
                <circle
                  key={i}
                  cx={recogido ? gx + Math.cos(i * 2.3 + u * 30) * 40 : px + 10}
                  cy={recogido ? gy - 40 + Math.sin(i * 2.3 + u * 30) * 40 : py + 50}
                  r={8}
                  fill="#7A5A3A"
                />
              );
            })}
            <circle cx={gx} cy={gy - 40} r={60} fill={AGUA} opacity={0.75} />
            <ellipse cx={gx - 20} cy={gy - 62} rx={16} ry={10} fill="#FFFFFF" opacity={0.6} />
          </g>
        </g>
        <Pildora x={3330} y={700} texto="≈ 160°" color={C.yellow} o={ventana(T.esfera + 0.2, T.rueda)} tam={50} />

        {/* Flor de loto */}
        <g opacity={verLoto}>
          <Panel x0={3850} y0={600} x1={4850} y1={1460} />
          <rect x={3870} y={1260} width={960} height={180} rx={20} fill="#5A4024" />
          <rect x={3870} y={1200} width={960} height={70} fill="#2A5A7A" opacity={0.7} />
          <ellipse cx={4350} cy={1200} rx={330} ry={70} fill="#3A8A4A" />
          {[4180, 4280, 4420, 4520].map((x, k) => (
            <circle key={k} cx={x} cy={1170 - (k % 2) * 10} r={18 + (k % 2) * 6} fill={AGUA} opacity={0.8} />
          ))}
          <line x1={4350} y1={1140} x2={4350} y2={980} stroke="#3A8A4A" strokeWidth={14} />
          {[-60, -30, 0, 30, 60].map((a) => (
            <ellipse key={a} cx={4350} cy={880} rx={44} ry={120} fill="#F8A8C8" stroke="#E87AA8" strokeWidth={4} transform={`rotate(${a} 4350 980)`} />
          ))}
          <circle cx={4350} cy={960} r={30} fill={C.yellow} />
        </g>
        <Pildora x={4350} y={700} texto="limpia sobre el lodo" color="#F8A8C8" o={ventana(T.limpia, T.poreso + 0.2)} tam={40} />
      </g>

      {[T.gota + 0.5, T.rueda, T.planta].map((q) => (
        <rect key={q} x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.2 * destello(q)} />
      ))}
      <Tag x={sx(PILARES[3])} y={sy(BASE - H + 30)} dx={-40} dy={-220} texto="bultito" color="#C8CEE0" o={ventana(T.bultitos + 0.3, T.pelusas)} />
      <Tag x={sx(PILARES[4])} y={sy(BASE - H - 14)} dx={70} dy={-160} texto="pelusas" color="#C8CEE0" o={ventana(T.pelusas + 0.3, T.capa)} />
      <Tag x={sx(PILARES[5] + 28)} y={sy(BASE - 40)} dx={60} dy={160} texto="capa que repele" color={CAPA} o={ventana(T.capa + 0.3, T.gota)} />
      <Tag x={sx(PILARES[5] + 55)} y={sy(BASE - 60)} dx={80} dy={170} texto="aire" color="#E8F4FF" o={ventana(T.colchon + 0.3, T.contacto)} />
      <Tag x={sx(gx)} y={sy(gy - 40)} dx={-80} dy={-200} texto="recoge el polvo" color="#C8A070" o={ventana(T.polvo, T.ojo)} />
    </svg>
  );
};
