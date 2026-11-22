import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/parabrisas/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  cae: 2.04, // cae
  enciende: 4.00, // enciende
  final: 5.22, // final
  detras: 7.70, // detras
  sensor: 9.00, // sensor
  infrarroja: 10.06, // infrarroja
  angulo: 11.78, // angulo
  con: 12.50, // con
  rebota: 13.90, // rebota
  completa: 16.26, // completa
  pero: 17.56, // pero
  escapar: 18.76, // escapar
  menos: 21.18, // menos
  llueve: 22.98, // llueve
  escobilla: 24.18, // escobilla
  inclina: 26.02, // inclina
  espatula: 27.86, // espatula
  blanda: 28.94, // blanda
  raya: 30.66, // raya
  arena: 31.46, // arena
  asi: 32.96, // asi
  fin: 34.74, // FIN
};

const VIDRIO = "#7AB8E8";
const IR = "#E8414F";
const AGUA = "#2AA8D8";

// Parabrisas visto de frente con limpiador (ang en grados) y gotas
const Frente: React.FC<{ readonly ang: number; readonly gotas: number; readonly t: number }> = ({ ang, gotas, t }) => (
  <g>
    <path d="M 140 1180 L 230 640 L 850 640 L 940 1180 Z" fill="#1C2A50" stroke="#5A5478" strokeWidth={14} />
    <rect x={490} y={640} width={100} height={60} rx={10} fill="#2A2640" />
    {new Array(14).fill(0).map((_, k) => {
      const gx = 250 + ((k * 137) % 580);
      const gy = 700 + ((k * 89) % 430);
      const barrido = (Math.atan2(1180 - gy, gx - 300) * 180) / Math.PI;
      const limpia = 180 - ang < barrido ? 0 : 1;
      return <ellipse key={k} cx={gx} cy={gy} rx={10} ry={14} fill={AGUA} opacity={gotas * (k / 14 < gotas ? 1 : 0) * (ang > 5 ? limpia : 1)} />;
    })}
    <g transform={`rotate(${-ang} 300 1170)`}>
      <line x1={300} y1={1170} x2={820} y2={1170} stroke="#111" strokeWidth={14} strokeLinecap="round" />
      <line x1={420} y1={1185} x2={830} y2={1185} stroke="#333" strokeWidth={10} />
    </g>
    <circle cx={300} cy={1170} r={18} fill="#333" />
    <rect x={-20 + 0 * t} y={1180} width={1120} height={60} fill="#2A2640" />
  </g>
);

// Corte del vidrio con el haz infrarrojo; gota 0-1 en el punto de rebote central
const Corte: React.FC<{ readonly t: number; readonly haz: number; readonly gota: number; readonly fuga: number }> = ({ t, haz, gota, fuga }) => {
  const y0 = 760;
  const y1 = 900;
  const xs = [200, 340, 480, 620, 760, 900];
  const pts = xs.map((x, i) => `${i ? "L" : "M"} ${x} ${i % 2 ? y0 : y1}`).join(" ");
  const fin = interpolate(haz, [0, 1], [0, 1], clamp);
  return (
    <g>
      <rect x={60} y={y0} width={960} height={y1 - y0} fill={VIDRIO} opacity={0.35} stroke={VIDRIO} strokeWidth={4} />
      <Texto x={880} y={y0 - 20} size={28} color={C.grey}>
        afuera
      </Texto>
      <Texto x={540} y={y1 + 60} size={28} color={C.grey}>
        adentro
      </Texto>
      {/* emisor y detector */}
      <rect x={150} y={y1 + 10} width={100} height={60} rx={10} fill="#3A3650" />
      <rect x={850} y={y1 + 10} width={100} height={60} rx={10} fill="#3A3650" />
      <circle cx={200} cy={y1 + 10} r={12} fill={IR} />
      <circle cx={900} cy={y1 + 10} r={12} fill={C.white} opacity={0.3 + 0.7 * (1 - fuga * 0.7)} />
      <path d={pts} stroke={IR} strokeWidth={10} fill="none" strokeDasharray={`${1400 * fin} 2000`} opacity={1 - fuga * 0.5} />
      {[0, 1, 2, 3].map((k) => {
        const u = (t * 0.7 + k / 4) % 1;
        const seg = Math.floor(u * 5);
        const f = u * 5 - seg;
        const x = xs[seg] + (xs[seg + 1] - xs[seg]) * f;
        const y = seg % 2 ? y0 + (y1 - y0) * f : y1 - (y1 - y0) * f;
        return <circle key={k} cx={x} cy={y} r={12} fill={C.white} opacity={haz > 0.95 ? 1 - fuga * (seg >= 3 ? 0.7 : 0) : 0} />;
      })}
      <g opacity={gota}>
        <path d={`M 540 ${y0} q -90 0 -70 -80 q 20 -50 70 -100 q 50 50 70 100 q 20 80 -70 80 Z`} fill={AGUA} opacity={0.85} />
      </g>
      <path d={`M 480 ${y0} L 440 ${y0 - 200}`} stroke={IR} strokeWidth={10} strokeDasharray="18 12" opacity={fuga} />
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Frente ang={0} gotas={1} t={t} />
    <Texto x={540} y={540} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo sabe tu auto que está lloviendo?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cae], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.cyan} />
    </>
  );
};

