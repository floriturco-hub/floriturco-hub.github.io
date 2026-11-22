import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/escalera/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  llegas: 1.94,
  desaparecen: 2.86,
  final: 4.44,
  cada: 7.32,
  ruedas: 9.0,
  rieles: 10.14,
  en: 11.5,
  separan: 12.92,
  horizontal: 14.24,
  al: 16.34,
  juntan: 17.82,
  aplanan: 19.18,
  cinta: 20.94,
  luego: 21.62,
  vuelta: 22.4,
  regresan: 24.78,
  y: 26.06,
  sensores: 26.32,
  peine: 28.42,
  si: 29.88,
  empuja: 31.2,
  interruptor: 32.32,
  freno: 34.04,
  porEso: 35.66,
  fin: 38.14,
};

const METAL = "#8A86A8";
const ESCALON = "#C8C4D8";
const RIEL_A = C.cyan;
const RIEL_B = C.orange;

// Punto sobre el recorrido de la escalera (u 0..1): llano abajo, subida, llano arriba
const punto = (u: number) => {
  const x0 = 100;
  const x1 = 280;
  const x2 = 800;
  const x3 = 980;
  const y0 = 1300;
  const y1 = 620;
  const L = x3 - x0;
  const x = x0 + u * L;
  if (x < x1) return { x, y: y0, llano: true };
  if (x > x2) return { x, y: y1, llano: true };
  return { x, y: y0 - ((x - x1) / (x2 - x1)) * (y0 - y1), llano: false };
};

// Escalera mecánica de perfil; vel = desplazamiento (0..1 por ciclo)
const Escalera: React.FC<{ readonly t: number; readonly vel?: number; readonly stop?: number }> = ({ t, vel = 1, stop = 0 }) => {
  const avance = t * 0.06 * vel * (1 - stop);
  const n = 14;
  return (
    <g>
      {/* estructura */}
      <path d="M 60 1340 L 280 1340 L 800 660 L 1020 660 L 1020 760 L 830 760 L 310 1440 L 60 1440 Z" fill="#3A3650" />
      {/* pasamanos */}
      <path d="M 80 1200 L 270 1200 L 790 520 L 1000 520" stroke="#1A1620" strokeWidth={22} fill="none" strokeLinecap="round" />
      {new Array(n).fill(0).map((_, k) => {
        const u = (k / n + avance) % 1;
        const p = punto(u);
        const q = punto(Math.min(1, u + 1 / n));
        const ancho = q.x - p.x;
        return (
          <g key={k}>
            <rect x={p.x} y={p.y - 14} width={ancho - 4} height={14} fill={ESCALON} />
            {!p.llano ? <rect x={p.x + ancho - 8} y={q.y - 14} width={8} height={p.y - q.y + 4} fill="#A8A4C0" /> : null}
          </g>
        );
      })}
      {/* placas de peine arriba y abajo */}
      <rect x={60} y={1286} width={60} height={20} fill={METAL} />
      <rect x={960} y={606} width={60} height={20} fill={METAL} />
    </g>
  );
};

// A. Gancho: ¿dónde se esconden estos escalones?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.llegas], [1.12, 1])}>
        <Escalera t={t} />
        <Texto x={900} y={480} size={110} color={C.yellow} op={interpolate(t, [0.6, 0.9], [0, 1], clamp)}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.72} />
    </>
  );
};

// B. Llegas arriba y desaparecen bajo el piso + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = ((t - T.llegas) * 0.25) % 1;
  return (
    <Lienzo zoom={interpolate(t, [T.llegas, T.cada], [1, 1.05])}>
      {/* rellano superior visto de cerca */}
      <rect x={60} y={900} width={960} height={40} fill={METAL} />
      <rect x={600} y={880} width={420} height={60} fill="#6A6488" />
      {new Array(10).fill(0).map((_, k) => (
        <rect key={k} x={600 + k * 18} y={870} width={8} height={30} fill={METAL} />
      ))}
      {[0, 1, 2].map((k) => {
        const uu = (u + k / 3) % 1;
        const x = 120 + uu * 560;
        const baja = x > 580 ? (x - 580) * 0.6 : 0;
        return <rect key={k} x={x} y={860 + baja} width={160} height={30} fill={ESCALON} opacity={x > 640 ? 0.3 : 1} />;
      })}
      <Texto x={540} y={760} size={40} color={C.white} op={aparece(t, T.desaparecen)}>
        desaparecen bajo el piso
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.cada], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={38}>
          qué pasa si se atora un zapato: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Escalón de perfil con dos ruedas (delantera en riel A, trasera en riel B)
