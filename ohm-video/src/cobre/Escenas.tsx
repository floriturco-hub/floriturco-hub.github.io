import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import {
  Atmosfera,
  Ciudad,
  colorCobre,
  Corte,
  Escudo,
  Estatua,
  Moneda,
  Pancarta,
  PATINA,
  Placa,
  Rodillo,
} from "./Piezas";

// Instantes clave (s) de public/audio/cobre/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  siempre: 1.26,
  verde: 2.16,
  cuando: 2.84,
  brillaba: 3.94,
  moneda: 5.18,
  techos: 6.32,
  europa: 8.16,
  cobre: 8.92,
  ligero: 10.28,
  moldear: 11.12,
  siglos: 12.2,
  pintura: 13.24,
  catedrales: 14.28,
  cupulas: 16.54,
  pero: 17.68,
  reacciona: 18.28,
  oscurece: 19.78,
  naranja: 21.06,
  negro: 22.74,
  despues: 23.78,
  lluvia: 25.46,
  dioxido: 26.2,
  azufre: 27.5,
  capa: 28.8,
  verde2: 31.02,
  patina: 32.54,
  estatua: 33.5,
  veinte: 34.5,
  n1906: 35.96,
  pintarla: 37.34,
  protesto: 39.04,
  menos: 40.62,
  suciedad: 41.44,
  escudo: 43.46,
  pega: 44.58,
  corrosion: 45.66,
  piel: 47.02,
  tres: 48.26,
  sigue: 49.54,
  asi: 52.06,
  destruye: 53.44,
  protegiendo: 54.86,
  fin: 57.0,
};

const aparece = (t: number, d: number) =>
  interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);
const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

const Lienzo: React.FC<{
  readonly children: React.ReactNode;
  readonly zoom?: number;
  readonly cy?: number;
}> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g
      transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}
    >
      {children}
    </g>
  </svg>
);

const Texto: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly op?: number;
  readonly size?: number;
}> = ({ x, y, children, color = C.white, op = 1, size = 36 }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fill={color}
    fontFamily={mono}
    fontSize={size}
    fontWeight={700}
    opacity={op}
  >
    {children}
  </text>
);

// A. Gancho: la estatua no siempre fue verde
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = 1 - interpolate(t, [T.cuando - 0.1, T.cuando + 0.5], [0, 1], suave);
  const flash = interpolate(
    t,
    [T.cuando - 0.1, T.cuando - 0.02, T.cuando + 0.4],
    [0, 0.3, 0],
    clamp,
  );
  const anio = Math.round(
    interpolate(t, [T.cuando - 0.1, T.cuando + 0.5], [2026, 1886], clamp),
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.techos], [1, 1.07])} cy={900}>
        <Estatua
          x={540}
          y={820}
          s={1.15}
          p={p}
          brillo={aparece(t, T.brillaba)}
          t={t}
        />
        <Texto x={540} y={330} color={p > 0.5 ? PATINA : "#FFB880"} size={64}>
          {String(anio)}
        </Texto>
        <Moneda x={860} y={1080} r={90} op={aparece(t, T.moneda)} />
      </Lienzo>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.white,
          opacity: flash,
        }}
      />
    </>
  );
};

// B. Los techos verdes de Europa
export const Europa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.techos, T.cobre], [1.05, 1])}>
      <Ciudad
        y={1250}
        p={(k) => 0.9 + 0.1 * (k % 2)}
        op={aparece(t, T.techos)}
      />
      <Texto
        x={540}
        y={1400}
        color={PATINA}
        op={aparece(t, T.europa)}
        size={44}
      >
        tejados de cobre
      </Texto>
    </Lienzo>
  );
};

