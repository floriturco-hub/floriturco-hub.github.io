import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/guitarra/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  mismas: 2.04,
  oye: 4.44,
  final: 5.86,
  una: 8.2,
  delgada: 9.54,
  aire: 10.22,
  en: 12.92,
  puente: 14.82,
  tapa: 16.1,
  esa: 18.54,
  tambor: 20.66,
  cuerpo: 21.98,
  resonancia: 24.24,
  el: 26.4,
  agujero: 26.82,
  graves: 29.86,
  la: 31.04,
  macizo: 32.42,
  imanes: 34.84,
  amplificador: 36.34,
  porEso: 37.24,
  fin: 39.12,
};

const MADERA = "#D8A060";
const MADERA_OSC = "#8A5A30";

// Guitarra acústica vertical centrada en (x,y)
const Acustica: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-22} y={-560} width={44} height={420} fill={MADERA_OSC} />
    <rect x={-36} y={-640} width={72} height={90} rx={12} fill={MADERA_OSC} />
    <circle cx={0} cy={-60} r={140} fill={MADERA} />
    <circle cx={0} cy={140} r={180} fill={MADERA} />
    <rect x={-120} y={-60} width={240} height={200} fill={MADERA} />
    <circle cx={0} cy={0} r={55} fill="#2A1A10" />
    <rect x={-60} y={180} width={120} height={20} rx={6} fill="#4A2A10" />
    {[-15, -5, 5, 15].map((dx) => (
      <line key={dx} x1={dx} y1={-620} x2={dx} y2={190} stroke="#E8E6F0" strokeWidth={2} />
    ))}
  </g>
);

// Guitarra eléctrica vertical
const Electrica: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly cable?: number }> = ({ x, y, s, cable = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-20} y={-560} width={40} height={440} fill="#3A2A20" />
    <rect x={-32} y={-640} width={64} height={90} rx={12} fill="#3A2A20" />
    <path d="M -150 -120 Q -170 -180 -110 -170 Q -60 -160 -40 -120 L 40 -120 Q 60 -200 120 -190 Q 170 -170 140 -60 Q 190 60 140 200 Q 60 260 -40 230 Q -170 200 -150 60 Q -120 -20 -150 -120 Z" fill={C.red} />
    {[-40, 40].map((dy) => (
      <rect key={dy} x={-50} y={dy - 12} width={100} height={24} rx={6} fill="#1A1620" />
    ))}
    {[-12, -4, 4, 12].map((dx) => (
      <line key={dx} x1={dx} y1={-620} x2={dx} y2={140} stroke="#E8E6F0" strokeWidth={2} />
    ))}
    <path d={`M 120 160 Q 220 ${200 + cable * 40} ${260 + cable * 40} ${120 + cable * 160}`} stroke="#1A1620" strokeWidth={10} fill="none" />
  </g>
);

// Ondas de sonido concéntricas
const Ondas: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly fuerza: number; readonly color?: string }> = ({ x, y, t, fuerza, color = C.cyan }) => (
  <g>
    {[0, 1, 2, 3].map((k) => {
      const u = (t * 0.8 + k / 4) % 1;
      return <circle key={k} cx={x} cy={y} r={40 + u * 300 * fuerza} fill="none" stroke={color} strokeWidth={6 * fuerza + 1} opacity={(1 - u) * Math.min(1, fuerza + 0.2)} />;
    })}
  </g>
);

// A. Gancho: ¿por qué esta guitarra suena más fuerte?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.mismas], [1.12, 1])}>
        <Ondas x={330} y={1000} t={t} fuerza={1} />
        <Acustica x={330} y={1000} s={0.85} />
        <Ondas x={780} y={1000} t={t} fuerza={0.15} />
        <Electrica x={780} y={1000} s={0.85} />
        <Texto x={540} y={1400} size={110} color={C.yellow} op={q}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.84} color={C.cyan} />
    </>
  );
};

// B. Mismas cuerdas, pero la eléctrica desconectada apenas se oye + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.mismas, T.una], [1, 1.05])}>
      <Ondas x={540} y={900} t={t} fuerza={0.12} />
      <Electrica x={540} y={950} s={0.9} cable={1} />
      <Texto x={540} y={1300} size={38} color={C.grey} op={aparece(t, T.oye - 0.6)}>
        desconectada: apenas se oye
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1380} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1380}
          width={700 * interpolate(t, [T.final, T.una], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1480} color={C.white} size={40}>
          el truco del agujero: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Una cuerda sola es muy delgada: casi no mueve aire
export const Cuerda: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const a = Math.sin(t * 40) * 30;
  return (
    <Lienzo zoom={interpolate(t, [T.una, T.en], [1, 1.04])}>
      <rect x={120} y={760} width={20} height={120} fill={C.grey} />
      <rect x={940} y={760} width={20} height={120} fill={C.grey} />
      <path d={`M 140 820 Q 540 ${820 + a} 940 820`} stroke="#E8E6F0" strokeWidth={4} fill="none" />
      {[0, 1].map((k) => {
        const u = (t * 0.8 + k / 2) % 1;
        return <ellipse key={k} cx={540} cy={820} rx={60 + u * 80} ry={20 + u * 40} fill="none" stroke={C.cyan} strokeWidth={3} opacity={(1 - u) * 0.5} />;
      })}
      <Texto x={540} y={1050} size={38} color={C.white} op={aparece(t, T.delgada)}>
        muy delgada
      </Texto>
      <Texto x={540} y={1120} size={36} color={C.grey} op={aparece(t, T.aire)}>
        casi no mueve aire
      </Texto>
    </Lienzo>
  );
};

