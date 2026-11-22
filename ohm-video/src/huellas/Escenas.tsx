import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/huellas/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  gemelos: 2.30, // gemelos
  adn: 4.02, // adn
  digitales: 6.22, // digitales
  final: 7.32, // final
  animal: 8.04, // animal
  nacer: 12.38, // nacer
  mes: 13.44, // mes
  yemas: 15.22, // yemas
  capas: 16.12, // capas
  abajo: 17.02, // abajo
  crestas: 19.68, // crestas
  adn2: 20.68, // adn
  arcos: 22.86, // arcos
  lazos: 23.60, // lazos
  remolinos: 24.26, // remolinos
  azar: 26.22, // azar
  posicion: 26.84, // posicion
  liquido: 28.54, // liquido
  dedo: 30.70, // dedo
  koalas: 31.66, // koalas
  experto: 35.46, // experto
  porEso: 36.10, // por
  fin: 38.20, // FIN
};

const CRESTA = "#E8B48A";

// Huella: tipo "lazo" | "arco" | "remolino"; semilla cambia detalles
const Huella: React.FC<{ readonly x: number; readonly y: number; readonly tipo?: string; readonly semilla?: number; readonly s?: number; readonly col?: string; readonly op?: number }> = ({
  x,
  y,
  tipo = "lazo",
  semilla = 0,
  s = 1,
  col = CRESTA,
  op = 1,
}) => {
  const lineas: string[] = [];
  for (let k = 0; k < 9; k++) {
    const r = 20 + k * 16;
    const w = Math.sin(semilla * 3.1 + k * 1.7) * 6;
    if (tipo === "arco") {
      lineas.push(`M ${-130} ${60 - k * 18} Q 0 ${-40 - k * 22 + w} 130 ${60 - k * 18}`);
    } else if (tipo === "remolino") {
      lineas.push(`M ${-r} 0 A ${r} ${r * 1.15 + w} 0 1 1 ${r * 0.9} ${r * 0.4}`);
    } else {
      lineas.push(`M ${-r * 0.8} ${120} L ${-r * 0.8} ${-r * 0.2} A ${r * 0.8} ${r + w} 0 0 1 ${r * 0.8} ${-r * 0.2} L ${r * 0.8 + w} 60`);
    }
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
      <ellipse cx={0} cy={0} rx={150} ry={190} fill="#3A2A20" opacity={0.4} />
      {lineas.map((d, k) => (
        <path key={k} d={d} stroke={col} strokeWidth={7} fill="none" strokeLinecap="round" />
      ))}
      {/* minucias: pequeñas bifurcaciones distintas según la semilla */}
      {[0, 1, 2].map((m) => (
        <circle key={m} cx={Math.sin(semilla * 5 + m * 2.2) * 90} cy={Math.cos(semilla * 4 + m * 1.9) * 110} r={8} fill={C.yellow} opacity={0.0} />
      ))}
    </g>
  );
};

const Persona: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y - 150} r={50} fill={CRESTA} />
    <rect x={x - 55} y={y - 95} width={110} height={190} rx={40} fill="#4A6AC8" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Huella x={340} y={1000} tipo="lazo" semilla={1} s={1.2} />
    <Huella x={740} y={1000} tipo="lazo" semilla={2.7} s={1.2} />
    <Texto x={540} y={1300} size={40} color={C.white}>
      vs
    </Texto>
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
    {void t}
  </>
);

