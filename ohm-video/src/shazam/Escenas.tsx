import { interpolate, random } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/shazam/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  bar: 2.10, // bar
  app: 3.12, // app
  segundos: 3.98, // segundos
  final: 6.64, // final
  ruido: 7.92, // ruido
  mapa: 10.98, // mapa
  tiempo: 11.84, // tiempo
  frecuencias: 13.04, // frecuencias
  fuertes: 16.68, // fuertes
  picos: 17.46, // picos
  estrellas: 18.26, // estrellas
  parejas: 20.92, // parejas
  codigo: 24.62, // codigo
  huella: 25.50, // huella
  compara: 25.88, // compara
  millones: 27.62, // millones
  orden: 30.10, // orden
  ruido2: 30.92, // ruido
  supera: 32.12, // supera
  sobreviven: 35.68, // sobreviven
  asi: 36.60, // asi
  fin: 38.00, // FIN
};

// Espectrograma: rejilla de 24x14 celdas con intensidades
const COLS = 24;
const FILAS = 14;
const INT = new Array(COLS * FILAS).fill(0).map((_, i) => random(`e${i}`) * 0.5);
const PICOS: [number, number][] = [
  [1, 3],
  [3, 9],
  [5, 5],
  [7, 11],
  [9, 2],
  [11, 7],
  [13, 4],
  [15, 10],
  [17, 6],
  [19, 3],
  [21, 8],
  [23, 5],
];
PICOS.forEach(([c, f]) => {
  INT[f * COLS + c] = 1;
});
const X0 = 150;
const Y0 = 680;
const CW = 32;
const CH = 44;
const px = (c: number) => X0 + c * CW + CW / 2;
const py = (f: number) => Y0 + (FILAS - 1 - f) * CH + CH / 2;

const Espectro: React.FC<{ readonly u: number; readonly solo?: number; readonly ruido?: number }> = ({ u, solo = 0, ruido = 0 }) => (
  <g>
    {INT.map((v, i) => {
      const c = i % COLS;
      const f = Math.floor(i / COLS);
      if (c / COLS > u) return null;
      const esPico = v === 1;
      const val = esPico ? 1 : (v + ruido * random(`r${i}`) * 0.5) * (1 - solo);
      return <rect key={i} x={X0 + c * CW} y={Y0 + (FILAS - 1 - f) * CH} width={CW - 2} height={CH - 2} fill={esPico && solo > 0.5 ? C.yellow : `rgba(8, 216, 232, ${val})`} />;
    })}
  </g>
);

const Cel: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-230} width={240} height={460} rx={34} fill="#1A2633" stroke="#8C88A8" strokeWidth={6} />
    {[0, 1, 2].map((k) => (
      <circle key={k} cx={0} cy={-20} r={50 + k * 30 + ((t * 40) % 30)} fill="none" stroke={C.cyan} strokeWidth={4} opacity={0.6 - k * 0.18} />
    ))}
    <circle cx={0} cy={-20} r={44} fill={C.cyan} />
  </g>
);

const Nota: React.FC<{ readonly x: number; readonly y: number; readonly color: string }> = ({ x, y, color }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={30} rx={22} ry={16} fill={color} transform="rotate(-20 0 30)" />
    <rect x={16} y={-50} width={8} height={80} fill={color} />
    <path d="M 24 -50 Q 50 -30 44 0" stroke={color} strokeWidth={8} fill="none" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Cel x={540} y={1050} t={t} s={1.2} />
    {[0, 1, 2, 3].map((k) => (
      <Nota key={k} x={220 + k * 210} y={700 + 20 * Math.sin(t * 3 + k)} color={k % 2 ? C.yellow : C.cyan} />
    ))}
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo reconoce esta canción?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.bar], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. En un bar ruidoso, una app escucha unos segundos y dice qué canción suena + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ok = aparece(t, T.segundos + 0.8);
  return (
    <Lienzo zoom={interpolate(t, [T.bar, T.mapa], [1, 1.04])}>
      {new Array(10).fill(0).map((_, k) => (
        <Texto key={k} x={160 + ((k * 97) % 760)} y={700 + ((k * 151) % 700)} size={36} color={C.grey}>
          {["bla", "¡ja!", "bla", "jaja", "eh", "bla"][k % 6]}
        </Texto>
      ))}
      <Cel x={540} y={1050} t={t} />
      <g opacity={ok}>
        <rect x={340} y={1320} width={400} height={90} rx={20} fill="#1A2633" stroke={C.cyan} strokeWidth={4} />
        <Texto x={540} y={1378} size={34} color={C.cyan}>
          canción encontrada
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué el ruido no la confunde?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.mapa], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Convierte el sonido en un mapa: tiempo en un eje y frecuencias en el otro
export const Mapa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.mapa, T.fuertes], [1, 1.04])}>
        <Espectro u={interpolate(t, [T.mapa, T.fuertes], [0.1, 1], clamp)} />
        <path d={`M ${X0} ${Y0 + FILAS * CH + 20} L ${X0 + COLS * CW} ${Y0 + FILAS * CH + 20}`} stroke={C.white} strokeWidth={4} opacity={aparece(t, T.tiempo)} />
        <Texto x={540} y={Y0 + FILAS * CH + 70} size={32} color={C.white} op={aparece(t, T.tiempo)}>
          tiempo →
        </Texto>
        <path d={`M ${X0 - 20} ${Y0 + FILAS * CH} L ${X0 - 20} ${Y0}`} stroke={C.white} strokeWidth={4} opacity={aparece(t, T.frecuencias)} />
        <Texto x={540} y={620} size={32} color={C.white} op={aparece(t, T.frecuencias)}>
          ↑ frecuencias (graves → agudos)
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.mapa} color={C.cyan} />
    </>
  );
};

