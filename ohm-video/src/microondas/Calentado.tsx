import { Easing, interpolate, interpolateColors } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

const FRIO = "#3A5A8C";
const TIBIO = "#C0603C";
const CALIENTE = "#F8A048";

// Corte de un trozo de comida: las ondas calientan la capa exterior, el centro después por contacto
export const Penetracion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const capa = interpolate(t, [T.entran + 0.3, T.centro - 0.4], [0, 1], suave);
  const conduce = interpolate(t, [T.centro, T.zonas - 0.3], [0, 1], suave);
  const zoom = interpolate(t, [T.entran - 0.3, T.zonas], [1, 1.05]);
  const CX = 540;
  const CY = 1000;
  const RW = 380;
  const RH = 300;
  const anillos = 12;
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 960 * zoom}) scale(${zoom})`}>
        {new Array(anillos).fill(0).map((_, k) => {
          // k = 0 borde, k = anillos-1 centro
          const profundidad = k / (anillos - 1);
          const porOndas = capa * Math.max(0, 1 - profundidad / 0.25);
          const porContacto = conduce * Math.max(0, 1 - Math.max(0, profundidad - 0.25) / (0.75 * Math.max(0.05, conduce)));
          const calor = Math.min(1, porOndas + 0.85 * porContacto);
          const f = 1 - k / anillos;
          return (
            <rect
              key={k}
              x={CX - RW * f}
              y={CY - RH * f}
              width={2 * RW * f}
              height={2 * RH * f}
              rx={120 * f}
              fill={interpolateColors(calor, [0, 0.6, 1], [FRIO, TIBIO, CALIENTE])}
            />
          );
        })}
        {/* Ondas que entran y se apagan a pocos centímetros */}
        {[-1, 1].map((lado) =>
          new Array(3).fill(0).map((_, i) => {
            const p = (t * 0.8 + i / 3) % 1;
            const x0 = CX + lado * (RW + 260 - p * 330);
            const y = CY - 160 + i * 160;
            const dentro = Math.max(0, Math.abs(x0 - CX) < RW ? (RW - Math.abs(x0 - CX)) / 90 : 0);
            let d = `M ${x0} ${y}`;
            for (let s = 0; s <= 140; s += 6) {
              d += ` L ${x0 + lado * s} ${y + 16 * Math.sin(s / 14 - t * 10)}`;
            }
            return <path key={`${lado}-${i}`} d={d} fill="none" stroke={C.cyan} strokeWidth={5} opacity={0.8 * Math.max(0, 1 - dentro) * Math.sin(p * Math.PI)} />;
          }),
        )}
        {/* Regla de profundidad */}
        <g opacity={capa}>
          <line x1={CX + RW - 95} y1={CY + RH + 50} x2={CX + RW} y2={CY + RH + 50} stroke={C.white} strokeWidth={3} />
          <line x1={CX + RW - 95} y1={CY + RH + 38} x2={CX + RW - 95} y2={CY + RH + 62} stroke={C.white} strokeWidth={3} />
          <line x1={CX + RW} y1={CY + RH + 38} x2={CX + RW} y2={CY + RH + 62} stroke={C.white} strokeWidth={3} />
          <text x={CX + RW - 48} y={CY + RH + 105} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>~2 cm</text>
        </g>
      </g>
    </svg>
  );
};

// Vista cenital: patrón de zonas fuertes/débiles (ondas estacionarias) y plato que gira
export const Plato: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zonas = interpolate(t, [T.zonas + 0.6, T.zonas + 1.4], [0, 1], clamp);
  const giro = interpolate(t, [T.gira - 0.2, T.salen + 0.3], [0, 300], clamp);
  const CX = 540;
  const CY = 1040;
  const trozos = [0, 120, 240];
  // Calor acumulado de cada trozo según cuánto pasó por zonas fuertes
  const intensidad = (x: number, y: number) => Math.cos(((x - 200) / 230) * Math.PI) ** 2 * Math.cos(((y - 700) / 230) * Math.PI) ** 2;
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="punto" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={C.orange} stopOpacity={0.75} />
          <stop offset="1" stopColor={C.orange} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={140} y={640} width={800} height={800} rx={24} fill="#1A1636" stroke="#8C88A8" strokeWidth={14} />
      <g opacity={zonas}>
        {[0, 1, 2, 3].map((i) =>
          [0, 1, 2, 3].map((j) => (
            <circle
              key={`${i}-${j}`}
              cx={200 + i * 230}
              cy={700 + j * 230}
              r={110 * (0.85 + 0.15 * Math.sin(t * 8 + i + j))}
              fill="url(#punto)"
            />
          )),
        )}
      </g>
      <g transform={`rotate(${giro} ${CX} ${CY})`}>
        <circle cx={CX} cy={CY} r={300} fill="rgba(255,255,255,0.05)" stroke="#8C88A8" strokeWidth={6} />
        {trozos.map((a, k) => {
          const ang = ((a + giro) * Math.PI) / 180;
          const px = CX + Math.cos(ang) * 170;
          const py = CY + Math.sin(ang) * 170;
          const calor = Math.min(1, zonas * (0.25 + 0.5 * intensidad(px, py) + 0.004 * giro));
          return (
            <rect
              key={k}
              x={CX + Math.cos((a * Math.PI) / 180) * 170 - 60}
              y={CY + Math.sin((a * Math.PI) / 180) * 170 - 45}
              width={120}
              height={90}
              rx={24}
              fill={interpolateColors(calor, [0, 0.6, 1], [FRIO, TIBIO, CALIENTE])}
            />
          );
        })}
      </g>
    </svg>
  );
};

// Rejilla de la puerta: agujeros de ~1 mm frente a una onda de ~12 cm
export const Rejilla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const llega = interpolate(t, [T.rejilla, T.rejilla + 1.2], [0, 1], suave);
  const rebota = interpolate(t, [T.rejilla + 1.4, T.luz], [0, 1], clamp);
  const luz = interpolate(t, [T.luz - 0.2, T.luz + 0.4], [0, 1], clamp);
  const X_REJ = 600;
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {/* Rejilla en perfil: placa con agujeros diminutos */}
      <rect x={X_REJ - 12} y={500} width={24} height={1100} fill="#8C88A8" />
      {new Array(28).fill(0).map((_, i) => (
        <rect key={i} x={X_REJ - 14} y={520 + i * 38} width={28} height={10} fill="#0B091D" />
      ))}
      {/* Microonda grande: llega y rebota */}
      {[0].map((k) => {
        let d = "";
        const x0 = 60;
        const xFin = 60 + (X_REJ - 80) * llega;
        for (let x = x0; x <= xFin; x += 6) {
          d += `${x === x0 ? "M" : "L"} ${x} ${1050 + 130 * Math.sin((x - x0) / 95 - t * 5)}`;
        }
        return <path key={k} d={d} fill="none" stroke={C.cyan} strokeWidth={8} strokeLinecap="round" />;
      })}
      {rebota > 0 ? (
        <g opacity={rebota * (1 - 0.6 * luz)}>
          <path d={`M ${X_REJ - 60} 820 Q ${X_REJ - 260} 760 ${X_REJ - 420} 820`} fill="none" stroke={C.cyan} strokeWidth={6} strokeDasharray="18 12" />
          <polyline points={`${X_REJ - 395},790 ${X_REJ - 425} 822 ${X_REJ - 388},848`} fill="none" stroke={C.cyan} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
      {/* Luz visible: ondas diminutas que atraviesan los agujeros */}
      {luz > 0
        ? new Array(6).fill(0).map((_, i) => {
            const y = 545 + i * 190;
            const p = (t * 0.9 + i * 0.17) % 1;
            const x0 = 120 + p * 820;
            let d = `M ${x0} ${y}`;
            for (let s = 0; s <= 90; s += 3) {
              d += ` L ${x0 + s} ${y + 6 * Math.sin(s / 2.2 - t * 30)}`;
            }
            return <path key={i} d={d} fill="none" stroke={C.yellow} strokeWidth={4} opacity={luz} />;
          })
        : null}
      {/* Ojo del observador */}
      <g opacity={luz} transform="translate(930 1050)">
        <path d="M -70 0 Q 0 -55 70 0 Q 0 55 -70 0 Z" fill="none" stroke={C.white} strokeWidth={6} />
        <circle cx={0} cy={0} r={22} fill={C.white} />
      </g>
      {/* Comparativa de tamaños */}
      <g opacity={interpolate(t, [T.rejilla + 0.8, T.rejilla + 1.3], [0, 1], clamp)}>
        <rect x={60} y={150} width={960} height={250} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <text x={110} y={235} fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>agujero</text>
        <text x={980} y={235} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>~1 mm</text>
        <text x={110} y={335} fill={C.cyan} fontFamily={mono} fontSize={40} fontWeight={700}>microonda</text>
        <text x={980} y={335} textAnchor="end" fill={C.cyan} fontFamily={mono} fontSize={40} fontWeight={700}>~12 cm</text>
      </g>
    </svg>
  );
};
