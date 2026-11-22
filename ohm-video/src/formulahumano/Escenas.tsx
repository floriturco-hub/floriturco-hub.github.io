import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/formulahumano/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  escribir: 2.06, // escribir
  humano: 2.72, // humano
  final: 5.80, // final
  elemento: 6.64, // elemento
  peso: 9.58, // peso
  oxigeno: 10.84, // oxigeno
  carbono: 11.76, // carbono
  hidrogeno: 12.36, // hidrogeno
  nitrogeno: 13.22, // nitrogeno
  contando: 14.28, // contando
  gana: 15.36, // gana
  cuerpo: 18.72, // cuerpo
  cientificos: 19.64, // cientificos
  proporcion: 21.94, // proporcion
  molecula: 24.72, // molecula
  mezcla: 25.86, // mezcla
  unen: 29.80, // unen
  cobalto: 31.58, // cobalto
  vitamina: 32.44, // vitamina
  millones: 36.32, // millones
  esa: 37.78, // esa
  fin: 39.32, // FIN
};

const COL: Record<string, string> = { O: "#E8703C", C: "#8C88A8", H: "#E8E6F0", N: "#3AB8E8", Co: C.yellow };

// Fórmula empírica (Sterner y Elser), cobalto = 1
const FORMULA: [string, string][] = [
  ["H", "375.000.000"],
  ["O", "132.000.000"],
  ["C", "85.700.000"],
  ["N", "6.430.000"],
  ["Ca", "1.500.000"],
  ["P", "1.020.000"],
  ["S", "206.000"],
  ["Na", "183.000"],
  ["K", "177.000"],
  ["Cl", "127.000"],
  ["Mg", "40.000"],
  ["Si", "38.600"],
  ["Fe", "2.680"],
  ["Zn", "2.110"],
  ["Cu", "76"],
  ["I", "14"],
  ["Mn", "13"],
  ["F", "13"],
  ["Cr", "7"],
  ["Se", "4"],
  ["Mo", "3"],
  ["Co", "1"],
];

const Silueta: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly op?: number }> = ({ x, y, s = 1, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <circle cx={0} cy={-260} r={70} fill="none" stroke={C.cyan} strokeWidth={8} />
    <path d="M -90 -170 L 90 -170 L 120 60 L 70 60 L 60 300 L 10 300 L 0 100 L -10 300 L -60 300 L -70 60 L -120 60 Z" fill="none" stroke={C.cyan} strokeWidth={8} strokeLinejoin="round" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Silueta x={540} y={1050} s={1.2} />
    {FORMULA.slice(0, 4).map(([e], k) => (
      <Texto key={e} x={200 + k * 170} y={580 + 12 * Math.sin(t * 2 + k)} size={64} color={COL[e] ?? C.white}>
        {e}
      </Texto>
    ))}
    <Texto x={880} y={560} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cuál es tu fórmula química?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.escribir], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. ¿Se puede escribir a un humano como una fórmula? + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.escribir, T.peso], [1, 1.04])}>
      <Silueta x={540} y={1050} s={1.2} />
      <Texto x={540} y={1500} size={44} color={C.white} op={aparece(t, T.humano)}>
        humano = C? H? O? N?
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿de qué tienes un solo átomo?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.peso], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Por peso: oxígeno, carbono, hidrógeno y nitrógeno
export const Peso: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const barras: [string, string, number, number][] = [
    ["O", "oxígeno", 65, T.oxigeno],
    ["C", "carbono", 18, T.carbono],
    ["H", "hidrógeno", 10, T.hidrogeno],
    ["N", "nitrógeno", 3, T.nitrogeno],
  ];
  return (
    <Lienzo zoom={interpolate(t, [T.peso, T.contando], [1, 1.04])}>
      <Texto x={540} y={640} size={42} color={C.white} op={aparece(t, T.peso)}>
        por peso
      </Texto>
      {barras.map(([e, nom, p, tt], k) => (
        <g key={e} opacity={aparece(t, tt)}>
          <Texto x={180} y={820 + k * 170} size={56} color={COL[e]}>
            {e}
          </Texto>
          <rect x={250} y={770 + k * 170} width={10 * p * aparece(t, tt)} height={70} rx={14} fill={COL[e]} />
          <Texto x={300 + 10 * p} y={820 + k * 170} size={34} color={C.white}>
            {"~" + p + " %"}
          </Texto>
          <Texto x={180} y={870 + k * 170} size={24} color={C.grey}>
            {nom}
          </Texto>
        </g>
      ))}
    </Lienzo>
  );
};

