import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/bolsaplastico/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  estiras: 1.88, // estiras
  resiste: 3.70, // resiste
  adelgaza: 5.16, // adelgaza
  durisima: 6.88, // durisima
  final: 8.02, // final
  fabricas: 9.70, // fabricas
  cadenas: 11.80, // cadenas
  espagueti: 14.46, // espagueti
  principio: 15.46, // principio
  debil: 18.56, // debil
  desenredarse: 19.72, // desenredarse
  cuello: 22.50, // cuello
  jalas: 23.78, // jalas
  alineadas: 25.32, // alineadas
  paralelas: 26.60, // paralelas
  durisima2: 31.02, // durisima
  fabricas2: 32.08, // fabricas
  fuertes: 36.04, // fuertes
  porEso: 36.82, // por
  fin: 38.40, // FIN
};

const BOLSA = "#E8ECF4";

// Tira de plástico estirada: e = estirón 0..1, n = profundidad del cuello 0..1, largo del cuello cl
const Tira: React.FC<{ readonly y: number; readonly e: number; readonly n: number; readonly cl?: number; readonly t?: number }> = ({ y, e, n, cl = 0.15 }) => {
  const L = 500 + 300 * e;
  const h = 160;
  const x0 = 540 - L / 2;
  const x1 = 540 + L / 2;
  const w = 80 + cl * L * 0.6;
  const hn = h * (1 - 0.6 * n);
  const d = `M ${x0} ${y - h / 2} L ${540 - w} ${y - h / 2} C ${540 - w * 0.6} ${y - h / 2} ${540 - w * 0.6} ${y - hn / 2} ${540 - w * 0.3} ${y - hn / 2} L ${540 + w * 0.3} ${y - hn / 2} C ${540 + w * 0.6} ${y - hn / 2} ${540 + w * 0.6} ${y - h / 2} ${540 + w} ${y - h / 2} L ${x1} ${y - h / 2} L ${x1} ${y + h / 2} L ${540 + w} ${y + h / 2} C ${540 + w * 0.6} ${y + h / 2} ${540 + w * 0.6} ${y + hn / 2} ${540 + w * 0.3} ${y + hn / 2} L ${540 - w * 0.3} ${y + hn / 2} C ${540 - w * 0.6} ${y + hn / 2} ${540 - w * 0.6} ${y + h / 2} ${540 - w} ${y + h / 2} L ${x0} ${y + h / 2} Z`;
  return (
    <g>
      <path d={d} fill={BOLSA} opacity={0.9} />
      <rect x={x0 - 70} y={y - 100} width={70} height={200} rx={20} fill="#5A6070" />
      <rect x={x1} y={y - 100} width={70} height={200} rx={20} fill="#5A6070" />
    </g>
  );
};

// Curva fuerza-estirón hasta u (0..1)
const Curva: React.FC<{ readonly u: number; readonly y0: number }> = ({ u, y0 }) => {
  const f = (x: number) => (x < 0.15 ? x / 0.15 : x < 0.7 ? 0.8 + 0.05 * Math.sin((x - 0.15) * 12) : 0.8 + Math.pow((x - 0.7) / 0.3, 2) * 1.0);
  const n = Math.max(2, Math.floor(60 * u));
  const pts = new Array(n)
    .fill(0)
    .map((_, i) => {
      const x = (i / 59) * 1;
      return `${i ? "L" : "M"} ${200 + x * 680} ${y0 - f(x) * 160}`;
    })
    .join(" ");
  return (
    <g>
      <line x1={200} y1={y0} x2={900} y2={y0} stroke={C.grey} strokeWidth={3} />
      <line x1={200} y1={y0} x2={200} y2={y0 - 330} stroke={C.grey} strokeWidth={3} />
      <Texto x={160} y={y0 - 340} size={26} color={C.grey}>
        fuerza
      </Texto>
      <Texto x={850} y={y0 + 40} size={26} color={C.grey}>
        estirón
      </Texto>
      <path d={pts} stroke={C.yellow} strokeWidth={6} fill="none" />
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Tira y={1000} e={0.5 + 0.1 * Math.sin(t * 2)} n={1} cl={0.4} />
    <Texto x={880} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta bolsa se endurece?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.estiras], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Primero resiste, luego se adelgaza y de pronto se pone durísima + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.estiras, T.durisima + 0.6], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.estiras, T.cadenas], [1, 1.04])}>
      <Tira y={820} e={u * 0.8} n={interpolate(u, [0.15, 0.4], [0, 1], clamp)} cl={interpolate(u, [0.4, 1], [0, 0.5], clamp)} />
      <Curva u={u} y0={1450} />
      <Texto x={330} y={1060} size={30} color={C.white} op={aparece(t, T.resiste)}>
        resiste
      </Texto>
      <Texto x={560} y={1060} size={30} color={C.cyan} op={aparece(t, T.adelgaza)}>
        cuello
      </Texto>
      <Texto x={820} y={1060} size={30} color={C.yellow} op={aparece(t, T.durisima)}>
        ¡durísima!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cómo lo usan las fábricas?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.cadenas], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Cadenas de polímero: orden 0 = enredadas, 1 = alineadas; e = estirón
