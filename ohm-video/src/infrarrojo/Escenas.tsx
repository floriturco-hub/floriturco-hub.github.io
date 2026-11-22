import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/infrarrojo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  apuntas: 2.14, // apuntas
  pizza: 2.84, // pizza
  tocarla: 4.54, // tocarla
  final: 5.56, // final
  laser: 8.84, // laser
  nada: 9.76, // nada
  marca: 10.72, // marca
  todo: 12.44, // todo
  infrarroja: 13.72, // infrarroja
  cuanto: 15.82, // cuanto
  brilla: 17.24, // brilla
  lente: 18.14, // lente
  termopila: 20.50, // termo
  calienta: 21.44, // calienta
  voltaje: 23.12, // voltaje
  chip: 24.04, // chip
  temperatura: 25.86, // temperatura
  pero: 26.36, // pero
  poco: 28.16, // poco
  mucho: 29.14, // mucho
  engana: 30.12, // engana
  menos: 31.66, // menos
  asi: 32.38, // asi
  fin: 34.64, // FIN
};

const IR = "#E8414F";
const QUESO = "#F8C848";

// Termómetro infrarrojo apuntando a la derecha; lectura en pantalla
const Pistola: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly lectura: string; readonly laser: number; readonly largo?: number }> = ({
  x,
  y,
  s,
  lectura,
  laser,
  largo = 520,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={170} y1={-20} x2={170 + largo} y2={-20} stroke={IR} strokeWidth={6} opacity={laser} />
    <circle cx={170 + largo} cy={-20} r={14} fill={IR} opacity={laser} />
    <path d="M -40 70 L 40 70 L 20 260 L -60 260 Z" fill="#2A2640" />
    <rect x={-150} y={-80} width={300} height={150} rx={30} fill="#3A3650" />
    <path d="M 150 -70 L 190 -50 L 190 50 L 150 60 Z" fill="#5A5478" />
    <circle cx={180} cy={0} r={18} fill="#141030" />
    <rect x={-130} y={-60} width={170} height={90} rx={10} fill="#0E2A1A" />
    <Texto x={-45} y={0} size={46} color="#6AF89A">
      {lectura}
    </Texto>
  </g>
);

const Pizza: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -150 L 130 120 Q 0 160 -130 120 Z" fill="#D89A4A" />
    <path d="M 0 -110 L 105 105 Q 0 135 -105 105 Z" fill={QUESO} />
    {[
      [0, -20],
      [-40, 60],
      [45, 70],
    ].map(([px, py], k) => (
      <circle key={k} cx={px} cy={py} r={18} fill={C.red} />
    ))}
  </g>
);

// Ondas infrarrojas que salen de (x,y) hacia la izquierda; n = cantidad
const Ondas: React.FC<{ readonly x: number; readonly y: number; readonly n: number; readonly op: number; readonly t: number; readonly dir?: number }> = ({
  x,
  y,
  n,
  op,
  t,
  dir = -1,
}) => (
  <g opacity={op}>
    {new Array(n).fill(0).map((_, k) => {
      const u = (t * 0.6 + k / n) % 1;
      const dy = (k - (n - 1) / 2) * 34;
      const x0 = x + dir * u * 260;
      const pts = new Array(9)
        .fill(0)
        .map((__, i) => `${i ? "L" : "M"} ${x0 + dir * i * 12} ${y + dy + Math.sin(i * 1.6) * 10}`)
        .join(" ");
      return <path key={k} d={pts} stroke={IR} strokeWidth={5} fill="none" strokeDasharray="10 6" opacity={1 - u} />;
    })}
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Pistola x={260} y={900} s={0.95} lectura="??" laser={1} largo={500} />
    <Pizza x={860} y={880} s={0.8} />
    <Texto x={540} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿qué mide realmente este láser rojo?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.apuntas], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={IR} />
    </>
  );
};

// B. Apuntas a una pizza y te da su temperatura sin tocarla + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const v = Math.round(interpolate(t, [T.pizza, T.tocarla], [20, 74], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.apuntas, T.laser], [1, 1.05])}>
      <Pistola x={260} y={900} s={0.95} lectura={`${v}°`} laser={aparece(t, T.apuntas)} largo={500} />
      <Pizza x={860} y={880} s={0.8} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.laser], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          por qué falla con metal: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. El láser no mide nada: solo marca hacia dónde apuntas
export const Laser: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.laser, T.todo], [1, 1.04])}>
        <Pistola x={260} y={900} s={0.95} lectura="74°" laser={0.5 + 0.5 * Math.sin(t * 8)} largo={500} />
        <Pizza x={860} y={880} s={0.8} />
        <g opacity={aparece(t, T.nada)}>
          <rect x={300} y={560} width={480} height={110} rx={20} fill={C.card} stroke={IR} strokeWidth={4} />
          <Texto x={540} y={635} size={48} color={IR}>
            láser ≠ medidor
          </Texto>
        </g>
        <Texto x={540} y={1200} size={40} color={C.white} op={aparece(t, T.marca)}>
          solo marca hacia dónde apuntas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.nada} color={IR} />
    </>
  );
};

