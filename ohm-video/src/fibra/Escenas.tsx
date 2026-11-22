import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/fibra/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  si: 1.82,
  cinco: 3.16,
  final: 5.44,
  la: 8.42,
  hilos: 10.36,
  resina: 11.9,
  estirados: 12.64,
  avion: 16.7,
  pero: 18.26,
  aplasta: 20.92,
  a: 21.88,
  trescientas: 23.6,
  comprimida: 25.88,
  peor: 27.42,
  y: 28.24,
  grietas: 29.76,
  en: 31.16,
  titan: 32.42,
  implosiono: 34.8,
  porEso: 36.76,
  fin: 38.72,
};

const CARBONO = "#2A2A30";
const TRAMA = "#4A4A58";
const RESINA = "#C8963A";
const MAR = "#0E2A4A";
const ACERO = "#8A86A8";

// Patrón de tejido de carbono
const Trama: React.FC<{ readonly id: string }> = ({ id }) => (
  <defs>
    <pattern id={`trama-${id}`} width={40} height={40} patternUnits="userSpaceOnUse">
      <rect width={40} height={40} fill={CARBONO} />
      <rect x={0} y={0} width={20} height={20} fill={TRAMA} />
      <rect x={20} y={20} width={20} height={20} fill={TRAMA} />
    </pattern>
  </defs>
);

// Submarino de perfil
const Submarino: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly id: string; readonly carbono?: boolean }> = ({
  x,
  y,
  s,
  id,
  carbono = true,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Trama id={id} />
    <path d="M -260 0 Q -260 -90 -120 -90 L 160 -90 Q 280 -90 300 0 Q 280 90 160 90 L -120 90 Q -260 90 -260 0 Z" fill={carbono ? `url(#trama-${id})` : ACERO} />
    <rect x={-40} y={-150} width={110} height={70} rx={20} fill={carbono ? `url(#trama-${id})` : ACERO} />
    <circle cx={-150} cy={0} r={30} fill="#8AD0F8" opacity={0.8} />
    <path d="M 290 -10 L 340 -60 L 340 60 L 290 10 Z" fill="#3A3650" />
  </g>
);

// Imagen del gancho y del cierre: submarino de carbono en el fondo del mar con interrogación
const SubPregunta: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <rect x={0} y={400} width={1080} height={1100} fill={MAR} />
    {new Array(10).fill(0).map((_, k) => {
      const u = (t * 0.3 + k / 10) % 1;
      return <circle key={k} cx={120 + random(`b${k}`) * 840} cy={1400 - u * 1000} r={6 + (k % 3) * 4} fill="none" stroke="#6AA8D8" strokeWidth={3} opacity={1 - u} />;
    })}
    <Submarino x={520} y={900 + Math.sin(t * 1.5) * 12} s={1.4} id="g" />
    <Texto x={540} y={600} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué no hay submarinos de carbono?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.si], [1.12, 1])}>
        <SubPregunta t={t} q={interpolate(t, [0.6, 0.9], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.6} color="#6AA8D8" />
    </>
  );
};

