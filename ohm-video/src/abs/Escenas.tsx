import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/abs/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  frenas: 1.64, // frenas
  vibra: 2.90, // vibra
  final: 4.42, // final
  bloquea: 7.36, // bloquea
  patina: 8.06, // patina
  volante: 10.92, // volante
  sensor: 12.92, // sensor
  mide: 14.16, // mide
  frena: 16.48, // frena
  valvula: 19.42, // valvula
  suelta: 19.76, // suelta
  aplicar: 21.76, // aplicar
  segundo: 24.12, // segundo
  sientes: 25.62, // sientes
  borde: 28.58, // borde
  esquivar: 29.84, // esquivar
  sueltes: 31.64, // sueltes
  fondo: 33.86, // fondo
  porEso: 34.54, // por
  fin: 35.86, // FIN
};

// Pedal de freno con pie; vib = amplitud de vibración
const Pedal: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly vib: number; readonly s?: number }> = ({ x, y, t, vib, s = 1 }) => {
  const d = vib * 10 * Math.sin(t * 90);
  return (
    <g transform={`translate(${x} ${y + d}) scale(${s})`}>
      <line x1={0} y1={-260} x2={-40} y2={0} stroke="#5A5A66" strokeWidth={20} />
      <rect x={-130} y={-10} width={180} height={60} rx={14} fill="#3A3A44" />
      <path d="M -150 -40 Q -60 -120 80 -90 L 120 -60 Q 60 -10 -150 -10 Z" fill="#2A2A34" />
      <path d="M -200 -70 L -150 -40 L -150 -10 L -220 -30 Z" fill="#2A2A34" />
      {vib > 0
        ? [0, 1].map((k) => <path key={k} d={`M ${80 + k * 30} ${-20 - k * 10} l 20 -20 m -20 50 l 25 0`} stroke={C.yellow} strokeWidth={6} opacity={0.6 + 0.4 * Math.sin(t * 20 + k)} />)
        : null}
    </g>
  );
};

const Auto: React.FC<{ readonly x: number; readonly y: number; readonly rot?: number; readonly s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-130} width={140} height={260} rx={40} fill={C.cyan} />
    <rect x={-55} y={-70} width={110} height={70} rx={14} fill="#1A2A3A" />
    <rect x={-85} y={-100} width={24} height={56} rx={8} fill="#111" />
    <rect x={61} y={-100} width={24} height={56} rx={8} fill="#111" />
    <rect x={-85} y={50} width={24} height={56} rx={8} fill="#111" />
    <rect x={61} y={50} width={24} height={56} rx={8} fill="#111" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Pedal x={540} y={1050} t={t} vib={1} s={1.6} />
    <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este pedal tiembla?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.frenas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Frenas de golpe y el pedal vibra + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.frenas, T.bloquea], [1, 1.04])}>
      <Pedal x={540} y={1050} t={t} vib={aparece(t, T.vibra)} s={1.6} />
      <Texto x={540} y={1400} size={44} color={C.red} op={aparece(t, T.frenas)}>
        ¡frenazo!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          lo que no debes hacer: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.bloquea], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Rueda bloqueada: patina, agarra menos y no puedes girar el volante
export const Bloqueo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.bloquea, T.sensor], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.bloquea, T.sensor], [1, 1.04])}>
      <rect x={290} y={400} width={500} height={1500} fill="#3A3A44" />
      <line x1={540} y1={400} x2={540} y2={1900} stroke="#fff" strokeWidth={6} strokeDasharray="40 30" />
      <g opacity={aparece(t, T.patina)}>
        <rect x={435} y={1500 - u * 500} width={20} height={u * 500} fill="#111" opacity={0.7} />
        <rect x={625} y={1500 - u * 500} width={20} height={u * 500} fill="#111" opacity={0.7} />
      </g>
      <Auto x={540} y={1400 - u * 500} rot={0} />
      <Texto x={540} y={1650} size={40} color={C.red} op={aparece(t, T.patina)}>
        rueda bloqueada: patina
      </Texto>
      <g opacity={aparece(t, T.volante)} transform="translate(860 700)">
        <circle cx={0} cy={0} r={90} fill="none" stroke="#C8C8D4" strokeWidth={18} transform={`rotate(${40 * Math.sin(t * 3)})`} />
        <line x1={-90} y1={0} x2={90} y2={0} stroke="#C8C8D4" strokeWidth={14} transform={`rotate(${40 * Math.sin(t * 3)})`} />
        <Texto x={0} y={150} size={30} color={C.white}>
          giras… y nada
        </Texto>
      </g>
    </Lienzo>
  );
};

// Rueda con anillo dentado y sensor
const Rueda: React.FC<{ readonly x: number; readonly y: number; readonly ang: number; readonly s?: number }> = ({ x, y, ang, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={220} fill="#1A1A22" />
    <circle cx={0} cy={0} r={150} fill="#8A8A96" />
    <g transform={`rotate(${ang})`}>
      {new Array(24).fill(0).map((_, k) => (
        <rect key={k} x={-8} y={-120} width={16} height={24} fill="#C8C8D4" transform={`rotate(${k * 15})`} />
      ))}
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={60 * Math.cos((a * Math.PI) / 180)} cy={60 * Math.sin((a * Math.PI) / 180)} r={14} fill="#5A5A66" />
      ))}
    </g>
  </g>
);

