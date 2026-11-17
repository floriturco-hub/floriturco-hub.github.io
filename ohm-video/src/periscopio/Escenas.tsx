import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/periscopio/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  aumentos: 2.82, // aumentos
  lentes: 3.68, // lentes
  pero: 4.78, // pero
  delgado: 5.70, // delgado
  final: 6.66, // final
  truco: 9.16, // truco
  acostarlo: 9.80, // acostarlo
  luz: 10.92, // luz
  ventanita: 11.78, // ventanita
  prisma: 13.60, // prisma
  desvia: 14.22, // desvia
  ahora: 15.88, // ahora
  largo: 16.80, // largo
  espacio: 18.46, // espacio
  atraviesa: 19.24, // atraviesa
  llega: 22.16, // llega
  sensor: 22.72, // sensor
  pie: 23.60, // pie
  lado: 25.44, // lado
  periscopio: 26.46, // periscopio
  acostado: 27.94, // acostado
  ahi: 28.46, // ahi
  fin: 30.30, // FIN
};

const LUZ = C.yellow;
const VIDRIO = "#8AC8F8";

// Celular visto por detrás con cámaras
const Espalda: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-390} width={400} height={780} rx={56} fill="#2A2640" stroke="#5A5478" strokeWidth={8} />
    <rect x={-170} y={-360} width={200} height={260} rx={40} fill="#1A1630" />
    {[
      [-120, -300],
      [-120, -160],
    ].map(([cx, cy], k) => (
      <g key={k}>
        <circle cx={cx} cy={cy} r={46} fill="#0A0818" stroke="#5A5478" strokeWidth={6} />
        <circle cx={cx} cy={cy} r={20} fill="#2A3A6A" />
      </g>
    ))}
    <rect x={-20} y={-270} width={44} height={44} rx={6} fill="#0A0818" stroke="#5A5478" strokeWidth={5} />
  </g>
);

// Corte lateral del teléfono acostado: ventana, prisma, lentes y sensor; p = recorrido de la luz (0-1)
const Corte: React.FC<{ readonly p: number; readonly prisma: number; readonly lentes: number; readonly sensor: number; readonly t: number }> = ({
  p,
  prisma,
  lentes,
  sensor,
  t,
}) => {
  const tramo1 = Math.min(1, p * 3);
  const tramo2 = Math.max(0, (p - 0.33) / 0.67);
  return (
    <g>
      <rect x={80} y={820} width={920} height={200} rx={40} fill="#2A2640" stroke="#5A5478" strokeWidth={8} />
      <rect x={100} y={840} width={880} height={160} rx={30} fill="#141030" />
      <rect x={170} y={812} width={80} height={24} fill={VIDRIO} />
      <polygon points="150,850 260,850 260,960" fill={VIDRIO} opacity={0.4 + 0.6 * prisma} stroke={C.white} strokeWidth={3} />
      <g opacity={lentes}>
        {[420, 540, 660].map((x) => (
          <ellipse key={x} cx={x} cy={920} rx={22} ry={60} fill={VIDRIO} opacity={0.75} stroke={C.white} strokeWidth={3} />
        ))}
      </g>
      <rect x={900} y={860} width={26} height={120} fill={C.cyan} opacity={sensor} />
      <line x1={210} y1={560} x2={210} y2={560 + 360 * tramo1} stroke={LUZ} strokeWidth={10} />
      <line x1={210} y1={920} x2={210 + 690 * tramo2} y2={920} stroke={LUZ} strokeWidth={10} opacity={tramo2 > 0 ? 1 : 0} />
      <circle cx={210} cy={560 + 360 * tramo1} r={14} fill={LUZ} opacity={tramo1 < 1 ? 0.9 + 0.1 * Math.sin(t * 10) : 0} />
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Espalda x={540} y={960} s={1.05} />
    <Texto x={700} y={780} size={90} color={C.yellow}>
      5×
    </Texto>
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿dónde cabe el zoom de tu celular?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.aumentos], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Un zoom 5x necesita lentes largos, pero tu celular es delgado + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tubo = aparece(t, T.lentes);
  return (
    <Lienzo zoom={interpolate(t, [T.aumentos, T.truco], [1, 1.05])}>
      {/* teléfono de canto */}
      <rect x={160} y={980} width={760} height={50} rx={20} fill="#2A2640" stroke="#5A5478" strokeWidth={6} />
      <g opacity={tubo}>
        <rect x={220} y={600 + 380 * (1 - tubo)} width={120} height={380} rx={16} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="20 12" />
        {[680, 780, 880].map((y) => (
          <ellipse key={y} cx={280} cy={y} rx={52} ry={14} fill={VIDRIO} opacity={0.7} />
        ))}
        <Texto x={560} y={760} size={36} color={C.red}>
          lentes largos
        </Texto>
      </g>
      <g opacity={aparece(t, T.delgado)}>
        <path d="M 960 980 L 960 1030 M 940 980 L 980 980 M 940 1030 L 980 1030" stroke={C.cyan} strokeWidth={5} />
        <Texto x={760} y={1100} size={36} color={C.cyan}>
          tu celular: delgado
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.truco], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          funciona como un submarino
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. El truco es acostarlo
export const Acostar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const giro = interpolate(t, [T.acostarlo, T.acostarlo + 0.6], [-90, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.truco, T.luz], [1, 1.04])}>
        <rect x={80} y={820} width={920} height={200} rx={40} fill="#2A2640" stroke="#5A5478" strokeWidth={8} />
        <g transform={`rotate(${giro} 260 920)`}>
          <rect x={260} y={880} width={480} height={80} rx={16} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="20 12" />
          {[400, 500, 600].map((x) => (
            <ellipse key={x} cx={x} cy={920} rx={14} ry={46} fill={VIDRIO} opacity={0.75} />
          ))}
        </g>
        <Texto x={540} y={1150} size={46} color={C.yellow} op={aparece(t, T.acostarlo)}>
          ¡acostado!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.acostarlo + 0.6} color={C.yellow} />
    </>
  );
};

