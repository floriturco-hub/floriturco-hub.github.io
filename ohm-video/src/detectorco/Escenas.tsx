import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/detectorco/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  monoxido: 2.16, // monoxido
  olor: 3.58, // olor
  color: 4.26, // color
  matarte: 5.26, // matarte
  final: 6.74, // final
  detHumo: 7.92, // detector
  detector: 9.98, // detector
  celda: 11.40, // celda
  electrodos: 13.00, // electrodos
  gel: 13.82, // gel
  pila: 14.66, // pila
  entra: 15.88, // entra
  reacciona: 17.00, // reacciona
  agua: 18.22, // agua
  dioxido: 19.42, // dioxido
  soltando: 20.62, // soltando
  esos: 21.90, // esos
  corriente: 23.34, // corriente
  cuanto: 24.12, // cuanto
  mas: 24.38, // mas
  chip: 26.54, // chip
  alarma: 27.90, // alarma
  gas: 28.96, // gas
  tiempo: 30.32, // tiempo
  humo: 31.80, // humo
  particulas: 33.12, // particulas
  sin: 35.62, // sin
  pasaria: 36.62, // pasaria
  asi: 38.48, // asi
  fin: 39.80, // FIN
};

const ROJO_O = "#E04848";
const NEGRO_C = "#3A3A44";

// Molécula de CO (o CO2 si dos=true)
const Mol: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly dos?: boolean; readonly op?: number }> = ({ x, y, s = 1, dos = false, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    {dos ? <circle cx={-34} cy={0} r={22} fill={ROJO_O} /> : null}
    <circle cx={0} cy={0} r={24} fill={NEGRO_C} stroke="#6A6A78" strokeWidth={3} />
    <circle cx={34} cy={0} r={22} fill={ROJO_O} />
  </g>
);

const Detector: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly alarma?: number }> = ({ x, y, s = 1, alarma = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-230} width={340} height={460} rx={50} fill="#E8E8EE" />
    <rect x={-110} y={-170} width={220} height={90} rx={12} fill="#1A2A1A" />
    <Texto x={0} y={-112} size={50} color="#5AE07A">
      {alarma > 0.5 ? "150" : "0"}
    </Texto>
    {new Array(5).fill(0).map((_, k) => (
      <rect key={k} x={-100} y={-20 + k * 34} width={200} height={14} rx={7} fill="#B8B8C4" />
    ))}
    <circle cx={110} cy={180} r={18} fill={alarma > 0.5 ? C.red : "#5A3A3A"} />
    <Texto x={-30} y={194} size={30} color="#5A5A66">
      CO
    </Texto>
  </g>
);

// Gas invisible: siluetas punteadas que flotan
const Gas: React.FC<{ readonly t: number; readonly x: number; readonly y: number; readonly op?: number }> = ({ t, x, y, op = 1 }) => (
  <g opacity={op}>
    {new Array(6).fill(0).map((_, k) => {
      const u = (t * 0.25 + k / 6) % 1;
      return (
        <circle
          key={k}
          cx={x + Math.sin(k * 2 + t) * 120 + u * 120}
          cy={y - u * 300 + k * 30}
          r={50 + k * 8}
          fill="none"
          stroke="#8AA8C8"
          strokeWidth={4}
          strokeDasharray="10 14"
          opacity={0.6 * Math.sin(u * Math.PI)}
        />
      );
    })}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Detector x={620} y={950} s={1.1} />
    <Gas t={t} x={260} y={1000} />
    <Texto x={260} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo detecta este gas invisible?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.monoxido], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. CO: sin olor ni color, puede matarte dormido + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.monoxido, T.detector], [1, 1.04])}>
      <Mol x={540} y={760} s={3} op={aparece(t, T.monoxido)} />
      <Texto x={540} y={900} size={44} color={C.white} op={aparece(t, T.monoxido)}>
        monóxido de carbono (CO)
      </Texto>
      <Texto x={350} y={1040} size={40} color={C.grey} op={aparece(t, T.olor)}>
        olor: ✗
      </Texto>
      <Texto x={730} y={1040} size={40} color={C.grey} op={aparece(t, T.color)}>
        color: ✗
      </Texto>
      <Texto x={540} y={1160} size={42} color={C.red} op={aparece(t, T.matarte)}>
        mortal mientras duermes
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿y el detector de humo?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.detector], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Celda electroquímica: dos electrodos en gel
const Celda: React.FC<{ readonly t: number; readonly gel: number; readonly cable?: number }> = ({ gel, cable = 0 }) => (
  <g>
    <rect x={260} y={700} width={560} height={560} rx={30} fill="#2A2440" stroke="#6A5AA8" strokeWidth={6} />
    <rect x={280} y={720} width={520} height={520} rx={20} fill="#3A6A8A" opacity={0.5 * gel} />
    <rect x={330} y={680} width={60} height={540} rx={8} fill="#B8B8C4" />
    <rect x={690} y={680} width={60} height={540} rx={8} fill="#B8B8C4" />
    {cable > 0 ? (
      <path d="M 360 680 L 360 520 L 720 520 L 720 680" stroke={C.yellow} strokeWidth={10} fill="none" opacity={cable} />
    ) : null}
  </g>
);

