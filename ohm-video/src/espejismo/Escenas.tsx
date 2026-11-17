import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/espejismo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  calor: 2.92, // calor
  charco: 3.66, // charco
  desaparece: 5.60, // desaparece
  final: 6.90, // final
  asfalto: 9.50, // asfalto
  denso: 13.50, // denso
  luz: 14.96, // luz
  rapido: 16.20, // rapido
  curvando: 19.42, // curvando
  rayo: 21.04, // rayo
  cielo: 21.86, // cielo
  dobla: 22.38, // dobla
  ojos: 25.04, // ojos
  cerebro: 26.38, // cerebro
  cielo2: 29.42, // cielo
  brilla: 31.02, // brilla
  porEso: 32.30, // por
  fin: 34.12, // FIN
};

const CIELO = "#6AA8E8";
const ASFALTO = "#3A3A48";

// Carretera en perspectiva con charco-espejismo (op) a cierta altura
const Carretera: React.FC<{ readonly charco: number; readonly t: number; readonly avance?: number }> = ({ charco, t, avance = 0 }) => (
  <g>
    <rect x={0} y={420} width={1080} height={380} fill="#1A3A6A" />
    <rect x={0} y={640} width={1080} height={160} fill={CIELO} opacity={0.5} />
    <circle cx={850} cy={520} r={60} fill={C.yellow} />
    <rect x={0} y={800} width={1080} height={700} fill="#8A6A3A" />
    <path d="M 500 800 L 580 800 L 1000 1500 L 80 1500 Z" fill={ASFALTO} />
    {new Array(6).fill(0).map((_, k) => {
      const u = ((k / 6 + avance) % 1) ** 2;
      const y = 800 + u * 700;
      const w = 4 + u * 26;
      return <rect key={k} x={540 - w / 2} y={y} width={w} height={10 + u * 50} fill={C.yellow} opacity={0.8} />;
    })}
    <g opacity={charco}>
      <ellipse cx={540} cy={834} rx={230} ry={30} fill="#9AD0FF" opacity={0.9} />
      {[0, 1, 2].map((k) => (
        <line key={k} x1={430 + k * 60 + Math.sin(t * 6 + k) * 10} y1={826 + k * 5} x2={480 + k * 60 + Math.sin(t * 6 + k) * 10} y2={826 + k * 5} stroke={C.white} strokeWidth={4} opacity={0.7} />
      ))}
    </g>
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Carretera charco={1} t={t} />
    <Texto x={540} y={1100} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué la carretera parece mojada?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.calor], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Ves un charco a lo lejos, pero al acercarte desaparece + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const charco = interpolate(t, [T.charco, T.charco + 0.3, T.desaparece, T.desaparece + 0.5], [0.5, 1, 1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.calor, T.asfalto], [1, 1.05])}>
      <Carretera charco={charco} t={t} avance={Math.max(0, t - T.charco) * 0.4} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.asfalto], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          qué estás viendo en realidad
        </Texto>
      </g>
    </Lienzo>
  );
};

// Corte lateral: suelo caliente abajo y capas de aire
const Capas: React.FC<{ readonly op: number; readonly t: number }> = ({ op, t }) => (
  <g>
    <rect x={0} y={1200} width={1080} height={120} fill={ASFALTO} />
    <rect x={0} y={1180} width={1080} height={30} fill={C.orange} opacity={0.5 + 0.2 * Math.sin(t * 5)} />
    <g opacity={op}>
      {new Array(5).fill(0).map((_, r) => {
        const y = 520 + r * 140;
        const n = 18 - r * 3;
        return new Array(n).fill(0).map((__, k) => (
          <circle key={`${r}-${k}`} cx={40 + (k + 0.5) * (1000 / n) + Math.sin(t * 2 + k + r) * (4 + r * 3)} cy={y + Math.cos(t * 3 + k) * 8} r={8} fill={r > 2 ? C.orange : "#8AC8F8"} opacity={0.8} />
        ));
      })}
    </g>
  </g>
);

