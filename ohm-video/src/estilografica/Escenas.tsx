import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/estilografica/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  tiene: 1.80, // tiene
  escribe: 3.40, // escribe
  papel: 4.50, // papel
  final: 5.42, // final
  punta: 7.96, // punta
  ranura: 8.72, // ranura
  baja: 10.52, // baja
  capilaridad: 11.38, // capilaridad
  servilleta: 14.18, // servilleta
  pero: 15.02, // pero
  superficial: 16.78, // superficial
  retiene: 17.58, // retiene
  tocar: 18.96, // tocar
  fibras: 20.00, // fibras
  jalan: 21.22, // jalan
  cada: 22.34, // cada
  burbuja: 24.06, // burbuja
  canal: 25.08, // canal
  nunca: 26.92, // nunca
  avion: 28.82, // avion
  presion: 29.28, // presion
  expande: 31.20, // expande
  empuja: 31.92, // empuja
  gotea: 33.40, // gotea
  porEso: 34.14, // por
  fin: 36.06, // FIN
};

const TINTA = "#2A5AE8";
const ORO = "#E8C060";
const PAPEL = "#F0ECE0";

// Pluma vertical apuntando hacia abajo; punta en (x, y)
const Pluma: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot?: number; readonly tinta?: number; readonly gota?: number; readonly punta?: boolean }> = ({
  x,
  y,
  s,
  rot = 0,
  tinta = 0,
  gota = 0,
  punta = false,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-60} y={-760} width={120} height={420} rx={30} fill="#1A1A2A" stroke="#5A5478" strokeWidth={6} opacity={punta ? 0 : 1} />
    <rect x={-50} y={-360} width={100} height={120} rx={20} fill="#2A2640" />
    <path d="M -50 -250 Q -50 -120 0 0 Q 50 -120 50 -250 Z" fill={ORO} />
    <circle cx={0} cy={-170} r={10} fill="#141030" />
    <line x1={0} y1={-160} x2={0} y2={0} stroke="#5A4A20" strokeWidth={4} />
    <line x1={0} y1={-160} x2={0} y2={-160 + 160 * tinta} stroke={TINTA} strokeWidth={6} />
    <ellipse cx={0} cy={6 + gota * 30} rx={6 + gota * 12} ry={6 + gota * 18} fill={TINTA} opacity={gota > 0 ? 1 : 0} />
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <rect x={140} y={1180} width={800} height={200} rx={10} fill={PAPEL} />
    <Pluma x={540} y={1120} s={1.1} rot={20} tinta={1} />
    <Texto x={300} y={720} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta pluma no se derrama?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tiene], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={TINTA} />
    </>
  );
};

// B. Tinta líquida, pero solo escribe al tocar el papel + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [T.escribe, T.papel], [0, 60], clamp);
  const linea = interpolate(t, [T.papel, T.final + 0.6], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.tiene, T.punta], [1, 1.05])}>
      <rect x={140} y={1180} width={800} height={130} rx={10} fill={PAPEL} />
      <path
        d={new Array(41)
          .fill(0)
          .map((_, i) => `${i ? "L" : "M"} ${250 + i * 15 * linea} ${1230 + Math.sin(i * 0.8) * 20}`)
          .join(" ")}
        stroke={TINTA}
        strokeWidth={8}
        fill="none"
        opacity={linea > 0 ? 1 : 0}
      />
      <Pluma x={250 + 600 * linea} y={1120 + baja} s={1} rot={20} tinta={1} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1380} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1380}
          width={700 * interpolate(t, [T.final, T.punta], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1470} color={C.white} size={38}>
          por qué gotea en un avión
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. La ranura finísima: la tinta baja por capilaridad, como el agua en una servilleta
export const Ranura: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const servi = aparece(t, T.servilleta);
  return (
    <Lienzo zoom={interpolate(t, [T.punta, T.pero], [1, 1.04])}>
      <g opacity={1 - servi * 0.85}>
        <Pluma punta x={540} y={1250} s={2.4} tinta={interpolate(t, [T.baja, T.capilaridad + 0.6], [0, 1], clamp)} />
      </g>
      <g opacity={aparece(t, T.ranura) * (1 - servi)}>
        <path d="M 640 980 L 560 980" stroke={C.yellow} strokeWidth={6} />
        <Texto x={760} y={990} size={36} color={C.yellow}>
          ranura
        </Texto>
      </g>
      <Texto x={540} y={1400} size={44} color={TINTA} op={aparece(t, T.capilaridad) * (1 - servi)}>
        capilaridad
      </Texto>
      <g opacity={servi}>
        <rect x={380} y={560} width={320} height={560} rx={10} fill={C.white} />
        {new Array(8).fill(0).map((_, k) => (
          <line key={k} x1={380} y1={600 + k * 64} x2={700} y2={600 + k * 64} stroke="#D8D4E0" strokeWidth={4} />
        ))}
        <rect x={380} y={1120 - 480 * interpolate(t, [T.servilleta, T.pero], [0, 1], clamp)} width={320} height={480 * interpolate(t, [T.servilleta, T.pero], [0, 1], clamp)} fill="#6AA8F8" opacity={0.6} />
        <rect x={300} y={1100} width={480} height={100} rx={20} fill="#6AA8F8" />
        <Texto x={540} y={1300} size={38} color={C.white}>
          el agua sube sola
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Pero no sale sola: la tensión superficial la retiene en la punta
export const Tension: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.tocar], [1, 1.04])}>
      <Pluma punta x={540} y={1100} s={2} tinta={1} />
      <ellipse cx={540} cy={1110} rx={26} ry={18} fill={TINTA} />
      <g opacity={aparece(t, T.superficial)}>
        <path d="M 490 1135 Q 540 1175 590 1135" stroke={C.cyan} strokeWidth={6} fill="none" />
        <Texto x={540} y={1250} size={40} color={C.cyan}>
          tensión superficial
        </Texto>
      </g>
      <Texto x={540} y={1320} size={36} color={C.white} op={aparece(t, T.retiene)}>
        la retiene en la punta
      </Texto>
    </Lienzo>
  );
};

