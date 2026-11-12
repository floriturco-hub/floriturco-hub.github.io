import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Bolsa, Lata, Termometro, Vapor } from "./Piezas";

// Instantes clave (s) de public/audio/lata/narracion.wav (voz x1,08), sacados con Whisper
export const T = {
  sola: 1.18,
  fuego: 1.78,
  boton: 4.62,
  caliente: 7.68,
  secreto: 9.58,
  compartimentos: 12.0,
  arriba: 13.98,
  abajo: 15.52,
  cal: 19.66,
  oxido: 20.56,
  presionar: 21.82,
  punzon: 23.08,
  agua: 24.88,
  reaccionan: 26.12,
  calor: 29.26,
  obra: 30.98,
  atraviesa: 34.4,
  sesenta: 37.52,
  hervir: 39.94,
  militares: 43.0,
  magnesio: 46.32,
  salada: 48.42,
  oxida: 49.94,
  quimica: 53.3,
  fin: 54.9,
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

const Tachado: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly texto: string;
  readonly op: number;
}> = ({ x, y, texto, op }) => (
  <g opacity={op}>
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={C.grey}
      fontFamily={mono}
      fontSize={40}
      fontWeight={700}
    >
      {texto}
    </text>
    <line
      x1={x - 120}
      y1={y - 14}
      x2={x + 120}
      y2={y - 14}
      stroke={C.red}
      strokeWidth={8}
    />
  </g>
);

// A. Gancho: la lata se calienta sola
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const calor = interpolate(t, [0.2, 1.4], [0, 1], suave);
  const flash = interpolate(t, [0.2, 0.28, 0.65], [0, 0.25, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.secreto], [1.05, 1])}>
        <Vapor x={540} y={560} t={t} op={calor} ancho={220} />
        <Lata
          x={540}
          y={900}
          s={1.25}
          corte={0}
          roto={0}
          calor={calor}
          boton={interpolate(t, [0, 0.25], [0, 1], clamp)}
          t={t}
        />
        <Tachado x={250} y={420} texto="fuego" op={aparece(t, T.fuego)} />
        <Tachado
          x={540}
          y={360}
          texto="enchufe"
          op={aparece(t, T.fuego + 0.5)}
        />
        <Tachado
          x={830}
          y={420}
          texto="microondas"
          op={aparece(t, T.fuego + 1)}
        />
        <Texto
          x={540}
          y={1380}
          color={C.orange}
          size={52}
          op={aparece(t, T.caliente)}
        >
          ¡caliente!
        </Texto>
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

// B. Por dentro: dos compartimentos
export const Corte: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.secreto, T.presionar], [1, 1.05])}>
      <Lata
        x={540}
        y={900}
        s={1.35}
        corte={interpolate(t, [T.secreto, T.secreto + 1], [0, 1], suave)}
        roto={0}
        calor={0}
        boton={0}
        t={t}
      />
      <g fontFamily={mono} fontWeight={700} fontSize={34}>
        <g opacity={aparece(t, T.arriba)}>
          <line
            x1={760}
            y1={620}
            x2={860}
            y2={560}
            stroke="#C8803A"
            strokeWidth={4}
          />
          <text x={870} y={555} fill="#C8803A">
            bebida
          </text>
        </g>
        <g opacity={aparece(t, T.abajo)}>
          <line
            x1={620}
            y1={740}
            x2={860}
            y2={700}
            stroke={C.cyan}
            strokeWidth={4}
          />
          <text x={870} y={705} fill={C.cyan}>
            agua
          </text>
        </g>
        <g opacity={aparece(t, T.cal)}>
          <line
            x1={600}
            y1={1050}
            x2={860}
            y2={1100}
            stroke={C.white}
            strokeWidth={4}
          />
          <text x={870} y={1105} fill={C.white}>
            cal viva
          </text>
          <text
            x={870}
            y={1145}
            fill={C.grey}
            fontSize={28}
            opacity={aparece(t, T.oxido)}
          >
            CaO
          </text>
        </g>
      </g>
    </Lienzo>
  );
};

