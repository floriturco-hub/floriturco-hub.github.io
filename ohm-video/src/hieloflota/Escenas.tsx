import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/hieloflota/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  sustancias: 2.24, // sustancias
  hunden: 4.06, // hunden
  hielo2: 5.88, // hielo
  final: 7.10, // final
  peces: 8.82, // peces
  encoge: 11.36, // encoge
  juntan: 12.86, // juntan
  denso: 14.78, // denso
  rara: 16.38, // rara
  atraen: 17.94, // atraen
  repelen: 19.20, // repelen
  hexagonos: 22.52, // hex
  huecos: 23.42, // huecos
  espacio: 26.64, // espacio
  lagos: 29.78, // lagos
  arriba: 30.82, // arriba
  aisla: 32.58, // aisla
  sobreviven: 34.46, // sobreviven
  porEso: 35.40, // por
  fin: 36.88, // FIN
};

const AGUA = "#3A8AD8";
const HIELO = "#C8E8FF";

const Vaso: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly agua?: string; readonly children?: React.ReactNode }> = ({ x, y, s = 1, agua = AGUA, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -140 -100 L 140 -100 L 120 260 L -120 260 Z" fill={agua} opacity={0.55} />
    {children}
    <path d="M -150 -260 L 150 -260 L 125 270 L -125 270 Z" fill="none" stroke="#DDEEFF" strokeWidth={6} />
  </g>
);

const Cubo: React.FC<{ readonly x: number; readonly y: number; readonly r?: number; readonly col?: string }> = ({ x, y, r = 0, col = HIELO }) => (
  <rect x={x - 60} y={y - 60} width={120} height={120} rx={16} fill={col} opacity={0.9} transform={`rotate(${r} ${x} ${y})`} />
);

// Molécula de agua: O rojo con dos H blancos
const H2O: React.FC<{ readonly x: number; readonly y: number; readonly r?: number; readonly s?: number }> = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <circle cx={0} cy={0} r={22} fill="#E05050" />
    <circle cx={-20} cy={18} r={12} fill="#F0F0F0" />
    <circle cx={20} cy={18} r={12} fill="#F0F0F0" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Vaso x={540} y={1050} s={1.3}>
      <Cubo x={-30} y={-110 + 6 * Math.sin(t * 2)} r={10} />
      <Cubo x={60} y={-100 + 6 * Math.sin(t * 2 + 1)} r={-14} />
    </Vaso>
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este hielo flota?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.sustancias], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Casi todo sólido se hunde en su propio líquido; el hielo no + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [T.hunden, T.hunden + 0.8], [-100, 200], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.sustancias, T.encoge], [1, 1.04])}>
      <Vaso x={300} y={1020} s={0.9} agua="#D8A040">
        <Cubo x={0} y={baja} col="#B07820" />
      </Vaso>
      <Texto x={300} y={1340} size={32} color={C.white}>
        cera, metal...
      </Texto>
      <g opacity={aparece(t, T.hielo2)}>
        <Vaso x={780} y={1020} s={0.9}>
          <Cubo x={0} y={-110 + 6 * Math.sin(t * 2)} />
        </Vaso>
        <Texto x={780} y={1340} size={32} color={HIELO}>
          hielo: flota
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué salva a los peces?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.encoge], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Al enfriarse casi todo se encoge: moléculas más juntas, sólido más denso
export const Encoge: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const j = interpolate(t, [T.juntan, T.denso], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.encoge, T.rara], [1, 1.04])}>
      {new Array(25).fill(0).map((_, k) => {
        const gx = (k % 5) - 2;
        const gy = Math.floor(k / 5) - 2;
        const sep = 140 - 60 * j;
        const jit = (1 - j) * 30;
        return <circle key={k} cx={540 + gx * sep + jit * Math.sin(t * 3 + k)} cy={980 + gy * sep + jit * Math.cos(t * 3 + k * 1.3)} r={26} fill="#D8A040" />;
      })}
      <Texto x={540} y={620} size={38} color={C.white} op={aparece(t, T.encoge)}>
        al enfriarse, casi todo se encoge
      </Texto>
      <Texto x={540} y={1420} size={40} color={C.yellow} op={aparece(t, T.denso)}>
        sólido más denso
      </Texto>
    </Lienzo>
  );
};

