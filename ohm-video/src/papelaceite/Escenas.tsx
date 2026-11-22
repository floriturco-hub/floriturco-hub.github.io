import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/papelaceite/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  gota: 2.56, // gota
  mancha: 4.76, // mancha
  final: 7.42, // final
  calcar: 9.48, // calcar
  red: 11.24, // red
  celulosa: 12.02, // celulosa
  aire: 12.82, // aire
  desvia: 16.64, // desvia
  rebota: 17.34, // rebota
  blanco: 20.84, // blanco
  huecos: 23.16, // huecos
  celulosa2: 25.36, // celulosa
  saltos: 26.56, // saltos
  atraviesa: 27.56, // atraviesa
  agua: 28.98, // agua
  secarse: 30.32, // secarse
  calcar2: 33.20, // calcar
  prensadas: 34.76, // prensadas
  porEso: 37.00, // por
  fin: 39.14, // FIN
};

const PAPEL = "#F4F0E6";
const ACEITE = "#E8C858";

// Hoja de papel con mancha translúcida (radio r) y texto debajo que se ve a través
const Hoja: React.FC<{ readonly r: number; readonly t: number }> = ({ r }) => (
  <g>
    <rect x={160} y={680} width={760} height={760} rx={10} fill="#2A3A5A" />
    {["FRECUENCIA", "CERO", "CIENCIA"].map((w, k) => (
      <Texto key={w} x={540} y={900 + k * 160} size={90} color={C.yellow}>
        {w}
      </Texto>
    ))}
    <mask id="mancha">
      <rect x={0} y={0} width={1080} height={1920} fill="white" />
      <circle cx={560} cy={1060} r={r} fill="black" />
    </mask>
    <rect x={160} y={680} width={760} height={760} rx={10} fill={PAPEL} mask="url(#mancha)" />
    <circle cx={560} cy={1060} r={r} fill={ACEITE} opacity={0.18} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Hoja r={200 + 6 * Math.sin(t * 2)} t={t} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este papel se vuelve transparente?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.gota], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Cae una gota de aceite y la mancha se vuelve casi transparente + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const yG = interpolate(t, [T.gota, T.gota + 0.6], [560, 1060], clamp);
  const r = interpolate(t, [T.gota + 0.6, T.mancha + 0.6], [0, 200], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.gota, T.red], [1, 1.04])}>
      <Hoja r={r} t={t} />
      <path d={`M 560 ${yG - 50} Q 590 ${yG} 560 ${yG + 20} Q 530 ${yG} 560 ${yG - 50} Z`} fill={ACEITE} opacity={r > 1 ? 0 : 1} />
      <Texto x={540} y={1520} size={38} color={C.white} op={aparece(t, T.mancha)}>
        ¡casi transparente!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cómo se hace el papel de calcar?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.red], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Fibras en corte (círculos) con el hueco relleno de aire o aceite; rayo de luz que se desvía o atraviesa
const Fibras: React.FC<{ readonly t: number; readonly relleno: number; readonly color?: string; readonly rayo?: number; readonly recto?: number }> = ({ t, relleno, color = ACEITE, rayo = 0, recto = 0 }) => {
  const fib: [number, number][] = [];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) fib.push([250 + i * 115 + (j % 2) * 55, 780 + j * 115]);
  // rayo en zigzag (dispersado) vs recto
  const zz = "M 100 700 L 300 860 L 220 1020 L 420 1120 L 330 1260 L 160 1180";
  const rec = "M 120 700 L 960 1400";
  const off = -t * 300;
  return (
    <g>
      <rect x={180} y={720} width={760} height={600} fill={color} opacity={0.5 * relleno} />
      {fib.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={46} fill={PAPEL} opacity={0.9} />
      ))}
      <path d={recto > 0.5 ? rec : zz} stroke={C.yellow} strokeWidth={8} fill="none" strokeDasharray="40 24" strokeDashoffset={off} opacity={rayo} />
    </g>
  );
};

// C. Red de fibras de celulosa con aire; la luz se desvía en cada salto, rebota y sale: blanco y opaco
export const Disperso: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.red, T.huecos], [1, 1.04])}>
        <Fibras t={t} relleno={0} rayo={aparece(t, T.desvia)} />
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.celulosa)}>
          fibras de celulosa + aire
        </Texto>
        <Texto x={540} y={1440} size={36} color={C.yellow} op={aparece(t, T.desvia)}>
          fibra → aire: la luz se desvía
        </Texto>
        <Texto x={540} y={1510} size={40} color={PAPEL} op={aparece(t, T.blanco)}>
          rebota y sale: blanco y opaco
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.desvia} color={C.yellow} />
    </>
  );
};

// D. El aceite llena los huecos y desvía la luz casi igual que la celulosa: la luz atraviesa
export const Aceite: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const at = aparece(t, T.atraviesa);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.huecos, T.agua], [1, 1.04])}>
        <Fibras t={t} relleno={aparece(t, T.huecos)} rayo={1} recto={at} />
        <Texto x={540} y={640} size={40} color={ACEITE} op={aparece(t, T.huecos)}>
          el aceite llena los huecos
        </Texto>
        <Texto x={540} y={1440} size={34} color={C.white} op={aparece(t, T.celulosa2)}>
          desvía la luz casi igual que la celulosa
        </Texto>
        <Texto x={540} y={1510} size={42} color={C.yellow} op={at}>
          la luz atraviesa
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.atraviesa} color={ACEITE} />
    </>
  );
};

// E. El agua lo hace menos y, al secarse, vuelve a ser blanco
export const Agua: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const seca = interpolate(t, [T.secarse, T.calcar2], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.agua, T.calcar2], [1, 1.04])}>
      <Fibras t={t} relleno={0.6 * seca} color="#8AC8FF" rayo={0} />
      <Texto x={540} y={640} size={40} color="#8AC8FF" op={aparece(t, T.agua)}>
        con agua: menos transparente
      </Texto>
      <Texto x={540} y={1440} size={38} color={PAPEL} op={aparece(t, T.secarse)}>
        al secarse, vuelve a ser blanco
      </Texto>
    </Lienzo>
  );
};

// F. El papel de calcar: fibras tan prensadas que casi no queda aire
export const Calcar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = aparece(t, T.prensadas);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.calcar2, T.porEso], [1, 1.04])}>
        {new Array(40).fill(0).map((_, k) => {
          const i = k % 8;
          const j = Math.floor(k / 8);
          return <ellipse key={k} cx={230 + i * (90 - 12 * p) + (j % 2) * 40} cy={820 + j * (100 - 40 * p)} rx={46 + 6 * p} ry={46 - 18 * p} fill={PAPEL} opacity={0.9} />;
        })}
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.calcar2)}>
          papel de calcar
        </Texto>
        <Texto x={540} y={1440} size={36} color={C.yellow} op={p}>
          fibras prensadas: casi sin aire
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.prensadas} color={C.white} />
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