// E. Al tocar el papel, sus fibras la absorben y la jalan hacia afuera
export const Fibras: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mancha = interpolate(t, [T.fibras, T.cada], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.tocar, T.cada], [1, 1.04])}>
        <rect x={60} y={1010} width={960} height={260} fill={PAPEL} />
        {new Array(30).fill(0).map((_, k) => (
          <line
            key={k}
            x1={80 + ((k * 97) % 900)}
            y1={1030 + ((k * 43) % 220)}
            x2={80 + ((k * 97) % 900) + 120}
            y2={1030 + ((k * 43) % 220) + ((k % 3) - 1) * 30}
            stroke="#C8C0B0"
            strokeWidth={4}
          />
        ))}
        <ellipse cx={540} cy={1020} rx={30 + 200 * mancha} ry={10 + 50 * mancha} fill={TINTA} opacity={aparece(t, T.fibras)} />
        <Pluma x={540} y={interpolate(t, [T.tocar, T.tocar + 0.4], [900, 1010], clamp)} s={1.6} tinta={1} punta />
        <Texto x={540} y={1360} size={40} color={C.white} op={aparece(t, T.fibras)}>
          las fibras la jalan
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.tocar + 0.4} color={TINTA} />
    </>
  );
};

// Corte del depósito y el alimentador: aire = burbuja en el depósito (0-1 tamaño)
const Deposito: React.FC<{ readonly t: number; readonly burbujas: number; readonly aire: number; readonly gota: number }> = ({ t, burbujas, aire, gota }) => (
  <g>
    <rect x={400} y={460} width={280} height={560} rx={40} fill="#141030" stroke="#5A5478" strokeWidth={8} />
    <rect x={415} y={480} width={250} height={525} rx={30} fill={TINTA} />
    <ellipse cx={540} cy={560} rx={60 + 70 * aire} ry={40 + 50 * aire} fill="#C8D8F8" opacity={aire > 0 ? 0.9 : 0} />
    <rect x={500} y={1020} width={80} height={220} fill="#2A2640" />
    <line x1={520} y1={1020} x2={520} y2={1240} stroke={TINTA} strokeWidth={10} />
    <line x1={560} y1={1240} x2={560} y2={1020} stroke="#C8D8F8" strokeWidth={6} strokeDasharray="10 8" />
    <path d="M 480 1240 Q 540 1340 600 1240 Z" fill={ORO} />
    {new Array(3).fill(0).map((_, k) => {
      const u = (t * 0.8 + k / 3) % 1;
      return <circle key={k} cx={560} cy={1240 - u * 600} r={12 + u * 6} fill="#E8F0FF" opacity={burbujas * (1 - u * 0.3)} />;
    })}
    <ellipse cx={540} cy={1340 + gota * 40} rx={10 + gota * 14} ry={10 + gota * 22} fill={TINTA} opacity={gota > 0 ? 1 : 0} />
  </g>
);

// F. Cada vez que sale tinta, entra una burbuja de aire por un canal: nunca sale de golpe
export const Burbuja: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cada, T.avion], [1, 1.04])}>
      <Deposito t={t} burbujas={aparece(t, T.burbuja)} aire={0.15} gota={0} />
      <g opacity={aparece(t, T.canal)}>
        <path d="M 580 1130 L 700 1130" stroke={C.white} strokeWidth={5} />
        <Texto x={820} y={1142} size={34} color={C.white}>
          canal de aire
        </Texto>
      </g>
      <Texto x={540} y={1440} size={40} color={C.yellow} op={aparece(t, T.nunca)}>
        nunca sale de golpe
      </Texto>
    </Lienzo>
  );
};

// G. En un avión la presión baja, el aire de adentro se expande y empuja la tinta: gotea
export const Avion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const aire = interpolate(t, [T.expande, T.empuja + 0.5], [0.15, 1], clamp);
  const gota = interpolate(t, [T.empuja + 0.3, T.gotea + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.avion, T.porEso], [1, 1.04])}>
        <Deposito t={t} burbujas={0} aire={aire} gota={gota} />
        <g opacity={aparece(t, T.avion)} transform="translate(850 560)">
          <path d="M -90 0 L 90 0 M -20 0 L -60 -60 L -30 -60 L 30 0 M -20 0 L -60 60 L -30 60 L 30 0 M -90 0 L -110 -30" stroke={C.white} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
        <g opacity={aparece(t, T.presion)}>
          <Texto x={850} y={720} size={34} color={C.cyan}>
            presión
          </Texto>
          <path d="M 850 750 l 0 70 m -20 -20 l 20 20 l 20 -20" stroke={C.cyan} strokeWidth={8} fill="none" />
        </g>
        <Texto x={200} y={600} size={34} color="#C8D8F8" op={aparece(t, T.expande)}>
          el aire
        </Texto>
        <Texto x={200} y={645} size={34} color="#C8D8F8" op={aparece(t, T.expande)}>
          se expande
        </Texto>
        <Texto x={540} y={1460} size={44} color={TINTA} op={aparece(t, T.gotea)}>
          ¡gotea!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.gotea} color={TINTA} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
