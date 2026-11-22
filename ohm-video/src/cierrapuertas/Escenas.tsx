import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/cierrapuertas/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  sueltas: 2.06, // sueltas
  azotar: 4.74, // azotar
  despacio: 5.72, // despacio
  final: 7.76, // final
  arriba: 10.54, // arriba
  cierrapuertas: 11.32, // cierrapuertas
  resorte: 13.14, // resorte
  piston: 13.94, // piston
  aceite: 14.74, // aceite
  abrir: 15.68, // abrir
  comprimes: 16.60, // comprimes
  soltarla: 18.00, // soltarla
  golpe: 20.14, // golpe
  pero: 20.68, // pero
  agujeros: 24.10, // agujeros
  pasa: 25.90, // pasa
  frena: 27.24, // frena
  tornillo: 28.60, // tornillo
  velocidad: 31.78, // velocidad
  final2: 32.80, // final
  valvula: 33.54, // valvula
  acelere: 34.74, // acelere
  cerradura: 36.16, // cerradura
  porEso: 37.50, // por
  fin: 39.38, // FIN
};

const ACEITE = "#E8A83A";

// Puerta vista desde arriba: bisagra en (hx, hy), ángulo de apertura en grados
const Puerta: React.FC<{ readonly ang: number; readonly fantasma?: number }> = ({ ang, fantasma }) => {
  const hx = 260;
  const hy = 900;
  const a = (-ang * Math.PI) / 180;
  const ex = hx + Math.cos(a) * 560;
  const ey = hy + Math.sin(a) * 560;
  const bx = hx + Math.cos(a) * 200;
  const by = hy + Math.sin(a) * 200;
  return (
    <g>
      <rect x={60} y={890} width={200} height={40} fill="#5A5478" />
      <rect x={820} y={890} width={200} height={40} fill="#5A5478" />
      {fantasma !== undefined ? (
        <line x1={hx} y1={hy} x2={hx + Math.cos((-fantasma * Math.PI) / 180) * 560} y2={hy + Math.sin((-fantasma * Math.PI) / 180) * 560} stroke={C.red} strokeWidth={10} strokeDasharray="20 12" opacity={0.5} />
      ) : null}
      <line x1={hx} y1={hy} x2={ex} y2={ey} stroke="#B8864A" strokeWidth={34} strokeLinecap="round" />
      <rect x={300} y={950} width={140} height={50} rx={10} fill="#3A3650" />
      <line x1={420} y1={975} x2={(420 + bx) / 2 + 40} y2={(975 + by) / 2 + 20} stroke={C.grey} strokeWidth={12} />
      <line x1={(420 + bx) / 2 + 40} y1={(975 + by) / 2 + 20} x2={bx} y2={by} stroke={C.grey} strokeWidth={12} />
      <circle cx={hx} cy={hy} r={16} fill={C.white} />
    </g>
  );
};

