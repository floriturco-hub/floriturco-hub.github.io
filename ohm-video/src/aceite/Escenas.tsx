import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/aceite/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  tormentas: 2.36, // tormentas
  marineros: 3.18, // marineros
  tiraban: 3.68, // tiraban
  calmaba: 6.68, // calmaba
  final: 7.84, // final
  extiende: 11.24, // extiende
  finisima: 12.30, // finisima
  frena: 14.66, // frena
  arrugas: 16.40, // arrugas
  viento: 17.18, // viento
  agarrar: 21.16, // agarrar
  empujarla: 22.16, // empujarla
  sin: 23.12, // sin
  resbala: 24.16, // resbala
  crecen: 25.38, // crecen
  crestas: 26.54, // crestas
  echo: 29.04, // echo
  estanque: 30.82, // estanque
  media: 32.54, // media
  asi: 34.24, // asi
  fin: 36.20, // FIN
};

const MAR = "#1A4A7A";
const ACEITE = "#E0C060";

// Superficie del mar: olas grandes (A) + arrugas pequeñas (r); calma: tramo [x0,x1] sin arrugas ni espuma
const Mar: React.FC<{ readonly y: number; readonly t: number; readonly A: number; readonly r: number; readonly calma?: [number, number, number]; readonly espuma?: number }> = ({
  y,
  t,
  A,
  r,
  calma,
  espuma = 0,
}) => {
  const f = (x: number) => {
    const k = calma && x > calma[0] && x < calma[1] ? 1 - calma[2] : 1;
    return y + A * (0.6 + 0.4 * k) * Math.sin(x / 90 - t * 2) + r * k * Math.sin(x / 9 + t * 9) * Math.sin(x / 31 - t * 3);
  };
  const pts = new Array(109).fill(0).map((_, i) => `L ${i * 10} ${f(i * 10)}`);
  return (
    <g>
      <path d={`M 0 1920 L 0 ${f(0)} ${pts.join(" ")} L 1080 1920 Z`} fill={MAR} />
      {espuma > 0
        ? new Array(6).fill(0).map((_, k) => {
            const x = ((k * 190 + t * 120) % 1200) - 60;
            const fuera = !calma || x < calma[0] || x > calma[1];
            return fuera ? <ellipse key={k} cx={x} cy={f(x) - 6} rx={40} ry={12} fill="#fff" opacity={espuma * 0.8} /> : null;
          })
        : null}
    </g>
  );
};