// A. Gancho: ¿por qué estas huellas son distintas?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.gemelos], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Gemelos idénticos: mismo ADN, distintas huellas + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.gemelos, T.nacer], [1, 1.04])}>
      <Persona x={330} y={900} />
      <Persona x={750} y={900} />
      <Texto x={540} y={840} size={36} color={C.cyan} op={aparece(t, T.adn)}>
        = ADN
      </Texto>
      <g opacity={aparece(t, T.digitales)}>
        <Huella x={330} y={1260} tipo="lazo" semilla={1} s={0.8} />
        <Huella x={750} y={1260} tipo="lazo" semilla={2.7} s={0.8} />
        <Texto x={540} y={1280} size={44} color={C.yellow}>
          vs
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿qué animal tiene huellas como tú?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.nacer], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Se forman antes de nacer, hacia el tercer mes; la piel de las yemas crece en capas y la de abajo se arruga
export const Formacion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const arruga = interpolate(t, [T.abajo, T.crestas + 0.5], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.nacer, T.adn2], [1, 1.04])}>
        <g opacity={1 - aparece(t, T.yemas)}>
          <circle cx={540} cy={980} r={260} fill="#2A1E2A" />
          <path d="M 470 900 Q 420 1000 500 1080 Q 600 1120 640 1020 Q 650 920 560 880 Q 500 870 470 900 Z" fill={CRESTA} opacity={0.8} />
          <Texto x={540} y={1340} size={38} color={C.white} op={aparece(t, T.mes)}>
            hacia el tercer mes de embarazo
          </Texto>
        </g>
        <g opacity={aparece(t, T.yemas)}>
          <rect x={160} y={820} width={760} height={110} fill="#E8C8A8" opacity={aparece(t, T.capas)} />
          <path
            d={`M 160 ${1000} ${new Array(40)
              .fill(0)
              .map((_, i) => `L ${160 + i * 19.5} ${1000 + (i % 2 ? -50 : 50) * arruga}`)
              .join(" ")} L 920 1120 L 160 1120 Z`}
            fill={CRESTA}
          />
          <Texto x={540} y={780} size={34} color={C.white} op={aparece(t, T.capas)}>
            la piel crece en capas
          </Texto>
          <Texto x={540} y={1220} size={34} color={CRESTA} op={aparece(t, T.abajo)}>
            la de abajo crece más rápido y se arruga
          </Texto>
          <Texto x={540} y={1310} size={42} color={C.yellow} op={aparece(t, T.crestas)}>
            = crestas
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.crestas} color={C.yellow} />
    </>
  );
};

// D. El ADN decide el tipo: arcos, lazos o remolinos
export const Tipos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tipos: [string, string, number][] = [
    ["arco", "arcos", T.arcos],
    ["lazo", "lazos", T.lazos],
    ["remolino", "remolinos", T.remolinos],
  ];
  return (
    <Lienzo zoom={interpolate(t, [T.adn2, T.azar], [1, 1.04])}>
      <Texto x={540} y={640} size={40} color={C.cyan} op={aparece(t, T.adn2)}>
        el ADN decide el tipo
      </Texto>
      {tipos.map(([tipo, n, tt], k) => (
        <g key={tipo} opacity={aparece(t, tt)}>
          <Huella x={210 + k * 330} y={1000} tipo={tipo} semilla={k} s={0.75} />
          <Texto x={210 + k * 330} y={1220} size={32} color={C.white}>
            {n}
          </Texto>
        </g>
      ))}
    </Lienzo>
  );
};

// E. El detalle depende del azar: posición del bebé, presión del líquido y cómo crece cada dedo
export const Azar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sem = Math.floor(t * 3);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.azar, T.koalas], [1, 1.04])}>
        <Huella x={540} y={980} tipo="lazo" semilla={sem} s={1.2} />
        <Texto x={540} y={640} size={42} color={C.yellow} op={aparece(t, T.azar)}>
          el detalle: azar
        </Texto>
        {[
          ["posición del bebé", T.posicion],
          ["presión del líquido", T.liquido],
          ["cómo crece cada dedo", T.dedo],
        ].map(([txt, tt], k) => (
          <Texto key={String(txt)} x={540} y={1300 + k * 70} size={34} color={C.white} op={aparece(t, Number(tt))}>
            {String(txt)}
          </Texto>
        ))}
      </Lienzo>
      <Flash t={t} d={T.azar} color={C.yellow} />
    </>
  );
};

// F. Los koalas tienen huellas tan parecidas que podrían confundir a un experto
export const Koala: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.koalas, T.porEso], [1, 1.04])}>
      <g transform="translate(540 850)">
        <circle cx={-110} cy={-90} r={70} fill="#9AA0AC" />
        <circle cx={110} cy={-90} r={70} fill="#9AA0AC" />
        <circle cx={0} cy={0} r={130} fill="#B8BCC6" />
        <ellipse cx={0} cy={20} rx={30} ry={42} fill="#3A3A44" />
        <circle cx={-50} cy={-30} r={12} fill="#1A1A2A" />
        <circle cx={50} cy={-30} r={12} fill="#1A1A2A" />
      </g>
      <g opacity={aparece(t, T.experto)}>
        <Huella x={330} y={1250} tipo="lazo" semilla={4} s={0.6} />
        <Huella x={750} y={1250} tipo="lazo" semilla={4.3} s={0.6} />
        <Texto x={330} y={1410} size={28} color={C.white}>
          koala
        </Texto>
        <Texto x={750} y={1410} size={28} color={C.white}>
          humano
        </Texto>
      </g>
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.koalas)}>
        los koalas…
      </Texto>
      <Texto x={540} y={1500} size={36} color={C.yellow} op={aparece(t, T.experto)}>
        podrían confundir a un experto
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
