import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/cafeola/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  caminas: 1.80, // caminas
  llena: 3.14, // llena
  paso: 5.66, // paso
  final: 7.52, // final
  ritmo: 11.44, // ritmo
  chapotea: 13.30, // chapotea
  frecuencia: 14.86, // frecuencia
  normal: 16.70, // normal
  pasos: 19.04, // pasos
  segundo: 20.40, // segundo
  empuja: 21.76, // empuja
  crece: 25.08, // crece
  resonancia: 26.14, // resonancia
  tras: 26.94, // tras
  borde: 30.68, // borde
  truco: 31.62, // truco
  despacio: 33.06, // despacio
  llenes: 34.16, // llenes
  dedos: 36.90, // dedos
  porEso: 38.02, // por
  fin: 39.64, // FIN
};

const CAFE = "#6A3A1A";

// Taza en corte; ang = inclinación de la superficie (grados); nivel 0..1; derrame 0..1
const Taza: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly ang: number; readonly nivel?: number; readonly derrame?: number; readonly t?: number }> = ({
  x,
  y,
  s = 1,
  ang,
  nivel = 0.9,
  derrame = 0,
  t = 0,
}) => {
  const w = 280;
  const h = 320;
  const top = -h + h * (1 - nivel);
  const dy = Math.tan((ang * Math.PI) / 180) * (w / 2);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M ${w / 2} -230 q 110 0 110 90 q 0 90 -110 90`} stroke="#E8E8EE" strokeWidth={30} fill="none" />
      <clipPath id={`taza${x}${y}`}>
        <rect x={-w / 2} y={-h} width={w} height={h} rx={20} />
      </clipPath>
      <rect x={-w / 2 - 16} y={-h - 10} width={w + 32} height={h + 26} rx={30} fill="#E8E8EE" />
      <rect x={-w / 2} y={-h} width={w} height={h} rx={20} fill="#2A2440" />
      <g clipPath={`url(#taza${x}${y})`}>
        <path d={`M ${-w / 2} ${top + dy} L ${w / 2} ${top - dy} L ${w / 2} 0 L ${-w / 2} 0 Z`} fill={CAFE} />
      </g>
      {derrame > 0
        ? [0, 1, 2].map((k) => {
            const u = (t * 1.5 + k / 3) % 1;
            const lado = ang > 0 ? 1 : -1;
            return <circle key={k} cx={lado * (w / 2 + 20 + u * 60)} cy={-h + u * 300} r={14} fill={CAFE} opacity={derrame * (1 - u)} />;
          })
        : null}
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Taza x={540} y={1200} s={1.4} ang={22 * Math.sin(t * 12)} derrame={1} t={t} />
    <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué siempre se derrama aquí?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.caminas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Caminas con la taza llena y se derrama entre el paso 7 y el 10 + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const paso = Math.min(10, Math.floor(interpolate(t, [T.caminas, T.final], [1, 10.9], clamp)));
  const amp = Math.min(24, paso * 2.6);
  return (
    <Lienzo zoom={interpolate(t, [T.caminas, T.ritmo], [1, 1.04])}>
      <Taza x={540} y={1150} s={1.2} ang={amp * Math.sin(t * 12)} derrame={paso >= 7 ? 1 : 0} t={t} />
      <Texto x={540} y={1400} size={56} color={paso >= 7 ? C.red : C.white}>
        {"paso " + paso}
      </Texto>
      <Texto x={540} y={1480} size={36} color={C.red} op={aparece(t, T.paso)}>
        entre el 7 y el 10: ¡se derrama!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          el truco para evitarlo: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.ritmo], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. El café tiene un ritmo propio: chapotea de lado a lado a una frecuencia natural (≈ ritmo de los pasos)
export const Ritmo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pasoOn = Math.sin(t * Math.PI * 4) > 0.9;
  return (
    <Lienzo zoom={interpolate(t, [T.ritmo, T.empuja], [1, 1.04])}>
      <Taza x={540} y={1100} s={1.1} ang={14 * Math.sin(t * Math.PI * 4) * aparece(t, T.chapotea)} />
      <Texto x={540} y={560} size={42} color={C.yellow} op={aparece(t, T.frecuencia)}>
        frecuencia natural
      </Texto>
      <g opacity={aparece(t, T.pasos)}>
        <ellipse cx={420} cy={1340} rx={50} ry={24} fill={pasoOn ? C.cyan : "#3A3A5A"} />
        <ellipse cx={660} cy={1340} rx={50} ry={24} fill={!pasoOn && Math.sin(t * Math.PI * 4) < -0.9 ? C.cyan : "#3A3A5A"} />
        <Texto x={540} y={1440} size={38} color={C.cyan}>
          tus pasos: ~2 por segundo
        </Texto>
      </g>
      <Texto x={540} y={1510} size={38} color={C.yellow} op={aparece(t, T.segundo)}>
        = el ritmo del café
      </Texto>
    </Lienzo>
  );
};

// D. Cada paso empuja justo a tiempo y la ola crece: resonancia
export const Resonancia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.empuja, T.tras], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.empuja, T.truco], [1, 1.04])}>
        <line x1={120} y1={1000} x2={960} y2={1000} stroke={C.grey} strokeWidth={3} />
        <path
          d={`M 120 1000 ${new Array(120)
            .fill(0)
            .map((_, i) => {
              const x = 120 + i * 7;
              const p = i / 120;
              const a = p <= u ? 30 + 260 * p : 0;
              return `L ${x} ${1000 - a * Math.sin(p * Math.PI * 20)}`;
            })
            .join(" ")}`}
          stroke="#C8884A"
          strokeWidth={8}
          fill="none"
        />
        {new Array(10).fill(0).map((_, k) => (
          <path key={k} d={`M ${120 + (k + 0.25) * 84} 1340 l 0 -40 m -12 12 l 12 -12 l 12 12`} stroke={C.cyan} strokeWidth={6} fill="none" opacity={(k + 0.25) / 10 <= u ? 1 : 0.15} />
        ))}
        <line x1={120} y1={700} x2={960} y2={700} stroke={C.red} strokeWidth={4} strokeDasharray="16 10" opacity={aparece(t, T.tras)} />
        <Texto x={820} y={680} size={32} color={C.red} op={aparece(t, T.tras)}>
          borde de la taza
        </Texto>
        <Texto x={540} y={1420} size={34} color={C.cyan} op={aparece(t, T.empuja)}>
          cada paso, un empujón a tiempo
        </Texto>
        <Texto x={540} y={560} size={52} color={C.yellow} op={aparece(t, T.resonancia)}>
          resonancia
        </Texto>
        <Texto x={540} y={1500} size={40} color={C.red} op={aparece(t, T.borde)}>
          paso 7 a 10: ¡se sale!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.resonancia} color={C.yellow} />
    </>
  );
};

// E. El truco: camina más despacio, no la llenes hasta arriba, o tómala desde arriba por el borde
export const Truco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.truco, T.porEso], [1, 1.04])}>
        <Texto x={540} y={560} size={52} color={C.yellow} op={aparece(t, T.truco)}>
          el truco
        </Texto>
        <g opacity={aparece(t, T.despacio)}>
          <Taza x={220} y={1050} s={0.5} ang={4 * Math.sin(t * 6)} />
          <Texto x={220} y={1140} size={30} color={C.white}>
            más despacio
          </Texto>
        </g>
        <g opacity={aparece(t, T.llenes)}>
          <Taza x={540} y={1050} s={0.5} ang={8 * Math.sin(t * 12)} nivel={0.6} />
          <Texto x={540} y={1140} size={30} color={C.white}>
            menos llena
          </Texto>
        </g>
        <g opacity={aparece(t, T.dedos)}>
          <Taza x={860} y={1050} s={0.5} ang={4 * Math.sin(t * 12)} />
          <path d="M 790 860 q 70 -60 140 0" stroke="#E0A888" strokeWidth={26} fill="none" strokeLinecap="round" />
          <Texto x={860} y={1140} size={30} color={C.white}>
            desde arriba
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.truco} color={C.yellow} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
