import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/gatocae/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  sueltas: 1.64, // sueltas
  arriba: 2.82, // arriba
  pie: 6.02, // pie
  final: 6.80, // final
  oido: 9.62, // oido
  cabeza: 11.74, // cabeza
  dobla: 13.24, // dobla
  mitades: 15.08, // mitades
  encoge: 16.02, // encoge
  estira: 17.50, // estira
  delantera: 19.16, // delantera
  rapido: 20.80, // rapido
  trasera: 21.66, // trasera
  reves: 24.20, // reves
  invierte: 25.18, // invierte
  atras: 30.14, // atras
  compensa: 31.22, // compensa
  pie2: 33.56, // pie
  bastan: 34.26, // bastan
  centimetros: 35.24, // centimetros
  asi: 36.66, // asi
  fin: 37.96, // FIN
};

const GATO = "#E8A04A";

// Gato visto de lado, como dos mitades. a1/a2: ángulo de las patas (0 = abajo, 180 = arriba); l1/l2: largo de patas
const Gato: React.FC<{ readonly x: number; readonly y: number; readonly a1: number; readonly a2: number; readonly l1?: number; readonly l2?: number; readonly s?: number; readonly t?: number }> = ({
  x,
  y,
  a1,
  a2,
  l1 = 90,
  l2 = 90,
  s = 1,
  t = 0,
}) => {
  const pata = (cx: number, a: number, l: number, k: number) => {
    const r = ((a + 90) * Math.PI) / 180;
    return <line key={k} x1={cx + (k % 2 ? 18 : -18)} y1={0} x2={cx + (k % 2 ? 18 : -18) + Math.cos(r) * l} y2={Math.sin(r) * l} stroke={GATO} strokeWidth={22} strokeLinecap="round" />;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {pata(110, a1, l1, 0)}
      {pata(110, a1, l1, 1)}
      {pata(-110, a2, l2, 2)}
      {pata(-110, a2, l2, 3)}
      <ellipse cx={-80} cy={0} rx={110} ry={62} fill={GATO} />
      <ellipse cx={80} cy={0} rx={110} ry={62} fill="#F0B060" />
      <path d={`M -180 0 Q -280 ${-60 * Math.cos((a2 * Math.PI) / 180)} -300 ${-120 * Math.cos((a2 * Math.PI) / 180) + 10 * Math.sin(t * 6)}`} stroke={GATO} strokeWidth={18} fill="none" strokeLinecap="round" />
      <g transform={`translate(210 ${-30 * Math.cos((a1 * Math.PI) / 180)})`}>
        <circle cx={0} cy={0} r={55} fill="#F0B060" />
        <path d={`M -40 ${-35 * Math.cos((a1 * Math.PI) / 180)} L -20 ${-80 * Math.cos((a1 * Math.PI) / 180)} L 0 ${-40 * Math.cos((a1 * Math.PI) / 180)} Z M 10 ${-40 * Math.cos((a1 * Math.PI) / 180)} L 30 ${-80 * Math.cos((a1 * Math.PI) / 180)} L 45 ${-30 * Math.cos((a1 * Math.PI) / 180)} Z`} fill="#F0B060" />
        <circle cx={20} cy={0} r={7} fill="#222" />
      </g>
    </g>
  );
};

// Secuencia completa del giro: u 0..1
const giro = (u: number) => {
  const p1 = interpolate(u, [0.15, 0.5], [0, 1], clamp);
  const p2 = interpolate(u, [0.5, 0.85], [0, 1], clamp);
  return {
    a1: 180 - 180 * p1 + 20 * p2 * (1 - p2) * 4,
    a2: 180 + 30 * p1 - 210 * p2,
    l1: p1 > 0 && p1 < 1 ? 40 : 90,
    l2: p2 > 0 && p2 < 1 ? 40 : 90,
  };
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => {
  const g = giro((t * 0.5) % 1);
  return (
    <>
      <Gato x={540} y={1000} {...g} t={t} />
      <rect x={100} y={1450} width={880} height={20} fill="#5A4A3A" />
      <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
        ?
      </Texto>
    </>
  );
};

// A. Gancho: ¿cómo se gira este gato?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.sueltas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Sueltas un gato patas arriba y cae de pie + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.arriba, T.pie], [0, 1], clamp);
  const g = giro(u);
  return (
    <Lienzo zoom={interpolate(t, [T.sueltas, T.oido], [1, 1.04])}>
      <Gato x={540} y={700 + u * 650} {...g} t={t} s={0.9} />
      <rect x={100} y={1450} width={880} height={20} fill="#5A4A3A" />
      <Texto x={540} y={1560} size={44} color="#5AD08A" op={aparece(t, T.pie)}>
        ¡de pie!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿desde qué altura?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.oido], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Su oído interno detecta al instante que está de cabeza
export const Oido: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.oido, T.dobla], [1, 1.04])}>
        <Gato x={540} y={1150} a1={180} a2={180} t={t} s={0.8} />
        <g transform={`translate(540 760) rotate(${10 * Math.sin(t * 4)})`}>
          <circle cx={0} cy={-50} r={50} fill="none" stroke="#E8A0B0" strokeWidth={18} />
          <circle cx={50} cy={20} r={45} fill="none" stroke="#E8A0B0" strokeWidth={18} />
          <circle cx={-45} cy={25} r={42} fill="none" stroke="#E8A0B0" strokeWidth={18} />
        </g>
        <Texto x={540} y={620} size={38} color="#E8A0B0" op={aparece(t, T.oido)}>
          oído interno
        </Texto>
        <Texto x={540} y={1420} size={40} color={C.yellow} op={aparece(t, T.cabeza)}>
          «¡estoy de cabeza!»
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cabeza} color={C.yellow} />
    </>
  );
};

