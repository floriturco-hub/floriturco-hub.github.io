import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/pluma/narracion.wav (voz x1,06), sacados con Whisper
export const T = {
  invisible: 2.24,
  capsulas: 6.6,
  tres: 9.3,
  colorante: 11.64,
  activa: 12.58,
  tercera: 14.76,
  normal: 18.32,
  frotar: 22.32,
  sesenta: 25.96,
  derrite: 27.18,
  transparente: 30.38,
  sigue: 32.36,
  auto: 34.86,
  sola: 39.48,
  revertir: 41.28,
  congelador: 43.42,
  vuelve: 46.42,
  escondio: 47.64,
  fin: 50.2,
};

const TINTA = "#3A6AE8";
const CERA = "#E8E6F0";

// Hoja de cuaderno con renglones escritos; tinta: 0 invisible .. 1 visible
const Hoja: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly tinta: number;
}> = ({ x, y, s = 1, tinta }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-300} y={-220} width={600} height={440} rx={14} fill="#F0EEF8" />
    {new Array(7).fill(0).map((_, k) => (
      <line
        key={k}
        x1={-300}
        y1={-160 + k * 55}
        x2={300}
        y2={-160 + k * 55}
        stroke="#9AB8E8"
        strokeWidth={3}
      />
    ))}
    <line
      x1={-230}
      y1={-220}
      x2={-230}
      y2={220}
      stroke={C.red}
      strokeWidth={3}
    />
    {new Array(6).fill(0).map((_, k) => (
      <path
        key={k}
        d={`M -200 ${-175 + k * 55} ${new Array(8)
          .fill(0)
          .map(
            (__, j) => `q 16 ${j % 2 ? 18 : -18} ${32 + ((k + j) % 3) * 6} 0`,
          )
          .join(" ")}`}
        stroke={TINTA}
        strokeWidth={6}
        fill="none"
        opacity={tinta}
      />
    ))}
  </g>
);

// Microcápsula con sus tres ingredientes; unido 1 = color, 0 = transparente
const Capsula: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly unido: number;
  readonly derretido?: number;
}> = ({ x, y, r, unido, derretido = 0 }) => {
  const sep = 1 - unido;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle
        r={r}
        fill={TINTA}
        opacity={0.15 + 0.6 * unido}
        stroke="#8AA8F0"
        strokeWidth={r * 0.05}
      />
      <circle
        r={r * 0.8}
        fill="none"
        stroke={CERA}
        strokeWidth={r * 0.12}
        opacity={0.6 * (1 - derretido)}
        strokeDasharray={derretido > 0 ? "6 10" : undefined}
      />
      <polygon
        points={new Array(6)
          .fill(0)
          .map(
            (_, k) =>
              `${Math.cos((k * Math.PI) / 3) * r * 0.3 - sep * r * 0.25},${Math.sin((k * Math.PI) / 3) * r * 0.3}`,
          )
          .join(" ")}
        fill={unido > 0.5 ? TINTA : "#8C88A8"}
        stroke={C.white}
        strokeWidth={r * 0.03}
      />
      <circle
        cx={r * 0.32 + sep * r * 0.25}
        cy={-r * 0.05}
        r={r * 0.15}
        fill={C.yellow}
      />
    </g>
  );
};

// Termómetro
const Termometro: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly nivel: number;
  readonly texto: string;
  readonly color: string;
}> = ({ x, y, nivel, texto, color }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect
      x={-22}
      y={-200}
      width={44}
      height={240}
      rx={22}
      fill="#1A1636"
      stroke={C.grey}
      strokeWidth={6}
    />
    <rect
      x={-12}
      y={30 - 220 * nivel}
      width={24}
      height={220 * nivel}
      rx={12}
      fill={color}
    />
    <circle
      cx={0}
      cy={60}
      r={40}
      fill={color}
      stroke={C.grey}
      strokeWidth={6}
    />
    <text
      x={60}
      y={-180 + (1 - nivel) * 180}
      fill={color}
      fontFamily="JetBrains Mono"
      fontSize={40}
      fontWeight={700}
    >
      {texto}
    </text>
  </g>
);