// C. Celda electroquímica: dos electrodos en un gel, como una pila diminuta
export const CeldaEsc: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.detector, T.entra], [1, 1.04])}>
      <g opacity={aparece(t, T.celda)}>
        <Celda t={t} gel={aparece(t, T.gel)} />
      </g>
      <Texto x={540} y={600} size={42} color={C.yellow} op={aparece(t, T.celda)}>
        celda electroquímica
      </Texto>
      <Texto x={360} y={1320} size={34} color={C.white} op={aparece(t, T.electrodos)}>
        electrodo
      </Texto>
      <Texto x={720} y={1320} size={34} color={C.white} op={aparece(t, T.electrodos)}>
        electrodo
      </Texto>
      <Texto x={540} y={990} size={36} color={C.cyan} op={aparece(t, T.gel)}>
        gel
      </Texto>
      <Texto x={540} y={1420} size={38} color={C.white} op={aparece(t, T.pila)}>
        como una pila diminuta 🔋
      </Texto>
    </Lienzo>
  );
};

// D. Entra CO, reacciona con agua en un electrodo → CO2 + electrones
export const Reaccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const llega = interpolate(t, [T.entra, T.reacciona], [0, 1], clamp);
  const conv = aparece(t, T.dioxido);
  const e = aparece(t, T.soltando);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.entra, T.esos], [1, 1.04])}>
        <Celda t={t} gel={1} />
        <Mol x={170 + llega * 230} y={860} s={1.6} op={1 - conv} />
        <g opacity={aparece(t, T.agua) * (1 - conv)}>
          <circle cx={480} cy={960} r={22} fill={ROJO_O} />
          <circle cx={456} cy={985} r={13} fill="#fff" />
          <circle cx={504} cy={985} r={13} fill="#fff" />
          <Texto x={560} y={1040} size={30} color={C.cyan}>
            H₂O
          </Texto>
        </g>
        <Mol x={470 + conv * 40} y={860 - conv * 260} s={1.6} dos op={conv} />
        <Texto x={560} y={560} size={36} color={C.white} op={conv}>
          CO₂
        </Texto>
        {new Array(4).fill(0).map((_, k) => {
          const u = (t * 0.8 + k / 4) % 1;
          return (
            <g key={k} opacity={e}>
              <circle cx={360} cy={1120 - u * 400} r={16} fill={C.yellow} />
              <Texto x={360} y={1128 - u * 400} size={20} color="#111">
                e⁻
              </Texto>
            </g>
          );
        })}
        <Texto x={540} y={1420} size={40} color={C.yellow} op={e}>
          suelta electrones
        </Texto>
        <Texto x={540} y={1500} size={32} color={C.grey} op={aparece(t, T.agua)}>
          CO + H₂O → CO₂ + 2H⁺ + 2e⁻
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.soltando} color={C.yellow} />
    </>
  );
};

