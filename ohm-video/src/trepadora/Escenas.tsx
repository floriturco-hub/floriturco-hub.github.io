import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/trepadora/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  no: 2.0,
  resorte: 4.68,
  final: 6.36,
  la: 9.08,
  circulos: 10.44,
  algunas: 13.52,
  oscuras: 15.36,
  cuando: 18.22,
  toca: 19.04,
  lento: 21.0,
  rapido: 22.42,
  asi: 23.56,
  abraza: 24.84,
  su: 27.28,
  resto: 28.88,
  resorte2: 30.58,
  mitad: 31.72,
  otro: 33.1,
  viento: 34.24,
  rompe: 36.1,
  porEso: 37.04,
  fin: 39.34,
};

const VERDE = "#5AC878";
const VERDE_OSC = "#3A8A4A";
const POSTE = "#8A6A4A";

// Hoja
const Hoja: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot: number }> = ({ x, y, s, rot }) => (
  <path d="M 0 0 Q 30 -30 70 0 Q 30 30 0 0 Z" transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} fill={VERDE} />
);

// Zarcillo enrollado en un poste vertical (hélice), progreso 0..1
const Enrollado: React.FC<{ readonly x: number; readonly y0: number; readonly y1: number; readonly prog: number; readonly vueltas?: number }> = ({
  x,
  y0,
  y1,
  prog,
  vueltas = 5,
}) => {
  const n = 80;
  const pts = new Array(Math.max(2, Math.floor(n * prog)))
    .fill(0)
    .map((_, k) => {
      const u = k / n;
      return `${k === 0 ? "M" : "L"} ${x + Math.sin(u * vueltas * Math.PI * 2) * 60} ${y0 + (y1 - y0) * u}`;
    })
    .join(" ");
  return <path d={pts} stroke={VERDE} strokeWidth={14} fill="none" strokeLinecap="round" />;
};

// Imagen del gancho y del cierre: planta enrollada en un poste
const PlantaPoste: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <rect x={620} y={440} width={50} height={1000} rx={10} fill={POSTE} />
    <path d="M 240 1440 Q 300 1100 500 1000 Q 600 950 630 900" stroke={VERDE_OSC} strokeWidth={18} fill="none" />
    <Enrollado x={645} y0={900} y1={520} prog={1} />
    <Hoja x={380} y={1150} s={1.4} rot={-30} />
    <Hoja x={470} y={1030} s={1.2} rot={200} />
    <Texto x={300} y={700} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo encuentra el poste esta planta?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.no], [1.12, 1])}>
        <PlantaPoste q={interpolate(t, [0.6, 0.9], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.74} color={VERDE} />
    </>
  );
};