// B. Cae una gota y el limpiaparabrisas se enciende solo + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ciclo = Math.max(0, t - T.enciende);
  const ang = ciclo > 0 ? 55 * (1 - Math.cos(ciclo * 3)) : 0;
  return (
    <Lienzo zoom={interpolate(t, [T.cae, T.detras], [1, 1.05])}>
      <Frente ang={ang} gotas={interpolate(t, [T.cae, T.cae + 0.8], [0.1, 1], clamp)} t={t} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.detras], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          por qué no raya el vidrio: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Detrás del espejo, un sensor dispara luz infrarroja hacia el vidrio, en ángulo
export const Sensor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const corte = aparece(t, T.infrarroja);
  return (
    <Lienzo zoom={interpolate(t, [T.detras, T.con], [1, 1.04])}>
      <g opacity={1 - corte}>
        <Frente ang={0} gotas={0} t={t} />
        <g opacity={aparece(t, T.sensor)}>
          <circle cx={540} cy={670} r={70} fill="none" stroke={C.yellow} strokeWidth={8} />
          <Texto x={540} y={560} size={40} color={C.yellow}>
            sensor
          </Texto>
        </g>
      </g>
      <g opacity={corte}>
        <Corte t={t} haz={interpolate(t, [T.infrarroja, T.angulo + 0.5], [0, 0.35], clamp)} gota={0} fuga={0} />
        <Texto x={540} y={1140} size={40} color={IR}>
          luz infrarroja, en ángulo
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Con el vidrio seco, la luz rebota por dentro y vuelve completa al sensor
export const Rebota: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.con, T.pero], [1, 1.04])}>
      <Corte t={t} haz={interpolate(t, [T.con, T.completa], [0.35, 1], clamp)} gota={0} fuga={0} />
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.con)}>
        vidrio seco
      </Texto>
      <Texto x={540} y={1140} size={40} color={IR} op={aparece(t, T.rebota)}>
        rebota como en un espejo
      </Texto>
      <Texto x={540} y={1200} size={36} color={C.white} op={aparece(t, T.completa)}>
        100 % de la luz vuelve
      </Texto>
    </Lienzo>
  );
};

// E. Una gota deja escapar luz: llega menos y el auto sabe que llueve
export const Gota: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gota = interpolate(t, [T.pero, T.pero + 0.4], [0, 1], clamp);
  const fuga = aparece(t, T.escapar);
  const pct = Math.round(100 - 45 * aparece(t, T.menos));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.escobilla], [1, 1.04])}>
        <Corte t={t} haz={1} gota={gota} fuga={fuga} />
        <Texto x={540} y={1140} size={40} color={IR} op={aparece(t, T.escapar)}>
          la luz se escapa por la gota
        </Texto>
        <Texto x={900} y={1030} size={40} color={pct < 90 ? C.yellow : C.white} op={aparece(t, T.menos)}>
          {`${pct} %`}
        </Texto>
        <g opacity={aparece(t, T.llueve)}>
          <rect x={290} y={1230} width={500} height={100} rx={20} fill={C.card} stroke={AGUA} strokeWidth={4} />
          <Texto x={540} y={1295} size={44} color={AGUA}>
            ¡está lloviendo!
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.llueve} color={C.cyan} />
    </>
  );
};

// F. La escobilla de goma blanda arrastra el agua; no raya el vidrio, la arena sí
export const Escobilla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const x = interpolate(t, [T.escobilla, T.blanda], [220, 760], clamp);
  const arena = aparece(t, T.arena);
  const ax = interpolate(t, [T.arena, T.asi], [300, 820], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.escobilla, T.asi], [1, 1.04])}>
        <rect x={60} y={900} width={960} height={80} fill={VIDRIO} opacity={0.35} stroke={VIDRIO} strokeWidth={4} />
        <rect x={x + 20} y={880} width={1000 - x - 20} height={20} rx={8} fill={AGUA} opacity={1 - arena} />
        <g opacity={1 - arena} transform={`translate(${x} 900)`}>
          <rect x={-40} y={-200} width={80} height={110} rx={14} fill="#333" />
          <path d={`M -14 -90 L 14 -90 L ${interpolate(t, [T.inclina, T.inclina + 0.3], [6, 30], clamp)} 0 L ${interpolate(t, [T.inclina, T.inclina + 0.3], [-6, 18], clamp)} 0 Z`} fill="#111" />
        </g>
        <Texto x={540} y={700} size={40} color={C.white} op={aparece(t, T.escobilla) * (1 - aparece(t, T.blanda))}>
          goma blanda: como una espátula
        </Texto>
        <g opacity={aparece(t, T.blanda) * (1 - arena)}>
          <Texto x={540} y={700} size={40} color={C.cyan}>
            goma más blanda que el vidrio
          </Texto>
          <Texto x={540} y={1100} size={40} color={C.cyan} op={aparece(t, T.raya)}>
            no lo raya
          </Texto>
        </g>
        <g opacity={arena}>
          <line x1={300} y1={902} x2={ax} y2={902} stroke={C.red} strokeWidth={6} />
          <g transform={`translate(${ax} 900)`}>
            <rect x={-40} y={-200} width={80} height={110} rx={14} fill="#333" />
            <path d="M -14 -90 L 14 -90 L 30 0 L 18 0 Z" fill="#111" />
            <polygon points="20,-2 34,-20 46,-4" fill={C.yellow} />
          </g>
          <Texto x={540} y={700} size={40} color={C.yellow}>
            la arena atrapada sí raya
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.arena} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
