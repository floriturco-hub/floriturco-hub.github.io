import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/huesosbebe/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  bebe: 2.12, // bebe
  adulto: 5.02, // adulto
  final: 7.36, // final
  union: 8.34, // union
  pierden: 10.24, // pierden
  fusionan: 11.12, // fusionan
  piezas: 12.98, // piezas
  cartilago: 13.90, // cartilago
  vuelve: 15.38, // vuelve
  craneo: 17.16, // craneo
  placas: 18.12, // placas
  fontanelas: 19.90, // fontanelas
  cerebro: 21.52, // cerebro
  cadera: 22.38, // cadera
  sueldan: 24.18, // sueldan
  sacro: 25.44, // sacro
  vertebras: 27.48, // vertebras
  largos: 28.92, // largos
  crecimiento: 30.00, // crecimiento
  pubertad: 31.76, // pubertad
  clavicula: 33.92, // clavicula
  terminan: 34.60, // terminan
  ahi: 36.72, // ahi
  fin: 38.12, // FIN
};

const HUESO = "#F0E8D8";
const CART = "#8AC8E8";

// Hueso largo con placas de crecimiento (cart 0..1 visible)
const HuesoLargo: React.FC<{ readonly x: number; readonly y: number; readonly cart: number; readonly s?: number }> = ({ x, y, cart, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-260} width={80} height={520} rx={30} fill={HUESO} />
    {[-1, 1].map((d) => (
      <g key={d}>
        <ellipse cx={0} cy={d * 300} rx={90} ry={60} fill={HUESO} />
        <rect x={-70} y={d * 245 - 7} width={140} height={14} rx={7} fill={CART} opacity={cart} />
      </g>
    ))}
  </g>
);

// Cráneo de bebé visto desde arriba: placas separadas por fontanelas (f 1 = abiertas, 0 = cerradas)
const Craneo: React.FC<{ readonly x: number; readonly y: number; readonly f: number; readonly s?: number }> = ({ x, y, f, s = 1 }) => {
  const g = 26 * f;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={230} ry={290} fill={CART} opacity={0.5 * f} />
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sy], k) => (
        <path key={k} transform={`translate(${sx * g} ${sy * g})`} d={`M 0 0 L ${sx * 220} 0 A 220 280 0 0 ${sx * sy > 0 ? 1 : 0} 0 ${sy * 280} Z`} fill={HUESO} />
      ))}
      <path d={`M ${-40 * f} ${-90} L 0 ${-90 - 40 * f} L ${40 * f} -90 L 0 ${-90 + 40 * f} Z`} fill={CART} opacity={f} />
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Craneo x={540} y={1000} f={0.8 + 0.1 * Math.sin(t * 2)} s={1.1} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿a dónde se fueron estos huesos?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.bebe], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Un bebé nace con cerca de 300 huesos; un adulto tiene 206 + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = Math.round(interpolate(t, [T.adulto, T.adulto + 1.2], [300, 206], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.bebe, T.pierden], [1, 1.04])}>
      <Texto x={300} y={900} size={40} color={C.white} op={aparece(t, T.bebe)}>
        bebé
      </Texto>
      <Texto x={300} y={1040} size={110} color={C.yellow} op={aparece(t, T.bebe)}>
        ~300
      </Texto>
      <Texto x={780} y={900} size={40} color={C.white} op={aparece(t, T.adulto)}>
        adulto
      </Texto>
      <Texto x={780} y={1040} size={110} color={C.cyan} op={aparece(t, T.adulto)}>
        {String(n)}
      </Texto>
      <Texto x={540} y={1250} size={40} color={C.white} op={aparece(t, T.adulto)}>
        huesos
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿qué unión termina más tarde?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.pierden], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. No se pierden: se fusionan. Piezas separadas por cartílago que se vuelve hueso
export const Fusion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.vuelve, T.vuelve + 1], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pierden, T.craneo], [1, 1.04])}>
        <rect x={240} y={900} width={260} height={160} rx={30} fill={HUESO} />
        <rect x={580} y={900} width={260} height={160} rx={30} fill={HUESO} />
        <rect x={500 - 10 * u} y={910} width={80 + 20 * u} height={140} fill={u > 0.5 ? HUESO : CART} opacity={aparece(t, T.cartilago)} />
        <Texto x={540} y={640} size={44} color={C.yellow} op={aparece(t, T.fusionan)}>
          no se pierden: se fusionan
        </Texto>
        <Texto x={540} y={1180} size={34} color={CART} op={aparece(t, T.cartilago) * (1 - u)}>
          unidas por cartílago
        </Texto>
        <Texto x={540} y={1180} size={34} color={HUESO} op={u}>
          el cartílago se vuelve hueso
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.fusionan} color={C.yellow} />
    </>
  );
};

