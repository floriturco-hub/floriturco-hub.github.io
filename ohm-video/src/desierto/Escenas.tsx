import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/desierto/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  mediodia: 3.10, // medio
  helada: 5.04, // helada
  playa: 6.62, // playa
  final: 9.08, // final
  baja: 9.98, // baja
  arena: 10.98, // arena
  enfria: 13.62, // enfr
  mar: 15.28, // mar
  despacio: 17.68, // despacio
  bateria: 18.72, // bater
  humedo: 20.52, // humedo
  cobija: 23.98, // cobija
  seco: 26.30, // seco
  nubes: 27.56, // nubes
  espacio: 30.96, // espacio
  desiertos: 32.20, // desiertos
  horas: 35.64, // horas
  porEso: 36.28, // por
  fin: 38.12, // FIN
};

const ARENA = "#E0B060";
const MAR = "#2A7AC8";
const CALOR = "#E8703C";

// Paisaje: noche n (0 día..1 noche)
const Desierto: React.FC<{ readonly x?: number; readonly w?: number; readonly n: number; readonly t: number }> = ({ x = 0, w = 1080, n, t }) => (
  <g>
    <rect x={x} y={640} width={w} height={500} fill={n > 0.5 ? "#141A3A" : "#4A8AC8"} opacity={0.5} />
    <circle cx={x + w * 0.7} cy={760} r={60} fill={n > 0.5 ? "#E8E6F0" : C.yellow} />
    {n > 0.5
      ? new Array(10).fill(0).map((_, k) => <circle key={k} cx={x + ((k * 97) % w)} cy={680 + ((k * 53) % 160)} r={3} fill="#FFFFFF" opacity={0.6 + 0.4 * Math.sin(t * 3 + k)} />)
      : null}
    <path d={`M ${x} 1140 Q ${x + w * 0.25} 1040 ${x + w * 0.5} 1120 Q ${x + w * 0.75} 1060 ${x + w} 1130 L ${x + w} 1400 L ${x} 1400 Z`} fill={ARENA} />
  </g>
);

const Termometro: React.FC<{ readonly x: number; readonly y: number; readonly v: number; readonly label: string }> = ({ x, y, v, label }) => (
  <g>
    <rect x={x - 22} y={y - 260} width={44} height={260} rx={22} fill="#2A2440" stroke="#DDEEFF" strokeWidth={4} />
    <rect x={x - 12} y={y - 20 - 220 * v} width={24} height={20 + 220 * v} rx={12} fill={v > 0.5 ? CALOR : "#3AB8E8"} />
    <circle cx={x} cy={y + 20} r={36} fill={v > 0.5 ? CALOR : "#3AB8E8"} />
    <Texto x={x} y={y + 100} size={34} color={C.white}>
      {label}
    </Texto>
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Desierto n={1} t={t} />
    <Termometro x={240} y={1340} v={0.1} label="" />
    <Texto x={880} y={560} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este desierto se congela?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.mediodia], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Desierto: mediodía horno, noche helada; playa: casi no cambia + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = aparece(t, T.helada);
  const pl = aparece(t, T.playa);
  const osc = 0.5 + 0.5 * Math.sin(t * 2);
  return (
    <Lienzo zoom={interpolate(t, [T.mediodia, T.arena], [1, 1.04])}>
      <g opacity={1 - pl}>
        <Desierto n={n} t={t} />
        <Termometro x={240} y={1400} v={0.95 - 0.85 * n} label={n > 0.5 ? "noche" : "mediodía"} />
      </g>
      <g opacity={pl}>
        <Desierto x={0} w={540} n={osc > 0.5 ? 1 : 0} t={t} />
        <Termometro x={270} y={1400} v={osc} label="desierto" />
        <rect x={540} y={640} width={540} height={500} fill="#4A8AC8" opacity={0.5} />
        <rect x={540} y={1100} width={540} height={300} fill={MAR} />
        <Termometro x={810} y={1400} v={0.5 + 0.05 * Math.sin(t * 2)} label="playa" />
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          cuánto baja: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.arena], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. La arena se calienta y se enfría rápido; el mar tarda y suelta el calor despacio, como una batería
export const Bateria: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ciclo = 0.5 + 0.5 * Math.sin(t * 2.2);
  const lento = 0.5 + 0.12 * Math.sin(t * 2.2 - 1.2);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.arena, T.humedo], [1, 1.04])}>
        <g opacity={aparece(t, T.arena)}>
          <rect x={120} y={1000} width={360} height={200} rx={20} fill={ARENA} />
          <rect x={120} y={1000} width={360} height={200} rx={20} fill={CALOR} opacity={0.6 * ciclo} />
          <Termometro x={300} y={940} v={ciclo} label="" />
          <Texto x={300} y={1270} size={32} color={C.white}>
            arena: rápido
          </Texto>
        </g>
        <g opacity={aparece(t, T.mar)}>
          <rect x={600} y={1000} width={360} height={200} rx={20} fill={MAR} />
          <rect x={600} y={1000} width={360} height={200} rx={20} fill={CALOR} opacity={0.6 * lento} />
          <Termometro x={780} y={940} v={lento} label="" />
          <Texto x={780} y={1270} size={32} color={C.white}>
            mar: despacio
          </Texto>
        </g>
        <g opacity={aparece(t, T.bateria)} transform="translate(780 1400)">
          <rect x={-70} y={-36} width={140} height={72} rx={12} fill="none" stroke="#5AD08A" strokeWidth={6} />
          <rect x={70} y={-14} width={14} height={28} fill="#5AD08A" />
          <rect x={-58} y={-24} width={90} height={48} rx={6} fill="#5AD08A" />
        </g>
      </Lienzo>
      <Flash t={t} d={T.mar} color={MAR} />
    </>
  );
};

