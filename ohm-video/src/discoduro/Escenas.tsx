import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/discoduro/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  archivos: 3.32, // archivos
  giran: 4.54, // giran
  final: 7.08, // final
  apagas: 8.48, // apagas
  capa: 10.26, // capa
  zonas: 11.66, // zonas
  norte: 13.98, // norte
  ceros: 15.88, // ceros
  cabeza: 16.80, // cabeza
  brazo: 18.54, // brazo
  aire: 20.80, // aire
  levanta: 21.24, // levanta
  nanometros: 22.98, // nan
  pasar: 25.50, // pasar
  senales: 28.32, // senales
  millones: 29.40, // millones
  apagarlo: 31.18, // apagarlo
  rampa: 33.04, // rampa
  datos: 35.52, // datos
  asi: 36.16, // asi
  fin: 38.22, // FIN
};

const PLATO = "#B8C0D0";

// Disco visto desde arriba: plato que gira y brazo con ángulo a (grados; 0 = sobre el plato)
const Disco: React.FC<{ readonly t: number; readonly a?: number; readonly s?: number; readonly gira?: number }> = ({ t, a = 0, s = 1, gira = 1 }) => (
  <g transform={`translate(540 1000) scale(${s})`}>
    <rect x={-400} y={-420} width={800} height={840} rx={40} fill="#2A2E3A" />
    <circle cx={-40} cy={-60} r={320} fill={PLATO} />
    <g transform={`rotate(${t * 720 * gira} -40 -60)`}>
      {[80, 150, 220, 290].map((r) => (
        <circle key={r} cx={-40} cy={-60} r={r} fill="none" stroke="#9AA2B4" strokeWidth={3} />
      ))}
      <line x1={-40} y1={-60} x2={-40} y2={-380} stroke="#FFFFFF" strokeWidth={6} opacity={0.5} />
    </g>
    <circle cx={-40} cy={-60} r={50} fill="#5A6070" />
    {/* rampa de estacionamiento */}
    <rect x={270} y={110} width={70} height={30} rx={8} fill="#6A7080" />
    {/* brazo: pivote abajo a la derecha */}
    <g transform={`rotate(${a} 260 300)`}>
      <path d="M 260 300 L 20 -60 L 0 -50 L 240 320 Z" fill="#D8DCE4" />
      <rect x={-8} y={-75} width={30} height={22} rx={4} fill={C.yellow} />
      <circle cx={260} cy={300} r={44} fill="#5A6070" />
    </g>
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Disco t={t} a={-6 * Math.sin(t * 3)} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo lee este disco sin tocarlo?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.archivos], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Guarda tus archivos en platos que giran a miles de vueltas por minuto + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.archivos, T.capa], [1, 1.04])}>
      <Disco t={t} a={-6 * Math.sin(t * 3)} gira={0.3 + 0.7 * aparece(t, T.giran)} />
      <Texto x={540} y={1520} size={40} color={C.cyan} op={aparece(t, T.giran)}>
        miles de vueltas por minuto
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿qué hace al apagarlo?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.capa], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Fila de zonas magnéticas (flechas N/S) que se desplaza con off
const Bits: React.FC<{ readonly y: number; readonly off: number; readonly op?: number; readonly bits?: number }> = ({ y, off, op = 1, bits = 0 }) => {
  const patron = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1];
  return (
    <g opacity={op}>
      {new Array(14).fill(0).map((_, k) => {
        const x = ((k * 90 - off) % 1260 + 1260) % 1260 - 90;
        const b = patron[k % patron.length];
        return (
          <g key={k} transform={`translate(${x} ${y})`}>
            <rect x={0} y={-40} width={86} height={80} fill={b ? "#3A6AA8" : "#A8603A"} opacity={0.85} />
            <path d={b ? "M 15 0 L 60 0 M 50 -12 L 68 0 L 50 12" : "M 70 0 L 25 0 M 35 -12 L 17 0 L 35 12"} stroke={C.white} strokeWidth={6} fill="none" />
            <Texto x={43} y={80} size={30} color={C.yellow} op={bits}>
              {String(b)}
            </Texto>
          </g>
        );
      })}
    </g>
  );
};

// C. Capa magnética con zonas diminutas: norte o sur = unos y ceros
export const Magnetico: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.capa, T.cabeza], [1, 1.04])}>
        <circle cx={540} cy={1000} r={260} fill="none" stroke={C.cyan} strokeWidth={6} opacity={aparece(t, T.capa)} />
        <Bits y={1000} off={t * 60} op={aparece(t, T.zonas)} bits={aparece(t, T.ceros)} />
        <Texto x={540} y={640} size={42} color={C.white} op={aparece(t, T.capa)}>
          capa magnética
        </Texto>
        <Texto x={540} y={1360} size={38} color={C.cyan} op={aparece(t, T.norte)}>
          cada zona: norte o sur
        </Texto>
        <Texto x={540} y={1430} size={44} color={C.yellow} op={aparece(t, T.ceros)}>
          = unos y ceros
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.zonas} color={C.cyan} />
    </>
  );
};