// E. Los electrones generan corriente: más CO, más corriente
export const Corriente: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nivel = 0.3 + 0.6 * interpolate(t, [T.cuanto, T.chip], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.esos, T.chip], [1, 1.04])}>
      <Celda t={t} gel={1} cable={1} />
      {new Array(8).fill(0).map((_, k) => {
        const u = (t * nivel * 1.2 + k / 8) % 1;
        const L = 160 + 360 + 160;
        const d = u * L;
        const [x, y] = d < 160 ? [360, 680 - d] : d < 520 ? [360 + (d - 160), 520] : [720, 520 + (d - 520)];
        return <circle key={k} cx={x} cy={y} r={14} fill={C.yellow} opacity={aparece(t, T.corriente)} />;
      })}
      {new Array(Math.round(nivel * 10)).fill(0).map((_, k) => (
        <Mol key={k} x={170 + (k % 2) * 30} y={760 + k * 50} s={0.9} op={aparece(t, T.cuanto)} />
      ))}
      <rect x={880} y={700} width={60} height={560} rx={12} fill="#2A2440" opacity={aparece(t, T.corriente)} />
      <rect x={880} y={700 + 560 * (1 - nivel)} width={60} height={560 * nivel} rx={12} fill={C.yellow} opacity={aparece(t, T.corriente)} />
      <Texto x={540} y={450} size={40} color={C.yellow} op={aparece(t, T.corriente)}>
        corriente eléctrica
      </Texto>
      <Texto x={540} y={1400} size={38} color={C.white} op={aparece(t, T.mas)}>
        más CO = más corriente
      </Texto>
    </Lienzo>
  );
};

// F. Un chip la mide y suena la alarma según cuánto gas y durante cuánto tiempo
export const Chip: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const al = t > T.alarma && Math.sin(t * 14) > 0 ? 1 : 0;
  const prog = interpolate(t, [T.gas, T.tiempo + 0.5], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.chip, T.humo], [1, 1.04])}>
      <Detector x={540} y={720} s={0.75} alarma={al} />
      <g opacity={aparece(t, T.gas)}>
        <line x1={200} y1={1440} x2={900} y2={1440} stroke={C.grey} strokeWidth={4} />
        <line x1={200} y1={1440} x2={200} y2={1060} stroke={C.grey} strokeWidth={4} />
        <path
          d={`M 200 1400 ${new Array(30)
            .fill(0)
            .map((_, k) => `L ${200 + (k / 29) * 700 * prog} ${1400 - Math.min(1, (k / 29) * prog * 1.6) * 260}`)
            .join(" ")}`}
          stroke={C.red}
          strokeWidth={8}
          fill="none"
        />
        <Texto x={150} y={1060} size={28} color={C.grey}>
          CO
        </Texto>
        <Texto x={880} y={1490} size={28} color={C.grey} op={aparece(t, T.tiempo)}>
          tiempo
        </Texto>
      </g>
      <Texto x={540} y={1040} size={38} color={C.red} op={aparece(t, T.alarma)}>
        ¡alarma!
      </Texto>
    </Lienzo>
  );
};

// G. El detector de humo busca partículas; el CO no tiene: pasaría sin ser visto
export const Humo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.humo, T.asi], [1, 1.04])}>
      <circle cx={540} cy={560} r={170} fill="#E8E8EE" />
      <circle cx={540} cy={560} r={110} fill="#C8C8D4" />
      <circle cx={600} cy={500} r={14} fill={C.red} opacity={0.5} />
      <Texto x={540} y={790} size={36} color={C.white}>
        detector de humo
      </Texto>
      <g opacity={aparece(t, T.particulas) * (1 - aparece(t, T.sin))}>
        {new Array(24).fill(0).map((_, k) => {
          const u = (t * 0.5 + k / 24) % 1;
          return <circle key={k} cx={300 + ((k * 97) % 480)} cy={1300 - u * 500} r={8 + (k % 3) * 4} fill="#8A8A96" />;
        })}
        <Texto x={540} y={1400} size={38} color={C.grey}>
          busca partículas
        </Texto>
      </g>
      <g opacity={aparece(t, T.sin)}>
        {new Array(8).fill(0).map((_, k) => {
          const u = (t * 0.5 + k / 8) % 1;
          return <Mol key={k} x={300 + ((k * 137) % 480)} y={1300 - u * 500} s={0.9} op={0.8} />;
        })}
        <Texto x={540} y={1400} size={38} color={C.cyan}>
          CO: gas sin partículas
        </Texto>
      </g>
      <Texto x={540} y={1480} size={38} color={C.red} op={aparece(t, T.pasaria)}>
        pasaría sin ser visto
      </Texto>
    </Lienzo>
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