// B. No tiene ojos y aun así lo alcanza y se enrolla + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const crece = interpolate(t, [T.no, T.resorte], [0.2, 1], suave);
  const enrolla = interpolate(t, [T.resorte - 0.4, T.final], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.no, T.la], [1, 1.05])}>
      <rect x={760} y={500} width={46} height={800} rx={10} fill={POSTE} />
      <path d={`M 200 1300 Q 400 ${1300 - 300 * crece} ${200 + 560 * crece} ${1300 - 420 * crece}`} stroke={VERDE_OSC} strokeWidth={16} fill="none" />
      <g opacity={enrolla}>
        <Enrollado x={783} y0={880} y1={620} prog={enrolla} vueltas={3} />
      </g>
      <g transform="translate(300 640)" opacity={aparece(t, T.no)}>
        <ellipse rx={70} ry={40} fill="none" stroke={C.grey} strokeWidth={8} />
        <line x1={-90} y1={-50} x2={90} y2={50} stroke={C.red} strokeWidth={10} />
      </g>
      <Texto x={300} y={740} size={30} color={C.grey} op={aparece(t, T.no)}>
        sin ojos
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1380} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1380}
          width={700 * interpolate(t, [T.final, T.la], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1480} color={C.white} size={38}>
          su truco para no soltarse: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. La punta crece girando en círculos, como si buscara a ciegas
export const Circulos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const a = (t - T.la) * 2;
  const r = 140 + (t - T.la) * 20;
  return (
    <Lienzo zoom={interpolate(t, [T.la, T.algunas], [1, 1.04])}>
      {/* rastro de la punta (vista desde arriba) */}
      <path
        d={new Array(60)
          .fill(0)
          .map((_, k) => {
            const aa = a - k * 0.1;
            const rr = Math.max(40, r - k * 3);
            return `${k === 0 ? "M" : "L"} ${540 + Math.cos(aa) * rr} ${820 + Math.sin(aa) * rr}`;
          })
          .join(" ")}
        stroke={VERDE}
        strokeWidth={6}
        fill="none"
        opacity={0.5}
      />
      <circle cx={540} cy={820} r={30} fill={VERDE_OSC} />
      <circle cx={540 + Math.cos(a) * r} cy={820 + Math.sin(a) * r} r={22} fill={VERDE} />
      <Texto x={540} y={1200} size={38} color={VERDE} op={aparece(t, T.circulos)}>
        gira en círculos
      </Texto>
      <Texto x={540} y={1270} size={34} color={C.grey} op={aparece(t, T.circulos + 1.2)}>
        buscando a ciegas
      </Texto>
    </Lienzo>
  );
};

// D. Algunas crecen hacia las zonas más oscuras, como la sombra de un poste
export const Sombra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const giro = interpolate(t, [T.oscuras, T.cuando], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.algunas, T.cuando], [1, 1.04])}>
      <circle cx={160} cy={500} r={70} fill={C.yellow} />
      <path d="M 760 500 L 1080 1300 L 1080 500 Z" fill="#000000" opacity={0.35} />
      <rect x={740} y={500} width={46} height={800} rx={10} fill={POSTE} />
      <path d={`M 360 1300 Q ${360 + 60 * giro} 1000 ${360 + 300 * giro} ${800 - 60 * giro}`} stroke={VERDE_OSC} strokeWidth={16} fill="none" />
      <circle cx={360 + 300 * giro} cy={800 - 60 * giro} r={18} fill={VERDE} />
      <Texto x={540} y={1400} size={38} color={C.white} op={aparece(t, T.oscuras)}>
        crece hacia la sombra del poste
      </Texto>
    </Lienzo>
  );
};

// E. El lado que toca crece más lento y el de afuera más rápido
export const Toca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const curva = interpolate(t, [T.lento, T.asi], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.cuando, T.asi], [1, 1.04])}>
      <circle cx={760} cy={820} r={70} fill={POSTE} />
      {/* zarcillo en corte: dos filas de células */}
      {new Array(8).fill(0).map((_, k) => {
        const a = (k / 8) * curva * 1.6;
        const cx = 760 + Math.cos(Math.PI + a) * 130;
        const cy = 820 - Math.sin(Math.PI + a) * 130 - (1 - curva) * 0;
        const x = interpolate(curva, [0, 1], [180 + k * 70, cx]);
        const y = interpolate(curva, [0, 1], [820, cy]);
        return (
          <g key={k}>
            <rect x={x - 28} y={y - 40} width={56} height={30} rx={8} fill={VERDE} opacity={0.9} />
            <rect x={x - 22} y={y + 4} width={44 - 10 * curva} height={24} rx={8} fill={VERDE_OSC} />
          </g>
        );
      })}
      <Texto x={540} y={1100} size={36} color={VERDE_OSC} op={aparece(t, T.lento)}>
        lado que toca: crece lento
      </Texto>
      <Texto x={540} y={1170} size={36} color={VERDE} op={aparece(t, T.rapido)}>
        lado de afuera: crece rápido
      </Texto>
    </Lienzo>
  );
};