// C. Por qué cobre
const PROPIEDADES: [string, keyof typeof T][] = [
  ["ligero", "ligero"],
  ["fácil de moldear", "moldear"],
  ["dura siglos", "siglos"],
  ["sin pintura", "pintura"],
];
export const PorQue: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ciudad = aparece(t, T.catedrales);
  return (
    <Lienzo zoom={interpolate(t, [T.cobre, T.pero], [1, 1.04])}>
      <g opacity={1 - ciudad * 0.85}>
        <Placa x={190} y={300} w={700} h={260} p={0} t={t} />
        <Texto x={540} y={460} color="#6A3418" size={90}>
          Cu
        </Texto>
        {PROPIEDADES.map(([txt, k], i) => (
          <g
            key={txt}
            opacity={aparece(t, T[k])}
            transform={`translate(${i % 2 ? 560 : 120} ${640 + Math.floor(i / 2) * 140})`}
          >
            <rect
              width={400}
              height={110}
              rx={22}
              fill={C.card}
              stroke={C.cardBorder}
              strokeWidth={2}
            />
            <path
              d="M 34 56 L 54 78 L 92 34"
              stroke={C.yellow}
              strokeWidth={10}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x={118}
              y={70}
              fill={C.white}
              fontFamily={mono}
              fontSize={34}
              fontWeight={700}
            >
              {txt}
            </text>
          </g>
        ))}
      </g>
      <Ciudad y={1300} p={() => 0} op={ciudad} />
    </Lienzo>
  );
};

// D. La reacción: oscurece y luego se vuelve verde
export const Reaccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p =
    t < T.despues
      ? interpolate(t, [T.oscurece, T.negro + 0.3], [0, 0.55], suave)
      : interpolate(t, [T.capa, T.patina], [0.55, 1], suave);
  const etapa =
    p < 0.15
      ? "cobre nuevo"
      : p < 0.4
        ? "marrón"
        : p < 0.7
          ? "casi negro"
          : "pátina";
  const anios = Math.round(
    interpolate(t, [T.despues, T.patina], [0, 30], clamp),
  );
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.estatua], [1, 1.05])}>
      <Atmosfera
        x={170}
        y={330}
        w={740}
        h={480}
        t={t}
        op={aparece(t, T.lluvia)}
        moleculas={aparece(t, T.dioxido)}
      />
      <Placa x={170} y={840} w={740} h={420} p={p} t={t} />
      <Texto x={540} y={1340} color={p > 0.7 ? PATINA : C.white} size={48}>
        {etapa}
      </Texto>
      <g opacity={aparece(t, T.despues)}>
        <Texto x={540} y={290} color={C.yellow} size={44}>
          {`+${anios} años`}
        </Texto>
      </g>
      <g opacity={aparece(t, T.reacciona) * (1 - aparece(t, T.lluvia))}>
        {[0, 1, 2].map((k) => {
          const f = (t * 0.6 + k / 3) % 1;
          return (
            <g key={k} opacity={Math.sin(f * Math.PI)}>
              <circle
                cx={300 + k * 240}
                cy={780 - f * 200}
                r={34}
                fill={C.card}
                stroke={C.cyan}
                strokeWidth={3}
              />
              <text
                x={300 + k * 240}
                y={790 - f * 200}
                textAnchor="middle"
                fill={C.cyan}
                fontFamily={mono}
                fontSize={26}
                fontWeight={700}
              >
                O2
              </text>
            </g>
          );
        })}
      </g>
    </Lienzo>
  );
};

// E. La estatua: 20 años, y casi la pintan
export const Estatua1906: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.veinte - 0.3, T.n1906], [0, 1], suave);
  const anio = Math.round(
    interpolate(t, [T.veinte - 0.3, T.n1906], [1886, 1906], clamp),
  );
  const protesta = aparece(t, T.protesto);
  return (
    <Lienzo zoom={interpolate(t, [T.estatua, T.menos], [1, 1.04])} cy={900}>
      <Estatua x={540} y={760} s={1.0} p={p} t={t} />
      <Texto x={540} y={300} color={p > 0.5 ? PATINA : "#FFB880"} size={64}>
        {String(anio)}
      </Texto>
      <g opacity={1 - protesta * 0.4}>
        <Rodillo x={850} y={620} op={aparece(t, T.pintarla)} />
      </g>
      <g
        opacity={protesta}
        stroke={C.red}
        strokeWidth={14}
        strokeLinecap="round"
      >
        <line x1={740} y1={520} x2={960} y2={760} />
        <line x1={960} y1={520} x2={740} y2={760} />
      </g>
      <Pancarta x={190} y={1250} texto="¡NO!" op={protesta} t={t} k={0} />
      <Pancarta
        x={890}
        y={1270}
        texto="¡VERDE!"
        op={aparece(t, T.protesto + 0.3)}
        t={t}
        k={1}
      />
    </Lienzo>
  );
};

