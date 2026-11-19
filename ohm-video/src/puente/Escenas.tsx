import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/puente/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  golden: 2.30, // golden
  miles: 3.28, // miles
  cables: 5.44, // cables
  final: 6.42, // final
  metro: 9.56, // metro
  alambres: 12.88, // alambres
  lapiz: 14.84, // lapiz
  reparten: 17.18, // reparten
  falla: 18.78, // falla
  calzada: 20.58, // calzada
  verticales: 22.30, // verticales
  peso: 23.62, // peso
  torres: 26.94, // torres
  estirados: 27.94, // estirados
  jalas: 30.64, // jalas
  extremo: 31.72, // extremo
  concreto: 33.34, // concreto
  anclas: 36.76, // anclas
  asi: 37.56, // asi
  fin: 39.26, // FIN
};

const ROJO = "#C8402A";

// Puente colgante: torres en x=300 y 780; cable principal parabólico; calzada en yC
const Puente: React.FC<{ readonly t: number; readonly yC?: number; readonly resalta?: number; readonly verticales?: number; readonly autos?: number; readonly anclaje?: number }> = ({
  t,
  yC = 1150,
  resalta = 0,
  verticales = 1,
  autos = 1,
  anclaje = 0,
}) => {
  const top = yC - 420;
  const cable = (x: number) => {
    if (x < 300) return top + ((300 - x) / 240) * 300;
    if (x > 780) return top + ((x - 780) / 240) * 300;
    const u = (x - 540) / 240;
    return top + 340 * (1 - u * u);
  };
  const pts = new Array(49).fill(0).map((_, i) => {
    const x = 40 + i * 20;
    return `${i ? "L" : "M"} ${x} ${cable(x)}`;
  });
  return (
    <g>
      <rect x={0} y={yC + 60} width={1080} height={400} fill="#1A3A5A" />
      {verticales > 0
        ? new Array(23).fill(0).map((_, k) => {
            const x = 320 + k * 20;
            return x < 770 ? <line key={k} x1={x} y1={cable(x)} x2={x} y2={yC} stroke={C.white} strokeWidth={3} opacity={0.6 * verticales} /> : null;
          })
        : null}
      <path d={pts.join(" ")} stroke={resalta > 0 ? C.yellow : ROJO} strokeWidth={10 + 6 * resalta} fill="none" />
      {[300, 780].map((x) => (
        <g key={x}>
          <rect x={x - 22} y={top - 40} width={44} height={yC - top + 160} fill={ROJO} />
          <rect x={x - 30} y={top + 60} width={60} height={14} fill={ROJO} />
          <rect x={x - 30} y={top + 200} width={60} height={14} fill={ROJO} />
        </g>
      ))}
      <rect x={0} y={yC} width={1080} height={26} fill="#5A5A66" />
      {autos > 0
        ? new Array(6).fill(0).map((_, k) => (
            <rect key={k} x={((k * 190 + t * 160) % 1200) - 80} y={yC - 26} width={60} height={26} rx={8} fill={["#4AC88A", "#C8A040", "#4A8AE0"][k % 3]} opacity={autos} />
          ))
        : null}
      {anclaje > 0
        ? [40, 1040].map((x) => (
            <g key={x} opacity={anclaje}>
              <rect x={x - 60} y={yC - 40} width={120} height={140} fill="#8A8A96" />
            </g>
          ))
        : null}
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Puente t={t} />
    <Texto x={540} y={560} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo aguanta este puente colgado?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.golden], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. El Golden Gate sostiene miles de autos colgado de dos cables + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.golden, T.metro], [1, 1.04])}>
      <Puente t={t} resalta={aparece(t, T.cables)} autos={aparece(t, T.miles - 0.5)} />
      <Texto x={540} y={1400} size={42} color={C.yellow} op={aparece(t, T.cables)}>
        colgado de solo 2 cables
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿dónde están amarrados?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.metro], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Cada cable mide casi 1 m pero son más de 27.000 alambres delgados como un lápiz; si uno falla, los demás siguen
export const Seccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const roto = aparece(t, T.falla);
  const R = 300;
  const n = 26;
  const cel = (2 * R) / n;
  const hilos: [number, number][] = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const x = -R + cel / 2 + i * cel + (j % 2) * cel * 0.5;
      const y = -R + cel / 2 + j * cel * 0.87;
      if (x * x + y * y < (R - cel / 2) ** 2) hilos.push([x, y]);
    }
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.metro, T.calzada], [1, 1.04])}>
        <g transform="translate(540 950)">
          <circle cx={0} cy={0} r={R + 12} fill="#3A3A44" />
          {hilos.map(([x, y], k) => (
            <circle key={k} cx={x} cy={y} r={cel * 0.45} fill={roto > 0 && k === 140 ? C.red : "#B8B8C4"} opacity={aparece(t, T.alambres)} />
          ))}
        </g>
        <Texto x={540} y={580} size={40} color={C.white} op={aparece(t, T.metro)}>
          cable: casi 1 metro de grosor
        </Texto>
        <Texto x={540} y={1340} size={44} color={C.yellow} op={aparece(t, T.alambres)}>
          27.000 alambres de acero
        </Texto>
        <Texto x={540} y={1410} size={34} color={C.white} op={aparece(t, T.lapiz)}>
          cada uno, delgado como un lápiz
        </Texto>
        <Texto x={540} y={1490} size={36} color="#5AD08A" op={roto}>
          si uno falla, los demás siguen
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.alambres} color={C.yellow} />
    </>
  );
};

