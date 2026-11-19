import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/stilson/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  stilson: 2.50, // stilson
  tubo: 3.62, // tubo
  fuerza: 5.14, // fuerza
  muerde: 6.76, // muerde
  final: 7.64, // final
  mandibula: 10.36, // mandibula
  fija: 11.60, // fija
  juego: 12.90, // juego
  dientes: 13.70, // dientes
  jalas: 16.30, // jalas
  inclina: 18.04, // inclina
  cuna: 19.90, // cuna
  presion: 22.08, // presion
  sentido: 24.82, // sentido
  reves: 26.16, // reves
  trinquete: 28.28, // trinquete
  pinza: 29.32, // pinza
  palancas: 31.52, // palancas
  recta: 33.64, // recta
  traban: 34.40, // traban
  destraba: 36.26, // destraba
  porEso: 37.02, // por
  fin: 38.92, // FIN
};

const ROJO = "#C83A3A";
const ACERO = "#9A9AA8";

// Llave Stilson sobre un tubo en (cx,cy); ang = giro del conjunto; tilt = inclinación de la mandíbula superior; agarre 0..1
const Llave: React.FC<{ readonly cx: number; readonly cy: number; readonly ang: number; readonly tilt: number; readonly agarre: number; readonly s?: number }> = ({ cx, cy, ang, tilt, agarre, s = 1 }) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    <circle cx={0} cy={0} r={110} fill="#5A5A66" />
    <circle cx={0} cy={0} r={86} fill="#2A2A34" />
    <g transform={`rotate(${ang})`}>
      <rect x={-20} y={110} width={760} height={70} rx={30} fill={ROJO} transform="rotate(-8 0 110)" />
      <path d="M -150 110 L 120 110 L 120 150 L -150 150 Z" fill={ACERO} />
      {[-110, -60, -10, 40, 90].map((x) => (
        <path key={x} d={`M ${x} 110 l 16 -20 l 16 20 Z`} fill="#C8C8D4" />
      ))}
      <rect x={140} y={-200} width={50} height={340} rx={14} fill={ACERO} />
      <g transform={`rotate(${tilt} 165 -170)`}>
        <path d="M 190 -200 L -150 -200 Q -180 -200 -180 -170 L -180 -120 L 140 -120 Z" fill={ACERO} />
        {[-140, -90, -40, 10, 60].map((x) => (
          <path key={x} d={`M ${x} -120 l 16 20 l 16 -20 Z`} fill="#C8C8D4" />
        ))}
      </g>
    </g>
    {agarre > 0
      ? [0, 1, 2, 3].map((k) => {
          const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
          return <circle key={k} cx={Math.cos(a) * 112} cy={Math.sin(a) * 112} r={10 + 10 * agarre} fill={C.yellow} opacity={agarre * 0.8} />;
        })
      : null}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Llave cx={380} cy={950} ang={-10 + 4 * Math.sin(t * 3)} tilt={-6} agarre={0.7 + 0.3 * Math.sin(t * 3)} />
    <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué muerde cada vez más fuerte?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.stilson], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Agarra un tubo liso; cuanta más fuerza, más fuerte muerde + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const f = interpolate(t, [T.fuerza, T.muerde + 0.5], [0.1, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.stilson, T.mandibula], [1, 1.04])}>
      <Llave cx={380} cy={950} ang={-10 * f} tilt={-6 * f} agarre={f} />
      <g opacity={aparece(t, T.fuerza)}>
        <path d={`M 960 ${1000 - 40 * f} l 0 ${120 + 120 * f}`} stroke={C.cyan} strokeWidth={10 + 10 * f} />
        <path d={`M 935 ${1100 + 80 * f} l 25 40 l 25 -40 Z`} fill={C.cyan} />
        <Texto x={960} y={960} size={30} color={C.cyan}>
          fuerza
        </Texto>
      </g>
      <g opacity={aparece(t, T.muerde)}>
        <rect x={140} y={1400} width={300} height={30} rx={10} fill="#2A2440" />
        <rect x={140} y={1400} width={300 * f} height={30} rx={10} fill={C.yellow} />
        <Texto x={290} y={1380} size={30} color={C.yellow}>
          agarre
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          el truco de la pinza de presión: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.mandibula], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. La mandíbula de arriba no está fija: tiene juego, y los dientes apuntan en la dirección del giro
export const Mandibula: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const juego = aparece(t, T.juego) * 5 * Math.sin(t * 6);
  return (
    <Lienzo zoom={interpolate(t, [T.mandibula, T.jalas], [1.3, 1.36])} cy={900}>
      <Llave cx={540} cy={950} ang={0} tilt={juego} agarre={0} />
      <path d="M 300 700 A 260 260 0 0 1 780 700" stroke={C.yellow} strokeWidth={8} fill="none" opacity={aparece(t, T.dientes)} />
      <path d="M 760 680 l 24 22 l -32 6 Z" fill={C.yellow} opacity={aparece(t, T.dientes)} />
      <Texto x={540} y={1170} size={30} color={C.white} op={aparece(t, T.fija)}>
        no está fija: tiene juego
      </Texto>
      <Texto x={540} y={1220} size={28} color={C.yellow} op={aparece(t, T.dientes)}>
        dientes inclinados hacia el giro
      </Texto>
    </Lienzo>
  );
};

