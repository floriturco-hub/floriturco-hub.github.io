import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Arena, AutoMini, Densidad, Persona } from "./Piezas";

// Instantes clave (s) de public/audio/arenas/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  cine: 2.4,
  imposible: 5.48,
  mezclada: 8.04,
  firme: 10.88,
  vibracion: 14.02,
  liquido: 16.3,
  hundes: 17.42,
  densa: 18.86,
  corcho: 21.32,
  cintura: 23.78,
  peligro: 26.6,
  quieto: 28.9,
  compacta: 31.14,
  cemento: 34.02,
  fuerza: 35.16,
  auto: 37.86,
  sale: 39.54,
  piernas: 42.64,
  atras: 45.22,
  flota: 47.64,
  traga: 49.24,
  retiene: 50.22,
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

const Flash: React.FC<{ readonly t: number; readonly d: number }> = ({
  t,
  d,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: C.white,
      opacity: interpolate(t, [d, d + 0.08, d + 0.45], [0, 0.25, 0], clamp),
    }}
  />
);

const SUP = 1050; // superficie de la arena

// Persona hundida: profundidad en px por debajo de la superficie, recortada por la arena
const Hundido: React.FC<{
  readonly x: number;
  readonly prof: number;
  readonly t: number;
  readonly inclina?: number;
  readonly brazos?: number;
}> = ({ x, prof, t, inclina = 0, brazos = 0 }) => (
  <g>
    <defs>
      <clipPath id={`sobre-${x}`}>
        <rect x={0} y={0} width={1080} height={SUP + 4} />
      </clipPath>
    </defs>
    <g clipPath={`url(#sobre-${x})`}>
      <Persona
        x={x}
        y={SUP + prof}
        s={0.9}
        inclina={inclina}
        brazos={brazos}
        t={t}
      />
    </g>
  </g>
);

const Suelo: React.FC<{
  readonly t: number;
  readonly licua?: number;
  readonly compacta?: number;
}> = ({ t, licua = 0, compacta = 0 }) => (
  <Arena
    x={0}
    y={SUP}
    w={1080}
    h={500}
    licua={licua}
    compacta={compacta}
    t={t}
  />
);

// A. Gancho: no te traga
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cine = aparece(t, T.cine) * (1 - aparece(t, T.imposible + 0.4));
  const prof =
    t < T.cine
      ? interpolate(t, [0, 0.6], [0, 240], suave)
      : interpolate(t, [T.cine, T.cine + 1.2], [240, 560], suave) *
          (1 - aparece(t, T.imposible)) +
        240 * aparece(t, T.imposible);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.mezclada], [1.05, 1])}>
        <Suelo t={t} licua={0.5} />
        <Hundido x={540} prof={prof} t={t} brazos={1} />
        <g opacity={cine}>
          <rect
            x={360}
            y={330}
            width={360}
            height={110}
            rx={14}
            fill="#1A1A2A"
            stroke={C.white}
            strokeWidth={4}
          />
          <Texto x={540} y={405} color={C.white} size={48}>
            CINE
          </Texto>
        </g>
        <g opacity={aparece(t, T.imposible)}>
          <Texto x={540} y={400} color={C.yellow} size={56}>
            hasta la cintura
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={0.6} />
    </>
  );
};

// B. Arena + agua: al moverte se licua
export const Licua: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const licua = interpolate(t, [T.vibracion, T.liquido + 0.6], [0, 1], suave);
  const prof = interpolate(t, [T.hundes - 0.3, T.hundes + 1], [0, 140], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.mezclada, T.densa], [1, 1.04])}>
      <Suelo t={t} licua={licua} />
      <g opacity={aparece(t, T.firme)}>
        <Hundido x={540} prof={prof} t={t} />
      </g>
      <Texto
        x={540}
        y={380}
        color={C.cyan}
        size={44}
        op={aparece(t, T.mezclada) * (1 - aparece(t, T.vibracion))}
      >
        arena + agua
      </Texto>
      <Texto
        x={540}
        y={380}
        color={C.yellow}
        size={44}
        op={aparece(t, T.vibracion)}
      >
        se comporta como líquido
      </Texto>
    </Lienzo>
  );
};

