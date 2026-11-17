import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/nitinol/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  lo: 2.18, // lo
  nudo: 2.88, // nudo
  caliente: 4.18, // caliente
  endereza: 5.08, // endereza
  final: 6.36, // final
  es: 8.54, // es
  nitinol: 8.76, // niti
  niquel: 10.34, // niquel
  titanio: 10.90, // titanio
  frio: 11.82, // frio
  flexible: 13.72, // flexible
  inclinan: 16.60, // inclinan
  calentarlo: 19.06, // calentarlo
  saltan: 20.20, // saltan
  rigida: 21.88, // rigida
  original: 24.04, // original
  porEso: 24.82, // por
  golpe: 25.72, // golpe
  medicos: 26.54, // medicos
  abren: 28.96, // abren
  cuerpo: 31.18, // cuerpo
  asi: 31.84, // asi
  fin: 33.70, // FIN
};

const METAL = "#C8C8D8";

// Alambre: k=0 nudo, k=1 recto
const Alambre: React.FC<{ readonly k: number; readonly cx?: number; readonly cy?: number; readonly s?: number }> = ({
  k,
  cx = 540,
  cy = 960,
  s = 1,
}) => {
  const pts = new Array(81).fill(0).map((_, i) => {
    const v = i / 80;
    const rx = 240 + 600 * v;
    const ry = 960;
    let nx = rx;
    let ny = ry + Math.sin(v * 18) * 18;
    if (v > 0.3 && v < 0.7) {
      const u = (v - 0.3) / 0.4;
      nx = 420 + 240 * u + 200 * Math.sin(2 * Math.PI * u);
      ny = 960 - 160 * (1 - Math.cos(2 * Math.PI * u));
    }
    const x = nx + (rx - nx) * k;
    const y = ny + (ry - ny) * k;
    return `${i ? "L" : "M"} ${cx + (x - 540) * s} ${cy + (y - 960) * s}`;
  });
  return (
    <path d={pts.join(" ")} stroke={METAL} strokeWidth={22 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  );
};

// Red de átomos: corte = inclinación (0 cuadrada, 1 inclinada en zigzag), calor = color
const Red: React.FC<{ readonly x: number; readonly y: number; readonly corte: number; readonly calor: number; readonly t: number }> = ({
  x,
  y,
  corte,
  calor,
  t,
}) => (
  <g transform={`translate(${x} ${y})`}>
    {new Array(6).fill(0).map((_, r) =>
      new Array(6).fill(0).map((__, c) => {
        const zig = (r % 4 < 2 ? r % 4 : 4 - (r % 4)) * 34 * corte;
        const vib = Math.sin(t * 20 + r + c) * 4 * calor;
        return (
          <circle
            key={`${r}${c}`}
            cx={-250 + c * 100 + zig + vib}
            cy={-250 + r * 100}
            r={26}
            fill={calor > 0.5 ? C.orange : C.cyan}
          />
        );
      }),
    )}
  </g>
);

// Vaso de agua caliente
const Vaso: React.FC<{ readonly x: number; readonly y: number; readonly op: number; readonly t: number }> = ({ x, y, op, t }) => (
  <g opacity={op} transform={`translate(${x} ${y})`}>
    <path d="M -230 -120 L -190 200 L 190 200 L 230 -120 Z" fill="#2A5AA8" opacity={0.55} stroke={C.white} strokeWidth={6} />
    {[0, 1, 2].map((k) => (
      <path
        key={k}
        d={`M ${-80 + k * 80} ${-160 - ((t * 40 + k * 30) % 60)} q 20 -30 0 -60 q -20 -30 0 -60`}
        stroke={C.grey}
        strokeWidth={6}
        fill="none"
        opacity={0.6}
      />
    ))}
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Alambre k={0} />
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo recuerda su forma este metal?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.lo], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Lo doblas en un nudo, lo metes en agua caliente y se endereza solo + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const k = interpolate(t, [T.endereza, T.endereza + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.lo, T.es], [1, 1.05])}>
        <Vaso x={540} y={1000} op={aparece(t, T.caliente)} t={t} />
        <Alambre k={k} cy={interpolate(t, [T.caliente, T.caliente + 0.5], [840, 960], clamp)} s={0.8} />
        <g opacity={aparece(t, T.final)}>
          <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
          <rect
            x={190}
            y={1330}
            width={700 * interpolate(t, [T.final, T.es], [0, 1], clamp)}
            height={24}
            rx={12}
            fill={C.yellow}
          />
          <Texto x={540} y={1430} color={C.white} size={38}>
            dónde lo usan los médicos: al final
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.endereza} color={C.orange} />
    </>
  );
};

