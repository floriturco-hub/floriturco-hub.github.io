import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/sim/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  lo: 1.9,
  final: 4.6,
  la: 7.4,
  clave: 9.56,
  operador: 11.46,
  cuando: 14.28,
  numero: 16.8,
  examen: 17.86,
  laSim: 19.26,
  mezcla: 19.92,
  red: 22.22,
  compara: 23.96,
  si: 24.66,
  llamar: 26.26,
  clave2: 28.2,
  aire: 29.58,
  hoy: 32.2,
  esim: 33.58,
  soldado: 35.38,
  eso: 36.66,
  fin: 38.18,
};

const ORO = "#E8C048";
const VERDE = "#5AC878";

// Tarjeta SIM con contactos dorados
const Sim: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -110 -150 L 70 -150 L 110 -110 L 110 150 L -110 150 Z" fill={C.white} />
    <rect x={-70} y={-70} width={140} height={140} rx={16} fill={ORO} />
    <path d="M -70 -20 L 70 -20 M -70 20 L 70 20 M -20 -70 L -20 -20 M 20 -70 L 20 -20 M -20 20 L -20 70 M 20 20 L 20 70" stroke="#A88A28" strokeWidth={5} />
  </g>
);

// Llave
const Llave: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly color?: string }> = ({ x, y, s, color = C.yellow }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={-40} cy={0} r={34} fill="none" stroke={color} strokeWidth={14} />
    <path d="M -6 0 L 70 0 M 50 0 L 50 26 M 66 0 L 66 20" stroke={color} strokeWidth={14} fill="none" />
  </g>
);

// Teléfono
const Telefono: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly children?: React.ReactNode }> = ({ x, y, s, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-280} width={300} height={560} rx={40} fill="#1A1620" />
    <rect x={-130} y={-250} width={260} height={500} rx={24} fill="#2A2640" />
    {children}
  </g>
);

// Antena de la red
const Antena: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -60 200 L 0 -160 L 60 200 M -40 80 L 40 80 M -25 -20 L 25 -20" stroke={C.grey} strokeWidth={12} fill="none" />
    {[1, 2].map((k) => (
      <g key={k}>
        <path d={`M ${-40 - k * 30} ${-200 + k * 10} q ${-30 - k * 10} ${40} 0 ${80}`} stroke={C.cyan} strokeWidth={8} fill="none" />
        <path d={`M ${40 + k * 30} ${-200 + k * 10} q ${30 + k * 10} ${40} 0 ${80}`} stroke={C.cyan} strokeWidth={8} fill="none" />
      </g>
    ))}
  </g>
);

// A. Gancho: ¿qué esconde este chip diminuto?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.lo], [1.12, 1])}>
        <circle cx={540} cy={880} r={330} fill={ORO} opacity={0.08} />
        <Sim x={540} y={880} s={2} rot={-6} />
        <Texto x={820} y={560} size={110} color={C.yellow} op={q}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.78} color={ORO} />
    </>
  );
};

// B. Lo cambias de teléfono y tu número se va con él + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pasa = interpolate(t, [T.lo + 0.3, T.lo + 1.8], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.lo, T.la], [1, 1.05])}>
      <Telefono x={260} y={820} s={0.8} />
      <Telefono x={820} y={820} s={0.8} />
      <Sim x={interpolate(pasa, [0, 1], [260, 820])} y={820 - Math.sin(pasa * Math.PI) * 220} s={0.6} />
      <Texto x={540} y={500} size={40} color={C.yellow} op={aparece(t, T.lo + 1.4)}>
        tu número viaja en la SIM
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1300} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1300}
          width={700 * interpolate(t, [T.final, T.la], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1400} color={C.white} size={36}>
          por qué ya ni hace falta: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Pequeña computadora con clave secreta; el operador guarda una copia
export const Clave: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.la, T.cuando], [1, 1.04])}>
      <Sim x={280} y={820} s={1.3} />
      <g opacity={aparece(t, T.clave)}>
        <rect x={210} y={750} width={140} height={140} rx={16} fill="#2A2640" />
        <Llave x={290} y={820} s={0.8} />
      </g>
      <Texto x={280} y={1080} size={34} color={C.white} op={aparece(t, T.la + 0.5)}>
        SIM: mini computadora
      </Texto>
      <g opacity={aparece(t, T.operador)}>
        <rect x={660} y={620} width={260} height={400} rx={20} fill="#3A3650" />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={690} y={650 + k * 80} width={200} height={50} rx={8} fill="#2A2640" />
        ))}
        <Llave x={800} y={940} s={0.7} />
        <Texto x={790} y={1080} size={34} color={C.white}>
          operador: copia
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Al encender, la red le manda a la SIM un número al azar, como un examen sorpresa
export const Desafio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const viaja = interpolate(t, [T.numero - 0.4, T.examen + 0.4], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.cuando, T.laSim], [1, 1.04])}>
      <Antena x={820} y={820} s={1} />
      <Telefono x={260} y={840} s={0.8}>
        <Sim x={0} y={100} s={0.45} />
      </Telefono>
      <g opacity={aparece(t, T.numero - 0.4)}>
        <rect x={interpolate(viaja, [0, 1], [760, 380]) - 150} y={540} width={300} height={70} rx={14} fill={C.card} stroke={C.cyan} strokeWidth={4} />
        <Texto x={interpolate(viaja, [0, 1], [760, 380])} y={588} size={36} color={C.cyan}>
          48213907
        </Texto>
      </g>
      <Texto x={540} y={1240} size={40} color={C.cyan} op={aparece(t, T.examen)}>
        un examen sorpresa
      </Texto>
    </Lienzo>
  );
};