// C. El botón rompe la membrana: agua + cal = calor
export const Reaccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const boton = interpolate(t, [T.presionar, T.presionar + 0.5], [0, 1], suave);
  const roto = aparece(t, T.punzon + 0.6);
  const calor = interpolate(t, [T.reaccionan, T.calor + 1], [0, 1], clamp);
  const flash = interpolate(
    t,
    [T.calor, T.calor + 0.08, T.calor + 0.45],
    [0, 0.2, 0],
    clamp,
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.presionar, T.obra], [1, 1.05])}>
        <Lata
          x={540}
          y={900}
          s={1.35}
          corte={1}
          roto={roto}
          calor={calor}
          boton={boton}
          t={t}
        />
        <g opacity={aparece(t, T.reaccionan)}>
          <rect
            x={150}
            y={330}
            width={780}
            height={110}
            rx={20}
            fill={C.card}
            stroke={C.cardBorder}
            strokeWidth={2}
          />
          <Texto x={540} y={400} color={C.yellow} size={40}>
            CaO + H2O = Ca(OH)2 + calor
          </Texto>
        </g>
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

// D. Como la cal que humea en una obra
export const Obra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.obra, T.atraviesa], [1, 1.05])}>
      <path d="M 200 1200 Q 540 760 880 1200 Z" fill="#F0ECE0" />
      <Vapor x={540} y={960} t={t} op={1} ancho={360} />
      <path
        d="M 820 600 L 720 820"
        stroke={C.cyan}
        strokeWidth={14}
        strokeLinecap="round"
        opacity={0.8}
      />
      <Texto x={540} y={1320} color={C.white} size={40}>
        cal mojada en una obra
      </Texto>
    </Lienzo>
  );
};

// E. Calienta hasta ~60 °C
export const Sesenta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const grados = interpolate(
    t,
    [T.atraviesa, T.sesenta + 0.6],
    [20, 60],
    clamp,
  );
  return (
    <Lienzo zoom={interpolate(t, [T.atraviesa, T.militares], [1, 1.04])}>
      <Lata
        x={420}
        y={900}
        s={1.2}
        corte={1}
        roto={1}
        calor={1}
        boton={1}
        t={t}
      />
      <Vapor x={420} y={540} t={t} op={grados > 45 ? 1 : 0.4} ancho={200} />
      <Termometro x={850} y={900} grados={grados} op={1} />
      <Texto
        x={540}
        y={1380}
        color={C.grey}
        size={40}
        op={aparece(t, T.hervir)}
      >
        no hierve, pero quema
      </Texto>
    </Lienzo>
  );
};

// F. Raciones militares: magnesio + agua salada
export const Militar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const agua = interpolate(t, [T.salada, T.salada + 1], [0, 1], suave);
  const calor = interpolate(t, [T.oxida, T.oxida + 1.4], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.militares, T.quimica], [1, 1.05])}>
      <Bolsa x={540} y={950} s={1.25} agua={agua} calor={calor} t={t} />
      <g opacity={aparece(t, T.salada) * (1 - agua * 0.8)}>
        <path
          d="M 860 380 L 700 600"
          stroke={C.cyan}
          strokeWidth={16}
          strokeLinecap="round"
        />
        <Texto x={880} y={360} color={C.cyan} size={32}>
          agua salada
        </Texto>
      </g>
      <Texto
        x={540}
        y={330}
        color={C.white}
        size={44}
        op={aparece(t, T.militares)}
      >
        ración militar
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: química en tu bolsillo
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.quimica, T.fin + 0.5], [1, 1.05])}>
      <Vapor x={540} y={560} t={t} op={1} ancho={220} />
      <Lata
        x={540}
        y={900}
        s={1.25}
        corte={0}
        roto={1}
        calor={1}
        boton={1}
        t={t}
      />
    </Lienzo>
  );
};