// D. Solo guarda los puntos más fuertes, los picos, como estrellas
export const Picos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.fuertes, T.parejas], [1, 1.04])}>
      <Espectro u={1} solo={aparece(t, T.picos)} />
      <Texto x={540} y={620} size={40} color={C.yellow} op={aparece(t, T.picos)}>
        solo los picos
      </Texto>
      <Texto x={540} y={1430} size={36} color={C.white} op={aparece(t, T.estrellas)}>
        como estrellas en el cielo
      </Texto>
    </Lienzo>
  );
};

// E. Une los picos en parejas con el tiempo entre ellos: cada pareja es un código, una huella
export const Huella: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.parejas, T.compara], [1, 1.04])}>
        <Espectro u={1} solo={1} />
        {PICOS.slice(0, -1).map(([c, f], k) => {
          const [c2, f2] = PICOS[k + 1];
          return <line key={k} x1={px(c)} y1={py(f)} x2={px(c2)} y2={py(f2)} stroke={C.yellow} strokeWidth={4} opacity={aparece(t, T.parejas + k * 0.12)} />;
        })}
        <g opacity={aparece(t, T.codigo)}>
          <rect x={260} y={1340} width={560} height={90} rx={20} fill="#1A2633" stroke={C.yellow} strokeWidth={4} />
          <Texto x={540} y={1398} size={34} color={C.yellow}>
            {"#" + ["A3F9", "7C21", "E05B"][Math.floor(t * 2) % 3] + "  ·  huella"}
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.codigo} color={C.yellow} />
    </>
  );
};

// F. Compara las huellas con millones de canciones y busca la que coincide en orden
export const Busqueda: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ok = aparece(t, T.orden);
  return (
    <Lienzo zoom={interpolate(t, [T.compara, T.ruido2], [1, 1.04])}>
      {new Array(7).fill(0).map((_, k) => {
        const match = k === 3 && ok > 0.5;
        return (
          <g key={k} opacity={aparece(t, T.compara + k * 0.08)}>
            <rect x={180} y={680 + k * 110} width={720} height={84} rx={16} fill={match ? "#1E3A2A" : "#1A2633"} stroke={match ? "#5AD08A" : "#3A4656"} strokeWidth={4} />
            {new Array(10).fill(0).map((_, m) => (
              <rect key={m} x={210 + m * 66} y={700 + k * 110} width={46} height={44} rx={8} fill={match ? "#5AD08A" : `rgba(8,216,232,${0.2 + random(`b${k}${m}`) * 0.5})`} />
            ))}
          </g>
        );
      })}
      <Texto x={540} y={620} size={38} color={C.white} op={aparece(t, T.millones)}>
        contra millones de canciones
      </Texto>
      <Texto x={540} y={1500} size={40} color="#5AD08A" op={ok}>
        ¡coinciden en orden!
      </Texto>
    </Lienzo>
  );
};

// G. El ruido casi nunca supera a los picos más fuertes de la música: las huellas sobreviven
export const Ruido: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ruido2, T.asi], [1, 1.04])}>
        <Espectro u={1} solo={aparece(t, T.sobreviven)} ruido={1} />
        <Texto x={540} y={620} size={38} color={C.white} op={aparece(t, T.ruido2)}>
          con el ruido del bar…
        </Texto>
        <Texto x={540} y={1430} size={40} color={C.yellow} op={aparece(t, T.sobreviven)}>
          los picos siguen ahí
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.sobreviven} color={C.yellow} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
