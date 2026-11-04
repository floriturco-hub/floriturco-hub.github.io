import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Olla, Sobre, Trocito } from "./Piezas";

// Instantes clave (s) de public/audio/petazetas/narracion.wav (voz x1,08), sacados con Whisper
export const T = {
  bicarbonato: 2.34,
  fisico: 6.04,
  gas: 8.18,
  fabricarlos: 10.04,
  jarabe: 12.44,
  dioxido: 14.72,
  cuarenta: 16.62,
  enfriar: 19.08,
  soltar: 21.28,
  pedacitos: 22.46,
  trocito: 24.42,
  burbujitas: 25.84,
  paredes: 27.92,
  boca: 30.06,
  saliva: 31.32,
  adelgazan: 32.98,
  revienta: 35.52,
  pop: 37.04,
  cientos: 37.7,
  mito: 41.22,
  falso: 44.84,
  media: 45.6,
  fisica: 49.0,
  fin: 50.9,
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

// Lluvia de explosiones
const Pops: React.FC<{
  readonly t: number;
  readonly op: number;
  readonly n?: number;
}> = ({ t, op, n = 16 }) => (
  <g opacity={op}>
    {new Array(n).fill(0).map((_, k) => {
      const f = (t * 1.6 + random(`pp${k}`)) % 1;
      const x = 140 + random(`px${k}`) * 800;
      const y = 400 + random(`py${k}`) * 900;
      return (
        <g key={k} opacity={1 - f}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => {
            const a = (j / 8) * Math.PI * 2;
            return (
              <line
                key={j}
                x1={x + Math.cos(a) * 10}
                y1={y + Math.sin(a) * 10}
                x2={x + Math.cos(a) * (10 + 50 * f)}
                y2={y + Math.sin(a) * (10 + 50 * f)}
                stroke={j % 2 ? C.yellow : "#E86AA8"}
                strokeWidth={6}
              />
            );
          })}
        </g>
      );
    })}
  </g>
);

// A. Gancho: explota en tu boca
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const flash = interpolate(t, [0.2, 0.28, 0.65], [0, 0.25, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.fabricarlos], [1.06, 1])}>
        <Sobre x={540} y={860} s={1.6} rot={-6} />
        <Pops t={t} op={interpolate(t, [0.15, 0.4], [0, 1], clamp)} n={20} />
        <g opacity={aparece(t, T.bicarbonato)}>
          <rect
            x={140}
            y={300}
            width={800}
            height={180}
            rx={20}
            fill={C.card}
            stroke={C.cardBorder}
            strokeWidth={2}
          />
          <text
            x={540}
            y={370}
            textAnchor="middle"
            fill={C.grey}
            fontFamily={mono}
            fontSize={36}
            fontWeight={700}
          >
            sin bicarbonato
          </text>
          <text
            x={540}
            y={430}
            textAnchor="middle"
            fill={C.grey}
            fontFamily={mono}
            fontSize={36}
            fontWeight={700}
          >
            sin ácidos
          </text>
          <line
            x1={220}
            y1={360}
            x2={860}
            y2={360}
            stroke={C.red}
            strokeWidth={6}
          />
          <line
            x1={300}
            y1={420}
            x2={780}
            y2={420}
            stroke={C.red}
            strokeWidth={6}
          />
        </g>
        <Texto x={540} y={1420} color={C.cyan} size={48} op={aparece(t, T.gas)}>
          gas atrapado a presión
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