// D. Contando átomos gana el hidrógeno: unos seis de cada diez
export const Atomos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tipos = ["H", "H", "O", "H", "C", "H", "H", "O", "H", "N"];
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.contando, T.cientificos], [1, 1.04])}>
        <Texto x={540} y={640} size={42} color={C.white} op={aparece(t, T.contando)}>
          contando átomos
        </Texto>
        {tipos.map((e, k) => (
          <g key={k} opacity={aparece(t, T.contando + k * 0.12)}>
            <circle cx={200 + (k % 5) * 170} cy={900 + Math.floor(k / 5) * 200} r={70} fill={COL[e]} opacity={e === "H" ? 1 : 0.5} stroke={e === "H" && aparece(t, T.gana) > 0.5 ? C.yellow : "none"} strokeWidth={8} />
            <Texto x={200 + (k % 5) * 170} y={920 + Math.floor(k / 5) * 200} size={48} color="#1A1A2A">
              {e}
            </Texto>
          </g>
        ))}
        <Texto x={540} y={1400} size={44} color={C.yellow} op={aparece(t, T.gana)}>
          hidrógeno: ~6 de cada 10
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.gana} color={C.white} />
    </>
  );
};

// E. Escribieron tus elementos en proporción; pero no es una molécula: es una mezcla
export const Formula: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mez = aparece(t, T.mezcla);
  return (
    <Lienzo zoom={interpolate(t, [T.cientificos, T.cobalto], [1, 1.04])}>
      <g opacity={aparece(t, T.proporcion)}>
        {FORMULA.map(([e, n], k) => (
          <g key={e} opacity={aparece(t, T.proporcion + k * 0.08)}>
            <Texto x={130 + (k % 3) * 320} y={640 + Math.floor(k / 3) * 74} size={40} color={COL[e] ?? C.white}>
              {e}
            </Texto>
            <Texto x={250 + (k % 3) * 320} y={640 + Math.floor(k / 3) * 74} size={24} color={C.white}>
              {n}
            </Texto>
          </g>
        ))}
      </g>
      <g opacity={mez}>
        {[
          ["agua", 260],
          ["proteínas", 540],
          ["grasas", 820],
        ].map(([n, x]) => (
          <g key={String(n)}>
            <circle cx={Number(x)} cy={1340} r={90} fill="#1E2A3A" stroke={C.cyan} strokeWidth={5} />
            <Texto x={Number(x)} y={1350} size={28} color={C.cyan}>
              {String(n)}
            </Texto>
          </g>
        ))}
        <Texto x={540} y={1500} size={36} color={C.yellow}>
          no es una molécula: es una mezcla
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. El cobalto (vitamina B12) aparece con un solo átomo, contra cientos de millones de hidrógenos
export const Cobalto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cobalto, T.esa], [1, 1.04])}>
        <Texto x={540} y={900} size={150} color={C.yellow} op={aparece(t, T.cobalto)}>
          Co: 1
        </Texto>
        <Texto x={540} y={1020} size={36} color={C.white} op={aparece(t, T.vitamina)}>
          cobalto, de la vitamina B12
        </Texto>
        <Texto x={540} y={1250} size={64} color={COL.H} op={aparece(t, T.millones)}>
          H 375.000.000
        </Texto>
        <Texto x={540} y={1330} size={32} color={C.grey} op={aparece(t, T.millones)}>
          por cada átomo de cobalto
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cobalto} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.esa, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
