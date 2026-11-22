import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/perla/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  y: 1.72,
  arena: 3.54,
  final: 4.44,
  ostra: 7.08,
  nacar: 8.14,
  capa: 9.0,
  cuando: 11.78,
  parasito: 12.16,
  tejido: 13.0,
  atrapado: 14.48,
  noPuede: 15.9,
  entonces: 17.78,
  saco: 19.12,
  cubre: 19.74,
  capas: 20.74,
  miles: 21.96,
  pelo: 23.7,
  secree: 24.4,
  gira: 25.66,
  redonda: 27.62,
  brilla: 28.12,
  arco: 30.72,
  cultivo: 32.16,
  bolita: 34.14,
  porque: 35.44,
  fin: 38.1,
};

const PERLA = "#F2EEF6";
const CONCHA = "#6A5A70";
const CARNE = "#D8B8A8";
const NACAR = ["#F0C8E0", "#C8E0F0", "#E0F0C8", "#F0E0C8"];

// Perla con brillo
const Perla: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly op?: number }> = ({ x, y, r, op = 1 }) => (
  <g opacity={op}>
    <circle cx={x} cy={y} r={r} fill={PERLA} />
    <circle cx={x + r * 0.15} cy={y + r * 0.15} r={r * 0.85} fill="#D8D0E8" opacity={0.5} />
    <ellipse cx={x - r * 0.35} cy={y - r * 0.35} rx={r * 0.25} ry={r * 0.15} fill={C.white} transform={`rotate(-40 ${x - r * 0.35} ${y - r * 0.35})`} />
  </g>
);

// Ostra abierta (vista frontal)
const Ostra: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly abre?: number }> = ({ x, y, s, abre = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M -260 0 Q -240 ${-200 * abre} 0 ${-230 * abre} Q 240 ${-200 * abre} 260 0 Z`} fill={CONCHA} />
    <path d={`M -230 -10 Q -210 ${-170 * abre} 0 ${-195 * abre} Q 210 ${-170 * abre} 230 -10 Z`} fill="#E8DCF0" opacity={0.6} />
    <path d="M -260 0 Q -240 170 0 190 Q 240 170 260 0 Z" fill={CONCHA} />
    <path d="M -230 0 Q -210 140 0 160 Q 210 140 230 0 Z" fill="#E8DCF0" />
    <ellipse cx={0} cy={40} rx={180} ry={90} fill={CARNE} />
  </g>
);

// Imagen del gancho y del cierre: perla con rejas dentro de la ostra
const PerlaCarcel: React.FC<{ readonly rejas: number }> = ({ rejas }) => (
  <>
    <circle cx={540} cy={860} r={330} fill={PERLA} opacity={0.08} />
    <Ostra x={540} y={940} s={1.6} />
    <Perla x={540} y={970} r={120} />
    <g opacity={rejas}>
      <circle cx={540} cy={970} r={18} fill="#4A3A50" />
      {[-80, -40, 0, 40, 80].map((dx) => (
        <line key={dx} x1={540 + dx} y1={850} x2={540 + dx} y2={1090} stroke="#5A5470" strokeWidth={10} opacity={0.75} />
      ))}
      <circle cx={540} cy={970} r={120} fill="none" stroke="#5A5470" strokeWidth={10} opacity={0.75} />
    </g>
  </>
);

// A. Gancho: la perla es una cárcel brillante
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.y], [1.12, 1])}>
        <PerlaCarcel rejas={interpolate(t, [0.7, 1.1], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.8} />
    </>
  );
};

// B. Casi nunca empieza con un grano de arena + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.ostra], [1, 1.05])}>
      <polygon points="470,720 560,690 620,760 590,850 500,860 450,790" fill="#C8A870" />
      <Texto x={540} y={960} size={40} color="#C8A870" op={aparece(t, T.arena - 0.6)}>
        grano de arena
      </Texto>
      <g opacity={aparece(t, T.arena)}>
        <line x1={380} y1={620} x2={700} y2={920} stroke={C.red} strokeWidth={16} />
        <Texto x={540} y={1060} size={52} color={C.red}>
          MITO
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.ostra], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={38}>
          qué hay en su centro: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. La ostra fabrica nácar, la capa brillante del interior de su concha
export const Nacar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const brillo = aparece(t, T.capa);
  return (
    <Lienzo zoom={interpolate(t, [T.ostra, T.cuando], [1, 1.04])}>
      <path d="M 140 1050 Q 140 600 540 560 Q 940 600 940 1050 Z" fill={CONCHA} />
      <path d="M 190 1030 Q 190 640 540 610 Q 890 640 890 1030 Z" fill="#E8DCF0" />
      {NACAR.map((c, k) => (
        <path
          key={k}
          d={`M ${220 + k * 30} 1010 Q ${240 + k * 30} ${680 + k * 30} 540 ${650 + k * 30} Q ${840 - k * 30} ${680 + k * 30} ${860 - k * 30} 1010`}
          stroke={c}
          strokeWidth={22}
          fill="none"
          opacity={brillo * (0.5 + 0.5 * Math.sin(t * 2 + k))}
        />
      ))}
      <Texto x={540} y={1160} size={46} color={C.white} op={aparece(t, T.nacar)}>
        nácar
      </Texto>
    </Lienzo>
  );
};

// Gusanito parásito
const Parasito: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M -40 0 Q -20 ${-16 * Math.sin(t * 6)} 0 0 Q 20 ${16 * Math.sin(t * 6)} 40 0`} stroke="#8A6A3A" strokeWidth={16} fill="none" strokeLinecap="round" />
  </g>
);