const Escalon: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly dy?: number }> = ({ x, y, s, dy = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M -150 -100 L 150 -100 L 150 -80 L -40 ${60 + dy} L -150 ${60 + dy} Z`} fill={ESCALON} />
    <circle cx={120} cy={-60} r={26} fill={RIEL_A} />
    <circle cx={-110} cy={80 + dy} r={26} fill={RIEL_B} />
  </g>
);

// C. Cada escalón tiene dos pares de ruedas que van por dos rieles distintos
export const Ruedas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cada, T.en], [1, 1.04])}>
      <Escalon x={540} y={840} s={1.8} />
      <g opacity={aparece(t, T.rieles)}>
        <line x1={100} y1={840 - 60 * 1.8 + 46} x2={980} y2={840 - 60 * 1.8 + 46} stroke={RIEL_A} strokeWidth={10} />
        <line x1={100} y1={840 + 80 * 1.8 + 46} x2={980} y2={840 + 80 * 1.8 + 46} stroke={RIEL_B} strokeWidth={10} />
        <Texto x={880} y={760} size={34} color={RIEL_A}>
          riel 1
        </Texto>
        <Texto x={880} y={1130} size={34} color={RIEL_B}>
          riel 2
        </Texto>
      </g>
      <Texto x={540} y={1300} size={40} color={C.white} op={aparece(t, T.ruedas)}>
        dos pares de ruedas
      </Texto>
    </Lienzo>
  );
};

// D-E. Rieles separados = escalera; rieles juntos = cinta plana
const Tramo: React.FC<{ readonly t: number; readonly separacion: number }> = ({ t, separacion }) => {
  const u = (t * 0.25) % 1;
  return (
    <g>
      <line x1={80} y1={760} x2={1000} y2={760} stroke={RIEL_A} strokeWidth={10} />
      <line x1={80} y1={760 + separacion} x2={1000} y2={760 + separacion} stroke={RIEL_B} strokeWidth={10} />
      {[0, 1, 2, 3].map((k) => {
        const x = 80 + ((u + k / 4) % 1) * 920;
        return (
          <g key={k} transform={`translate(${x} 760)`}>
            <rect x={-90} y={-60} width={180} height={18} fill={ESCALON} />
            <path d={`M -90 -42 L 90 -42 L -60 ${separacion - 20} L -90 ${separacion - 20} Z`} fill={ESCALON} opacity={0.7} />
            <circle cx={70} cy={0} r={18} fill={RIEL_A} />
            <circle cx={-70} cy={separacion} r={18} fill={RIEL_B} />
          </g>
        );
      })}
    </g>
  );
};

export const Separan: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sep = interpolate(t, [T.separan - 0.5, T.separan + 0.6], [40, 220], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.en, T.al], [1, 1.04])}>
      <Tramo t={t} separacion={sep} />
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.separan)}>
        rieles separados
      </Texto>
      <Texto x={540} y={1200} size={40} color={C.yellow} op={aparece(t, T.horizontal)}>
        escalón horizontal: escalera
      </Texto>
    </Lienzo>
  );
};

export const Juntan: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sep = interpolate(t, [T.juntan - 0.3, T.aplanan + 0.4], [220, 30], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.al, T.luego], [1, 1.04])}>
      <Tramo t={t} separacion={sep} />
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.juntan)}>
        arriba, los rieles se juntan
      </Texto>
      <Texto x={540} y={1200} size={40} color={C.yellow} op={aparece(t, T.cinta)}>
        como una cinta plana
      </Texto>
    </Lienzo>
  );
};

// F. Dan la vuelta por debajo, guiados por los rieles, y regresan al inicio
export const Vuelta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = 12;
  return (
    <Lienzo zoom={interpolate(t, [T.luego, T.y], [1, 1.04])}>
      <path d="M 200 1200 L 800 620 A 80 80 0 0 1 880 780 L 280 1360 A 80 80 0 0 1 200 1200 Z" fill="none" stroke="#4A4466" strokeWidth={30} />
      {new Array(n).fill(0).map((_, k) => {
        const u = ((k / n + (t - T.luego) * 0.08) % 1 + 1) % 1;
        // recorrido cerrado aproximado: ida (0..0.45), vuelta arriba (0.45..0.5), regreso (0.5..0.95), vuelta abajo
        let x = 0;
        let y = 0;
        if (u < 0.45) {
          const f = u / 0.45;
          x = 200 + f * 600;
          y = 1200 - f * 580;
        } else if (u < 0.5) {
          const a = -Math.PI / 2 + ((u - 0.45) / 0.05) * Math.PI;
          x = 840 + Math.cos(a) * 80;
          y = 700 + Math.sin(a) * 80;
        } else if (u < 0.95) {
          const f = (u - 0.5) / 0.45;
          x = 880 - f * 600;
          y = 780 + f * 580;
        } else {
          const a = Math.PI / 2 + ((u - 0.95) / 0.05) * Math.PI;
          x = 240 + Math.cos(a) * 80;
          y = 1280 + Math.sin(a) * 80;
        }
        return <rect key={k} x={x - 40} y={y - 12} width={80} height={24} rx={6} fill={u > 0.47 && u < 0.98 ? "#8A86A8" : ESCALON} />;
      })}
      <Texto x={540} y={560} size={38} color={C.white} op={aparece(t, T.vuelta)}>
        dan la vuelta por debajo
      </Texto>
      <Texto x={540} y={1480} size={38} color={C.cyan} op={aparece(t, T.regresan)}>
        y regresan al inicio
      </Texto>
    </Lienzo>
  );
};

// Placa de peine: dientes
const Peine: React.FC<{ readonly x: number; readonly y: number; readonly empuje?: number }> = ({ x, y, empuje = 0 }) => (
  <g transform={`translate(${x + empuje * 40} ${y})`}>
    <rect x={0} y={0} width={500} height={60} fill={METAL} />
    {new Array(14).fill(0).map((_, k) => (
      <rect key={k} x={-60} y={6 + k * 4} width={70} height={2} fill={METAL} />
    ))}
    {new Array(10).fill(0).map((_, k) => (
      <path key={`d${k}`} d={`M ${-10} ${4 + k * 6} L ${-70} ${4 + k * 6 + 2}`} stroke={METAL} strokeWidth={3} />
    ))}
  </g>
);

// G. Hay sensores de seguridad, sobre todo en el peine de metal del final
export const PeineMetal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.si], [1, 1.04])}>
      <rect x={60} y={900} width={500} height={40} fill={ESCALON} />
      {new Array(16).fill(0).map((_, k) => (
        <rect key={k} x={60 + k * 31} y={880} width={18} height={20} fill={ESCALON} />
      ))}
      <Peine x={520} y={860} />
      {[0, 1, 2].map((k) => (
        <g key={k} opacity={aparece(t, T.sensores + k * 0.3)} transform={`translate(${380 + k * 220} 700)`}>
          <circle r={34} fill="none" stroke={C.yellow} strokeWidth={6} />
          <circle r={10} fill={C.yellow} />
        </g>
      ))}
      <Texto x={540} y={600} size={38} color={C.yellow} op={aparece(t, T.sensores)}>
        sensores de seguridad
      </Texto>
      <Texto x={780} y={1060} size={38} color={C.white} op={aparece(t, T.peine)}>
        peine de metal
      </Texto>
    </Lienzo>
  );
};

// H. Si un zapato se atora y empuja el peine, se corta la corriente y frena
export const Atora: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const empuje = interpolate(t, [T.empuja, T.empuja + 0.4], [0, 1], clamp);
  const corta = aparece(t, T.interruptor + 0.4);
  const frena = aparece(t, T.freno);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.si, T.porEso], [1, 1.04])}>
        <rect x={60} y={900} width={500} height={40} fill={ESCALON} />
        <Peine x={520} y={860} empuje={empuje} />
        {/* zapato atorado */}
        <g transform={`translate(${interpolate(t, [T.si, T.empuja], [200, 470], clamp)} 880)`}>
          <path d="M -120 0 L -120 -90 L -30 -90 L 0 -40 L 100 -30 Q 120 -10 100 0 Z" fill="#8A4A3A" />
        </g>
        {/* interruptor y corriente */}
        <g transform="translate(540 1150)">
          <rect x={-220} y={-60} width={440} height={130} rx={20} fill={C.card} stroke={C.cardBorder} strokeWidth={4} />
          <circle cx={-120} cy={0} r={14} fill={C.white} />
          <circle cx={0} cy={0} r={14} fill={C.white} />
          <line x1={-120} y1={0} x2={0} y2={-corta * 60} stroke={corta > 0.5 ? C.red : "#5AC878"} strokeWidth={10} />
          <Texto x={120} y={14} size={36} color={corta > 0.5 ? C.red : "#5AC878"}>
            {corta > 0.5 ? "OFF" : "ON"}
          </Texto>
        </g>
        <g opacity={frena} transform="translate(540 640) rotate(-4)">
          <rect x={-160} y={-60} width={320} height={110} rx={16} fill="none" stroke={C.red} strokeWidth={10} />
          <Texto x={0} y={18} size={60} color={C.red}>
            STOP
          </Texto>
        </g>
        <Texto x={540} y={1360} size={36} color={C.white} op={aparece(t, T.empuja)}>
          el zapato empuja el peine
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.freno} color={C.red} />
    </>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Escalera t={t} />
      <Texto x={900} y={480} size={110} color={C.yellow}>
        ?
      </Texto>
    </Lienzo>
  );
};
