import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { AppParejas, Calendario, Convergen, Derivas, RelojCiclo, Residencia, ROSA } from "./Piezas";

// Instantes clave (s) de public/audio/regla/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  amiga: 1.74,
  hermana: 2.64,
  piso: 3.44,
  noTe: 4.88,
  sincronia: 7.5,
  idea: 8.98,
  anio: 9.9,
  investigadora: 11.44,
  estudiantes: 13.14,
  acercaban: 15.88,
  pero: 18.02,
  masMujeres: 19.46,
  desaparecia: 21.5,
  app: 23.36,
  parejas: 27.06,
  mayoria: 28.5,
  alejaban: 30.86,
  entonces: 31.86,
  matematicas: 34.12,
  cinco: 35.44,
  azar: 38.76,
  tercio: 41.28,
  ciclos: 42.48,
  coinciden: 45.48,
  separan: 47.0,
  recordamos: 48.32,
  ovarios: 50.7,
  calendario: 52.92,
  fin: 54.75,
};

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

const Lienzo: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly cy?: number }> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}>{children}</g>
  </svg>
);

const TU = [8, 9, 10, 11, 12];
const ELLA = [10, 11, 12, 13, 14];

// A. Gancho: tu regla y la de tu amiga, a la vez
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const titulo = t < T.hermana ? "TU AMIGA" : t < T.piso ? "TU HERMANA" : "TU COMPAÑERA";
  const juntos = t > T.amiga ? [10, 11, 12] : [];
  const flash = interpolate(t, [T.sincronia, T.sincronia + 0.08, T.sincronia + 0.45], [0, 0.25, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.idea], [1, 1.05])}>
        <Calendario x={540} y={470} s={1.3} titulo="TÚ" dias={TU} progreso={interpolate(t, [0.1, 1.0], [0, 1], clamp)} coinciden={juntos} />
        <Calendario x={540} y={1110} s={1.3} titulo={titulo} dias={ELLA} color={C.cyan} progreso={interpolate(t, [0.6, 1.6], [0, 1], clamp)} coinciden={juntos} />
        <g opacity={aparece(t, T.amiga)}>
          <rect x={150} y={758} width={780} height={64} rx={32} fill={C.card} stroke={C.yellow} strokeWidth={3} />
          <text x={540} y={801} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={34} fontWeight={700}>3 días a la vez</text>
        </g>
      </Lienzo>
      <div style={{ position: "absolute", inset: 0, background: C.white, opacity: flash }} />
    </>
  );
};

// B. 1971: el estudio de la residencia
export const Estudio1971: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.idea, T.pero], [1, 1.04])}>
      <text x={540} y={290} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={120} fontWeight={700} opacity={aparece(t, T.anio)}>
        1971
      </text>
      <g opacity={aparece(t, T.investigadora)}>
        <Residencia x={540} y={700} s={0.95} luces={interpolate(t, [T.estudiantes, T.estudiantes + 1.4], [0.1, 1], clamp)} />
      </g>
      <text x={540} y={970} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700} opacity={aparece(t, T.estudiantes)}>
        135 estudiantes
      </text>
      <g opacity={aparece(t, T.acercaban - 0.2)}>
        <Convergen x={160} y={1210} w={760} p={interpolate(t, [T.acercaban, T.acercaban + 1.4], [0, 1], suave)} />
      </g>
    </Lienzo>
  );
};

// C1. Al repetirlo, la sincronía desaparece
export const Repeticion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const chips = [
    { texto: "más mujeres", t: T.masMujeres },
    { texto: "más meses", t: T.masMujeres + 0.9 },
  ];
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.app], [1, 1.04])}>
      <text x={540} y={420} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={56} fontWeight={700} opacity={aparece(t, T.pero)}>
        Se repite el estudio
      </text>
      {chips.map((c, k) => (
        <g key={c.texto} opacity={aparece(t, c.t)} transform={`translate(${k === 0 ? 330 : 750} 560)`}>
          <rect x={-170} y={-44} width={340} height={84} rx={42} fill={C.card} stroke={C.cyan} strokeWidth={4} />
          <text x={0} y={14} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={36} fontWeight={700}>{c.texto}</text>
        </g>
      ))}
      <Convergen x={160} y={950} w={760} p={1} tachado={aparece(t, T.desaparecia)} />
    </Lienzo>
  );
};

// C2. 2016: 360 parejas en una app
export const App2016: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.app, T.entonces], [1, 1.04])}>
      <text x={540} y={260} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={110} fontWeight={700} opacity={aparece(t, T.app)}>
        2016
      </text>
      <g opacity={aparece(t, T.app + 0.8)}>
        <AppParejas x={540} y={830} s={1} separa={interpolate(t, [T.mayoria, T.alejaban + 0.4], [0, 1], suave)} />
      </g>
      <text x={540} y={1250} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700} opacity={aparece(t, T.parejas)}>
        360 parejas
      </text>
    </Lienzo>
  );
};

// D. Matemáticas: el azar en un ciclo de 28 días
export const Azar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const paso = Math.floor(Math.max(0, t - T.azar) / 0.42);
  const desfase = t < T.azar ? 14 : random(`d${paso}`) * 28;
  return (
    <Lienzo zoom={interpolate(t, [T.entonces, T.ciclos], [1, 1.04])}>
      <text x={540} y={300} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={56} fontWeight={700} opacity={aparece(t, T.entonces)}>
        ¿Por qué lo sientes?
      </text>
      <g opacity={aparece(t, T.entonces + 0.8)}>
        <RelojCiclo x={540} y={880} R={310} desfase={desfase} zona={aparece(t, T.tercio)} />
        <g fontFamily={mono} fontSize={30} fontWeight={700}>
          <text x={760} y={500} fill={ROSA}>tu regla</text>
          <text x={760} y={1300} fill={C.cyan} opacity={aparece(t, T.azar)}>la de tu amiga</text>
        </g>
      </g>
    </Lienzo>
  );
};

// E. Ciclos de distinta duración: coinciden y se separan
export const Deriva: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cabezal = interpolate(t, [T.ciclos + 0.2, T.recordamos - 0.3], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return (
    <Lienzo zoom={interpolate(t, [T.ciclos, T.ovarios], [1, 1.04])}>
      <Derivas x={90} y={820} w={900} dias={240} cabezal={cabezal} ciclos={[28, 30]} desfase={20} />
      <g opacity={aparece(t, T.recordamos)}>
        <text x={540} y={1190} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={38} fontWeight={700}>esto es lo que recuerdas</text>
        <path d="M 540 1145 L 540 1090" stroke={C.yellow} strokeWidth={6} strokeLinecap="round" />
      </g>
    </Lienzo>
  );
};

// F. Cierre: el calendario hace trampas
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sep = interpolate(t, [T.ovarios + 0.4, T.calendario], [0, 1], suave);
  const ella = sep < 0.5 ? ELLA : [22, 23, 24, 25, 26];
  return (
    <Lienzo zoom={interpolate(t, [T.ovarios, T.fin + 0.5], [1, 1.06])}>
      <Calendario x={540} y={470} s={1.3} titulo="TÚ" dias={TU} coinciden={sep < 0.5 ? [10, 11, 12] : []} />
      <Calendario x={540} y={1110} s={1.3} titulo="TU AMIGA" dias={ella} color={C.cyan} coinciden={sep < 0.5 ? [10, 11, 12] : []} />
    </Lienzo>
  );
};
