import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/circulos/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  en: 2.08,
  vendados: 3.44,
  crees: 4.24,
  no: 5.52,
  final: 6.4,
  al: 8.44,
  corrige: 9.6,
  horizonte: 12.16,
  sol: 13.22,
  arbol: 13.78,
  sin: 15.0,
  errores: 17.46,
  sumando: 18.76,
  estudio: 19.8,
  vueltas: 22.5,
  veinte: 23.86,
  y: 24.8,
  pierna: 25.86,
  misma: 26.6,
  izquierda: 29.0,
  derecha: 30.32,
  lo: 31.42,
  punto: 32.44,
  brujula: 35.1,
  porEso: 36.06,
  fin: 37.82,
};

const BOSQUE = "#2A5A3A";
const PASO = C.yellow;

// Árboles vistos desde arriba
const Arboles: React.FC<{ readonly op?: number }> = ({ op = 1 }) => (
  <g opacity={op}>
    {new Array(22).fill(0).map((_, k) => (
      <circle key={k} cx={80 + random(`ax${k}`) * 920} cy={440 + random(`ay${k}`) * 1000} r={30 + random(`ar${k}`) * 30} fill={BOSQUE} />
    ))}
  </g>
);

// Camino en círculo (huellas) con progreso
const Circulo: React.FC<{ readonly cx: number; readonly cy: number; readonly r: number; readonly prog: number }> = ({ cx, cy, r, prog }) => {
  const n = 40;
  return (
    <g>
      {new Array(Math.floor(n * prog)).fill(0).map((_, k) => {
        const a = -Math.PI / 2 + (k / n) * Math.PI * 2 * 1.15;
        const off = k % 2 ? 10 : -10;
        return <ellipse key={k} cx={cx + Math.cos(a) * (r + off)} cy={cy + Math.sin(a) * (r + off)} rx={9} ry={14} fill={PASO} transform={`rotate(${(a * 180) / Math.PI} ${cx + Math.cos(a) * (r + off)} ${cy + Math.sin(a) * (r + off)})`} />;
      })}
    </g>
  );
};

// A. Gancho: ¿por qué caminas en círculos perdido?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.en], [1.12, 1])}>
        <Arboles op={0.7} />
        <Circulo cx={540} cy={880} r={260} prog={interpolate(t, [0, 1.6], [0.4, 1], clamp)} />
        <Texto x={540} y={900} size={110} color={C.yellow} op={interpolate(t, [0.8, 1.1], [0, 1], clamp)}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.74} />
    </>
  );
};

// Camino que se desvía (random walk) desde (x0,y0) hacia arriba
const Desvio: React.FC<{ readonly x0: number; readonly y0: number; readonly pasos: number; readonly error: number; readonly semilla: string; readonly color?: string }> = ({
  x0,
  y0,
  pasos,
  error,
  semilla,
  color = PASO,
}) => {
  let x = x0;
  let y = y0;
  let h = -Math.PI / 2;
  const pts: string[] = [`M ${x} ${y}`];
  for (let k = 0; k < pasos; k++) {
    h += (random(`${semilla}${k}`) - 0.45) * error;
    x += Math.cos(h) * 34;
    y += Math.sin(h) * 34;
    pts.push(`L ${x} ${y}`);
  }
  return <path d={pts.join(" ")} stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray="4 18" />;
};

// B. En la niebla o con los ojos vendados crees que vas recto… y no + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pasos = Math.floor(interpolate(t, [T.crees, T.final], [0, 28], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.en, T.al], [1, 1.05])}>
      <line x1={540} y1={1300} x2={540} y2={460} stroke={C.white} strokeWidth={4} strokeDasharray="14 12" opacity={aparece(t, T.crees) * 0.6} />
      <Desvio x0={540} y0={1300} pasos={pasos} error={0.35} semilla="b" />
      <rect x={0} y={400} width={1080} height={1100} fill="#C8C4D8" opacity={0.18 * aparece(t, T.en)} />
      <Texto x={700} y={500} size={32} color={C.white} op={aparece(t, T.crees)}>
        lo que crees
      </Texto>
      <Texto x={300} y={1000} size={32} color={PASO} op={aparece(t, T.no)}>
        lo que haces
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1380} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1380}
          width={700 * interpolate(t, [T.final, T.al], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1480} color={C.white} size={40}>
          qué te salva: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. El cerebro corrige el rumbo con lo que ve: horizonte, sol, un árbol lejano
export const Referencias: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.al, T.sin], [1, 1.04])}>
      <rect x={0} y={420} width={1080} height={480} fill="#2A4A7A" />
      <rect x={0} y={900} width={1080} height={560} fill="#2A4A2A" />
      <line x1={0} y1={900} x2={1080} y2={900} stroke={C.white} strokeWidth={6} opacity={aparece(t, T.horizonte)} />
      <circle cx={820} cy={560} r={70} fill={C.yellow} opacity={aparece(t, T.sol)} />
      <g opacity={aparece(t, T.arbol)}>
        <rect x={520} y={820} width={20} height={80} fill="#4A3A2A" />
        <circle cx={530} cy={800} r={50} fill={BOSQUE} />
      </g>
      <path d={`M 540 1440 L ${540 + Math.sin(t * 3) * 30} 1200 L 540 960`} stroke={PASO} strokeWidth={8} fill="none" strokeDasharray="4 18" opacity={aparece(t, T.corrige)} />
      <Texto x={540} y={1080} size={34} color={C.white} op={aparece(t, T.corrige)}>
        el cerebro corrige el rumbo
      </Texto>
    </Lienzo>
  );
};

