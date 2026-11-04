import { Easing, interpolate, random } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, un baño con el enchufe GFCI, una secadora que cae a la bañera y el desagüe a tierra;
// en el centro, el esquema interno del enchufe (dos cables por un anillo con bobina, detector y relé);
// a la derecha, el tablero eléctrico con el diferencial.
type P2 = [number, number];
const ENCHUFE: P2 = [250, 820];
const BANERA = { x0: 480, x1: 1100, borde: 1120, agua: 1185, fondo: 1450 };
const ESQ = { x0: 1400, x1: 2400, y0: 480, y1: 1500, fase: 1770, neutro: 1890, anilloY: 930, releY: 640 };
const TABLERO = { x0: 2600, x1: 3200 };
const FASE = "#E8603A";
const NEUTRO = "#4A8AF8";
const TIERRA = "#48C878";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 600, 1030, 1.15],
  [T.parece - 0.3, 600, 1030, 1.17],
  [T.parece + 0.6, 360, 940, 1.8],
  [T.unCable - 0.3, 360, 940, 1.82],
  [T.unCable + 0.7, 1900, 1000, 1.0],
  [T.alcanza - 0.3, 1900, 1000, 1.02],
  [T.alcanza + 0.6, 600, 1030, 1.15],
  [T.paises - 0.3, 600, 1030, 1.17],
  [T.paises + 0.6, 2900, 1000, 1.35],
  [T.truco - 0.3, 2900, 1000, 1.37],
  [T.truco + 0.6, ENCHUFE[0] + 20, ENCHUFE[1] + 10, 3.0],
  [T.final - 0.3, ENCHUFE[0] + 20, ENCHUFE[1] + 10, 3.05],
  [T.final + 0.5, 600, 1030, 1.18],
  [T.fin, 600, 1030, 1.2],
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

const CHISPAS = new Array(14).fill(0).map((_, i) => ({ a: random(`ca${i}`) * Math.PI * 2, r: 30 + random(`cr${i}`) * 70 }));

// Enchufe GFCI: dos tomas, botones TEST y RESET y una luz
const Gfci: React.FC<{ readonly encendido: number; readonly prueba: number }> = ({ encendido, prueba }) => {
  const [x, y] = ENCHUFE;
  const toma = (yy: number) => (
    <g>
      <rect x={x - 46} y={yy - 40} width={92} height={80} rx={22} fill="#F0EEE8" stroke="#C8C4B8" strokeWidth={3} />
      <rect x={x - 26} y={yy - 22} width={10} height={30} rx={3} fill="#2A2A30" />
      <rect x={x + 16} y={yy - 22} width={10} height={36} rx={3} fill="#2A2A30" />
      <path d={`M ${x - 8} ${yy + 24} a 8 8 0 0 1 16 0 v 6 h -16 z`} fill="#2A2A30" />
    </g>
  );
  return (
    <g>
      <rect x={x - 80} y={y - 140} width={160} height={280} rx={16} fill="#E8E6E0" stroke="#B8B4A8" strokeWidth={4} />
      <rect x={x - 62} y={y - 122} width={124} height={244} rx={12} fill="#F4F2EC" />
      {toma(y - 70)}
      {toma(y + 70)}
      <rect x={x - 54} y={y - 16 + 4 * prueba} width={48} height={30} rx={6} fill="#D83A3A" />
      <text x={x - 30} y={y + 5 + 4 * prueba} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={13} fontWeight={700}>
        TEST
      </text>
      <rect x={x + 6} y={y - 16 - 6 * (1 - encendido)} width={48} height={30} rx={6} fill="#2A2A30" />
      <text x={x + 30} y={y + 5 - 6 * (1 - encendido)} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={12} fontWeight={700}>
        RESET
      </text>
      <circle cx={x + 58} cy={y - 120} r={6} fill={encendido > 0.5 ? "#48E878" : "#E8414F"} />
    </g>
  );
};