const Cadenas: React.FC<{ readonly orden: number; readonly t: number; readonly e?: number }> = ({ orden, t, e = 0 }) => (
  <g>
    {new Array(9).fill(0).map((_, k) => {
      const pts = new Array(30)
        .fill(0)
        .map((_, i) => {
          const x = 150 + i * 27 * (1 + e * 0.1);
          const amp = (1 - orden) * 70;
          const y = 780 + k * 55 + amp * Math.sin(i * 0.7 + k * 1.9 + t * 0.6) + (1 - orden) * 60 * Math.cos(i * 0.31 + k);
          return `${i ? "L" : "M"} ${x} ${y}`;
        })
        .join(" ");
      return <path key={k} d={pts} stroke={[C.cyan, C.yellow, "#5AD08A"][k % 3]} strokeWidth={6} fill="none" strokeLinejoin="round" />;
    })}
  </g>
);

// C. Cadenas larguísimas enredadas como espagueti; al principio solo se estiran un poco
export const Enredo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cadenas, T.debil], [1, 1.04])}>
        <Cadenas orden={0.1 * aparece(t, T.principio)} t={t} e={aparece(t, T.principio)} />
        <Texto x={540} y={640} size={42} color={C.white} op={aparece(t, T.cadenas)}>
          cadenas larguísimas de moléculas
        </Texto>
        <Texto x={540} y={1400} size={40} color={C.yellow} op={aparece(t, T.espagueti)}>
          enredadas como espagueti
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cadenas} color={C.cyan} />
    </>
  );
};

// D. En un punto débil empiezan a desenredarse: la zona se adelgaza, es el cuello
export const Cuello: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = interpolate(t, [T.debil, T.cuello + 0.5], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.debil, T.jalas], [1, 1.04])}>
      <Tira y={1000} e={0.3} n={n} cl={0.1} />
      <circle cx={540} cy={1000} r={150} fill="none" stroke={C.yellow} strokeWidth={5} strokeDasharray="14 10" opacity={aparece(t, T.debil)} />
      <Texto x={540} y={1260} size={36} color={C.white} op={aparece(t, T.desenredarse)}>
        ahí las cadenas se desenredan
      </Texto>
      <Texto x={540} y={1350} size={48} color={C.cyan} op={aparece(t, T.cuello)}>
        el cuello
      </Texto>
    </Lienzo>
  );
};

// E. Más cadenas alineadas, como cuerdas paralelas: la bolsa se vuelve durísima
export const Alineadas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const o = interpolate(t, [T.jalas, T.paralelas + 0.5], [0.1, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.jalas, T.fabricas2], [1, 1.04])}>
        <Cadenas orden={o} t={t} e={1} />
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.alineadas)}>
          las cadenas se alinean
        </Texto>
        <Texto x={540} y={1360} size={38} color={C.cyan} op={aparece(t, T.paralelas)}>
          como cuerdas paralelas
        </Texto>
        <Texto x={540} y={1440} size={48} color={C.yellow} op={aparece(t, T.durisima2)}>
          ¡durísima!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.durisima2} color={C.yellow} />
    </>
  );
};

// F. Las fábricas estiran fibras y películas a propósito para hacerlas más fuertes
export const Fabricas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.fabricas2, T.porEso], [1, 1.04])}>
      {[260, 820].map((x, k) => (
        <g key={x} transform={`translate(${x} 1000) rotate(${t * (k ? 300 : 120)})`}>
          <circle cx={0} cy={0} r={k ? 70 : 150} fill="#5A6070" />
          <line x1={0} y1={-(k ? 70 : 150)} x2={0} y2={k ? 70 : 150} stroke="#8A90A0" strokeWidth={8} />
        </g>
      ))}
      <path d="M 260 850 L 820 930" stroke={BOLSA} strokeWidth={60} opacity={0.8} />
      <path d="M 820 930 L 980 930" stroke={BOLSA} strokeWidth={14} />
      <Texto x={540} y={1250} size={36} color={C.white} op={aparece(t, T.fabricas2)}>
        el segundo rodillo gira más rápido
      </Texto>
      <Texto x={540} y={1340} size={42} color={C.yellow} op={aparece(t, T.fuertes)}>
        estirado = más fuerte
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