// B. Fabricación: jarabe + CO2 a 40 veces la presión del aire
export const Fabrica: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const presion = interpolate(t, [T.dioxido, T.cuarenta + 0.8], [0, 1], suave);
  const rompe = aparece(t, T.pedacitos);
  return (
    <Lienzo zoom={interpolate(t, [T.fabricarlos, T.trocito], [1, 1.04])}>
      <g opacity={1 - rompe}>
        <Olla
          x={540}
          y={900}
          t={t}
          presion={presion}
          gas={aparece(t, T.dioxido)}
        />
        <Texto
          x={540}
          y={420}
          color="#E8A040"
          size={44}
          op={aparece(t, T.jarabe)}
        >
          jarabe de azúcar
        </Texto>
        <Texto
          x={540}
          y={1270}
          color={C.cyan}
          size={40}
          op={aparece(t, T.cuarenta)}
        >
          40 veces la presión del aire
        </Texto>
      </g>
      <g opacity={rompe}>
        {new Array(7).fill(0).map((_, k) => (
          <g
            key={k}
            transform={`translate(${200 + (k % 4) * 220 + Math.floor(k / 4) * 110} ${700 + Math.floor(k / 4) * 300 + rompe * 30 * Math.sin(k)}) rotate(${k * 40})`}
          >
            <Trocito x={0} y={0} s={0.45} t={t} disolver={0} id={`f${k}`} />
          </g>
        ))}
        <Texto x={540} y={1300} color={C.white} size={40}>
          se rompe en pedacitos
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Cada trocito: burbujas de gas en paredes de azúcar
export const Burbujas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.trocito, T.boca], [1, 1.08])}>
      <Trocito x={540} y={880} s={2.4} t={t} disolver={0} id="z" />
      <Texto
        x={540}
        y={400}
        color={C.white}
        size={44}
        op={aparece(t, T.burbujitas)}
      >
        burbujas de gas comprimido
      </Texto>
      <Texto
        x={540}
        y={1400}
        color="#E86AA8"
        size={40}
        op={aparece(t, T.paredes)}
      >
        paredes de azúcar duro
      </Texto>
    </Lienzo>
  );
};

// D. La saliva disuelve, las paredes ceden, ¡pop!
export const Pop: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const disolver = interpolate(t, [T.saliva, T.pop + 0.8], [0, 1], clamp);
  const flash = interpolate(
    t,
    [T.pop, T.pop + 0.08, T.pop + 0.45],
    [0, 0.25, 0],
    clamp,
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.boca, T.mito], [1, 1.05])}>
        <g opacity={aparece(t, T.saliva)}>
          {new Array(10).fill(0).map((_, k) => {
            const f = (t * 0.6 + k / 10) % 1;
            return (
              <circle
                key={k}
                cx={200 + k * 75}
                cy={420 + f * 200}
                r={12}
                fill={C.cyan}
                opacity={(1 - f) * 0.8}
              />
            );
          })}
        </g>
        <Trocito x={540} y={880} s={2.4} t={t} disolver={disolver} id="z" />
        <Texto
          x={540}
          y={400}
          color={C.cyan}
          size={44}
          op={aparece(t, T.saliva) * (1 - aparece(t, T.pop))}
        >
          la saliva disuelve
        </Texto>
        <Texto
          x={540}
          y={420}
          color={C.yellow}
          size={110}
          op={aparece(t, T.pop)}
        >
          ¡POP!
        </Texto>
        <Pops t={t} op={aparece(t, T.cientos)} n={14} />
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

// E. El mito del estómago que explota
export const Mito: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const falso = aparece(t, T.falso);
  return (
    <Lienzo zoom={interpolate(t, [T.mito, T.fisica], [1, 1.04])}>
      <Texto x={540} y={420} color={C.white} size={40} op={aparece(t, T.mito)}>
        peta zetas + gaseosa = ¿boom?
      </Texto>
      <g opacity={falso}>
        <rect
          x={290}
          y={480}
          width={500}
          height={130}
          rx={20}
          fill="none"
          stroke={C.red}
          strokeWidth={10}
          transform="rotate(-8 540 545)"
        />
        <Texto x={540} y={575} color={C.red} size={90}>
          FALSO
        </Texto>
      </g>
      <g opacity={aparece(t, T.mito + 0.4)}>
        <Sobre x={300} y={1020} s={0.8} />
        <Texto
          x={540}
          y={1050}
          color={C.white}
          size={60}
          op={aparece(t, T.media)}
        >
          {"<"}
        </Texto>
        <g transform="translate(780 1020)">
          <rect
            x={-90}
            y={-170}
            width={180}
            height={340}
            rx={30}
            fill="#C83A3A"
          />
          <rect
            x={-90}
            y={0}
            width={180}
            height={170}
            rx={30}
            fill="#5A1A1A"
            opacity={0.5}
          />
          <text
            y={-40}
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily={mono}
            fontSize={30}
            fontWeight={700}
          >
            1/2 lata
          </text>
        </g>
        <Texto
          x={540}
          y={1300}
          color={C.cyan}
          size={36}
          op={aparece(t, T.media)}
        >
          menos gas que media lata
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Cierre
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.fisica, T.fin + 0.5], [1, 1.05])}>
      <Sobre x={540} y={860} s={1.6} rot={4} />
      <Pops t={t} op={1} n={16} />
    </Lienzo>
  );
};
