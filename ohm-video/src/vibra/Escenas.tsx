import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/vibra/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  cuando: 1.88, // cuando
  algo: 2.80, // algo
  final: 5.02, // final
  antiguos: 8.30, // antiguos
  motor: 9.36, // motor
  pesa: 10.62, // pesa
  girar: 12.48, // girar
  tira: 14.80, // tira
  tiembla: 17.86, // tiembla
  modernos: 18.88, // modernos
  lineal: 20.10, // lineal
  masa: 21.34, // masa
  iman: 22.08, // iman
  resortes: 23.06, // resortes
  bobina: 24.18, // bobina
  empuja: 24.70, // empuja
  frenar: 26.90, // frenar
  golpecitos: 28.02, // golpecitos
  clic: 29.64, // clic
  zumbido: 30.62, // zumbido
  eso: 31.36, // eso
  fin: 33.40, // FIN
};

const COBRE = "#D88A4A";

const Celular: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly corte?: number; readonly children?: React.ReactNode }> = ({
  x,
  y,
  s,
  corte = 0,
  children,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-190} y={-370} width={380} height={740} rx={50} fill="#2A2640" stroke="#5A5478" strokeWidth={8} />
    <rect x={-165} y={-330} width={330} height={640} rx={24} fill="#1C2A50" opacity={1 - corte * 0.8} />
    <g opacity={corte}>{children}</g>
  </g>
);

const Ondas: React.FC<{ readonly x: number; readonly y: number; readonly op: number; readonly t: number }> = ({ x, y, op, t }) => (
  <g opacity={op}>
    {[-1, 1].map((sd) =>
      [0, 1, 2].map((k) => (
        <path
          key={`${sd}${k}`}
          d={`M ${x + sd * (240 + k * 40)} ${y - 80 + k * 10} q ${sd * 20} 80 0 ${160 - k * 20}`}
          stroke={C.yellow}
          strokeWidth={8}
          fill="none"
          opacity={0.5 + 0.5 * Math.sin(t * 30 + k)}
        />
      )),
    )}
  </g>
);

// Motor con pesa descentrada (de lado): ang en grados
const MotorERM: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly ang: number }> = ({ x, y, s, ang }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-90} width={260} height={180} rx={30} fill="#5A5478" />
    <rect x={60} y={-14} width={90} height={28} fill={C.grey} />
    <g transform={`translate(160 0) rotate(${ang})`}>
      <path d="M 0 -90 A 90 90 0 0 1 0 90 Z" fill={C.yellow} />
      <circle cx={0} cy={0} r={14} fill={C.grey} />
    </g>
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <g transform={`translate(${Math.sin(t * 60) * 8} 0)`}>
      <Celular x={540} y={960} s={1.15} />
    </g>
    <Ondas x={540} y={960} op={1} t={t} />
    <Texto x={870} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿qué se mueve dentro de tu celular?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cuando], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Cuando vibra, algo adentro se sacude + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const corte = aparece(t, T.algo);
  return (
    <Lienzo zoom={interpolate(t, [T.cuando, T.antiguos], [1, 1.05])}>
      <g transform={`translate(${Math.sin(t * 60) * 8 * (1 - corte)} 0)`}>
        <Celular x={540} y={860} s={0.95} corte={corte}>
          <circle cx={0} cy={180} r={60} fill={C.yellow} opacity={0.4 + 0.4 * Math.sin(t * 30)} />
          <circle cx={0} cy={180} r={30} fill={C.yellow} />
        </Celular>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.antiguos], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          por qué los nuevos vibran distinto
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Los antiguos: motor con pesa descentrada; al girar tira de un lado a otro y tiembla
export const Antiguo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vel = interpolate(t, [T.girar, T.girar + 1], [60, 900], clamp);
  const ang = (t - T.antiguos) * vel;
  const tiembla = aparece(t, T.tiembla);
  const dx = Math.sin((ang * Math.PI) / 180) * 30 * aparece(t, T.tira);
  return (
    <Lienzo zoom={interpolate(t, [T.antiguos, T.modernos], [1, 1.04])}>
      <Texto x={540} y={470} size={42} color={C.white} op={aparece(t, T.antiguos)}>
        celulares antiguos
      </Texto>
      <g opacity={1 - tiembla}>
        <MotorERM x={480} y={820} s={1.3} ang={ang} />
        <Texto x={690} y={1020} size={36} color={C.yellow} op={aparece(t, T.pesa)}>
          pesa descentrada
        </Texto>
        <g opacity={aparece(t, T.tira)}>
          <path d={`M ${540 + dx * 3} 1150 l -60 0 m 120 0 l -60 0`} stroke={C.orange} strokeWidth={10} />
          <circle cx={540 + dx * 3} cy={1150} r={18} fill={C.orange} />
          <Texto x={540} y={1230} size={34} color={C.orange}>
            tira de un lado al otro
          </Texto>
        </g>
      </g>
      <g opacity={tiembla} transform={`translate(${Math.sin(t * 60) * 12} 0)`}>
        <Celular x={540} y={880} s={0.8} corte={1}>
          <MotorERM x={-30} y={200} s={0.5} ang={ang} />
        </Celular>
      </g>
      <Ondas x={540} y={880} op={tiembla} t={t} />
    </Lienzo>
  );
};

