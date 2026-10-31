import { AbsoluteFill, Easing, interpolate, interpolateColors, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { C, clamp, H, mono, W } from "../theme";

// Inserto de ~12 s para la campaña: explica de forma simple la tecnología violeta (corrección de color).
// Sin voz (el creador pone la suya), sin logos ni envases dibujados: el producto real sale en su grabación.
export const DURACION_INSERTO_S = 12;

const AMARILLO_DIENTE = "#E8D8A0";
const BLANCO_DIENTE = "#F4F2F8";
const VIOLETA = "#9A6AE8";
const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

const Diente: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly color: string }> = ({ x, y, s, color }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M -90 -110 Q -110 -150 -60 -160 Q -20 -168 0 -140 Q 20 -168 60 -160 Q 110 -150 90 -110 Q 80 -40 60 40 Q 50 120 30 150 Q 15 165 5 120 Q 0 80 -5 120 Q -15 165 -30 150 Q -50 120 -60 40 Q -80 -40 -90 -110 Z"
    fill={color}
    stroke="#C8C4D8"
    strokeWidth={5}
  />
);

const RUEDA = ["#E8414F", "#E8703C", "#F8C848", "#8CCB5A", "#3FA8B8", "#5A6AD8", "#9A6AE8", "#C85AB8"];

export const InsertoVioleta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const rueda = interpolate(t, [2.0, 2.6, 5.2, 5.6], [0, 1, 1, 0], clamp);
  const flecha = interpolate(t, [3.0, 3.8], [0, 1], suave);
  const capa = interpolate(t, [5.6, 7.4], [0, 1], suave);
  const tono = interpolate(t, [6.4, 7.8], [0, 1], suave);
  const nota = interpolate(t, [8.6, 9.1], [0, 1], clamp);
  const salida = interpolate(t, [11.4, 12], [1, 0], clamp);
  const zoom = interpolate(t, [0, DURACION_INSERTO_S], [1, 1.06]);

  return (
    <AbsoluteFill style={{ opacity: salida }}>
      <Fondo />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <g transform={`translate(${540 - 540 * zoom} ${960 - 900 * zoom}) scale(${zoom})`}>
          {/* Diente: de tono amarillento a neutro cuando actúa el pigmento violeta */}
          <g opacity={1 - rueda}>
            <Diente x={540} y={900} s={2.2} color={interpolateColors(tono, [0, 1], [AMARILLO_DIENTE, BLANCO_DIENTE])} />
            {capa > 0
              ? new Array(60).fill(0).map((_, k) => {
                  const a = random(`a${k}`) * Math.PI * 2;
                  const r = 60 + random(`r${k}`) * 160;
                  const llega = Math.min(1, Math.max(0, capa * 1.6 - random(`d${k}`) * 0.6));
                  const x = 540 + Math.cos(a) * r * 1.1;
                  const y = 840 + Math.sin(a) * r * 1.3;
                  const ox = 540 + Math.cos(a) * 700;
                  const oy = 840 + Math.sin(a) * 700;
                  return <circle key={k} cx={ox + (x - ox) * llega} cy={oy + (y - oy) * llega} r={7} fill={VIOLETA} opacity={0.55 * llega * (1 - tono * 0.7)} />;
                })
              : null}
            {tono > 0.6 ? (
              <g opacity={(tono - 0.6) / 0.4}>
                {[0, 1, 2].map((k) => (
                  <path key={k} d={`M ${430 + k * 110} ${640 - (k % 2) * 40} l 10 -26 l 10 26 l -10 26 Z`} fill={C.white} opacity={0.6 + 0.4 * Math.sin(t * 6 + k)} />
                ))}
              </g>
            ) : null}
          </g>
          {/* Rueda de color: el violeta está justo enfrente del amarillo */}
          {rueda > 0 ? (
            <g opacity={rueda} transform="translate(540 900)">
              {RUEDA.map((c, k) => {
                const a0 = (k / RUEDA.length) * Math.PI * 2 - Math.PI / 2;
                const a1 = ((k + 1) / RUEDA.length) * Math.PI * 2 - Math.PI / 2;
                return (
                  <path
                    key={k}
                    d={`M 0 0 L ${Math.cos(a0) * 300} ${Math.sin(a0) * 300} A 300 300 0 0 1 ${Math.cos(a1) * 300} ${Math.sin(a1) * 300} Z`}
                    fill={c}
                    opacity={k === 2 || k === 6 ? 1 : 0.35}
                  />
                );
              })}
              <circle r={110} fill={C.bg} />
              {(() => {
                // Centros de los sectores amarillo (2) y violeta (6): opuestos en la rueda
                const centro = (k: number) => ((k + 0.5) / RUEDA.length) * Math.PI * 2 - Math.PI / 2;
                const [ay, av] = [centro(2), centro(6)];
                const p1 = [Math.cos(ay) * 210, Math.sin(ay) * 210];
                const p2 = [Math.cos(av) * 210, Math.sin(av) * 210];
                return (
                  <g>
                    <line x1={p1[0]} y1={p1[1]} x2={p1[0] + (p2[0] - p1[0]) * flecha} y2={p1[1] + (p2[1] - p1[1]) * flecha} stroke={C.white} strokeWidth={8} strokeDasharray="16 10" />
                    <text x={Math.cos(ay) * 300} y={Math.sin(ay) * 300 + 170} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={40} fontWeight={700}>amarillo</text>
                    <text x={Math.cos(av) * 300} y={Math.sin(av) * 300 - 150} textAnchor="start" fill={VIOLETA} fontFamily={mono} fontSize={40} fontWeight={700} opacity={flecha}>violeta</text>
                  </g>
                );
              })()}
            </g>
          ) : null}
        </g>
        {/* Nota honesta: efecto óptico, inmediato y temporal */}
        {nota > 0 ? (
          <g opacity={nota}>
            <rect x={60} y={1340} width={960} height={260} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
            <text x={540} y={1420} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>Crema Dental Luminous White</text>
            <text x={540} y={1470} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>Color Correct</text>
            <text x={540} y={1550} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28}>efecto óptico inmediato y temporal</text>
          </g>
        ) : null}
      </svg>
      <Etiqueta texto="Tono amarillento" desde={0.4} hasta={2.0} y={1400} color={C.yellow} />
      <Etiqueta texto="El violeta es su opuesto" desde={3.0} hasta={5.5} y={1400} color={VIOLETA} />
      <Etiqueta texto="Lo neutraliza al instante" desde={6.0} hasta={8.5} y={1400} color={C.white} />
    </AbsoluteFill>
  );
};
