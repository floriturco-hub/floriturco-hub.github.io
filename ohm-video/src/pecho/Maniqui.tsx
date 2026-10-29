import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Maniquí de costura de frente (torso sin cabeza, estilo lámina de anatomía) con camiseta de tirantes.
// Vista frontal: el lado IZQUIERDO de la persona queda a la DERECHA de la pantalla.
type P2 = [number, number];
const DER: P2 = [440, 930]; // pecho derecho de la persona (izquierda de la pantalla)
const IZQ: P2 = [640, 934]; // pecho izquierdo de la persona (derecha de la pantalla)
const R_DER = 86;
const R_IZQ = 97;
const PIEL = "#C98A64";
const CAMISETA = "#2E6A7A";
const CAMISETA_OSCURA = "#1F4E5C";
const GRASA = "#F2D49A";
const GLANDULA = "#E07AA8";
const MUSCULO = "#A8443E";

const TORSO =
  "M 485 640 C 430 660, 330 676, 300 730 C 280 764, 290 830, 312 900 C 324 1000, 336 1100, 382 1200 " +
  "C 402 1262, 402 1322, 384 1380 L 696 1380 C 678 1322, 678 1262, 698 1200 C 744 1100, 756 1000, 768 900 " +
  "C 790 830, 800 764, 780 730 C 750 676, 650 660, 595 640 Z";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 540, 1020, 1.25],
  [T.parece - 0.3, 540, 1020, 1.27],
  [T.parece + 0.6, 540, 1060, 1.1],
  [T.dentro - 0.3, 540, 1060, 1.12],
  [T.dentro + 0.7, 540, 950, 2.1],
  [T.cadaLado - 0.3, 540, 950, 2.15],
  [T.cadaLado + 0.6, 540, 980, 1.7],
  [T.estudios - 0.3, 540, 980, 1.72],
  [T.estudios + 0.6, 600, 950, 2.4],
  [T.tiempo - 0.3, 600, 950, 2.45],
  [T.tiempo + 0.6, 540, 1060, 1.1],
  [T.cara - 0.3, 540, 1060, 1.12],
  [T.cara + 0.6, 540, 1020, 1.25],
  [T.fin, 540, 1020, 1.28],
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

// Interior esquemático de un pecho: músculo, grasa, lóbulos, conductos y ligamentos
const Interior: React.FC<{ readonly c: P2; readonly r: number; readonly o: number; readonly lobulos: number; readonly ligamentos: number; readonly espejo: number }> = ({ c, r, o, lobulos, ligamentos, espejo }) => {
  if (o <= 0) {
    return null;
  }
  const n = 8;
  return (
    <g opacity={o}>
      <circle cx={c[0]} cy={c[1]} r={r} fill={GRASA} opacity={0.9} />
      {new Array(n).fill(0).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + 0.3;
        const lx = c[0] + Math.cos(a) * r * 0.55;
        const ly = c[1] + Math.sin(a) * r * 0.55;
        return (
          <g key={i} opacity={lobulos}>
            <line x1={lx} y1={ly} x2={c[0] + espejo * 4} y2={c[1] + 6} stroke="#C85A88" strokeWidth={2.5} />
            <ellipse cx={lx} cy={ly} rx={r * 0.18} ry={r * 0.12} fill={GLANDULA} transform={`rotate(${(a * 180) / Math.PI} ${lx} ${ly})`} />
          </g>
        );
      })}
      {new Array(5).fill(0).map((_, i) => {
        const a = -Math.PI / 2 + (i - 2) * 0.45;
        return (
          <line
            key={i}
            x1={c[0] + Math.cos(a) * r * 0.3}
            y1={c[1] + Math.sin(a) * r * 0.3}
            x2={c[0] + Math.cos(a) * r}
            y2={c[1] + Math.sin(a) * r}
            stroke="#FFFFFF"
            strokeWidth={1.6}
            opacity={0.8 * ligamentos}
          />
        );
      })}
      <circle cx={c[0] + espejo * 4} cy={c[1] + 6} r={r * 0.09} fill="#B8705A" />
      <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke="#B8705A" strokeWidth={2} />
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

