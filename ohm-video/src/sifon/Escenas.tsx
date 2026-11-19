import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/sifon/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  metes: 1.96, // metes
  chupas: 3.70, // chupas
  sube: 4.82, // sube
  sale: 6.36, // sale
  final: 7.48, // final
  primero: 9.42, // primero
  llena: 11.24, // llena
  extremo: 12.56, // extremo
  abajo: 13.78, // abajo
  entonces: 15.48, // entonces
  largo: 16.84, // largo
  pesa: 18.20, // pesa
  corto: 19.38, // corto
  caer: 21.02, // caer
  cadena: 22.88, // cadena
  presion: 23.84, // presion
  empuja: 24.50, // empuja
  hueco: 27.86, // hueco
  mientras: 28.14, // mientras
  sigue: 30.30, // sigue
  si: 31.42, // si
  subes: 31.62, // subes
  detiene: 33.58, // detiene
  asi: 34.28, // asi
  fin: 35.98, // FIN
};

const AGUA = "#3A9AE8";
const NIVEL = 780;

// Pecera, manguera y cubeta. lleno 0-1 (cuánto de la manguera tiene agua), fluye, salida = y del extremo
const Sifon: React.FC<{
  readonly t: number;
  readonly lleno: number;
  readonly fluye: number;
  readonly salida?: number;
  readonly resalta?: number;
}> = ({ t, lleno, fluye, salida = 1260, resalta = 0 }) => {
  const camino: [number, number][] = [
    [380, 960],
    [380, 640],
    [500, 560],
    [620, 640],
    [620, salida],
  ];
  const d = camino.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const largo = 320 + 144 + 144 + Math.abs(salida - 640);
  return (
    <g>
      {/* mesa */}
      <rect x={80} y={1000} width={480} height={30} fill="#5A4A3A" />
      <rect x={110} y={1030} width={30} height={420} fill="#5A4A3A" />
      <rect x={500} y={1030} width={30} height={420} fill="#5A4A3A" />
      {/* pecera */}
      <rect x={120} y={700} width={360} height={300} fill={AGUA} opacity={0.15} stroke="#8AC8F8" strokeWidth={8} />
      <rect x={124} y={NIVEL} width={352} height={216} fill={AGUA} opacity={0.6} />
      <path d={`M 230 ${NIVEL + 90} q 30 -20 60 0 q -30 20 -60 0 M 290 ${NIVEL + 90} l 20 -14 l 0 28 Z`} fill={C.orange} />
      {/* cubeta */}
      <path d="M 560 1220 L 580 1440 L 760 1440 L 780 1220 Z" fill="none" stroke={C.grey} strokeWidth={8} />
      <rect x={584} y={1440 - 120 * fluye} width={172} height={120 * fluye} fill={AGUA} opacity={0.6} />
      {/* manguera */}
      <path d={d} stroke="#2A2640" strokeWidth={34} fill="none" strokeLinejoin="round" />
      <path d={d} stroke={resalta ? C.yellow : "#5A5478"} strokeWidth={26} fill="none" strokeLinejoin="round" />
      <path d={d} stroke={AGUA} strokeWidth={20} fill="none" strokeLinejoin="round" strokeDasharray={`${largo * lleno} 3000`} />
      {fluye > 0
        ? new Array(10).fill(0).map((_, k) => {
            const u = (t * 0.5 + k / 10) % 1;
            const pos = u * largo;
            let acc = 0;
            for (let i = 0; i < camino.length - 1; i++) {
              const [x1, y1] = camino[i];
              const [x2, y2] = camino[i + 1];
              const l = Math.hypot(x2 - x1, y2 - y1);
              if (pos <= acc + l) {
                const f = (pos - acc) / l;
                return <circle key={k} cx={x1 + (x2 - x1) * f} cy={y1 + (y2 - y1) * f} r={7} fill={C.white} opacity={fluye} />;
              }
              acc += l;
            }
            return null;
          })
        : null}
      <path d={`M 620 ${salida} l 0 ${60 * fluye}`} stroke={AGUA} strokeWidth={14} opacity={fluye} />
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Sifon t={t} lleno={1} fluye={1} />
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo sube el agua sin bomba?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.metes], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={AGUA} />
    </>
  );
};

