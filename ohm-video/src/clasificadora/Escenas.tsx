import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/clasificadora/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  clasificadora: 2.38, // clasificadora
  toneladas: 3.48, // toneladas
  chorro: 5.90, // chorro
  final: 7.22, // final
  dispara: 8.74, // dispara
  banda: 10.98, // banda
  cortina: 12.92, // cortina
  camaras: 13.72, // camaras
  escanean: 14.96, // escanean
  infrarrojo: 17.78, // infrarrojo
  golpes: 18.96, // golpes
  computadora: 20.84, // computadora
  compara: 21.40, // compara
  mancha: 25.00, // mancha
  instante: 26.46, // instante
  boquillas: 28.90, // boquillas
  valvula: 30.84, // valvula
  milesimas: 31.74, // milesimas
  desvia: 33.78, // desvia
  asi: 35.58, // asi
  fin: 37.54, // FIN
};

const PAPA = "#D8B868";
const MALA = "#5A4A2A";

// Papas cayendo desde la banda (x de 200 a 880) en una cortina; la mala (índice m) sale desviada tras tDisp
const Cortina: React.FC<{ readonly t: number; readonly tDisp?: number; readonly yBoq?: number; readonly marca?: number }> = ({ t, tDisp = 999, yBoq = 1150, marca = 0 }) => (
  <g>
    {/* banda */}
    <rect x={100} y={560} width={680} height={40} rx={20} fill="#3A3E4A" />
    {new Array(30).fill(0).map((_, k) => {
      const fase = (k * 0.137) % 1;
      const u = (t * 0.9 + fase) % 1;
      const ciclo = Math.floor(t * 0.9 + fase);
      const mala = (k + ciclo) % 11 === 3;
      const x0 = 160 + ((k * 53) % 600);
      let x = x0 + 40 * u;
      const y = 620 + u * u * 1100;
      if (mala && y > yBoq && t > tDisp) x += (y - yBoq) * 0.9;
      return (
        <g key={k}>
          <ellipse cx={x} cy={y} rx={30} ry={20} fill={mala ? MALA : PAPA} transform={`rotate(${k * 37 + t * 80} ${x} ${y})`} />
          {mala && marca > 0 ? <circle cx={x} cy={y} r={44} fill="none" stroke={C.yellow} strokeWidth={5} opacity={marca} /> : null}
        </g>
      );
    })}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Cortina t={t} tDisp={0} marca={1} />
    <rect x={900} y={1120} width={90} height={60} rx={10} fill="#5A6070" />
    <Texto x={880} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo encuentra esta papa podrida?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.clasificadora], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Revisa toneladas de papas y saca la mala con un chorro de aire + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.clasificadora, T.banda], [1, 1.04])}>
      <Cortina t={t} tDisp={T.chorro} marca={aparece(t, T.toneladas)} />
      <rect x={900} y={1120} width={90} height={60} rx={10} fill="#5A6070" />
      <path d="M 900 1150 L 780 1150" stroke={C.cyan} strokeWidth={14} strokeDasharray="20 14" strokeDashoffset={t * 200} opacity={aparece(t, T.chorro)} />
      <Texto x={540} y={1520} size={40} color={C.cyan} op={aparece(t, T.chorro)}>
        ¡chorro de aire a la mala!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿qué tan rápido dispara?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.banda], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Caen en una cortina; cámaras ultrarrápidas la escanean en color e infrarrojo
export const Escaneo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ir = aparece(t, T.infrarrojo);
  const yL = 900 + 30 * Math.sin(t * 30);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.banda, T.computadora], [1, 1.04])}>
        <Cortina t={t} marca={aparece(t, T.golpes)} />
        <g opacity={aparece(t, T.camaras)}>
          <rect x={900} y={860} width={130} height={80} rx={14} fill="#4A5060" />
          <circle cx={915} cy={900} r={24} fill={C.cyan} />
          <line x1={60} y1={yL} x2={900} y2={yL} stroke={ir ? "#F0E070" : C.cyan} strokeWidth={4} opacity={0.8 * aparece(t, T.escanean)} />
        </g>
        <Texto x={540} y={1500} size={36} color={C.white} op={aparece(t, T.cortina)}>
          caen formando una cortina
        </Texto>
        <Texto x={540} y={1570} size={36} color={C.cyan} op={aparece(t, T.escanean)}>
          escaneo: miles de veces por segundo
        </Texto>
        <Texto x={540} y={760} size={34} color="#F0E070" op={ir}>
          color + infrarrojo: ve golpes ocultos
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.camaras} color={C.cyan} />
    </>
  );
};

