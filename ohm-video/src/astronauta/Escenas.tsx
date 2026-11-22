import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/astronauta/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  meses: 2.54, // meses
  espacio: 3.10, // espacio
  alto: 6.90, // alto
  final: 7.74, // final
  pasa: 9.40, // pasa
  columna: 10.30, // columna
  discos: 12.08, // discos
  cojines: 13.24, // cojines
  gravedad: 15.62, // gravedad
  aplasta: 16.02, // aplasta
  peso: 19.56, // peso
  hinchan: 22.04, // hinchan
  estira: 23.40, // estira
  dolor: 25.00, // dolor
  volver: 26.28, // volver
  comprime: 27.46, // comprime
  noche: 30.98, // noche
  manana: 34.06, // ma
  porEso: 36.04, // por
  fin: 37.76, // FIN
};

// Columna vertebral: 7 vértebras con discos de alto h
const Columna: React.FC<{ readonly x: number; readonly y: number; readonly h: number; readonly s?: number; readonly marca?: number }> = ({ x, y, h, s = 1, marca = 0 }) => {
  const n = 7;
  const v = 70;
  const total = n * v + (n - 1) * h;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {new Array(n).fill(0).map((_, k) => {
        const yy = -total + k * (v + h);
        return (
          <g key={k}>
            <rect x={-70} y={yy} width={140} height={v} rx={18} fill="#E8E0D0" />
            {k < n - 1 ? <rect x={-60} y={yy + v} width={120} height={h} rx={h / 2} fill="#8AC8E8" opacity={0.85} /> : null}
          </g>
        );
      })}
      {marca > 0 ? <line x1={-120} y1={-total} x2={120} y2={-total} stroke={C.yellow} strokeWidth={5} strokeDasharray="12 8" opacity={marca} /> : null}
    </g>
  );
};

const Astronauta: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly t?: number; readonly alto?: number }> = ({ x, y, s = 1, t = 0, alto = 0 }) => (
  <g transform={`translate(${x} ${y + 10 * Math.sin(t)}) scale(${s}) rotate(${6 * Math.sin(t * 0.7)})`}>
    <rect x={-70} y={-120 - 30 * alto} width={140} height={220 + 30 * alto} rx={50} fill="#E8E6F0" />
    <circle cx={0} cy={-190 - 30 * alto} r={80} fill="#E8E6F0" />
    <circle cx={0} cy={-190 - 30 * alto} r={56} fill="#3A6A9A" />
    <rect x={-60} y={100} width={50} height={130} rx={24} fill="#E8E6F0" />
    <rect x={10} y={100} width={50} height={130} rx={24} fill="#E8E6F0" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Astronauta x={540} y={1050} s={1.2} t={t} alto={1} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este astronauta creció?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.meses], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Tras meses en el espacio puede regresar hasta 5 cm más alto + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const alto = aparece(t, T.alto);
  return (
    <Lienzo zoom={interpolate(t, [T.meses, T.columna], [1, 1.04])}>
      <Astronauta x={540} y={1050} s={1.1} t={t} alto={alto} />
      <line x1={760} y1={1310} x2={760} y2={720 - 33 * alto} stroke={C.grey} strokeWidth={4} />
      <line x1={740} y1={720} x2={780} y2={720} stroke={C.grey} strokeWidth={4} />
      <line x1={740} y1={720 - 33 * alto} x2={780} y2={720 - 33 * alto} stroke={C.yellow} strokeWidth={6} opacity={alto} />
      <Texto x={540} y={1450} size={44} color={C.yellow} op={alto}>
        hasta 5 cm más alto
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          a ti también te pasa: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.columna], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Vértebras separadas por discos blandos; la gravedad los aplasta todo el día
export const Discos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const h = 36 - 16 * aparece(t, T.aplasta);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.columna, T.peso], [1, 1.04])}>
        <Columna x={460} y={1400} h={h} />
        {aparece(t, T.gravedad) > 0
          ? [0, 1, 2].map((k) => <path key={k} d={`M ${720 + k * 70} 700 l 0 120 m -16 -16 l 16 16 l 16 -16`} stroke={C.orange} strokeWidth={8} fill="none" opacity={aparece(t, T.gravedad)} />)
          : null}
        <Texto x={780} y={660} size={32} color={C.orange} op={aparece(t, T.gravedad)}>
          gravedad
        </Texto>
        <Texto x={760} y={1060} size={32} color="#8AC8E8" op={aparece(t, T.discos)}>
          discos blandos
        </Texto>
        <Texto x={760} y={1110} size={28} color={C.white} op={aparece(t, T.cojines)}>
          como cojines con líquido
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.discos} color="#8AC8E8" />
    </>
  );
};

// D. En el espacio, sin peso, los discos absorben líquido, se hinchan y la columna se estira
export const Estira: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const h = interpolate(t, [T.hinchan, T.estira + 0.6], [20, 44], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.peso, T.volver], [1, 1.04])}>
        <Columna x={300} y={1400} h={20} s={0.9} />
        <Texto x={300} y={1470} size={30} color={C.grey}>
          Tierra
        </Texto>
        <Columna x={780} y={1400} h={h} s={0.9} marca={aparece(t, T.estira)} />
        <Texto x={780} y={1470} size={30} color="#8AC8E8">
          espacio
        </Texto>
        <Texto x={540} y={600} size={38} color={C.white} op={aparece(t, T.peso)}>
          sin peso, los discos se hinchan
        </Texto>
        <Texto x={540} y={1540} size={30} color={C.orange} op={aparece(t, T.dolor)}>
          puede doler la espalda
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.estira} color={C.yellow} />
    </>
  );
};

// E. Al volver, la gravedad los comprime; y a ti te pasa cada noche: más alto por la mañana
export const Noche: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const noche = aparece(t, T.noche);
  return (
    <Lienzo zoom={interpolate(t, [T.volver, T.porEso], [1, 1.04])}>
      <g opacity={1 - noche}>
        <Columna x={540} y={1400} h={interpolate(t, [T.comprime, T.comprime + 0.8], [44, 20], clamp)} />
        <Texto x={540} y={600} size={38} color={C.white} op={aparece(t, T.volver)}>
          al volver, la gravedad los comprime
        </Texto>
      </g>
      <g opacity={noche}>
        <rect x={180} y={1060} width={720} height={140} rx={30} fill="#3A4A6A" />
        <rect x={200} y={1000} width={500} height={70} rx={30} fill="#E8B48A" opacity={0.8} />
        <circle cx={760} cy={1010} r={50} fill="#E8B48A" />
        <circle cx={880} cy={720} r={60} fill="#E8E6F0" opacity={1 - aparece(t, T.manana)} />
        <circle cx={880} cy={720} r={60} fill={C.yellow} opacity={aparece(t, T.manana)} />
        <Texto x={540} y={600} size={38} color={C.white}>
          a ti te pasa cada noche
        </Texto>
        <Texto x={540} y={1360} size={40} color={C.yellow} op={aparece(t, T.manana)}>
          por la mañana: un poco más alto
        </Texto>
      </g>
    </Lienzo>
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
