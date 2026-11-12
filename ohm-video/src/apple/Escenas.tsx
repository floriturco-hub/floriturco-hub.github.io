import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Mano, PortatilFrente, PortatilLado, Transportador } from "./Piezas";

// Instantes clave (s) de public/audio/apple/narracion.wav (voz ×1,1), sacados con Whisper
export const T = {
  medio: 4.72,
  descuido: 7.16,
  proposito: 8.12,
  setenta: 10.14,
  noSeVe: 13.38,
  tocas: 18.0,
  abres: 18.82,
  gesto: 20.78,
  manos: 25.4,
  ciencia: 27.96,
  tocan: 31.72,
  pagar: 35.74,
  tienda: 38.06,
  angulo: 39.8,
  mesas: 42.06,
  apps: 44.54,
  oficial: 47.38,
  idea: 49.8,
  tuyo: 51.5,
  resistirte: 55.06,
  noAjustes: 57.48,
  fin: 59.2,
};

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const MADERA = "#8A6A48";

const Mesa: React.FC<{ readonly y: number }> = ({ y }) => (
  <g>
    <rect x={40} y={y} width={1000} height={40} rx={8} fill={MADERA} />
    <rect x={40} y={y + 36} width={1000} height={10} fill="#6A4E32" />
    <rect x={120} y={y + 46} width={30} height={380} fill="#5A5675" />
    <rect x={930} y={y + 46} width={30} height={380} fill="#5A5675" />
  </g>
);

// Tienda: portátiles sobre la mesa, todos medio cerrados
export const Tienda: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zoom = interpolate(t, [0, T.setenta], [1, 1.12]);
  const resalta = interpolate(t, [T.medio - 0.2, T.medio + 0.4], [0, 1], clamp);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 1050 * zoom}) scale(${zoom})`}>
        <Mesa y={1150} />
        {[210, 540, 870].map((x, k) => (
          <PortatilFrente key={k} x={x} y={1150} w={260} t={t + k} altura={0.55} />
        ))}
        {resalta > 0 ? (
          <g opacity={resalta}>
            <path d="M 540 860 L 540 1060" stroke={C.yellow} strokeWidth={4} strokeDasharray="10 8" />
            <text x={540} y={840} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={40} fontWeight={700}>medio cerrado</text>
          </g>
        ) : null}
      </g>
    </svg>
  );
};

// El ángulo: ~70°, la pantalla no se ve bien desde arriba, la mano la abre
export const Angulo: React.FC<{ readonly t0: number; readonly fase: "angulo" | "final" }> = ({ t0, fase }) => {
  const t = useT(t0);
  const final = fase === "final";
  const abre = final ? 0 : interpolate(t, [T.abres, T.abres + 1.0], [0, 1], suave);
  const angulo = 70 + 35 * abre;
  const mano = final
    ? interpolate(t, [T.resistirte + 0.4, T.noAjustes - 0.2], [0, 1], suave)
    : interpolate(t, [T.tocas - 0.4, T.tocas + 0.2, T.abres + 1.2, T.gesto], [0, 1, 1, 0], suave);
  const vista = final ? 0 : interpolate(t, [T.noSeVe - 0.2, T.noSeVe + 0.4, T.tocas - 0.4, T.tocas], [0, 1, 1, 0], clamp);
  const prohibido = final ? interpolate(t, [T.noAjustes, T.noAjustes + 0.3], [0, 1], clamp) : 0;
  const zoom = final ? interpolate(t, [t0, t0 + 1, T.fin + 0.5], [1.3, 1.02, 1.06], suave) : interpolate(t, [T.setenta - 0.3, T.setenta + 0.8, T.gesto], [1.4, 1, 1.04], { ...clamp, easing: Easing.out(Easing.cubic) });
  const X = 470;
  const Y = 1200;
  const S = 1.8;
  // Punta de la tapa (para colocar la mano)
  const a = ((180 - angulo) * Math.PI) / 180;
  const bx = X + 300 * S * 0.5;
  const tx = bx + Math.cos(a) * 300 * S;
  const ty = Y - Math.sin(a) * 300 * S;
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 1050 * zoom}) scale(${zoom})`}>
        <rect x={40} y={Y + 34} width={1000} height={30} rx={6} fill={MADERA} />
        <PortatilLado x={X} y={Y} s={S} angulo={angulo} brillo={0.4 + 0.6 * abre} />
        <Transportador x={bx} y={Y} r={330} angulo={angulo} o={final ? 1 : interpolate(t, [T.setenta + 0.4, T.setenta + 0.9], [0, 1], clamp)} />
        {/* Línea de visión de una persona de pie */}
        {vista > 0 ? (
          <g opacity={vista}>
            <circle cx={140} cy={520} r={26} fill="none" stroke={C.white} strokeWidth={6} />
            <circle cx={146} cy={520} r={9} fill={C.white} />
            <line x1={170} y1={530} x2={(bx + tx) / 2} y2={(Y + ty) / 2} stroke={C.white} strokeWidth={3} strokeDasharray="12 10" />
            <text x={140} y={470} fill={C.grey} fontFamily={mono} fontSize={30}>tu vista</text>
          </g>
        ) : null}
        {mano > 0 ? (
          <g opacity={Math.min(1, mano * 1.5)}>
            <Mano x={tx - 150 * (1 - mano) - 60} y={ty - 20} s={1.6} rot={angulo - 90} />
          </g>
        ) : null}
        {prohibido > 0 ? (
          <g opacity={prohibido} stroke={C.red} strokeWidth={14} strokeLinecap="round">
            <line x1={tx - 140} y1={ty - 90} x2={tx + 20} y2={ty + 70} />
            <line x1={tx + 20} y1={ty - 90} x2={tx - 140} y2={ty + 70} />
          </g>
        ) : null}
      </g>
    </svg>
  );
};

