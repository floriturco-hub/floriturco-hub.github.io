import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/atomico/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  ni: 2.26,
  anos: 4.04,
  final: 4.76,
  todo: 7.24,
  pendulo: 9.48,
  cuarzo: 10.38,
  pero: 12.12,
  desgasta: 12.9,
  calor: 13.66,
  atomico: 15.46,
  cesio: 18.42,
  electron: 19.96,
  salta: 20.8,
  microonda: 21.76,
  numero: 23.32,
  vibraciones: 25.46,
  ajusta: 26.54,
  maximo: 29.96,
  desvia: 30.86,
  corrige: 31.76,
  gps: 33.2,
  porque: 36.12,
  fin: 38.64,
};

// Esfera de reloj
const Reloj: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly a: number }> = ({ x, y, r, a }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#120F22" stroke={C.cyan} strokeWidth={r * 0.06} />
    {new Array(12).fill(0).map((_, k) => (
      <line key={k} x1={0} y1={-r * 0.8} x2={0} y2={-r * 0.92} stroke={C.cyan} strokeWidth={r * 0.04} transform={`rotate(${k * 30})`} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-r * 0.72} stroke={C.white} strokeWidth={r * 0.04} strokeLinecap="round" transform={`rotate(${a * 360})`} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.48} stroke={C.yellow} strokeWidth={r * 0.06} strokeLinecap="round" transform={`rotate(${a * 30})`} />
    <circle r={r * 0.06} fill={C.white} />
  </g>
);

// Átomo: núcleo con órbitas elípticas
const Atomo: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number; readonly op?: number; readonly color?: string }> = ({
  x,
  y,
  s,
  t,
  op = 1,
  color = C.cyan,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    {[0, 60, 120].map((a, k) => (
      <g key={a} transform={`rotate(${a})`}>
        <ellipse rx={160} ry={55} fill="none" stroke={color} strokeWidth={5} opacity={0.7} />
        <circle cx={160 * Math.cos(t * 3 + k * 2)} cy={55 * Math.sin(t * 3 + k * 2)} r={12} fill={C.white} />
      </g>
    ))}
    <circle r={30} fill={C.yellow} />
  </g>
);

// Imagen del gancho y del cierre: reloj dentro de un átomo
const RelojAtomo: React.FC<{ readonly t: number; readonly brillo: number }> = ({ t, brillo }) => (
  <>
    <circle cx={540} cy={880} r={340} fill={C.cyan} opacity={0.08 * brillo} />
    <Atomo x={540} y={880} s={2.1} t={t} op={brillo} />
    <Reloj x={540} y={880} r={150} a={t * 0.2} />
  </>
);

// A. Gancho: este reloj no se atrasa jamás
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.ni], [1.12, 1])}>
        <RelojAtomo t={t} brillo={interpolate(t, [0.6, 1.0], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={1.08} color={C.cyan} />
    </>
  );
};

// B. Ni un segundo en cien millones de años + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const anos = Math.round(interpolate(t, [T.ni, T.anos + 0.4], [0, 100], suave));
  return (
    <Lienzo zoom={interpolate(t, [T.ni, T.todo], [1, 1.05])}>
      <Tarjeta x={140} y={560} w={800} h={420}>
        <Texto x={540} y={660} size={36} color={C.grey}>
          tiempo
        </Texto>
        <Texto x={540} y={770} size={80} color={C.white}>
          {`${anos} M años`}
        </Texto>
        <Texto x={540} y={880} size={36} color={C.grey}>
          error
        </Texto>
        <Texto x={540} y={950} size={60} color="#5AC878">
          0 s
        </Texto>
      </Tarjeta>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.todo], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={40}>
          lo usas cada día: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Péndulo; amp = amplitud en grados