// D. La calzada cuelga de cables verticales que pasan el peso a los cables grandes; estos trabajan estirados
export const Cuelga: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tens = aparece(t, T.estirados);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.calzada, T.extremo], [1, 1.04])}>
        <Puente t={t} verticales={aparece(t, T.verticales)} resalta={aparece(t, T.peso)} />
        <g opacity={aparece(t, T.peso) * (1 - tens)}>
          {[400, 540, 680].map((x, k) => {
            const u = (t * 0.8 + k / 3) % 1;
            return <path key={x} d={`M ${x} ${1130 - u * 300} l 0 -30 m -12 12 l 12 -12 l 12 12`} stroke={C.cyan} strokeWidth={6} fill="none" />;
          })}
        </g>
        <g opacity={tens}>
          {[[160, 940, -50], [920, 940, 50]].map(([x, y, a], k) => (
            <g key={k} transform={`translate(${x} ${y}) rotate(${a})`}>
              <path d="M -60 0 L 60 0 M 40 -16 L 60 0 L 40 16 M -40 -16 L -60 0 L -40 16" stroke={C.yellow} strokeWidth={8} fill="none" />
            </g>
          ))}
        </g>
        <Texto x={540} y={1420} size={38} color={C.white} op={aparece(t, T.verticales) * (1 - tens)}>
          cientos de cables verticales
        </Texto>
        <Texto x={540} y={1420} size={40} color={C.yellow} op={tens * (1 - aparece(t, T.jalas))}>
          trabajan estirados
        </Texto>
        <Texto x={540} y={1420} size={38} color={C.yellow} op={aparece(t, T.jalas)}>
          el acero es fortísimo al jalarlo
        </Texto>
        <Texto x={300} y={600} size={32} color={C.white} op={aparece(t, T.torres)}>
          torres
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.estirados} color={C.yellow} />
    </>
  );
};

// E. En cada extremo los cables se hunden en bloques de concreto gigantes enterrados, como anclas
export const Anclaje: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.extremo, T.asi], [1, 1.04])}>
        <rect x={0} y={1000} width={1080} height={600} fill="#4A3A2A" />
        <path d="M 120 600 L 640 1150" stroke={ROJO} strokeWidth={22} />
        <rect x={340} y={940} width={560} height={420} fill="#8A8A96" opacity={aparece(t, T.concreto)} />
        {new Array(8).fill(0).map((_, k) => (
          <line key={k} x1={560 + k * 12} y1={1090 + k * 12} x2={760 + k * 14} y2={1260 - k * 6} stroke="#B8B8C4" strokeWidth={4} opacity={aparece(t, T.concreto)} />
        ))}
        <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.extremo)}>
          en cada extremo…
        </Texto>
        <Texto x={620} y={1440} size={40} color="#C8C8D4" op={aparece(t, T.concreto)}>
          bloques de concreto gigantes
        </Texto>
        <Texto x={620} y={1510} size={38} color={C.yellow} op={aparece(t, T.anclas)}>
          enterrados, como anclas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.concreto} color={C.white} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
