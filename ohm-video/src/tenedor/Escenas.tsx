import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/tenedor/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  cuchara: 2.50, // cuchara
  nada: 4.38, // nada
  aluminio: 5.94, // aluminio
  final: 8.26, // final
  empujan: 12.30, // empujan
  electrones: 13.00, // electrones
  superficie: 15.70, // superficie
  parejo: 18.56, // parejo
  punta: 19.78, // punta
  amontonan: 20.32, // amontonan
  enorme: 22.92, // enorme
  puntas: 24.12, // puntas
  picos: 25.42, // picos
  arranca: 27.00, // arranca
  conductor: 29.02, // conductor
  rayo: 30.56, // rayo
  paredes: 31.88, // paredes
  lisas: 33.62, // lisas
  danarlo: 36.46, // danarlo
  porEso: 37.24, // por
  fin: 39.22, // FIN
};

const METAL = "#C8CCD8";

// Chispa en zigzag desde (x,y) hacia arriba, cambia con t
const Chispa: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly k?: number; readonly op?: number; readonly l?: number }> = ({ x, y, t, k = 0, op = 1, l = 70 }) => {
  const f = Math.floor(t * 12 + k * 3);
  const pts = new Array(5)
    .fill(0)
    .map((_, i) => `${i ? "L" : "M"} ${x + (i ? Math.sin(f * 1.7 + i * 2.3 + k) * 18 : 0)} ${y - (i * l) / 4}`)
    .join(" ");
  const vis = (f + k) % 3 !== 0 ? 1 : 0;
  return <path d={pts} stroke="#E8F4FF" strokeWidth={5} fill="none" opacity={op * vis} style={{ filter: "drop-shadow(0 0 8px #8AD0FF)" }} />;
};

// Tenedor con las puntas hacia arriba, base en (x,y)
const Tenedor: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-14} y={0} width={28} height={260} rx={14} fill={METAL} />
    <path d="M -50 0 Q -50 40 0 50 Q 50 40 50 0 Z" fill={METAL} />
    {[-45, -15, 15, 45].map((dx) => (
      <rect key={dx} x={dx - 6} y={-130} width={12} height={135} rx={6} fill={METAL} />
    ))}
  </g>
);

const Micro: React.FC<{ readonly t: number; readonly children?: React.ReactNode }> = ({ t, children }) => (
  <g>
    <rect x={80} y={700} width={920} height={620} rx={40} fill="#2A2E3A" stroke="#4A5060" strokeWidth={8} />
    <rect x={130} y={750} width={640} height={520} rx={20} fill="#3A3420" opacity={0.6 + 0.1 * Math.sin(t * 6)} />
    <rect x={800} y={760} width={160} height={500} rx={16} fill="#1E2028" />
    {[0, 1, 2].map((k) => (
      <circle key={k} cx={880} cy={830 + k * 90} r={26} fill="#4A5060" />
    ))}
    <ellipse cx={450} cy={1210} rx={240} ry={30} fill="#5A5A66" />
    {children}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Micro t={t}>
      <g transform="rotate(-70 450 1150)">
        <Tenedor x={450} y={1150} s={0.9} />
      </g>
      {[0, 1, 2].map((k) => (
        <Chispa key={k} x={330 + k * 22} y={1120} t={t} k={k} l={60} />
      ))}
    </Micro>
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este tenedor saca chispas?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cuchara], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Una cuchara lisa: nada; un tenedor o aluminio arrugado: chispas + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ten = aparece(t, T.nada + 0.6);
  return (
    <Lienzo zoom={interpolate(t, [T.cuchara, T.empujan], [1, 1.04])}>
      <Micro t={t}>
        <g opacity={1 - ten}>
          <ellipse cx={360} cy={1170} rx={60} ry={28} fill={METAL} />
          <rect x={410} y={1162} width={190} height={16} rx={8} fill={METAL} />
        </g>
        <g opacity={ten}>
          <g transform="rotate(-70 450 1150)">
            <Tenedor x={450} y={1150} s={0.9} />
          </g>
          {[0, 1, 2].map((k) => (
            <Chispa key={k} x={330 + k * 22} y={1120} t={t} k={k} l={60} />
          ))}
        </g>
      </Micro>
      <Texto x={540} y={1430} size={40} color={C.white} op={aparece(t, T.cuchara) * (1 - ten)}>
        cuchara lisa: nada
      </Texto>
      <Texto x={540} y={1430} size={40} color={C.yellow} op={ten}>
        tenedor o aluminio: ¡chispas!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿y las paredes del horno?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.empujan], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Las microondas empujan los electrones; en una superficie lisa se reparten parejo