// C. Es nitinol, una mezcla de níquel y titanio
export const Nitinol: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const Elem: React.FC<{ readonly x: number; readonly s: string; readonly n: string; readonly op: number }> = ({ x, s, n, op }) => (
    <g opacity={op}>
      <rect x={x - 130} y={720} width={260} height={280} rx={24} fill={C.card} stroke={METAL} strokeWidth={6} />
      <Texto x={x} y={890} size={120} color={METAL}>
        {s}
      </Texto>
      <Texto x={x} y={960} size={32} color={C.grey}>
        {n}
      </Texto>
    </g>
  );
  return (
    <Lienzo zoom={interpolate(t, [T.es, T.frio], [1, 1.04])}>
      <Texto x={540} y={540} size={70} color={C.yellow} op={aparece(t, T.nitinol)}>
        NITINOL
      </Texto>
      <Elem x={330} s="Ni" n="níquel" op={aparece(t, T.niquel)} />
      <Texto x={540} y={890} size={80} color={C.white} op={aparece(t, T.titanio)}>
        +
      </Texto>
      <Elem x={750} s="Ti" n="titanio" op={aparece(t, T.titanio)} />
      <g opacity={aparece(t, T.titanio + 0.6)}>
        <Alambre k={1} cy={1180} s={0.8} />
      </g>
    </Lienzo>
  );
};

// D. En frío, estructura flexible: los átomos solo se inclinan
export const Frio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const corte = interpolate(t, [T.inclinan - 0.3, T.inclinan + 0.6], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.frio, T.calentarlo], [1, 1.04])}>
      <Texto x={540} y={470} size={44} color={C.cyan} op={aparece(t, T.frio)}>
        en frío
      </Texto>
      <Red x={520} y={860} corte={corte} calor={0} t={t} />
      <Texto x={540} y={1290} size={40} color={C.white} op={aparece(t, T.flexible)}>
        flexible: se inclinan
      </Texto>
      <Texto x={540} y={1350} size={34} color={C.grey} op={aparece(t, T.inclinan + 0.5)}>
        sin romperse
      </Texto>
    </Lienzo>
  );
};

// E. Al calentarlo, saltan a una estructura rígida con la forma original
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const salto = interpolate(t, [T.saltan, T.saltan + 0.25], [1, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.calentarlo, T.porEso], [1, 1.04])}>
        <Texto x={540} y={470} size={44} color={C.orange} op={aparece(t, T.calentarlo)}>
          en caliente
        </Texto>
        <Red x={540} y={860} corte={salto} calor={aparece(t, T.calentarlo)} t={t} />
        <Texto x={540} y={1290} size={40} color={C.orange} op={aparece(t, T.rigida)}>
          rígida
        </Texto>
        <Texto x={540} y={1350} size={34} color={C.white} op={aparece(t, T.original)}>
          = la forma original
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.saltan} color={C.orange} />
    </>
  );
};

// F. Por eso vuelve de golpe
export const Golpe: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const k = interpolate(t, [T.golpe - 0.2, T.golpe + 0.15], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.porEso, T.medicos], [1.04, 1])}>
        <Alambre k={k} />
        <Texto x={540} y={1250} size={50} color={C.orange} op={aparece(t, T.golpe)}>
          ¡de golpe!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.golpe} color={C.orange} />
    </>
  );
};

// Stent: malla en rombos dentro de una arteria; a = apertura 0-1
const Stent: React.FC<{ readonly a: number }> = ({ a }) => {
  const h = 60 + 140 * a;
  const n = 7;
  return (
    <g>
      <rect x={100} y={720} width={880} height={50} fill={C.red} opacity={0.8} />
      <rect x={100} y={1150} width={880} height={50} fill={C.red} opacity={0.8} />
      <rect x={100} y={770} width={880} height={380} fill="#5A1A2A" opacity={0.6} />
      {new Array(n).fill(0).map((_, k) => {
        const x = 220 + k * 92;
        return (
          <path
            key={k}
            d={`M ${x} 960 L ${x + 46} ${960 - h} L ${x + 92} 960 L ${x + 46} ${960 + h} Z`}
            stroke={METAL}
            strokeWidth={10}
            fill="none"
          />
        );
      })}
    </g>
  );
};

// G. Los médicos lo usan en stents que se abren solos con el calor del cuerpo
export const Medicos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const a = interpolate(t, [T.abren, T.abren + 0.8], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.medicos, T.asi], [1, 1.04])}>
        <Texto x={540} y={500} size={44} color={C.white} op={aparece(t, T.medicos)}>
          stent en una arteria
        </Texto>
        <Stent a={a} />
        <Texto x={540} y={1340} size={40} color={C.orange} op={aparece(t, T.cuerpo)}>
          calor del cuerpo: 37 °C
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.abren} color={C.white} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  const k = interpolate(t, [T.asi, T.asi + 0.6], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Alambre k={k} />
      <Texto x={860} y={640} size={130} color={C.yellow} op={q * (1 - k)}>
        ?
      </Texto>
    </Lienzo>
  );
};
