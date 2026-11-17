import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/piedrarebota/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  lanzas: 2.02, // lanzas
  plana: 2.92, // plana
  rebota: 3.94, // rebota
  final: 6.60, // final
  dura: 9.38, // dura
  masa: 10.36, // masa
  apartarla: 12.72, // apartarla
  velocidad: 13.98, // velocidad
  llega: 15.96, // llega
  punta: 17.30, // punta
  empuja: 18.88, // empuja
  rampa: 23.88, // rampa
  supera: 25.98, // supera
  giro: 28.32, // giro
  trompo: 31.10, // trompo
  rebote: 32.16, // rebote
  hunde: 34.22, // hunde
  record: 35.04, // record
  porEso: 37.28, // por
  fin: 39.04, // FIN
};

const AGUA = "#1A4A7A";
const PIEDRA = "#8A8A96";

// Trayectoria de rebotes sobre el agua en y0; u = progreso 0..1; n rebotes
const Rebotes: React.FC<{ readonly u: number; readonly y0: number; readonly n?: number; readonly t: number }> = ({ u, y0, n = 6, t }) => {
  const saltos = new Array(n).fill(0).map((_, k) => ({ x0: 80 + k * (920 / n) * (1 - k * 0.06), w: (920 / n) * (1 - k * 0.12), h: 220 * Math.pow(0.7, k) }));
  const total = saltos.length;
  const kk = Math.min(total - 1, Math.floor(u * total));
  const f = u * total - kk;
  const s = saltos[kk];
  const px = s.x0 + s.w * f;
  const py = y0 - 4 * s.h * f * (1 - f);
  return (
    <g>
      {saltos.slice(0, kk + 1).map((sk, k) => (
        <g key={k}>
          <ellipse cx={sk.x0} cy={y0} rx={20 + ((t * 40 + k * 10) % 50)} ry={6 + ((t * 12 + k * 3) % 14)} fill="none" stroke="#C8E8FF" strokeWidth={3} opacity={0.6} />
        </g>
      ))}
      <ellipse cx={px} cy={py - 10} rx={34} ry={12} fill={PIEDRA} transform={`rotate(-12 ${px} ${py - 10})`} />
    </g>
  );
};

const Lago: React.FC<{ readonly y: number }> = ({ y }) => (
  <g>
    <rect x={0} y={y} width={1080} height={1920 - y} fill={AGUA} />
    {[0, 1, 2, 3].map((k) => (
      <line key={k} x1={100 + k * 260} y1={y + 40 + k * 30} x2={180 + k * 260} y2={y + 40 + k * 30} stroke="#3A6A9A" strokeWidth={4} />
    ))}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Lago y={1100} />
    <Rebotes u={(t * 0.35) % 1} y0={1100} t={t} />
    <Texto x={540} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta piedra no se hunde?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.lanzas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Lanzas una piedra plana y rebota una y otra vez + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.plana, T.dura], [0, 0.999], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.lanzas, T.dura], [1, 1.04])}>
      <Lago y={1100} />
      <Rebotes u={u} y0={1100} t={t} />
      <Texto x={540} y={1300} size={44} color="#C8E8FF" op={aparece(t, T.rebota)}>
        ¡rebota y rebota!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          el récord mundial: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.dura], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. El agua no es dura pero tiene masa: a alta velocidad no hay tiempo para apartarla
export const Masa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const xp = interpolate(t, [T.masa, T.llega], [100, 900], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.dura, T.llega], [1, 1.04])}>
      <rect x={0} y={1000} width={1080} height={500} fill={AGUA} />
      {new Array(40).fill(0).map((_, k) => {
        const x = 60 + (k % 10) * 100;
        const y = 1040 + Math.floor(k / 10) * 90;
        const d = Math.max(0, 1 - Math.abs(x - xp) / 120) * aparece(t, T.apartarla);
        return <circle key={k} cx={x} cy={y + d * 8} r={20} fill="#3A7AC8" />;
      })}
      <ellipse cx={xp} cy={980} rx={70} ry={22} fill={PIEDRA} />
      <path d={`M ${xp - 200} 980 l 100 0`} stroke="#fff" strokeWidth={6} opacity={0.6} />
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.dura)}>
        el agua no es dura…
      </Texto>
      <Texto x={540} y={660} size={40} color={C.cyan} op={aparece(t, T.masa)}>
        …pero tiene masa
      </Texto>
      <Texto x={540} y={1440} size={38} color={C.yellow} op={aparece(t, T.velocidad)}>
        tan rápido, no le da tiempo a apartarse
      </Texto>
    </Lienzo>
  );
};

