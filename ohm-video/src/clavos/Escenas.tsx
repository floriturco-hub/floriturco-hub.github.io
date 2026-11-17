import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/clavos/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  acuesta: 2.24, // acuesta
  clavos: 3.50, // clavos
  brasas: 4.70, // brasas
  final: 7.22, // final
  solo: 10.80, // solo
  perfora: 13.26, // perfora
  mil: 14.38, // mil
  gramos: 16.56, // gramos
  aguanta: 17.96, // aguanta
  carbon: 20.30, // carbon
  ceniza: 20.80, // ceniza
  conducen: 21.16, // conducen
  cientos: 23.62, // cientos
  despacio: 25.80, // despacio
  rapidos: 27.10, // rapidos
  fraccion: 28.76, // fraccion
  detienes: 31.88, // detienes
  metal: 32.98, // metal
  quemas: 35.96, // quemas
  porEso: 36.68, // por
  fin: 38.20, // FIN
};

const PIEL = "#E0A888";
const BRASA = "#F0602A";

const Pie: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -40 -260 L 40 -260 L 50 -40 Q 140 -30 160 10 Q 170 40 120 40 L -60 40 Q -90 40 -90 0 Q -80 -40 -50 -50 Z" fill={PIEL} />
  </g>
);

const Brasas: React.FC<{ readonly y: number; readonly t: number; readonly x0?: number; readonly w?: number }> = ({ y, t, x0 = 80, w = 920 }) => (
  <g>
    {new Array(Math.round(w / 46)).fill(0).map((_, k) => (
      <ellipse key={k} cx={x0 + 20 + k * 46} cy={y + (k % 3) * 10} rx={30} ry={18} fill={k % 2 ? BRASA : "#C8401A"} opacity={0.75 + 0.25 * Math.sin(t * 5 + k)} />
    ))}
    {new Array(Math.round(w / 46)).fill(0).map((_, k) => (
      <ellipse key={`c${k}`} cx={x0 + 40 + k * 46} cy={y - 10} rx={14} ry={6} fill="#8A8A96" opacity={0.5} />
    ))}
  </g>
);

const Clavos: React.FC<{ readonly y: number; readonly n: number; readonly x0?: number; readonly w?: number }> = ({ y, n, x0 = 120, w = 840 }) => (
  <g>
    <rect x={x0} y={y} width={w} height={30} fill="#6A4A2A" />
    {new Array(n).fill(0).map((_, k) => {
      const x = x0 + 10 + (k * (w - 20)) / Math.max(1, n - 1);
      return <path key={k} d={`M ${x - 4} ${y} L ${x} ${y - 70} L ${x + 4} ${y} Z`} fill="#C8C8D4" />;
    })}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Brasas y={1250} t={t} />
    <Pie x={540} y={1180 - 40 * Math.abs(Math.sin(t * 3))} s={1.2} />
    <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué estos pies no sufren?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.acuesta], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={BRASA} />
    </>
  );
};

// B. Gente sobre cientos de clavos o caminando sobre brasas sin herirse + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const br = aparece(t, T.brasas);
  return (
    <Lienzo zoom={interpolate(t, [T.acuesta, T.solo], [1, 1.04])}>
      <g opacity={1 - br}>
        <Clavos y={1100} n={40} />
        <rect x={180} y={950} width={680} height={80} rx={40} fill="#4A6AC8" />
        <circle cx={140} cy={990} r={60} fill={PIEL} />
        <Texto x={540} y={1250} size={38} color={C.white}>
          cientos de clavos
        </Texto>
      </g>
      <g opacity={br}>
        <Brasas y={1150} t={t} />
        <Pie x={300 + ((t * 150) % 500)} y={1080 - 40 * Math.abs(Math.sin(t * 5))} s={0.9} />
        <Texto x={540} y={1300} size={38} color={BRASA}>
          brasas al rojo vivo
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuándo sí quema?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.solo], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Sobre un clavo, todo el peso en una punta; sobre mil, cada uno carga unos 70 g
export const UnClavo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mil = aparece(t, T.mil);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.solo, T.carbon], [1, 1.04])}>
        <g opacity={1 - mil}>
          <Clavos y={1150} n={1} x0={480} w={120} />
          <path d="M 540 700 L 540 1000" stroke={C.red} strokeWidth={40} />
          <path d="M 490 990 L 540 1060 L 590 990 Z" fill={C.red} />
          <Texto x={540} y={660} size={40} color={C.red}>
            todo tu peso
          </Texto>
          <Texto x={540} y={1300} size={44} color={C.red} op={aparece(t, T.perfora)}>
            ¡perfora!
          </Texto>
        </g>
        <g opacity={mil}>
          <Clavos y={1150} n={30} />
          {new Array(15).fill(0).map((_, k) => (
            <g key={k}>
              <path d={`M ${150 + k * 56} 960 L ${150 + k * 56} 1040`} stroke={C.cyan} strokeWidth={6} />
              <path d={`M ${140 + k * 56} 1035 L ${150 + k * 56} 1055 L ${160 + k * 56} 1035 Z`} fill={C.cyan} />
            </g>
          ))}
          <Texto x={540} y={900} size={40} color={C.cyan}>
            el peso se reparte
          </Texto>
          <Texto x={540} y={1300} size={44} color={C.yellow} op={aparece(t, T.gramos)}>
            ~70 g por clavo
          </Texto>
          <Texto x={540} y={1380} size={38} color="#5AD08A" op={aparece(t, T.aguanta)}>
            la piel lo aguanta ✓
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.mil} color={C.cyan} />
    </>
  );
};