// Motor lineal: masa con imán entre resortes, bobina alrededor; x = desplazamiento
const MotorLRA: React.FC<{ readonly x: number; readonly y: number; readonly dx: number; readonly iman: number; readonly bobina: number; readonly resortes: number }> = ({
  x,
  y,
  dx,
  iman,
  bobina,
  resortes,
}) => {
  const res = (x0: number, x1: number) =>
    new Array(13)
      .fill(0)
      .map((_, i) => `${i ? "L" : "M"} ${x0 + ((x1 - x0) * i) / 12} ${i === 0 || i === 12 ? 0 : i % 2 ? -30 : 30}`)
      .join(" ");
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-420} y={-160} width={840} height={320} rx={30} fill="#141030" stroke="#5A5478" strokeWidth={8} />
      <path d={res(-410, -110 + dx)} stroke={C.cyan} strokeWidth={8} fill="none" opacity={resortes} />
      <path d={res(110 + dx, 410)} stroke={C.cyan} strokeWidth={8} fill="none" opacity={resortes} />
      <g transform={`translate(${dx} 0)`}>
        <rect x={-110} y={-100} width={220} height={200} rx={16} fill="#8C88A8" />
        <g opacity={iman}>
          <rect x={-70} y={-60} width={70} height={120} fill={C.red} />
          <rect x={0} y={-60} width={70} height={120} fill="#3A6EE8" />
          <Texto x={-35} y={15} size={40} color={C.white}>
            N
          </Texto>
          <Texto x={35} y={15} size={40} color={C.white}>
            S
          </Texto>
        </g>
      </g>
      <g opacity={bobina}>
        {new Array(8).fill(0).map((_, k) => (
          <ellipse key={k} cx={-140 + k * 40} cy={0} rx={14} ry={140} fill="none" stroke={COBRE} strokeWidth={8} opacity={0.75} />
        ))}
      </g>
    </g>
  );
};

// D. Los modernos: motor lineal con masa, imán, resortes y bobina
export const Lineal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dx = Math.sin(t * 12) * 70 * aparece(t, T.empuja);
  return (
    <Lienzo zoom={interpolate(t, [T.modernos, T.frenar], [1, 1.04])}>
      <Texto x={540} y={470} size={42} color={C.white} op={aparece(t, T.modernos)}>
        motor lineal
      </Texto>
      <g opacity={aparece(t, T.lineal)}>
        <MotorLRA x={540} y={860} dx={dx} iman={aparece(t, T.iman)} bobina={aparece(t, T.bobina)} resortes={aparece(t, T.resortes)} />
      </g>
      <Texto x={540} y={1100} size={36} color={C.grey} op={aparece(t, T.masa) * (1 - aparece(t, T.iman))}>
        una pequeña masa
      </Texto>
      <Texto x={540} y={1100} size={36} color={C.red} op={aparece(t, T.iman) * (1 - aparece(t, T.resortes))}>
        con un imán
      </Texto>
      <Texto x={540} y={1100} size={36} color={C.cyan} op={aparece(t, T.resortes) * (1 - aparece(t, T.bobina))}>
        sujeta por resortes
      </Texto>
      <Texto x={540} y={1100} size={36} color={COBRE} op={aparece(t, T.bobina)}>
        la bobina la empuja
      </Texto>
    </Lienzo>
  );
};

// E. Se frena en seco: golpecitos precisos como un clic, en vez de un zumbido
export const Clic: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const onda = (y: number, f: (u: number) => number, col: string, op: number) => (
    <path
      d={new Array(121)
        .fill(0)
        .map((_, i) => `${i ? "L" : "M"} ${160 + i * 6.4} ${y + f(i / 120) * 70}`)
        .join(" ")}
      stroke={col}
      strokeWidth={6}
      fill="none"
      opacity={op}
    />
  );
  const golpe = Math.max(0, Math.sin(((t - T.golpecitos) % 0.5) * Math.PI * 2) * (((t - T.golpecitos) % 0.5) < 0.12 ? 1 : 0));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.frenar, T.eso], [1, 1.04])}>
        <MotorLRA x={540} y={640} dx={golpe * 70 * aparece(t, T.golpecitos)} iman={1} bobina={1} resortes={1} />
        <Texto x={540} y={900} size={40} color={C.yellow} op={aparece(t, T.frenar)}>
          frena en seco
        </Texto>
        <g opacity={aparece(t, T.clic)}>
          <Texto x={160} y={1010} size={34} color={C.cyan} anchor="start">
            clic
          </Texto>
          {onda(1090, (u) => (u > 0.3 && u < 0.4 ? Math.sin((u - 0.3) * 120) * Math.exp(-(u - 0.3) * 40) : 0), C.cyan, 1)}
        </g>
        <g opacity={aparece(t, T.zumbido)}>
          <Texto x={160} y={1230} size={34} color={C.grey} anchor="start">
            zumbido
          </Texto>
          {onda(1320, (u) => Math.sin(u * 90) * Math.min(1, u * 4, (1 - u) * 4), C.grey, 1)}
        </g>
      </Lienzo>
      <Flash t={t} d={T.clic} color={C.cyan} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.eso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
