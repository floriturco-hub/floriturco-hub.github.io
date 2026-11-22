import { interpolate, random } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/titilan/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  titilan: 2.48, // titilan
  jupiter: 3.44, // j
  final: 5.94, // final
  lejos: 9.30, // lejos
  punto: 11.32, // punto
  aire: 14.14, // aire
  capa: 14.56, // capa
  baila: 21.16, // baila
  planeta: 23.84, // planeta
  disco: 26.88, // disco
  compensan: 31.26, // compensan
  horizonte: 32.66, // horizonte
  color: 36.48, // color
  porEso: 37.10, // por
  fin: 38.72, // FIN
};

// Estrella que parpadea: brillo variable según t y semilla
const Estrella: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly k: number; readonly titila?: number; readonly r?: number; readonly colores?: number }> = ({ x, y, t, k, titila = 1, r = 10, colores = 0 }) => {
  const b = 1 - titila * 0.8 * (0.5 + 0.5 * Math.sin(t * (9 + k * 1.3) + k * 2.1) * Math.sin(t * (5.3 + k) + k));
  const dx = titila * 4 * Math.sin(t * 13 + k);
  const col = colores > 0 ? ["#FFFFFF", "#FF8A8A", "#8AC8FF", "#9AF0A0"][Math.floor(t * 6 + k) % 4] : "#FFFFFF";
  return (
    <g opacity={0.25 + 0.75 * b}>
      <circle cx={x + dx} cy={y} r={r * (0.7 + 0.5 * b)} fill={col} />
      <path d={`M ${x + dx - r * 3 * b} ${y} L ${x + dx + r * 3 * b} ${y} M ${x + dx} ${y - r * 3 * b} L ${x + dx} ${y + r * 3 * b}`} stroke={col} strokeWidth={3} />
    </g>
  );
};

const Planeta: React.FC<{ readonly x: number; readonly y: number; readonly r?: number }> = ({ x, y, r = 22 }) => (
  <g>
    <circle cx={x} cy={y} r={r * 2} fill="#F0D8A0" opacity={0.15} />
    <circle cx={x} cy={y} r={r} fill="#F0D8A0" />
  </g>
);

const Cielo: React.FC<{ readonly t: number; readonly titila?: number }> = ({ t, titila = 1 }) => (
  <g>
    {new Array(14).fill(0).map((_, k) => (
      <Estrella key={k} x={120 + random(`x${k}`) * 840} y={640 + random(`y${k}`) * 700} t={t} k={k} titila={titila} r={6 + random(`r${k}`) * 6} />
    ))}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Cielo t={t} />
    <Estrella x={540} y={980} t={t} k={99} r={22} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta estrella parpadea?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.titilan], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Las estrellas titilan, Júpiter y Venus brillan quietos + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.titilan, T.lejos], [1, 1.04])}>
      <Cielo t={t} />
      <g opacity={aparece(t, T.jupiter)}>
        <Planeta x={300} y={1150} />
        <Texto x={300} y={1230} size={30} color="#F0D8A0">
          Júpiter
        </Texto>
        <Planeta x={780} y={900} r={18} />
        <Texto x={780} y={970} size={30} color="#F0D8A0">
          Venus
        </Texto>
      </g>
      <Texto x={540} y={1460} size={38} color={C.white} op={aparece(t, T.jupiter)}>
        estrellas titilan · planetas, quietos
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuándo titilan más?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.lejos], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Capas de aire turbulento entre y0 y y1
const Capas: React.FC<{ readonly t: number; readonly y0: number; readonly y1: number; readonly op: number }> = ({ t, y0, y1, op }) => (
  <g opacity={op}>
    {new Array(6).fill(0).map((_, k) => {
      const y = y0 + ((y1 - y0) / 6) * k;
      const pts = new Array(30)
        .fill(0)
        .map((_, i) => `${i ? "L" : "M"} ${i * 38} ${y + 20 * Math.sin(i * 0.6 + t * (1 + k * 0.3) + k)}`)
        .join(" ");
      return <path key={k} d={`${pts} L 1140 ${y + 80} L 0 ${y + 80} Z`} fill={k % 2 ? "#3A6AA8" : "#A85A3A"} opacity={0.18} />;
    })}
  </g>
);