// A. Gancho: la tarea desaparece con el calor
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tinta = interpolate(t, [0.4, 1.2], [1, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.invisible], [1.08, 1])}>
        <Hoja x={540} y={860} s={1.4} tinta={tinta} />
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M ${300 + k * 240} 1300 q 30 -40 0 -80 q -30 -40 0 -80`}
            stroke={C.orange}
            strokeWidth={12}
            fill="none"
            opacity={aparece(t, 0.4) * (0.5 + 0.5 * Math.sin(t * 6 + k))}
          />
        ))}
      </Lienzo>
      <Flash t={t} d={1.0} color={C.orange} />
    </>
  );
};

// B. Cápsulas con tres ingredientes
export const Capsulas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zoom = aparece(t, T.capsulas);
  const filas = [
    ["colorante", TINTA, T.colorante],
    ["activador", C.yellow, T.activa],
    ["regulador de calor", CERA, T.tercera],
  ] as const;
  return (
    <Lienzo zoom={interpolate(t, [T.invisible, T.normal], [1, 1.03])}>
      <Texto
        x={540}
        y={470}
        color={C.white}
        size={48}
        op={aparece(t, T.invisible)}
      >
        no se borra: se vuelve invisible
      </Texto>
      <g opacity={1 - zoom}>
        <Hoja x={540} y={860} s={1.1} tinta={1} />
      </g>
      <g opacity={zoom}>
        {new Array(5).fill(0).map((_, k) => (
          <Capsula
            key={k}
            x={200 + k * 170}
            y={700 + (k % 2) * 60}
            r={70}
            unido={1}
          />
        ))}
      </g>
      {filas.map(([nom, col, d], k) => (
        <g key={nom} opacity={aparece(t, d)}>
          <circle cx={260} cy={980 + k * 110} r={26} fill={col} />
          <Texto x={320} y={994 + k * 110} color={col} size={40} anchor="start">
            {nom}
          </Texto>
        </g>
      ))}
    </Lienzo>
  );
};

// C. Temperatura normal: unidos, se ve el color
export const Normal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.normal, T.frotar], [1, 1.04])}>
      <Capsula x={540} y={820} r={240} unido={1} />
      <Texto
        x={540}
        y={1180}
        color={TINTA}
        size={56}
        op={aparece(t, T.normal + 0.5)}
      >
        unidos = color
      </Texto>
    </Lienzo>
  );
};

// D. La goma calienta a más de 60 °C: el colorante queda transparente
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const temp = interpolate(t, [T.frotar + 0.3, T.sesenta + 0.5], [0, 1], suave);
  const sep = interpolate(t, [T.derrite, T.transparente + 0.3], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.frotar, T.auto], [1, 1.03])}>
      <g
        transform={`translate(${380 + 60 * Math.sin(t * 14) * aparece(t, T.frotar)} 520)`}
        opacity={aparece(t, T.frotar)}
      >
        <rect x={-50} y={-90} width={100} height={130} rx={20} fill="#E8A0B0" />
        <rect x={-50} y={30} width={100} height={30} rx={6} fill="#8C88A8" />
      </g>
      <rect
        x={160}
        y={620}
        width={460}
        height={20}
        rx={8}
        fill={TINTA}
        opacity={1 - sep}
      />
      <Termometro
        x={840}
        y={640}
        nivel={0.3 + 0.6 * temp}
        texto={`${Math.round(25 + temp * 40)} °C`}
        color={temp > 0.8 ? C.red : C.orange}
      />
      <Capsula x={400} y={1040} r={200} unido={1 - sep} derretido={sep} />
      <Texto x={540} y={1360} color={C.grey} size={40} op={aparece(t, T.sigue)}>
        la tinta sigue ahí
      </Texto>
    </Lienzo>
  );
};

// Auto con sol
export const Auto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const borra = interpolate(t, [T.sola - 0.5, T.sola + 1], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.auto, T.revertir], [1, 1.03])}>
      <circle cx={860} cy={440} r={80} fill={C.yellow} />
      {new Array(8).fill(0).map((_, k) => (
        <line
          key={k}
          x1={860}
          y1={440}
          x2={860 + Math.cos(k * 0.785 + t) * 140}
          y2={440 + Math.sin(k * 0.785 + t) * 140}
          stroke={C.yellow}
          strokeWidth={8}
          opacity={0.6}
        />
      ))}
      <path
        d="M 120 900 L 220 760 Q 260 700 340 700 L 700 700 Q 780 700 820 760 L 940 900 L 960 1000 L 100 1000 Z"
        fill="#3A3A5A"
        stroke={C.grey}
        strokeWidth={8}
      />
      <path
        d="M 250 880 L 330 760 L 520 760 L 520 880 Z"
        fill="#6A8AB8"
        opacity={0.6}
      />
      <circle
        cx={280}
        cy={1010}
        r={60}
        fill="#1A1A2A"
        stroke={C.grey}
        strokeWidth={8}
      />
      <circle
        cx={780}
        cy={1010}
        r={60}
        fill="#1A1A2A"
        stroke={C.grey}
        strokeWidth={8}
      />
      <g transform="translate(420 830) scale(0.25)">
        <Hoja x={0} y={0} tinta={borra} />
      </g>
      <Tarjeta x={290} y={1140} w={500} h={150} op={aparece(t, T.auto + 0.6)}>
        <Texto x={540} y={1240} color={C.red} size={60}>
          {"> 60 °C"}
        </Texto>
      </Tarjeta>
      <Texto
        x={540}
        y={1400}
        color={C.orange}
        size={44}
        op={aparece(t, T.sola)}
      >
        se borra sola
      </Texto>
    </Lienzo>
  );
};

// F. Congelador: el color vuelve
export const Congelador: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vuelve = interpolate(
    t,
    [T.vuelve - 0.5, T.vuelve + 0.8],
    [0, 1],
    suave,
  );
  return (
    <Lienzo zoom={interpolate(t, [T.revertir, T.escondio], [1, 1.04])}>
      <rect
        x={160}
        y={480}
        width={760}
        height={820}
        rx={30}
        fill="#1E2A4A"
        stroke="#7AC8F0"
        strokeWidth={10}
        opacity={aparece(t, T.congelador)}
      />
      <g opacity={aparece(t, T.congelador)}>
        {[0, 1, 2].map((k) => (
          <g
            key={k}
            transform={`translate(${300 + k * 240} 580) rotate(${t * 20})`}
          >
            {[0, 60, 120].map((a) => (
              <line
                key={a}
                x1={-30}
                y1={0}
                x2={30}
                y2={0}
                stroke="#7AC8F0"
                strokeWidth={6}
                transform={`rotate(${a})`}
              />
            ))}
          </g>
        ))}
      </g>
      <Hoja x={540} y={930} s={1.05} tinta={vuelve} />
      <Texto
        x={540}
        y={1420}
        color="#7AC8F0"
        size={44}
        op={aparece(t, T.congelador)}
      >
        bajo cero: vuelve el color
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: escondida, no borrada
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ver = (Math.sin(t * 2.5) + 1) / 2;
  return (
    <Lienzo zoom={interpolate(t, [T.escondio, T.fin + 0.5], [1, 1.05])}>
      <Hoja x={540} y={880} s={1.3} tinta={ver} />
      <Texto
        x={540}
        y={1260}
        color={C.yellow}
        size={54}
        op={aparece(t, T.escondio + 0.8)}
      >
        solo se escondió
      </Texto>
    </Lienzo>
  );
};