// D. El aire húmedo de la playa atrapa el calor como una cobija; el del desierto, seco y sin nubes, lo deja escapar al espacio
export const Cobija: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sec = aparece(t, T.seco);
  const flecha = (x: number, escapa: boolean, k: number) => {
    const u = (t * 0.7 + k * 0.33) % 1;
    const y = escapa ? 1080 - u * 500 : 1080 - (u < 0.5 ? u : 1 - u) * 400;
    return <circle key={k} cx={x + k * 50} cy={y} r={14} fill={CALOR} opacity={escapa ? 1 - u : 0.9} />;
  };
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.humedo, T.desiertos], [1, 1.04])}>
        <g>
          <rect x={60} y={1100} width={460} height={300} fill={MAR} />
          <rect x={60} y={700} width={460} height={120} rx={60} fill="#B8C8E0" opacity={0.7 * aparece(t, T.cobija)} />
          {[0, 1, 2].map((k) => flecha(190, false, k))}
          <Texto x={290} y={1460} size={30} color={C.white} op={aparece(t, T.humedo)}>
            playa: vapor = cobija
          </Texto>
        </g>
        <g opacity={sec}>
          <Desierto x={560} w={460} n={1} t={t} />
          {aparece(t, T.espacio) > 0 ? [0, 1, 2].map((k) => flecha(680, true, k)) : null}
          <Texto x={790} y={1460} size={30} color={C.white}>
            desierto: seco, sin nubes
          </Texto>
        </g>
        <Texto x={540} y={600} size={36} color={C.orange} op={aparece(t, T.espacio)}>
          el calor escapa directo al espacio
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.espacio} color={CALOR} />
    </>
  );
};

// E. En algunos desiertos baja más de 30 °C en unas horas
export const Baja: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const b = interpolate(t, [T.desiertos, T.horas + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.desiertos, T.porEso], [1, 1.04])}>
        <Desierto n={b > 0.5 ? 1 : 0} t={t} />
        <Termometro x={300} y={1420} v={0.95 - 0.85 * b} label={`${Math.round(40 - 32 * b)} °C`} />
        <Texto x={540} y={620} size={72} color={C.yellow} op={aparece(t, T.desiertos)}>
          -30 °C
        </Texto>
        <Texto x={540} y={700} size={36} color={C.white} op={aparece(t, T.horas)}>
          en unas horas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.horas} color="#3AB8E8" />
    </>
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