// F. La pátina es un escudo
export const EscudoPatina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const regla = aparece(t, T.piel);
  return (
    <Lienzo zoom={interpolate(t, [T.menos, T.asi], [1, 1.04])}>
      <g opacity={1 - regla}>
        <Corte
          x={140}
          y={900}
          w={800}
          t={t}
          patina={1}
          ataque={aparece(t, T.pega)}
        />
        <Escudo x={540} y={480} s={1.3} op={aparece(t, T.escudo)} />
        <Texto
          x={540}
          y={1180}
          color={C.white}
          op={aparece(t, T.corrosion)}
          size={40}
        >
          frena la corrosión
        </Texto>
      </g>
      <g opacity={regla}>
        <Estatua x={300} y={760} s={0.75} p={1} t={t} />
        <g transform="translate(560 620)">
          <rect
            width={420}
            height={220}
            rx={22}
            fill={C.card}
            stroke={C.cardBorder}
            strokeWidth={2}
          />
          <rect x={40} y={60} width={340} height={22} fill={PATINA} />
          <rect x={40} y={82} width={340} height={60} fill="#E08850" />
          <text
            x={210}
            y={190}
            textAnchor="middle"
            fill={C.yellow}
            fontFamily={mono}
            fontSize={40}
            fontWeight={700}
            opacity={aparece(t, T.tres)}
          >
            {"< 3 mm"}
          </text>
        </g>
        <Texto
          x={770}
          y={960}
          color={PATINA}
          op={aparece(t, T.sigue)}
          size={36}
        >
          + de 1 siglo
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Cierre: no es óxido que destruye
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pulso = 1 + 0.08 * Math.sin(t * 6) * aparece(t, T.protegiendo);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.05])}>
      <g opacity={aparece(t, T.asi)}>
        <rect x={110} y={560} width={380} height={420} rx={18} fill="#8A3A1E" />
        {new Array(10).fill(0).map((_, k) => (
          <ellipse
            key={k}
            cx={150 + random(`hx${k}`) * 300}
            cy={600 + random(`hy${k}`) * 340}
            rx={14 + random(`hr${k}`) * 20}
            ry={10 + random(`hs${k}`) * 14}
            fill={C.bg}
            opacity={0.85}
          />
        ))}
        {new Array(8).fill(0).map((_, k) => {
          const f = (t * 0.6 + k / 8) % 1;
          return (
            <rect
              key={`c${k}`}
              x={140 + k * 40}
              y={980 + f * 260}
              width={18}
              height={12}
              fill="#B85A2A"
              opacity={1 - f}
              transform={`rotate(${k * 40} ${149 + k * 40} ${986 + f * 260})`}
            />
          );
        })}
        <Texto x={300} y={1310} color="#E8703C" size={34}>
          hierro: se deshace
        </Texto>
      </g>
      <g opacity={aparece(t, T.destruye)}>
        <rect
          x={590}
          y={560}
          width={380}
          height={420}
          rx={18}
          fill={colorCobre(1)}
          stroke="#9CE0C8"
          strokeWidth={6}
        />
        <Escudo
          x={780}
          y={770}
          s={1.3 * pulso}
          op={aparece(t, T.protegiendo - 0.3)}
        />
        <Texto x={780} y={1310} color={PATINA} size={34}>
          cobre: se protege
        </Texto>
      </g>
    </Lienzo>
  );
};
