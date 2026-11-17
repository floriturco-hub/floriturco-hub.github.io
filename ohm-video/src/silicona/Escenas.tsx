import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/silicona/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  termostato: 2.74, // termostato
  moviles: 3.84, // moviles
  justa: 6.22, // justa
  final: 7.10, // final
  calentador: 10.42, // calentador
  ceramica: 11.82, // ceramica
  ptc: 13.32, // ptc
  frio: 14.84, // frio
  corriente: 16.14, // corriente
  rapido: 17.38, // rapido
  pero: 18.00, // pero
  estructura: 19.82, // estructura
  resistencia: 21.02, // resistencia
  dispara: 21.74, // dispara
  cientos: 22.42, // cientos
  pasa: 23.56, // pasa
  calentar: 25.22, // calentar
  si: 25.92, // si
  baja: 27.58, // baja
  vuelve: 28.20, // vuelve
  regula: 29.74, // regula
  aunque: 30.58, // aunque
  punto: 32.82, // punto
  porEso: 33.42, // por
  fin: 35.82, // FIN
};

const PTC = "#C86A3A";
const BARRA = "#E8E4D0";

// Pistola de silicona de perfil (boquilla a la izquierda); corte muestra la pastilla PTC
const Pistola: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly corte?: number; readonly brillo?: number }> = ({
  x,
  y,
  s,
  corte = 0,
  brillo = 0.6,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={180} y={-40} width={260} height={60} rx={10} fill={BARRA} />
    <path d="M -260 -10 L -200 -40 L -200 40 L -260 10 Z" fill="#8C88A8" />
    <circle cx={-262} cy={0} r={14} fill={C.orange} opacity={brillo} />
    <rect x={-200} y={-90} width={400} height={170} rx={50} fill="#3A6EE8" />
    <path d="M 60 80 L 160 80 L 200 320 L 110 320 Z" fill="#2A4EA8" />
    <path d="M -20 80 q 30 90 80 100" stroke="#2A4EA8" strokeWidth={26} fill="none" />
    <g opacity={corte}>
      <rect x={-180} y={-70} width={360} height={130} rx={40} fill="#141030" />
      <rect x={-20} y={-30} width={200} height={50} rx={8} fill={BARRA} />
      <rect x={-130} y={-40} width={90} height={70} rx={8} fill={PTC} />
      <circle cx={-85} cy={-5} r={80} fill={C.orange} opacity={0.35 * brillo} />
    </g>
  </g>
);

// Curva resistencia-temperatura de un PTC; p = posición del punto (0-1 de temperatura)
const rDe = (u: number) => (u < 0.6 ? 0.08 + u * 0.03 : Math.min(1, 0.098 * Math.exp((u - 0.6) * 16)));
const Curva: React.FC<{ readonly p: number; readonly op: number }> = ({ p, op }) => {
  const x0 = 160;
  const x1 = 920;
  const y0 = 1250;
  const y1 = 700;
  const d = new Array(101)
    .fill(0)
    .map((_, i) => `${i ? "L" : "M"} ${x0 + ((x1 - x0) * i) / 100} ${y0 - (y0 - y1) * rDe(i / 100)}`)
    .join(" ");
  return (
    <g opacity={op}>
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={C.grey} strokeWidth={4} />
      <line x1={x0} y1={y0} x2={x0} y2={y1 - 40} stroke={C.grey} strokeWidth={4} />
      <Texto x={x0 + 10} y={y1 - 60} size={30} color={C.grey} anchor="start">
        resistencia
      </Texto>
      <Texto x={x1} y={y0 + 50} size={30} color={C.grey} anchor="end">
        temperatura
      </Texto>
      <path d={d} stroke={PTC} strokeWidth={8} fill="none" />
      <circle cx={x0 + (x1 - x0) * p} cy={y0 - (y0 - y1) * rDe(p)} r={20} fill={C.yellow} />
    </g>
  );
};

// Pastilla con corriente: flujo 0-1 (velocidad y cantidad), brillo 0-1
const Pastilla: React.FC<{ readonly x: number; readonly y: number; readonly flujo: number; readonly brillo: number; readonly t: number }> = ({
  x,
  y,
  flujo,
  brillo,
  t,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <line x1={-320} y1={0} x2={320} y2={0} stroke="#5A5478" strokeWidth={14} />
    <circle cx={0} cy={0} r={110} fill={C.orange} opacity={0.4 * brillo} />
    <rect x={-80} y={-60} width={160} height={120} rx={14} fill={PTC} />
    <Texto x={0} y={14} size={40} color={C.white}>
      PTC
    </Texto>
    {new Array(10).fill(0).map((_, k) => {
      const u = (t * (0.2 + flujo * 0.8) + k / 10) % 1;
      return <circle key={k} cx={-320 + u * 640} cy={0} r={11} fill={C.yellow} opacity={k / 10 < 0.15 + flujo * 0.85 ? 1 : 0} />;
    })}
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Pistola x={560} y={900} s={1.1} />
    <Texto x={300} y={680} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta pistola nunca se sobrecalienta?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.termostato], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.orange} />
    </>
  );
};