// C. La luz llega como un punto, cruza capas de aire frío y caliente; el punto baila
export const Punto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const xs = 540 + aparece(t, T.baila) * 50 * Math.sin(t * 9) * Math.sin(t * 4.3);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.lejos, T.planeta], [1, 1.04])}>
        <Estrella x={540} y={660} t={t} k={1} titila={0} r={14} />
        <Capas t={t} y0={820} y1={1240} op={aparece(t, T.aire)} />
        <path d={`M 540 680 Q ${540 + (xs - 540) * 0.5} 1000 ${xs} 1340`} stroke={C.yellow} strokeWidth={5} fill="none" opacity={aparece(t, T.punto)} />
        <g transform={`translate(${xs} 1380)`}>
          <ellipse cx={0} cy={0} rx={60} ry={34} fill="#E8E6F0" />
          <circle cx={0} cy={0} r={22} fill="#3A6A9A" />
          <circle cx={0} cy={0} r={10} fill="#0A0A1A" />
        </g>
        <Texto x={540} y={600} size={36} color={C.white} op={aparece(t, T.punto)}>
          su luz llega como un solo punto
        </Texto>
        <Texto x={540} y={1500} size={36} color={C.yellow} op={aparece(t, T.baila)}>
          cada capa la desvía: el punto baila
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.capa} color={C.white} />
    </>
  );
};

// D. Un planeta es un disco diminuto: cada parte titila por su lado y se compensan
export const Disco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.planeta, T.horizonte], [1, 1.04])}>
        <circle cx={540} cy={950} r={200} fill="#F0D8A0" opacity={0.25} />
        {new Array(19).fill(0).map((_, k) => {
          const a = k * 2.4;
          const rr = 30 + ((k * 37) % 150);
          return <Estrella key={k} x={540 + Math.cos(a) * rr} y={950 + Math.sin(a) * rr} t={t} k={k} r={6} titila={aparece(t, T.disco)} />;
        })}
        <Texto x={540} y={640} size={40} color="#F0D8A0" op={aparece(t, T.planeta)}>
          un planeta: un disco diminuto
        </Texto>
        <Texto x={540} y={1260} size={34} color={C.white} op={aparece(t, T.disco)}>
          cada punto titila por su lado…
        </Texto>
        <Texto x={540} y={1340} size={40} color={C.yellow} op={aparece(t, T.compensan)}>
          …y en conjunto se compensan
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.compensan} color={C.yellow} />
    </>
  );
};

// E. Cerca del horizonte la luz cruza más aire: titilan más y cambian de color
export const Horizonte: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.horizonte, T.porEso], [1, 1.04])}>
      <rect x={0} y={1320} width={1080} height={300} fill="#141A2A" />
      <path d="M 0 1320 L 200 1260 L 380 1300 L 560 1240 L 760 1290 L 1080 1250 L 1080 1320 Z" fill="#1E2638" />
      <Capas t={t} y0={900} y1={1320} op={0.8} />
      <Estrella x={540} y={700} t={t} k={2} r={12} titila={0.4} />
      <Estrella x={760} y={1200} t={t} k={5} r={16} titila={1} colores={aparece(t, T.color)} />
      <path d="M 120 1400 L 760 1200" stroke={C.yellow} strokeWidth={4} strokeDasharray="12 10" opacity={0.6} />
      <Texto x={540} y={600} size={38} color={C.white} op={aparece(t, T.horizonte)}>
        cerca del horizonte: más aire
      </Texto>
      <Texto x={540} y={1480} size={40} color={C.yellow} op={aparece(t, T.color)}>
        titilan más y cambian de color
      </Texto>
    </Lienzo>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
