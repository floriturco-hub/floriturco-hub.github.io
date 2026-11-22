import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/picada/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  botellas: 1.76, // botellas
  base: 3.44, // base
  champan: 4.34, // champan
  final: 6.66, // final
  llama: 9.06, // llama
  sopladores: 10.50, // sopladores
  empujaban: 11.38, // empujaban
  tambaleara: 14.18, // tambaleara
  resistencia: 15.94, // resistencia
  cupula: 17.14, // cupula
  arco: 18.94, // arco
  champan2: 19.72, // champan
  presion: 21.60, // presion
  llanta: 23.42, // llanta
  plano: 25.86, // plano
  sedimentos: 28.86, // sedimentos
  anillo: 30.18, // anillo
  menos: 32.48, // menos
  mililitros: 34.86, // mililitros
  paraEso: 36.14, // para
  fin: 37.46, // FIN
};

const VIDRIO = "#2A6A3A";
const VINO = "#7A1A2A";

// Botella en corte: base en y; picada = profundidad del hueco; rot en grados
const Botella: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly picada: number; readonly col?: string; readonly liquido?: string; readonly rot?: number; readonly nivel?: number }> = ({
  x,
  y,
  s = 1,
  picada,
  col = VIDRIO,
  liquido = VINO,
  rot = 0,
  nivel = 0.75,
}) => {
  const w = 130;
  const exterior = `M ${-w} 0 L ${-w} -440 Q ${-w} -540 -36 -600 L -36 -780 L 36 -780 L 36 -600 Q ${w} -540 ${w} -440 L ${w} 0 L 90 0 Q 0 ${-picada * 2} -90 0 Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <clipPath id={`bot${x}${y}`}>
        <path d={exterior} />
      </clipPath>
      <path d={exterior} fill={col} opacity={0.35} />
      <g clipPath={`url(#bot${x}${y})`}>
        <rect x={-w - 20} y={-440 * nivel - 40} width={w * 2 + 40} height={600} fill={liquido} opacity={0.85} />
      </g>
      <path d={exterior} fill="none" stroke={col} strokeWidth={14} strokeLinejoin="round" />
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Botella x={540} y={1450} s={1.1} picada={70} />
    <circle cx={540} cy={1400} r={90} fill="none" stroke={C.yellow} strokeWidth={6} opacity={0.6 + 0.4 * Math.sin(t * 4)} />
    <Texto x={860} y={700} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿para qué es este hueco?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.botellas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Las botellas de vino tienen un hueco en la base; las de champán, más hondo + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.botellas, T.llama], [1, 1.04])}>
      <Botella x={300} y={1450} s={0.9} picada={60} />
      <Texto x={300} y={1530} size={34} color={C.white}>
        vino
      </Texto>
      <g opacity={aparece(t, T.champan)}>
        <Botella x={780} y={1450} s={0.9} picada={120} col="#3A5A2A" liquido="#E8D070" />
        <Texto x={780} y={1530} size={34} color="#E8D070">
          champán
        </Texto>
      </g>
      <circle cx={300} cy={1410} r={80} fill="none" stroke={C.yellow} strokeWidth={6} opacity={aparece(t, T.base)} />
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿te dan menos vino?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.llama], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Se llama picada: los sopladores empujaban la base hacia adentro para que no se tambaleara
export const Soplador: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const hunde = interpolate(t, [T.empujaban, T.empujaban + 0.8], [0, 70], clamp);
  const plano = aparece(t, T.tambaleara);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llama, T.resistencia], [1, 1.04])}>
        <Texto x={540} y={560} size={52} color={C.yellow} op={aparece(t, T.llama)}>
          la «picada»
        </Texto>
        <g opacity={1 - plano}>
          <Botella x={540} y={1300} s={0.9} picada={hunde} col="#E08A4A" liquido="#00000000" />
          <rect x={520} y={1300 - hunde * 1.6} width={40} height={400} fill="#8A8A96" opacity={aparece(t, T.sopladores)} />
          <Texto x={760} y={1480} size={32} color="#E08A4A" op={aparece(t, T.sopladores)}>
            vidrio caliente
          </Texto>
        </g>
        <g opacity={plano}>
          <g transform={`rotate(${8 * Math.sin(t * 4)} 300 1300)`}>
            <Botella x={300} y={1300} s={0.6} picada={-14} />
          </g>
          <Texto x={300} y={1400} size={32} color={C.red}>
            base abombada: se tambalea
          </Texto>
          <Botella x={780} y={1300} s={0.6} picada={60} />
          <Texto x={780} y={1400} size={32} color="#5AD08A">
            picada: firme ✓
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.llama} color={C.yellow} />
    </>
  );
};

