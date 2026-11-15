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

// Instantes clave (s) de public/audio/humito/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  si: 1.78,
  final: 4.26,
  dentro: 7.56,
  presion: 10.08,
  al: 11.32,
  expande: 13.42,
  y: 14.94,
  enfria: 16.8,
  decenas: 17.68,
  ese: 20.22,
  condensa: 20.76,
  nubecita: 23.4,
  humito: 25.36,
  nube: 27.06,
  champan: 28.14,
  azulada: 32.68,
  porEso: 34.3,
  fin: 35.92,
};

const VIDRIO = "#2A6A4A";
const REFRESCO = "#5A2A1A";
const NIEBLA = "#E8E6F0";

// Botella de refresco centrada en (x,y): cuello arriba
const Botella: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly tapa?: number; readonly color?: string; readonly liquido?: string }> = ({
  x,
  y,
  s,
  tapa = 0,
  color = VIDRIO,
  liquido = REFRESCO,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -40 -330 L 40 -330 L 40 -220 Q 120 -160 120 -60 L 120 300 Q 120 330 90 330 L -90 330 Q -120 330 -120 300 L -120 -60 Q -120 -160 -40 -220 Z" fill={color} opacity={0.85} />
    <path d="M -110 -20 L 110 -20 L 110 300 Q 110 320 90 320 L -90 320 Q -110 320 -110 300 Z" fill={liquido} />
    <rect x={-90} y={-200} width={20} height={460} rx={10} fill={C.white} opacity={0.15} />
    <g transform={`translate(${tapa * 160} ${-tapa * 200}) rotate(${tapa * 160})`} opacity={tapa >= 1 ? 0 : 1}>
      <rect x={-50} y={-370} width={100} height={46} rx={10} fill={C.red} />
    </g>
  </g>
);

// Nubecita de humo saliendo del cuello (cx, cy = boca)
const Nubecita: React.FC<{ readonly cx: number; readonly cy: number; readonly t: number; readonly tam: number; readonly color?: string }> = ({ cx, cy, t, tam, color = NIEBLA }) => (
  <g opacity={tam > 0 ? 1 : 0}>
    {new Array(7).fill(0).map((_, k) => {
      const u = (t * 0.6 + k / 7) % 1;
      return (
        <circle
          key={k}
          cx={cx + Math.sin(u * 5 + k) * 30 * tam}
          cy={cy - u * 220 * tam}
          r={(20 + u * 50) * tam}
          fill={color}
          opacity={0.55 * (1 - u)}
        />
      );
    })}
  </g>
);

// Imagen del gancho y del cierre: botella abierta con humito
const BotellaHumo: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Botella x={540} y={1050} s={1.3} tapa={1} />
    <Nubecita cx={540} cy={620} t={t} tam={1} />
    <Texto x={820} y={560} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué sale humo de tu refresco?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.si], [1.12, 1])}>
        <BotellaHumo t={t} q={interpolate(t, [0.4, 0.8], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.46} />
    </>
  );
};

// B. Si está helado, ¿cómo puede echar humo? + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.dentro], [1, 1.05])}>
      <Botella x={400} y={880} s={0.9} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={250 + k * 110} y={1170 + (k % 2) * 20} width={90} height={80} rx={14} fill="#A8E0F0" opacity={0.8} transform={`rotate(${k * 12 - 10} ${295 + k * 110} 1210)`} />
      ))}
      <g transform="translate(780 820)" opacity={aparece(t, T.si)}>
        <rect x={-30} y={-200} width={60} height={280} rx={30} fill="#2A2440" />
        <rect x={-16} y={20} width={32} height={60} rx={16} fill={C.cyan} />
        <circle cx={0} cy={110} r={50} fill={C.cyan} />
      </g>
      <Texto x={780} y={1050} size={38} color={C.cyan} op={aparece(t, T.si)}>
        helado
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.dentro], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={36}>
          por qué en el champán es más grande: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Moléculas de gas en una zona
const Gas: React.FC<{ readonly cx: number; readonly cy: number; readonly radio: number; readonly t: number; readonly n?: number; readonly color?: string }> = ({
  cx,
  cy,
  radio,
  t,
  n = 30,
  color = C.white,
}) => (
  <g>
    {new Array(n).fill(0).map((_, k) => {
      const a = random(`ga${k}`) * Math.PI * 2;
      const d = Math.sqrt(random(`gd${k}`)) * radio;
      return <circle key={k} cx={cx + Math.cos(a + t * 0.5) * d} cy={cy + Math.sin(a + t * 0.5) * d * 0.7} r={10} fill={color} opacity={0.85} />;
    })}
  </g>
);

// C. Dentro el gas está apretado, a mucha presión
export const Presion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.dentro, T.al], [1, 1.05])}>
      <Botella x={540} y={980} s={1.3} />
      <Gas cx={540} cy={700} radio={90} t={t * 6} n={34} />
      <g opacity={aparece(t, T.presion - 0.6)} transform="translate(860 700)">
        <circle r={90} fill="#2A2640" stroke={C.grey} strokeWidth={8} />
        <line x1={0} y1={0} x2={Math.cos(-0.4) * 70} y2={Math.sin(-0.4) * 70} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
        <circle r={10} fill={C.white} />
      </g>
      <Texto x={540} y={500} size={40} color={C.white} op={aparece(t, T.dentro + 0.6)}>
        gas apretado
      </Texto>
      <Texto x={860} y={840} size={32} color={C.red} op={aparece(t, T.presion)}>
        presión alta
      </Texto>
    </Lienzo>
  );
};

