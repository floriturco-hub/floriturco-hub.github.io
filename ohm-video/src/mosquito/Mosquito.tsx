import { Easing, interpolate, random } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, un mosquito sobre la piel en corte (epidermis, dermis, vaso sanguíneo y terminaciones
// nerviosas) con sus seis agujas; en el centro, por qué no duele (haz contra pelo, empujar contra serruchar);
// a la derecha, hembra contra macho.
const PIEL = 1240;
const VASO = 1560;
const M = { x: 540, y: 1000, s: 1.6 };
const BASE: [number, number] = [M.x - 62 * M.s, M.y + 8 * M.s];
const P: [number, number] = [M.x - 80 * M.s, PIEL];
const ROJO = "#E8414F";
const VIOLETA = "#B88AF8";
const AMARILLO = "#F8C848";
const CIAN = "#08D8E8";
const NERVIO = "#F8E070";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 430, 1330, 1.8],
  [T.cuando - 0.3, 430, 1330, 1.86],
  [T.cuando + 0.5, 520, 1150, 1.4],
  [T.dentro - 0.3, 520, 1150, 1.44],
  [T.dentro + 0.5, 430, 1420, 1.65],
  [T.porQue - 0.3, 430, 1420, 1.68],
  [T.porQue + 0.5, 1850, 1030, 1.0],
  [T.picazon - 0.3, 1850, 1030, 1.02],
  [T.picazon + 0.5, 470, 1330, 1.35],
  [T.hembras - 0.3, 470, 1330, 1.38],
  [T.hembras + 0.5, 3100, 1050, 1.0],
  [T.fin + 2, 3100, 1050, 1.05],
];

const camara = (t: number) => {
  const K = camaraKeys();
  let k = 0;
  while (k < K.length - 1 && K[k + 1][0] <= t) {
    k++;
  }
  const a = K[k];
  const b = K[Math.min(k + 1, K.length - 1)];
  const p = b[0] === a[0] ? 0 : interpolate(t, [a[0], b[0]], [0, 1], suave);
  return { cx: a[1] + (b[1] - a[1]) * p, cy: a[2] + (b[2] - a[2]) * p, zoom: a[3] + (b[3] - a[3]) * p };
};

const GLOBULOS = new Array(14).fill(0).map((_, i) => ({ f: random(`g${i}`), dy: (random(`gy${i}`) - 0.5) * 30 }));
const HISTAMINA = new Array(18).fill(0).map((_, i) => ({ a: random(`ha${i}`) * Math.PI * 2, v: 60 + random(`hv${i}`) * 140, f: random(`hf${i}`) }));
const NERVIOS = [140, 280, 560, 700, 860];