const Pendulo: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly amp: number; readonly color?: string }> = ({
  x,
  y,
  t,
  amp,
  color = C.yellow,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 4) * amp})`}>
    <line x1={0} y1={0} x2={0} y2={380} stroke={C.grey} strokeWidth={8} />
    <circle cx={0} cy={400} r={50} fill={color} />
  </g>
);

// Cristal de cuarzo vibrando
const Cuarzo: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly color?: string }> = ({ x, y, t, color = "#C8B8F0" }) => {
  const v = Math.sin(t * 60) * 4;
  return (
    <g transform={`translate(${x + v} ${y})`}>
      <polygon points="0,-180 70,-110 70,120 0,180 -70,120 -70,-110" fill={color} opacity={0.85} />
      <polygon points="0,-180 70,-110 0,-60 -70,-110" fill={C.white} opacity={0.4} />
    </g>
  );
};

// C. Todo reloj cuenta algo que se repite: péndulo o cuarzo
export const Repite: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.todo, T.pero], [1, 1.04])}>
      <g opacity={aparece(t, T.todo + 0.3)}>
        <rect x={180} y={560} width={240} height={20} rx={6} fill={C.grey} />
        <Pendulo x={300} y={580} t={t} amp={22} />
        <Texto x={300} y={1150} size={38} color={C.yellow}>
          péndulo
        </Texto>
      </g>
      <g opacity={aparece(t, T.cuarzo)}>
        <Cuarzo x={780} y={820} t={t} />
        {[0, 1].map((k) => (
          <path key={k} d={`M ${670 - k * 30} 760 q -20 60 0 120 M ${890 + k * 30} 760 q 20 60 0 120`} stroke={C.cyan} strokeWidth={6} fill="none" opacity={0.5 + 0.5 * Math.sin(t * 20 + k)} />
        ))}
        <Texto x={780} y={1150} size={38} color="#C8B8F0">
          cuarzo
        </Texto>
      </g>
      <Texto x={540} y={1270} size={36} color={C.white} op={aparece(t, T.cuarzo + 0.6)}>
        tic, tic, tic… contar = medir el tiempo
      </Texto>
    </Lienzo>
  );
};

// D. El péndulo se desgasta y el cuarzo cambia con el calor
export const Fallas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gasta = interpolate(t, [T.desgasta, T.atomico], [22, 6], clamp);
  const calor = aparece(t, T.calor);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.atomico], [1, 1.04])}>
      <rect x={180} y={560} width={240} height={20} rx={6} fill={C.grey} />
      <Pendulo x={300} y={580} t={t} amp={gasta} color="#A8702A" />
      <Texto x={300} y={1150} size={34} color={C.red} op={aparece(t, T.desgasta)}>
        se desgasta
      </Texto>
      <Cuarzo x={780} y={820} t={t} color={calor > 0.5 ? "#F0A0A0" : "#C8B8F0"} />
      <g opacity={calor}>
        <rect x={900} y={600} width={40} height={200} rx={20} fill="#2A2440" />
        <rect x={900} y={660} width={40} height={140} rx={20} fill={C.red} />
        <circle cx={920} cy={810} r={34} fill={C.red} />
        <Texto x={780} y={1150} size={34} color={C.red}>
          cambia con el calor
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Un reloj atómico cuenta algo que nunca cambia: átomos de cesio
export const Cesio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const muchos = aparece(t, T.cesio);
  return (
    <Lienzo zoom={interpolate(t, [T.atomico, T.electron], [1, 1.04])}>
      <g opacity={1 - muchos}>
        <Atomo x={540} y={900} s={1.8} t={t} />
      </g>
      <g opacity={muchos}>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <Atomo key={k} x={250 + (k % 3) * 290} y={700 + Math.floor(k / 3) * 300} s={0.75} t={t} />
        ))}
        <Texto x={540} y={1280} size={44} color={C.yellow}>
          cesio: todos idénticos
        </Texto>
      </g>
      <Texto x={540} y={520} size={38} color={C.white} op={aparece(t, T.atomico + 0.6) * (1 - muchos)}>
        algo que nunca cambia
      </Texto>
    </Lienzo>
  );
};

// F. El electrón solo salta con una microonda exacta: 9.192 millones por segundo
export const Salto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const onda = aparece(t, T.microonda);
  const sube = interpolate(t, [T.microonda + 0.5, T.microonda + 1.0], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.electron, T.ajusta], [1, 1.04])}>
        <circle cx={540} cy={800} r={40} fill={C.yellow} />
        <circle cx={540} cy={800} r={150} fill="none" stroke={C.grey} strokeWidth={5} strokeDasharray="12 10" />
        <circle cx={540} cy={800} r={260} fill="none" stroke={C.cyan} strokeWidth={5} strokeDasharray="12 10" />
        <circle
          cx={540 + interpolate(sube, [0, 1], [150, 260]) * Math.cos(t * 2)}
          cy={800 + interpolate(sube, [0, 1], [150, 260]) * Math.sin(t * 2)}
          r={22}
          fill={C.white}
        />
        <path
          d={new Array(40)
            .fill(0)
            .map((_, k) => `${k === 0 ? "M" : "L"} ${60 + k * 12} ${1120 + Math.sin(k * 0.9 - t * 12) * 30}`)
            .join(" ")}
          stroke={C.purpleLight}
          strokeWidth={8}
          fill="none"
          opacity={onda}
        />
        <Texto x={300} y={1200} size={32} color={C.purpleLight} op={onda}>
          microonda
        </Texto>
        <Texto x={540} y={1320} size={60} color={C.yellow} op={aparece(t, T.numero)}>
          9.192.631.770
        </Texto>
        <Texto x={540} y={1390} size={34} color={C.white} op={aparece(t, T.vibraciones)}>
          vibraciones por segundo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.microonda + 1.0} color={C.cyan} />
    </>
  );
};

// G. El reloj ajusta su microonda hasta el máximo de saltos y corrige cualquier desvío
export const Ajuste: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  // posición de la frecuencia respecto al pico (0 = en el pico)
  const busca = interpolate(t, [T.ajusta + 0.5, T.maximo], [-1.6, 0], suave);
  const desvio = interpolate(t, [T.desvia, T.desvia + 0.4, T.corrige, T.corrige + 0.6], [0, 0.9, 0.9, 0], clamp);
  const f = busca + desvio;
  const curva = (x: number) => Math.exp(-x * x * 2.5);
  return (
    <Lienzo zoom={interpolate(t, [T.ajusta, T.gps], [1, 1.04])}>
      <Tarjeta x={120} y={560} w={840} h={560}>
        <path
          d={new Array(61)
            .fill(0)
            .map((_, k) => {
              const x = -2 + k / 15;
              return `${k === 0 ? "M" : "L"} ${540 + x * 180} ${1040 - curva(x) * 380}`;
            })
            .join(" ")}
          stroke={C.cyan}
          strokeWidth={8}
          fill="none"
        />
        <line x1={540 + f * 180} y1={620} x2={540 + f * 180} y2={1060} stroke={C.yellow} strokeWidth={6} />
        <circle cx={540 + f * 180} cy={1040 - curva(f) * 380} r={20} fill={C.yellow} />
        <Texto x={540} y={1100} size={30} color={C.grey}>
          frecuencia de la microonda
        </Texto>
        <Texto x={540} y={620} size={30} color={C.cyan}>
          átomos que saltan
        </Texto>
      </Tarjeta>
      <Texto x={540} y={1240} size={42} color={C.yellow} op={aparece(t, T.maximo) * (1 - aparece(t, T.desvia))}>
        ¡en el máximo!
      </Texto>
      <Texto x={540} y={1240} size={42} color={C.red} op={aparece(t, T.desvia) * (1 - aparece(t, T.corrige + 0.4))}>
        se desvía…
      </Texto>
      <Texto x={540} y={1240} size={42} color="#5AC878" op={aparece(t, T.corrige + 0.4)}>
        …y se corrige
      </Texto>
    </Lienzo>
  );
};

// H. El GPS de tu teléfono depende de esos relojes
export const Gps: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.gps, T.porque], [1, 1.05])}>
      <circle cx={540} cy={1500} r={620} fill="#1A4A7A" />
      <path d="M 200 1000 Q 300 940 420 980 Q 520 1010 560 960 Q 640 900 760 950" stroke="#3A8A5A" strokeWidth={60} fill="none" strokeLinecap="round" />
      {[0, 1, 2].map((k) => {
        const a = -Math.PI / 2 + (k - 1) * 0.75 + Math.sin(t * 0.5) * 0.05;
        const sx = 540 + Math.cos(a) * 820;
        const sy = 1500 + Math.sin(a) * 820;
        return (
          <g key={k} opacity={aparece(t, T.gps + k * 0.2)}>
            <line x1={sx} y1={sy} x2={540} y2={1060} stroke={C.yellow} strokeWidth={4} strokeDasharray="14 12" strokeDashoffset={-t * 60} />
            <rect x={sx - 30} y={sy - 20} width={60} height={40} rx={6} fill={C.white} />
            <rect x={sx - 80} y={sy - 10} width={40} height={20} fill={C.cyan} />
            <rect x={sx + 40} y={sy - 10} width={40} height={20} fill={C.cyan} />
          </g>
        );
      })}
      <rect x={505} y={1000} width={70} height={120} rx={14} fill="#2A2440" stroke={C.white} strokeWidth={5} />
      <Texto x={540} y={560} size={40} color={C.white} op={aparece(t, T.gps + 0.6)}>
        cada satélite lleva relojes atómicos
      </Texto>
    </Lienzo>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <RelojAtomo t={t} brillo={1} />
    </Lienzo>
  );
};
