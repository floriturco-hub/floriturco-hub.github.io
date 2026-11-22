import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";

// Lazo del circuito: pila a la izquierda, resistencia arriba, amperímetro a la derecha
const LAZO = "M 180 960 L 180 640 L 900 640 L 900 1300 L 180 1300 Z";
const LONGITUD_LAZO = 2 * (720 + 660);

const Lectura: React.FC<{
  readonly simbolo: string;
  readonly valor: string;
  readonly unidad: string;
  readonly color: string;
  readonly x: number;
}> = ({ simbolo, valor, unidad, color, x }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 300,
      width: 400,
      textAlign: "center",
      fontFamily: mono,
      color: C.white,
    }}
  >
    <div style={{ fontSize: 34, color: C.grey }}>{simbolo}</div>
    <div style={{ fontSize: 96, fontWeight: 700, color }}>
      {valor}
      <span style={{ fontSize: 48, color: C.grey }}> {unidad}</span>
    </div>
  </div>
);

type Props = {
  readonly t0: number;
  readonly fase: "intro" | "final";
};

export const Circuito: React.FC<Props> = ({ t0, fase }) => {
  const t = useT(t0);
  const intro = fase === "intro";

  // Voltaje y corriente: se duplican con la frase "si duplicas el voltaje, se duplica la corriente"
  const v = intro
    ? interpolate(t, [1.45, 2.2], [1.5, 3], { ...clamp, easing: Easing.inOut(Easing.cubic) })
    : 3;
  const i = intro
    ? interpolate(t, [2.85, 3.5], [0.5, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })
    : 1;

  // Las "hormigas" de corriente avanzan más rápido cuanto mayor es I
  const avance = intro
    ? 140 * (t - t0) + 140 * Math.max(0, t - 3.2)
    : 280 * (t - t0);

  // Cámara: deriva lenta; en el intro termina entrando en el cable, en el final sale de él
  const zoom = intro
    ? interpolate(t, [0, 6.2, 7.1], [1, 1.04, 7], {
        ...clamp,
        easing: Easing.in(Easing.cubic),
      })
    : interpolate(t, [t0, t0 + 1.1, 61.5], [7, 1.04, 1], {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      });
  const foco = interpolate(zoom, [1.04, 7], [0, 1], clamp);
  const cx = 540;
  const cy = 960 + 340 * foco;

  return (
    <div
      style={{
        position: "absolute",
        width: W,
        height: H,
        transformOrigin: "0 0",
        translate: `${540 - cx * zoom}px ${960 - cy * zoom}px`,
        scale: zoom,
      }}
    >
      <Lectura simbolo="voltaje" valor={v.toFixed(1).replace(".", ",")} unidad="V" color={C.yellow} x={90} />
      <Lectura simbolo="corriente" valor={i.toFixed(1).replace(".", ",")} unidad="A" color={C.cyan} x={590} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <filter id="brillo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={LAZO} fill="none" stroke={C.wire} strokeWidth={18} strokeLinejoin="round" />
        <path
          d={LAZO}
          fill="none"
          stroke={C.cyan}
          strokeWidth={6}
          strokeDasharray="24 18"
          strokeDashoffset={-avance % LONGITUD_LAZO}
          strokeLinejoin="round"
          filter="url(#brillo)"
        />
        {/* Pila */}
        <rect x={120} y={890} width={120} height={140} fill={C.bg} />
        <line x1={110} y1={930} x2={250} y2={930} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
        <line x1={145} y1={990} x2={215} y2={990} stroke={C.white} strokeWidth={12} strokeLinecap="round" />
        <text x={270} y={945} fill={C.red} fontFamily={mono} fontSize={44} fontWeight={700}>+</text>
        <text x={270} y={1005} fill={C.white} fontFamily={mono} fontSize={44} fontWeight={700}>−</text>
        {/* Resistencia */}
        <rect x={380} y={600} width={320} height={80} fill={C.bg} />
        <polyline
          points="380,640 410,600 450,680 490,600 530,680 570,600 610,680 650,600 690,680 700,640"
          fill="none"
          stroke={C.purpleLight}
          strokeWidth={12}
          strokeLinejoin="round"
        />
        <text x={540} y={570} textAnchor="middle" fill={C.purpleLight} fontFamily={mono} fontSize={48} fontWeight={700}>R</text>
        {/* Amperímetro */}
        <circle cx={900} cy={960} r={70} fill={C.bg} stroke={C.cyan} strokeWidth={8} />
        <text x={900} y={980} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={56} fontWeight={700}>A</text>
      </svg>
    </div>
  );
};