// B. Para su peso, es cinco veces más fuerte que el acero + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const crece = interpolate(t, [T.cinco - 0.3, T.cinco + 0.8], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.la], [1, 1.05])}>
      <Texto x={540} y={450} size={34} color={C.grey}>
        resistencia por kilo
      </Texto>
      <rect x={260} y={1100 - 110} width={180} height={110} rx={12} fill={ACERO} />
      <Texto x={350} y={1160} size={34} color={ACERO}>
        acero
      </Texto>
      <Trama id="b" />
      <rect x={640} y={1100 - 550 * crece} width={180} height={550 * crece} rx={12} fill="url(#trama-b)" stroke={C.yellow} strokeWidth={4} />
      <Texto x={730} y={1160} size={34} color={C.white}>
        carbono
      </Texto>
      <Texto x={730} y={1060 - 550 * crece} size={50} color={C.yellow} op={crece}>
        ×5
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1260} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1260}
          width={700 * interpolate(t, [T.final, T.la], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1360} color={C.white} size={36}>
          qué pasó cuando lo intentaron: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Bloque de fibras en resina (vista lateral); onda = cuánto se pandean (0 recto)
const Fibras: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly onda: number; readonly grietas?: number; readonly resina?: number }> = ({
  x,
  y,
  w,
  onda,
  grietas = 0,
  resina = 1,
}) => (
  <g>
    <rect x={x} y={y - 110} width={w} height={220} rx={10} fill={RESINA} opacity={0.55 * resina} />
    {new Array(11).fill(0).map((_, k) => {
      const yy = y - 100 + k * 20;
      const d = new Array(31)
        .fill(0)
        .map((__, i) => `${i === 0 ? "M" : "L"} ${x + (i / 30) * w} ${yy + Math.sin(i * 0.9 + k) * 12 * onda}`)
        .join(" ");
      return <path key={k} d={d} stroke="#4A4A5A" strokeWidth={8} fill="none" />;
    })}
    {new Array(8).fill(0).map((_, k) => (
      <path
        key={`g${k}`}
        d={`M ${x + 40 + random(`gx${k}`) * (w - 80)} ${y - 100 + random(`gy${k}`) * 200} l 20 30 l -14 20 l 18 30`}
        stroke={C.red}
        strokeWidth={5}
        fill="none"
        opacity={grietas > k / 8 ? 1 : 0}
      />
    ))}
  </g>
);

// C. Son millones de hilos finísimos pegados con resina
export const Hilos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.la, T.estirados], [1, 1.04])}>
      <Fibras x={140} y={860} w={800} onda={0} resina={aparece(t, T.resina - 0.4)} />
      <Texto x={540} y={680} size={38} color={C.white} op={aparece(t, T.hilos)}>
        hilos de carbono
      </Texto>
      <Texto x={540} y={1060} size={38} color={RESINA} op={aparece(t, T.resina)}>
        pegados con resina
      </Texto>
    </Lienzo>
  );
};

// Flecha
const Flecha: React.FC<{ readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly color: string; readonly op?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  op = 1,
}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return (
    <g opacity={op}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={12} />
      <path
        d={`M ${x2 + Math.cos(a) * 24} ${y2 + Math.sin(a) * 24} L ${x2 + Math.cos(a + 2.4) * 30} ${y2 + Math.sin(a + 2.4) * 30} L ${x2 + Math.cos(a - 2.4) * 30} ${y2 + Math.sin(a - 2.4) * 30} Z`}
        fill={color}
      />
    </g>
  );
};

// D. Estirados son fortísimos y ligeros: perfectos para un F1 o un avión
export const Tension: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tira = Math.sin(t * 3) * 10;
  return (
    <Lienzo zoom={interpolate(t, [T.estirados, T.pero], [1, 1.04])}>
      <Fibras x={240 + tira * -1} y={760} w={600 + tira * 2} onda={0} />
      <Flecha x1={220} y1={760} x2={100} y2={760} color="#5AC878" />
      <Flecha x1={860} y1={760} x2={980} y2={760} color="#5AC878" />
      <Texto x={540} y={600} size={40} color="#5AC878" op={aparece(t, T.estirados)}>
        estirados: fortísimos
      </Texto>
      <g opacity={aparece(t, T.avion - 1.2)}>
        {/* fórmula 1 */}
        <g transform="translate(300 1120)">
          <path d="M -160 20 L -120 -20 L 60 -20 L 120 0 L 170 10 L 170 30 L -160 30 Z" fill={C.red} />
          <rect x={-170} y={-50} width={30} height={40} fill={C.red} />
          <circle cx={-100} cy={34} r={28} fill="#1A1620" />
          <circle cx={110} cy={34} r={28} fill="#1A1620" />
        </g>
        {/* avión */}
        <g transform="translate(780 1110)" opacity={aparece(t, T.avion)}>
          <path d="M -170 0 L 150 -10 Q 190 0 150 10 L -170 10 Z" fill={C.white} />
          <path d="M -20 0 L 60 -110 L 90 -110 L 40 0 Z" fill={C.white} />
          <path d="M -20 5 L 60 110 L 90 110 L 40 5 Z" fill={C.white} />
          <path d="M -170 0 L -150 -60 L -130 -60 L -130 0 Z" fill={C.white} />
        </g>
      </g>
    </Lienzo>
  );
};