// E. La SIM mezcla el número con su clave; la red hace el mismo cálculo y compara
export const Calculo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const red = aparece(t, T.red);
  return (
    <Lienzo zoom={interpolate(t, [T.laSim, T.si], [1, 1.04])}>
      {[0, 1].map((k) => {
        const x = k === 0 ? 290 : 790;
        const op = k === 0 ? aparece(t, T.mezcla) : red;
        return (
          <g key={k} opacity={op}>
            <Texto x={x} y={520} size={34} color={C.grey}>
              {k === 0 ? "SIM" : "red"}
            </Texto>
            <rect x={x - 140} y={560} width={280} height={70} rx={14} fill={C.card} stroke={C.cyan} strokeWidth={4} />
            <Texto x={x} y={608} size={32} color={C.cyan}>
              48213907
            </Texto>
            <Texto x={x} y={700} size={50} color={C.white}>
              +
            </Texto>
            <Llave x={x} y={780} s={0.7} />
            <Texto x={x} y={900} size={50} color={C.white}>
              =
            </Texto>
            <rect x={x - 140} y={940} width={280} height={80} rx={14} fill={C.card} stroke={C.yellow} strokeWidth={4} />
            <Texto x={x} y={994} size={40} color={C.yellow}>
              A7F3
            </Texto>
          </g>
        );
      })}
      <Texto x={540} y={1200} size={40} color={VERDE} op={aparece(t, T.compara)}>
        ¿coinciden?
      </Texto>
    </Lienzo>
  );
};

// F. Si coinciden, eres tú: te deja llamar y te cobra a tu línea
export const Ok: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.si, T.clave2], [1, 1.05])}>
        <circle cx={540} cy={760} r={180} fill="none" stroke={VERDE} strokeWidth={14} />
        <path d="M 450 760 L 520 830 L 640 690" stroke={VERDE} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Texto x={540} y={1050} size={52} color={VERDE} op={aparece(t, T.si + 0.3)}>
          ¡eres tú!
        </Texto>
        <Texto x={540} y={1140} size={36} color={C.white} op={aparece(t, T.llamar)}>
          llamadas y datos a tu línea
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.si + 0.3} color={VERDE} />
    </>
  );
};

// G. La clave nunca viaja por el aire: nadie puede copiarla escuchando
export const Aire: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = ((t - T.clave2) * 0.6) % 1;
  return (
    <Lienzo zoom={interpolate(t, [T.clave2, T.hoy], [1, 1.04])}>
      <Telefono x={220} y={860} s={0.6} />
      <Antena x={860} y={860} s={0.8} />
      <line x1={330} y1={760} x2={760} y2={760} stroke={C.cyan} strokeWidth={4} strokeDasharray="14 10" />
      <rect x={330 + u * 380} y={735} width={80} height={50} rx={8} fill={C.card} stroke={C.cyan} strokeWidth={3} />
      <g transform="translate(540 600)" opacity={aparece(t, T.clave2)}>
        <Llave x={0} y={0} s={0.8} />
        <line x1={-80} y1={-60} x2={80} y2={60} stroke={C.red} strokeWidth={12} />
      </g>
      <g opacity={aparece(t, T.aire + 0.6)} transform="translate(540 1050)">
        <circle cx={0} cy={-40} r={50} fill="#4A4466" />
        <rect x={-70} y={10} width={140} height={120} rx={40} fill="#4A4466" />
        <path d="M -40 -40 Q 0 -110 40 -40" stroke={C.grey} strokeWidth={10} fill="none" />
        <path d="M 100 -60 L 160 0 M 160 -60 L 100 0" stroke={C.red} strokeWidth={10} strokeLinecap="round" />
      </g>
      <Texto x={540} y={1300} size={38} color={C.white} op={aparece(t, T.aire)}>
        la clave nunca viaja por el aire
      </Texto>
    </Lienzo>
  );
};

// H. Hoy muchos teléfonos traen eSIM: el mismo chip, soldado por dentro
export const Esim: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.hoy, T.eso], [1, 1.04])}>
      <Telefono x={540} y={860} s={1}>
        <rect x={-110} y={-220} width={220} height={440} rx={16} fill="#1A4A2A" />
        {new Array(6).fill(0).map((_, k) => (
          <line key={k} x1={-100} y1={-180 + k * 70} x2={100} y2={-180 + k * 70} stroke="#3A7A4A" strokeWidth={4} />
        ))}
        <rect x={-40} y={20} width={80} height={60} rx={8} fill={ORO} opacity={aparece(t, T.esim)} />
      </Telefono>
      <Texto x={540} y={1260} size={48} color={ORO} op={aparece(t, T.esim)}>
        eSIM
      </Texto>
      <Texto x={540} y={1340} size={36} color={C.white} op={aparece(t, T.soldado)}>
        el mismo chip, soldado por dentro
      </Texto>
    </Lienzo>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.eso, T.fin + 0.5], [1, 1.12])}>
      <circle cx={540} cy={880} r={330} fill={ORO} opacity={0.08} />
      <Sim x={540} y={880} s={2} rot={-6} />
      <Texto x={820} y={560} size={110} color={C.yellow} op={q}>
        ?
      </Texto>
    </Lienzo>
  );
};