// D. Un parásito o un trocito de tejido queda atrapado y la ostra no puede expulsarlo
export const Intruso: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const entra = interpolate(t, [T.parasito, T.atrapado], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.cuando, T.entonces], [1, 1.04])}>
      <Ostra x={540} y={880} s={1.8} />
      <Parasito x={interpolate(entra, [0, 1], [120, 500])} y={interpolate(entra, [0, 1], [700, 950])} t={t} />
      <g opacity={aparece(t, T.tejido)}>
        <ellipse cx={640} cy={960} rx={22} ry={14} fill="#B8907A" />
      </g>
      <Texto x={300} y={1220} size={34} color="#C8A870" op={aparece(t, T.parasito)}>
        parásito
      </Texto>
      <Texto x={760} y={1220} size={34} color={CARNE} op={aparece(t, T.tejido)}>
        trocito de tejido
      </Texto>
      <Texto x={540} y={1340} size={40} color={C.red} op={aparece(t, T.noPuede)}>
        no puede expulsarlo
      </Texto>
    </Lienzo>
  );
};

// E. Lo encierra en un saco y lo cubre de nácar, miles de capas finísimas
export const Capas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = Math.floor(interpolate(t, [T.cubre, T.secree - 0.3], [0, 14], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.entonces, T.secree], [1, 1.05])}>
      <circle cx={540} cy={820} r={95 + n * 16} fill={CARNE} opacity={0.35} />
      {new Array(14).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={540}
          cy={820}
          r={70 + k * 16}
          fill="none"
          stroke={NACAR[k % 4]}
          strokeWidth={12}
          opacity={k < n ? 0.9 : 0}
        />
      ))}
      <circle cx={540} cy={820} r={60} fill="none" stroke={C.cyan} strokeWidth={6} strokeDasharray="14 10" opacity={aparece(t, T.saco)} />
      <Parasito x={540} y={820} t={t} s={0.9} />
      <Texto x={540} y={1180} size={40} color={C.white} op={aparece(t, T.saco) * (1 - aparece(t, T.miles))}>
        lo encierra en un saco
      </Texto>
      <Texto x={540} y={1180} size={40} color={C.yellow} op={aparece(t, T.miles)}>
        miles de capas de nácar
      </Texto>
      <Texto x={540} y={1250} size={34} color={C.grey} op={aparece(t, T.pelo)}>
        más finas que un pelo
      </Texto>
    </Lienzo>
  );
};

// F. Se cree que si el intruso gira mientras crece, la perla sale redonda
export const Gira: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const r = interpolate(t, [T.gira, T.brilla], [60, 150], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.secree, T.brilla], [1, 1.04])}>
      <g transform={`rotate(${(t - T.secree) * 120} 540 820)`}>
        <Perla x={540} y={820} r={r} />
        <circle cx={540 + r * 0.5} cy={820} r={10} fill="#C8C0D8" />
      </g>
      <path d="M 340 600 A 280 280 0 0 1 760 620" stroke={C.cyan} strokeWidth={10} fill="none" opacity={aparece(t, T.gira)} />
      <path d="M 760 580 L 790 640 L 724 640 Z" fill={C.cyan} opacity={aparece(t, T.gira)} />
      <Texto x={540} y={1150} size={42} color={C.white} op={aparece(t, T.redonda)}>
        gira = sale redonda
      </Texto>
    </Lienzo>
  );
};

// G. Brilla porque las capas reflejan la luz como un arcoíris
export const Brillo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const arco = aparece(t, T.arco - 0.6);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.brilla, T.cultivo], [1, 1.04])}>
        {[0, 1, 2, 3, 4].map((k) => (
          <path key={k} d={`M 120 ${1000 - k * 28} Q 540 ${960 - k * 28} 960 ${1000 - k * 28}`} stroke={NACAR[k % 4]} strokeWidth={18} fill="none" />
        ))}
        <line x1={300} y1={500} x2={520} y2={920} stroke={C.white} strokeWidth={14} />
        {["#E8414F", "#E8703C", "#F8C848", "#5AC878", "#08D8E8", "#8A5CC8"].map((c, k) => (
          <line key={c} x1={540} y1={920} x2={760 + k * 30} y2={500 + k * 22} stroke={c} strokeWidth={12} opacity={arco} />
        ))}
        <Texto x={540} y={1150} size={42} color={C.white} op={arco}>
          las capas reflejan la luz
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.arco} />
    </>
  );
};

// H. En las perlas de cultivo el centro es una bolita que pone una persona
export const Cultivo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const corte = aparece(t, T.bolita);
  return (
    <Lienzo zoom={interpolate(t, [T.cultivo, T.porque], [1, 1.04])}>
      <g opacity={1 - corte}>
        <Ostra x={540} y={900} s={1.4} />
        <line x1={900} y1={600} x2={600} y2={890} stroke="#A8A4C0" strokeWidth={12} />
        <circle cx={600} cy={890} r={30} fill={C.white} />
      </g>
      <g opacity={corte}>
        <circle cx={540} cy={820} r={230} fill={NACAR[0]} />
        <circle cx={540} cy={820} r={200} fill="#E8E0D0" />
        <Texto x={540} y={835} size={36} color="#6A5A50">
          bolita de concha
        </Texto>
        <Texto x={540} y={1120} size={36} color={NACAR[0]}>
          capa fina de nácar encima
        </Texto>
      </g>
      <Texto x={540} y={1240} size={40} color={C.white} op={aparece(t, T.cultivo + 0.3)}>
        perla de cultivo
      </Texto>
    </Lienzo>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <PerlaCarcel rejas={1} />
    </Lienzo>
  );
};