// E. En el fondo del mar el agua no tira, aplasta: a 3.000 m, 300 veces la presión del aire
export const Aplasta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = aparece(t, T.aplasta);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.comprimida], [1, 1.04])}>
      <rect x={0} y={400} width={1080} height={1100} fill={MAR} />
      <Submarino x={520} y={860} s={0.9} id="e" />
      {new Array(12).fill(0).map((_, k) => {
        const a = (k / 12) * Math.PI * 2;
        const r1 = 360 - Math.sin(t * 4 + k) * 10;
        return (
          <Flecha
            key={k}
            x1={540 + Math.cos(a) * r1}
            y1={860 + Math.sin(a) * r1 * 0.7}
            x2={540 + Math.cos(a) * 270}
            y2={860 + Math.sin(a) * 270 * 0.7}
            color={C.cyan}
            op={p}
          />
        );
      })}
      <g opacity={aparece(t, T.a)}>
        <Tarjeta x={190} y={1200} w={700} h={170}>
          <Texto x={540} y={1265} size={38} color={C.white}>
            3.000 m de profundidad
          </Texto>
          <Texto x={540} y={1335} size={40} color={C.cyan} op={aparece(t, T.trescientas)}>
            ×300 la presión del aire
          </Texto>
        </Tarjeta>
      </g>
    </Lienzo>
  );
};

// F. Comprimida, la fibra rinde peor, y cada inmersión abre grietas diminutas
export const Grietas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const onda = interpolate(t, [T.comprimida + 0.3, T.peor + 0.4], [0, 1], suave);
  const inmersiones = Math.floor(interpolate(t, [T.y + 0.4, T.en], [0, 8], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.comprimida, T.en], [1, 1.04])}>
      <Fibras x={240} y={800} w={600} onda={onda} grietas={inmersiones / 8} />
      <Flecha x1={100} y1={800} x2={220} y2={800} color={C.red} />
      <Flecha x1={980} y1={800} x2={860} y2={800} color={C.red} />
      <Texto x={540} y={620} size={40} color={C.red} op={aparece(t, T.comprimida)}>
        comprimida: se pandea
      </Texto>
      <g opacity={aparece(t, T.y)}>
        <Texto x={540} y={1060} size={36} color={C.white}>
          {`inmersiones: ${inmersiones}`}
        </Texto>
        <Texto x={540} y={1140} size={36} color={C.red} op={aparece(t, T.grietas)}>
          grietas diminutas
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. En 2023, el sumergible Titán, con casco de carbono, implosionó camino al Titanic
export const Titan: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const colapso = interpolate(t, [T.implosiono, T.implosiono + 0.25], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.en, T.porEso], [1, 1.04])}>
        <rect x={0} y={400} width={1080} height={1100} fill={MAR} />
        <Texto x={540} y={540} size={64} color={C.white} op={aparece(t, T.en)}>
          2023
        </Texto>
        <g transform={`translate(540 860) scale(${1 - colapso * 0.85} ${1 - colapso * 0.6})`} opacity={1 - colapso}>
          <Trama id="g2" />
          <rect x={-260} y={-90} width={520} height={180} rx={90} fill="url(#trama-g2)" />
          <circle cx={-280} cy={0} r={80} fill={ACERO} />
          <circle cx={280} cy={0} r={80} fill={ACERO} />
        </g>
        {new Array(16).fill(0).map((_, k) => {
          const a = (k / 16) * Math.PI * 2;
          return (
            <line
              key={k}
              x1={540 + Math.cos(a) * 60}
              y1={860 + Math.sin(a) * 60}
              x2={540 + Math.cos(a) * (60 + colapso * 260)}
              y2={860 + Math.sin(a) * (60 + colapso * 260)}
              stroke={C.white}
              strokeWidth={6}
              opacity={colapso * (1 - interpolate(t, [T.implosiono + 0.3, T.porEso], [0, 1], clamp))}
            />
          );
        })}
        <Texto x={540} y={1180} size={38} color={C.white} op={aparece(t, T.titan)}>
          sumergible Titán: casco de carbono
        </Texto>
        <Texto x={540} y={1260} size={40} color={C.red} op={aparece(t, T.implosiono)}>
          implosionó
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.implosiono} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <SubPregunta t={t} q={1} />
    </Lienzo>
  );
};