// D. La cabeza vuela sobre un colchón de aire a unos pocos nanómetros, sin tocar
export const Vuelo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sube = interpolate(t, [T.levanta, T.levanta + 0.8], [0, 1], clamp);
  const yC = 1060 - 40 * sube;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cabeza, T.pasar], [1, 1.04])}>
        <rect x={0} y={1100} width={1080} height={60} fill={PLATO} />
        <rect x={0} y={1160} width={1080} height={30} fill="#7A8090" />
        {new Array(7).fill(0).map((_, k) => {
          const u = (t * 1.5 + k / 7) % 1;
          return <path key={k} d={`M ${1080 - u * 1100} ${1085} l -50 0 m 12 -10 l -12 10 l 12 10`} stroke={C.cyan} strokeWidth={5} fill="none" opacity={aparece(t, T.aire) * 0.8} />;
        })}
        <path d={`M 980 ${yC - 300} L 560 ${yC - 40}`} stroke="#D8DCE4" strokeWidth={26} strokeLinecap="round" opacity={aparece(t, T.brazo)} />
        <rect x={430} y={yC - 50} width={160} height={50} rx={10} fill={C.yellow} opacity={aparece(t, T.cabeza)} />
        <Texto x={510} y={yC - 80} size={32} color={C.yellow} op={aparece(t, T.cabeza)}>
          cabeza lectora
        </Texto>
        <g opacity={aparece(t, T.nanometros)}>
          <line x1={640} y1={yC} x2={640} y2={1100} stroke={C.white} strokeWidth={3} />
          <Texto x={800} y={1060} size={30} color={C.white}>
            pocos nanómetros
          </Texto>
          <circle cx={200} cy={1400} r={90} fill="#3A3A44" />
          <Texto x={200} y={1530} size={28} color={C.grey}>
            un pelo: miles de veces más
          </Texto>
        </g>
        <Texto x={540} y={1300} size={38} color={C.cyan} op={aparece(t, T.aire)}>
          el giro arrastra aire que la levanta
        </Texto>
        <Texto x={700} y={1430} size={40} color="#5AD08A" op={aparece(t, T.nanometros)}>
          ¡sin tocarlo!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.levanta} color={C.cyan} />
    </>
  );
};

// E. Al pasar siente los cambios magnéticos y los vuelve señales eléctricas, millones por segundo
export const Lectura: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const off = t * 220;
  const pts = new Array(54)
    .fill(0)
    .map((_, i) => {
      const x = 60 + i * 18;
      const ph = Math.floor((x + off) / 90) % 2;
      return `${i ? "L" : "M"} ${x} ${1350 - (ph ? 60 : -60)}`;
    })
    .join(" ");
  return (
    <Lienzo zoom={interpolate(t, [T.pasar, T.apagarlo], [1, 1.04])}>
      <Bits y={1000} off={off} bits={1} />
      <rect x={480} y={880} width={120} height={50} rx={10} fill={C.yellow} />
      <path d="M 540 880 L 540 780 L 1000 600" stroke="#D8DCE4" strokeWidth={22} strokeLinecap="round" fill="none" />
      <path d={pts} stroke={C.cyan} strokeWidth={6} fill="none" opacity={aparece(t, T.senales)} />
      <Texto x={540} y={1480} size={38} color={C.cyan} op={aparece(t, T.senales)}>
        cambios magnéticos → señal eléctrica
      </Texto>
      <Texto x={540} y={640} size={44} color={C.yellow} op={aparece(t, T.millones)}>
        millones por segundo
      </Texto>
    </Lienzo>
  );
};

// F. Al apagarlo, el brazo se estaciona en una rampa fuera del plato
export const Rampa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const a = interpolate(t, [T.apagarlo + 0.3, T.rampa + 0.4], [0, 38], clamp);
  const gira = interpolate(t, [T.apagarlo, T.datos + 1], [1, 0.05], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.apagarlo, T.asi], [1, 1.04])}>
        <Disco t={t} a={a} gira={gira} />
        <Texto x={540} y={1520} size={42} color={C.yellow} op={aparece(t, T.rampa)}>
          se estaciona en la rampa
        </Texto>
        <Texto x={540} y={600} size={38} color={C.white} op={aparece(t, T.datos)}>
          así no aterriza sobre tus datos
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.rampa} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