// D. La computadora compara cada punto con una papa buena; si hay mancha calcula cuándo pasará por las boquillas
export const Analisis: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const man = aparece(t, T.mancha);
  return (
    <Lienzo zoom={interpolate(t, [T.computadora, T.valvula], [1, 1.04])}>
      <rect x={180} y={640} width={720} height={520} rx={24} fill="#1A1E28" stroke="#4A5060" strokeWidth={6} />
      {new Array(12).fill(0).map((_, i) =>
        new Array(9).fill(0).map((_, j) => {
          const dx = i - 6;
          const dy = j - 4;
          const dentro = (dx * dx) / 30 + (dy * dy) / 14 < 1;
          const malo = dentro && (dx - 2) * (dx - 2) + (dy + 1) * (dy + 1) < 3 && man > 0;
          return dentro ? <rect key={`${i}-${j}`} x={240 + i * 50} y={690 + j * 50} width={46} height={46} fill={malo ? MALA : PAPA} opacity={aparece(t, T.compara)} /> : null;
        }),
      )}
      <rect x={240 + 7 * 50} y={690 + 2 * 50} width={140} height={140} fill="none" stroke={C.yellow} strokeWidth={6} opacity={man} />
      <Texto x={540} y={1240} size={36} color={C.white} op={aparece(t, T.compara)}>
        compara cada punto con una papa buena
      </Texto>
      <Texto x={540} y={1320} size={40} color={C.yellow} op={man}>
        ¡mancha!
      </Texto>
      <g opacity={aparece(t, T.instante)}>
        <Texto x={540} y={1420} size={36} color={C.cyan}>
          calcula cuándo pasará por las boquillas
        </Texto>
        {[0, 1, 2, 3, 4, 5, 6].map((k) => (
          <rect key={k} x={250 + k * 85} y={1500} width={60} height={40} rx={8} fill={k === 4 ? C.cyan : "#5A6070"} opacity={aparece(t, T.boquillas)} />
        ))}
      </g>
    </Lienzo>
  );
};

// E. Abre una válvula unas milésimas de segundo y el chorro desvía solo esa papa
export const Disparo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.valvula, T.desvia + 0.8], [0, 1], clamp);
  const px = 500 + (u > 0.45 ? (u - 0.45) * 700 : 0);
  const py = 700 + u * 800;
  const chorro = u > 0.4 && u < 0.55 ? 1 : 0;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.valvula, T.asi], [1, 1.04])}>
        {[380, 620].map((x, k) => (
          <ellipse key={x} cx={x} cy={700 + ((u * 800 + k * 300) % 800)} rx={34} ry={22} fill={PAPA} />
        ))}
        <ellipse cx={px} cy={py} rx={34} ry={22} fill={MALA} />
        <rect x={120} y={1020} width={140} height={70} rx={12} fill="#5A6070" />
        <path d="M 260 1055 L 480 1055" stroke={C.cyan} strokeWidth={18} strokeDasharray="22 12" strokeDashoffset={t * 300} opacity={chorro} />
        <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.valvula)}>
          la válvula se abre…
        </Texto>
        <Texto x={540} y={1300} size={44} color={C.yellow} op={aparece(t, T.milesimas)}>
          unas milésimas de segundo
        </Texto>
        <Texto x={540} y={1380} size={36} color={C.cyan} op={aparece(t, T.desvia)}>
          y desvía solo esa papa
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.milesimas} color={C.cyan} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