export const Electrones: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dx = 40 * Math.sin(t * 8);
  return (
    <Lienzo zoom={interpolate(t, [T.empujan, T.punta], [1, 1.04])}>
      {new Array(6).fill(0).map((_, k) => (
        <path key={k} d={`M ${-200 + ((t * 300 + k * 220) % 1500)} 720 q 30 -40 60 0 t 60 0`} stroke={C.yellow} strokeWidth={5} fill="none" opacity={0.6 * aparece(t, T.empujan)} />
      ))}
      <ellipse cx={540} cy={1000} rx={300} ry={170} fill={METAL} opacity={0.9} />
      {new Array(18).fill(0).map((_, k) => {
        const a = (k / 18) * Math.PI * 2;
        return <circle key={k} cx={540 + Math.cos(a) * 270 + dx * 0.4} cy={1000 + Math.sin(a) * 145} r={12} fill={C.cyan} opacity={aparece(t, T.electrones)} />;
      })}
      <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.electrones)}>
        las microondas mueven los electrones
      </Texto>
      <Texto x={540} y={1300} size={40} color={C.cyan} op={aparece(t, T.parejo)}>
        superficie lisa: se reparten parejo
      </Texto>
    </Lienzo>
  );
};

// D. En una punta se amontonan y el campo eléctrico se vuelve enorme
export const Punta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const am = aparece(t, T.amontonan);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.punta, T.puntas], [1, 1.04])}>
        <path d="M 340 1400 L 340 1000 L 540 700 L 740 1000 L 740 1400 Z" fill={METAL} />
        {new Array(20).fill(0).map((_, k) => {
          const u = k / 19;
          // reparto: concentrados en la punta cuando am=1
          const v = am ? Math.pow(u, 3) : u;
          const y = 720 + v * 650;
          const x = y < 1000 ? 540 + ((y - 700) / 300) * 190 * (k % 2 ? 1 : -1) : 540 + 190 * (k % 2 ? 1 : -1);
          return <circle key={k} cx={x} cy={y} r={11} fill={C.cyan} />;
        })}
        {new Array(9).fill(0).map((_, k) => {
          const a = -Math.PI / 2 + (k - 4) * 0.28;
          return <line key={k} x1={540} y1={700} x2={540 + Math.cos(a) * 200} y2={700 + Math.sin(a) * 200} stroke={C.yellow} strokeWidth={5} opacity={aparece(t, T.enorme)} />;
        })}
        <Texto x={540} y={1500} size={40} color={C.cyan} op={am}>
          en la punta se amontonan
        </Texto>
        <Texto x={540} y={560} size={40} color={C.yellow} op={aparece(t, T.enorme)}>
          campo eléctrico enorme
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.enorme} color={C.yellow} />
    </>
  );
};

// E. En las puntas del tenedor y los picos del aluminio, el campo arranca electrones del aire: rayo
export const Rayo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ray = aparece(t, T.rayo);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.puntas, T.paredes], [1, 1.04])}>
        <Tenedor x={300} y={1000} s={1.3} />
        {[-45, -15, 15, 45].map((dx, k) => (
          <Chispa key={dx} x={300 + dx * 1.3} y={820} t={t} k={k} op={aparece(t, T.arranca)} l={90} />
        ))}
        <g opacity={aparece(t, T.picos)}>
          <path d="M 620 1150 L 680 980 L 720 1080 L 780 900 L 830 1060 L 890 950 L 960 1150 Z" fill={METAL} stroke="#9AA0B0" strokeWidth={4} />
          {[680, 780, 890].map((x, k) => (
            <Chispa key={x} x={x} y={[980, 900, 950][k]} t={t} k={k + 4} op={aparece(t, T.arranca)} l={80} />
          ))}
        </g>
        <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.arranca)}>
          el aire se vuelve conductor
        </Texto>
        <Texto x={540} y={1500} size={46} color={C.yellow} op={ray}>
          ¡un rayo diminuto!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.rayo} color="#E8F4FF" />
    </>
  );
};

// F. Las paredes del horno son de metal, pero lisas; aun así, no metas metal
export const Paredes: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.paredes, T.porEso], [1, 1.04])}>
      <Micro t={t} />
      <rect x={130} y={750} width={640} height={520} rx={20} fill="none" stroke={C.cyan} strokeWidth={8} opacity={aparece(t, T.lisas)} />
      <Texto x={540} y={640} size={40} color={C.cyan} op={aparece(t, T.paredes)}>
        paredes de metal, pero lisas
      </Texto>
      <Texto x={540} y={1440} size={40} color={C.yellow} op={aparece(t, T.danarlo)}>
        ¡ojo! no metas metal: puede dañarlo
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
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
