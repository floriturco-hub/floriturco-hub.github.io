import { Easing, interpolate, random } from "remotion";
import { Persona } from "../orinar/Persona";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una persona con rayos X (cerebro, nervio vago e intestino); en el centro, la pared del
// intestino vista de cerca con sus bacterias; a la derecha, el laboratorio con ratones.
type P2 = [number, number];
const PX = 400;
const SUELO = 1720;
const CABEZA: P2 = [PX, SUELO - 712];
const CEREBRO: P2 = [PX - 6, CABEZA[1] - 26];
const TRIPA: P2 = [PX + 2, SUELO - 470];
const VAGO: P2[] = [
  [PX - 14, CABEZA[1] + 2],
  [PX - 18, CABEZA[1] + 70],
  [PX - 30, SUELO - 610],
  [PX - 36, SUELO - 530],
  [PX - 20, TRIPA[1] - 30],
  [TRIPA[0] - 4, TRIPA[1] - 6],
];
const MICRO = { x0: 1300, x1: 2300, y0: 560, y1: 1500, pared: 1240 };
const LAB = { x0: 2600, x1: 3500, suelo: 1300 };
const ROSA = "#FF7AA8";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 400, 1220, 1.9],
  [T.billones - 0.4, 400, 1220, 1.92],
  [T.billones + 0.5, 1800, 1060, 1.0],
  [T.parece - 0.3, 1800, 1060, 1.02],
  [T.parece + 0.6, 420, 1200, 1.3],
  [T.nervio - 0.3, 420, 1200, 1.32],
  [T.nervio + 0.6, 400, 1150, 1.75],
  [T.fabrican - 0.3, 400, 1150, 1.77],
  [T.fabrican + 0.6, 1800, 1080, 1.1],
  [T.ratones - 0.3, 1800, 1080, 1.12],
  [T.ratones + 0.6, 3060, 1130, 1.2],
  [T.humanos - 0.3, 3060, 1130, 1.22],
  [T.humanos + 0.7, 460, 1250, 1.2],
  [T.final - 0.3, 460, 1250, 1.22],
  [T.final + 0.5, 420, 1200, 1.4],
  [T.fin, 420, 1200, 1.43],
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

const enVago = (u: number): P2 => {
  const tramos = VAGO.length - 1;
  const v = Math.max(0, Math.min(0.9999, u)) * tramos;
  const i = Math.floor(v);
  const f = v - i;
  return [VAGO[i][0] + (VAGO[i + 1][0] - VAGO[i][0]) * f, VAGO[i][1] + (VAGO[i + 1][1] - VAGO[i][1]) * f];
};

const BICHOS = new Array(26).fill(0).map((_, i) => ({ u: random(`bu${i}`), v: random(`bv${i}`), tipo: i % 3, f: random(`bf${i}`) * 6 }));
const MINIS = new Array(14).fill(0).map((_, i) => ({ a: random(`ma${i}`) * Math.PI * 2, r: random(`mr${i}`) }));

// Bacteria: bastón, coco (en pareja) o espiral, que se mueve un poco
const Bacteria: React.FC<{ readonly x: number; readonly y: number; readonly tipo: number; readonly t: number; readonly f: number }> = ({ x, y, tipo, t, f }) => {
  const giro = Math.sin(t * 1.2 + f) * 25 + f * 30;
  const colores = ["#7AD86A", "#E8A040", "#A87AE8"];
  return (
    <g transform={`translate(${x + Math.sin(t * 0.8 + f) * 10} ${y + Math.cos(t * 0.7 + f) * 8}) rotate(${giro})`}>
      {tipo === 0 ? <rect x={-26} y={-10} width={52} height={20} rx={10} fill={colores[0]} /> : null}
      {tipo === 1 ? (
        <g>
          <circle cx={-11} cy={0} r={12} fill={colores[1]} />
          <circle cx={11} cy={0} r={12} fill={colores[1]} />
        </g>
      ) : null}
      {tipo === 2 ? <path d={`M -30 0 q 7.5 -${12 + Math.sin(t * 6 + f) * 3} 15 0 t 15 0 t 15 0 t 15 0`} fill="none" stroke={colores[2]} strokeWidth={8} strokeLinecap="round" /> : null}
      {tipo !== 2 ? <path d="M 26 0 q 10 6 18 0" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={2} transform={tipo === 1 ? "translate(-4 0)" : ""} /> : null}
    </g>
  );
};