// D. Hoy sigue por resistencia: una cúpula reparte la fuerza, como un arco
export const Cupula: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.resistencia, T.champan2], [1, 1.04])}>
      <path d="M 200 1200 Q 540 700 880 1200" stroke={C.cyan} strokeWidth={50} fill="none" opacity={aparece(t, T.cupula)} />
      <g opacity={aparece(t, T.arco)}>
        <path d="M 540 750 L 540 880" stroke={C.yellow} strokeWidth={14} />
        <path d="M 515 860 L 540 900 L 565 860 Z" fill={C.yellow} />
        {[-1, 1].map((d) => (
          <g key={d}>
            <path d={`M ${540 + d * 120} 900 Q ${540 + d * 260} 1000 ${540 + d * 330} 1180`} stroke={C.yellow} strokeWidth={10} fill="none" strokeDasharray="20 12" strokeDashoffset={-t * 80} />
          </g>
        ))}
        <Texto x={540} y={1340} size={40} color={C.yellow}>
          la fuerza se reparte
        </Texto>
      </g>
      <Texto x={540} y={560} size={44} color={C.cyan} op={aparece(t, T.resistencia)}>
        resistencia
      </Texto>
    </Lienzo>
  );
};

// E. El champán va a ~6 atmósferas, casi el triple que una llanta; sin cúpula, el fondo plano sería el punto débil
export const Presion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.champan2, T.sedimentos], [1, 1.04])}>
        <Botella x={330} y={1400} s={0.9} picada={120} col="#3A5A2A" liquido="#E8D070" />
        <g opacity={aparece(t, T.presion)}>
          {new Array(8).fill(0).map((_, k) => {
            const a = (k / 8) * Math.PI * 2;
            const p = 6 * Math.sin(t * 6);
            return <path key={k} d={`M ${330 + Math.cos(a) * 40} ${1100 + Math.sin(a) * 80} l ${Math.cos(a) * (60 + p)} ${Math.sin(a) * (110 + p)}`} stroke={C.red} strokeWidth={8} />;
          })}
          <Texto x={330} y={1490} size={44} color={C.red}>
            ~6 atm
          </Texto>
        </g>
        <g opacity={aparece(t, T.llanta)}>
          <circle cx={800} cy={1100} r={170} fill="#1A1A22" />
          <circle cx={800} cy={1100} r={80} fill="#8A8A96" />
          <Texto x={800} y={1360} size={40} color={C.white}>
            llanta: ~2 atm
          </Texto>
        </g>
        <Texto x={540} y={560} size={38} color={C.white} op={aparece(t, T.plano)}>
          fondo plano = punto débil
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.presion} color={C.red} />
    </>
  );
};

// F. En el vino tinto, los sedimentos se juntan en el anillo alrededor del hueco
export const Sedimentos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [T.sedimentos, T.anillo + 0.5], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.sedimentos, T.menos], [1.25, 1.3])} cy={1250}>
      <Botella x={540} y={1450} s={1.1} picada={70} />
      {new Array(20).fill(0).map((_, k) => {
        const lado = k % 2 ? 1 : -1;
        const x0 = 540 + lado * (20 + ((k * 37) % 110));
        const y0 = 1000 + ((k * 53) % 300);
        const xf = 540 + lado * (110 + (k % 3) * 10);
        const yf = 1430 - (k % 3) * 10;
        return <circle key={k} cx={x0 + (xf - x0) * baja} cy={y0 + (yf - y0) * baja} r={8} fill="#2A0A10" />;
      })}
      <Texto x={540} y={940} size={36} color="#E8A0B0" op={aparece(t, T.anillo)}>
        se juntan en el anillo
      </Texto>
    </Lienzo>
  );
};

// G. No es para darte menos: la botella sigue teniendo 750 ml
export const Volumen: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.menos, T.paraEso], [1, 1.04])}>
        <Botella x={540} y={1450} s={1.1} picada={70} />
        <Texto x={540} y={560} size={40} color={C.grey} op={aparece(t, T.menos)}>
          ¿menos vino? ✗
        </Texto>
        <Texto x={540} y={1150} size={70} color="#fff" op={aparece(t, T.mililitros)}>
          750 ml
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.mililitros} color={C.yellow} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.paraEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