// D. Sin referencias, cada paso tiene pequeños errores al azar que se van sumando
export const Errores: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pasos = Math.floor(interpolate(t, [T.sin + 0.5, T.estudio], [0, 30], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.sin, T.estudio], [1, 1.04])}>
      <rect x={0} y={400} width={1080} height={1100} fill="#C8C4D8" opacity={0.15} />
      {[0, 1, 2].map((k) => (
        <Desvio key={k} x0={300 + k * 240} y0={1350} pasos={pasos} error={0.5} semilla={`e${k}`} color={[PASO, C.cyan, C.orange][k]} />
      ))}
      <Texto x={540} y={1440} size={36} color={C.white} op={aparece(t, T.errores)}>
        pequeños errores que se suman
      </Texto>
    </Lienzo>
  );
};

// E. En un estudio, con ojos vendados, dieron vueltas de menos de 20 metros
export const Estudio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.estudio, T.y], [1, 1.04])}>
        <Circulo cx={540} cy={820} r={220} prog={interpolate(t, [T.estudio + 0.4, T.veinte], [0, 1], clamp)} />
        <g opacity={aparece(t, T.veinte)}>
          <line x1={320} y1={1120} x2={760} y2={1120} stroke={C.white} strokeWidth={6} />
          <path d="M 320 1100 L 320 1140 M 760 1100 L 760 1140" stroke={C.white} strokeWidth={6} />
          <Texto x={540} y={1190} size={40} color={C.white}>
            menos de 20 m
          </Texto>
        </g>
        <Texto x={540} y={1300} size={36} color={PASO} op={aparece(t, T.vueltas)}>
          ojos vendados: vueltas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.veinte} />
    </>
  );
};

// F. No es por una pierna más larga: la misma persona se desviaba a veces a la izquierda y otras a la derecha
export const Pierna: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.lo], [1, 1.04])}>
      <g opacity={1 - aparece(t, T.misma)} transform="translate(540 820)">
        <rect x={-80} y={-200} width={50} height={400} rx={20} fill="#E8B890" />
        <rect x={30} y={-200} width={50} height={430} rx={20} fill="#E8B890" />
        <line x1={-160} y1={-220} x2={160} y2={240} stroke={C.red} strokeWidth={14} opacity={aparece(t, T.pierna)} />
      </g>
      <g opacity={aparece(t, T.misma)}>
        <path d="M 540 1300 Q 540 1000 300 800" stroke={C.cyan} strokeWidth={8} fill="none" strokeDasharray="4 18" opacity={aparece(t, T.izquierda)} />
        <path d="M 540 1300 Q 540 1000 780 800" stroke={C.orange} strokeWidth={8} fill="none" strokeDasharray="4 18" opacity={aparece(t, T.derecha)} />
        <Texto x={260} y={760} size={34} color={C.cyan} op={aparece(t, T.izquierda)}>
          a veces izquierda
        </Texto>
        <Texto x={820} y={760} size={34} color={C.orange} op={aparece(t, T.derecha)}>
          otras derecha
        </Texto>
      </g>
      <Texto x={540} y={1400} size={36} color={C.white} op={aparece(t, T.pierna)}>
        no es por una pierna más larga
      </Texto>
    </Lienzo>
  );
};

// G. Lo que te salva: un punto fijo, como el sol, la luna o una brújula
export const Salva: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const avance = interpolate(t, [T.punto, T.porEso], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.lo, T.porEso], [1, 1.04])}>
      <circle cx={540} cy={520} r={70} fill={C.yellow} opacity={aparece(t, T.punto)} />
      <line x1={540} y1={1350} x2={540} y2={1350 - 700 * avance} stroke={PASO} strokeWidth={8} strokeDasharray="4 18" />
      <g opacity={aparece(t, T.brujula)} transform="translate(820 1100)">
        <circle r={90} fill="#2A2640" stroke={C.grey} strokeWidth={8} />
        <path d="M 0 -70 L 18 0 L -18 0 Z" fill={C.red} />
        <path d="M 0 70 L 18 0 L -18 0 Z" fill={C.white} />
      </g>
      <Texto x={540} y={1440} size={40} color={C.yellow} op={aparece(t, T.punto)}>
        un punto fijo
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Arboles op={0.7} />
      <Circulo cx={540} cy={880} r={260} prog={interpolate(t, [T.porEso, T.fin], [0.8, 0.4], clamp)} />
      <Texto x={540} y={900} size={110} color={C.yellow} op={interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp)}>
        ?
      </Texto>
    </Lienzo>
  );
};