// Mosquito de perfil mirando a la izquierda; las patas tocan el suelo en y = 150 (local)
const Mosco: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number; readonly macho?: boolean; readonly trompa?: boolean; readonly o?: number }> = ({
  x,
  y,
  s,
  t,
  macho = false,
  trompa = false,
  o = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    {/* Patas */}
    {[
      [-14, -90, -45, -160],
      [0, 40, -55, 60],
      [14, 150, -60, 210],
    ].map(([x0, kx, ky, fx], i) => (
      <g key={i}>
        <path d={`M ${x0} 18 L ${kx} ${ky} L ${fx} 150`} fill="none" stroke="#3A3440" strokeWidth={3} strokeLinejoin="round" />
        <path d={`M ${x0 + 4} 18 L ${kx + 18} ${ky + 8} L ${fx + 22} 150`} fill="none" stroke="#2A2430" strokeWidth={2.5} strokeLinejoin="round" opacity={0.7} />
      </g>
    ))}
    {/* Alas */}
    <ellipse cx={70} cy={-44} rx={74} ry={14 + 4 * Math.sin(t * 50)} fill="#D8E8F8" opacity={0.35} transform="rotate(-14 70 -44)" stroke="#A8B8C8" strokeWidth={1.5} />
    {/* Abdomen con bandas */}
    <g transform="rotate(-12 90 -18)">
      <ellipse cx={90} cy={-18} rx={66} ry={18} fill="#2A2430" />
      {[0, 1, 2, 3, 4].map((k) => (
        <rect key={k} x={48 + k * 20} y={-34} width={6} height={32} fill="#E8E6F0" opacity={0.8} />
      ))}
    </g>
    {/* Tórax y cabeza */}
    <ellipse cx={0} cy={-4} rx={34} ry={26} fill="#3A3440" />
    <path d="M -10 -26 Q 0 -6 -6 18" stroke="#E8E6F0" strokeWidth={3} fill="none" opacity={0.7} />
    <circle cx={-50} cy={2} r={16} fill="#2A2430" />
    <circle cx={-56} cy={-2} r={8} fill="#5A3A3A" />
    {/* Antenas: plumosas en el macho */}
    <path d="M -58 -10 L -104 -64" stroke="#2A2430" strokeWidth={3} />
    <path d="M -54 -12 L -86 -72" stroke="#2A2430" strokeWidth={3} />
    {new Array(macho ? 12 : 8).fill(0).map((_, k) => (
      <path
        key={k}
        d={`M ${-62 - k * (macho ? 3.5 : 5)} ${-15 - k * (macho ? 4 : 6)} l ${macho ? -22 : -6} ${macho ? -4 : -2} M ${-62 - k * (macho ? 3.5 : 5)} ${-15 - k * (macho ? 4 : 6)} l ${macho ? 8 : 3} ${macho ? -20 : -6}`}
        stroke="#4A4450"
        strokeWidth={macho ? 3.5 : 1.5}
      />
    ))}
    {trompa ? <path d="M -62 8 L -80 120" stroke="#2A2430" strokeWidth={5} strokeLinecap="round" /> : null}
  </g>
);

// Etiqueta anclada a un punto del mundo, con tamaño constante en pantalla
const Tag: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly dx?: number; readonly dy?: number }> = ({
  x,
  y,
  texto,
  color,
  o,
  dx = 0,
  dy = -90,
}) => {
  if (o <= 0) {
    return null;
  }
  const ancho = texto.length * 22 + 36;
  return (
    <g opacity={o}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy + (dy < 0 ? 26 : -30)} stroke={color} strokeWidth={2} opacity={0.7} />
      <circle cx={x} cy={y} r={6} fill={color} />
      <rect x={x + dx - ancho / 2} y={y + dy - 30} width={ancho} height={56} rx={14} fill={C.pill} stroke={color} strokeWidth={2} />
      <text x={x + dx} y={y + dy + 10} textAnchor="middle" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {texto}
      </text>
    </g>
  );
};

const Pildora: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly tam?: number }> = ({ x, y, texto, color, o, tam = 50 }) =>
  o > 0 ? (
    <g opacity={o}>
      <rect x={x - (texto.length * tam * 0.62 + 50) / 2} y={y - tam * 0.95} width={texto.length * tam * 0.62 + 50} height={tam * 1.6} rx={20} fill="#1A1430" stroke={color} strokeWidth={4} />
      <text x={x} y={y + tam * 0.3} textAnchor="middle" fill={color} fontFamily={mono} fontSize={tam} fontWeight={700}>
        {texto}
      </text>
    </g>
  ) : null;

// Línea con dientes de sierra entre dos puntos
const sierra = (x0: number, y0: number, x1: number, y1: number, vibra: number) => {
  const n = 14;
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const nx = -(y1 - y0) / L;
  const ny = (x1 - x0) / L;
  return new Array(n + 1)
    .fill(0)
    .map((_, i) => {
      const u = i / n;
      const d = (i % 2 === 0 ? 0 : 7) + vibra;
      return `${i === 0 ? "M" : "L"} ${x0 + (x1 - x0) * u + nx * d} ${y0 + (y1 - y0) * u + ny * d}`;
    })
    .join(" ");
};