// D. Todo objeto brilla con luz infrarroja invisible; cuanto más caliente, más brilla
export const Brillo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tres = aparece(t, T.cuanto);
  return (
    <Lienzo zoom={interpolate(t, [T.todo, T.lente], [1, 1.04])}>
      <g opacity={1 - tres}>
        <Pizza x={540} y={880} s={1} />
        <Ondas x={420} y={860} n={5} op={aparece(t, T.infrarroja)} t={t} />
        <Ondas x={660} y={860} n={5} op={aparece(t, T.infrarroja)} t={t} dir={1} />
        <Texto x={540} y={1200} size={38} color={IR} op={aparece(t, T.infrarroja)}>
          luz infrarroja: invisible
        </Texto>
      </g>
      <g opacity={tres}>
        {[
          [220, "hielo", 1, C.cyan],
          [540, "mano", 3, "#E8B48A"],
          [860, "pizza", 7, QUESO],
        ].map(([x, n, k, col]) => (
          <g key={n as string}>
            <rect x={(x as number) - 70} y={1000} width={140} height={100} rx={20} fill={col as string} />
            <Texto x={x as number} y={1170} size={34} color={col as string}>
              {n as string}
            </Texto>
            {new Array(k as number).fill(0).map((_, i) => {
              const u = (t * 0.8 + i / (k as number)) % 1;
              return (
                <path
                  key={i}
                  d={`M ${(x as number) - 60 + i * (120 / Math.max(1, (k as number) - 1 || 1))} ${990 - u * 360} q 12 -15 0 -30 q -12 -15 0 -30`}
                  stroke={IR}
                  strokeWidth={5}
                  fill="none"
                  opacity={(1 - u) * aparece(t, T.brilla)}
                />
              );
            })}
          </g>
        ))}
        <Texto x={540} y={1280} size={40} color={C.white} op={aparece(t, T.brilla)}>
          más caliente = más brilla
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Una lente reúne la luz sobre una termopila que se calienta y produce voltaje
export const Lente: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const calor = aparece(t, T.calienta);
  return (
    <Lienzo zoom={interpolate(t, [T.lente, T.chip], [1, 1.04])}>
      {[-1, 0, 1].map((k) => (
        <path key={k} d={`M 1000 ${860 + k * 110} L 600 ${860 + k * 110} L 330 860`} stroke={IR} strokeWidth={6} fill="none" strokeDasharray="14 8" opacity={aparece(t, T.lente)} />
      ))}
      <ellipse cx={600} cy={860} rx={30} ry={170} fill="#8AC8F8" opacity={0.6 * aparece(t, T.lente)} stroke={C.white} strokeWidth={4} />
      <Texto x={600} y={640} size={36} color={C.white} op={aparece(t, T.lente)}>
        lente
      </Texto>
      <g opacity={aparece(t, T.termopila)}>
        <circle cx={300} cy={860} r={70} fill={C.orange} opacity={0.5 * calor} />
        <rect x={270} y={830} width={60} height={60} fill="#141030" stroke={C.grey} strokeWidth={4} />
        <Texto x={300} y={1000} size={36} color={C.grey}>
          termopila
        </Texto>
      </g>
      <g opacity={aparece(t, T.voltaje)}>
        <rect x={340} y={1120} width={400} height={120} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
        <Texto x={540} y={1200} size={56} color={C.yellow}>
          {`${(interpolate(t, [T.voltaje, T.voltaje + 1], [0, 2.4], clamp)).toFixed(1)} mV`}
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Un chip convierte el voltaje en temperatura
export const Chip: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.chip, T.pero], [1, 1.04])}>
      <rect x={110} y={800} width={260} height={120} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
      <Texto x={240} y={880} size={48} color={C.yellow}>
        2.4 mV
      </Texto>
      <path d="M 390 860 L 440 860" stroke={C.white} strokeWidth={8} />
      <g opacity={aparece(t, T.chip)}>
        <rect x={450} y={780} width={180} height={160} rx={16} fill="#3A3650" stroke={C.grey} strokeWidth={4} />
        <Texto x={540} y={875} size={40} color={C.white}>
          chip
        </Texto>
      </g>
      <path d="M 640 860 L 690 860" stroke={C.white} strokeWidth={8} opacity={aparece(t, T.temperatura)} />
      <g opacity={aparece(t, T.temperatura)}>
        <rect x={700} y={790} width={270} height={140} rx={16} fill="#0E2A1A" />
        <Texto x={835} y={885} size={64} color="#6AF89A">
          74°C
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. El metal brillante emite poco y refleja mucho: engaña al termómetro
export const Metal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const v = Math.round(interpolate(t, [T.engana, T.menos + 0.3], [74, 31], clamp));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.asi], [1, 1.04])}>
        <Pistola x={220} y={700} s={0.8} lectura={`${v}°`} laser={1} largo={470} />
        <g>
          <rect x={660} y={600} width={340} height={200} rx={20} fill="#D8D8E8" />
          <rect x={690} y={630} width={120} height={30} rx={10} fill={C.white} opacity={0.8} />
          <Texto x={830} y={860} size={34} color={C.white}>
            metal a 74 °C
          </Texto>
        </g>
        <Ondas x={650} y={700} n={2} op={aparece(t, T.poco)} t={t} />
        <g opacity={aparece(t, T.mucho)}>
          {[0, 1, 2].map((k) => {
            const u = (t * 0.7 + k / 3) % 1;
            return (
              <g key={k}>
                <path d={`M ${560 + k * 140} ${1150} L ${700 + k * 100} 820`} stroke={C.cyan} strokeWidth={5} strokeDasharray="12 8" opacity={1 - u * 0.5} />
              </g>
            );
          })}
          <Texto x={540} y={1220} size={36} color={C.cyan}>
            refleja el cuarto, más frío
          </Texto>
        </g>
        <Texto x={540} y={1320} size={42} color={C.red} op={aparece(t, T.engana)}>
          lo engaña: marca menos
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.engana} color={C.red} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