export const Maniqui: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  // Vista interior (la camiseta se vuelve transparente)
  const dentro = interpolate(t, [T.dentro - 0.1, T.dentro + 0.6, T.normal - 0.3, T.normal + 0.3], [0, 1, 1, 0], clamp);
  const lobulos = interpolate(t, [T.glandulas - 0.1, T.glandulas + 0.4], [0, 1], clamp);
  const ligamentos = interpolate(t, [T.ligamentos - 0.1, T.ligamentos + 0.4], [0, 1], clamp);

  // Crecimiento en la pubertad: el izquierdo empieza antes y acaba algo más grande
  const crecer = (retraso: number) => interpolate(t, [T.crece + retraso, T.cadaLado + 1.2 + retraso], [0.45, 1], suave);
  const enCrecimiento = t >= T.crece - 0.1 && t < T.queda + 1;
  const fDer = enCrecimiento ? crecer(0.6) : 1;
  const fIzq = enCrecimiento ? crecer(0) : 1;
  const rDer = R_DER * fDer;
  const rIzq = R_IZQ * fIzq;

  // Hormonas, receptores y riego
  const hormonas = interpolate(t, [T.estrogenos - 0.2, T.estrogenos + 0.4, T.queda, T.queda + 0.4], [0, 1, 1, 0], clamp);
  const receptores = interpolate(t, [T.receptores - 0.1, T.receptores + 0.4, T.queda, T.queda + 0.4], [0, 1, 1, 0], clamp);
  const riego = interpolate(t, [T.riego - 0.1, T.riego + 0.4, T.queda, T.queda + 0.4], [0, 1, 1, 0], clamp);
  // Comparación: contorno del derecho reflejado sobre el izquierdo
  const compara = interpolate(t, [T.estudios + 0.2, T.estudios + 0.8, T.tiempo - 0.3, T.tiempo], [0, 1, 1, 0], clamp);
  // Ciclo: ambos se hinchan un poco antes de la regla
  const hinchan = 1 + 0.06 * interpolate(t, [T.regla, T.regla + 0.8, T.mamar, T.mamar + 0.6], [0, 1, 1, 0], clamp);

  // Etiquetas
  const tagIzq = interpolate(t, [0.3, 0.7, T.parece - 0.3, T.parece], [0, 1, 1, 0], clamp);
  const tagGrasa = interpolate(t, [T.grasa, T.grasa + 0.3, T.crece - 0.3, T.crece], [0, 1, 1, 0], clamp);
  const tagGlandulas = interpolate(t, [T.glandulas, T.glandulas + 0.3, T.crece - 0.3, T.crece], [0, 1, 1, 0], clamp);
  const tagLigamentos = interpolate(t, [T.ligamentos, T.ligamentos + 0.3, T.crece - 0.3, T.crece], [0, 1, 1, 0], clamp);
  const tagMas = interpolate(t, [T.izquierdo, T.izquierdo + 0.4, T.tiempo - 0.3, T.tiempo], [0, 1, 1, 0], clamp);

  const sombra = (c: P2, r: number) => `M ${c[0] - r * 0.95} ${c[1] + r * 0.15} Q ${c[0]} ${c[1] + r * 1.2}, ${c[0] + r * 0.95} ${c[1] + r * 0.15}`;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-pc" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <clipPath id="torso-pc">
          <path d={TORSO} />
        </clipPath>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Soporte del maniquí */}
        <rect x={530} y={1380} width={20} height={420} fill="#3A3360" />
        <path d="M 540 1790 L 420 1860 M 540 1790 L 660 1860 M 540 1790 L 540 1870" stroke="#3A3360" strokeWidth={14} strokeLinecap="round" />
        {/* Cuello y tapa del maniquí */}
        <rect x={488} y={570} width={104} height={90} fill={PIEL} />
        <ellipse cx={540} cy={570} rx={56} ry={14} fill="#8A6A5A" />
        <ellipse cx={540} cy={566} rx={30} ry={8} fill="#5A4A3A" />

        {/* Torso */}
        <path d={TORSO} fill={PIEL} />
        <g clipPath="url(#torso-pc)">
          {/* Músculo pectoral, visible en la vista interior */}
          <path d="M 310 820 C 400 780, 500 800, 540 860 C 580 800, 680 780, 770 820 L 770 1000 C 660 960, 600 960, 540 1000 C 480 960, 420 960, 310 1000 Z" fill={MUSCULO} opacity={0.55 * dentro} />
          {/* Riego: vasos hacia cada lado (más en el izquierdo) */}
          {riego > 0 ? (
            <g opacity={riego}>
              <path d={`M 540 760 Q ${DER[0] + 40} 800, ${DER[0]} ${DER[1] - 20}`} fill="none" stroke={C.red} strokeWidth={4} />
              <path d={`M 540 760 Q ${IZQ[0] - 40} 800, ${IZQ[0]} ${IZQ[1] - 20}`} fill="none" stroke={C.red} strokeWidth={8} />
            </g>
          ) : null}
          <Interior c={DER} r={rDer * hinchan} o={dentro} lobulos={lobulos} ligamentos={ligamentos} espejo={-1} />
          <Interior c={IZQ} r={rIzq * hinchan} o={dentro} lobulos={lobulos} ligamentos={ligamentos} espejo={1} />

          {/* Camiseta de tirantes: costuras, pliegues y brillo */}
          <g opacity={1 - 0.85 * dentro}>
            {/* Tirantes con costura */}
            <path d="M 388 680 L 414 680 L 432 812 L 404 812 Z" fill={CAMISETA} />
            <path d="M 666 680 L 692 680 L 676 812 L 648 812 Z" fill={CAMISETA} />
            <path d="M 396 690 L 416 806 M 684 690 L 664 806" stroke={CAMISETA_OSCURA} strokeWidth={2} strokeDasharray="5 5" />
            <path d="M 300 790 C 360 800, 420 830, 540 840 C 660 830, 720 800, 780 790 L 790 1400 L 290 1400 Z" fill={CAMISETA} />
            {/* Volumen de cada pecho bajo la tela */}
            <path d={sombra(DER, rDer * hinchan)} fill="none" stroke={CAMISETA_OSCURA} strokeWidth={8} strokeLinecap="round" />
            <path d={sombra(IZQ, rIzq * hinchan)} fill="none" stroke={CAMISETA_OSCURA} strokeWidth={8} strokeLinecap="round" />
            <ellipse cx={DER[0] - rDer * 0.2} cy={DER[1] - rDer * 0.3} rx={rDer * 0.35} ry={rDer * 0.18} fill="#FFFFFF" opacity={0.12} />
            <ellipse cx={IZQ[0] - rIzq * 0.2} cy={IZQ[1] - rIzq * 0.3} rx={rIzq * 0.35} ry={rIzq * 0.18} fill="#FFFFFF" opacity={0.12} />
            {/* Escote y dobladillo con costura */}
            <path d="M 300 790 C 360 800, 420 830, 540 840 C 660 830, 720 800, 780 790" fill="none" stroke={CAMISETA_OSCURA} strokeWidth={6} />
            <path d="M 300 802 C 360 812, 420 842, 540 852 C 660 842, 720 812, 780 802" fill="none" stroke="#FFFFFF" strokeWidth={1.5} strokeDasharray="6 6" opacity={0.35} />
            <path d="M 380 1340 L 700 1340" stroke={CAMISETA_OSCURA} strokeWidth={6} />
            {/* Pliegues en la cintura */}
            <path d="M 410 1160 Q 440 1180, 470 1170 M 600 1175 Q 630 1185, 660 1162 M 440 1240 Q 480 1255, 520 1245" fill="none" stroke={CAMISETA_OSCURA} strokeWidth={4} strokeLinecap="round" />
            {/* Brillo en el hombro */}
            <ellipse cx={340} cy={780} rx={30} ry={10} fill="#FFFFFF" opacity={0.15} />
          </g>
        </g>
        <path d={TORSO} fill="none" stroke="#8A5A40" strokeWidth={2.5} vectorEffect="non-scaling-stroke" opacity={0.6} />

        {/* Estrógenos que llegan a los dos lados */}
        {hormonas > 0 ? (
          <g opacity={hormonas}>
            {new Array(10).fill(0).map((_, i) => {
              const p = (t * 0.5 + i / 10) % 1;
              const destino = i % 3 === 0 ? DER : IZQ;
              const x = 540 + (destino[0] - 540) * p + Math.sin(p * 9 + i) * 14;
              const y = 1300 + (destino[1] - 1300) * p;
              return <circle key={i} cx={x} cy={y} r={9} fill={C.purpleLight} opacity={1 - p * 0.5} />;
            })}
          </g>
        ) : null}
        {/* Receptores: más en el izquierdo */}
        {receptores > 0 ? (
          <g opacity={receptores}>
            {[...new Array(4).fill(0).map((_, i) => ({ c: DER, i, n: 4 })), ...new Array(7).fill(0).map((_, i) => ({ c: IZQ, i, n: 7 }))].map((r, k) => {
              const a = (r.i / r.n) * Math.PI * 2;
              const rad = (r.c === DER ? rDer : rIzq) * 0.8;
              const x = r.c[0] + Math.cos(a) * rad;
              const y = r.c[1] + Math.sin(a) * rad;
              return <path key={k} d={`M ${x} ${y + 10} L ${x} ${y} L ${x - 8} ${y - 10} M ${x} ${y} L ${x + 8} ${y - 10}`} fill="none" stroke={C.purpleLight} strokeWidth={4} strokeLinecap="round" />;
            })}
          </g>
        ) : null}
        {/* Comparación: el derecho reflejado sobre el izquierdo */}
        {compara > 0 ? (
          <g opacity={compara}>
            <circle cx={IZQ[0]} cy={IZQ[1]} r={R_DER} fill="none" stroke={C.cyan} strokeWidth={4} strokeDasharray="12 8" />
            <circle cx={IZQ[0]} cy={IZQ[1]} r={R_IZQ} fill="none" stroke={C.yellow} strokeWidth={4} />
          </g>
        ) : null}
      </g>

      {/* Etiquetas ancladas (tamaño constante en pantalla) */}
      <Tag x={sx(IZQ[0])} y={sy(IZQ[1] - R_IZQ)} dx={80} dy={-220} texto="tu izquierdo" color={C.yellow} o={tagIzq} />
      <Tag x={sx(DER[0] - 40)} y={sy(DER[1] + 30)} dx={-60} dy={300} texto="grasa" color={C.yellow} o={tagGrasa} />
      <Tag x={sx(IZQ[0] + 50)} y={sy(IZQ[1] + 20)} dx={60} dy={300} texto="glándulas" color="#F09AC0" o={tagGlandulas} />
      <Tag x={sx(IZQ[0])} y={sy(IZQ[1] - 70)} dx={60} dy={-250} texto="ligamentos" color={C.white} o={tagLigamentos} />
      <Tag x={sx(IZQ[0] + R_IZQ)} y={sy(IZQ[1])} dx={-40} dy={-280} texto="izquierdo: más grande" color={C.yellow} o={tagMas} />
    </svg>
  );
};