// B. Sin termostato ni partes móviles, se queda a la temperatura justa + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const Tache: React.FC<{ readonly x: number; readonly op: number; readonly txt: string }> = ({ x, op, txt }) => (
    <g opacity={op}>
      <rect x={x - 150} y={1080} width={300} height={90} rx={18} fill={C.card} stroke={C.grey} strokeWidth={3} />
      <Texto x={x} y={1138} size={32} color={C.white}>
        {txt}
      </Texto>
      <line x1={x - 140} y1={1170} x2={x + 140} y2={1080} stroke={C.red} strokeWidth={10} />
    </g>
  );
  return (
    <Lienzo zoom={interpolate(t, [T.termostato, T.calentador], [1, 1.05])}>
      <Pistola x={560} y={800} s={0.95} />
      <Tache x={340} op={aparece(t, T.termostato)} txt="termostato" />
      <Tache x={740} op={aparece(t, T.moviles)} txt="piezas móviles" />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.calentador], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          ¿y si la dejas horas enchufada?
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. El calentador es una pastilla de cerámica especial: PTC
export const Ceramica: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.calentador, T.frio], [1, 1.06])}>
      <Pistola x={560} y={860} s={1.15} corte={aparece(t, T.calentador)} />
      <g opacity={aparece(t, T.ceramica)}>
        <path d="M 460 1000 L 460 1120" stroke={PTC} strokeWidth={6} />
        <Texto x={460} y={1170} size={40} color={PTC}>
          pastilla de cerámica
        </Texto>
      </g>
      <Texto x={540} y={600} size={70} color={C.yellow} op={aparece(t, T.ptc)}>
        PTC
      </Texto>
    </Lienzo>
  );
};

// D. En frío deja pasar mucha corriente; al llegar a cierta temperatura su resistencia se dispara
export const Curvas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.frio, T.estructura, T.dispara + 0.4], [0.05, 0.6, 0.72], clamp);
  const flujo = interpolate(rDe(p), [0.1, 0.6], [1, 0.1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.frio, T.pasa], [1, 1.04])}>
        <Pastilla x={540} y={500} flujo={flujo} brillo={interpolate(t, [T.corriente, T.rapido + 0.5], [0.2, 1], clamp)} t={t} />
        <Curva p={p} op={aparece(t, T.frio)} />
        <Texto x={540} y={1380} size={40} color={C.yellow} op={aparece(t, T.corriente) * (1 - aparece(t, T.resistencia))}>
          mucha corriente: calienta rápido
        </Texto>
        <Texto x={540} y={1380} size={44} color={PTC} op={aparece(t, T.resistencia)}>
          {aparece(t, T.cientos) > 0.5 ? "resistencia × cientos" : "la resistencia se dispara"}
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.dispara} color={PTC} />
    </>
  );
};

// E. Pasa menos corriente y deja de calentar; si se enfría, baja y vuelve a calentar
export const Ciclo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const osc = t > T.si ? 0.66 + 0.04 * Math.sin((t - T.si) * 3) : interpolate(t, [T.pasa, T.calentar], [0.72, 0.7], clamp);
  const flujo = interpolate(rDe(osc), [0.1, 0.6], [1, 0.1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.pasa, T.aunque], [1, 1.04])}>
      <Pastilla x={540} y={500} flujo={flujo} brillo={0.7} t={t} />
      <Curva p={osc} op={1} />
      <Texto x={540} y={1380} size={40} color={C.grey} op={aparece(t, T.pasa) * (1 - aparece(t, T.si))}>
        menos corriente: deja de calentar
      </Texto>
      <Texto x={540} y={1380} size={40} color={C.cyan} op={aparece(t, T.si) * (1 - aparece(t, T.regula))}>
        se enfría: la resistencia baja
      </Texto>
      <Texto x={540} y={1380} size={44} color={C.yellow} op={aparece(t, T.regula)}>
        se regula sola
      </Texto>
    </Lienzo>
  );
};

// F. Aunque la dejes horas enchufada, se queda en su punto
export const Horas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const h = interpolate(t, [T.aunque, T.porEso], [0, 1], clamp);
  const curva = new Array(61)
    .fill(0)
    .map((_, i) => {
      const u = (i / 60) * h;
      const y = 1250 - 400 * Math.min(1, u * 6) + (u > 0.17 ? Math.sin(u * 60) * 8 : 0);
      return `${i ? "L" : "M"} ${160 + u * 760} ${y}`;
    })
    .join(" ");
  return (
    <Lienzo zoom={interpolate(t, [T.aunque, T.porEso], [1, 1.04])}>
      <Pistola x={560} y={560} s={0.7} brillo={0.8} />
      <line x1={160} y1={1250} x2={920} y2={1250} stroke={C.grey} strokeWidth={4} />
      <line x1={160} y1={1250} x2={160} y2={760} stroke={C.grey} strokeWidth={4} />
      <Texto x={170} y={740} size={30} color={C.grey} anchor="start">
        temperatura
      </Texto>
      <Texto x={920} y={1300} size={30} color={C.grey} anchor="end">
        {`${Math.round(h * 5)} horas`}
      </Texto>
      <path d={curva} stroke={C.orange} strokeWidth={8} fill="none" />
      <Texto x={540} y={1400} size={42} color={C.yellow} op={aparece(t, T.punto)}>
        siempre en su punto
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
      <Inicio q={q} />
    </Lienzo>
  );
};