// D. Se dobla en dos mitades: encoge las delanteras y estira las traseras; la delantera gira rápido, la trasera un poco al revés
export const Fase1: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.delantera, T.reves + 0.4], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.dobla, T.invierte], [1, 1.04])}>
      <Gato x={540} y={1000} a1={180 - 180 * p} a2={180 + 30 * p} l1={aparece(t, T.encoge) ? 40 : 90} l2={aparece(t, T.estira) ? 120 : 90} t={t} />
      <line x1={540} y1={880} x2={540} y2={1120} stroke={C.yellow} strokeWidth={4} strokeDasharray="10 8" opacity={aparece(t, T.mitades)} />
      <Texto x={540} y={600} size={38} color={C.yellow} op={aparece(t, T.dobla)}>
        se dobla en dos mitades
      </Texto>
      <Texto x={540} y={1260} size={32} color="#F0B060" op={aparece(t, T.encoge)}>
        delanteras encogidas
      </Texto>
      <Texto x={540} y={1310} size={32} color={GATO} op={aparece(t, T.estira)}>
        traseras estiradas
      </Texto>
      <Texto x={540} y={1390} size={34} color={C.cyan} op={aparece(t, T.rapido)}>
        delantera: gira rápido ↻
      </Texto>
      <Texto x={540} y={1440} size={34} color={C.grey} op={aparece(t, T.reves)}>
        trasera: un poco al revés ↺
      </Texto>
    </Lienzo>
  );
};

// E. Invierte el truco: ahora gira la mitad de atrás
export const Fase2: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.invierte + 0.3, T.atras + 0.6], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.invierte, T.compensa], [1, 1.04])}>
      <Gato x={540} y={1000} a1={0 + 20 * p * (1 - p) * 4} a2={210 - 210 * p} l1={120} l2={40} t={t} />
      <Texto x={540} y={600} size={40} color={C.yellow} op={aparece(t, T.invierte)}>
        invierte el truco
      </Texto>
      <Texto x={540} y={1390} size={34} color={C.cyan} op={aparece(t, T.atras)}>
        ahora gira la de atrás ↻
      </Texto>
    </Lienzo>
  );
};

// F. Cada mitad compensa a la otra y termina de pie; le bastan unos 30 cm
export const Altura: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const reg = aparece(t, T.bastan);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.compensa, T.asi], [1, 1.04])}>
        <g opacity={1 - reg}>
          <Gato x={540} y={1100} a1={0} a2={0} t={t} />
          <path d="M 300 800 A 120 60 0 0 1 480 800" stroke={C.cyan} strokeWidth={8} fill="none" />
          <path d="M 780 800 A 120 60 0 0 0 600 800" stroke={C.orange} strokeWidth={8} fill="none" />
          <Texto x={540} y={700} size={38} color={C.white} op={aparece(t, T.compensa)}>
            cada mitad compensa a la otra
          </Texto>
          <Texto x={540} y={1380} size={44} color="#5AD08A" op={aparece(t, T.pie2)}>
            ¡de pie!
          </Texto>
        </g>
        <g opacity={reg}>
          <rect x={220} y={720} width={40} height={600} fill="#E8E8EE" />
          {new Array(7).fill(0).map((_, k) => (
            <line key={k} x1={220} y1={720 + k * 100} x2={280} y2={720 + k * 100} stroke="#3A3A44" strokeWidth={4} />
          ))}
          <Gato x={640} y={720 + interpolate(t, [T.bastan, T.centimetros + 0.6], [0, 560], clamp)} {...giro(interpolate(t, [T.bastan, T.centimetros + 0.6], [0, 1], clamp))} s={0.6} t={t} />
          <rect x={100} y={1360} width={880} height={20} fill="#5A4A3A" />
          <Texto x={540} y={620} size={56} color={C.yellow} op={aparece(t, T.centimetros)}>
            ~30 cm
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.centimetros} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
