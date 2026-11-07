import { C, mono } from "../theme";

const PIEL = "#E8B898";
const UNA = "#F4D8CC";

// Dedo horizontal apuntando a la derecha (la punta queda en x,y)
export const Dedo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly fantasma?: boolean;
  readonly espejo?: boolean;
}> = ({ x, y, s = 1, fantasma = false, espejo = false }) => (
  <g
    transform={`translate(${x} ${y}) scale(${espejo ? -s : s} ${s})`}
    opacity={fantasma ? 0.55 : 1}
  >
    <path
      d="M -520 -48 L -40 -48 Q 0 -48 0 0 Q 0 48 -40 48 L -520 48 Z"
      fill={fantasma ? "#B8A8B8" : PIEL}
      stroke={fantasma ? "#8C88A8" : "#C08A6A"}
      strokeWidth={5}
      strokeDasharray={fantasma ? "12 8" : undefined}
    />
    <path
      d="M -90 -46 L -30 -46 Q -8 -40 -8 -14 L -90 -14 Z"
      fill={UNA}
      opacity={0.9}
    />
    <path
      d="M -200 -48 Q -190 0 -200 48 M -340 -48 Q -330 0 -340 48"
      stroke="#C08A6A"
      strokeWidth={4}
      fill="none"
      opacity={0.6}
    />
  </g>
);

// Corte del espejo: vidrio de grosor g, capa reflectante delante o detrás
export const CorteEspejo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly h: number;
  readonly g: number;
  readonly capaDelante: boolean;
  readonly etiquetas?: number;
}> = ({ x, y, h, g, capaDelante, etiquetas = 0 }) => {
  const capaX = capaDelante ? x : x + g;
  return (
    <g>
      <rect
        x={x}
        y={y - h / 2}
        width={g}
        height={h}
        fill={C.cyan}
        opacity={0.18}
        stroke={C.cyan}
        strokeWidth={3}
      />
      <rect x={capaX - 5} y={y - h / 2} width={10} height={h} fill="#E8E6F0" />
      {etiquetas > 0 ? (
        <g opacity={etiquetas} fontFamily={mono} fontWeight={700} fontSize={30}>
          <text
            x={x + g / 2}
            y={y - h / 2 - 20}
            textAnchor="middle"
            fill={C.cyan}
          >
            vidrio
          </text>
          <text x={capaX} y={y + h / 2 + 46} textAnchor="middle" fill={C.white}>
            capa
          </text>
        </g>
      ) : null}
    </g>
  );
};

// Vista de frente: dedo tocando el espejo y su reflejo, con o sin espacio
export const VistaFrente: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly hueco: number;
  readonly id: string;
  readonly marco?: string;
}> = ({ x, y, r, hueco, id, marco = "#8C88A8" }) => (
  <g transform={`translate(${x} ${y})`}>
    <defs>
      <clipPath id={`vf-${id}`}>
        <circle r={r} />
      </clipPath>
    </defs>
    <circle r={r} fill="#2A3A5A" />
    <g clipPath={`url(#vf-${id})`}>
      <rect
        x={-r}
        y={-r}
        width={2 * r}
        height={2 * r}
        fill="#3A4A6A"
        opacity={0.5}
      />
      <g transform={`rotate(-90) translate(${-hueco / 2} 0)`}>
        <Dedo x={0} y={0} s={0.7} />
      </g>
      <g transform={`rotate(-90) translate(${hueco / 2} 0)`}>
        <g opacity={0.7}>
          <Dedo x={0} y={0} s={0.7} espejo />
        </g>
      </g>
      {hueco > 6 ? (
        <g>
          <line
            x1={-60}
            y1={-hueco / 2}
            x2={60}
            y2={-hueco / 2}
            stroke={C.yellow}
            strokeWidth={4}
          />
          <line
            x1={-60}
            y1={hueco / 2}
            x2={60}
            y2={hueco / 2}
            stroke={C.yellow}
            strokeWidth={4}
          />
        </g>
      ) : null}
    </g>
    <circle r={r} fill="none" stroke={marco} strokeWidth={10} />
  </g>
);

// Persona esquemática
export const Persona: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly color: string;
  readonly ojos?: boolean;
}> = ({ x, y, s = 1, color, ojos = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-170} r={60} fill={color} />
    <path d="M -90 -90 Q 0 -120 90 -90 L 110 140 L -110 140 Z" fill={color} />
    {ojos ? (
      <g>
        <ellipse cx={-22} cy={-176} rx={10} ry={6} fill={C.white} />
        <ellipse cx={22} cy={-176} rx={10} ry={6} fill={C.white} />
      </g>
    ) : null}
  </g>
);

// Dos cuartos separados por un espejo espía
export const Cuartos: React.FC<{
  readonly t: number;
  readonly luzOtro: number;
  readonly mirada: number;
  readonly rayo?: number;
}> = ({ t, luzOtro, mirada, rayo = 0 }) => (
  <g>
    <rect
      x={60}
      y={500}
      width={470}
      height={720}
      rx={16}
      fill="#E8D8A8"
      opacity={0.85}
    />
    <rect
      x={550}
      y={500}
      width={470}
      height={720}
      rx={16}
      fill={`rgb(${20 + 160 * luzOtro}, ${18 + 150 * luzOtro}, ${40 + 110 * luzOtro})`}
    />
    <rect x={530} y={500} width={20} height={720} fill="#C8D0E0" />
    <Persona x={300} y={960} s={1} color="#3A6A9A" />
    <g opacity={mirada}>
      <Persona
        x={800}
        y={960}
        s={1}
        color={luzOtro > 0.4 ? "#5A3A3A" : "#141228"}
        ojos
      />
    </g>
    {rayo > 0 ? (
      <path
        d="M 380 790 L 1020 640 L 1020 940 Z"
        fill="#FFF2C8"
        opacity={0.35 * rayo}
      />
    ) : null}
    <text
      x={295}
      y={560}
      textAnchor="middle"
      fill="#5A4A2A"
      fontFamily={mono}
      fontSize={30}
      fontWeight={700}
    >
      tu lado: con luz
    </text>
    <text
      x={785}
      y={560}
      textAnchor="middle"
      fill={luzOtro > 0.4 ? C.bg : C.grey}
      fontFamily={mono}
      fontSize={30}
      fontWeight={700}
    >
      otro lado: oscuro
    </text>
    <circle cx={540} cy={760 + 10 * Math.sin(t * 2)} r={0} />
  </g>
);

// Celular con linterna
export const Celular: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly luz: number;
}> = ({ x, y, s = 1, luz }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect
      x={-70}
      y={-140}
      width={140}
      height={280}
      rx={22}
      fill="#2A2A3A"
      stroke="#8C88A8"
      strokeWidth={5}
    />
    <circle cx={40} cy={-105} r={14} fill={luz > 0.5 ? C.yellow : "#5A5A6A"} />
  </g>
);