const Barco: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${4 * Math.sin(t * 2)}) scale(${s})`}>
    <path d="M -160 0 L 160 0 L 120 70 L -120 70 Z" fill="#6A4A2A" />
    <line x1={0} y1={0} x2={0} y2={-260} stroke="#4A3A2A" strokeWidth={12} />
    <path d="M 8 -250 L 130 -60 L 8 -60 Z" fill="#E8E0D0" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Barco x={540} y={920} t={t} />
    <Mar y={1000} t={t} A={50} r={14} calma={[300, 780, 0.9]} espuma={1} />
    <ellipse cx={540} cy={1010} rx={260} ry={18} fill={ACEITE} opacity={0.35} />
    <Texto x={540} y={560} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo calma el aceite estas olas?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tormentas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Los marineros tiraban aceite al mar y el agua se calmaba + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const calma = interpolate(t, [T.tiraban + 0.5, T.calmaba + 0.5], [0, 0.9], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.tormentas, T.extiende], [1, 1.04])}>
      {new Array(5).fill(0).map((_, k) => (
        <line key={k} x1={100 + k * 220 - ((t * 400) % 100)} y1={400} x2={60 + k * 220 - ((t * 400) % 100)} y2={560} stroke="#8AA8C8" strokeWidth={4} opacity={0.5 * aparece(t, T.tormentas)} />
      ))}
      <Barco x={540} y={920} t={t} />
      <g opacity={aparece(t, T.tiraban)}>
        <rect x={620} y={800} width={60} height={80} rx={10} fill="#8A5A2A" transform="rotate(40 650 840)" />
        <path d={`M 690 850 Q 720 900 ${720 + 10 * Math.sin(t * 5)} 990`} stroke={ACEITE} strokeWidth={10} fill="none" />
      </g>
      <Mar y={1000} t={t} A={50} r={14} calma={[300, 780, calma]} espuma={1} />
      <ellipse cx={540} cy={1010} rx={260 * calma} ry={18} fill={ACEITE} opacity={0.35} />
      <Texto x={540} y={1300} size={40} color={C.white} op={aparece(t, T.marineros)}>
        marineros en la tormenta
      </Texto>
      <Texto x={540} y={1380} size={42} color={ACEITE} op={aparece(t, T.calmaba)}>
        ¡el agua se calma!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          el experimento de Franklin: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.extiende], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. El aceite se extiende en una capa finísima
export const Capa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const r = interpolate(t, [T.extiende, T.frena], [20, 380], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.extiende, T.frena], [1, 1.04])}>
      <rect x={90} y={560} width={900} height={760} rx={30} fill={MAR} />
      <circle cx={540} cy={940} r={r} fill={ACEITE} opacity={0.45} />
      <circle cx={540} cy={940} r={r} fill="none" stroke={ACEITE} strokeWidth={4} />
      <Texto x={540} y={1420} size={40} color={ACEITE} op={aparece(t, T.finisima)}>
        una capa finísima
      </Texto>
    </Lienzo>
  );
};

// D. La capa frena las arrugas diminutas que levanta el viento; con ellas el viento agarra el agua
export const Arrugas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const agarra = aparece(t, T.agarrar);
  return (
    <Lienzo zoom={interpolate(t, [T.frena, T.sin], [1, 1.04])}>
      <Texto x={300} y={600} size={36} color={C.white}>
        sin aceite
      </Texto>
      <Texto x={780} y={600} size={36} color={ACEITE}>
        con aceite
      </Texto>
      <Mar y={1000} t={t} A={10} r={22} calma={[560, 1080, aparece(t, T.frena) * 0.95]} />
      <rect x={560} y={960} width={520} height={14} fill={ACEITE} opacity={0.6 * aparece(t, T.frena)} />
      <line x1={540} y1={680} x2={540} y2={1300} stroke={C.grey} strokeWidth={3} strokeDasharray="12 10" />
      <Texto x={300} y={1200} size={36} color={C.cyan} op={aparece(t, T.arrugas)}>
        arrugas diminutas
      </Texto>
      <g opacity={aparece(t, T.viento)}>
        {[0, 1, 2].map((k) => {
          const u = (t * 0.9 + k / 3) % 1;
          return (
            <g key={k}>
              <path d={`M ${40 + u * 400} ${820 + k * 40} l 80 0`} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={1 - u} />
              <path d={`M ${580 + u * 400} ${820 + k * 40} l 80 0`} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={1 - u} />
            </g>
          );
        })}
        <Texto x={540} y={760} size={34} color={C.white}>
          viento →
        </Texto>
      </g>
      <g opacity={agarra}>
        {[120, 220, 320, 420].map((x) => (
          <path key={x} d={`M ${x} 940 l 30 -30`} stroke={C.yellow} strokeWidth={6} />
        ))}
        <Texto x={300} y={1280} size={36} color={C.yellow}>
          el viento las agarra
        </Texto>
      </g>
      <Texto x={540} y={1380} size={36} color={C.white} op={aparece(t, T.empujarla)}>
        …y empuja el agua
      </Texto>
    </Lienzo>
  );
};

// E. Sin arrugas el viento resbala: olas más pequeñas y sin espuma
export const Resbala: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const k = aparece(t, T.crecen);
  return (
    <Lienzo zoom={interpolate(t, [T.sin, T.echo], [1, 1.04])}>
      <g opacity={aparece(t, T.resbala)}>
        {[0, 1, 2].map((j) => {
          const u = (t * 1.1 + j / 3) % 1;
          return <path key={j} d={`M ${560 + u * 400} ${860 + j * 30} l 80 0`} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={1 - u} />;
        })}
        <Texto x={800} y={780} size={34} color={C.white}>
          el viento resbala
        </Texto>
      </g>
      <Mar y={1000} t={t} A={20 + 40 * k} r={14} calma={[560, 1080, 0.95]} espuma={aparece(t, T.crestas)} />
      <rect x={560} y={940} width={520} height={10} fill={ACEITE} opacity={0.4} />
      <Texto x={300} y={1300} size={36} color={C.white} op={k}>
        olas que rompen
      </Texto>
      <Texto x={780} y={1300} size={36} color={ACEITE} op={k}>
        olas suaves
      </Texto>
      <Texto x={540} y={1400} size={38} color={C.cyan} op={aparece(t, T.crestas)}>
        sin crestas de espuma
      </Texto>
    </Lienzo>
  );
};

// F. Franklin: una cucharada de aceite en un estanque calmó media cancha
export const Franklin: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const r = interpolate(t, [T.estanque, T.media + 0.8], [10, 330], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.echo, T.asi], [1, 1.04])}>
        <Texto x={540} y={540} size={46} color={C.white} op={aparece(t, T.echo)}>
          Benjamin Franklin, 1773
        </Texto>
        <ellipse cx={540} cy={960} rx={440} ry={300} fill="#2A6A5A" />
        <ellipse cx={540} cy={960} rx={420} ry={285} fill={MAR} />
        {new Array(30).fill(0).map((_, k) => {
          const x = 150 + ((k * 97) % 780);
          const y = 720 + ((k * 61) % 480);
          const d = Math.hypot((x - 540) / 1.3, y - 960);
          return d > r ? <path key={k} d={`M ${x} ${y} q 10 -8 20 0 q 10 8 20 0`} stroke="#8AB8E0" strokeWidth={4} fill="none" /> : null;
        })}
        <ellipse cx={540} cy={960} rx={r * 1.3} ry={r} fill={ACEITE} opacity={0.25 * aparece(t, T.estanque)} />
        <g opacity={aparece(t, T.echo) * (1 - aparece(t, T.media))}>
          <ellipse cx={560} cy={640} rx={60} ry={24} fill="#C8C8D4" />
          <rect x={610} y={630} width={160} height={16} rx={8} fill="#C8C8D4" />
        </g>
        <Texto x={540} y={1360} size={40} color={ACEITE} op={aparece(t, T.media)}>
          1 cucharada ≈ media cancha
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.media} color={ACEITE} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
