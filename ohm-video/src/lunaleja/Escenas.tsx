import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/lunaleja/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  cada: 1.64, // cada
  aleja: 2.52, // aleja
  final: 4.82, // final
  gravedad: 8.64, // gravedad
  estira: 9.48, // estira
  abult: 11.44, // abult
  mareas: 12.70, // mareas
  pero: 13.46, // pero
  gira: 14.08, // gira
  arrastra: 16.90, // arrastra
  delante: 18.84, // delante
  adelantado: 20.38, // adelantado
  tira: 20.92, // tira
  energia: 22.86, // energia
  alta: 25.00, // alta
  cambio: 25.80, // cambio
  roce: 26.46, // roce
  frena: 27.42, // frena
  alargan: 29.42, // alargan
  milisegundos: 30.36, // milisegundos
  cuatrocientos: 32.18, // cuatrocientos
  veintidos: 35.20, // veintidos
  porEso: 36.46, // por
  fin: 38.00, // FIN
};

const OCEANO = "#2A6AC8";
const CX = 540;
const CY = 900;

// Tierra vista desde el polo: giro en grados; bulto = abultamiento de mareas (0-1) orientado a angB
const Tierra: React.FC<{ readonly giro: number; readonly bulto: number; readonly angB: number }> = ({ giro, bulto, angB }) => (
  <g>
    <ellipse cx={CX} cy={CY} rx={130 + 60 * bulto} ry={130} fill="#6AB8F8" opacity={0.45 * bulto} transform={`rotate(${angB} ${CX} ${CY})`} />
    <circle cx={CX} cy={CY} r={120} fill={OCEANO} />
    <g transform={`rotate(${giro} ${CX} ${CY})`}>
      <path d={`M ${CX - 60} ${CY - 70} q 40 -30 80 0 q 20 40 -20 60 q -50 10 -60 -60 Z`} fill="#3AA86A" />
      <path d={`M ${CX + 20} ${CY + 30} q 50 0 60 40 q -30 40 -70 10 Z`} fill="#3AA86A" />
      <path d={`M ${CX - 90} ${CY + 40} q 20 -10 30 20 q -10 20 -30 -20 Z`} fill="#3AA86A" />
    </g>
  </g>
);

const Luna: React.FC<{ readonly ang: number; readonly r: number }> = ({ ang, r }) => {
  const a = (ang * Math.PI) / 180;
  return (
    <g>
      <circle cx={CX} cy={CY} r={r} fill="none" stroke={C.grey} strokeWidth={3} strokeDasharray="10 12" opacity={0.6} />
      <circle cx={CX + Math.cos(a) * r} cy={CY + Math.sin(a) * r} r={44} fill="#C8C4D0" />
      <circle cx={CX + Math.cos(a) * r - 12} cy={CY + Math.sin(a) * r - 10} r={10} fill="#A8A4B0" />
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Tierra giro={t * 40} bulto={0} angB={0} />
    <Luna ang={-30} r={380} />
    <path d={`M ${CX + 380 * Math.cos(-0.52) + 60} ${CY + 380 * Math.sin(-0.52) - 30} l 80 -40 m -30 0 l 30 0 l -10 28`} stroke={C.yellow} strokeWidth={8} fill="none" opacity={q} />
    <Texto x={540} y={1450} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué la Luna se nos escapa?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cada], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.white} />
    </>
  );
};

// B. Cada año se aleja casi cuatro centímetros + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const r = interpolate(t, [T.aleja, T.gravedad], [380, 420], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cada, T.gravedad], [1, 1.04])}>
      <Tierra giro={t * 40} bulto={0} angB={0} />
      <Luna ang={-30 + (t - T.cada) * 8} r={r} />
      <g opacity={aparece(t, T.aleja)}>
        <rect x={290} y={1360} width={500} height={110} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
        <Texto x={540} y={1435} size={50} color={C.yellow}>
          +3,8 cm/año
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={430} size={34} color={C.white}>
          ¿cuánto duraba un día? al final
        </Texto>
        <rect x={290} y={455} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={455} width={500 * interpolate(t, [T.final, T.gravedad], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. La gravedad de la Luna estira los océanos: dos abultamientos, las mareas
export const Mareas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.gravedad, T.pero], [1, 1.04])}>
      <Tierra giro={t * 40} bulto={interpolate(t, [T.estira, T.abult + 0.5], [0, 1], clamp)} angB={0} />
      <Luna ang={0} r={400} />
      <path d={`M ${CX + 340} ${CY} L ${CX + 220} ${CY}`} stroke={C.white} strokeWidth={6} opacity={aparece(t, T.gravedad)} />
      <Texto x={540} y={1400} size={44} color="#6AB8F8" op={aparece(t, T.mareas)}>
        dos abultamientos: mareas
      </Texto>
    </Lienzo>
  );
};