// D. El cráneo: placas con espacios blandos (fontanelas) que dejan crecer al cerebro
export const CraneoEsc: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.craneo, T.cadera], [1, 1.04])}>
      <Craneo x={540} y={1000} f={1} s={1.1} />
      <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.placas)}>
        el cráneo: placas separadas
      </Texto>
      <Texto x={540} y={1400} size={40} color={CART} op={aparece(t, T.fontanelas)}>
        fontanelas
      </Texto>
      <Texto x={540} y={1470} size={32} color={C.white} op={aparece(t, T.cerebro)}>
        dejan crecer al cerebro
      </Texto>
    </Lienzo>
  );
};

// E. Cadera: tres huesos que se sueldan; sacro: cinco vértebras
export const Cadera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const s1 = interpolate(t, [T.sueldan, T.sueldan + 0.8], [1, 0], clamp);
  const s2 = interpolate(t, [T.vertebras, T.vertebras + 0.8], [1, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cadera, T.largos], [1, 1.04])}>
        <g opacity={aparece(t, T.cadera)} transform="translate(300 950)">
          <path transform={`translate(${-20 * s1} ${-20 * s1})`} d="M -120 -60 Q -100 -200 40 -180 L 40 -20 Z" fill={HUESO} />
          <path transform={`translate(${-20 * s1} ${20 * s1})`} d="M -120 -40 L 30 0 L -20 120 Q -110 100 -120 -40 Z" fill={HUESO} />
          <path transform={`translate(${20 * s1} ${20 * s1})`} d="M 50 0 L 140 20 L 120 110 L 0 120 Z" fill={HUESO} />
          <Texto x={0} y={240} size={32} color={C.white}>
            cadera: 3 → 1
          </Texto>
        </g>
        <g opacity={aparece(t, T.sacro)} transform="translate(780 800)">
          {new Array(5).fill(0).map((_, k) => (
            <rect key={k} x={-80 + k * 8} y={k * (70 + 16 * s2)} width={160 - k * 16} height={64} rx={16} fill={HUESO} />
          ))}
          <Texto x={0} y={430} size={32} color={C.white}>
            sacro: 5 → 1
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.sueldan} color={C.white} />
    </>
  );
};

// F. Los huesos largos tienen placas de crecimiento que se cierran tras la pubertad
export const Largos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cierra = interpolate(t, [T.pubertad, T.pubertad + 0.8], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.largos, T.clavicula], [1, 1.04])}>
      <HuesoLargo x={540} y={1000} cart={aparece(t, T.crecimiento) * cierra} s={0.9} />
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.largos)}>
        huesos largos
      </Texto>
      <Texto x={820} y={790} size={30} color={CART} op={aparece(t, T.crecimiento) * cierra}>
        placa de crecimiento
      </Texto>
      <Texto x={540} y={1440} size={36} color={C.yellow} op={aparece(t, T.pubertad)}>
        se cierran tras la pubertad
      </Texto>
    </Lienzo>
  );
};

// G. La clavícula: algunas uniones terminan pasados los veinte años
export const Clavicula: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.clavicula, T.ahi], [1, 1.04])}>
        <path d="M 200 1000 Q 360 930 540 980 Q 720 1030 880 960" stroke={HUESO} strokeWidth={50} fill="none" strokeLinecap="round" />
        <circle cx={200} cy={1000} r={40} fill={CART} opacity={1 - aparece(t, T.terminan + 1)} />
        <Texto x={540} y={640} size={42} color={C.white} op={aparece(t, T.clavicula)}>
          la clavícula
        </Texto>
        <Texto x={540} y={1250} size={44} color={C.yellow} op={aparece(t, T.terminan)}>
          termina pasados los 20 años
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.clavicula} color={C.yellow} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.ahi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
