import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/cortaunas/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  una: 2.52, // una
  queratina: 3.28, // queratina
  dedos: 5.72, // dedos
  final: 6.66, // final
  secreto: 9.82, // secreto
  punta: 12.48, // punta
  apoyo: 13.50, // apoyo
  cerca: 15.18, // cerca
  multiplica: 16.36, // multiplica
  hojas: 18.80, // hojas
  bisagra: 21.06, // bisagra
  esa: 22.50, // esa
  lleva: 23.94, // lleva
  diminuto: 26.38, // diminuto
  concentra: 27.22, // concentra
  finisima: 29.16, // finisima
  presion: 30.48, // presion
  porEso: 32.04, // por
  fin: 34.30, // FIN
};

const ACERO = "#B8B8CC";
const UNA = "#F0D8C0";

// Cortaúñas de perfil: c = cierre 0-1; resaltes de palanca y hojas
const Corta: React.FC<{ readonly c: number; readonly palanca?: number; readonly hojas?: number }> = ({ c, palanca = 0, hojas = 0 }) => {
  const tipY = 975 + 55 * c;
  const ang = -12 + 12 * c;
  const colP = palanca > 0.5 ? C.yellow : ACERO;
  const colH = hojas > 0.5 ? C.cyan : ACERO;
  return (
    <g>
      {/* hoja de abajo */}
      <polygon points="180,1040 880,1040 900,1080 220,1075" fill={colH} />
      {/* hoja de arriba */}
      <polygon points={`180,${tipY} 880,1035 880,1005 220,${tipY - 30}`} fill={colH} />
      <circle cx={885} cy={1040} r={26} fill="#5A5478" stroke={hojas > 0.5 ? C.cyan : "none"} strokeWidth={6} />
      {/* perno */}
      <rect x={322} y={895} width={16} height={180} fill="#8C88A8" />
      {/* palanca */}
      <g transform={`rotate(${ang} 330 900)`}>
        <rect x={300} y={878} width={640} height={34} rx={17} fill={colP} />
        <path d="M 340 912 q 20 25 50 0 Z" fill={colP} />
      </g>
    </g>
  );
};

// Flecha vertical hacia abajo
const Flecha: React.FC<{ readonly x: number; readonly y: number; readonly l: number; readonly w: number; readonly color: string; readonly op: number }> = ({
  x,
  y,
  l,
  w,
  color,
  op,
}) => (
  <g opacity={op}>
    <rect x={x - w / 2} y={y} width={w} height={l} fill={color} />
    <polygon points={`${x - w * 1.4},${y + l} ${x + w * 1.4},${y + l} ${x},${y + l + w * 2}`} fill={color} />
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Corta c={0} />
    <Texto x={620} y={760} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este cortaúñas corta tan fácil?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.una], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Una uña es queratina dura y la cortas con dos dedos + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const c = interpolate(t, [T.dedos, T.dedos + 0.4], [0, 1], clamp);
  const cae = interpolate(t, [T.dedos + 0.4, T.dedos + 1.2], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.una, T.secreto], [1, 1.05])}>
        <g transform={`translate(${-cae * 60} ${cae * 260}) rotate(${-cae * 30} 150 1010)`}>
          <path d="M 120 1000 q 60 -30 90 10 l -10 20 q -40 -20 -80 0 Z" fill={UNA} opacity={aparece(t, T.una)} />
        </g>
        <Corta c={c} />
        <circle cx={900} cy={790 + c * 60} r={50} fill="#E8B48A" opacity={aparece(t, T.dedos - 0.4)} />
        <Texto x={300} y={1200} size={40} color={UNA} op={aparece(t, T.queratina)}>
          queratina dura
        </Texto>
        <g opacity={aparece(t, T.final)}>
          <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
          <rect
            x={190}
            y={1330}
            width={700 * interpolate(t, [T.final, T.secreto], [0, 1], clamp)}
            height={24}
            rx={12}
            fill={C.yellow}
          />
          <Texto x={540} y={1430} color={C.white} size={38}>
            el detalle diminuto: al final
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.dedos + 0.4} color={C.white} />
    </>
  );
};