// Secadora de pelo (la boquilla apunta a la derecha), con giro alrededor del mango
const Secadora: React.FC<{ readonly x: number; readonly y: number; readonly giro: number }> = ({ x, y, giro }) => (
  <g transform={`translate(${x} ${y}) rotate(${giro})`}>
    <rect x={-22} y={0} width={44} height={120} rx={14} fill="#8A5AC8" />
    <rect x={-22} y={100} width={44} height={16} rx={6} fill="#6A3AA8" />
    <circle cx={0} cy={-30} r={62} fill="#A87AE8" />
    <rect x={20} y={-62} width={110} height={64} rx={10} fill="#A87AE8" />
    <rect x={120} y={-58} width={22} height={56} rx={6} fill="#6A3AA8" />
    <circle cx={-10} cy={-30} r={30} fill="#7A4AB8" />
    {[0, 1, 2, 3].map((k) => (
      <line key={k} x1={-30 + k * 13} y1={-48} x2={-30 + k * 13} y2={-12} stroke="#5A2A98" strokeWidth={4} />
    ))}
    <rect x={-10} y={30} width={20} height={34} rx={4} fill="#E8E6F0" />
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

export const Bano: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Gancho: la secadora cae, salpica, se fuga corriente y el enchufe corta en 0,025 s
  const caida = interpolate(t, [0, 0.75], [0.35, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const secX = 400 + (700 - 400) * caida;
  const secY = 1010 + (1250 - 1010) * caida;
  const secGiro = -20 + 110 * caida;
  const salpica = interpolate(t, [0.7, 0.8, 1.6], [0, 1, 0], clamp);
  const fuga = interpolate(t, [0.75, 0.85, 1.05, 1.15], [0, 1, 1, 0], clamp);
  const corte = t > 1.1 && t < T.prueba + 0.2 ? 1 : 0;
  const reset = interpolate(t, [T.prueba + 1.0, T.prueba + 1.3], [0, 1], clamp);
  const encendido = t < 1.1 ? 1 : t < T.prueba ? (t < T.unCable ? 0 : 1) : 1 - interpolate(t, [T.prueba + 0.2, T.prueba + 0.3], [0, 1], clamp) + reset;
  const pulsaTest = ventana(T.prueba - 0.1, T.prueba + 0.5, 0.1, 0.2);
  const oscuro = interpolate(t, [1.1, 1.2, T.parece, T.parece + 0.6], [0, 1, 1, 0], clamp);
  const crono = ventana(0.9, T.cae);

  // Esquema: corriente por fase y neutro, campos, fuga, detector y relé
  const esquema = ventana(T.unCable - 0.4, T.alcanza + 0.4, 0.6, 0.6);
  const desequilibrio = interpolate(t, [T.escapa, T.noVuelve], [0, 1], clamp);
  const abierto = interpolate(t, [T.rele, T.rele + 0.2], [0, 1], clamp);
  const fluye = 1 - abierto;
  const campos = ventana(T.anulan - 0.6, T.pero + 0.6) + interpolate(t, [T.campo - 0.3, T.campo + 0.3], [0, 1], clamp) * (1 - abierto);
  const bobinaBrillo = interpolate(t, [T.campo, T.campo + 0.4], [0, 1], clamp) * (1 - interpolate(t, [T.corta + 0.5, T.corta + 1.0], [0, 1], clamp));
  const senalDetector = interpolate(t, [T.detecta, T.rele], [0, 1], clamp);

  // Tablero
  const tablero = ventana(T.paises - 0.4, T.truco + 0.4, 0.6, 0.6);
  const testDif = interpolate(t, [T.treinta + 0.3, T.treinta + 0.6], [0, 1], clamp);

  // Etiquetas
  const tagEnchufe = ventana(T.parece + 0.4, T.unCable);
  const tagFase = ventana(T.va - 0.2, T.pero);
  const tagNeutro = ventana(T.otro - 0.2, T.pero);
  const tagAnillo = ventana(T.anillo, T.anulan);
  const tagBobina = ventana(T.bobina, T.anulan);
  const tagFuga = ventana(T.escapa, T.detecta);
  const tagDetector = ventana(T.detecta, T.rele + 0.6);
  const tagRele = ventana(T.rele, T.alcanza);
  const tagDiferencial = ventana(T.diferencial, T.truco);
  const tagTest = ventana(T.prueba - 0.2, T.cambialo);
  const tagReset = ventana(T.prueba + 1.0, T.final);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const cable = `M ${ENCHUFE[0]} ${ENCHUFE[1] + 100} C ${ENCHUFE[0] + 20} ${ENCHUFE[1] + 260}, ${secX - 120} ${secY + 80}, ${secX + Math.sin((secGiro * Math.PI) / 180) * -110} ${secY + Math.cos((secGiro * Math.PI) / 180) * 110}`;

  // Puntos de corriente a lo largo de un cable vertical (sube o baja)
  const puntos = (x: number, y0: number, y1: number, baja: boolean, n: number, color: string, velocidad: number, o: number) =>
    o > 0
      ? new Array(n).fill(0).map((_, k) => {
          const p = (t * velocidad + k / n) % 1;
          const y = baja ? y0 + (y1 - y0) * p : y1 - (y1 - y0) * p;
          return <circle key={k} cx={x} cy={y} r={9} fill={color} opacity={o} />;
        })
      : null;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Baño */}
        <rect x={-300} y={200} width={1550} height={1400} fill="#2A3A5A" />
        {new Array(16).fill(0).map((_, f) =>
          new Array(13).fill(0).map((__, c) => <rect key={`${f}-${c}`} x={-290 + c * 120} y={210 + f * 90} width={112} height={82} rx={6} fill="#30426A" />),
        )}
        {/* Lámpara del techo */}
        <rect x={680} y={200} width={8} height={120} fill="#1A1430" />
        <path d="M 640 320 L 728 320 L 708 360 L 660 360 Z" fill="#E8E6F0" />
        <circle cx={684} cy={372} r={170} fill="#FFF1C9" opacity={0.12 * (1 - oscuro)} />
        {/* Encimera */}
        <rect x={-300} y={1100} width={720} height={40} fill="#D8D4E4" />
        <rect x={-300} y={1140} width={720} height={500} fill="#8A84A8" />
        {/* Bañera */}
        <rect x={BANERA.x0} y={BANERA.borde} width={BANERA.x1 - BANERA.x0} height={BANERA.fondo - BANERA.borde} rx={40} fill="#E8E6F0" />
        <rect x={BANERA.x0 + 20} y={BANERA.agua} width={BANERA.x1 - BANERA.x0 - 40} height={BANERA.fondo - BANERA.agua - 20} rx={24} fill="#6AC8E8" opacity={0.75} />
        <path d={`M ${BANERA.x0 + 20} ${BANERA.agua} ${new Array(14).fill(0).map((_, i) => `L ${BANERA.x0 + 20 + i * 44} ${BANERA.agua + Math.sin(t * 3 + i) * 3 * (1 + 4 * salpica)}`).join(" ")}`} fill="none" stroke="#B8E8F8" strokeWidth={4} />
        {/* Desagüe a tierra */}
        <rect x={980} y={BANERA.fondo} width={24} height={150} fill="#8A8A9A" />
        <path d="M 960 1610 L 1024 1610 M 970 1625 L 1014 1625 M 982 1640 L 1002 1640" stroke={TIERRA} strokeWidth={6} strokeLinecap="round" />
        <rect x={-300} y={1600} width={1550} height={600} fill="#1A1530" />

        {/* Cable y secadora */}
        <path d={cable} fill="none" stroke="#E8E6F0" strokeWidth={10} strokeLinecap="round" />
        <Secadora x={secX} y={secY} giro={secGiro} />
        {/* Agua por encima de la secadora sumergida */}
        <rect x={BANERA.x0 + 20} y={BANERA.agua} width={BANERA.x1 - BANERA.x0 - 40} height={BANERA.fondo - BANERA.agua - 20} rx={24} fill="#6AC8E8" opacity={0.35 * caida} />
        {/* Salpicadura y chispas */}
        {salpica > 0
          ? CHISPAS.map((c, i) => (
              <circle key={i} cx={secX + Math.cos(c.a) * c.r * (1.2 - salpica)} cy={BANERA.agua - Math.abs(Math.sin(c.a)) * c.r * (1.2 - salpica)} r={8} fill="#B8E8F8" opacity={salpica} />
            ))
          : null}
        {/* Corriente que se fuga por el agua hacia el desagüe */}
        {fuga > 0
          ? new Array(10).fill(0).map((_, k) => {
              const p = (t * 3 + k / 10) % 1;
              return <circle key={k} cx={secX + (992 - secX) * p} cy={secY + (BANERA.fondo - 10 - secY) * p} r={8} fill={C.yellow} opacity={fuga} />;
            })
          : null}
        {fuga > 0
          ? CHISPAS.slice(0, 6).map((c, i) => (
              <line key={i} x1={secX} y1={secY - 20} x2={secX + Math.cos(c.a) * c.r} y2={secY - 20 + Math.sin(c.a) * c.r} stroke={C.yellow} strokeWidth={4} opacity={fuga * (0.5 + 0.5 * Math.sin(t * 40 + i))} />
            ))
          : null}

        {/* Enchufe GFCI */}
        <Gfci encendido={encendido} prueba={pulsaTest} />
        {pulsaTest > 0 ? <circle cx={ENCHUFE[0] - 30} cy={ENCHUFE[1]} r={20 + 30 * pulsaTest} fill="none" stroke={C.yellow} strokeWidth={3} opacity={1 - pulsaTest * 0.6} /> : null}
        {/* Oscuridad del baño tras el corte */}
        <rect x={-300} y={200} width={1550} height={1400} fill="#05030A" opacity={0.45 * oscuro} />
        {corte && t < T.parece ? (
          <g transform={`translate(${ENCHUFE[0]} ${ENCHUFE[1] - 210})`}>
            <rect x={-110} y={-34} width={220} height={60} rx={14} fill={C.red} />
            <text x={0} y={8} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={30} fontWeight={700}>
              ¡CLIC!
            </text>
          </g>
        ) : null}
        {crono > 0 ? (
          <g opacity={crono} transform="translate(860 560)">
            <rect x={-170} y={-50} width={340} height={100} rx={20} fill="#1A1430" stroke={C.yellow} strokeWidth={4} />
            <text x={0} y={18} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={52} fontWeight={700}>
              0,025 s
            </text>
          </g>
        ) : null}

        {/* Esquema interno del enchufe */}
        <g opacity={esquema}>
          <rect x={ESQ.x0} y={ESQ.y0} width={ESQ.x1 - ESQ.x0} height={ESQ.y1 - ESQ.y0} rx={40} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          <text x={ESQ.fase} y={ESQ.y0 + 50} textAnchor="middle" fill={FASE} fontFamily={mono} fontSize={30} fontWeight={700}>
            fase
          </text>
          <text x={ESQ.neutro} y={ESQ.y0 + 50} textAnchor="middle" fill={NEUTRO} fontFamily={mono} fontSize={30} fontWeight={700}>
            neutro
          </text>
          {/* Cables, con el relé arriba */}
          {[ESQ.fase, ESQ.neutro].map((x, i) => (
            <g key={i}>
              <line x1={x} y1={ESQ.y0 + 70} x2={x} y2={ESQ.releY - 30} stroke={i === 0 ? FASE : NEUTRO} strokeWidth={10} />
              <line x1={x} y1={ESQ.releY - 30} x2={x + 46 * abierto} y2={ESQ.releY + 20 - 20 * abierto} stroke={i === 0 ? FASE : NEUTRO} strokeWidth={10} strokeLinecap="round" />
              <line x1={x} y1={ESQ.releY + 20} x2={x} y2={ESQ.y1 - 200} stroke={i === 0 ? FASE : NEUTRO} strokeWidth={10} />
            </g>
          ))}
          <rect x={ESQ.fase - 40} y={ESQ.releY - 50} width={ESQ.neutro - ESQ.fase + 80} height={90} rx={10} fill="none" stroke="#8A84A8" strokeWidth={3} strokeDasharray="8 6" />
          {/* Secadora al final de los cables */}
          <rect x={ESQ.fase - 80} y={ESQ.y1 - 200} width={ESQ.neutro - ESQ.fase + 160} height={120} rx={20} fill="#A87AE8" />
          <text x={(ESQ.fase + ESQ.neutro) / 2} y={ESQ.y1 - 128} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={30} fontWeight={700}>
            secadora
          </text>
          {/* Corriente: baja por la fase, vuelve por el neutro (menos si hay fuga) */}
          {puntos(ESQ.fase, ESQ.y0 + 80, ESQ.y1 - 210, true, 7, FASE, 0.6, fluye)}
          {puntos(ESQ.neutro, ESQ.y0 + 80, ESQ.y1 - 210, false, Math.round(7 - 3 * desequilibrio), NEUTRO, 0.6, fluye)}
          {/* Fuga hacia el suelo */}
          <g opacity={desequilibrio}>
            <path d={`M ${ESQ.fase - 80} ${ESQ.y1 - 140} C ${ESQ.fase - 200} ${ESQ.y1 - 120}, ${ESQ.x0 + 160} ${ESQ.y1 - 140}, ${ESQ.x0 + 140} ${ESQ.y1 - 60}`} fill="none" stroke={TIERRA} strokeWidth={6} strokeDasharray="12 8" />
            <path d={`M ${ESQ.x0 + 110} ${ESQ.y1 - 50} L ${ESQ.x0 + 170} ${ESQ.y1 - 50} M ${ESQ.x0 + 120} ${ESQ.y1 - 36} L ${ESQ.x0 + 160} ${ESQ.y1 - 36} M ${ESQ.x0 + 132} ${ESQ.y1 - 22} L ${ESQ.x0 + 148} ${ESQ.y1 - 22}`} stroke={TIERRA} strokeWidth={6} strokeLinecap="round" />
            {fluye > 0
              ? [0, 1, 2].map((k) => {
                  const p = (t * 0.7 + k / 3) % 1;
                  return <circle key={k} cx={ESQ.fase - 80 - p * (ESQ.fase - 80 - ESQ.x0 - 140)} cy={ESQ.y1 - 140 + p * 80} r={9} fill={TIERRA} opacity={fluye} />;
                })
              : null}
          </g>
          {/* Anillo de hierro con la bobina */}
          <ellipse cx={(ESQ.fase + ESQ.neutro) / 2} cy={ESQ.anilloY} rx={170} ry={60} fill="none" stroke={bobinaBrillo > 0.3 ? C.yellow : "#8A8A9A"} strokeWidth={28} />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <path key={k} d={`M ${(ESQ.fase + ESQ.neutro) / 2 - 150 + k * 12} ${ESQ.anilloY - 36} l 0 64`} stroke="#C88A3A" strokeWidth={5} />
          ))}
          {/* Campos magnéticos: opuestos (se anulan) o uno más fuerte (desequilibrio) */}
          {campos > 0 ? (
            <g opacity={Math.min(1, campos)}>
              <ellipse cx={ESQ.fase} cy={ESQ.anilloY} rx={44} ry={16} fill="none" stroke={FASE} strokeWidth={4} strokeDasharray="10 6" strokeDashoffset={-t * 40} />
              <ellipse cx={ESQ.neutro} cy={ESQ.anilloY} rx={44 * (1 - 0.5 * desequilibrio)} ry={16} fill="none" stroke={NEUTRO} strokeWidth={4} strokeDasharray="10 6" strokeDashoffset={t * 40} />
            </g>
          ) : null}
          {/* Detector y señal al relé */}
          <rect x={ESQ.x0 + 70} y={ESQ.anilloY - 60} width={140} height={120} rx={14} fill="#2A2A40" stroke={senalDetector > 0 ? C.yellow : "#5A5478"} strokeWidth={4} />
          <text x={ESQ.x0 + 140} y={ESQ.anilloY + 10} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={22} fontWeight={700}>
            detector
          </text>
          <path d={`M ${(ESQ.fase + ESQ.neutro) / 2 - 150} ${ESQ.anilloY} L ${ESQ.x0 + 210} ${ESQ.anilloY}`} stroke="#C88A3A" strokeWidth={5} />
          <path d={`M ${ESQ.x0 + 140} ${ESQ.anilloY - 60} L ${ESQ.x0 + 140} ${ESQ.releY} L ${ESQ.fase - 40} ${ESQ.releY}`} fill="none" stroke={senalDetector > 0 ? C.yellow : "#5A5478"} strokeWidth={5} strokeDasharray="10 8" strokeDashoffset={-t * 60} />
          {senalDetector > 0 && senalDetector < 1 ? <circle cx={ESQ.x0 + 140} cy={ESQ.anilloY - 60 - (ESQ.anilloY - 60 - ESQ.releY) * senalDetector} r={12} fill={C.yellow} /> : null}
        </g>

        {/* Tablero eléctrico con el diferencial */}
        <g opacity={tablero}>
          <rect x={TABLERO.x0} y={560} width={TABLERO.x1 - TABLERO.x0} height={880} rx={20} fill="#C8C4D8" />
          <rect x={TABLERO.x0 + 30} y={600} width={TABLERO.x1 - TABLERO.x0 - 60} height={800} rx={12} fill="#E8E6F0" />
          {[0, 1, 2, 3, 4].map((k) => (
            <g key={k}>
              <rect x={TABLERO.x0 + 70 + k * 92} y={700} width={70} height={200} rx={8} fill="#F8F8F8" stroke="#A8A4B8" strokeWidth={3} />
              <rect x={TABLERO.x0 + 90 + k * 92} y={760} width={30} height={60} rx={6} fill="#2A2A30" />
            </g>
          ))}
          <rect x={TABLERO.x0 + 120} y={1000} width={360} height={260} rx={12} fill="#F8F8F8" stroke={C.yellow} strokeWidth={6} />
          <text x={TABLERO.x0 + 300} y={1060} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={34} fontWeight={700}>
            ID 30 mA
          </text>
          <rect x={TABLERO.x0 + 200} y={1100 + 30 * testDif} width={70} height={100} rx={8} fill="#2A2A30" />
          <rect x={TABLERO.x0 + 330} y={1110} width={60} height={60} rx={30} fill="#3A8AE8" />
          <text x={TABLERO.x0 + 360} y={1150} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={30} fontWeight={700}>
            T
          </text>
        </g>
      </g>

      <Tag x={sx(ENCHUFE[0] + 80)} y={sy(ENCHUFE[1])} dx={250} dy={-80} texto="enchufe GFCI" color={C.yellow} o={tagEnchufe} />
      <Tag x={sx(ESQ.fase)} y={sy(ESQ.y0 + 300)} dx={-220} dy={-60} texto="va" color={FASE} o={tagFase} />
      <Tag x={sx(ESQ.neutro)} y={sy(ESQ.y0 + 300)} dx={220} dy={-60} texto="vuelve" color={NEUTRO} o={tagNeutro} />
      <Tag x={sx((ESQ.fase + ESQ.neutro) / 2 + 170)} y={sy(ESQ.anilloY)} dx={200} dy={140} texto="anillo" color="#C8C4D8" o={tagAnillo} />
      <Tag x={sx((ESQ.fase + ESQ.neutro) / 2 - 120)} y={sy(ESQ.anilloY + 40)} dx={-100} dy={200} texto="bobina" color="#E8A040" o={tagBobina} />
      <Tag x={sx(ESQ.x0 + 220)} y={sy(ESQ.y1 - 110)} dx={150} dy={-190} texto="fuga al suelo" color={TIERRA} o={tagFuga} />
      <Tag x={sx(ESQ.x0 + 140)} y={sy(ESQ.anilloY - 60)} dx={60} dy={-170} texto="detector" color={C.yellow} o={tagDetector} />
      <Tag x={sx(ESQ.neutro + 40)} y={sy(ESQ.releY - 10)} dx={200} dy={90} texto="relé" color={C.red} o={tagRele} />
      <Tag x={sx(TABLERO.x0 + 480)} y={sy(1130)} dx={-150} dy={260} texto="diferencial" color={C.yellow} o={tagDiferencial} />
      <Tag x={sx(ENCHUFE[0] - 30)} y={sy(ENCHUFE[1])} dx={-30} dy={-240} texto="TEST" color={C.red} o={tagTest} />
      <Tag x={sx(ENCHUFE[0] + 30)} y={sy(ENCHUFE[1])} dx={60} dy={240} texto="RESET" color={C.white} o={tagReset} />
    </svg>
  );
};