// C. El asfalto calienta el aire justo encima, menos denso que el de arriba
export const Aire: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.asfalto, T.luz], [1, 1.04])}>
      <Capas op={aparece(t, T.asfalto + 0.4)} t={t} />
      <Texto x={540} y={1290} size={36} color={C.orange} op={aparece(t, T.asfalto)}>
        asfalto caliente
      </Texto>
      <g opacity={aparece(t, T.denso)}>
        <Texto x={880} y={470} size={32} color="#8AC8F8">
          frío: denso
        </Texto>
        <Texto x={880} y={1150} size={32} color={C.orange}>
          caliente: menos denso
        </Texto>
      </g>
    </Lienzo>
  );
};

// Rayo curvo del cielo al ojo rozando el suelo; p = avance 0-1
const Rayo: React.FC<{ readonly p: number; readonly fantasma: number }> = ({ p, fantasma }) => {
  const pts = new Array(61).fill(0).map((_, i) => {
    const u = (i / 60) * p;
    const x = 120 + u * 760;
    const y = 520 + (1 - (2 * u - 1) ** 2) * 640 - u * 200 * 0;
    return [x, Math.min(y, 1160)];
  });
  const fin = pts[pts.length - 1];
  return (
    <g>
      <path d={pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ")} stroke={C.yellow} strokeWidth={8} fill="none" />
      <circle cx={fin[0]} cy={fin[1]} r={12} fill={C.yellow} />
      <g opacity={fantasma}>
        <line x1={880} y1={520} x2={500} y2={1430} stroke={C.white} strokeWidth={4} strokeDasharray="14 10" />
        <path d="M 470 1400 q 30 -40 60 0 q 30 -40 60 0" stroke={CIELO} strokeWidth={8} fill="none" />
      </g>
    </g>
  );
};

const Ojo: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -50 0 Q 0 -35 50 0 Q 0 35 -50 0 Z" fill={C.white} />
    <circle cx={-12} cy={0} r={16} fill="#3A7AB8" />
    <circle cx={-12} cy={0} r={7} fill="#05040F" />
  </g>
);

// D-E. La luz se curva hacia arriba en el aire caliente; un rayo del cielo llega a tus ojos desde abajo
export const Curva: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.rayo, T.ojos], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.luz, T.cerebro], [1, 1.04])}>
        <Capas op={0.35} t={t} />
        <g opacity={aparece(t, T.cielo)}>
          <ellipse cx={120} cy={500} rx={90} ry={40} fill={C.white} opacity={0.9} />
          <Texto x={120} y={440} size={32} color={CIELO}>
            cielo
          </Texto>
        </g>
        <Ojo x={900} y={520} />
        <Texto x={540} y={1440} size={38} color={C.yellow} op={aparece(t, T.rapido) * (1 - aparece(t, T.rayo))}>
          más rápido en el aire caliente
        </Texto>
        <g opacity={aparece(t, T.curvando) * (1 - aparece(t, T.rayo))}>
          <path d="M 200 600 Q 540 1300 880 600" stroke={C.yellow} strokeWidth={6} fill="none" strokeDasharray="16 10" />
          <Texto x={540} y={760} size={36} color={C.yellow}>
            se curva hacia arriba
          </Texto>
        </g>
        <Rayo p={p} fantasma={aparece(t, T.ojos)} />
      </Lienzo>
      <Flash t={t} d={T.dobla} color={C.yellow} />
    </>
  );
};

// F. Tu cerebro cree que viene del suelo: ves un pedazo de cielo sobre la carretera
export const Cerebro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cerebro, T.porEso], [1, 1.06])} cy={830}>
      <Carretera charco={aparece(t, T.cielo2)} t={t} />
      <rect x={170} y={1030} width={740} height={190} rx={24} fill={C.card} opacity={aparece(t, T.cielo2)} />
      <Texto x={540} y={1110} size={44} color="#9AD0FF" op={aparece(t, T.cielo2)}>
        es un pedazo de cielo
      </Texto>
      <Texto x={540} y={1180} size={36} color={C.white} op={aparece(t, T.brilla)}>
        y brilla como el agua
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