// Psicología: tocar aumenta la sensación de propiedad y lo que pagarías
export const Propiedad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const medidor = interpolate(t, [T.gesto + 1.6, T.manos + 0.6], [0.1, 0.85], suave);
  const estudio = interpolate(t, [T.ciencia - 0.2, T.ciencia + 0.3], [0, 1], clamp);
  const barras = interpolate(t, [T.tocan, T.tocan + 1.2], [0, 1], suave);
  const pagar = interpolate(t, [T.pagar - 0.2, T.pagar + 1.0], [0, 1], suave);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g opacity={1 - estudio}>
        <rect x={40} y={1234} width={1000} height={30} rx={6} fill={MADERA} />
        <PortatilLado x={470} y={1200} s={1.8} angulo={105} />
        <Mano x={420} y={1150} s={1.5} rot={0} />
        <rect x={60} y={300} width={960} height={260} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <text x={110} y={370} fill={C.grey} fontFamily={mono} fontSize={30}>sensación de "es mío"</text>
        <rect x={110} y={420} width={860} height={60} rx={30} fill="rgba(255,255,255,0.06)" />
        <rect x={110} y={420} width={860 * medidor} height={60} rx={30} fill={C.yellow} />
      </g>
      {estudio > 0 ? (
        <g opacity={estudio}>
          <rect x={60} y={460} width={960} height={1000} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={530} fill={C.grey} fontFamily={mono} fontSize={30}>experimentos de psicología del consumo</text>
          {[
            { titulo: "sensación de propiedad", y: 640, v: [0.35, 0.75], o: barras },
            { titulo: "lo que pagarías", y: 1000, v: [0.4, 0.7], o: pagar },
          ].map((b, k) => (
            <g key={k} opacity={0.25 + 0.75 * b.o}>
              <text x={110} y={b.y} fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>{b.titulo}</text>
              <text x={110} y={b.y + 90} fill={C.grey} fontFamily={mono} fontSize={32}>solo mirar</text>
              <rect x={370} y={b.y + 55} width={600 * b.v[0] * b.o} height={50} rx={25} fill={C.grey} />
              <text x={110} y={b.y + 190} fill={C.yellow} fontFamily={mono} fontSize={32} fontWeight={700}>tocar</text>
              <rect x={370} y={b.y + 155} width={600 * b.v[1] * b.o} height={50} rx={25} fill={C.yellow} />
            </g>
          ))}
          <text x={110} y={1410} fill={C.grey} fontFamily={mono} fontSize={24}>resultados cualitativos, sin cifras exactas</text>
        </g>
      ) : null}
    </svg>
  );
};