// Ratón de perfil: de pie (0) o tumbado y apático (1); `tiembla` para el estrés
const Raton: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly apatia: number; readonly tiembla: number }> = ({ x, y, t, apatia, tiembla }) => {
  const dx = Math.sin(t * 40) * 3 * tiembla;
  const alto = 1 - 0.35 * apatia;
  return (
    <g transform={`translate(${x + dx} ${y})`}>
      <path d={`M -60 -6 q -40 10 -70 -10`} fill="none" stroke="#C89AA0" strokeWidth={5} strokeLinecap="round" />
      <ellipse cx={0} cy={-34 * alto} rx={62} ry={34 * alto} fill="#D8D4E4" />
      <ellipse cx={58} cy={-36 * alto + 14 * apatia} rx={30} ry={22 * alto} fill="#D8D4E4" />
      <circle cx={46} cy={-62 * alto + 14 * apatia} r={14} fill="#E8B8C8" />
      <circle cx={70} cy={-40 * alto + 14 * apatia} r={apatia > 0.5 ? 1.5 : 4} fill="#1A1430" />
      {apatia > 0.5 ? <path d={`M 64 ${-40 * alto + 14 * apatia} l 12 0`} stroke="#1A1430" strokeWidth={3} /> : null}
      <circle cx={88} cy={-32 * alto + 14 * apatia} r={5} fill="#E8A0B0" />
      {tiembla > 0
        ? [0, 1].map((k) => <path key={k} d={`M ${-80 + k * 150} -90 q 6 -10 0 -20`} fill="none" stroke={C.cyan} strokeWidth={3} opacity={tiembla} />)
        : null}
    </g>
  );
};

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