// D. Al abrirla, el gas escapa de golpe y se expande muy rápido
export const Escapa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = interpolate(t, [T.al + 0.3, T.y], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.al, T.y], [1, 1.05])}>
        <Botella x={540} y={980} s={1.3} tapa={interpolate(t, [T.al + 0.2, T.al + 0.6], [0, 1], clamp)} />
        <Gas cx={540} cy={interpolate(sale, [0, 1], [700, 580])} radio={interpolate(sale, [0, 1], [90, 320])} t={t * 6} n={34} />
        <Texto x={540} y={1500} size={40} color={C.white} op={aparece(t, T.expande)}>
          se expande de golpe
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.al + 0.3} />
    </>
  );
};

// E. Cuando un gas se expande de golpe se enfría: decenas de grados en un instante
export const Enfria: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const temp = Math.round(interpolate(t, [T.enfria - 0.2, T.decenas + 1.4], [5, -40], suave));
  const nivel = interpolate(temp, [-40, 5], [0.08, 0.6]);
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.ese], [1, 1.05])}>
      <Gas cx={540} cy={760} radio={interpolate(t, [T.y, T.ese], [200, 360], clamp)} t={t * 3} n={30} color="#A8E0F0" />
      <g transform="translate(540 1160)">
        <rect x={-30} y={-200} width={60} height={280} rx={30} fill="#2A2440" />
        <rect x={-16} y={80 - 280 * nivel} width={32} height={280 * nivel} rx={16} fill={C.cyan} />
        <circle cx={0} cy={110} r={50} fill={C.cyan} />
      </g>
      <Texto x={540} y={1400} size={60} color={C.cyan} op={aparece(t, T.enfria)}>
        {`${temp} °C`}
      </Texto>
      <Texto x={540} y={500} size={40} color={C.white} op={aparece(t, T.enfria)}>
        se expande = se enfría
      </Texto>
    </Lienzo>
  );
};

// F. Ese frío condensa el vapor de agua del cuello y forma una nubecita de gotitas
export const Condensa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gotas = interpolate(t, [T.condensa + 0.3, T.nubecita], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.ese, T.humito], [1, 1.05])}>
      <rect x={380} y={900} width={320} height={500} rx={20} fill={VIDRIO} opacity={0.85} />
      {new Array(26).fill(0).map((_, k) => {
        const x = 300 + random(`vx${k}`) * 480 + Math.sin(t * 2 + k) * 10;
        const y = 480 + random(`vy${k}`) * 380 + Math.cos(t * 2 + k) * 10;
        return (
          <circle
            key={k}
            cx={x}
            cy={y}
            r={interpolate(gotas, [0, 1], [8, 20 + random(`vr${k}`) * 14])}
            fill={gotas > 0.5 ? NIEBLA : C.cyan}
            opacity={gotas > 0.5 ? 0.7 : 0.9}
          />
        );
      })}
      <Texto x={540} y={1480} size={38} color={C.cyan} op={aparece(t, T.condensa) * (1 - gotas)}>
        vapor de agua invisible
      </Texto>
      <Texto x={540} y={1480} size={38} color={NIEBLA} op={gotas}>
        … se vuelve gotitas
      </Texto>
    </Lienzo>
  );
};

// G. Ese humito no es humo: es una nube en miniatura
export const Mini: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.humito, T.champan], [1, 1.06])}>
      <g transform="translate(540 820)">
        <circle cx={-120} cy={20} r={110} fill={NIEBLA} />
        <circle cx={20} cy={-50} r={150} fill={NIEBLA} />
        <circle cx={160} cy={20} r={110} fill={NIEBLA} />
        <rect x={-230} y={20} width={500} height={110} rx={55} fill={NIEBLA} />
      </g>
      <Tarjeta x={190} y={1100} w={700} h={130} op={aparece(t, T.nube)}>
        <Texto x={540} y={1180} size={44} color={C.yellow}>
          una nube en miniatura
        </Texto>
      </Tarjeta>
    </Lienzo>
  );
};

// H. En el champán la presión es mucho mayor: la nube sale más grande, a veces azulada
export const Champan: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pop = interpolate(t, [T.champan + 0.6, T.champan + 1.0], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.champan, T.porEso], [1, 1.04])}>
        <g transform="translate(540 1080) rotate(-20)">
          <path d="M -36 -380 L 36 -380 L 36 -240 Q 130 -160 130 -40 L 130 300 L -130 300 L -130 -40 Q -130 -160 -36 -240 Z" fill="#1A3A2A" />
          <rect x={-40} y={-390} width={80} height={120} fill="#C8A848" />
        </g>
        <g transform={`translate(${430 - pop * 200} ${700 - pop * 300})`}>
          <rect x={-30} y={-40} width={60} height={70} rx={12} fill="#C89A6A" opacity={pop} />
        </g>
        <Nubecita cx={410} cy={720} t={t} tam={pop * 1.8} color={aparece(t, T.azulada) > 0.5 ? "#8AB8F0" : NIEBLA} />
        <Texto x={540} y={1480} size={40} color="#8AB8F0" op={aparece(t, T.azulada)}>
          a veces, azulada
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.champan + 0.6} />
    </>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <BotellaHumo t={t} q={1} />
    </Lienzo>
  );
};