// B. Metes una manguera, chupas, y el agua sube por encima del borde y sale sola + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lleno = interpolate(t, [T.chupas, T.sale], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.metes, T.primero], [1, 1.04])}>
      <Sifon t={t} lleno={lleno} fluye={aparece(t, T.sale)} />
      <Texto x={880} y={1220} size={40} color={C.white} op={aparece(t, T.chupas) * (1 - aparece(t, T.sale))}>
        chupas
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={880} y={560} color={C.white} size={36}>
          la única regla:
        </Texto>
        <Texto x={880} y={610} color={C.white} size={36}>
          al final
        </Texto>
        <rect x={720} y={640} width={320} height={20} rx={10} fill="#2A2440" />
        <rect x={720} y={640} width={320 * interpolate(t, [T.final, T.primero], [0, 1], clamp)} height={20} rx={10} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. La manguera llena de agua y el extremo de afuera más abajo que el agua de la pecera
export const Regla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.primero, T.entonces], [1, 1.04])}>
      <Sifon t={t} lleno={1} fluye={0} />
      <Texto x={880} y={760} size={36} color={AGUA} op={aparece(t, T.llena)}>
        1. llena de agua
      </Texto>
      <g opacity={aparece(t, T.abajo)}>
        <line x1={100} y1={NIVEL} x2={1000} y2={NIVEL} stroke={C.yellow} strokeWidth={4} strokeDasharray="16 10" />
        <path d={`M 700 ${NIVEL + 20} L 700 1240 M 680 1210 L 700 1240 L 720 1210`} stroke={C.yellow} strokeWidth={6} fill="none" />
        <Texto x={880} y={1060} size={36} color={C.yellow}>
          2. salida
        </Texto>
        <Texto x={880} y={1110} size={36} color={C.yellow}>
          más abajo
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. El lado largo pesa más que el corto: al caer, tira de la columna como una cadena
export const Peso: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.entonces, T.presion], [1, 1.04])}>
        <Sifon t={t} lleno={1} fluye={aparece(t, T.caer)} />
        <g opacity={aparece(t, T.largo)}>
          <rect x={650} y={680} width={20} height={560} fill={C.orange} opacity={0.6} />
          <Texto x={860} y={960} size={36} color={C.orange}>
            lado largo
          </Texto>
          <Texto x={860} y={1010} size={36} color={C.orange} op={aparece(t, T.pesa)}>
            pesa más
          </Texto>
        </g>
        <g opacity={aparece(t, T.corto)}>
          <rect x={330} y={640} width={20} height={140} fill={C.cyan} opacity={0.7} />
          <Texto x={250} y={620} size={36} color={C.cyan}>
            lado corto
          </Texto>
        </g>
        <g opacity={aparece(t, T.cadena)}>
          {new Array(5).fill(0).map((_, k) => {
            const u = ((t * 0.6 + k / 5) % 1) * 480;
            return <ellipse key={k} cx={860} cy={1120 + (u % 240)} rx={22} ry={34} fill="none" stroke={C.white} strokeWidth={6} opacity={0.8} />;
          })}
          <Texto x={860} y={1460} size={34} color={C.white}>
            como una cadena
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.caer} color={AGUA} />
    </>
  );
};

// E. La presión del aire empuja el agua de la pecera hacia la manguera
export const Presion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.presion, T.mientras], [1, 1.04])}>
      <Sifon t={t} lleno={1} fluye={1} />
      <g opacity={aparece(t, T.empuja)}>
        {[160, 240, 320, 440].map((x, k) => {
          const u = (t * 1.2 + k * 0.25) % 1;
          return <path key={x} d={`M ${x} ${600 + u * 120} l 0 50 m -16 -18 l 16 18 l 16 -18`} stroke={C.white} strokeWidth={6} fill="none" />;
        })}
      </g>
      <Texto x={300} y={560} size={36} color={C.white} op={aparece(t, T.presion)}>
        presión del aire
      </Texto>
    </Lienzo>
  );
};

// F. Mientras la salida esté abajo sigue; si la subes por encima del nivel, se detiene
export const Subes: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const salida = interpolate(t, [T.subes, T.detiene], [1260, 720], clamp);
  const para = salida < NIVEL;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.mientras, T.asi], [1, 1.04])}>
        <Sifon t={t} lleno={1} fluye={para ? 0 : 1} salida={salida} />
        <line x1={100} y1={NIVEL} x2={1000} y2={NIVEL} stroke={C.yellow} strokeWidth={4} strokeDasharray="16 10" opacity={aparece(t, T.si)} />
        <Texto x={880} y={1060} size={38} color={AGUA} op={aparece(t, T.sigue) * (1 - aparece(t, T.subes))}>
          sigue fluyendo
        </Texto>
        <Texto x={880} y={600} size={40} color={C.red} op={aparece(t, T.detiene)}>
          ¡se detiene!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.detiene} color={C.red} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