// D. Llega casi plana con la punta levantada: empuja el agua y el agua la empuja hacia arriba como una rampa
export const Rampa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sube = aparece(t, T.supera);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llega, T.giro], [1, 1.04])}>
        <path d={`M 0 1000 L 380 1000 Q 540 ${1040 - 30 * aparece(t, T.empuja)} 700 1000 L 1080 1000 L 1080 1500 L 0 1500 Z`} fill={AGUA} />
        <g transform={`translate(540 ${990 - sube * 120}) rotate(-18)`}>
          <ellipse cx={0} cy={0} rx={160} ry={34} fill={PIEDRA} />
        </g>
        <path d="M 420 960 A 140 140 0 0 1 440 900" stroke={C.yellow} strokeWidth={5} fill="none" opacity={aparece(t, T.punta)} />
        <Texto x={330} y={900} size={30} color={C.yellow} op={aparece(t, T.punta)}>
          punta levantada
        </Texto>
        <g opacity={aparece(t, T.empuja)}>
          <path d="M 560 1080 l 90 70" stroke={C.cyan} strokeWidth={10} />
          <Texto x={760} y={1210} size={30} color={C.cyan}>
            empuja el agua
          </Texto>
        </g>
        <g opacity={aparece(t, T.rampa)}>
          <path d={`M 540 ${950 - sube * 120} l 0 -${150 + 60 * sube}`} stroke={C.yellow} strokeWidth={14} />
          <path d={`M 515 ${810 - sube * 180} l 25 -40 l 25 40 Z`} fill={C.yellow} />
          <Texto x={700} y={760} size={34} color={C.yellow}>
            el agua la empuja ↑
          </Texto>
        </g>
        <g opacity={aparece(t, T.supera)}>
          <path d={`M 470 ${1030 - sube * 120} l 0 80`} stroke={C.red} strokeWidth={10} />
          <Texto x={330} y={1180} size={30} color={C.red}>
            peso
          </Texto>
          <Texto x={540} y={1400} size={40} color={C.white}>
            empuje &gt; peso: ¡sale volando!
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.supera} color={C.yellow} />
    </>
  );
};

// E. El giro de la muñeca la mantiene estable, como un trompo
export const Giro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.giro, T.rebote], [1, 1.04])}>
      <ellipse cx={540} cy={950} rx={280} ry={110} fill={PIEDRA} />
      <g transform="translate(540 950)">
        <path d={`M ${Math.cos(t * 8) * 200} ${Math.sin(t * 8) * 70} A 200 70 0 0 1 ${Math.cos(t * 8 + 1.5) * 200} ${Math.sin(t * 8 + 1.5) * 70}`} stroke={C.yellow} strokeWidth={10} fill="none" />
      </g>
      <Texto x={540} y={1200} size={42} color={C.yellow} op={aparece(t, T.giro)}>
        el giro la estabiliza
      </Texto>
      <Texto x={540} y={1280} size={36} color={C.white} op={aparece(t, T.trompo)}>
        como un trompo
      </Texto>
    </Lienzo>
  );
};

// F. En cada rebote pierde velocidad hasta que se hunde; récord: 88 rebotes
export const Record: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.rebote, T.porEso], [1, 1.04])}>
        <Lago y={1000} />
        <Rebotes u={interpolate(t, [T.rebote, T.hunde + 0.4], [0, 0.999], clamp)} y0={1000} n={8} t={t} />
        <Texto x={540} y={1200} size={36} color={C.white} op={aparece(t, T.rebote) * (1 - aparece(t, T.record))}>
          cada rebote, más lenta
        </Texto>
        <g opacity={aparece(t, T.record)}>
          <Texto x={540} y={640} size={36} color={C.white}>
            récord mundial
          </Texto>
          <Texto x={540} y={780} size={130} color={C.yellow}>
            88
          </Texto>
          <Texto x={540} y={860} size={36} color={C.yellow}>
            rebotes
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.record} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
