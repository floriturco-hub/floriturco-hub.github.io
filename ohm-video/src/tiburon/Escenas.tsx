import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/tiburon/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  groenlandia: 2.58, // groenlandia
  vivir: 3.52, // vivir
  nacer: 6.42, // nacer
  final: 7.34, // final
  crias: 9.24, // crias
  ojos: 11.40, // ojos
  cristalino: 12.78, // cristalino
  renueva: 15.48, // renueva
  guardado: 16.58, // guardado
  radiocarbono: 18.64, // radiocarbono
  calibrar: 21.22, // calibrar
  nucleares: 23.54, // nucleares
  pico: 25.58, // pico
  grande: 27.90, // grande
  margen: 30.62, // margen
  crece: 32.16, // crece
  crias2: 34.74, // crias
  asi: 37.12, // asi
  fin: 39.46, // FIN
};

const GRIS = "#7A8494";

// Tiburón de Groenlandia (silueta lateral, mira a la derecha)
const Tiburon: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y + 8 * Math.sin(t * 1.2)}) scale(${s})`}>
    <path d="M -320 0 Q -200 -90 60 -80 Q 240 -70 320 -10 Q 240 50 60 60 Q -200 70 -320 0 Z" fill={GRIS} />
    <path d="M -300 0 L -420 -90 L -390 0 L -420 80 Z" fill={GRIS} transform={`rotate(${6 * Math.sin(t * 2)} -310 0)`} />
    <path d="M -20 -78 L 30 -150 L 80 -76 Z" fill="#6A7484" />
    <path d="M 60 40 L 20 120 L 120 50 Z" fill="#6A7484" />
    <circle cx={240} cy={-20} r={12} fill="#DDE6F0" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Tiburon x={520} y={1000} s={1.2} t={t} />
    <Texto x={880} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cuántos años tiene este tiburón?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.groenlandia], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Podría vivir unos 400 años, pero nadie lo vio nacer + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.groenlandia, T.ojos], [1, 1.04])}>
      <Tiburon x={520} y={1000} s={1.2} t={t} />
      <Texto x={540} y={1300} size={52} color={C.yellow} op={aparece(t, T.vivir)}>
        ~400 años
      </Texto>
      <Texto x={540} y={1380} size={34} color={C.white} op={aparece(t, T.nacer)}>
        pero nadie lo vio nacer
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿a qué edad tiene crías?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.ojos], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. El centro del cristalino se forma antes de nacer y nunca se renueva; guarda carbono de esa época
export const Ojo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ojos, T.calibrar], [1, 1.04])}>
        <circle cx={540} cy={980} r={300} fill="#DDE6F0" opacity={0.15} stroke="#DDE6F0" strokeWidth={6} />
        {[230, 180, 130, 80].map((r, k) => (
          <ellipse key={r} cx={540} cy={980} rx={r} ry={r * 0.8} fill="none" stroke="#9AD8FF" strokeWidth={5} opacity={aparece(t, T.cristalino) * (0.4 + k * 0.15)} />
        ))}
        <ellipse cx={540} cy={980} rx={50} ry={40} fill={C.yellow} opacity={aparece(t, T.renueva)} />
        {new Array(8).fill(0).map((_, k) => (
          <circle key={k} cx={540 + Math.cos(k + t) * 24} cy={980 + Math.sin(k * 1.3 + t) * 18} r={6} fill="#2A2A2A" opacity={aparece(t, T.guardado)} />
        ))}
        <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.cristalino)}>
          el cristalino del ojo
        </Texto>
        <Texto x={540} y={1360} size={36} color={C.yellow} op={aparece(t, T.renueva)}>
          el centro: de antes de nacer, nunca se renueva
        </Texto>
        <Texto x={540} y={1440} size={36} color={C.cyan} op={aparece(t, T.radiocarbono)}>
          radiocarbono: ¿cuándo se formó?
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cristalino} color={C.cyan} />
    </>
  );
};

// D. Calibración: las pruebas nucleares de los años sesenta dejaron un pico de carbono 14 en el mar
export const Bomba: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.nucleares, T.grande], [0, 1], clamp);
  const f = (x: number) => (x < 0.45 ? 0.1 : x < 0.6 ? 0.1 + ((x - 0.45) / 0.15) * 0.9 : 1 - (x - 0.6) * 1.6 * 0.5);
  const n = Math.max(2, Math.floor(80 * u));
  const pts = new Array(n)
    .fill(0)
    .map((_, i) => `${i ? "L" : "M"} ${160 + (i / 79) * 760} ${1300 - f(i / 79) * 450}`)
    .join(" ");
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.calibrar, T.grande], [1, 1.04])}>
        <line x1={160} y1={1300} x2={940} y2={1300} stroke={C.grey} strokeWidth={3} />
        <line x1={160} y1={1300} x2={160} y2={800} stroke={C.grey} strokeWidth={3} />
        {["1900", "1950", "2000"].map((a, k) => (
          <Texto key={a} x={160 + k * 380} y={1350} size={26} color={C.grey}>
            {a}
          </Texto>
        ))}
        <Texto x={250} y={780} size={26} color={C.grey}>
          carbono 14
        </Texto>
        <path d={pts} stroke={C.yellow} strokeWidth={6} fill="none" />
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.calibrar)}>
          una marca para calibrar
        </Texto>
        <Texto x={620} y={820} size={34} color={C.yellow} op={aparece(t, T.pico)}>
          pruebas nucleares
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.pico} color={C.yellow} />
    </>
  );
};

// E. El más grande: unos 400 años, con un margen de más de un siglo; crece 1 cm/año; crías hacia los 150
export const Edad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.grande, T.asi], [1, 1.04])}>
      <Tiburon x={520} y={820} s={0.9} t={t} />
      <g opacity={aparece(t, T.grande)}>
        <line x1={140} y1={1150} x2={940} y2={1150} stroke={C.grey} strokeWidth={4} />
        {[0, 100, 200, 300, 400, 500].map((a, k) => (
          <g key={a}>
            <line x1={140 + k * 160} y1={1135} x2={140 + k * 160} y2={1165} stroke={C.grey} strokeWidth={4} />
            <Texto x={140 + k * 160} y={1210} size={26} color={C.grey}>
              {String(a)}
            </Texto>
          </g>
        ))}
        <circle cx={140 + 4 * 160} cy={1150} r={18} fill={C.yellow} />
        <rect x={140 + 2.8 * 160} y={1138} width={2.4 * 160} height={24} rx={12} fill={C.yellow} opacity={0.35 * aparece(t, T.margen)} />
        <Texto x={780} y={1100} size={36} color={C.yellow}>
          ~400 años
        </Texto>
      </g>
      <Texto x={540} y={1290} size={34} color={C.white} op={aparece(t, T.margen)}>
        margen: más de un siglo
      </Texto>
      <Texto x={540} y={1380} size={34} color={C.cyan} op={aparece(t, T.crece)}>
        crece ~1 cm al año
      </Texto>
      <Texto x={540} y={1470} size={42} color={C.yellow} op={aparece(t, T.crias2)}>
        primeras crías: ~150 años
      </Texto>
    </Lienzo>
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