// Corte del cierrapuertas: comp = compresión del resorte (0-1), flujo de aceite 0-1, valvula abierta 0-1
const Caja: React.FC<{ readonly comp: number; readonly flujo: number; readonly t: number; readonly agujero?: number; readonly valvula?: number }> = ({
  comp,
  flujo,
  t,
  agujero = 1,
  valvula = 0,
}) => {
  const px = 360 + comp * 260;
  const n = 10;
  const resorte = new Array(n * 2 + 1)
    .fill(0)
    .map((_, i) => `${i ? "L" : "M"} ${px + 40 + ((900 - px - 40) * i) / (n * 2)} ${i === 0 || i === n * 2 ? 860 : i % 2 ? 810 : 910}`)
    .join(" ");
  return (
    <g>
      <rect x={140} y={740} width={800} height={240} rx={30} fill="#3A3650" stroke="#5A5478" strokeWidth={8} />
      <rect x={160} y={760} width={px - 160} height={200} fill={ACEITE} opacity={0.75} />
      <rect x={px} y={770} width={40} height={180} rx={8} fill="#B8B8C8" />
      <path d={resorte} stroke={C.cyan} strokeWidth={10} fill="none" strokeLinejoin="round" />
      <rect x={160} y={1000} width={760} height={20 * agujero + 6} fill="#141030" />
      <path d={`M 170 960 L 170 1010 L 900 1010`} stroke={ACEITE} strokeWidth={6 + 8 * agujero} fill="none" strokeDasharray="16 16" strokeDashoffset={-t * 40 * flujo} opacity={flujo} />
      <rect x={500} y={995} width={30} height={40} fill={C.yellow} opacity={valvula} />
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Puerta ang={35} />
    <Texto x={880} y={760} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta puerta se cierra suave?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.sueltas], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Sueltas un portón pesado y, en vez de azotar, se cierra despacio + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ang = interpolate(t, [T.sueltas, T.final], [85, 5], clamp);
  const fantasma = interpolate(t, [T.sueltas, T.sueltas + 0.4], [85, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.sueltas, T.arriba], [1, 1.04])}>
      <Puerta ang={ang} fantasma={aparece(t, T.azotar) > 0.5 && t < T.despacio ? fantasma : undefined} />
      <Texto x={540} y={1120} size={40} color={C.red} op={aparece(t, T.azotar) * (1 - aparece(t, T.despacio))}>
        ¿azotar?
      </Texto>
      <Texto x={540} y={1120} size={40} color={C.cyan} op={aparece(t, T.despacio)}>
        despacio y en silencio
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.arriba], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          el empujón final: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Un cierrapuertas: una caja con resorte y pistón en aceite; al abrir comprimes el resorte
export const Interior: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const comp = interpolate(t, [T.comprimes, T.comprimes + 0.8], [0, 1], clamp) * (1 - interpolate(t, [T.soltarla, T.pero], [0, 0.25], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.arriba, T.pero], [1, 1.04])}>
      <Caja comp={comp} flujo={0} t={t} />
      <Texto x={250} y={700} size={34} color={C.cyan} op={aparece(t, T.resorte)}>
        resorte
      </Texto>
      <Texto x={540} y={700} size={34} color="#B8B8C8" op={aparece(t, T.piston)}>
        pistón
      </Texto>
      <Texto x={820} y={700} size={34} color={ACEITE} op={aparece(t, T.aceite)}>
        aceite
      </Texto>
      <Texto x={540} y={1160} size={40} color={C.white} op={aparece(t, T.comprimes) * (1 - aparece(t, T.soltarla))}>
        al abrir: comprimes el resorte
      </Texto>
      <Texto x={540} y={1160} size={40} color={C.red} op={aparece(t, T.soltarla)}>
        al soltar: quiere cerrar de golpe
      </Texto>
    </Lienzo>
  );
};

// D. El pistón empuja el aceite por agujeros diminutos: pasa despacio y frena
export const Aceite: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const comp = interpolate(t, [T.pero, T.tornillo], [0.75, 0.35], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.tornillo], [1, 1.04])}>
        <Caja comp={comp} flujo={aparece(t, T.agujeros)} t={t} agujero={0.4} />
        <Texto x={540} y={1160} size={40} color={ACEITE} op={aparece(t, T.agujeros) * (1 - aparece(t, T.frena))}>
          por agujeros diminutos
        </Texto>
        <Texto x={540} y={1160} size={44} color={C.yellow} op={aparece(t, T.frena)}>
          frena el movimiento
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.frena} color={ACEITE} />
    </>
  );
};

// E. Un tornillo regula cuánto aceite pasa: la velocidad
export const Tornillo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ag = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin((t - T.tornillo) * 2));
  return (
    <Lienzo zoom={interpolate(t, [T.tornillo, T.final2], [1, 1.04])}>
      <Caja comp={0.3} flujo={1} t={t} agujero={ag} />
      <g transform={`translate(700 1080) rotate(${(t - T.tornillo) * 120})`} opacity={aparece(t, T.tornillo)}>
        <circle cx={0} cy={0} r={34} fill={C.grey} />
        <line x1={-24} y1={0} x2={24} y2={0} stroke="#141030" strokeWidth={8} />
      </g>
      <Texto x={540} y={1200} size={40} color={C.white} op={aparece(t, T.tornillo)}>
        el tornillo regula el paso
      </Texto>
      <Texto x={540} y={1270} size={36} color={C.cyan} op={aparece(t, T.velocidad)}>
        = la velocidad
      </Texto>
    </Lienzo>
  );
};

// F. Al final otra válvula deja que la puerta acelere para que la cerradura encaje
export const Empujon: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ang = t < T.acelere ? interpolate(t, [T.final2, T.acelere], [25, 12], clamp) : interpolate(t, [T.acelere, T.acelere + 0.4], [12, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.final2, T.porEso], [1, 1.04])}>
        <Puerta ang={ang} />
        <g opacity={aparece(t, T.valvula)}>
          <rect x={300} y={560} width={480} height={100} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
          <Texto x={540} y={625} size={38} color={C.yellow}>
            2.ª válvula: acelera
          </Texto>
        </g>
        <Texto x={540} y={1150} size={44} color={C.cyan} op={aparece(t, T.cerradura)}>
          ¡clac! la cerradura encaja
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.acelere + 0.4} color={C.cyan} />
    </>
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