export const Eje: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Conversación por el nervio vago: casi todo sube (amarillo), algo baja (cian)
  const vago = Math.max(ventana(T.parece, T.fabrican + 0.3), 0.5 * ventana(T.humanos, T.fin + 1));
  const brilloVago = ventana(T.nervio - 0.2, T.mayoria + 0.4);
  const serotoninaTripa = ventana(-1, T.billones, 0.4, 0.4) + ventana(T.serotonina2 - 0.4, T.ratones);
  const barrera = interpolate(t, [T.noLlega - 0.2, T.noLlega + 0.3], [0, 1], clamp) * ventana(T.serotonina2, T.ratones);
  const brilloCerebro = 0.5 + 0.5 * Math.sin(t * 3);
  const latido = 0.6 + 0.4 * Math.sin(t * 4);

  // Pared del intestino: fibra que comen las bacterias, ácidos grasos, GABA y serotonina
  const micro = ventana(T.billones - 0.5, T.ratones + 0.4, 0.6, 0.6);
  const acidos = ventana(T.acidos - 0.2, T.ratones);
  const gaba = ventana(T.gaba - 0.2, T.ratones);
  const sero = ventana(T.tambien, T.ratones);
  const inflamacion = interpolate(t, [T.acidos, T.inflamacion + 0.6], [1, 0.25], clamp);

  // Laboratorio
  const lab = ventana(T.ratones - 0.6, T.humanos + 0.4, 0.6, 0.6);
  const estres = ventana(T.sinBacterias + 0.2, T.pones);
  const capsula = interpolate(t, [T.pones, T.depresion + 0.2], [0, 1], suave);
  const apatia = interpolate(t, [T.depresion, T.apaticos + 0.4], [0, 1], clamp);

  // Consejos
  const plato = ventana(T.fibra - 0.2, T.profesional + 0.2);
  const luna = ventana(T.dormir - 0.2, T.profesional + 0.2);

  // Etiquetas
  const tagSerotonina = ventana(0.4, T.billones);
  const tagCerebro = ventana(T.parece + 0.4, T.nervio);
  const tagVago = ventana(T.nervio, T.fabrican);
  const tagBarrera = ventana(T.noLlega, T.ratones);
  const tagFibra = ventana(T.fabrican + 0.6, T.acidos);
  const tagAcidos = ventana(T.acidos, T.gaba);
  const tagGaba = ventana(T.gaba, T.tambien);
  const tagSero = ventana(T.tambien + 0.2, T.ratones);
  const tagSin = ventana(T.sinBacterias, T.pones);
  const tagCon = ventana(T.sinBacterias, T.pones);
  const tagDep = ventana(T.pones + 0.3, T.humanos);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Persona con rayos X */}
        <rect x={-300} y={SUELO} width={1400} height={600} fill="#1A1530" />
        <rect x={-300} y={SUELO} width={1400} height={10} fill="#2E2850" />
        <Persona x={PX} suelo={SUELO} t={t} />
        {/* Ventana de rayos X sobre el abdomen */}
        <rect x={PX - 64} y={SUELO - 610} width={124} height={250} rx={30} fill="#0A0818" opacity={0.9} />
        <rect x={PX - 64} y={SUELO - 610} width={124} height={250} rx={30} fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.6} />
        {/* Estómago, intestino delgado y colon */}
        <path d={`M ${PX - 20} ${SUELO - 590} C ${PX + 30} ${SUELO - 600}, ${PX + 46} ${SUELO - 560}, ${PX + 20} ${SUELO - 540} C ${PX} ${SUELO - 530}, ${PX - 30} ${SUELO - 545}, ${PX - 20} ${SUELO - 590} Z`} fill="#E89AB0" opacity={0.8} />
        <path d={`M ${PX - 46} ${SUELO - 380} L ${PX - 46} ${SUELO - 520} L ${PX + 42} ${SUELO - 520} L ${PX + 42} ${SUELO - 380}`} fill="none" stroke="#C86A8A" strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
        <path d={`M ${PX - 26} ${SUELO - 500} q 12 14 24 0 t 24 0 q 6 14 -6 22 q -16 10 -30 0 q -14 10 -14 24 q 12 14 24 0 t 24 0 q 6 16 -8 22 q -18 8 -30 -2`} fill="none" stroke="#E89AB0" strokeWidth={9} strokeLinecap="round" />
        {/* Bacterias en la tripa (puntitos) */}
        {MINIS.map((m, i) => (
          <circle key={i} cx={TRIPA[0] + Math.cos(m.a + t * 0.4) * 36 * m.r} cy={TRIPA[1] + 20 + Math.sin(m.a + t * 0.4) * 50 * m.r} r={3} fill={["#7AD86A", "#E8A040", "#A87AE8"][i % 3]} />
        ))}
        {/* Serotonina en la tripa */}
        {serotoninaTripa > 0
          ? [0, 1, 2, 3, 4, 5].map((k) => {
              const p = (t * 0.5 + k / 6) % 1;
              return <rect key={k} x={TRIPA[0] - 30 + k * 12} y={TRIPA[1] + 40 - p * 60} width={8} height={8} transform={`rotate(45 ${TRIPA[0] - 26 + k * 12} ${TRIPA[1] + 44 - p * 60})`} fill={ROSA} opacity={Math.min(1, serotoninaTripa) * (1 - p)} />;
            })
          : null}
        {/* Cerebro */}
        <ellipse cx={CEREBRO[0]} cy={CEREBRO[1]} rx={36} ry={25} fill="#E89AB0" opacity={0.95} />
        <path d={`M ${CEREBRO[0] - 26} ${CEREBRO[1] - 4} q 8 -10 16 0 q 8 10 16 0 q 8 -10 14 2 M ${CEREBRO[0] - 20} ${CEREBRO[1] + 10} q 10 -6 20 2 q 8 6 16 -2`} fill="none" stroke="#B85A78" strokeWidth={2.5} />
        <ellipse cx={CEREBRO[0]} cy={CEREBRO[1]} rx={46} ry={34} fill="none" stroke={C.yellow} strokeWidth={3} opacity={vago * brilloCerebro * 0.8} />
        {/* Nervio vago */}
        <path d={`M ${VAGO.map((p) => `${p[0]} ${p[1]}`).join(" L ")}`} fill="none" stroke={C.yellow} strokeWidth={3 + 4 * brilloVago} strokeLinejoin="round" opacity={0.25 + 0.75 * Math.max(vago, brilloVago)} />
        {vago > 0
          ? [0, 1, 2, 3, 4].map((k) => {
              const sube = k !== 4;
              const p = (t * 0.45 + k / 5) % 1;
              const q = enVago(sube ? p : 1 - p);
              return <circle key={k} cx={q[0]} cy={q[1]} r={6} fill={sube ? C.yellow : C.cyan} opacity={vago} />;
            })
          : null}
        {/* Barrera: la serotonina de la tripa no sube al cerebro */}
        {barrera > 0 ? (
          <g opacity={barrera}>
            <line x1={PX - 70} y1={SUELO - 660} x2={PX + 70} y2={SUELO - 660} stroke={C.red} strokeWidth={6} strokeDasharray="10 8" />
            <rect x={PX + 30} y={SUELO - 650} width={12} height={12} transform={`rotate(45 ${PX + 36} ${SUELO - 644})`} fill={ROSA} />
            <path d={`M ${PX + 50} ${SUELO - 690} l 20 20 m 0 -20 l -20 20`} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
          </g>
        ) : null}
        {/* Consejos: plato con fibra y vegetales, luna para dormir */}
        {plato > 0 ? (
          <g opacity={plato} transform={`translate(${PX + 210} ${SUELO - 520})`}>
            <ellipse cx={0} cy={0} rx={90} ry={30} fill="#E8E6F0" />
            <ellipse cx={0} cy={-4} rx={70} ry={20} fill="#C8C4D8" />
            <circle cx={-30} cy={-14} r={18} fill="#48A848" />
            <circle cx={-12} cy={-22} r={14} fill="#5AB85A" />
            <rect x={10} y={-26} width={44} height={12} rx={6} fill="#E8803A" transform="rotate(-15 30 -20)" />
            <circle cx={30} cy={-8} r={10} fill="#C8A060" />
          </g>
        ) : null}
        {luna > 0 ? (
          <g opacity={luna} transform={`translate(${PX + 200} ${SUELO - 760})`}>
            <circle cx={0} cy={0} r={40} fill={C.yellow} />
            <circle cx={18} cy={-12} r={36} fill={C.bg} />
            <text x={50} y={-30} fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>
              z z
            </text>
          </g>
        ) : null}

        {/* Pared del intestino vista de cerca */}
        <g opacity={micro}>
          <rect x={MICRO.x0} y={MICRO.y0} width={MICRO.x1 - MICRO.x0} height={MICRO.y1 - MICRO.y0} rx={40} fill="#1A1028" stroke="#3A3360" strokeWidth={4} />
          {/* Inflamación de fondo */}
          <rect x={MICRO.x0 + 10} y={MICRO.pared} width={MICRO.x1 - MICRO.x0 - 20} height={MICRO.y1 - MICRO.pared - 10} rx={30} fill={C.red} opacity={0.25 * inflamacion * acidos} />
          {/* Pared con vellosidades */}
          <path
            d={`M ${MICRO.x0 + 10} ${MICRO.y1 - 10} L ${MICRO.x0 + 10} ${MICRO.pared} ${new Array(9)
              .fill(0)
              .map((_, i) => {
                const x = MICRO.x0 + 60 + i * 110;
                return `L ${x - 30} ${MICRO.pared} C ${x - 30} ${MICRO.pared - 120}, ${x + 30} ${MICRO.pared - 120}, ${x + 30} ${MICRO.pared}`;
              })
              .join(" ")} L ${MICRO.x1 - 10} ${MICRO.pared} L ${MICRO.x1 - 10} ${MICRO.y1 - 10} Z`}
            fill="#C86A8A"
          />
          {/* Vaso sanguíneo y terminación del nervio vago bajo la pared */}
          <rect x={MICRO.x0 + 40} y={MICRO.y1 - 120} width={MICRO.x1 - MICRO.x0 - 80} height={34} rx={17} fill="#8A2A3A" />
          <path d={`M ${MICRO.x0 + 40} ${MICRO.y1 - 50} L ${MICRO.x1 - 40} ${MICRO.y1 - 50}`} stroke={C.yellow} strokeWidth={6} />
          {/* Células que hacen serotonina */}
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={MICRO.x0 + 225 + k * 330} cy={MICRO.pared + 60} r={22} fill="#8A5AC8" />
          ))}
          {/* Fibra que llega y bacterias */}
          {new Array(5).fill(0).map((_, k) => (
            <path key={k} d={`M ${MICRO.x0 + 120 + k * 180} ${MICRO.y0 + 120 + (k % 2) * 60} q 30 -20 60 0 t 60 0`} fill="none" stroke="#5AB85A" strokeWidth={7} strokeLinecap="round" opacity={0.8 - 0.6 * acidos} />
          ))}
          {BICHOS.map((b, i) => (
            <Bacteria key={i} x={MICRO.x0 + 80 + b.u * 840} y={MICRO.y0 + 100 + b.v * 440} tipo={b.tipo} t={t} f={b.f} />
          ))}
          {/* Ácidos grasos (hexágonos amarillos) que bajan hacia la pared */}
          {acidos > 0
            ? new Array(8).fill(0).map((_, k) => {
                const p = (t * 0.35 + k / 8) % 1;
                const x = MICRO.x0 + 120 + k * 110;
                const y = MICRO.y0 + 260 + p * (MICRO.pared - MICRO.y0 - 200);
                return <polygon key={k} points={new Array(6).fill(0).map((__, j) => `${x + 12 * Math.cos((j * Math.PI) / 3)},${y + 12 * Math.sin((j * Math.PI) / 3)}`).join(" ")} fill={C.yellow} opacity={acidos * (1 - p * 0.5)} />;
              })
            : null}
          {/* GABA (puntos cian) hacia el nervio */}
          {gaba > 0
            ? new Array(8).fill(0).map((_, k) => {
                const p = (t * 0.4 + k / 8 + 0.3) % 1;
                return <circle key={k} cx={MICRO.x0 + 170 + k * 100} cy={MICRO.y0 + 300 + p * (MICRO.y1 - MICRO.y0 - 360)} r={7} fill={C.cyan} opacity={gaba * (1 - p * 0.4)} />;
              })
            : null}
          {/* Serotonina (rombos rosas) desde las células hacia la sangre */}
          {sero > 0
            ? [0, 1, 2].map((k) =>
                [0, 1].map((j) => {
                  const p = (t * 0.5 + j * 0.5) % 1;
                  const x = MICRO.x0 + 225 + k * 330 + (j - 0.5) * 20;
                  const y = MICRO.pared + 80 + p * (MICRO.y1 - 140 - MICRO.pared - 60);
                  return <rect key={`${k}-${j}`} x={x - 7} y={y - 7} width={14} height={14} transform={`rotate(45 ${x} ${y})`} fill={ROSA} opacity={sero * (1 - p * 0.3)} />;
                }),
              )
            : null}
        </g>

        {/* Laboratorio con ratones */}
        <g opacity={lab}>
          <rect x={LAB.x0} y={600} width={LAB.x1 - LAB.x0} height={900} rx={40} fill="#1E1A34" stroke="#3A3360" strokeWidth={4} />
          {[0, 1].map((k) => {
            const x0 = LAB.x0 + 60 + k * 430;
            return (
              <g key={k}>
                <rect x={x0} y={900} width={360} height={LAB.suelo - 900} rx={10} fill="rgba(200,220,255,0.08)" stroke="#8A84A8" strokeWidth={4} />
                {new Array(9).fill(0).map((_, j) => (
                  <line key={j} x1={x0 + 20 + j * 40} y1={900} x2={x0 + 20 + j * 40} y2={940} stroke="#8A84A8" strokeWidth={3} />
                ))}
                <rect x={x0 + 10} y={LAB.suelo - 30} width={340} height={30} fill="#C8A060" opacity={0.6} />
              </g>
            );
          })}
          <Raton x={LAB.x0 + 230} y={LAB.suelo - 30} t={t} apatia={0} tiembla={0} />
          <Raton x={LAB.x0 + 660} y={LAB.suelo - 30} t={t} apatia={apatia} tiembla={estres} />
          {capsula > 0 && capsula < 1 ? (
            <g transform={`translate(${LAB.x0 + 660 - 300 * (1 - capsula)} ${760 + 200 * capsula})`}>
              <rect x={-30} y={-14} width={60} height={28} rx={14} fill={ROSA} />
              <rect x={-30} y={-14} width={30} height={28} rx={14} fill="#E8E6F0" />
            </g>
          ) : null}
        </g>
      </g>

      <Tag x={sx(TRIPA[0])} y={sy(TRIPA[1] + 20)} dx={200} dy={140} texto="serotonina" color={ROSA} o={tagSerotonina} />
      <Tag x={sx(CEREBRO[0])} y={sy(CEREBRO[1])} dx={200} dy={-120} texto="cerebro" color={C.yellow} o={tagCerebro} />
      <Tag x={sx(PX - 34)} y={sy(SUELO - 560)} dx={-200} dy={-150} texto="nervio vago" color={C.yellow} o={tagVago} />
      <Tag x={sx(PX + 70)} y={sy(SUELO - 660)} dx={180} dy={-110} texto="no cruza" color={C.red} o={tagBarrera} />
      <Tag x={sx(MICRO.x0 + 300)} y={sy(MICRO.y0 + 130)} dx={0} dy={-120} texto="fibra" color="#5AB85A" o={tagFibra} />
      <Tag x={sx(MICRO.x0 + 460)} y={sy(MICRO.y0 + 520)} dx={260} dy={-260} texto="ácidos grasos" color={C.yellow} o={tagAcidos} />
      <Tag x={sx(MICRO.x0 + 470)} y={sy(MICRO.y1 - 50)} dx={160} dy={170} texto="GABA → nervio" color={C.cyan} o={tagGaba} />
      <Tag x={sx(MICRO.x0 + 555)} y={sy(MICRO.pared + 60)} dx={-160} dy={250} texto="serotonina" color={ROSA} o={tagSero} />
      <Tag x={sx(LAB.x0 + 230)} y={sy(LAB.suelo - 80)} dx={0} dy={-330} texto="con bacterias" color="#48C878" o={tagCon} />
      <Tag x={sx(LAB.x0 + 660)} y={sy(LAB.suelo - 80)} dx={0} dy={-450} texto="sin bacterias" color={C.red} o={tagSin} />
      <Tag x={sx(LAB.x0 + 660)} y={sy(LAB.suelo - 60)} dx={-60} dy={-450} texto="bacterias de depresión" color={ROSA} o={tagDep} />
      {/* Latido suave de la tripa al principio */}
      <circle cx={sx(TRIPA[0])} cy={sy(TRIPA[1] + 10)} r={130 * zoom * 0.5} fill="none" stroke={ROSA} strokeWidth={3} opacity={0.3 * latido * ventana(-1, T.billones)} />
    </svg>
  );
};