// D. El agua es rara: se atraen por un lado y se repelen por otro; al congelarse forman hexágonos con huecos
export const Hexagonos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const hx = interpolate(t, [T.hexagonos, T.hexagonos + 1], [0, 1], clamp);
  const pts = new Array(6).fill(0).map((_, k) => {
    const a = (Math.PI / 3) * k + Math.PI / 6;
    return [Math.cos(a), Math.sin(a)];
  });
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.rara, T.lagos], [1, 1.04])}>
        <g opacity={1 - hx}>
          <H2O x={420} y={980} r={20} s={2.2} />
          <H2O x={660} y={980} r={-160} s={2.2} />
          <line x1={500} y1={1000} x2={590} y2={990} stroke="#5AD08A" strokeWidth={6} strokeDasharray="10 8" opacity={aparece(t, T.atraen)} />
          <Texto x={540} y={1160} size={32} color="#5AD08A" op={aparece(t, T.atraen)}>
            se atraen por un lado
          </Texto>
          <Texto x={540} y={1220} size={32} color={C.orange} op={aparece(t, T.repelen)}>
            y se repelen por otro
          </Texto>
        </g>
        <g opacity={hx}>
          {[
            [0, 0],
            [-1, 0],
            [1, 0],
            [-0.5, 1],
            [0.5, 1],
            [-0.5, -1],
            [0.5, -1],
          ].map(([cx, cy], k) => {
            const X = 540 + cx * 230;
            const Y = 980 + cy * 200;
            return (
              <g key={k}>
                <polygon points={pts.map(([px, py]) => `${X + px * 115},${Y + py * 115}`).join(" ")} fill="none" stroke={HIELO} strokeWidth={4} />
                {pts.map(([px, py], i) => (
                  <H2O key={i} x={X + px * 115} y={Y + py * 115} r={i * 60} s={0.7} />
                ))}
                {aparece(t, T.huecos) > 0 ? <circle cx={X} cy={Y} r={50} fill={C.yellow} opacity={0.25 * aparece(t, T.huecos)} /> : null}
              </g>
            );
          })}
        </g>
        <Texto x={540} y={620} size={40} color={C.white} op={aparece(t, T.rara)}>
          el agua es rara
        </Texto>
        <Texto x={540} y={1440} size={36} color={C.yellow} op={aparece(t, T.espacio)}>
          huecos: más espacio, menos denso
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.hexagonos} color={HIELO} />
    </>
  );
};

// E. Los lagos se congelan de arriba hacia abajo: el hielo aísla y los peces sobreviven
export const Lago: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const capa = interpolate(t, [T.arriba, T.arriba + 1], [0, 60], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.lagos, T.porEso], [1, 1.04])}>
        <path d="M 80 760 L 1000 760 L 900 1420 L 180 1420 Z" fill={AGUA} opacity={0.6} />
        <rect x={80} y={760} width={920} height={capa} fill={HIELO} />
        {[0, 1, 2].map((k) => {
          const x = 300 + k * 220 + 30 * Math.sin(t + k);
          const y = 1150 + k * 60;
          return (
            <g key={k} opacity={aparece(t, T.sobreviven) * 0.6 + 0.4}>
              <ellipse cx={x} cy={y} rx={60} ry={26} fill={C.orange} />
              <path d={`M ${x + 55} ${y} l 40 -26 l 0 52 Z`} fill={C.orange} />
            </g>
          );
        })}
        <Texto x={540} y={620} size={38} color={C.white} op={aparece(t, T.arriba)}>
          se congela de arriba hacia abajo
        </Texto>
        <Texto x={540} y={1500} size={36} color={C.yellow} op={aparece(t, T.sobreviven)}>
          el hielo aísla: los peces sobreviven
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.sobreviven} color={HIELO} />
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