// D. La luz entra, un prisma la desvía 90°, viaja a lo largo y atraviesa lentes hasta el sensor
export const Camino: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.luz, T.desvia + 0.3, T.llega + 0.5], [0, 0.34, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.luz, T.periscopio], [1, 1.05])}>
        <Corte p={p} prisma={aparece(t, T.prisma)} lentes={aparece(t, T.atraviesa)} sensor={aparece(t, T.sensor)} t={t} />
        <Texto x={360} y={600} size={34} color={C.white} op={aparece(t, T.ventanita) * (1 - aparece(t, T.prisma))}>
          ventanita
        </Texto>
        <Texto x={420} y={720} size={36} color={VIDRIO} op={aparece(t, T.prisma) * (1 - aparece(t, T.ahora))}>
          prisma: 90°
        </Texto>
        <Texto x={540} y={1110} size={36} color={C.white} op={aparece(t, T.espacio) * (1 - aparece(t, T.atraviesa))}>
          a lo largo, donde hay espacio
        </Texto>
        <Texto x={540} y={1110} size={36} color={VIDRIO} op={aparece(t, T.atraviesa) * (1 - aparece(t, T.sensor))}>
          varios lentes
        </Texto>
        <Texto x={760} y={1110} size={36} color={C.cyan} op={aparece(t, T.sensor)}>
          sensor de pie
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.desvia} color={C.yellow} />
    </>
  );
};

// E. Como el periscopio de un submarino, pero acostado
export const Submarino: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const giro = interpolate(t, [T.acostado, T.acostado + 0.6], [0, 90], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.periscopio, T.ahi], [1, 1.04])}>
        <rect x={0} y={1200} width={1080} height={300} fill="#1A4A7A" opacity={0.5} />
        <g transform={`rotate(${giro} 540 900)`}>
          <path d="M 500 560 L 500 1180 L 580 1180 L 580 640 L 680 640 L 680 560 Z" fill="#5A5478" />
          <line x1={520} y1={580} x2={560} y2={620} stroke={VIDRIO} strokeWidth={10} />
          <line x1={520} y1={1140} x2={560} y2={1100} stroke={VIDRIO} strokeWidth={10} />
          <path d="M 700 600 L 540 600 L 540 1120 L 700 1120" stroke={LUZ} strokeWidth={6} fill="none" strokeDasharray="14 10" opacity={0.8} />
        </g>
        <Texto x={540} y={500} size={44} color={C.white} op={aparece(t, T.periscopio)}>
          periscopio
        </Texto>
        <Texto x={540} y={1380} size={44} color={C.yellow} op={aparece(t, T.acostado)}>
          ...pero acostado
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.acostado + 0.6} color={C.yellow} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.ahi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