// D. Carbón y ceniza conducen muy mal el calor: aunque estén a cientos de grados, lo pasan muy despacio
export const Conduccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.carbon, T.rapidos], [1, 1.04])}>
      <Brasas y={1200} t={t} />
      <Pie x={540} y={1130} s={1.1} />
      <g opacity={aparece(t, T.conducen)}>
        {[0, 1, 2].map((k) => {
          const u = (t * 0.25 + k / 3) % 1;
          return <circle key={k} cx={460 + k * 80} cy={1180 - u * 80} r={9} fill={BRASA} opacity={1 - u} />;
        })}
      </g>
      <Texto x={540} y={600} size={40} color="#8A8A96" op={aparece(t, T.ceniza)}>
        carbón y ceniza
      </Texto>
      <Texto x={540} y={660} size={36} color={C.white} op={aparece(t, T.conducen)}>
        conducen muy mal el calor
      </Texto>
      <Texto x={540} y={1400} size={40} color={BRASA} op={aparece(t, T.cientos)}>
        cientos de grados…
      </Texto>
      <Texto x={540} y={1470} size={40} color={C.cyan} op={aparece(t, T.despacio)}>
        …pero el calor pasa despacio
      </Texto>
    </Lienzo>
  );
};

// E. Con pasos rápidos cada contacto dura una fracción de segundo; si te detienes o pisas metal, te quemas
export const Pasos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const met = aparece(t, T.metal);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.rapidos, T.porEso], [1, 1.04])}>
        <g opacity={1 - met}>
          <line x1={140} y1={1000} x2={940} y2={1000} stroke={C.grey} strokeWidth={3} />
          {new Array(6).fill(0).map((_, k) => (
            <rect key={k} x={160 + k * 130} y={900} width={30} height={100} fill={BRASA} opacity={aparece(t, T.rapidos + k * 0.15)} />
          ))}
          <Texto x={540} y={860} size={34} color={BRASA} op={aparece(t, T.fraccion)}>
            contactos de una fracción de segundo
          </Texto>
          <Texto x={540} y={1100} size={34} color={C.cyan} op={aparece(t, T.fraccion)}>
            no alcanza a quemar
          </Texto>
          <Texto x={540} y={1300} size={42} color={C.red} op={aparece(t, T.detienes)}>
            si te detienes: ✗
          </Texto>
        </g>
        <g opacity={met}>
          <rect x={140} y={1150} width={800} height={60} fill="#C8401A" />
          <Pie x={540} y={1080} s={1.1} />
          {[0, 1, 2, 3, 4].map((k) => {
            const u = (t * 1.2 + k / 5) % 1;
            return <path key={k} d={`M ${430 + k * 50} ${1140 - u * 120} l 0 -30`} stroke={C.red} strokeWidth={10} opacity={1 - u} />;
          })}
          <Texto x={540} y={700} size={42} color={C.white}>
            metal a esa temperatura
          </Texto>
          <Texto x={540} y={1380} size={46} color={C.red} op={aparece(t, T.quemas)}>
            ¡el calor pasa de golpe!
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.quemas} color={C.red} />
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