// F. Así se curva y lo abraza, en minutos u horas
export const Abraza: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.asi, T.su], [1, 1.04])}>
        <rect x={515} y={440} width={50} height={1000} rx={10} fill={POSTE} />
        <path d="M 160 1300 Q 400 1100 520 1000" stroke={VERDE_OSC} strokeWidth={16} fill="none" />
        <Enrollado x={540} y0={1000} y1={600} prog={interpolate(t, [T.asi, T.abraza + 0.8], [0.05, 1], suave)} vueltas={4} />
        <Texto x={540} y={1450} size={38} color={VERDE} op={aparece(t, T.abraza)}>
          lo abraza en minutos u horas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.abraza} color={VERDE} />
    </>
  );
};

// Resorte con perversión: mitad enroscado a un lado y mitad al otro; estira = alargamiento
const Resorte: React.FC<{ readonly x0: number; readonly x1: number; readonly y: number; readonly t: number; readonly estira?: number; readonly marca?: number }> = ({
  x0,
  x1,
  y,
  estira = 0,
  marca = 0,
}) => {
  const n = 120;
  const L = (x1 - x0) * (1 + estira * 0.25);
  const d = new Array(n + 1)
    .fill(0)
    .map((_, k) => {
      const u = k / n;
      const fase = u < 0.5 ? u : 1 - u;
      const amp = 70 * (1 - estira * 0.4) * Math.min(1, Math.abs(u - 0.5) * 8);
      return `${k === 0 ? "M" : "L"} ${x0 + u * L} ${y + Math.sin(fase * 14 * Math.PI) * amp * (u < 0.5 ? 1 : -1)}`;
    })
    .join(" ");
  return (
    <g>
      <path d={d} stroke={VERDE} strokeWidth={12} fill="none" strokeLinecap="round" />
      <circle cx={x0 + L / 2} cy={y} r={26} fill="none" stroke={C.yellow} strokeWidth={6} opacity={marca} />
    </g>
  );
};

// G. El resto del zarcillo se enrosca como un resorte, mitad a un lado y mitad al otro
export const Muelle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.su, T.viento], [1, 1.04])}>
      <rect x={60} y={560} width={60} height={500} rx={10} fill={POSTE} />
      <rect x={960} y={560} width={60} height={500} rx={10} fill="#4A6A3A" />
      <g opacity={aparece(t, T.resto - 0.3)}>
        <Resorte x0={120} x1={960} y={810} t={t} marca={aparece(t, T.mitad)} />
      </g>
      <Texto x={330} y={1060} size={32} color={VERDE} op={aparece(t, T.mitad)}>
        mitad hacia un lado
      </Texto>
      <Texto x={750} y={1060} size={32} color={VERDE} op={aparece(t, T.otro)}>
        mitad hacia el otro
      </Texto>
      <Texto x={540} y={580} size={36} color={C.white} op={aparece(t, T.resorte2)}>
        se enrosca como un resorte
      </Texto>
    </Lienzo>
  );
};

// H. Si el viento tira, se estira y no se rompe
export const Viento: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const estira = aparece(t, T.viento) * (0.5 + 0.5 * Math.sin((t - T.viento) * 4));
  return (
    <Lienzo zoom={interpolate(t, [T.viento, T.porEso], [1, 1.04])}>
      <rect x={60} y={560} width={60} height={500} rx={10} fill={POSTE} />
      <Resorte x0={120} x1={760} y={810} t={t} estira={estira} />
      {[0, 1, 2].map((k) => {
        const u = (t * 0.9 + k / 3) % 1;
        return (
          <path key={k} d={`M ${700 + u * 300} ${640 + k * 120} q 40 -20 80 0`} stroke={C.white} strokeWidth={6} fill="none" opacity={(1 - u) * 0.7} />
        );
      })}
      <Texto x={540} y={1150} size={40} color={C.yellow} op={aparece(t, T.rompe)}>
        se estira y no se rompe
      </Texto>
    </Lienzo>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <PlantaPoste q={interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp)} />
    </Lienzo>
  );
};