// D. En la acústica, la cuerda pasa por el puente y hace vibrar la tapa de madera
export const Puente: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vib = aparece(t, T.tapa) * Math.sin(t * 30) * 24;
  return (
    <Lienzo zoom={interpolate(t, [T.en, T.esa], [1, 1.04])}>
      {/* corte lateral de la guitarra */}
      <path d={`M 140 900 Q 540 ${900 + vib} 940 900`} stroke={MADERA} strokeWidth={22} fill="none" />
      <path d="M 140 900 L 140 1180 L 940 1180 L 940 900" stroke={MADERA_OSC} strokeWidth={18} fill="none" />
      <rect x={600} y={850 + vib * 0.6} width={60} height={40} rx={6} fill="#4A2A10" />
      <line x1={80} y1={820} x2={630} y2={850 + vib * 0.6} stroke="#E8E6F0" strokeWidth={4} />
      <Texto x={630} y={800} size={32} color={C.orange} op={aparece(t, T.puente)}>
        puente
      </Texto>
      <Texto x={540} y={1280} size={38} color={MADERA} op={aparece(t, T.tapa)}>
        la tapa de madera vibra
      </Texto>
    </Lienzo>
  );
};

// E. La tapa mueve mucho más aire, como un tambor; el cuerpo hueco es una caja de resonancia
export const Tambor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vib = Math.sin(t * 30) * 24;
  const caja = aparece(t, T.cuerpo);
  return (
    <Lienzo zoom={interpolate(t, [T.esa, T.el], [1, 1.04])}>
      <Ondas x={540} y={760} t={t} fuerza={0.9} />
      <path d={`M 140 900 Q 540 ${900 + vib} 940 900`} stroke={MADERA} strokeWidth={22} fill="none" />
      <path d="M 140 900 L 140 1180 L 940 1180 L 940 900" stroke={MADERA_OSC} strokeWidth={18} fill="none" />
      <g opacity={caja}>
        <path d={`M 160 1040 Q 350 ${1040 - vib * 2} 540 1040 Q 730 ${1040 + vib * 2} 920 1040`} stroke={C.yellow} strokeWidth={6} fill="none" />
        <Texto x={540} y={1120} size={30} color={C.yellow}>
          caja de resonancia
        </Texto>
      </g>
      <Texto x={540} y={1290} size={38} color={C.cyan} op={aparece(t, T.esa + 0.4)}>
        mueve muchísimo más aire
      </Texto>
      <Texto x={540} y={1360} size={34} color={C.white} op={aparece(t, T.tambor)}>
        como el parche de un tambor
      </Texto>
    </Lienzo>
  );
};

// F. El agujero deja entrar y salir el aire de dentro y refuerza los graves
export const Agujero: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = Math.sin(t * 6);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.el, T.la], [1, 1.04])}>
        <circle cx={540} cy={820} r={300} fill={MADERA} />
        <circle cx={540} cy={820} r={130} fill="#2A1A10" />
        {[-1, 0, 1].map((k) => (
          <g key={k} opacity={aparece(t, T.agujero)}>
            <line x1={540 + k * 60} y1={820} x2={540 + k * 60} y2={820 - 160 * sale} stroke={C.cyan} strokeWidth={10} />
            <path d={`M ${520 + k * 60} ${820 - 160 * sale + (sale > 0 ? 10 : -10)} L ${540 + k * 60} ${820 - 190 * sale} L ${560 + k * 60} ${820 - 160 * sale + (sale > 0 ? 10 : -10)} Z`} fill={C.cyan} />
          </g>
        ))}
        <Texto x={540} y={1210} size={38} color={C.cyan} op={aparece(t, T.agujero + 0.4)}>
          el aire entra y sale
        </Texto>
        <Texto x={540} y={1290} size={40} color={C.yellow} op={aparece(t, T.graves)}>
          refuerza los graves
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.graves} color={C.yellow} />
    </>
  );
};

// G. La eléctrica tiene un cuerpo macizo que casi no vibra: su sonido lo captan los imanes y lo saca el amplificador
export const Electricidad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const amp = aparece(t, T.amplificador - 0.6);
  return (
    <Lienzo zoom={interpolate(t, [T.la, T.porEso], [1, 1.04])}>
      <Electrica x={360} y={980} s={0.85} />
      <g opacity={aparece(t, T.imanes)}>
        {[-40, 40].map((dy) => (
          <rect key={dy} x={360 - 46} y={980 + dy * 0.85 - 12} width={92} height={22} rx={6} fill="none" stroke={C.yellow} strokeWidth={5} />
        ))}
        <Texto x={360} y={1250} size={32} color={C.yellow}>
          imanes
        </Texto>
      </g>
      <g opacity={amp}>
        <path d="M 480 1120 Q 600 1240 700 1080" stroke="#1A1620" strokeWidth={10} fill="none" />
        <rect x={680} y={880} width={280} height={300} rx={20} fill="#2A2640" stroke={C.grey} strokeWidth={6} />
        <circle cx={820} cy={1030} r={100} fill="#1A1620" />
        <Ondas x={820} y={1030} t={t} fuerza={0.9} />
      </g>
      <Texto x={540} y={1340} size={36} color={C.grey} op={aparece(t, T.macizo)}>
        cuerpo macizo: casi no vibra
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Ondas x={330} y={1000} t={t} fuerza={1} />
      <Acustica x={330} y={1000} s={0.85} />
      <Ondas x={780} y={1000} t={t} fuerza={0.15} />
      <Electrica x={780} y={1000} s={0.85} />
      <Texto x={540} y={1400} size={110} color={C.yellow} op={q}>
        ?
      </Texto>
    </Lienzo>
  );
};