// D. La Tierra gira más rápido y arrastra los bultos por delante de la Luna
export const Arrastra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const adel = interpolate(t, [T.arrastra, T.delante + 0.4], [0, 25], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.tira], [1, 1.04])}>
      <Tierra giro={t * 120} bulto={1} angB={adel} />
      <Luna ang={0} r={400} />
      <g opacity={aparece(t, T.gira)}>
        <path d={`M ${CX - 160} ${CY} A 160 160 0 0 1 ${CX} ${CY - 160}`} stroke={C.yellow} strokeWidth={8} fill="none" />
        <path d={`M ${CX} ${CY - 160} l -26 -14 l 6 28 Z`} fill={C.yellow} />
        <Texto x={300} y={640} size={34} color={C.yellow}>
          gira rápido
        </Texto>
      </g>
      <Texto x={540} y={1400} size={40} color="#6AB8F8" op={aparece(t, T.delante)}>
        el bulto va por delante
      </Texto>
    </Lienzo>
  );
};

// E. El bulto adelantado tira de la Luna hacia adelante y la sube a una órbita más alta
export const Tira: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const r = interpolate(t, [T.energia, T.alta + 0.6], [400, 470], clamp);
  const ang = (t - T.tira) * 10;
  const a = (ang * Math.PI) / 180;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.adelantado, T.cambio], [1, 1.04])}>
        <Tierra giro={t * 120} bulto={1} angB={25 + ang} />
        <Luna ang={ang} r={r} />
        <g opacity={aparece(t, T.tira)}>
          <path d={`M ${CX + Math.cos(a) * r} ${CY + Math.sin(a) * r} l ${-Math.sin(a) * 110} ${Math.cos(a) * 110}`} stroke={C.yellow} strokeWidth={10} />
          <Texto x={540} y={560} size={36} color={C.yellow}>
            tirón hacia adelante
          </Texto>
        </g>
        <Texto x={540} y={1400} size={40} color={C.white} op={aparece(t, T.alta)}>
          órbita más alta
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.alta} color={C.white} />
    </>
  );
};

// F. El roce de las mareas frena a la Tierra: los días se alargan
export const Frena: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vel = interpolate(t, [T.frena, T.alargan], [120, 50], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cambio, T.cuatrocientos], [1, 1.04])}>
      <Tierra giro={t * vel} bulto={1} angB={25} />
      <Luna ang={0} r={470} />
      <g opacity={aparece(t, T.roce)}>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${CX + 150 + k * 10} ${CY - 60 + k * 50} l 20 -10`} stroke={C.red} strokeWidth={6} />
        ))}
        <Texto x={540} y={600} size={36} color={C.red}>
          roce de las mareas
        </Texto>
      </g>
      <g opacity={aparece(t, T.alargan)}>
        <rect x={240} y={1340} width={600} height={140} rx={24} fill={C.card} stroke={C.yellow} strokeWidth={4} />
        <Texto x={540} y={1400} size={34} color={C.white}>
          cada siglo, el día dura
        </Texto>
        <Texto x={540} y={1455} size={40} color={C.yellow}>
          ~2 milisegundos más
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Hace 400 millones de años, un día duraba unas 22 horas
export const Pasado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const h = Math.round(interpolate(t, [T.cuatrocientos, T.veintidos + 0.4], [24, 22], clamp));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cuatrocientos, T.porEso], [1, 1.04])}>
        <g transform="translate(540 820)">
          <circle cx={0} cy={0} r={200} fill={C.card} stroke={C.white} strokeWidth={10} />
          {new Array(12).fill(0).map((_, k) => (
            <line key={k} x1={0} y1={-170} x2={0} y2={-190} stroke={C.white} strokeWidth={6} transform={`rotate(${k * 30})`} />
          ))}
          <line x1={0} y1={0} x2={0} y2={-150} stroke={C.yellow} strokeWidth={10} strokeLinecap="round" transform={`rotate(${t * 200})`} />
        </g>
        <Texto x={540} y={1160} size={36} color={C.grey} op={aparece(t, T.cuatrocientos)}>
          hace 400 millones de años
        </Texto>
        <Texto x={540} y={1300} size={90} color={C.yellow} op={aparece(t, T.cuatrocientos)}>
          {`día = ${h} h`}
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.veintidos} color={C.yellow} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
