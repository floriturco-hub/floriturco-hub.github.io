import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Cerebro } from "./Coclea";
import { T } from "./tiempos";

// El cerebro deja de recibir señal en los agudos y sube la ganancia: el ruido interno se convierte en tono
const CANALES = 12;
const MUERTOS = 3; // los de la derecha (agudos)
const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

export const Ganancia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ganancia = interpolate(t, [T.sube, T.sube + 1.6], [0.15, 1], suave);
  const radio = interpolate(t, [T.radio - 0.2, T.radio + 0.3], [0, 1], clamp);
  const zoom = interpolate(t, [T.entonces - 0.2, T.pitido], [1, 1.05]);
  const f = Math.floor(t * 15);

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="halo-co" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
      </defs>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 960 * zoom}) scale(${zoom})`}>
        <Cerebro x={480} y={720} s={1.6} />
        {/* Canales de tono que llegan al cerebro */}
        <text x={110} y={1590} fill={C.purpleLight} fontFamily={mono} fontSize={30} fontWeight={700}>graves</text>
        <text x={850} y={1590} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={30} fontWeight={700}>agudos</text>
        {new Array(CANALES).fill(0).map((_, k) => {
          const x = 120 + k * 62;
          const muerto = k >= CANALES - MUERTOS;
          const normal = 0.35 + 0.35 * random(`c${k}-${f}`);
          const ruidoInterno = 0.06 + 0.05 * random(`r${k}-${f}`);
          const alto = muerto ? ruidoInterno * (ganancia / 0.15) * 0.55 : normal;
          const altura = Math.min(1, alto) * 360;
          const color = muerto ? (ganancia > 0.5 ? C.yellow : C.red) : C.cyan;
          return (
            <g key={k}>
              <line x1={x + 20} y1={1530 - altura} x2={480} y2={860} stroke={color} strokeWidth={2} opacity={0.15} />
              <rect x={x} y={1170} width={40} height={360} rx={8} fill="rgba(255,255,255,0.05)" stroke={muerto ? C.red : "transparent"} strokeWidth={muerto && ganancia < 0.5 ? 3 : 0} />
              <rect x={x} y={1530 - altura} width={40} height={altura} rx={8} fill={color} opacity={0.9} />
            </g>
          );
        })}
        {/* Mando de volumen (ganancia) */}
        <text x={960} y={1140} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={26}>volumen</text>
        <rect x={945} y={1170} width={30} height={360} rx={15} fill="rgba(255,255,255,0.08)" />
        <rect x={945} y={1530 - 360 * ganancia} width={30} height={360 * ganancia} rx={15} fill={C.yellow} />
        <circle cx={960} cy={1530 - 360 * ganancia} r={30} fill={C.white} />
      </g>
      {/* Radio sin emisora */}
      {radio > 0 ? (
        <g opacity={radio}>
          <rect x={60} y={150} width={960} height={300} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <rect x={110} y={210} width={300} height={180} rx={24} fill="#2A2350" stroke={C.grey} strokeWidth={4} />
          <circle cx={180} cy={300} r={44} fill="none" stroke={C.grey} strokeWidth={4} />
          <line x1={180} y1={300} x2={180 + 36 * Math.cos(-2.4 + 2.2 * radio)} y2={300 + 36 * Math.sin(-2.4 + 2.2 * radio)} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" />
          <rect x={250} y={250} width={130} height={14} rx={7} fill={C.grey} opacity={0.6} />
          {(() => {
            let d = "M 450 300";
            for (let x = 450; x <= 980; x += 6) {
              d += ` L ${x} ${300 + (random(`s${x}-${f}`) - 0.5) * 120 * radio}`;
            }
            return <path d={d} fill="none" stroke={C.grey} strokeWidth={3} />;
          })()}
          <text x={980} y={420} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={28}>sin emisora: solo ruido</text>
        </g>
      ) : null}
    </svg>
  );
};