// El resto de la tienda: mismo ángulo, mesas a la altura, apps abiertas; y que no es oficial
export const Detalles: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const items = [
    { texto: "mismo ángulo en todos", t: T.angulo },
    { texto: "mesas a la altura justa", t: T.mesas },
    { texto: "apps abiertas, listas", t: T.apps },
  ];
  const lista = interpolate(t, [T.tienda, T.tienda + 0.4, T.oficial - 0.4, T.oficial], [0, 1, 1, 0], clamp);
  const oficial = interpolate(t, [T.oficial - 0.2, T.oficial + 0.3], [0, 1], clamp);
  const idea = interpolate(t, [T.tuyo - 0.2, T.tuyo + 0.6], [0, 1], suave);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {lista > 0 ? (
        <g opacity={lista}>
          {[200, 540, 880].map((x, k) => (
            <g key={k}>
              <PortatilLado x={x - 60} y={760} s={0.55} angulo={70} />
              <text x={x} y={830} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={30} fontWeight={700} opacity={interpolate(t, [T.angulo, T.angulo + 0.4], [0, 1], clamp)}>70°</text>
            </g>
          ))}
          <rect x={40} y={790} width={1000} height={20} fill={MADERA} />
          <rect x={60} y={960} width={960} height={520} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          {items.map((it, k) => {
            const on = interpolate(t, [it.t, it.t + 0.3], [0.25, 1], clamp);
            const y = 1080 + k * 130;
            return (
              <g key={k} opacity={on}>
                <circle cx={140} cy={y} r={28} fill={on > 0.5 ? C.yellow : C.grey} />
                <text x={140} y={y + 11} textAnchor="middle" fill={C.bg} fontFamily={mono} fontSize={30} fontWeight={700}>{k + 1}</text>
                <text x={200} y={y + 16} fill={C.white} fontFamily={mono} fontSize={46} fontWeight={700}>{it.texto}</text>
              </g>
            );
          })}
        </g>
      ) : null}
      {oficial > 0 ? (
        <g opacity={oficial}>
          <rect x={60} y={560} width={960} height={300} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={630} fill={C.grey} fontFamily={mono} fontSize={30}>explicación oficial</text>
          <text x={110} y={760} fill={C.grey} fontFamily={mono} fontSize={64} fontWeight={700}>ninguna</text>
          <g opacity={idea}>
            <rect x={60} y={940} width={960} height={420} rx={24} fill={C.card} stroke={C.yellow} strokeWidth={3} />
            <text x={110} y={1010} fill={C.grey} fontFamily={mono} fontSize={30}>la idea</text>
            <text x={110} y={1130} fill={C.white} fontFamily={mono} fontSize={56} fontWeight={700}>antes lo tocas</text>
            <line x1={130} y1={1170} x2={130} y2={1230} stroke={C.yellow} strokeWidth={6} />
            <polyline points="110,1210 130,1240 150,1210" fill="none" stroke={C.yellow} strokeWidth={6} />
            <text x={110} y={1310} fill={C.yellow} fontFamily={mono} fontSize={56} fontWeight={700}>antes es "tuyo"</text>
          </g>
        </g>
      ) : null}
    </svg>
  );
};