// D. Al jalar el mango, la mandíbula se inclina y aprieta como una cuña: más fuerza, más presión
export const Cuna: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const f = interpolate(t, [T.jalas, T.presion + 0.5], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.jalas, T.sentido], [1, 1.04])}>
        <Llave cx={380} cy={950} ang={-14 * f} tilt={-8 * f} agarre={f} />
        <path d={`M 960 ${960} l 0 ${100 + 160 * f}`} stroke={C.cyan} strokeWidth={10 + 12 * f} />
        <path d={`M 932 ${1060 + 160 * f} l 28 44 l 28 -44 Z`} fill={C.cyan} />
        <Texto x={540} y={560} size={40} color={C.white} op={aparece(t, T.inclina)}>
          la mandíbula se inclina
        </Texto>
        <Texto x={540} y={630} size={44} color={C.yellow} op={aparece(t, T.cuna)}>
          …y aprieta como una cuña
        </Texto>
        <Texto x={540} y={1440} size={36} color={C.yellow} op={aparece(t, T.presion)}>
          más fuerza = más presión en los dientes
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cuna} color={C.yellow} />
    </>
  );
};

// E. Solo agarra en un sentido: al revés se suelta y resbala, como un trinquete
export const Sentido: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rev = aparece(t, T.reves);
  const ang = rev ? 10 * Math.abs(Math.sin(t * 3)) : -10;
  return (
    <Lienzo zoom={interpolate(t, [T.sentido, T.pinza], [1, 1.04])}>
      <Llave cx={380} cy={950} ang={ang} tilt={rev ? 6 : -6} agarre={1 - rev} />
      <Texto x={540} y={560} size={40} color={C.white} op={aparece(t, T.sentido)}>
        agarra en un solo sentido
      </Texto>
      <Texto x={540} y={1400} size={40} color={C.red} op={rev}>
        al revés: resbala
      </Texto>
      <Texto x={540} y={1470} size={36} color={C.cyan} op={aparece(t, T.trinquete)}>
        como un trinquete
      </Texto>
    </Lienzo>
  );
};

// F. La pinza de presión: sus palancas pasan un poco más allá de la línea recta y se traban; una palanquita las destraba
export const Pinza: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const traba = interpolate(t, [T.palancas, T.traban + 0.3], [0, 1], clamp) * (1 - interpolate(t, [T.destraba, T.destraba + 0.5], [0, 1], clamp));
  const ang = 30 - 36 * traba;
  const a = (ang * Math.PI) / 180;
  const L = 220;
  const jx = 540 + L * Math.cos(a);
  const jy = 1000 - L * Math.sin(a);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pinza, T.porEso], [1, 1.04])}>
        <line x1={100} y1={1000} x2={980} y2={1000} stroke={C.grey} strokeWidth={3} strokeDasharray="14 10" opacity={aparece(t, T.recta)} />
        <Texto x={180} y={980} size={28} color={C.grey} op={aparece(t, T.recta)}>
          línea recta
        </Texto>
        <line x1={320} y1={1000} x2={540} y2={1000} stroke={ACERO} strokeWidth={30} strokeLinecap="round" />
        <line x1={540} y1={1000} x2={jx} y2={jy} stroke={ROJO} strokeWidth={30} strokeLinecap="round" />
        <line x1={jx} y1={jy} x2={540 + 2 * L * Math.cos(a)} y2={1000} stroke={ROJO} strokeWidth={30} strokeLinecap="round" />
        <circle cx={540} cy={1000} r={18} fill="#fff" />
        <circle cx={jx} cy={jy} r={18} fill="#fff" />
        <Texto x={540} y={560} size={44} color={C.yellow} op={aparece(t, T.pinza)}>
          pinza de presión
        </Texto>
        <Texto x={540} y={1300} size={42} color="#5AD08A" op={aparece(t, T.traban) * (1 - aparece(t, T.destraba))}>
          ¡se traba sola!
        </Texto>
        <Texto x={540} y={1300} size={40} color={C.cyan} op={aparece(t, T.destraba)}>
          una palanquita la destraba
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.traban} color="#5AD08A" />
    </>
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