// C. La palanca de arriba: empujas en la punta, lejos del apoyo, y presiona cerca: multiplica
export const Palanca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const c = interpolate(t, [T.multiplica, T.multiplica + 0.6], [0, 0.6], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.secreto, T.hojas], [1, 1.04])}>
        <Corta c={c} palanca={aparece(t, T.secreto)} />
        <Flecha x={900} y={640} l={110} w={22} color={C.white} op={aparece(t, T.punta)} />
        <Texto x={900} y={610} size={34} color={C.white} op={aparece(t, T.punta)}>
          tu dedo
        </Texto>
        <g opacity={aparece(t, T.apoyo)}>
          <polygon points="330,870 305,830 355,830" fill={C.orange} />
          <Texto x={250} y={810} size={34} color={C.orange}>
            apoyo
          </Texto>
        </g>
        <Flecha x={420} y={700} l={130} w={56} color={C.yellow} op={aparece(t, T.cerca)} />
        <Texto x={540} y={1240} size={48} color={C.yellow} op={aparece(t, T.multiplica)}>
          fuerza × varias veces
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.multiplica} color={C.yellow} />
    </>
  );
};

// D. Las hojas son otra palanca con bisagra al otro extremo: solo llevan la fuerza al filo
export const Hojas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = ((t - T.lleva) * 0.9) % 1;
  return (
    <Lienzo zoom={interpolate(t, [T.hojas, T.diminuto], [1, 1.04])}>
      <Corta c={0.6} hojas={aparece(t, T.hojas)} />
      <g opacity={aparece(t, T.bisagra)}>
        <circle cx={885} cy={1040} r={60} fill="none" stroke={C.cyan} strokeWidth={6} />
        <Texto x={885} y={1160} size={34} color={C.cyan}>
          bisagra
        </Texto>
      </g>
      <Texto x={540} y={760} size={40} color={C.white} op={aparece(t, T.esa)}>
        esta palanca no multiplica
      </Texto>
      <circle cx={330 - u * 140} cy={1010} r={16} fill={C.yellow} opacity={aparece(t, T.lleva)} />
      <Texto x={540} y={1240} size={40} color={C.yellow} op={aparece(t, T.lleva)}>
        lleva la fuerza hasta el filo
      </Texto>
    </Lienzo>
  );
};

// E. El filo diminuto concentra la fuerza en una línea finísima: presión enorme
export const Filo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zoom = aparece(t, T.diminuto);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.diminuto, T.porEso], [1, 1.04])}>
        <g opacity={1 - zoom * 0.7}>
          <Corta c={0.6} />
        </g>
        <g opacity={zoom}>
          <circle cx={540} cy={760} r={260} fill="#141030" stroke={C.yellow} strokeWidth={8} />
          <polygon points="380,600 700,600 545,880 535,880" fill={ACERO} />
          <rect x={430} y={880} width={220} height={90} fill={UNA} />
          <line x1={540} y1={880} x2={540} y2={895} stroke={C.red} strokeWidth={6} opacity={aparece(t, T.concentra)} />
          <line x1={300} y1={900} x2={530} y2={880} stroke={C.yellow} strokeWidth={4} opacity={aparece(t, T.finisima)} />
        </g>
        <Texto x={540} y={1120} size={38} color={C.white} op={aparece(t, T.concentra)}>
          toda la fuerza en una línea
        </Texto>
        <g opacity={aparece(t, T.presion)}>
          <Texto x={540} y={1230} size={42} color={C.white}>
            presión = fuerza ÷ área
          </Texto>
          <Texto x={540} y={1320} size={56} color={C.red}>
            ¡enorme!
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.presion} color={C.red} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