// C. Es el doble de densa: flotas
export const Flota: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cintura = aparece(t, T.cintura);
  return (
    <Lienzo zoom={interpolate(t, [T.densa, T.peligro], [1, 1.04])}>
      <g opacity={1 - cintura}>
        <Densidad x={540} y={760} op={aparece(t, T.densa)} />
        <g opacity={aparece(t, T.corcho)}>
          <rect
            x={160}
            y={1150}
            width={760}
            height={200}
            fill={C.cyan}
            opacity={0.35}
          />
          <rect
            x={480}
            y={1110 + Math.sin(t * 3) * 8}
            width={120}
            height={70}
            rx={14}
            fill="#C8905A"
          />
          <Texto x={540} y={1420} color="#C8905A" size={36}>
            como un corcho
          </Texto>
        </g>
      </g>
      <g opacity={cintura}>
        <Suelo t={t} licua={0.3} />
        <Hundido x={540} prof={240} t={t} />
        <Texto x={540} y={380} color={C.yellow} size={52}>
          hasta la cintura
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. El peligro: se compacta y te atrapa
export const Atrapa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const compacta = interpolate(t, [T.quieto, T.cemento + 0.5], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.peligro, T.sale], [1, 1.04])}>
      <Suelo t={t} compacta={compacta} />
      <Hundido x={420} prof={240} t={t} />
      <g opacity={aparece(t, T.quieto) * (1 - compacta)}>
        {new Array(8).fill(0).map((_, k) => {
          const f = (t * 0.8 + k / 8) % 1;
          return (
            <circle
              key={k}
              cx={300 + k * 50}
              cy={1100 + f * 400}
              r={10}
              fill={C.cyan}
              opacity={1 - f}
            />
          );
        })}
      </g>
      <Texto
        x={540}
        y={380}
        color="#C8A060"
        size={48}
        op={aparece(t, T.cemento)}
      >
        como cemento
      </Texto>
      <g opacity={aparece(t, T.fuerza)}>
        <line
          x1={760}
          y1={900}
          x2={760}
          y2={620}
          stroke={C.red}
          strokeWidth={14}
        />
        <path d="M 730 640 L 760 590 L 790 640 Z" fill={C.red} />
        <AutoMini x={800} y={520} s={0.9} op={aparece(t, T.auto)} />
      </g>
    </Lienzo>
  );
};

// E. Cómo salir: piernas despacio, hacia atrás, flota
export const Escape: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const atras = interpolate(t, [T.atras, T.atras + 1], [0, -62], suave);
  const avanza = interpolate(t, [T.flota, T.flota + 2], [0, -160], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.sale, T.traga], [1, 1.04])}>
      <Suelo t={t} licua={aparece(t, T.piernas) * 0.6} />
      <rect x={0} y={SUP - 30} width={160} height={40} fill="#5A8A4A" />
      <Hundido
        x={560 + avanza}
        prof={interpolate(-atras, [0, 62], [240, 90])}
        t={t}
        inclina={atras}
        brazos={aparece(t, T.piernas)}
      />
      <Texto
        x={540}
        y={380}
        color={C.yellow}
        size={44}
        op={aparece(t, T.piernas) * (1 - aparece(t, T.atras))}
      >
        piernas despacio
      </Texto>
      <Texto x={540} y={380} color={C.cyan} size={44} op={aparece(t, T.atras)}>
        hacia atrás, y flota
      </Texto>
    </Lienzo>
  );
};

// F. Cierre: no te traga, te retiene
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.traga, T.fin + 0.5], [1, 1.05])}>
      <Suelo t={t} compacta={0.6} />
      <Hundido x={540} prof={240} t={t} />
    </Lienzo>
  );
};