// D. Un sensor en cada rueda mide qué tan rápido gira
export const Sensor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.sensor, T.frena], [1, 1.04])}>
      <Rueda x={480} y={960} ang={t * 300} s={1.3} />
      <g opacity={aparece(t, T.sensor)}>
        <rect x={430} y={720} width={100} height={60} rx={10} fill={C.orange} />
        <line x1={530} y1={750} x2={820} y2={650} stroke={C.orange} strokeWidth={6} />
        <Texto x={430} y={690} size={34} color={C.orange}>
          sensor
        </Texto>
      </g>
      <g opacity={aparece(t, T.mide)}>
        <rect x={760} y={560} width={220} height={120} rx={14} fill="#1A2A1A" />
        <Texto x={870} y={640} size={44} color="#5AE07A">
          {Math.round(800 + 20 * Math.sin(t * 2))} rpm
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Si una rueda frena demasiado rápido, una válvula suelta la presión y la vuelve a aplicar: 15 veces por segundo
export const Valvula: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ciclo = (t * 3) % 1;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.frena, T.borde], [1, 1.04])}>
        <Texto x={540} y={560} size={36} color={C.white}>
          presión del freno
        </Texto>
        <line x1={120} y1={1000} x2={960} y2={1000} stroke={C.grey} strokeWidth={4} />
        <line x1={120} y1={620} x2={120} y2={1000} stroke={C.grey} strokeWidth={4} />
        <line x1={120} y1={700} x2={960} y2={700} stroke={C.red} strokeWidth={3} strokeDasharray="12 10" opacity={aparece(t, T.frena)} />
        <Texto x={820} y={680} size={26} color={C.red} op={aparece(t, T.frena)}>
          bloqueo
        </Texto>
        <path
          d={`M 120 1000 ${new Array(84)
            .fill(0)
            .map((_, i) => {
              const x = 120 + i * 10;
              const tt = i / 84;
              const p = tt < 0.12 ? tt / 0.12 : 1 - 0.35 * (((tt - 0.12) * 12) % 1 < 0.5 ? ((tt - 0.12) * 12) % 1 : 1 - (((tt - 0.12) * 12) % 1)) * 2;
              return `L ${x} ${1000 - 290 * p}`;
            })
            .join(" ")}`}
          stroke={C.yellow}
          strokeWidth={6}
          fill="none"
          opacity={aparece(t, T.suelta)}
        />
        <g transform="translate(540 1250)" opacity={aparece(t, T.valvula)}>
          <rect x={-120} y={-60} width={240} height={120} rx={16} fill="#4A4270" />
          <rect x={-20} y={-60 + (ciclo < 0.5 ? 0 : 50)} width={40} height={70} fill={C.cyan} />
          <Texto x={0} y={110} size={34} color={C.cyan}>
            válvula: suelta / aplica
          </Texto>
        </g>
        <Texto x={540} y={1460} size={46} color={C.yellow} op={aparece(t, T.segundo)}>
          hasta 15 veces por segundo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.valvula} color={C.cyan} />
    </>
  );
};

// F. La rueda queda al borde del agarre: puedes esquivar mientras frenas
export const Esquiva: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.borde, T.sueltes], [0, 1], clamp);
  const yc = 1500 - u * 900;
  const e = Math.exp(-(((yc - 870) / 260) ** 2));
  const x = 540 - 200 * e;
  const rot = (-Math.atan((400 * e * (yc - 870)) / 260 ** 2) * 180) / Math.PI;
  return (
    <Lienzo zoom={interpolate(t, [T.borde, T.sueltes], [1, 1.04])}>
      <rect x={290} y={400} width={500} height={1500} fill="#3A3A44" />
      <rect x={490} y={820} width={100} height={100} rx={10} fill={C.orange} />
      <path d="M 500 820 L 540 760 L 580 820 Z" fill="#fff" />
      <Auto x={x} y={yc} rot={rot} s={0.8} />
      <Texto x={540} y={1650} size={40} color="#5AD08A" op={aparece(t, T.esquivar)}>
        frenas y esquivas
      </Texto>
    </Lienzo>
  );
};

// G. No sueltes el pedal: mantenlo pisado a fondo
export const Pisalo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.sueltes, T.porEso], [1, 1.04])}>
        <Pedal x={540} y={1050} t={t} vib={1} s={1.6} />
        <Texto x={540} y={600} size={50} color={C.red} op={aparece(t, T.sueltes)}>
          ✗ no lo sueltes
        </Texto>
        <Texto x={540} y={1400} size={50} color="#5AD08A" op={aparece(t, T.fondo)}>
          ✓ písalo a fondo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.sueltes} color={C.red} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