export const MosquitoMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Picada: en el gancho ya está dentro; luego se repite paso a paso
  const gancho = t < T.cuando + 0.4 ? interpolate(t, [T.cuando - 0.2, T.cuando + 0.3], [1, 0], clamp) : 0;
  const pasos = t >= T.cuando;
  const dobla = Math.max(gancho, pasos ? interpolate(t, [T.dobla, T.dobla + 0.9], [0, 1], suave) : 0);
  const prof = Math.max(gancho, pasos ? interpolate(t, [T.dobla + 0.3, T.dobla + 1.2, T.dentro, T.seis], [0, 0.3, 0.3, 0.85], suave) : 0);
  const abre = Math.max(gancho, pasos ? interpolate(t, [T.seis, T.seis + 0.6], [0, 1], suave) : 0);
  const llegaVaso = Math.max(gancho, pasos ? interpolate(t, [T.pajita + 0.3, T.vaso + 0.3], [0, 1], suave) : 0);
  const salivaO = Math.max(gancho, pasos ? interpolate(t, [T.saliva, T.saliva + 0.4], [0, 1], clamp) : 0);
  const sangre = Math.max(gancho, pasos ? interpolate(t, [T.coagule, T.coagule + 0.4], [0, 1], clamp) : 0);
  const vibra = t < T.cuando || (t >= T.cortan && t < T.picazon) ? Math.sin(t * 70) * 4 : 0;
  const vuela = interpolate(t, [T.picazon, T.picazon + 1.0], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const retira = 1 - interpolate(t, [T.picazon - 0.1, T.picazon + 0.3], [0, 1], clamp);
  // Resalte por grupos: sierras, separadores, pajita, saliva
  const grupo = (desde: number, hasta: number) => (t >= T.dos && t < T.porQue ? (t >= desde && t < hasta ? 1 : 0.3) : 1);
  const oSierras = grupo(T.dos, T.otras);
  const oSeparadores = grupo(T.otras, T.pajita);
  const oPajita = grupo(T.pajita, T.saliva);
  const oSaliva = grupo(T.saliva, T.porQue);

  // Hinchazón y picor
  const histamina = interpolate(t, [T.histamina, T.histamina + 2.0], [0, 1], clamp);
  const bulto = interpolate(t, [T.histamina + 0.6, T.hincha + 0.6], [0, 60], suave);
  const picor = ventana(T.hincha, T.hembras + 0.3);
  const superficie = (x: number) => PIEL - bulto * Math.exp(-(((x - P[0]) / 140) ** 2));

  // Por qué no duele
  const comparaPelo = ventana(T.porQue - 0.2, T.serrucha + 0.1, 0.6, 0.4);
  const empujar = ventana(T.serrucha - 0.2, T.picazon + 0.2, 0.4, 0.6);
  const bajaAguja = interpolate(t, [T.serrucha, T.serrucha + 0.8], [0, 1], suave);
  const dolorEmpuja = interpolate(t, [T.serrucha + 0.6, T.serrucha + 0.9], [0, 1], clamp);
  const bajaSierra = interpolate(t, [T.serrucha, T.sensores], [0, 1], clamp);

  // Hembra contra macho
  const parejas = ventana(T.hembras - 0.3, T.fin + 2, 0.6, 0.4);
  const huevos = interpolate(t, [T.huevos, T.huevos + 0.6], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const largo = prof * (VASO - 40 - PIEL) * retira;

  // Agujas: ángulo respecto a la vertical, largo relativo, color
  const aguja = (ang: number, rel: number) => {
    const a = ((ang * abre) * Math.PI) / 180;
    return [P[0] + Math.sin(a) * largo * rel, P[1] + Math.cos(a) * largo * rel] as [number, number];
  };
  const tipPajita: [number, number] = [P[0] + Math.sin(t * 2.2) * 50 * (1 - llegaVaso) * abre + 30 * llegaVaso * abre, P[1] + largo * (0.75 + 0.25 * llegaVaso)];
  const curvaLabio = `M ${BASE[0]} ${BASE[1]} Q ${(BASE[0] + P[0]) / 2 + 90 * dobla * retira} ${(BASE[1] + P[1]) / 2 + 20 * dobla} ${P[0] + 6 * dobla * retira} ${P[1] - 2}`;

  const piel = (
    <g>
      {/* Dermis, vaso y nervios */}
      <rect x={-300} y={PIEL} width={1600} height={800} fill="#D88A88" />
      <rect x={-300} y={VASO - 34} width={1600} height={68} rx={34} fill="#A8202A" />
      {GLOBULOS.map((g, i) => (
        <ellipse key={i} cx={-300 + ((g.f + t * 0.08) % 1) * 1600} cy={VASO + g.dy} rx={16} ry={9} fill="#E8414F" />
      ))}
      {NERVIOS.map((x, i) => (
        <path key={i} d={`M ${x} 1800 C ${x + 20} 1700, ${x - 30} 1500, ${x} 1360 M ${x} 1420 l -40 -50 M ${x} 1420 l 36 -46 M ${x + 4} 1500 l 40 -30`} fill="none" stroke={NERVIO} strokeWidth={5} opacity={0.45} />
      ))}
      {/* Mastocitos */}
      {[-120, 0, 120].map((dx, i) => (
        <circle key={i} cx={P[0] + dx} cy={1400 + (i % 2) * 40} r={20} fill="#9A6AC8" opacity={0.6 + 0.4 * histamina * (i === 1 ? 1 : 0.6)} />
      ))}
      {/* Epidermis con el bulto */}
      <path d={`M -300 ${superficie(-300)} ${new Array(81).fill(0).map((_, i) => `L ${-300 + i * 20} ${superficie(-300 + i * 20).toFixed(1)}`).join(" ")} L 1300 1330 L -300 1330 Z`} fill="#F0C8A8" />
      <path d={`M -300 ${superficie(-300)} ${new Array(81).fill(0).map((_, i) => `L ${-300 + i * 20} ${superficie(-300 + i * 20).toFixed(1)}`).join(" ")}`} fill="none" stroke="#C89878" strokeWidth={4} />
      <ellipse cx={P[0]} cy={superficie(P[0]) + 30} rx={160} ry={50} fill={ROJO} opacity={0.25 * (bulto / 60)} />
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        <rect x={-300} y={-400} width={1600} height={2400} fill="#1A1636" opacity={0.6} />
        {piel}
        {/* Histamina */}
        {histamina > 0
          ? HISTAMINA.map((h, i) => {
              const p = Math.min(1, histamina * (0.6 + h.f));
              return <circle key={i} cx={P[0] + Math.cos(h.a) * h.v * p} cy={1410 + Math.sin(h.a) * h.v * p * 0.6} r={8} fill="#7AE87A" opacity={1 - p * 0.5} />;
            })
          : null}
        {picor > 0
          ? [-1, 0, 1].map((k) => (
              <path key={k} d={`M ${P[0] + k * 70 - 12} ${superficie(P[0]) - 40 - Math.abs(k) * 10} l 8 -24 l 8 24 l 8 -24`} fill="none" stroke={ROJO} strokeWidth={5} opacity={picor * (0.6 + 0.4 * Math.sin(t * 12 + k))} />
            ))
          : null}

        {/* Agujas dentro de la piel */}
        {largo > 2 ? (
          <g>
            {abre < 0.05 ? (
              <line x1={P[0]} y1={P[1]} x2={P[0]} y2={P[1] + largo} stroke="#3A3440" strokeWidth={9} strokeLinecap="round" />
            ) : (
              <g>
                {[-14, 14].map((ang) => {
                  const [x1, y1] = aguja(ang, 0.62);
                  return <path key={ang} d={sierra(P[0], P[1], x1, y1, vibra)} fill="none" stroke={ROJO} strokeWidth={4} opacity={oSierras} />;
                })}
                {[-7, 7].map((ang) => {
                  const [x1, y1] = aguja(ang, 0.5);
                  return <line key={ang} x1={P[0]} y1={P[1]} x2={x1} y2={y1} stroke={VIOLETA} strokeWidth={6} strokeLinecap="round" opacity={oSeparadores} />;
                })}
                {(() => {
                  const [x1, y1] = aguja(-24, 0.7);
                  return (
                    <g opacity={oSaliva}>
                      <line x1={P[0]} y1={P[1]} x2={x1} y2={y1} stroke={CIAN} strokeWidth={5} strokeLinecap="round" />
                      {salivaO > 0
                        ? [0, 1, 2, 3].map((k) => {
                            const p = (t * 0.7 + k / 4) % 1;
                            return <circle key={k} cx={x1 - 10 - p * 60} cy={y1 + p * 40} r={9 * (1 - p * 0.5)} fill={CIAN} opacity={salivaO * (1 - p)} />;
                          })
                        : null}
                    </g>
                  );
                })()}
                <path d={`M ${P[0]} ${P[1]} Q ${P[0] + 40 * abre} ${P[1] + largo * 0.5} ${tipPajita[0]} ${tipPajita[1]}`} fill="none" stroke={AMARILLO} strokeWidth={7} strokeLinecap="round" opacity={oPajita} />
                {sangre > 0
                  ? [0, 1, 2, 3, 4].map((k) => {
                      const p = (t * 0.9 + k / 5) % 1;
                      const u = 1 - p;
                      const bx = (1 - u) * (1 - u) * P[0] + 2 * (1 - u) * u * (P[0] + 40 * abre) + u * u * tipPajita[0];
                      const by = (1 - u) * (1 - u) * P[1] + 2 * (1 - u) * u * (P[1] + largo * 0.5) + u * u * tipPajita[1];
                      return <circle key={k} cx={bx} cy={by} r={6} fill={ROJO} opacity={sangre * oPajita} />;
                    })
                  : null}
              </g>
            )}
          </g>
        ) : null}
        {/* Haz por encima de la piel y funda (labio) que se dobla */}
        <g opacity={1 - vuela}>
          {retira > 0.05 ? <line x1={BASE[0]} y1={BASE[1]} x2={P[0]} y2={P[1]} stroke="#5A5060" strokeWidth={5} /> : null}
          <path d={curvaLabio} fill="none" stroke="#2A2430" strokeWidth={11} strokeLinecap="round" />
        </g>
        <Mosco x={M.x + 700 * vuela} y={M.y - 600 * vuela} s={M.s} t={t} o={1 - vuela} />

        {/* Por qué no duele: haz contra pelo */}
        <g opacity={comparaPelo}>
          <rect x={1340} y={600} width={1020} height={860} rx={40} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          <rect x={1560} y={660} width={180} height={620} rx={20} fill="#7A5030" />
          {new Array(10).fill(0).map((_, k) => (
            <path key={k} d={`M 1560 ${690 + k * 60} q 90 -24 180 0`} fill="none" stroke="#9A7050" strokeWidth={4} />
          ))}
          <rect x={2010} y={660} width={84} height={620} rx={14} fill="#3A3440" />
          {[ROJO, VIOLETA, AMARILLO, CIAN, VIOLETA, ROJO].map((c, k) => (
            <rect key={k} x={2016 + k * 12.5} y={670} width={9} height={600} rx={4} fill={c} opacity={0.85} />
          ))}
          <text x={1650} y={1360} textAnchor="middle" fill="#C89870" fontFamily={mono} fontSize={40} fontWeight={700}>
            un pelo
          </text>
          <text x={2052} y={1360} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
            6 agujas
          </text>
        </g>

        {/* Empujar contra serruchar */}
        <g opacity={empujar}>
          <rect x={1340} y={600} width={1020} height={860} rx={40} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          {[0, 1].map((lado) => {
            const x0 = lado === 0 ? 1370 : 1870;
            const xc = x0 + 230;
            const hunde = lado === 0 ? 40 * bajaAguja : 0;
            const chispa = lado === 0 ? dolorEmpuja * (0.6 + 0.4 * Math.sin(t * 30)) : 0.08;
            return (
              <g key={lado}>
                <text x={xc} y={680} textAnchor="middle" fill={lado === 0 ? ROJO : C.cyan} fontFamily={mono} fontSize={40} fontWeight={700}>
                  {lado === 0 ? "empujar" : "serruchar"}
                </text>
                <rect x={x0} y={1000} width={460} height={420} fill="#D88A88" />
                <path d={`M ${x0} 1000 L ${xc - 120} 1000 Q ${xc} ${1000 + hunde * 2.2} ${xc + 120} 1000 L ${x0 + 460} 1000 L ${x0 + 460} 1060 L ${x0} 1060 Z`} fill="#F0C8A8" />
                {[xc - 110, xc + 10, xc + 120].map((nx, k) => (
                  <g key={k}>
                    <path d={`M ${nx} 1400 C ${nx + 16} 1300, ${nx - 20} 1180, ${nx} 1080 M ${nx} 1120 l -30 -36 M ${nx} 1120 l 28 -34`} fill="none" stroke={NERVIO} strokeWidth={5} opacity={0.4 + 0.6 * chispa} />
                    <circle cx={nx} cy={1080} r={18 + 26 * chispa} fill={NERVIO} opacity={0.5 * chispa} />
                  </g>
                ))}
                {lado === 0 ? (
                  <g>
                    <path d={`M ${xc - 22} ${760 + 200 * bajaAguja} L ${xc + 22} ${760 + 200 * bajaAguja} L ${xc} ${830 + 200 * bajaAguja + hunde} Z`} fill="#A8A8B8" />
                    <rect x={xc - 22} y={700 + 200 * bajaAguja - 60} width={44} height={120} fill="#A8A8B8" />
                    <path d={`M ${xc + 60} 760 l 0 120 m -24 -30 l 24 30 l 24 -30`} fill="none" stroke={ROJO} strokeWidth={10} strokeLinecap="round" />
                    <text x={xc} y={1250} textAnchor="middle" fill={ROJO} fontFamily={mono} fontSize={56} fontWeight={700} opacity={dolorEmpuja}>
                      ¡ay!
                    </text>
                  </g>
                ) : (
                  <g>
                    <path d={sierra(xc + Math.sin(t * 60) * 6, 760, xc + Math.sin(t * 60) * 6, 1000 + 160 * bajaSierra, 0)} fill="none" stroke={ROJO} strokeWidth={5} />
                    <path d={`M ${xc + 60} 800 l 0 40 m -12 -12 l 12 12 l 12 -12`} fill="none" stroke={C.cyan} strokeWidth={6} strokeLinecap="round" />
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Hembra contra macho */}
        <g opacity={parejas}>
          <rect x={2600} y={620} width={1000} height={900} rx={40} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          <line x1={2640} y1={1180} x2={3560} y2={1180} stroke="#3A3360" strokeWidth={4} />
          <Mosco x={2840} y={1008} s={1.15} t={t} trompa />
          <Mosco x={3340} y={1008} s={1.15} t={t} macho trompa />
          <text x={2850} y={1260} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={42} fontWeight={700}>
            hembra
          </text>
          <text x={3330} y={1260} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={42} fontWeight={700}>
            macho
          </text>
          <text x={2850} y={1340} textAnchor="middle" fill="#48C878" fontFamily={mono} fontSize={40} fontWeight={700}>
            ✓ pica
          </text>
          <text x={3330} y={1340} textAnchor="middle" fill={ROJO} fontFamily={mono} fontSize={40} fontWeight={700}>
            ✗ no pica
          </text>
          <g opacity={huevos}>
            <path d="M 2700 1440 q 18 -40 0 -64 q -18 24 0 64 z" fill={ROJO} transform="translate(0 -10)" />
            <path d="M 2740 1410 l 60 0 m -16 -14 l 16 14 l -16 14" fill="none" stroke={C.grey} strokeWidth={5} />
            {new Array(7).fill(0).map((_, k) => (
              <ellipse key={k} cx={2840 + k * 26} cy={1410} rx={10} ry={20} fill="#3A3440" stroke="#8A84A8" strokeWidth={2} />
            ))}
            <text x={2930} y={1480} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28}>
              huevos
            </text>
          </g>
        </g>
      </g>

      <Pildora x={sx(P[0] + 260)} y={sy(1300)} texto="× 6" color={C.yellow} o={ventana(-1, T.cuando)} tam={64} />
      <Tag x={sx((BASE[0] + P[0]) / 2 + 50 * dobla)} y={sy((BASE[1] + P[1]) / 2)} dx={-150} dy={-200} texto="funda" color={C.white} o={ventana(T.funda, T.dentro)} />
      <Tag x={sx(aguja(14, 0.62)[0])} y={sy(aguja(14, 0.62)[1])} dx={190} dy={60} texto="sierras" color={ROJO} o={ventana(T.dos, T.otras)} />
      <Tag x={sx(aguja(7, 0.5)[0])} y={sy(aguja(7, 0.5)[1])} dx={220} dy={-40} texto="separadores" color={VIOLETA} o={ventana(T.otras, T.pajita)} />
      <Tag x={sx(tipPajita[0])} y={sy(tipPajita[1])} dx={200} dy={60} texto="pajita" color={AMARILLO} o={ventana(T.pajita, T.saliva)} />
      <Tag x={sx(aguja(-24, 0.7)[0])} y={sy(aguja(-24, 0.7)[1])} dx={-120} dy={130} texto="saliva" color={CIAN} o={ventana(T.saliva, T.porQue)} />
      <Tag x={sx(480)} y={sy(VASO)} dx={0} dy={150} texto="vaso sanguíneo" color={ROJO} o={ventana(T.vaso, T.saliva)} />
      <Tag x={sx(P[0])} y={sy(1410)} dx={200} dy={170} texto="histamina" color="#7AE87A" o={ventana(T.histamina, T.hembras)} />
    </svg>
  );
};
